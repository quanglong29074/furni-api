import { AppDataSource } from "../data-source";
import { Notification } from "../entity/notification";

export const getNotificationsByUserId = async (userId: number) => {
  const notificationRepository = AppDataSource.getRepository(Notification);

  // Truy vấn trực tiếp bảng notifications
  const notifications = await notificationRepository
    .createQueryBuilder("notification")
    .where("notification.user_id = :userId", { userId })
    .orderBy("notification.created_at", "DESC")
    .getMany();

  return notifications;
};
