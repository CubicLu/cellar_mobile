import React, {FC} from 'react';
import Svg, {Path} from 'react-native-svg';

type Props = {
  width: number;
  height: number;
};

const ThumbUp: FC<Props> = ({width, height}) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 40 36.932">
      <Path
        fill="#000"
        d="M11.892 36.932h18.182a3.888 3.888 0 003.615-2.251l6.036-13.022A3.39 3.39 0 0040 20.313V16.6c0-2.029-1.8-4.289-4-4.289H23.4l1.9-7.838.063-.577a2.665 2.665 0 00-.877-1.952L22.357 0 9.038 12.243a3.538 3.538 0 00-1.163 2.607v18.466a3.824 3.824 0 004.017 3.616zM0 21.182h4.5v15.75H0z"
      />
    </Svg>
  );
};

export const ThumbUpIcon = ThumbUp;
