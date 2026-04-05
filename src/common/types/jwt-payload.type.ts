import { Role } from '@prisma/client/index';

export interface JwtPayload {
  sub: string;
  email: string;
  role: Role;
  iat?: number;
  exp?: number;
}

export interface JwtRefreshPayload extends JwtPayload {
  refreshToken?: string;
}

export interface RequestUser {
  id: string;
  email: string;
  role: Role;
}

