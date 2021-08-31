export interface IConfig {
  get: <T>(setting: string) => T;
  has: (setting: string) => boolean;
}

export interface OpenApiConfig {
  filePath: string;
  basePath: string;
  jsonPath: string;
  uiPath: string;
}

export interface IDBColumns {
  id: number;
  tilesCount: number;
  layerId: number;
}

export interface IDBConfig {
  host: string;
  user: string;
  database: string;
  password: string;
  port: number;
  table: string;
  columns: IDBColumns;
  sslEnabled: boolean;
  rejectUnauthorized: boolean;
  sslPaths: {
    ca: string;
    key: string;
    cert: string;
  };
}
