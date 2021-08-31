import * as supertest from 'supertest';

export class TilesRequestSender {
  public constructor(private readonly app: Express.Application) {}

  public async getTilesCount(layerId: string): Promise<supertest.Response> {
    return supertest.agent(this.app).get(`/tilesCount/${layerId}`).set('Content-Type', 'application/json');
  }

  public async upsertTilesCount(layerId: string, body: Record<string, unknown>): Promise<supertest.Response> {
    return supertest.agent(this.app).put(`/tilesCount/${layerId}`).set('Content-Type', 'application/json').send(body);
  }
}
