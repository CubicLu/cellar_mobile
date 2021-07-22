import * as React from 'react';
import Svg, {Defs, Path} from 'react-native-svg';

type Props = {
  height: number;
  width: number;
  isActive: boolean;
};

const Producer: React.FC<Props> = ({width, height, isActive}) => {
  const activeColor = isActive ? 'rgba(228, 117, 36, 1)' : '#fff';
  return (
    <Svg width={width} height={height} strokeWidth={0.1} viewBox="0 0 45.71 40" stroke={activeColor} fill={activeColor}>
      <Defs />
      <Path d="M13.523 25.53H37.88v5.468H13.523zM13.523 17.879H37.88v6.328H13.523zM13.523 10.766H37.88v5.79H13.523zM41.492 7.336v2.107h4.171a28.806 28.806 0 00-4.171-2.107zM6.721 25.602v5.4h3.334v-5.468H6.723zM10.053 9.442V7.727a27.842 27.842 0 00-3.269 1.715zM28.181 2.496h-1.9v-2.5h-2.233v2.5h-1.831v2.182a40.393 40.393 0 00-8.614 1.7v-.006l-.078.027V9.44h24.358V6.083a41.736 41.736 0 00-9.7-1.541zM41.492 34.55a28.5 28.5 0 004.218-2.131v-.1h-4.218zM6.721 10.837v5.718h3.334v-5.79H6.723zM41.492 30.998h4.219V25.53h-4.219zM41.492 10.766v5.79h4.219v-5.79zM41.492 24.207h4.219v-6.328h-4.219z" />
      <Path d="M6.721 17.951v.187c-.06-.006-.117-.018-.177-.018H4.486v-2.959h1.919V14.03h-5.01v1.131h1.919v2.961h-.886a1.915 1.915 0 00-.4.043 1.655 1.655 0 00-2.03 1.614v2.069a1.657 1.657 0 103.314 0v-.008h3.23c.06 0 .117-.012.177-.018v2.387h3.331v-6.327H6.719zM13.527 35.486l.078.024v4.489h3.485V38.52h7.918v.017h9.219v1.45l3.544.011.01-4.167.053-.015.02-.007.03-.007V32.32H13.527zM6.721 32.394v.016a28.222 28.222 0 003.331 1.753V32.32H6.721z" />
    </Svg>
  );
};

export const ProducerIcon = Producer;
