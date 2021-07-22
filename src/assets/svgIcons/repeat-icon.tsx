import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

type Props = {
  width: number;
  height: number;
};

const Repeat: React.FC<Props> = ({width, height}) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 49 49" fill="none">
      <Path
        d="M15.428 9.218l7.963-5.668.034 4.05.712.002a16.88 16.88 0 0112 5.02c6.602 6.65 6.56 17.433-.091 24.037-6.652 6.604-17.436 6.567-24.038-.083S5.447 19.143 12.1 12.54l2.318 2.334c-5.365 5.326-5.398 14.022-.074 19.385 5.325 5.363 14.02 5.393 19.385.067 5.365-5.326 5.398-14.022.074-19.385a13.613 13.613 0 00-9.678-4.048l-.711-.003.01 3.983-7.995-5.654z"
        fill="#fff"
      />
    </Svg>
  );
};

export const RepeatIcon = Repeat;
