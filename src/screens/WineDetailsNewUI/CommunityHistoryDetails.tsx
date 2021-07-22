import React, {FC, useEffect, useState} from 'react';
import RNProgressHud from 'progress-hud';
import {View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Modal, FlatList, RefreshControl} from 'react-native';
import {NavigationScreenProp, withNavigation} from 'react-navigation';
import ImageViewer from 'react-native-image-zoom-viewer';
import {useQuery} from '@apollo/react-hooks';
import _ from 'lodash';

import textStyle from '../../constants/Styles/textStyle';
import {LoadingFooter, Review, WineImage} from '../../components';
import {HistoryDetailsBody, HeaderFilter} from '../../new_components';
import {WishEmptyIcon, WishFilledIcon} from '../../assets/svgIcons';
import {usePagination, useWishlist} from '../../hooks';
import {GET_REVIEWS} from '../../apollo/queries/wineHistory';
import {FIRST} from '../../constants/inventory';

type Props = {
  navigation: NavigationScreenProp<any>;
};

const WineDetails: FC<Props> = ({navigation}) => {
  const [preview, setPreview] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [initData] = useState(navigation.getParam('initData'));
  const {isInWish, addToWish, removeFromWish} = useWishlist(initData.wine.wine.inWishList);

  const {invalidate, setInvalidate, loadingFooter, toggleLoadingFooter, reset: resetPagination} = usePagination();

  const {fetchMore, loading, data: reviewList} = useQuery(GET_REVIEWS, {
    variables: {
      wineId: initData.wine.wine.id,
      skip: 0,
      first: FIRST,
    },
  });

  useEffect(() => {
    if (reviewList) {
      reviewList.wineReviewList.countOfReviews && setInvalidate(false);
    }
  }, [reviewList, setInvalidate]);

  const handleLoadMore = async () => {
    try {
      if (!loading && invalidate) {
        toggleLoadingFooter(true);
        await fetchMore({
          variables: {
            //@ts-ignore
            skip: reviewList.wineReviewList.data.length,
            first: FIRST,
          },

          updateQuery: (previousResult, {fetchMoreResult}) => {
            //@ts-ignore
            if (fetchMoreResult.wineReviewList.data.length < FIRST) {
              setInvalidate(false);
              toggleLoadingFooter(false);
            }

            return {
              //@ts-ignore
              ...previousResult,
              wineReviewList: {
                data: _.uniqBy(
                  [...previousResult.wineReviewList.data, ...fetchMoreResult.wineReviewList.data],
                  e => e.historyId,
                ),
              },
            };
          },
        });

        RNProgressHud.dismiss();
      }
    } catch (e) {
      console.debug(e);
    } finally {
      RNProgressHud.dismiss();
    }
  };

  const onRefresh = async (silent: boolean = false) => {
    silent && setRefresh(true);
    try {
      await fetchMore({
        variables: {
          skip: 0,
          first: FIRST,
        },
        updateQuery: (__, {fetchMoreResult}) => fetchMoreResult,
      });

      resetPagination();
    } catch (e) {
      console.debug(e);
    } finally {
      setRefresh(false);
      RNProgressHud.dismiss();
    }
  };

  return (
    <View style={container}>
      <SafeAreaView style={flex1}>
        <HeaderFilter title={'History details'} navigation={navigation} showClear={false} />

        <FlatList<any>
          refreshControl={<RefreshControl refreshing={refresh} onRefresh={onRefresh} tintColor={'#fff'} />}
          ListHeaderComponent={
            <>
              <View style={infoContainer}>
                <View style={imageContainer}>
                  <View style={redContainer} />
                  {initData.wine.wine.pictureURL === '' ? (
                    <WineImage uri={initData.wine.wine.pictureURL} />
                  ) : (
                    <TouchableOpacity onPress={() => setPreview(v => !v)}>
                      <WineImage uri={initData.wine.wine.pictureURL} />

                      <Modal visible={preview} transparent={true}>
                        <ImageViewer
                          renderIndicator={() => null}
                          onClick={() => setPreview(false)}
                          imageUrls={[
                            {
                              url: initData.wine.wine.pictureURL,
                            },
                          ]}
                        />
                      </Modal>
                    </TouchableOpacity>
                  )}
                </View>
                <View style={flex1}>
                  <HistoryDetailsBody wine={{...initData.wine.wine, pricePerBottle: initData.wine.pricePerBottle}} />
                  <View style={hearthRow}>
                    <TouchableOpacity
                      style={buttonPadding}
                      activeOpacity={0.5}
                      onPress={() => {
                        RNProgressHud.show();
                        isInWish
                          ? removeFromWish({variables: {wineId: initData.wine.wine.id}})
                          : addToWish({variables: {wineId: initData.wine.wine.id}});
                      }}
                      disabled={false}>
                      <View>
                        {isInWish ? (
                          <WishFilledIcon width={25} height={25} />
                        ) : (
                          <WishEmptyIcon width={25} height={25} />
                        )}
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
              {reviewList && (
                <View style={{marginTop: 15, marginLeft: 20}}>
                  {!!reviewList.wineReviewList.countOfReviews && (
                    <Text style={[text, title]}>Reviews ({reviewList.wineReviewList.countOfReviews})</Text>
                  )}
                </View>
              )}
            </>
          }
          ListFooterComponent={
            reviewList &&
            reviewList.wineReviewList.countOfReviews && (
              <>{loadingFooter && invalidate && <LoadingFooter color="#fff" />}</>
            )
          }
          data={reviewList && reviewList.wineReviewList.data}
          indicatorStyle="white"
          onEndReached={handleLoadMore}
          keyExtractor={item => `${item.historyId}`}
          renderItem={({item, index}) => {
            return (
              <Review
                avatarUrl={item.userPublic.avatarURL}
                userName={item.userPublic.userName}
                note={item.drinkNote}
                rating={item.rating}
                date={item.drinkDate}
                highlight={!!(index % 2)}
              />
            );
          }}
        />
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#041B1E'},
  text: {color: '#fff', fontSize: 16, ...textStyle.mediumText},
  flex1: {flex: 1},
  title: {...textStyle.boldText, fontSize: 20},
  redContainer: {backgroundColor: '#A62936', width: 50, position: 'absolute', top: 0, left: 0, bottom: 0},
  imageContainer: {flexDirection: 'row', position: 'relative', paddingVertical: 20},
  infoContainer: {flexDirection: 'row'},
  hearthRow: {flexDirection: 'row', paddingHorizontal: 20, justifyContent: 'flex-end'},
  buttonPadding: {padding: 5},
});

const {container, flex1, text, redContainer, imageContainer, infoContainer, hearthRow, buttonPadding, title} = styles;

export const CommunityHistoryWineDetails = withNavigation(WineDetails);
