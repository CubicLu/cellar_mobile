import * as React from 'react';
import Svg, {G, Path} from 'react-native-svg';

type Props = {
  height: number;
  width: number;
};

const Gallery: React.FC<Props> = ({width, height}) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 41 30" fill="none">
      <G opacity={0.8} fill="#fff">
        <Path d="M21.432 11.956c-.897 0-1.627.717-1.627 1.599 0 .881.73 1.599 1.627 1.599s1.627-.718 1.627-1.6c0-.88-.73-1.598-1.627-1.598zM29.19 20.51l-6.94 5.58-11.24-7.243L0 25.258V30h34.827v-4.9l-5.636-4.59z" />
        <Path d="M5.772 0v4.05h31.457v20.545H41V0H5.772z" />
        <Path d="M0 6.41v16.105l11.074-6.45 11.019 7.102L29.2 17.45l5.626 4.583V6.411H0zm21.432 11.104c-2.221 0-4.029-1.776-4.029-3.96 0-2.183 1.808-3.959 4.03-3.959 2.22 0 4.028 1.776 4.028 3.96 0 2.183-1.807 3.96-4.029 3.96z" />
      </G>
    </Svg>
  );
};

export const GalleryIcon = Gallery;
