import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { AppDataSource } from '../data-source';
import { User } from '../entity/user';
import { Role } from '../entity/role';

export const register = async ({ full_name, email, password }: { full_name: string, email: string, password: string }) => {
    // Kiểm tra xem email đã tồn tại chưa
    const existingUser = await AppDataSource.getRepository(User).findOne({ where: { email } });
    if (existingUser) {
        throw new Error('Email already exists');
    }

    // Tạo user_name bằng cách loại bỏ khoảng trắng và chuyển thành chữ thường từ full_name
    const user_name = full_name.trim().replace(/\s+/g, '').toLowerCase();

    // Băm mật khẩu
    const hashedPassword = await bcrypt.hash(password, 10);

    // Tạo user mới với full_name, user_name, email và mật khẩu đã băm
    const newUser = AppDataSource.getRepository(User).create({
        full_name,
        user_name,
        email,
        password: hashedPassword  ,
        is_active: 1

    });
    // Lưu user vào cơ sở dữ liệu
    await AppDataSource.getRepository(User).save(newUser);

    // Tạo một role mới với user_name và role là ROLE_USER
    const newRole = AppDataSource.getRepository(Role).create({
        user_name: user_name,
        role: 'ROLE_USER'
    });

    
    // Lưu role vào cơ sở dữ liệu
    await AppDataSource.getRepository(Role).save(newRole);

    return {
        id: newUser.id,
        full_name: newUser.full_name,
        user_name: newUser.user_name,
        email: newUser.email
    }; // Trả về thông tin cơ bản của user
};



export const login = async ({ email, password }: { email: string, password: string }) => {
  // Tìm người dùng bằng email
  const user = await AppDataSource.getRepository(User).findOne({ where: { email } });

  if (!user) {
    throw new Error("User not found");
  }

  // Kiểm tra mật khẩu
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new Error("Invalid Password");
  }

  // Tạo token JWT
  const token = jwt.sign({ id: user.id, username: user.email }, 'your_jwt_secret', { expiresIn: '24h' });

  return { token };
};
export const changePassword = async ( oldPassword:string, newPassword:string, confirmNewPassword: string, userId: number ) => {
  // Kiểm tra mật khẩu mới và xác nhận mật khẩu mới
  if (newPassword !== confirmNewPassword) {
      throw new Error("New password and confirm password do not match");
  }

  // Tìm người dùng bằng userId
  const user = await AppDataSource.getRepository(User).findOne({ where: { id: userId } });
  if (!user) {
      throw new Error("User not found");
  }

  // Kiểm tra mật khẩu cũ
  const isOldPasswordValid = await bcrypt.compare(oldPassword, user.password);
  if (!isOldPasswordValid) {
      throw new Error("Old password is incorrect");
  }
  
  // Băm mật khẩu mới
  const hashedNewPassword = await bcrypt.hash(newPassword, 10);

  // Cập nhật mật khẩu mới vào cơ sở dữ liệu
  user.password = hashedNewPassword;
  await AppDataSource.getRepository(User).save(user);

  return { message: "Password changed successfully" }; // Trả về thông báo thành công
};
