import React, {FC} from 'react';

import {BuyerFooter, SellerFooter, BuyerFooterProps, SellerFooterProps} from '../..';
import {TradeRole} from '../../../types/trade';

interface Props extends BuyerFooterProps, SellerFooterProps {
  variant: TradeRole;
}

function renderFooter(props: Props) {
  const {variant} = props;

  switch (variant) {
    case 'Buyer': {
      return <BuyerFooter {...props} />;
    }

    case 'Seller': {
      return <SellerFooter {...props} />;
    }
  }
}

export const ReceiptFooter: FC<Props> = props => {
  return renderFooter(props);
};
