import { error } from 'elysia';
import jwt, { JwtPayload } from 'jsonwebtoken';

export const isAuthenticated  = (token: string | undefined) => {
    interface JwtPayloadWithId extends JwtPayload {
        id: string;
      }
  if (!token) {
    throw error(403, 'Unauthorized');
  }

  const jwtToken = token.split(' ')[1];
  const decoded = jwt.verify(jwtToken, 'your_jwt_secret') as JwtPayloadWithId;
  return decoded;
};
