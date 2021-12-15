import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { QuerySimpleListIdsDto } from './common.dto';

export const ParseSimpleListQuery = createParamDecorator(
  (key: any, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest<Request>();
    const listQuery = new QuerySimpleListIdsDto(req.query);
    if (key) {
      return listQuery[key];
    } else {
      return listQuery;
    }
  },
);
