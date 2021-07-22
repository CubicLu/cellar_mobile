import React, {FC, useEffect, useRef, useState} from 'react';
import {View, TouchableOpacity, Dimensions, TextProps, TextInput} from 'react-native';
import {Picker} from '@davidgovea/react-native-wheel-datepicker';
import Icon from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {Tooltip, Text} from 'react-native-elements';

import {BottomSheetNew, InputNew} from '../../../new_components';
import {ChevronRightIcon, VerifiedUserIcon} from '../../../assets/svgIcons';
import styles from './SaleOfferListItem.style';
import {WineInTrade, OfferToBuyInput} from '../../../types/trade';
import colors from '../../../constants/colors';
import {requiredPriceValidation} from '../../../utils/errorCodes';

type Props = {
  totalCount: number;
  onChangeCount: (val: OfferToBuyInput) => void;
  data: WineInTrade;
  index: number;
  pricePerBottle?: number;
};

const isSmallScreen = Dimensions.get('screen').width < 375;

const SaleOfferListItem: FC<Props> = ({totalCount, onChangeCount, data, index, pricePerBottle}) => {
  const bottleCountRef = useRef();
  const [bottleCount, setBottleCount] = useState(0);
  const [price, setPrice] = useState(`${pricePerBottle}`);
  const [errorMessage, setErrorMessage] = useState('');
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    const err = requiredPriceValidation(bottleCount, price);
    setErrorMessage(err);

    onChangeCount({
      sellerId: data.sellerId,
      wineId: data.wineId,
      quantity: err !== '' ? 0 : bottleCount,
      pricePerBottle: +price,
      note: '',
    });

    +price !== 0 && (inputRef.current as any).setValue(price);
  }, [price, bottleCount]);

  return (
    <View style={[container, !!(index % 2) && containerDarkBg]}>
      <View style={row}>
        <View style={flex1}>
          <View style={flexRow}>
            <Text adjustsFontSizeToFit={true} numberOfLines={1} style={[nameText, isSmallScreen && fs16]}>
              {data.seller.userName}
            </Text>
            {data.seller.authorizedTrader && (
              <Tooltip
                containerStyle={[verifiedIconContainer, !data.seller.authorizedTrader && invisible]}
                withOverlay={false}
                backgroundColor="#fff"
                popover={
                  <Text allowFontScaling={false} style={verifiedTooltipText} adjustsFontSizeToFit>
                    This user is verified
                  </Text>
                }>
                <VerifiedUserIcon height={22} width={18} />
              </Tooltip>
            )}
          </View>
          <Text style={[geoText, isSmallScreen && fs12]} numberOfLines={2} allowFontScaling={true}>
            <Icon name="location-on" size={13} />
            {data.seller.prettyLocationName}
          </Text>
        </View>
      </View>
      <View style={[row, pickerRow]}>
        <View style={bottlePickerContainer}>
          <TouchableOpacity style={pickerContainer} onPress={() => (bottleCountRef as any).current.open()}>
            <Text style={nameText}>{bottleCount}</Text>
            <View style={chevronContainer}>
              <ChevronRightIcon height={10} width={10} />
            </View>
          </TouchableOpacity>
          <View style={bottlePickerTotalCount}>
            <Text style={[nameText, fs25]}>/{totalCount}</Text>
          </View>
        </View>
        <View style={inputContainer}>
          <View style={[pricePerBottle && inactiveOverlay, index % 2 && overlayDarkTab]} />
          <InputNew
            placeHolder="Cost per bottle"
            value={+price === 0 ? '' : `${price}`}
            error={errorMessage}
            keyboardType="decimal-pad"
            returnKeyType={'done'}
            onChange={val => setPrice(val)}
            onSubmitEditing={() => inputRef.current.blur()}
            requiredColorValidation={colors.lightGray}
            getRef={inputRef}
            labelOffset={{
              x0: 0,
              x1: -40,
              y0: -10,
            }}
            contentInset={{
              left: 15,
              input: 0,
              label: 10,
              bottom: 0,
            }}
            customContainerStyle={customInputContainerStyle}
            renderLeftAccessory={() => (
              <View style={inputLeftAccessory}>
                <FontAwesome name="dollar" color="#fff" size={20} />
              </View>
            )}
            backgroundLabelColor={index % 2 ? colors.dashboardDarkTab : undefined}
          />
        </View>
      </View>

      <BottomSheetNew onPressDone={() => (bottleCountRef as any).current.close()} ref={bottleCountRef}>
        <Picker
          style={bottomPickerContainer}
          itemStyle={{color: '#fff'} as TextProps}
          selectedValue={bottleCount}
          pickerData={Array.from({length: totalCount + 1}, (v, k) => k)}
          onValueChange={value => setBottleCount(value)}
        />
      </BottomSheetNew>
    </View>
  );
};

const {
  container,
  row,
  nameText,
  geoText,
  chevronContainer,
  pickerContainer,
  inactiveOverlay,
  overlayDarkTab,
  inputContainer,
  flex1,
  bottomPickerContainer,
  containerDarkBg,
  inputLeftAccessory,
  customInputContainerStyle,
  bottlePickerContainer,
  pickerRow,
  invisible,
  verifiedIconContainer,
  flexRow,
  fs16,
  fs12,
  fs25,
  bottlePickerTotalCount,
  verifiedTooltipText,
} = styles;

export default SaleOfferListItem;
