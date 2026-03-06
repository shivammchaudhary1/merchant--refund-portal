export interface EnvironmentConfig {
  MONGO_URI: string;
  PORT: number;
  JWT_SECRET: string;
  JWT_EXPIRES_IN: string;
}

export interface IServerConfig {
  port: number;
  env: string;
}
