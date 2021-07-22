export type OfferStatus = 'CREATED' | 'SELLER_MODIFIED' | 'BUYER_ACCEPTED' | 'DEAL_ACCEPTED' | 'BUYER_MODIFIED';

export type WineInTrade = {
  wineId: number;
  wineName: string;
  sellerId: number;
  firstName: string;
  lastName: string;
  prettyLocationName: string;
  distance: number;
  quantity: number;
  pricePerBottle: number;
  seller: UserPublicType;
};

export type OfferToBuyInput = {
  wineId: number;
  sellerId: number;
  quantity: number;
  pricePerBottle: number;
  note: string;
};

export type TradeOfferItem = {
  offerId: number;
  status: OfferStatus;
  tradeStatus: any;
  isCountered: boolean;
  buyerId: number;
  wineInTrade: WineInTrade;
  createdAt: Date;
  updatedAt: Date;
  lastNote: string;
};

export interface TradePreloadItem extends TradeOfferItem {
  tradeList: TradeListType;
}

export type TradeDetailsType = {
  dealId: number;
  requestedCount: number;
  requestedPrice: number;
  sellerId: number;
  buyerId: number;
  updatedAt: Date;
  isCountered: boolean;
  note: string;
};

export type UserPublicType = {
  id: number;
  firstName: string;
  lastName: string;
  prettyLocationName: string;
  avatarURL: string;
  userName: string;
  authorizedTrader: boolean;
};

export type ReceiptDetailsType = {
  tradeOfferId: number;
  wineId: number;
  wineName: string;
  wineTitle: string;
  quantity: number;
  pricePerBottle: number;
  totalPrice: number;
  isCountered: boolean;
  updatedAt: Date;
  createdAt: Date;
  buyer: UserPublicType;
  seller: UserPublicType;
  insurance: number;
  status: string;
  totalPriceForSeller: number;
  includeInsurance: boolean;
};

export type TradeListType = 'BUYER_LIST' | 'SELLER_LIST' | '';

export type CardType = 'VISA' | 'MASTER';

export type TradeSellerRole = 'Seller';

export type TradeBuyerRole = 'Buyer';

export type TradeRole = TradeSellerRole | TradeBuyerRole;

export type CartItem = {label: string; amount: string};
