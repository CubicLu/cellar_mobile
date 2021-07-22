import React, {FC} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Image} from 'react-native-elements';

import {NoAvatarUserIcon} from '../../../assets/svgIcons';
import textStyle from '../../../constants/Styles/textStyle';
import {RateValue} from '../../';

type Props = {
  userName: string;
  rating: number;
  avatarUrl: string;
};

export const LatestReview: FC<Props> = ({userName, rating, avatarUrl}) => {
  return (
    <View style={container}>
      <View style={imageWrapper}>
        <Image
          PlaceholderContent={<NoAvatarUserIcon height={15} width={15} />}
          style={imageContainer}
          source={{uri: avatarUrl}}
        />
      </View>
      <Text style={text}>{userName}</Text>
      {!!rating && <RateValue rating={rating} size={13} />}
    </View>
  );
};

const styles = StyleSheet.create({
  imageContainer: {width: 15, height: 15},
  imageWrapper: {marginRight: 10, overflow: 'hidden', borderRadius: 50},
  container: {flexDirection: 'row', alignItems: 'center'},
  text: {color: '#fff', ...textStyle.mediumText},
});

const {imageContainer, container, imageWrapper, text} = styles;
