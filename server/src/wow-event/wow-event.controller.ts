import { Controller } from '@nestjs/common';
import { Crud, CrudController } from '@nestjsx/crud';

import { WowEventEntity } from './wow-event.entity';
import { WowEventService } from './wow-event.service';

@Crud({
  model: {
    type: WowEventEntity,
  },
})
@Controller('wow-event')
export class WowEventController implements CrudController<WowEventEntity> {
  constructor(public service: WowEventService) {}
}
