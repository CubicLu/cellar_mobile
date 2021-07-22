import * as React from 'react';
import Svg, {Path, Defs} from 'react-native-svg';

type Props = {
  height: number;
  width: number;
  isActive: boolean;
};

const Vintage: React.FC<Props> = ({width, height, isActive}) => {
  const activeColor = isActive ? 'rgba(228, 117, 36, 1)' : '#fff';
  return (
    <Svg
      width={width}
      height={height}
      strokeWidth={0.1}
      viewBox="0 0 24.375 40"
      stroke={activeColor}
      fill={activeColor}>
      <Defs />
      <Path d="M22.507 35.938H22.5v-5.7a7.576 7.576 0 00-2.789-5.482l-5.961-4.38v-.745l5.961-4.38A7.576 7.576 0 0022.5 9.769v-5.7h.006a1.871 1.871 0 001.869-1.875v-.319A1.871 1.871 0 0022.506 0H1.876A1.878 1.878 0 000 1.875v.312a1.878 1.878 0 001.876 1.875l.008 5.7a7.533 7.533 0 002.77 5.478l5.971 4.387v.738L4.65 24.753a7.538 7.538 0 00-2.775 5.478v5.7a1.878 1.878 0 00-1.876 1.875v.313A1.878 1.878 0 001.876 40h20.631a1.871 1.871 0 001.868-1.875v-.313a1.871 1.871 0 00-1.868-1.874zm-1.257 0h-1.562v-4.9a5.571 5.571 0 00-2.041-4.048l-5.078-3.742a.622.622 0 00-.74 0l-5.1 3.745a5.564 5.564 0 00-2.048 4.046v4.9H3.125v-5.7a6.35 6.35 0 012.269-4.471l6.227-4.574a.624.624 0 00.254-.5v-1.379a.623.623 0 00-.251-.5l-6.232-4.574A6.348 6.348 0 013.125 9.77v-5.7H21.25v5.7a6.384 6.384 0 01-2.281 4.472l-6.2 4.567a.633.633 0 00-.264.5v1.376a.624.624 0 00.254.5l6.21 4.573a6.383 6.383 0 012.281 4.476z" />
      <Path d="M17.874 12.314a.625.625 0 00-.594-.43H7.106a.625.625 0 00-.37 1.129l5.1 3.744a.623.623 0 00.741 0l5.072-3.745a.625.625 0 00.225-.698z" />
    </Svg>
  );
};

export const VintageIcon = Vintage;