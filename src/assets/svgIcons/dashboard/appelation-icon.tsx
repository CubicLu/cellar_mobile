import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

type Props = {
  height: number;
  width: number;
  isActive: boolean;
};

const Appellation: React.FC<Props> = ({width, height, isActive}) => {
  const activeColor = isActive ? 'rgba(228, 117, 36, 1)' : '#fff';
  return (
    <Svg
      width={width}
      height={height}
      strokeWidth={0.1}
      viewBox="0 0 25.396 40"
      stroke={activeColor}
      fill={activeColor}>
      <Path d="M10.389 33.605v-9.627-.04c0-1.052.006-1.923.011-2.489.047-5.069-2.835-5.765-3.465-9.837v-8.1a1.211 1.211 0 00-.065-.378 1.249 1.249 0 00.484-.985v-.892a1.259 1.259 0 00-1.26-1.259h-1.47a1.259 1.259 0 00-1.259 1.259v1a1.26 1.26 0 00.294.81 1.245 1.245 0 00-.084.45v8.211c-1.366 5.268-3.571 5.2-3.571 9.728v17.287a1.26 1.26 0 001.26 1.26h7.875a1.26 1.26 0 001.26-1.26s-.005-2.225-.009-5.109c-.004-.01-.001-.017-.001-.029zM3.88 7.536a.968.968 0 01.949-.988h.738a.969.969 0 01.949.988v3.415a.969.969 0 01-.949.988h-.738a.969.969 0 01-.949-.988zM1.856 18.108c.466-1.472 1.474-2.465 2.251-2.22s-.377 1.194-.842 2.666-.064 2.91-.842 2.665-1.03-1.634-.567-3.107zm8.053 16.515a1.144 1.144 0 01-1.144 1.143H1.629a1.143 1.143 0 01-1.144-1.143v-8.736a1.143 1.143 0 011.144-1.143h7.139a1.144 1.144 0 011.144 1.143zM25.389 33.605v-9.627-.04c0-1.052.006-1.923.011-2.489.047-5.069-2.835-5.765-3.465-9.837v-8.1a1.211 1.211 0 00-.065-.378 1.249 1.249 0 00.484-.985v-.892a1.259 1.259 0 00-1.26-1.259h-1.47a1.259 1.259 0 00-1.259 1.259v1a1.26 1.26 0 00.294.81 1.245 1.245 0 00-.084.45v8.211c-1.366 5.268-3.571 5.2-3.571 9.728v17.287a1.26 1.26 0 001.26 1.26h7.875a1.26 1.26 0 001.26-1.26s-.005-2.225-.009-5.109c-.004-.01-.001-.017-.001-.029zM18.88 7.536a.968.968 0 01.949-.988h.738a.969.969 0 01.949.988v3.415a.969.969 0 01-.949.988h-.738a.969.969 0 01-.949-.988zm-2.024 10.572c.466-1.472 1.474-2.465 2.251-2.22s-.377 1.194-.842 2.666-.064 2.91-.842 2.665-1.03-1.634-.567-3.107zm8.053 16.515a1.144 1.144 0 01-1.144 1.143h-7.136a1.143 1.143 0 01-1.144-1.143v-8.736a1.143 1.143 0 011.144-1.143h7.139a1.144 1.144 0 011.144 1.143z" />
    </Svg>
  );
};

export const AppellationIcon = Appellation;
