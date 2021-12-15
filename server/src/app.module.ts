import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WowEventModule } from './wow-event/wow-event.module';
import { WowEventController } from './wow-event/wow-event.controller';

@Module({
  imports: [TypeOrmModule.forRoot(), WowEventModule],
  controllers: [AppController, WowEventController],
  providers: [AppService],
})
export class AppModule {}
