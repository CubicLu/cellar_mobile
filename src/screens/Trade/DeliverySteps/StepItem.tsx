import React, {FC, useMemo, useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import Svg, {Path} from 'react-native-svg';

import colors from '../../../constants/colors';
import textStyle from '../../../constants/Styles/textStyle';

type Props = {
  text: string;
  activeIndex: number;
  index: number;
  maxIndex: number;
  date?: string;
  description?: string;
};

const Step: FC<Props> = ({text, activeIndex, index, maxIndex, date, description}) => {
  const isFirst = useMemo(() => index === 0, [index, activeIndex]);
  const isLast = useMemo(() => index === maxIndex, [index, maxIndex]);
  const isActive = useMemo(() => index >= activeIndex, [index, activeIndex]);
  const prevHighlighted = useMemo(() => activeIndex < index, [index, activeIndex]);
  const nextHighlighted = useMemo(() => activeIndex > index, [index, activeIndex]);
  const [textHeight, setTextHeight] = useState<number>(90);

  return (
    <View style={[!isFirst && topGap]}>
      <View style={rowContainer}>
        <View style={[checkboxContainer, {height: textHeight}]}>
          <View style={strokeContainer}>
            <View style={[topStroke, isFirst ? invisible : visible]}>
              <Svg width={15} height={textHeight / 2}>
                <Path stroke="#fff" strokeWidth={6} strokeDasharray={prevHighlighted ? 3 : 0} d="M0 0v300" />
              </Svg>
            </View>
          </View>
          <View style={checkboxCircleContainer}>
            {isActive ? <View style={emptyCircle} /> : <Feather color={colors.darkRedDrawer} name="check" size={25} />}
          </View>
          <View style={strokeContainer}>
            <View style={[topStroke, bottomStroke, isLast ? invisible : visible]}>
              <Svg width={15} height={(textHeight - 40) / 2}>
                <Path stroke="#fff" strokeWidth={6} strokeDasharray={nextHighlighted ? 0 : 3} d="M0 0v300" />
              </Svg>
            </View>
          </View>
        </View>
        <View onLayout={event => setTextHeight(event.nativeEvent.layout.height)} style={infoContainer}>
          {date && <Text style={[h3, opacity05]}>{date}</Text>}
          <Text style={[h1, textBottomPadding]}>{text}</Text>
          <Text style={h3}>{description}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  topGap: {marginTop: 20},
  h1: {...textStyle.boldText, fontSize: 18, lineHeight: 20, color: '#fff'},
  h3: {...textStyle.mediumText, fontSize: 14, lineHeight: 18, color: '#fff'},
  opacity05: {opacity: 0.5},
  rowContainer: {flexDirection: 'row'},
  checkboxContainer: {
    backgroundColor: colors.darkRedDrawer,
    minHeight: 90,
    width: 90,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topStroke: {
    width: 4,
    left: -2,
    position: 'absolute',
    zIndex: 1,
    top: -21,
    bottom: 0,
  },
  bottomStroke: {
    top: 0,
  },
  visible: {opacity: 1},
  invisible: {opacity: 0},
  strokeContainer: {flex: 1, position: 'relative'},
  emptyCircle: {width: 30, height: 30, backgroundColor: colors.darkRedDrawer, borderRadius: 15},
  checkboxCircleContainer: {
    width: 40,
    height: 40,
    backgroundColor: '#fff',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoContainer: {backgroundColor: '#041B1E', flex: 1, paddingLeft: 20, paddingVertical: 13, paddingRight: 20},
  textBottomPadding: {paddingBottom: 3},
});

const {
  h1,
  h3,
  opacity05,
  topGap,
  rowContainer,
  checkboxContainer,
  topStroke,
  bottomStroke,
  strokeContainer,
  visible,
  invisible,
  emptyCircle,
  checkboxCircleContainer,
  infoContainer,
  textBottomPadding,
} = styles;

export const StepItem = Step;
