import React, {FC, useState} from 'react';
import {View, Text, StyleSheet, SafeAreaView, TouchableOpacity, FlatList, RefreshControl} from 'react-native';
import {NavigationEvents, NavigationScreenProp} from 'react-navigation';
import {useQuery} from '@apollo/react-hooks';
import RNProgressHud from 'progress-hud';
import _ from 'lodash';

import {HeaderWithBurger, LiveCommunityListItem, LoadingFooter} from '../../../components';
import colors from '../../../constants/colors';
import textStyle from '../../../constants/Styles/textStyle';
import {Routes} from '../../../constants';
import {GET_LIVE_PHOTOS} from '../../../apollo/queries/photoStream';
import {checkSyncStatus} from '../../../utils/other.utils';
import {usePagination} from '../../../hooks';
import {FIRST} from '../../../constants/inventory';

type Props = {
  navigation: NavigationScreenProp<any>;
};

const LiveCommunity: FC<Props> = ({navigation}) => {
  const {invalidate, setInvalidate, loadingFooter, toggleLoadingFooter, reset: resetPagination} = usePagination();
  const [refresh, setRefresh] = useState(false);

  const {data: streamData, fetchMore, loading} = useQuery(GET_LIVE_PHOTOS, {
    variables: {
      first: 25,
      skip: 0,
    },
    onCompleted: data => {
      if (data.stream__getPosts.data < FIRST) {
        setInvalidate(false);
        toggleLoadingFooter(false);
      }
    },
  });

  const handleLoadMore = async () => {
    toggleLoadingFooter(true);

    if (!streamData) {
      return;
    }

    if (!loading && invalidate) {
      await fetchMore({
        variables: {
          skip: streamData.stream__getPosts.data.length,
          first: FIRST,
        },

        updateQuery: (previousResult: any, {fetchMoreResult}) => {
          if (fetchMoreResult.stream__getPosts.data.length < FIRST) {
            setInvalidate(false);
          }

          return {
            stream__getPosts: {
              ...previousResult.stream__getPosts,
              data: _.uniqBy(
                [...previousResult.stream__getPosts.data, ...fetchMoreResult.stream__getPosts.data],
                e => e.id,
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
          //@ts-ignore
          skip: 0,
          first: FIRST,
        },
        updateQuery: (__, {fetchMoreResult}) => fetchMoreResult,
      });

      resetPagination();
    } catch (e) {
      console.log('error', e);
    } finally {
      setRefresh(false);
      RNProgressHud.dismiss();
    }
  };

  function renderItem({item}) {
    return (
      <LiveCommunityListItem
        userName={`${item.owner.firstName}${item.owner.lastName}`}
        canDelete={item.canDelete}
        canEdit={item.canEdit}
        location={item.owner.prettyLocationName}
        avatarUrl={item.owner.avatarURL}
        imageUrl={item.url}
        text={item.description}
        updatedAt={item.updatedAt}
        createdAt={item.createdAt}
        postID={item.id}
        onDeleteComplete={onRefresh}
      />
    );
  }

  return (
    <View style={container}>
      <NavigationEvents
        onWillFocus={async () => {
          await checkSyncStatus('Live-photos', onRefresh);
        }}
      />

      <SafeAreaView style={flex1}>
        <HeaderWithBurger
          text="Live Photos"
          renderRightButton={() => (
            <TouchableOpacity onPress={() => navigation.navigate(Routes.LivePhotoAddition.name)} style={buttonAdd}>
              <Text style={buttonAddText}>Add</Text>
            </TouchableOpacity>
          )}
        />

        <FlatList<any>
          data={streamData && streamData.stream__getPosts.data}
          style={flexGrow1}
          onEndReached={handleLoadMore}
          ListHeaderComponent={<View style={h20} />}
          keyExtractor={item => `${item.id}`}
          refreshControl={<RefreshControl refreshing={refresh} onRefresh={onRefresh} tintColor={'white'} />}
          ListEmptyComponent={
            !loading && (
              <View style={emptyListContainer}>
                <Text style={[buttonAddText, emptyListText]}>No photos here, you can be the first</Text>
              </View>
            )
          }
          ListFooterComponent={invalidate && loadingFooter && <LoadingFooter color={'white'} />}
          renderItem={renderItem}
        />
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {backgroundColor: '#000', flex: 1},
  buttonAdd: {
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.orangeDashboard,
  },
  buttonAddText: {...textStyle.mediumText, color: '#fff', fontSize: 25},
  flex1: {flex: 1},
  flexGrow1: {flexGrow: 1},
  h20: {height: 20},
  emptyListContainer: {},
  emptyListText: {fontSize: 18, textAlign: 'center'},
});

const {container, buttonAdd, buttonAddText, flex1, flexGrow1, h20, emptyListContainer, emptyListText} = styles;

export const LiveCommunityScreen = LiveCommunity;
