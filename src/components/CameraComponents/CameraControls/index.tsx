import React, {FC} from 'react';
import {View, TouchableOpacity, StyleSheet} from 'react-native';
import {CameraShotIcon, GalleryIcon} from '../../../assets/svgIcons';

type Props = {
  onTakePhoto: () => void;
  onChoseGallery: () => void;
};

const Controllers: FC<Props> = ({onTakePhoto, onChoseGallery}) => {
  return (
    <View style={container}>
      <View style={controller} />
      <TouchableOpacity style={controller} onPress={onTakePhoto}>
        <CameraShotIcon width={73} height={73} />
      </TouchableOpacity>
      <TouchableOpacity style={controller} onPress={onChoseGallery}>
        <GalleryIcon width={41} height={30} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  controller: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

const {container, controller} = styles;

export const CameraControllers = Controllers;
