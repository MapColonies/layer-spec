import jsLogger from '@map-colonies/js-logger';
import { trace } from '@opentelemetry/api';
import httpStatusCodes from 'http-status-codes';
import { container } from 'tsyringe';
import { getApp } from '../../../src/app';
import { Services } from '../../../src/common/constants';
import { ITilesCountResponse } from '../../../src/tiles/models/tilesManager';
import { PgClient } from '../../../src/clients/pgClient';
import { TilesRequestSender } from './helpers/tilesRequestSender';

describe('tiles', function () {
  let requestSender: TilesRequestSender;
  let executeSpy: jest.SpyInstance;
  beforeEach(function () {
    const app = getApp({
      override: [
        { token: Services.LOGGER, provider: { useValue: jsLogger({ enabled: false }) } },
        { token: Services.TRACER, provider: { useValue: trace.getTracer('testTracer') } },
      ],
      useChild: true,
    });
    requestSender = new TilesRequestSender(app);
    executeSpy = jest.spyOn(PgClient.prototype, 'execute');
  });

  afterEach(function () {
    container.clearInstances();
    jest.resetAllMocks();
  });

  describe('Happy Path', function () {
    it('should return 200 status code and the tiles count by layer id', async function () {
      const queryResult = [
        {
          tilesCount: 5,
        },
      ];
      executeSpy.mockResolvedValue(queryResult);
      const layerId = '4fb83dba-d67d-41dc-b12f-2bfafb2790e1';
      const response = await requestSender.getTilesCount(layerId);

      expect(response.status).toBe(httpStatusCodes.OK);

      const resource = response.body as ITilesCountResponse;
      expect(resource.tilesCount).toEqual(5);
      expect(executeSpy).toHaveBeenCalledTimes(1);
    });

    it('should return 201 status code and upsert the resource by layer id', async function () {
      const layerId = '4fb83dba-d67d-41dc-b12f-2bfafb2790e1';
      const body = {
        tilesBatchCount: 5,
      };
      const response = await requestSender.upsertTilesCount(layerId, body);

      expect(response.status).toBe(httpStatusCodes.CREATED);
      expect(executeSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('Bad Path', function () {
    it('should return 400 status code on PUT request with invalid body', async function () {
      const layerId = '4fb83dba-d67d-41dc-b12f-2bfafb2790e1';
      const invalidBody = {
        invalidField: 'test',
      };
      const response = await requestSender.upsertTilesCount(layerId, invalidBody);

      expect(response.status).toBe(httpStatusCodes.BAD_REQUEST);
      expect(executeSpy).toHaveBeenCalledTimes(0);
    });
  });

  describe('Sad Path', function () {
    it('should return 404 status code on GET request with empty query result', async function () {
      const queryResult: unknown = [];
      executeSpy.mockResolvedValue(queryResult);
      const layerId = '4fb83dba-d67d-41dc-b12f-2bfafb2790e1';
      const response = await requestSender.getTilesCount(layerId);

      expect(response.status).toBe(httpStatusCodes.NOT_FOUND);
      expect(executeSpy).toHaveBeenCalledTimes(1);
    });
  });
});
