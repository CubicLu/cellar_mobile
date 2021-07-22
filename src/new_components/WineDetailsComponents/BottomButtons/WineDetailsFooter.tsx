import React, {FC} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';

import {
  WineOrangeIcon,
  WineWhiteIcon,
  WishEmptyIcon,
  WishFilledIcon,
  BottleToDollarIcon,
} from '../../../assets/svgIcons';
import textStyle from '../../../constants/Styles/textStyle';
import Colors from '../../../constants/colors';
import APP_CONFIG from '../../../constants/config';
import Images from '../../../assets/images/index';

type Props = {
  inWishList: boolean;
  bottleCount: number;
  allowForTrading: boolean;
  onPressWish: () => void;
  onPressBottle: () => void;
  onPressAllowForTrading: () => void;
  loading: boolean;
};

const Footer: FC<Props> = ({
  inWishList,
  bottleCount,
  onPressWish,
  onPressBottle,
  allowForTrading,
  onPressAllowForTrading,
  loading,
}) => {
  return (
    <View style={container}>
      {APP_CONFIG.EXTERNAL_BUILD ? null : (
        <TouchableOpacity disabled={loading} onPress={onPressAllowForTrading} style={wishBtnContainer}>
          <BottleToDollarIcon color={allowForTrading ? '#f66e00' : '#fff'} width={40} height={40} />
        </TouchableOpacity>
      )}
      {/* White heart icon */}
      {/* <TouchableOpacity disabled={loading} onPress={onPressWish} style={wishBtnContainer}>
        {inWishList ? <WishFilledIcon width={25} height={25} /> : <WishEmptyIcon width={25} height={25} />}
      </TouchableOpacity> */}

      <TouchableOpacity onPress={onPressBottle}>
        {bottleCount > 0 ? (
          <View style={flexRow}>
            <Image source={Images.wineBottle} width={25} height={34} />
            {/* <WineOrangeIcon width={25} height={34} /> */}
            <Text style={[bottleText, btnTextAlign]}>{bottleCount}</Text>
          </View>
        ) : (
          <View style={flexRow}>
            <WineWhiteIcon width={25} height={34} />
            <Text style={bottleText}>+</Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end'},
  flexRow: {flexDirection: 'row', paddingRight: 10, alignItems: 'center'},
  bottleText: {
    ...textStyle.boldText,
    color: 'white',
    fontSize: 26,
  },
  btnTextAlign: {marginTop: -2},
  wishBtnContainer: {marginRight: 5},
});

const {bottleText, container, flexRow, wishBtnContainer, btnTextAlign} = styles;

export const WineDetailsFooter = Footer;
