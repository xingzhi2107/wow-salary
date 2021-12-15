export interface SimpleListIdsRO {
  ids: number[];
}

export interface SimpleListItemRO<PlainData> {
  items: Partial<PlainData>[];
}
