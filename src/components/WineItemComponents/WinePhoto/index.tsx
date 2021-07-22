import React, {FC, useState} from 'react';
import {View, StyleSheet, ActivityIndicator} from 'react-native';
import {Image} from 'react-native-elements';

import {BottleIcon} from '../../../assets/svgIcons';
import colors from '../../../constants/colors';

type Props = {
  pictureURL: string;
  color: string;
};

const WinePhoto: FC<Props> = ({color, pictureURL}) => {
  const [url, setUrl] = useState(pictureURL);

  return (
    <View style={imageContainer}>
      {url === '' ? (
        <View style={[placeholderImage]}>
          <BottleIcon height={150} width={90} />
        </View>
      ) : (
        <Image
          PlaceholderContent={
            <View style={imagePlaceholderContainer}>
              <ActivityIndicator size={'large'} />
            </View>
          }
          source={{uri: url, cache: 'force-cache'}}
          onError={() => setUrl('')}
          style={wineImage}
        />
      )}
      <View style={[wineColorView, {backgroundColor: color}]} />
    </View>
  );
};

const styles = StyleSheet.create({
  imageContainer: {flexDirection: 'row', flex: 1, backgroundColor: colors.dashboardDarkTab},
  placeholderImage: {alignSelf: 'center', paddingVertical: 10},
  imagePlaceholderContainer: {
    width: '100%',
    height: '100%',
    backgroundColor: colors.dashboardDarkTab,
    alignItems: 'center',
    justifyContent: 'center',
  },
  wineImage: {flex: 1, width: 90, height: '100%'},
  wineColorView: {width: 10, height: '100%', flex: 0},
});

const {imageContainer, placeholderImage, imagePlaceholderContainer, wineImage, wineColorView} = styles;

export const WineListItemPhoto = WinePhoto;
