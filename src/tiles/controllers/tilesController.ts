import { Meter } from '@map-colonies/telemetry';
import { BoundCounter } from '@opentelemetry/api-metrics';
import { RequestHandler } from 'express';
import httpStatus from 'http-status-codes';
import { injectable, inject } from 'tsyringe';
import { Services } from '../../common/constants';

import { ITilesCountRequest, ITilesCountResponse, TilesManager } from '../models/tilesManager';

type GetTilesCountHandler = RequestHandler<{ layerId: string }, ITilesCountResponse, ITilesCountResponse>;
type UpdateTilesCountHandler = RequestHandler<{ layerId: string }, ITilesCountRequest, ITilesCountRequest>;

@injectable()
export class TilesController {
  private readonly createdResourceCounter: BoundCounter;

  public constructor(@inject(TilesManager) private readonly manager: TilesManager, @inject(Services.METER) private readonly meter: Meter) {
    this.createdResourceCounter = meter.createCounter('created_resource');
  }

  public getTilesCount: GetTilesCountHandler = async (req, res, next) => {
    try {
      const layerId = req.params.layerId;
      return res.status(httpStatus.OK).json(await this.manager.getTilesCount(layerId));
    } catch (error) {
      next(error);
    }
  };

  public upsertTilesCount: UpdateTilesCountHandler = async (req, res, next) => {
    try {
      await this.manager.upsertTilesCount(req.params.layerId, req.body.tilesBatchCount);
      this.createdResourceCounter.add(1);
      res.sendStatus(httpStatus.CREATED);
    } catch (error) {
      next(error);
    }
  };
}
