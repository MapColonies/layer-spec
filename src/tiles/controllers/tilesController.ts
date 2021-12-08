import { Meter } from '@map-colonies/telemetry';
import { BoundCounter } from '@opentelemetry/api-metrics';
import { RequestHandler } from 'express';
import httpStatus from 'http-status-codes';
import { injectable, inject } from 'tsyringe';
import { Services } from '../../common/constants';

import { ITilesCountRequest, ITilesCountResponse, TilesManager } from '../models/tilesManager';

interface ICounterIdentifier {
  layerId: string;
  target:string;
}
type GetTilesCountHandler = RequestHandler<ICounterIdentifier, ITilesCountResponse, ITilesCountResponse>;
type UpdateTilesCountHandler = RequestHandler<ICounterIdentifier, ITilesCountRequest, ITilesCountRequest>;

@injectable()
export class TilesController {
  private readonly createdResourceCounter: BoundCounter;

  public constructor(@inject(TilesManager) private readonly manager: TilesManager, @inject(Services.METER) private readonly meter: Meter) {
    this.createdResourceCounter = meter.createCounter('upserted tiles count');
  }

  public getTilesCount: GetTilesCountHandler = async (req, res, next) => {
    try {
      const layerId = req.params.layerId;
      const target = req.params.target;
      return res.status(httpStatus.OK).json(await this.manager.getTilesCount(layerId,target));
    } catch (error) {
      next(error);
    }
  };

  public upsertTilesCount: UpdateTilesCountHandler = async (req, res, next) => {
    try {
      await this.manager.upsertTilesCount(req.params.layerId, req.params.target, req.body.tilesBatchCount);
      this.createdResourceCounter.add(1);
      res.sendStatus(httpStatus.CREATED);
    } catch (error) {
      next(error);
    }
  };
}
