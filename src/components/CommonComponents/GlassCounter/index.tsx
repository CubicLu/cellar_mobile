import React, {FC} from 'react';
import {View, Text, StyleSheet} from 'react-native';

import colors from '../../../constants/colors';
import {WineglassIcon} from '../../../assets/svgIcons';
import textStyle from '../../../constants/Styles/textStyle';

type Props = {
  unreadMessages: number;
};

export const GlassCounter: FC<Props> = ({unreadMessages}) => {
  if (unreadMessages === 0) {
    return null;
  }

  return (
    <View style={iconContainer}>
      <WineglassIcon height={22} width={22} />
      <View style={counterContainer}>
        <Text allowFontScaling={false} style={counterText}>
          {unreadMessages}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  counterContainer: {
    borderRadius: 15,
    width: 15,
    height: 15,
    backgroundColor: colors.dashboardRed,
    position: 'absolute',
    top: -5,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    width: 35,
    height: 25,
    alignItems: 'center',
  },
  counterText: {
    color: 'white',
    fontSize: 12,
    ...textStyle.boldText,
  },
});

const {counterContainer, iconContainer, counterText} = styles;
