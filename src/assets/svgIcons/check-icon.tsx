import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

type Props = {
  width: number;
  height: number;
  color?: string;
};

const Check: React.FC<Props> = ({width, height}) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 40 40">
      <Path
        d="M31.75 7H9.25A2.248 2.248 0 007 9.25v22.5A2.248 2.248 0 009.25 34h22.5A2.248 2.248 0 0034 31.75V9.25A2.248 2.248 0 0031.75 7zm-3.691 9.457l-9.4 9.443h-.007a1.27 1.27 0 01-.816.387 1.231 1.231 0 01-.823-.4l-3.937-3.937a.28.28 0 010-.4l1.251-1.25a.272.272 0 01.394 0l3.122 3.122 8.578-8.641a.278.278 0 01.2-.084.255.255 0 01.2.084l1.23 1.273a.277.277 0 01.008.403z"
        fill="#fff"
      />
    </Svg>
  );
};

export const CheckMark: React.FC<Props> = ({width, height, color = 'white'}) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 45.701 45.7">
      <Path
        fill={color}
        d="M20.687 38.332a5.308 5.308 0 01-7.505 0L1.554 26.704A5.306 5.306 0 119.059 19.2l6.928 6.927a1.344 1.344 0 001.896 0L36.642 7.368a5.308 5.308 0 017.505 7.504l-23.46 23.46z"
      />
    </Svg>
  );
};

export const CheckIcon = Check;
