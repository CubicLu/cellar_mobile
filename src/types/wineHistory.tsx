import {WineType} from './wine';

export interface WineHistory {
  id: number;
  numberOfBottles: number;
  bottleNote: string;
  purchaseDate: string;
  deliveryDate: string;
  purchaseNote: string;
  note: string;
  reason: string;
  wine: WineType;
}
