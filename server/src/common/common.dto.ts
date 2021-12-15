export class FetchSimpleListEntitiesDto {
  ids: number[];

  cols: string[];
}

export class QuerySimpleListIdsDto {
  readonly page: number;
  readonly perPage: number;
  readonly orderBy: {
    col: string;
    order: 'ASC' | 'DESC';
  };

  constructor(query: any) {
    query = query || {};
    const page = Number.parseInt(query.page || '1');
    let perPage = Number.parseInt(query['per-page'] || '50');
    perPage = Math.min(perPage, 200);
    const orderByDesc = query['order-by'] || 'createdAt-asc';
    const orderByCol = orderByDesc.split('-')[0];
    const orderDesc = orderByDesc.split('-')[1] || 'asc';
    const asc = orderDesc === 'asc';

    this.page = page;
    this.perPage = perPage;
    this.orderBy = {
      col: orderByCol,
      order: asc ? 'ASC' : 'DESC',
    };
  }
}
