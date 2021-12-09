import { Router } from 'express';
import { FactoryFunction } from 'tsyringe';
import { TilesController } from '../controllers/tilesController';

const tilesRouterFactory: FactoryFunction<Router> = (dependencyContainer) => {
  const router = Router();
  const controller = dependencyContainer.resolve(TilesController);

  router.get('/tilesCount/:layerId/:target', controller.getTilesCount);
  router.put('/tilesCount/:layerId/:target', controller.upsertTilesCount);

  return router;
};

export const TILES_ROUTER_SYMBOL = Symbol('tilesRouterFactory');

export { tilesRouterFactory };
