export interface JwtPayload {
  userId: string;
  role: string;
}

export interface JwtOptions {
  expiresIn?: string;
}

export interface DecodedJwtPayload extends JwtPayload {
  iat?: number;
  exp?: number;
}
