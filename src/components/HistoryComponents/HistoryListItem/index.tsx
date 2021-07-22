import React, {FC} from 'react';
import {View, Text, StyleSheet, TouchableWithoutFeedback, Alert} from 'react-native';

import textStyle from '../../../constants/Styles/textStyle';
import {TinyBottleIcon, ChatBubblesIcon} from '../../../assets/svgIcons';
import {LatestReview} from '../LatestReview';
import {RateValue} from '../RateValue';
import {QuotesComment} from '../..';

type Props = {
  onClick: () => void;
  wine: any;
  bottleCount: number;
  bubbleCount: number;
  variant: 'drink-history' | 'community-history';
  lastReview: {
    rating: number;
    drinkNote: string;
    userPublic: {
      avatarURL: string;
      userName: string;
    };
  };
};

function renderHistoryItem(props: Props) {
  const {
    onClick,
    bubbleCount,
    bottleCount,
    wine: {producer, wineName, color, rating},
    variant,
    lastReview,
  } = props;

  switch (variant) {
    case 'community-history':
      return (
        <View style={container}>
          <View style={[wineColorView, {backgroundColor: color}]} />
          <TouchableWithoutFeedback style={flex1} onPress={onClick}>
            <View style={touchable}>
              <View style={{flexWrap: 'wrap', flexDirection: 'row'}}>
                <Text style={[font, h1]}>{producer}</Text>
                {!!rating && <RateValue rating={rating} />}
              </View>
              {!!wineName && <Text style={[font, h2]}>{wineName}</Text>}
              {lastReview && (
                <View style={reviewContainer}>
                  <LatestReview
                    avatarUrl={lastReview.userPublic.avatarURL}
                    rating={lastReview.rating}
                    userName={lastReview.userPublic.userName}
                  />
                  {!!lastReview.drinkNote && <QuotesComment text={lastReview.drinkNote} />}
                </View>
              )}
            </View>
          </TouchableWithoutFeedback>
          <View style={[iconsContainer, justifySA]}>
            <View style={detailsContainer}>
              <TinyBottleIcon width={17} height={17} />
              <Text style={[font, countText]}>{bottleCount}</Text>
            </View>
            {bubbleCount > 0 && (
              <View style={detailsContainer}>
                <View style={iconMargin}>
                  <ChatBubblesIcon width={10} height={10} />
                </View>
                <Text style={[font, countText]}>{bubbleCount}</Text>
              </View>
            )}
          </View>
        </View>
      );

    case 'drink-history':
      return (
        <View style={container}>
          <View style={[wineColorView, {backgroundColor: color}]} />
          <TouchableWithoutFeedback style={flex1} onPress={onClick}>
            <View style={touchable}>
              <Text style={[font, h1]}>{producer}</Text>
              {!!wineName && <Text style={[font, h2]}>{wineName}</Text>}
            </View>
          </TouchableWithoutFeedback>
          <View style={iconsContainer}>
            <View style={detailsContainer}>
              <TinyBottleIcon width={17} height={17} />
              <Text style={[font, countText]}>{bottleCount}</Text>
            </View>
            {bubbleCount > 0 && (
              <View style={detailsContainer}>
                <View style={iconMargin}>
                  <ChatBubblesIcon width={10} height={10} />
                </View>
                <Text style={[font, countText]}>{bubbleCount}</Text>
              </View>
            )}
          </View>
        </View>
      );

    default: {
      if (__DEV__) {
        Alert.alert('Invalid variant prop for the HistoryListItem');
      }
      return null;
    }
  }
}

export const HistoryListItem: FC<Props> = props => {
  return renderHistoryItem(props);
};

const styles = StyleSheet.create({
  container: {backgroundColor: '#041B1E', marginBottom: 2, minHeight: 60, flexDirection: 'row'},
  touchable: {flex: 1, justifyContent: 'center', paddingVertical: 5},
  flex1: {flex: 1},
  font: {
    color: '#fff',
    lineHeight: 25,
    letterSpacing: 0.9,
  },
  h1: {
    ...textStyle.boldText,
    fontSize: 18,
  },
  h2: {
    ...textStyle.mediumText,
    fontSize: 14,
    lineHeight: 19,
    letterSpacing: 0.7,
  },
  countText: {
    fontSize: 14,
    lineHeight: 19,
    letterSpacing: 0.7,
    ...textStyle.mediumText,
    textAlign: 'right',
  },
  detailsContainer: {paddingRight: 19, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'},
  wineColorView: {width: 10, marginRight: 16},
  iconMargin: {marginRight: 7},
  iconsContainer: {justifyContent: 'center', alignItems: 'center', flex: 0},
  justifySA: {
    justifyContent: 'space-around',
  },
  reviewContainer: {marginTop: 10},
});

const {
  container,
  flex1,
  touchable,
  font,
  h1,
  h2,
  iconMargin,
  detailsContainer,
  countText,
  wineColorView,
  iconsContainer,
  reviewContainer,
  justifySA,
} = styles;
