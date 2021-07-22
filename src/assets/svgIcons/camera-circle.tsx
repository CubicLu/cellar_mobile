import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

type Props = {
  height: number;
  width: number;
};
const Circles: React.FC<Props> = ({width, height}) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 73 73" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M36.5 69C54.45 69 69 54.45 69 36.5S54.45 4 36.5 4 4 18.55 4 36.5 18.55 69 36.5 69zm0 4C56.658 73 73 56.658 73 36.5S56.658 0 36.5 0 0 16.342 0 36.5 16.342 73 36.5 73z"
        fill="#F9F9F9"
      />
      <Path d="M65 36.5C65 52.24 52.24 65 36.5 65S8 52.24 8 36.5 20.76 8 36.5 8 65 20.76 65 36.5z" fill="#F9F9F9" />
    </Svg>
  );
};

export const CameraShotIcon = Circles;
