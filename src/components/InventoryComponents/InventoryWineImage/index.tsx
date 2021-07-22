import React, {FC, useState} from 'react';
import {View, StyleSheet, Dimensions} from 'react-native';
import {ActivityIndicator} from 'react-native';
import {Image} from 'react-native-elements';

import {CameraWhiteIcon} from '../../../assets/svgIcons';
import Colors from '../../../constants/colors';

type Props = {
  uri: string;
  triange?: boolean;
};

export const WineImage: FC<Props> = ({uri, triange}) => {
  const [link, setLink] = useState(uri);
  return (
    <View style={[containerPhoto, link === '' && containerBottle]}>
      {typeof link !== 'undefined' && link === '' ? (
        <CameraWhiteIcon height={34} width={40} />
      ) : (
        <View style={imageContainer}>
          <Image
            style={image}
            source={{uri: link, cache: 'force-cache'}}
            onError={() => setLink('')}
            resizeMethod="auto"
            resizeMode="cover"
            PlaceholderContent={<ActivityIndicator size={'large'} />}
          />

          {triange && <View style={triangle} />}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  photoContainer: {maxHeight: 300},
  bottleContainer: {alignSelf: 'center', paddingTop: 0},
  imageContainer: {
    height: '100%',
    width: Dimensions.get('window').width,
    // borderRadius: 150,
    // overflow: 'hidden',
  },
  image: {
    height: '100%',
    width: '100%',
    // borderRadius: 100,
  },
  triangle: {
    borderRightWidth: Dimensions.get('screen').width,
    borderBottomWidth: 40,
    borderBottomColor: Colors.dashboardRed,
    borderRightColor: 'transparent',
    flex: 1,
    position: 'absolute',
    bottom: 0,
  },
});

const {photoContainer: containerPhoto, bottleContainer: containerBottle, image, imageContainer, triangle} = styles;
