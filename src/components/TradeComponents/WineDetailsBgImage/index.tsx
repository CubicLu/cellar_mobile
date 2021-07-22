import React, {FC, useState} from 'react';
import {StyleSheet, Modal, TouchableOpacity, View, ActivityIndicator} from 'react-native';
import ImageViewer from 'react-native-image-zoom-viewer';
import {Image} from 'react-native-elements';

type Props = {
  src: string;
};

const Preview: FC<Props> = ({src}) => {
  const [visible, setVisible] = useState(false);
  return (
    src !== '' && (
      <TouchableOpacity onPress={() => setVisible(true)} style={imageContainer}>
        <Image
          source={{uri: src, cache: 'force-cache'}}
          style={bgImage}
          resizeMode="contain"
          PlaceholderContent={
            <View style={activityPlaceHolderContainer}>
              <ActivityIndicator color="#fff" size="large" />
            </View>
          }
        />
        <Modal visible={visible} transparent={true}>
          <ImageViewer
            saveToLocalByLongPress={false}
            onClick={() => setVisible(false)}
            renderIndicator={() => <View />}
            imageUrls={[{url: src}]}
            loadingRender={() => <ActivityIndicator size="large" />}
          />
        </Modal>
      </TouchableOpacity>
    )
  );
};

const styles = StyleSheet.create({
  bgImage: {
    top: 0,
    left: 0,
    right: 0,
    height: 300,
    position: 'absolute',
  },
  imageContainer: {height: 226},
  activityPlaceHolderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
    width: '100%',
    height: '100%',
  },
});

const {bgImage, imageContainer, activityPlaceHolderContainer} = styles;

export const WineDetailsPreviableImage = Preview;
