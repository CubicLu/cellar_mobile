export type ScreenSyncType =
  | 'Dashboard'
  | 'Filters'
  | 'Community'
  | 'DrinkHistory'
  | 'CurrentOffers'
  | 'PastOffers'
  | 'Dashboard-price'
  | 'Wishlist'
  | 'Live-photos'
  | 'Receipts-screen';

/**
 * Type for uploading an image to the S3 bucket via lambda function
 */
export type UploadImageType = {
  data: string;
  name: string;
  contentType: string;
  filepath: string;
  queryId: number;
};
