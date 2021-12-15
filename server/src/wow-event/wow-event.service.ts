import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';

import { WowEventEntity } from './wow-event.entity';

@Injectable()
export class WowEventService extends TypeOrmCrudService<WowEventEntity> {
  constructor(@InjectRepository(WowEventEntity) repo) {
    super(repo);
  }
}
