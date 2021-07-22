import React, {FC, useEffect, useState} from 'react';
import {View, StyleSheet, SafeAreaView, Text, FlatList, RefreshControl, Alert} from 'react-native';
import {useLazyQuery, useQuery} from '@apollo/react-hooks';
import RNProgressHud from 'progress-hud';
import {NavigationScreenProp} from 'react-navigation';

import {ReviewListItem} from '../../components/ReviewComponents/ReviewListItem';
import {WINE} from '../../apollo/queries/wine';
import Routes from '../../constants/navigator-name';
import {renameKeyName} from '../../utils/other.utils';
import {GET_REVIEW_LIST} from '../../apollo/queries/wineReview';
import textStyle from '../../constants/Styles/textStyle';
import {usePagination} from '../../hooks';

import _ from 'lodash';
import {LoadingFooter} from '../../components/InventoryComponents/LoadingFooter';
import {HeaderWithBurger} from '../../components/CommonComponents/HeaderWithBurger';

type Props = {
  navigation: NavigationScreenProp<any>;
};

type ReviewItem = {
  avgRating: number;
  wine: {
    id: number;
    wineTitle: string;
    varietal: string;
    pictureURL: string;
    color: string;
    locale: {
      subregion: string;
    };
  };
  data: {
    historyId: number;
    userPublic: {
      userName: string;
      avatarURL: string;
      authorizedTrader: boolean;
      prettyLocationName: string;
    };
    rating: number;
    drinkNote: string;
    drinkDate: Date;
  };
};

const FIRST = 25;
const Review: FC<Props> = ({navigation}) => {
  const [refresh, setRefresh] = useState(false);
  const {invalidate, setInvalidate, loadingFooter, toggleLoadingFooter, reset: resetPagination} = usePagination();

  const [getWineDetails] = useLazyQuery(WINE, {
    onCompleted: data => {
      RNProgressHud.dismiss();
      navigation.navigate(Routes.drinkHistoryDetails.name, {
        initData: renameKeyName(data, 'wineV2', 'wine'),
        getWineDetails,
        hideHistory: false,
      });
    },
    onError: error => {
      RNProgressHud.dismiss();
      console.log(error.message);
    },
    fetchPolicy: 'no-cache',
  });

  const {data: reviewList, loading, fetchMore} = useQuery(GET_REVIEW_LIST, {
    variables: {
      first: FIRST,
      skip: 0,
    },
    onCompleted: data => {
      if (data.wineReviewMasterList.data.length < FIRST) {
        setInvalidate(false);
        toggleLoadingFooter(false);
      }
      RNProgressHud.dismiss();
    },
    onError: error => Alert.alert(error.message),
  });

  useEffect(() => {
    if (loading) {
      RNProgressHud.show();
    } else {
      RNProgressHud.dismiss();
    }
  }, [loading]);

  const onPressReview = (id: number) => {
    RNProgressHud.show();
    getWineDetails({
      variables: {
        wineId: id,
      },
    });
  };

  const handleLoadMore = async () => {
    toggleLoadingFooter(true);

    if (!loading && invalidate) {
      await fetchMore({
        variables: {
          //@ts-ignore
          skip: reviewList.wineReviewMasterList.data.length,
          first: FIRST,
        },
        updateQuery: (previousResult: any, {fetchMoreResult}: any) => {
          if (fetchMoreResult.wineReviewMasterList.data.length < FIRST) {
            setInvalidate(false);
          }

          return {
            ...previousResult,
            wineReviewMasterList: {
              data: _.uniqBy(
                [...previousResult.wineReviewMasterList.data, ...fetchMoreResult.wineReviewMasterList.data],
                e => [e.data.historyId],
              ),
            },
          };
        },
      });

      RNProgressHud.dismiss();
    }
  };

  const onRefresh = async (silent: boolean = false) => {
    silent && setRefresh(true);
    setInvalidate(true);
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
      // setEmptyMessage(e.message);
    } finally {
      setRefresh(false);
      RNProgressHud.dismiss();
    }
  };

  const renderItem = ({item}) => {
    return (
      <ReviewListItem
        averageRating={item.avgRating}
        color={item.wine.color}
        title={item.wine.wineTitle}
        pictureURL={item.wine.pictureURL}
        subregion={item.wine.locale.subregion}
        varietal={item.wine.varietal}
        lastReview={{
          drinkDate: new Date(item.data.drinkDate),
          drinkNote: item.data.drinkNote,
          rating: item.data.rating,
          userName: item.data.userPublic.userName,
          avatarURL: item.data.userPublic.avatarURL,
          prettyLocationName: item.data.userPublic.prettyLocationName,
          authorizedTrader: item.data.userPublic.authorizedTrader,
        }}
        onPress={() => onPressReview(item.wine.id)}
      />
    );
  };

  return (
    <View style={container}>
      <SafeAreaView style={flex1}>
        <HeaderWithBurger
          titleContainerStyle={
            {
              // alignItems: 'flex-start'
            }
          }
          text="Reviews"
        />
        <FlatList<ReviewItem>
          data={reviewList && reviewList.wineReviewMasterList.data}
          indicatorStyle="white"
          keyExtractor={item => `${item.data.historyId}`}
          refreshControl={<RefreshControl refreshing={refresh} onRefresh={onRefresh} tintColor={'white'} />}
          ListFooterComponent={invalidate && loadingFooter && <LoadingFooter color={'white'} />}
          ListEmptyComponent={
            <View style={emptyListContainer}>{!loading && <Text style={emptyText}>No review yet</Text>}</View>
          }
          maxToRenderPerBatch={10}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={1.0}
          contentContainerStyle={flexGrow1}
          renderItem={renderItem}
        />
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#000'},
  flexGrow1: {flexGrow: 1},
  flex1: {flex: 1},
  emptyListContainer: {height: '100%', justifyContent: 'center', alignItems: 'center'},
  emptyText: {color: '#fff', ...textStyle.mediumText, fontSize: 20},
});

const {container, flexGrow1, emptyListContainer, emptyText, flex1} = styles;

export const ReviewScreen = Review;
