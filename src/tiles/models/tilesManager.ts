import { Logger } from '@map-colonies/js-logger';
import { inject, injectable } from 'tsyringe';
import { PgClient } from '../../clients/pgClient';
import { Services } from '../../common/constants';
import { IDBConfig } from '../../common/interfaces';

export interface ITilesCountResponse {
  tilesCount: number;
}

export interface ITilesCountRequest {
  tilesBatchCount: number;
  layerId: string;
}

@injectable()
export class TilesManager {
  public constructor(
    @inject(Services.LOGGER) private readonly logger: Logger,
    @inject(Services.DB_CONFIG) private readonly dbConfig: IDBConfig,
    private readonly pgClient: PgClient
  ) {
    this.logger = logger;
  }
  public async getTilesCount(layerId: string): Promise<ITilesCountResponse> {
    try {
      const query = `SELECT "tilesCount" FROM "TilesCounter" WHERE "layerId"='${layerId}'`;
      const result = await this.pgClient.execute<ITilesCountResponse>(query);
      const data = result[0];
      return data;
    } catch (error) {
      throw new Error(error);
    }
  }

  public async upsertTilesCount(layerId: string, tilesBatchCount: number): Promise<void> {
    try {
      const query = `INSERT INTO "TilesCounter" ("tilesCount", "layerId") 
      VALUES (${tilesBatchCount}, '${layerId}') 
      ON CONFLICT ("layerId") DO UPDATE SET "tilesCount" = "TilesCounter"."tilesCount" + ${tilesBatchCount}`;
      await this.pgClient.execute(query);
      this.logger.info(`tiles batch count for layerId: '${layerId}' updated successfully`);
    } catch (error) {
      throw new Error(error);
    }
  }
}
