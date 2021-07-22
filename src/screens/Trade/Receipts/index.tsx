import React, {FC, useState} from 'react';
import {View, StyleSheet, SafeAreaView, Alert, RefreshControl} from 'react-native';
import {useMutation, useQuery} from '@apollo/react-hooks';
import RNProgressHud from 'progress-hud';

import {NavigationScreenProp, FlatList, NavigationEvents} from 'react-navigation';
import {ReceiptsItem} from '../../../components/TradeComponents/ReceiptsItem';
import {TRANSACTION_RECEIPT_LIST} from '../../../apollo/queries/trading';
import {HeaderWithChevron, EmptyListComponent, LoadingFooter} from '../../../components';
import {EMPTY_RECEIPTS} from '../../../constants/text';
import {RESET_WS_FIELD} from '../../../apollo/client/mutations';
import {Routes} from '../../../constants';
import {usePagination} from '../../../hooks';
import {FIRST} from '../../../constants/inventory';
import _ from 'lodash';
import {checkSyncStatus} from '../../../utils/other.utils';

type Props = {
  navigation: NavigationScreenProp<any>;
};

const Receipts: FC<Props> = ({navigation}) => {
  const [resetWSField] = useMutation(RESET_WS_FIELD);
  const [refresh, setRefresh] = useState(false);
  const {invalidate, setInvalidate, loadingFooter, toggleLoadingFooter, reset: resetPagination} = usePagination();

  const {data: allReceipts, fetchMore, loading} = useQuery(TRANSACTION_RECEIPT_LIST, {
    fetchPolicy: 'network-only',
    onCompleted: async () => {
      RNProgressHud.dismiss();
    },
    onError: error => {
      Alert.alert('', error.message);
      RNProgressHud.dismiss();
      navigation.goBack();
    },
    variables: {
      first: FIRST,
      skip: 0,
    },
  });

  const renderItem = ({item}) => {
    return (
      <ReceiptsItem
        transactionReceipt={item}
        tradeOfferId={item.tradeOfferId}
        navigation={navigation}
        price={item.pricePerBottle}
        date={item.updatedAt}
        wineTitle={item.wineTitle}
      />
    );
  };

  const handleLoadMore = async () => {
    toggleLoadingFooter(true);

    if (!loading && invalidate) {
      await fetchMore({
        variables: {
          //@ts-ignore
          skip: allReceipts.transactionReceiptList.length,
          first: FIRST,
        },
        updateQuery: (previousResult: any, {fetchMoreResult}: any) => {
          if (fetchMoreResult.transactionReceiptList.length < FIRST) {
            setInvalidate(false);
          }

          return {
            transactionReceiptList: _.uniqBy(
              [...previousResult.transactionReceiptList, ...fetchMoreResult.transactionReceiptList],
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

  return (
    <SafeAreaView style={saveContainer}>
      <NavigationEvents
        onWillFocus={async () => {
          setInvalidate(true);
          await checkSyncStatus('Receipts-screen', onRefresh);
          await resetWSField({
            variables: {
              payload: Routes.receipts.name,
            },
          });
        }}
      />
      <HeaderWithChevron
        titleTextStyle={headerText}
        customBack={() => (navigation as any).popToTop()}
        title="Receipts"
      />
      <View style={listContainer}>
        <FlatList
          indicatorStyle="white"
          refreshControl={<RefreshControl refreshing={refresh} onRefresh={onRefresh} tintColor={'white'} />}
          data={allReceipts ? allReceipts.transactionReceiptList : []}
          renderItem={renderItem}
          keyExtractor={item => `${item.tradeOfferId}`}
          ListEmptyComponent={!loading && <EmptyListComponent text={EMPTY_RECEIPTS} />}
          ListFooterComponent={invalidate && loadingFooter && <LoadingFooter color={'white'} />}
          onEndReached={handleLoadMore}
        />
      </View>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#000',
    flexGrow: 1,
  },
  saveContainer: {backgroundColor: '#000', flex: 1},
  listContainer: {
    flex: 1,
  },
  headerText: {fontSize: 35},
});

const {saveContainer, listContainer, headerText} = styles;
export const ReceiptsScreen = Receipts;
