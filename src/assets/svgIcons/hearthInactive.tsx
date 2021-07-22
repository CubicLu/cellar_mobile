import React from 'react';
import Svg, {Path, Defs, Pattern, Use, Image} from 'react-native-svg';

type Props = {
  width: number;
  height: number;
};

const HearthInactive: React.FC<Props> = ({width, height}) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 67 60" fill="none">
      <Path fill="url(#prefix__pattern0)" d="M0 0h67v60H0z" />
      <Defs>
        <Pattern id="prefix__pattern0" patternContentUnits="objectBoundingBox" width={1} height={1}>
          <Use xlinkHref="#prefix__image0" transform="scale(.01493 .01667)" />
        </Pattern>
        <Image
          id="prefix__image0"
          width={67}
          height={60}
          xlinkHref="data:image/png;base64,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"
        />
      </Defs>
    </Svg>
  );
};

export const HearthInactiveIcon = HearthInactive;
