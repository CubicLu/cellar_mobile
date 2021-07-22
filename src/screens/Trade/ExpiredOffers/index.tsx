import React, {FC, useState} from 'react';
import {View, SafeAreaView, FlatList, RefreshControl, Text, Alert, StyleSheet} from 'react-native';
import {useLazyQuery, useMutation, useQuery} from '@apollo/react-hooks';
import {NavigationEvents, NavigationScreenProp} from 'react-navigation';
import RNProgressHud from 'progress-hud';
import _ from 'lodash';

import {HeaderWithChevron, ExpiredOfferItem, LoadingFooter} from '../../../components';
import {GET_REJECTED_OFFERS} from '../../../apollo/queries/trading';
import {styles} from './styles';
import {WINE} from '../../../apollo/queries/wine';
import {Routes} from '../../../constants';
import {usePagination} from '../../../hooks';
import {FIRST} from '../../../constants/inventory';
import textStyle from '../../../constants/Styles/textStyle';
import {checkSyncStatus} from '../../../utils/other.utils';
import {RESET_WS_FIELD} from '../../../apollo/client/mutations';

type Props = {
  navigation: NavigationScreenProp<any>;
};

const {container, saveContainer, listStyles, headerText} = styles;

const ExpiredOffers: FC<Props> = ({navigation}) => {
  const [refresh, setRefresh] = useState(false);
  const [preload, setPreload] = useState(null);
  const {invalidate, setInvalidate, loadingFooter, toggleLoadingFooter, reset: resetPagination} = usePagination();
  const [resetWSField] = useMutation(RESET_WS_FIELD);

  const [getWine] = useLazyQuery(WINE, {
    fetchPolicy: 'no-cache',
    onCompleted: data => {
      RNProgressHud.dismiss();
      navigation.navigate(Routes.PastOfferScreen.name, {
        data: [data.wineV2, preload],
      });
    },
    variables: {
      wineId: preload && preload.wineId,
    },
    onError: () => RNProgressHud.dismiss(),
  });

  const {data: rejectedList, loading: offersLoading, fetchMore} = useQuery(GET_REJECTED_OFFERS, {
    fetchPolicy: 'network-only',
    onCompleted: () => {
      RNProgressHud.dismiss();
    },
    onError: error => {
      Alert.alert(error.message);
      RNProgressHud.dismiss();
    },
  });

  const handleLoadMore = async () => {
    toggleLoadingFooter(true);

    if (!offersLoading && invalidate) {
      await fetchMore({
        variables: {
          //@ts-ignore
          skip: rejectedList.rejectedOffers.length,
          first: FIRST,
        },

        updateQuery: (previousResult, {fetchMoreResult}) => {
          if (fetchMoreResult.rejectedOffers.length < FIRST) {
            setInvalidate(false);
          }

          return {
            rejectedOffers: _.uniqBy(
              [...previousResult.rejectedOffers, ...fetchMoreResult.rejectedOffers],
              e => e.tradeOfferId,
            ),
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
          //@ts-ignore
          skip: 0,
          first: FIRST,
        },
        updateQuery: (__, {fetchMoreResult}) => fetchMoreResult,
      });

      resetPagination();
    } catch (e) {
      Alert.alert(e.message);
    } finally {
      setRefresh(false);
      RNProgressHud.dismiss();
    }
  };

  const renderItem = ({item}) => {
    return (
      <ExpiredOfferItem
        tradeOfferId={item.tradeOfferId}
        price={item.totalPrice.toFixed(2)}
        date={item.updatedAt}
        updatedAt={item.updatedAt}
        wineTitle={item.wineTitle}
        onPress={() => {
          setPreload(item);
          getWine();
        }}
      />
    );
  };

  return (
    <View style={container}>
      <NavigationEvents
        onWillFocus={async () => {
          setInvalidate(true);
          await checkSyncStatus('PastOffers', onRefresh);
          await resetWSField({
            variables: {
              payload: Routes.expiredOffers.name,
            },
          });
        }}
      />
      <SafeAreaView style={saveContainer}>
        <HeaderWithChevron title="Past Offers" titleTextStyle={headerText} />
        <FlatList
          data={rejectedList ? rejectedList.rejectedOffers : []}
          refreshControl={<RefreshControl refreshing={refresh} onRefresh={onRefresh} tintColor={'white'} />}
          style={listStyles}
          renderItem={renderItem}
          indicatorStyle={'white'}
          maxToRenderPerBatch={FIRST}
          keyExtractor={item => `${item.tradeOfferId}`}
          ListEmptyComponent={
            !offersLoading && (
              <View style={emptyContainer}>
                <Text style={emptyTextStyle}>This list currently empty</Text>
              </View>
            )
          }
          ListFooterComponent={invalidate && loadingFooter && <LoadingFooter color={'white'} />}
          onEndReached={handleLoadMore}
        />
      </SafeAreaView>
    </View>
  );
};

const style = StyleSheet.create({
  emptyContainer: {height: 300, justifyContent: 'center', alignItems: 'center'},
  emptyTextStyle: {color: '#fff', ...textStyle.mediumText, fontSize: 25},
});

const {emptyContainer, emptyTextStyle} = style;

export const ExpiredOffersScreen = ExpiredOffers;
