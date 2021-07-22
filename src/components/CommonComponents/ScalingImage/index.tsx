import React, {useState, useEffect, useRef, FC} from 'react';

import {TouchableOpacity, Image} from 'react-native';
import {Image as ImageComponent, ImageProps} from 'react-native-elements';

const resolveAssetSource = Image.resolveAssetSource;

interface IOnSizeParams {
  width: number;
  height: number;
}

interface IImageProps extends ImageProps {
  height?: number;
  width?: number;
  background?: boolean;
  onPress?: () => void;
  onSize?: (onSizeParams: IOnSizeParams) => void;
}

export const ScalableImage: FC<IImageProps> = props => {
  const [scalableWidth, setScalableWidth] = useState(null);
  const [scalableHeight, setScalableHeight] = useState(null);
  const [image, setImage] = useState(null);
  const mounted = useRef(false);

  useEffect(() => {
    mounted.current = true;

    return () => {
      mounted.current = false;
    };
  }, []);

  useEffect(() => {
    onProps(props);
  });

  useEffect(() => {
    setImage(
      <ImageComponent
        {...props}
        style={[
          props.style,
          {
            width: scalableWidth,
            height: scalableHeight,
          },
        ]}
      />,
    );
  }, [scalableHeight, scalableWidth]);

  const onProps = localProps => {
    const {source} = localProps;
    if (source.uri) {
      const sourceToUse = source.uri ? source.uri : source;

      Image.getSize(sourceToUse, (width, height) => adjustSize(width, height, props), console.error);
    } else {
      const sourceToUse = resolveAssetSource(source);
      adjustSize(sourceToUse.width, sourceToUse.height, props);
    }
  };

  const adjustSize = (sourceWidth, sourceHeight, localProps) => {
    const {width, height} = localProps;

    let ratio = 1;

    if (width && height) {
      ratio = Math.min(width / sourceWidth, height / sourceHeight);
    } else if (width) {
      ratio = width / sourceWidth;
    } else if (height) {
      ratio = height / sourceHeight;
    }

    if (mounted.current) {
      const computedWidth = sourceWidth * ratio;
      const computedHeight = sourceHeight * ratio;

      setScalableWidth(computedWidth);
      setScalableHeight(computedHeight);

      props.onSize && props.onSize({width: computedWidth, height: computedHeight});
    }
  };

  if (!props.onPress) {
    return image;
  } else {
    return <TouchableOpacity onPress={props.onPress}>{image}</TouchableOpacity>;
  }
};
