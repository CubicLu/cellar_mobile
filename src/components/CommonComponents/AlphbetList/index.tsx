import React, {FC, useEffect, useRef, useState} from 'react';
import {View, Text, StyleSheet, Animated, PanResponder, Dimensions} from 'react-native';
import _ from 'lodash';
import colors from '../../../constants/colors';
import textStyle from '../../../constants/Styles/textStyle';
import {UPPER_CASE_ALPHABET} from '../../../constants/text';
import CONFIG from '../../../constants/config';
import {isIphoneX} from 'react-native-iphone-x-helper';

type Props = {
  onTextChange: (value: string) => void;
  disabledItems?: string[];
  highlight: boolean;
};

interface ComponentMeasuredData {
  x: number;
  y: number;
  width: number;
  height: number;
  pageX: number;
  pageY: number;
}

const screenHeight = Dimensions.get('screen').height;

const TOUCHABLE_WIDTH = 45;

export const AlphabetList: FC<Props> = ({onTextChange, highlight, disabledItems = []}) => {
  const [listLayout, setListLayout] = useState({x: 0, y: 0, width: 0, height: 0});
  const [isLetterVisible, setIsLetterVisible] = useState(true);
  const [currentY, setCurrentY] = useState(0);
  const [indexToHL, setIndexToHL] = useState(-1);
  const [maxItemHeight, setMaxItemHeight] = useState(10);

  const right = useRef(new Animated.Value(0)).current;
  const containerViewRef = useRef<View>(null);

  const [containerLayout, setContainerLayout] = useState<ComponentMeasuredData>({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    pageX: 0,
    pageY: 0,
  });

  const panResponder = React.useRef(
    PanResponder.create({
      onStartShouldSetPanResponderCapture: () => {
        setIsLetterVisible(true);
        return true;
      },
      onPanResponderGrant: (evt, gestureState) => {
        const {dy, y0} = gestureState;
        setCurrentY(y0 + dy);
      },
      onPanResponderMove: (evt, gestureState) => {
        const {dy, y0} = gestureState;
        setCurrentY(y0 + dy);
      },
      onPanResponderRelease: () => {
        setIsLetterVisible(false);
      },
    }),
  ).current;

  useEffect(() => {
    const index = Math.ceil((currentY - containerLayout.pageY) / (listLayout.height / UPPER_CASE_ALPHABET.length));

    if (_.inRange(index, 1, UPPER_CASE_ALPHABET.length + 1)) {
      if (!disabledItems.includes(UPPER_CASE_ALPHABET[index - 1])) {
        onTextChange(UPPER_CASE_ALPHABET[index - 1]);
      }
      setIndexToHL(index);
    }
  }, [containerLayout, currentY, listLayout]);

  useEffect(() => {
    showAlphabetFn();
  }, []);

  useEffect(() => {
    const maxHeight =
      (screenHeight -
        containerLayout.pageY -
        (isIphoneX()
          ? CONFIG.IPHONE_X_BOTTOM_TAB_NAVIGATOR_HEIGHT
          : CONFIG.NOT_IPHONE_X_BOTTOM_TAB_NAVIGATOR_HEIGHT + 10)) /
      UPPER_CASE_ALPHABET.length;
    setMaxItemHeight(maxHeight);
  }, [containerLayout]);

  const showAlphabetFn = () => {
    Animated.timing(right, {
      toValue: 1,
      duration: 1300,
    }).start();
  };

  return (
    <View
      ref={containerViewRef}
      onLayout={() => {
        containerViewRef.current.measure((x, y, width, height, pageX, pageY) => {
          setContainerLayout({x, y, width, height, pageX, pageY});
        });
      }}
      style={[listContainer]}>
      <View style={{width: TOUCHABLE_WIDTH}} {...panResponder.panHandlers}>
        <Animated.FlatList<string>
          data={UPPER_CASE_ALPHABET}
          onLayout={event => setListLayout(event.nativeEvent.layout)}
          keyExtractor={item => item}
          scrollEnabled={false}
          style={[{opacity: right}, overflowVisible]}
          renderItem={({item, index}) => {
            return (
              <View style={letterContainer}>
                <View style={flexRow}>
                  {isLetterVisible && index + 1 === indexToHL && !disabledItems.includes(item) && (
                    <View style={previewLetter}>
                      <Text style={previewLetterText}>{item}</Text>
                    </View>
                  )}
                  <View
                    style={[
                      pickerContainer,
                      {
                        maxHeight: maxItemHeight,
                      },
                    ]}>
                    <Text
                      maxFontSizeMultiplier={1}
                      adjustsFontSizeToFit={true}
                      style={[
                        pickerText,
                        index + 1 === indexToHL && highlight && pickerTextActive,
                        disabledItems.includes(item) && pickerTextDisabled,
                      ]}>
                      {item}
                    </Text>
                  </View>
                </View>
              </View>
            );
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  listContainer: {
    position: 'absolute',
    zIndex: 1,
    right: 0,
    top: 0,
  },
  overflowVisible: {
    overflow: 'visible',
  },
  letterContainer: {
    flexDirection: 'row',
    position: 'relative',
    justifyContent: 'flex-end',
  },
  flexRow: {
    flexDirection: 'row',
  },
  previewLetter: {
    position: 'absolute',
    backgroundColor: colors.orangeDashboard,
    zIndex: 2,
    left: -100,
    top: '-50%',
    borderRadius: 5,
    padding: 5,
    opacity: 1,
  },
  previewLetterText: {color: '#fff', fontSize: 25, ...textStyle.mediumText},
  pickerContainer: {
    backgroundColor: 'rgba(5,27,30,0.4)',
    width: 20,
  },
  pickerText: {
    textAlign: 'center',
    color: '#fff',
    ...textStyle.mediumText,
    opacity: 0.8,
  },
  pickerTextActive: {
    color: colors.orangeDashboard,
    opacity: 1,
  },
  pickerTextDisabled: {
    opacity: 0.3,
  },
});

const {
  listContainer,
  overflowVisible,
  letterContainer,
  flexRow,
  previewLetter,
  previewLetterText,
  pickerContainer,
  pickerText,
  pickerTextActive,
  pickerTextDisabled,
} = styles;
