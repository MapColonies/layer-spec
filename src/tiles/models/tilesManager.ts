import { NotFoundError } from '@map-colonies/error-types';
import { Logger } from '@map-colonies/js-logger';
import { inject, injectable } from 'tsyringe';
import { PgClient } from '../../clients/pgClient';
import { Services } from '../../common/constants';

export interface ITilesCountResponse {
  tilesCount: number;
}

export interface ITilesCountRequest {
  tilesBatchCount: number;
  layerId: string;
}

@injectable()
export class TilesManager {
  public constructor(@inject(Services.LOGGER) private readonly logger: Logger, private readonly pgClient: PgClient) {
    this.logger = logger;
  }
  public async getTilesCount(layerId: string): Promise<ITilesCountResponse> {
    const query = `SELECT "tilesCount" FROM "TilesCounter" WHERE "layerId"=$1`;
    const values = [layerId];
    const result = await this.pgClient.execute<ITilesCountResponse>(query, values);
    // throw not-found error if the query result is an empty array which means layer id is not exists.
    if (result.length === 0) {
      throw new NotFoundError(`layer id: "${layerId}" is not exists`);
    }
    const data = result[0];
    return data;
  }

  public async upsertTilesCount(layerId: string, tilesBatchCount: number): Promise<void> {
    this.logger.info(`updating tiles batch count for layerId: '${layerId}' in database with ${tilesBatchCount} tiles`);
    const query = `INSERT INTO "TilesCounter" ("tilesCount", "layerId")
      VALUES ($1, $2)
      ON CONFLICT ("layerId") DO UPDATE SET "tilesCount" = "TilesCounter"."tilesCount" + $1`;
    const values = [tilesBatchCount, layerId];
    await this.pgClient.execute(query, values);
  }
}
