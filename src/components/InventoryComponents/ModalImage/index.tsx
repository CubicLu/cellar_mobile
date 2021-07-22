import React, {FC} from 'react';
import ImageViewer from 'react-native-image-zoom-viewer';
import {StyleSheet, Modal, View, ActivityIndicator} from 'react-native';

type Props = {
  isVisible: boolean;
  toggleVisibility: () => void;
  imgUri: string;
};

const ModalImage: FC<Props> = ({isVisible, toggleVisibility, imgUri}) => {
  return (
    <Modal visible={isVisible} transparent={true}>
      <ImageViewer
        renderIndicator={() => <View />}
        enableImageZoom={false}
        onClick={toggleVisibility}
        imageUrls={[{url: imgUri}]}
        loadingRender={() => <ActivityIndicator size="large" />}
        saveToLocalByLongPress={false}
      />
    </Modal>
  );
};

export const ImagePreviewer = ModalImage;

const styles = StyleSheet.create({
  topIndicator: {
    position: 'absolute',
    width: 50,
    height: 50,
    top: '5%',
    left: '2%',
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const {topIndicator} = styles;

export default Modal;
