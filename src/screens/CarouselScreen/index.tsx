import React, {FC, useRef} from 'react';
import {View, Text, StyleSheet, FlatList, TouchableOpacity, Image, Dimensions, Animated, StatusBar} from 'react-native';
import {getStatusBarHeight} from 'react-native-iphone-x-helper';

import textStyle from '../../constants/Styles/textStyle';
import {NavigationEvents} from 'react-navigation';
import Navigation from '../../types/navigation';
import {slides} from '../../constants/slides';
import Colors from '../../constants/colors';

type Props = {navigation: Navigation};
type Slide = {
  key: string;
  title: string;
  text: string;
  backgroundColor: string;
  image: any;
};

const screenWidth = Dimensions.get('screen').width;

const Carousel: FC<Props> = ({navigation}) => {
  const slideRef = useRef<FlatList<Slide>>();
  const scrollX = new Animated.Value(0);
  let position = Animated.divide(scrollX, screenWidth);

  const onPressNext = index => {
    slideRef.current.scrollToIndex({animated: true, index: index + 1});
  };

  const renderItem = ({item, index}) => {
    return (
      <View style={[mainContainer, {backgroundColor: item.backgroundColor}]}>
        <View style={skipContainer}>
          {index !== slides.length - 1 && (
            <TouchableOpacity onPress={() => navigation.goBack()} style={touchSkip}>
              <Text style={[styleText, {fontSize: 21}]}>Skip</Text>
            </TouchableOpacity>
          )}
        </View>
        <View style={{flex: 3}}>
          <Image source={item.image} style={imageStyle} resizeMode={'contain'} />
        </View>
        <View style={textContainer}>
          <Text allowFontScaling={false} adjustsFontSizeToFit numberOfLines={6} style={[styleText, centerAlign]}>
            {item.text}
          </Text>
        </View>

        <View style={[doneContainer]}>
          <TouchableOpacity
            style={doneTouch}
            onPress={() => {
              if (index === slides.length - 1) {
                navigation.goBack();
              } else {
                onPressNext(index);
              }
            }}>
            <Text style={buttonText}>{index === slides.length - 1 ? "LET'S GET STARTED!" : 'NEXT'}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={container}>
      <NavigationEvents
        onWillFocus={() => {
          StatusBar.setBarStyle('light-content');
        }}
      />
      <FlatList
        pagingEnabled={true}
        data={slides}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={item => item.key}
        renderItem={renderItem}
        ref={slideRef}
        onScroll={Animated.event([{nativeEvent: {contentOffset: {x: scrollX}}}])}
        scrollEventThrottle={16}
      />

      <View style={dotsContainer}>
        {slides.map((_, i) => {
          let opacity = position.interpolate({
            inputRange: [i - 1, i, i + 1],
            outputRange: [0.3, 1, 0.3],
            extrapolate: 'clamp',
          });
          return <Animated.View key={i} style={[{opacity}, pageIndicator]} />;
        })}
      </View>
    </View>
  );
};

export const CarouselScreen = Carousel;

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#093B42',
    paddingTop: getStatusBarHeight(true),
  },
  mainContainer: {
    flex: 1,
    width: screenWidth,
    paddingHorizontal: screenWidth < 375 ? 15 : 30,
  },
  skipContainer: {
    marginTop: 5,
    height: 40,
  },
  styleText: {
    ...textStyle.mediumText,
    color: 'white',
    fontSize: screenWidth < 375 ? 16 : 18,
    lineHeight: 24,
  },
  centerAlign: {
    textAlign: 'center',
  },
  innerContainer: {
    alignItems: 'center',
    justifyContent: 'space-between',
    height: '85%',
  },
  imageStyle: {
    height: '100%',
    width: '100%',
  },
  doneContainer: {
    height: '10%',
    minWidth: '71%',
    marginTop: '7%',
    alignSelf: 'center',
  },
  buttonText: {
    ...textStyle.boldText,
    fontSize: 21,
    color: '#fff',
  },
  doneTouch: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.orangeDashboard,
    paddingHorizontal: 10,
  },
  touchSkip: {
    alignSelf: 'flex-end',
  },
  pageIndicator: {
    width: 8,
    height: 8,
    backgroundColor: '#fff',
    borderRadius: 4,
    marginHorizontal: 3,
  },
  dotsContainer: {
    height: 50,
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: screenWidth < 375 ? 25 : 0,
  },
  textContainer: {
    flex: screenWidth < 375 ? 2 : 1,
    justifyContent: screenWidth < 375 ? 'center' : 'flex-start',
  },
});

const {
  mainContainer,
  styleText,
  centerAlign,
  dotsContainer,
  imageStyle,
  doneContainer,
  doneTouch,
  touchSkip,
  pageIndicator,
  textContainer,
  skipContainer,
  container,
  buttonText,
} = style;
