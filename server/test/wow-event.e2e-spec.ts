import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { WowEventModule } from './../src/wow-event/wow-event.module';

describe('WowEventController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [WowEventModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('Create, POST /wow-event', () => {
    const event = {
      creatorId: 1,
      wclId: 'fakewclid',
      title: 'test title',
      totalEquipmentIncome: 32843,
    };
    return request(app.getHttpServer())
      .post('/wow-event')
      .send(event)
      .expect(200);
  });
});
