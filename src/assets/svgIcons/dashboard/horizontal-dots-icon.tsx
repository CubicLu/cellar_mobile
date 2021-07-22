import * as React from 'react';
import Svg, {Circle, G} from 'react-native-svg';

type Props = {
  height: number;
  width: number;
};

const Dots: React.FC<Props> = ({width, height}) => {
  return (
    <Svg width={width} height={height} strokeWidth={0.1} viewBox="0 0 26 6" fill="#fff">
      <G transform="translate(-368 -37)">
        <Circle cx={3} cy={3} r={3} transform="translate(388 37)" />
        <Circle cx={3} cy={3} r={3} transform="translate(378 37)" />
        <Circle cx={3} cy={3} r={3} transform="translate(368 37)" />
      </G>
    </Svg>
  );
};

export const HorizontalDotsIcon = Dots;
