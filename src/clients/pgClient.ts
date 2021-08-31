import { readFileSync } from 'fs';
import { Pool, PoolConfig } from 'pg';
import { inject, singleton } from 'tsyringe';
import { Services } from '../common/constants';
import { IDBConfig } from '../common/interfaces';

@singleton()
export class PgClient {
  private readonly pool: Pool;
  private readonly pgConfig: PoolConfig;

  public constructor(@inject(Services.DB_CONFIG) private readonly dbConfig: IDBConfig) {
    this.pgConfig = {
      host: this.dbConfig.host,
      user: this.dbConfig.user,
      database: this.dbConfig.database,
      password: this.dbConfig.password,
      port: this.dbConfig.port,
    };
    if (dbConfig.sslEnabled) {
      this.pgConfig.ssl = {
        rejectUnauthorized: dbConfig.rejectUnauthorized,
        key: readFileSync(dbConfig.sslPaths.key),
        cert: readFileSync(dbConfig.sslPaths.cert),
        ca: readFileSync(dbConfig.sslPaths.ca),
      };
    }
    this.pool = new Pool(this.pgConfig);
  }

  public async execute<T>(query: string, values?: unknown[]): Promise<T[]> {
    const client = await this.pool.connect();
    try {
      const queryResult = await client.query<T>(query, values);
      return queryResult.rows;
    } catch (error) {
      throw new Error(error);
    } finally {
      client.release();
    }
  }
}
