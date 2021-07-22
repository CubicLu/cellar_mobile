import React, {FC} from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';
import {ChevronLeftIcon} from '../../../assets/svgIcons';
import {withNavigation, NavigationScreenProp} from 'react-navigation';
import Colors from '../../../constants/colors';
import {getStatusBarHeight} from 'react-native-iphone-x-helper';

type Props = {
  navigation: NavigationScreenProp<any>;
  customBack?: () => void;
};

const ChevronLeft: FC<Props> = ({navigation, customBack}) => {
  return (
    <TouchableOpacity style={[arrowTouchable]} onPress={customBack ? customBack : () => navigation.goBack()}>
      <ChevronLeftIcon height={25} width={20} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  arrowContainer: {
    backgroundColor: Colors.dashboardRed,
  },
  arrowTouchable: {
    width: 80,
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.dashboardRed,
    position: 'absolute',
    top: getStatusBarHeight(true),
    left: 0,
    zIndex: 100,
  },
});

const {arrowTouchable} = styles;

export const AbsChevronLeft = withNavigation(ChevronLeft);
