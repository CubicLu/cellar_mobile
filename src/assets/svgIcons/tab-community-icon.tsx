import * as React from 'react';
import Svg, {Path} from 'react-native-svg';
import {FC} from 'react';

type Props = {
  width: number;
  height: number;
  color?: string;
};

export const TabCommunityIcon: FC<Props> = ({width, height, color}) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 18 18">
      <Path
        d="M16.125 0H1.875A1.875 1.875 0 000 1.875v14.25A1.875 1.875 0 001.875 18h14.25A1.875 1.875 0 0018 16.125V1.875A1.875 1.875 0 0016.125 0zM11.25 14.25h-7.5V12h7.5zm3-4.125H3.75v-2.25h10.5zm0-4.125H3.75V3.75h10.5z"
        fill={color || 'fff'}
        opacity={1}
      />
    </Svg>
  );
};
