import React, {FC, useEffect, useState} from 'react';
import {View, StyleSheet, TouchableOpacity, Text, Image, Dimensions} from 'react-native';

import {WineImage, ImagePreviewer} from '../../../components';
import textStyle from '../../../constants/Styles/textStyle';
import {CameraWhiteIcon, HearthActiveIcon, WishEmptyIcon, WishFilledIcon} from '../../../assets/svgIcons';
import Images from '../../../assets/images/index';
import colors from '../../../constants/colors';

type Props = {
  pictureURL: string;
  isImageExist: boolean;
  color: string;
  loading?: boolean;
  inWishList?: any;
  onPressWish?: () => void;
};

const ImagePreview: FC<Props> = ({pictureURL, isImageExist, loading, inWishList, onPressWish}) => {
  const [isVisible, setIsVisible] = useState(false);

  const togglePreview = () => setIsVisible(v => !v);

  useEffect(() => {
    console.log('Inventory');
  }, []);

  return (
    <View style={container}>
      {/* <View style={[bottleBg, color && {backgroundColor: color}]} /> */}
      <TouchableOpacity style={[!isImageExist && placeHolderPadding]} disabled={!isImageExist} onPress={togglePreview}>
        <WineImage uri={pictureURL} />
      </TouchableOpacity>

      {!isImageExist && <Text style={text}>Add photo image to your wine</Text>}

      <ImagePreviewer imgUri={pictureURL} isVisible={isVisible} toggleVisibility={togglePreview} />
      <View style={triangle} />
      <TouchableOpacity disabled={loading} onPress={onPressWish} style={hearthContainer}>
        {inWishList ? (
          <Image source={Images.avesomeHeart} width={20} height={20} />
        ) : (
          <WishEmptyIcon width={51} height={51} />
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    minHeight: 300,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  bottleBg: {backgroundColor: 'red', ...StyleSheet.absoluteFillObject, width: 50, position: 'absolute'},
  placeHolderPadding: {paddingTop: 30, paddingBottom: 30, zIndex: 1},
  text: {color: 'white', fontSize: 16, ...textStyle.mediumText},
  image: {position: 'absolute', right: 20, bottom: 20, zIndex: 100},
  triangle: {
    borderRightWidth: Dimensions.get('screen').width,
    borderBottomWidth: 40,
    borderBottomColor: colors.dashboardRed,
    borderRightColor: 'transparent',
    borderColor: 'white',
    position: 'absolute',
    zIndex: 1,
    bottom: 0,
  },
  hearthContainer: {position: 'absolute', right: 20, bottom: 20, zIndex: 2},
});

const {container, placeHolderPadding, text, triangle, hearthContainer} = styles;

export const ImageWithPreview = ImagePreview;
