import * as React from 'react';
import Svg, {Path} from 'react-native-svg';
import colors from '../../constants/colors';

type Props = {
  height: number;
  width: number;
};

const AddLocation: React.FC<Props> = ({width, height}) => {
  return (
    <Svg width={width} height={height} stroke="#fff" fill={colors.orangeDashboard} viewBox="0 0 512 512">
      <Path d="M192 0C86.112 0 0 86.112 0 192c0 133.088 173.312 307.936 180.672 315.328a16.07 16.07 0 0022.656 0c2.176-2.176 19.136-19.36 41.664-45.536C232 438.656 224 412.384 224 384c0-87.2 69.824-157.792 156.576-159.648C382.592 213.376 384 202.528 384 192 384 86.112 297.888 0 192 0zm0 288c-52.928 0-96-43.072-96-96s43.072-96 96-96 96 43.072 96 96-43.072 96-96 96z" />
      <Path
        fill={'#fff'}
        d="M384 256c-70.688 0-128 57.312-128 128s57.312 128 128 128 128-57.312 128-128-57.312-128-128-128zm48 144h-32v32c0 8.832-7.168 16-16 16s-16-7.168-16-16v-32h-32c-8.832 0-16-7.168-16-16s7.168-16 16-16h32v-32c0-8.832 7.168-16 16-16s16 7.168 16 16v32h32c8.832 0 16 7.168 16 16s-7.168 16-16 16z"
      />
    </Svg>
  );
};

export const AddLocationIcon = AddLocation;
