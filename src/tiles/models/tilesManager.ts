import { BadRequestError, NotFoundError } from '@map-colonies/error-types';
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
  public async getTilesCount(layerId: string, target: string): Promise<ITilesCountResponse> {
    const query = `SELECT "tilesCount" FROM "TilesCounter" WHERE "layerId"=$1 AND "target"=$2`;
    const values = [layerId, target];
    const result = await this.pgClient.execute<ITilesCountResponse>(query, values);
    // throw not-found error if the query result is an empty array which means layer id is not exists.
    if (result.length === 0) {
      throw new NotFoundError(`layer id: "${layerId}" for target "${target}" is not exists`);
    }
    const data = result[0];
    return data;
  }

  public async upsertTilesCount(layerId: string, target: string, tilesBatchCount: number): Promise<void> {
    this.logger.info(`updating tiles batch count for layerId: '${layerId}' and target: '${target}' in database by ${tilesBatchCount} tiles`);
    const query = `INSERT INTO "TilesCounter" ("tilesCount", "layerId", "target")
      VALUES ($1, $2, $3)
      ON CONFLICT ("layerId","target") DO UPDATE SET "tilesCount" = "TilesCounter"."tilesCount" + $1`;
    const values = [tilesBatchCount, layerId, target];
    try {
      await this.pgClient.execute(query, values);
    } catch (err) {
      const error = err as Error;
      if (error.message.includes('Invalid tiles count (negative value)')) {
        const errorMessage = `layerId: ${layerId}, target: ${target}, failed to update tiles batch count because total tiles where negative, inner message: ${error.message}`;
        this.logger.error(errorMessage);
        throw new BadRequestError(errorMessage);
      } else {
        throw err;
      }
    }
  }
}
