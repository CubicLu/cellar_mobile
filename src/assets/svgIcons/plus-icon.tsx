import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

type Props = {
  width: number;
  height: number;
};

const Plus: React.FC<Props> = ({width, height}) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 35 34" fill="none">
      <Path
        d="M20.687 13.964a.607.607 0 01-.608-.607V0h-6.071v13.357a.607.607 0 01-.607.607H.044v6.072H13.4c.335 0 .607.272.607.607V34h6.071V20.643c0-.335.272-.607.608-.607h13.357v-6.072H20.687z"
        fill="#fff"
      />
    </Svg>
  );
};

export const PlusIcon = Plus;
