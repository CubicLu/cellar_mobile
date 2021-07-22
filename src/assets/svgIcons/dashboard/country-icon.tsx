import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

type Props = {
  height: number;
  width: number;
  isActive: boolean;
};

const Country: React.FC<Props> = ({width, height, isActive}) => {
  const activeColor = isActive ? 'rgba(228, 117, 36, 1)' : '#fff';
  return (
    <Svg
      width={width}
      height={height}
      strokeWidth={0.1}
      viewBox="0 0 39.994 40"
      stroke={activeColor}
      fill={activeColor}>
      <Path d="M36.607 8.872l-.6.19-3.187.284-.9 1.437-.654-.208-2.535-2.286-.367-1.189-.494-1.268-1.593-1.43-1.881-.368-.043.861 1.842 1.8.9 1.062-1.013.53-.827-.246-1.236-.516.041-1-1.618-.659-.539 2.344-1.635.371.162 1.308 2.131.41.368-2.089 1.757.26.817.479h1.311l.9 1.8 2.381 2.414-.176.938L28 13.857l-3.314 1.674-2.388 2.855-.311 1.268h-.858l-1.6-.736-1.551.736.386 1.637.675-.779 1.187-.037-.083 1.469.983.288.982 1.1 1.6-.449 1.831.288 2.126.572 1.068.123 1.8 2.044 3.475 2.044-2.247 4.293-2.372 1.1-.9 2.455-3.434 2.296-.367 1.322A19.973 19.973 0 0036.607 8.872z" />
      <Path d="M22.296 30.452l-1.457-2.7 1.337-2.786-1.337-.4-1.501-1.508-3.326-.746-1.1-2.31v1.371h-.486l-2.87-3.885v-3.192l-2.1-3.416-3.336.595H3.872l-1.131-.742L4.184 9.59l-1.439.332A19.972 19.972 0 0019.996 40a20.976 20.976 0 002.511-.176l-.211-2.421s.917-3.6.917-3.72-.917-3.231-.917-3.231zM7.43 6.449l3.552-.5 1.637-.9 1.842.531 2.944-.163 1.008-1.585 1.471.242 3.571-.335.984-1.085 1.388-.927 1.963.3.714-.108A19.932 19.932 0 004.577 7.271h.01zm13.41-4.46L22.882.865l1.311.758-1.9 1.445-1.813.182-.816-.53zm-6.049.164l.9.376 1.18-.376.643 1.114-2.725.716-1.312-.767s1.284-.825 1.314-1.063z" />
    </Svg>
  );
};

export const CountryIcon = Country;