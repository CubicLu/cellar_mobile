import React, {FC} from 'react';
import {View} from 'react-native';
import Svg, {Path, Defs, Pattern, Use, Image} from 'react-native-svg';

type Props = {
  width: number;
  height: number;
};

const HearthActive: FC<Props> = ({width, height}) => {
  return (
    <View style={{borderWidth: 1}}>
      <Svg width={width} height={height} viewBox="0 0 67 60" fill="none" strokeWidth={2}>
        <Path fill="url(#prefix__pattern0)" d="M0 0h67v60H0z" />
        <Defs>
          <Pattern id="prefix__pattern0" patternContentUnits="objectBoundingBox" width={1} height={1}>
            <Use xlinkHref="#prefix__image0" transform="scale(.01493 .01667)" />
          </Pattern>
          <Image
            id="prefix__image0"
            width={67}
            height={60}
            xlinkHref="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEMAAAA8CAMAAAAKYPdVAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAABp1BMVEXmdQ7////mdQ7mdQ7mdQ7mdQ7mdQ7mdQ7mdQ7mdQ7mdQ7mdQ7mdQ7mdQ7mdQ7mdQ7mdQ7mdQ7mdQ7mdQ7mdQ7mdQ7mdQ7mdQ7mdQ7mdQ7mdQ7mdQ7mdQ7mdQ7mdQ7mdQ7mdQ7mdQ7mdQ7mdQ7mdQ7mdQ7mdQ7mdQ7mdQ7mdQ7mdQ7mdQ7mdQ7mdQ7mdQ7mdQ7mdQ7mdQ7mdQ7mdQ7mdQ7mdQ7mdQ7mdQ7mdQ7mdQ7mdQ7mdQ7mdQ7mdQ7mdQ7mdQ7mdQ7mdQ7mdQ7mdQ7mdQ7mdQ7mdQ7mdQ7mdQ7mdQ7mdQ7mdQ7mdQ7mdQ7mdQ7mdQ7mdQ7mdQ7mdQ7mdQ7mdQ7mdQ7mdQ7mdQ7mdQ7mdQ7mdQ7mdQ7mdQ7mdQ7mdQ7mdQ7mdQ7mdQ7mdQ7mdQ7mdQ7mdQ7mdQ7mdQ7mdQ7mdQ7mdQ7mdQ7mdQ7mdQ7mdQ7mdQ7mdQ7mdQ7mdQ7mdQ7mdQ7mdQ7mdQ7mdQ7mdQ7mdQ7mdQ7mdQ7mdQ7mdQ7mdQ7mdQ7mdQ7mdQ7mdQ7mdQ7mdQ7mdQ7mdQ7mdQ7mdQ7mdQ7mdQ7mdQ4AAADY3V+CAAAAjHRSTlMAACpagJuwt6eRcUURDD9qjaO2sp6FYDIFZ73m3Jw5k9fFdw9hzKEvH9gVsWxU4iY1mIFOoIMT5HAsS9AL5RICz48G3ohmHnPdA7id1qQOhI6qq8TB0bqMiUQtbsI6symuyhczvNkBT3J+n6/J4RvUJUE0Ulw4VUDgWOMnzjwWhnzLECNrIDcKrBpCXTfBmO8AAAABYktHRIxsC9JDAAAACXBIWXMAAAsSAAALEgHS3X78AAAAB3RJTUUH5AYYDBYFPgTB2AAAAiJJREFUSMel12lX00AUBuC3bNKiIqhQOmzFFiwiWOtCUcqOImspBay4IOAOCCqigqACiv5pQyht0mQmydz7Mfc9zzk5ZzL3BtBUXn5BYdGpYren5DTM6szZ0nNl5ecvXKyozDxzuVzZgLfKxzJVXVNrEPLq6rMBf8MloxEIMn01NumEy+6cfsjj1RvNV5ixWjTE1VZj39+mNa6FmFmFM8R10z6LZI1KxqkbaeImLxA5MW7d5kWYWyXauX0WTRvl/AjrUPpRQf/OXdUoFURYZwxd3aJAz5HR2yeKsH4MCPtsUDHuiSP3hx6IA8OKMSKOsNE+i8AYmhi1IqgiG+OYIBtxTJKNBKbIRjcSZCOJabIRxCjZ8GGGbMTRQjZm8ZBsBBDrpBopwEck6pXv9hHRCCvGGPFlUkd3Ie2EzKn36WOSkX98rz8hEMmhY+Mpweg4mXPPpIn5zKx8Lm0sZGe27KU6q90dFqWIpRdaIyZlpPR70EsJ4lXuLvXaMfHGuNO9dUi88xoNBB0Ry80muyVWVp0YC2b7KfDeAbEGcwPrtokP4BlYs0l8BN/AJ1vEBkQGPm9aE18gNhD9akWUwMrAty2hsLkNawPfRRMnGYUdA4hziTnDzxHPwA6HqPHCtoGAKbFrkuQbqP1hEKojcGbgZ1EOkfgFpwawqyPquiBhYENz3PZ4IQsD+/60EDqArIHfYZX4cwh5A/AwdRKRDPz1/YOF8R/pBU23UdzEjAAAAABJRU5ErkJggg=="
          />
        </Defs>
      </Svg>
    </View>
  );
};

export const HearthActiveIcon = HearthActive;
