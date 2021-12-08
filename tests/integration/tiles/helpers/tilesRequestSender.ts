import * as supertest from 'supertest';

export class TilesRequestSender {
  public constructor(private readonly app: Express.Application) {}

  public async getTilesCount(layerId: string, target: string): Promise<supertest.Response> {
    return supertest.agent(this.app).get(`/tilesCount/${layerId}/${target}`).set('Content-Type', 'application/json');
  }

  public async upsertTilesCount(layerId: string, target: string, body: Record<string, unknown>): Promise<supertest.Response> {
    return supertest.agent(this.app).put(`/tilesCount/${layerId}/${target}`).set('Content-Type', 'application/json').send(body);
  }
}
