import FilterType from './filter';

export default interface LocalFilters {
  listData: {
    list: string;
  };
}

export interface FilterObject {
  data: FilterType;
  selectedArr?: number[];
  country?: {
    title: string;
    selectedArr: number[];
  };
  title: string;
}
