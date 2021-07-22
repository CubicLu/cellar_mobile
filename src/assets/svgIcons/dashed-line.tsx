import React, {FC} from 'react';
import Svg, {Path} from 'react-native-svg';

type Props = {
  width: number;
  height: number;
  color?: string;
};

const Line: FC<Props> = ({height, width, color = '#fff'}) => {
  return (
    <Svg width={width} height={height}>
      <Path stroke={color} strokeWidth={3} strokeDasharray="2" d={`M0 10h${width}`} />
    </Svg>
  );
};

export const DashedLineIcon = Line;
