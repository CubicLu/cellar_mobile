import React, {FC} from 'react';
import {NavigationScreenProp, withNavigation} from 'react-navigation';

import {InfoCell} from '../../../new_components';
import {Routes} from '../../../constants';
import {LocationItem} from '../../../screens';

type Props = {
  selectedValue: LocationItem;
  onChangeValue: (value: string) => void;
  navigation: NavigationScreenProp<any>;
};

const Designation: FC<Props> = ({selectedValue, onChangeValue, navigation}) => {
  return (
    <InfoCell
      title={'Location'}
      content={selectedValue.name === 'None' ? '' : selectedValue.name}
      onPress={() => navigation.navigate(Routes.inventoryAdditions.editLocation, {setLocation: onChangeValue})}
      error={''}
      rotate={false}
      required={false}
    />
  );
};

export const LocationDesignation = withNavigation(Designation);
