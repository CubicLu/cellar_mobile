import React, {FC} from 'react';

import {VisaIcon, MasterCardIcon} from '../../../../assets/svgIcons';
import {CardType} from '../../../../types/trade';

type Props = {
  variant?: CardType;
};

const renderIcon = variant => {
  switch (variant) {
    case 'VISA': {
      return <VisaIcon width={100} height={50} />;
    }

    case 'MASTER': {
      return <MasterCardIcon width={100} height={50} />;
    }

    default: {
      return null;
    }
  }
};

export const CardIcon: FC<Props> = ({variant}) => {
  return renderIcon(variant);
};
