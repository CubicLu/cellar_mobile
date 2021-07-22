export interface WineType {
  id: number;
  bottleCapacity: number;
  wineTitle: string;
  color: string;
  currency: string;
  pictureURL: any;
  price: number;
  vintage: string;
  varietal: string;
  producer: string;
  wineType: string;
  rating: number;
  locale: Locale;
  inWishList: boolean;
}

interface Locale {
  country: string;
  region: string;
  appellation: string;
  subregion: string;
}
