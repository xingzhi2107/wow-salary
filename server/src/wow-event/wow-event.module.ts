import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { WowEventEntity } from './wow-event.entity';
import { WowEventService } from './wow-event.service';
import { WowEventController } from './wow-event.controller';

@Module({
  imports: [TypeOrmModule.forFeature([WowEventEntity])],
  providers: [WowEventService],
  exports: [WowEventService],
  controllers: [WowEventController],
})
export class WowEventModule {}
