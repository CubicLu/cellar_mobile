import React, {FC, useState} from 'react';
import {View, Text, StyleSheet, Dimensions, TouchableOpacity, ActivityIndicator} from 'react-native';
import {Image} from 'react-native-elements';

import {Review} from '../../HistoryComponents/Review';
import colors from '../../../constants/colors';
import {BottleIcon, DashedLineIcon} from '../../../assets/svgIcons';
import textStyle from '../../../constants/Styles/textStyle';
import {RateValue} from '../../HistoryComponents/RateValue';
import {QuotesComment} from '../QutesComment';

type Props = {
  highlight?: boolean;
  title: string;
  varietal: string;
  subregion: string;
  averageRating: number;
  onPress: () => void;
  pictureURL: string;
  color: string;
  lastReview: {
    drinkNote: string;
    drinkDate: Date;
    userName: string;
    rating: number;
    avatarURL: string;
    prettyLocationName: string;
    authorizedTrader: boolean;
  };
};

const screenWidth = Dimensions.get('screen').width;

const ReviewItem: FC<Props> = ({
  highlight,
  onPress,
  title,
  varietal,
  subregion,
  averageRating,
  lastReview,
  pictureURL,
  color,
}) => {
  const [isFailed, setIsFailed] = useState(false);

  return (
    <TouchableOpacity activeOpacity={0.8} onPress={onPress} style={[container, highlight && hlBg]}>
      <View style={flexRow}>
        <View style={imageContainer}>
          {!(isFailed || pictureURL) ? (
            <View style={imagePlaceHolderContainer}>
              <BottleIcon color={colors.inventoryItemBg} width={90} height={150} />
            </View>
          ) : (
            <Image
              style={img}
              source={
                pictureURL
                  ? {
                      uri: pictureURL,
                    }
                  : null
              }
              PlaceholderContent={<ActivityIndicator size={'large'} />}
              placeholderStyle={imageLoaderContainer}
              resizeMethod="auto"
              resizeMode="cover"
              onError={() => setIsFailed(true)}
            />
          )}
          <View style={[wineColor, {backgroundColor: color}]} />
        </View>
        <View style={detailsContainer}>
          <View style={flexRow}>
            <View style={flex1}>
              <Text numberOfLines={3} adjustsFontSizeToFit allowFontScaling={false} style={h1}>
                {title}
              </Text>
            </View>
            {!!averageRating && (
              <View style={ratingContainer}>
                <RateValue rating={averageRating} size={20} />
              </View>
            )}
          </View>
          <View>
            <View style={flexRow}>
              <Text style={detailsText}>Varietal</Text>
              <Text style={detailsText}>{varietal}</Text>
            </View>
            <View style={flexRow}>
              <Text style={detailsText}>Subregion</Text>
              <Text style={detailsText}>{subregion}</Text>
            </View>
          </View>
        </View>
      </View>
      <View style={hrContainer}>
        <DashedLineIcon height={10} width={screenWidth * 0.85} />
      </View>
      <Review
        note={lastReview.drinkNote}
        rating={lastReview.rating}
        userName={lastReview.userName}
        date={lastReview.drinkDate}
        avatarUrl={lastReview.avatarURL}
        highlight={false}
        location={lastReview.prettyLocationName}
        isVerified={lastReview.authorizedTrader}
        customNoteComponent={() =>
          lastReview && !!lastReview.drinkNote ? (
            <View style={{}}>
              <QuotesComment
                textStyles={quotesCommentText}
                numberOfLines={0}
                containerStyles={quotesCommentContainer}
                text={lastReview.drinkNote}
              />
            </View>
          ) : null
        }
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {backgroundColor: colors.inventoryItemBg, paddingTop: 20, marginBottom: 10, paddingBottom: 10},
  hlBg: {
    backgroundColor: '#000',
  },
  flexRow: {flexDirection: 'row'},
  imageContainer: {
    width: 90,
    overflow: 'hidden',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    marginLeft: 20,
  },
  imagePlaceHolderContainer: {paddingVertical: 5, alignItems: 'center', backgroundColor: '#fff'},
  img: {width: '100%', height: 150, borderRadius: 30},
  wineColor: {
    width: 90,
    height: 20,
    backgroundColor: 'red',
    borderBottomRightRadius: 15,
    borderBottomLeftRadius: 15,
  },
  detailsContainer: {marginLeft: 20, marginRight: 20, justifyContent: 'space-around', flex: 1},
  detailsText: {flex: 1, color: '#fff', fontSize: 16, ...textStyle.mediumText},
  h1: {color: '#fff', ...textStyle.boldText, fontSize: 25},
  hrContainer: {alignItems: 'center', marginVertical: 20},
  flex1: {flex: 1},
  ratingContainer: {justifyContent: 'center'},
  imageLoaderContainer: {justifyContent: 'center', alignItems: 'center', backgroundColor: 'transparent'},
  quotesCommentContainer: {marginTop: 10, backgroundColor: 'rgba(0,0,0,0.2)'},
  quotesCommentText: {fontSize: 16, ...textStyle.mediumText},
});

const {
  container,
  hlBg,
  flexRow,
  imageContainer,
  imagePlaceHolderContainer,
  img,
  wineColor,
  detailsContainer,
  h1,
  detailsText,
  hrContainer,
  flex1,
  ratingContainer,
  imageLoaderContainer,
  quotesCommentContainer,
  quotesCommentText,
} = styles;

export const ReviewListItem = ReviewItem;
