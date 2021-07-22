import {CartItem} from '../../types/trade';
import {calculateStripeFee} from '../TradeFlowUtils';

export const generateCartItems = (wine, count, price, insurance: number): CartItem[] => {
  const delivery = 15;

  const bottlesPrice = price * count;
  let cart: CartItem[] = [
    {
      label: 'Shipment',
      amount: delivery.toFixed(2),
    },
  ];

  if (insurance) {
    cart.push({
      label: 'Insurance',
      amount: insurance.toFixed(2),
    });
  }

  cart = [
    {
      label: `${count} x ${wine}`,
      amount: bottlesPrice.toFixed(2),
    },
    ...cart,
  ].sort((a, b) => +b.amount - +a.amount);

  const priceWithoutFee = delivery + insurance + bottlesPrice;
  const priceWithFee = calculateStripeFee(delivery + insurance + bottlesPrice);
  const feeAmount = (priceWithFee / 100 - priceWithoutFee).toFixed(2);

  return [
    ...cart,
    {label: 'Bank fee', amount: `${feeAmount}`},
    {
      label: 'Total',
      amount: `${priceWithFee / 100}`,
    },
  ];
};
