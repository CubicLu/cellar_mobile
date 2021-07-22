import React from 'react';
import {Text, StyleSheet, View, TouchableOpacity} from 'react-native';
import {WineOrangeIcon, WineWhiteIcon, WishEmptyIcon, WishFilledIcon} from '../../../assets/svgIcons';
import textStyle from '../../../constants/Styles/textStyle';
import Colors from '../../../constants/colors';
interface Props {
  onPressWish: () => void;
  isWishDisabled: boolean;
  isInWish: boolean;
  onPressBottle: () => void;
  wineModel: any;
}

const Bottom: React.FC<Props> = ({onPressWish, isWishDisabled, isInWish, onPressBottle, wineModel}) => {
  return (
    <View style={{flexDirection: 'row', position: 'absolute', bottom: 5, right: 20}}>
      <TouchableOpacity
        activeOpacity={0.5}
        onPress={onPressWish}
        disabled={isWishDisabled}
        style={[wishTouchable, {opacity: isWishDisabled ? 0.5 : 1}]}>
        <View style={wishStyle}>
          {isInWish ? <WishFilledIcon width={25} height={25} /> : <WishEmptyIcon width={25} height={25} />}
        </View>
      </TouchableOpacity>

      <TouchableOpacity onPress={onPressBottle} style={addStyle}>
        {wineModel.wine.quantity > 0 ? (
          <>
            <View style={{paddingBottom: 7}}>
              <WineOrangeIcon width={25} height={34} />
            </View>
            <Text style={bottleText}>{wineModel.wine.quantity}</Text>
          </>
        ) : (
          <>
            <View style={{paddingBottom: 7}}>
              <WineWhiteIcon width={25} height={34} />
            </View>
            <Text style={bottleText}>+</Text>
          </>
        )}
      </TouchableOpacity>
    </View>
  );
};
export const BottomButtons = Bottom;

const style = StyleSheet.create({
  wishStyle: {
    marginBottom: 7,
    padding: 5,
    backgroundColor: Colors.transparentWhite,
    justifyContent: 'center',
    alignContent: 'center',
    height: 34,
    width: 34,
  },
  wishTouchable: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginRight: 20,
  },
  addStyle: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  bottleText: {
    ...textStyle.mediumText,
    color: Colors.orangeDashboard,
    fontSize: 25,
  },
});

const {wishStyle, wishTouchable, addStyle, bottleText} = style;
