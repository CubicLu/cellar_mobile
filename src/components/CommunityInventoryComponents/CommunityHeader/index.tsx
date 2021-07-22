import React from 'react';
import {Text, View, Dimensions} from 'react-native';

import {styles} from './styles';

const {title, container} = styles;

const screenWidth = Dimensions.get('screen').width;
//60 - width of the filter and search icons
//80+20 - burger menu width with + padding to fit word
const maxWidth = screenWidth - (60 * 2 + 100);

const Header = () => {
  return (
    <View style={container}>
      <View>
        <Text allowFontScaling={false} adjustsFontSizeToFit numberOfLines={1} style={[title, {maxWidth: maxWidth}]}>
          Community
        </Text>
      </View>
    </View>
  );
};

export const CommunityInventoryHeader = Header;
