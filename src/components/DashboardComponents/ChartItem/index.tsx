import React, {FC} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';

import textStyle from '../../../constants/Styles/textStyle';
import Colors from '../../../constants/colors';

type Props = {
  total?: number;
  count?: number;
  onClick: () => void;
  title: string;
  icon?: string;
  disablePercentage?: boolean;
};

const Item: FC<Props> = ({total, count, onClick, title, disablePercentage = false, icon}) => {
  return (
    <TouchableOpacity onPress={onClick} style={producerContainer}>
      <View style={backLayerProgress}>
        <View
          style={[
            frontLayerProgress,
            {
              width: `${(count / total) * 100}%`,
            },
          ]}
        />
        <View style={containerProgress}>
          {icon && <Image source={{uri: icon, cache: 'force-cache'}} style={imageIcon} />}
          <Text
            style={[text, {...textStyle.robotoRegular}]}
            numberOfLines={2}
            maxFontSizeMultiplier={1.2}
            adjustsFontSizeToFit>
            {title}
          </Text>
        </View>
      </View>
      {count && (
        <View style={percentage}>
          <Text style={[countText, {...textStyle.robotoBold}]} maxFontSizeMultiplier={1.1}>
            {count} {!disablePercentage && `(${((count / total) * 100).toFixed(2)}%)`}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  flex1: {flex: 1},
  imageBg: {height: '100%', width: '100%', zIndex: -1},
  producerContainer: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    marginBottom: 10,
    marginTop: 0,
    flex: 1,
    height: 45,
  },
  percentage: {position: 'absolute', right: 5, flex: 1, bottom: 0, top: 0, justifyContent: 'center'},
  containerProgress: {
    flexDirection: 'row',
    width: '70%',
    paddingLeft: 10,
    paddingRight: 15,
  },
  countBox: {
    height: 40,
    width: '15%',
    justifyContent: 'center',
    alignItems: 'flex-end',
    position: 'absolute',
    right: 0,
  },
  countText: {
    fontSize: 16,
    color: 'white',
    ...textStyle.boldText,
  },
  text: {
    alignSelf: 'center',
    fontSize: 16,
    color: 'white',
    ...textStyle.mediumText,
  },
  frontLayerProgress: {
    minWidth: 10,
    height: '100%',
    fontFamily: 'Futura-Medium',
    backgroundColor: Colors.dashboardRed,
    position: 'absolute',
  },
  backLayerProgress: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
  },
  imageIcon: {
    height: 30,
    width: 30,
    marginRight: 5,
  },
});

const {
  producerContainer,
  percentage,
  containerProgress,
  text,
  frontLayerProgress,
  backLayerProgress,
  countText,
  imageIcon,
} = styles;

export const ChartItem = Item;
