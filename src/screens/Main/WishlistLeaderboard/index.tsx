import React, {FC, useRef, useState} from 'react';
import RNProgressHud from 'progress-hud';
import Fontisto from 'react-native-vector-icons/Fontisto';
import {useLazyQuery} from '@apollo/react-hooks';
import {
  View,
  StyleSheet,
  SafeAreaView,
  FlatList,
  ScrollView,
  NativeSyntheticEvent,
  NativeScrollEvent,
  Dimensions,
  Animated,
} from 'react-native';

import {LeaderBoardItem, Pagination, HeaderWithChevron, LeaderboardEmpty} from '../../../components';
import {GET_WISHLIST_LEADERBOARD} from '../../../apollo/queries/wishlist';
import textStyle from '../../../constants/Styles/textStyle';
import {useHorizontalPagination} from '../../../hooks';
import APP_CONFIG from '../../../constants/config';
import colors from '../../../constants/colors';

type Props = {};
export type LeaderBoardUser = {
  userPublic: {
    userName: string;
    prettyLocationName: string;
  };
  rank: number;
  score: number;
};

const {width: screenWidth, height: screenHeight} = Dimensions.get('screen');
const delta = screenWidth * 0.15;

const LeaderBoard: FC<Props> = ({}) => {
  const outerListRef = useRef<FlatList<LeaderBoardUser>>();
  const [error, setError] = useState(false);

  const [getBoardPage, {data: boardData, loading: boardLoading}] = useLazyQuery(GET_WISHLIST_LEADERBOARD, {
    onCompleted: data => {
      console.log(data);
      RNProgressHud.dismiss();
    },
    onError: onLoadError => {
      RNProgressHud.dismiss();
      setError(true);
      console.log(onLoadError);
    },
    fetchPolicy: 'cache-and-network',
  });

  const {pages, controller, changePageAction, active} = useHorizontalPagination(
    onPageChange,
    Math.ceil(boardData && boardData.usersLeaderboard.totalCount / APP_CONFIG.LEADERBOARD_ITEMS_PER_PAGE),
  );

  const left = useRef(new Animated.Value(1)).current;
  const right = useRef(new Animated.Value(1)).current;

  const interpolatedScale = left.interpolate({
    inputRange: [-delta, 0],
    outputRange: [1.5, 1],
  });

  const interpolateScaleRight = right.interpolate({
    inputRange: [0, delta],
    outputRange: [1, 1.5],
  });

  const interpolatedOpacity = left.interpolate({
    inputRange: [-delta, 0],
    outputRange: [1, 0],
  });
  const interpolateOpacityRight = right.interpolate({
    inputRange: [0, delta],
    outputRange: [0, 1],
  });

  async function onPageChange(page: number) {
    outerListRef.current && outerListRef.current.scrollToOffset({animated: false, offset: 0});
    setError(false);
    RNProgressHud.show();

    getBoardPage({
      variables: {
        first: APP_CONFIG.LEADERBOARD_ITEMS_PER_PAGE,
        skip: APP_CONFIG.LEADERBOARD_ITEMS_PER_PAGE * (page - 1),
      },
    });
  }

  const onEndDrag = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const {x} = event.nativeEvent.contentOffset;
    const lastPage = pages[pages.length - 2];

    if (x > delta && active + 1 < lastPage) {
      controller.next();
      RNProgressHud.show();
    }

    if (x < 0 && Math.abs(x) > delta && active + 1 > 1) {
      controller.previous();
      RNProgressHud.show();
    }
  };

  const showView = () => {
    Animated.timing(left, {
      duration: 100,
      toValue: -150,
    }).start();
  };

  const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const {x} = event.nativeEvent.contentOffset;

    left.setValue(x);
    right.setValue(x);
  };

  return (
    <View style={container}>
      <SafeAreaView style={flex1}>
        {controller.page !== 1 && (
          <Animated.View
            style={[
              arrow,
              leftArrow,
              {
                opacity: interpolatedOpacity,
                transform: [{scale: interpolatedScale}],
              },
            ]}>
            <Fontisto name="angle-dobule-left" color="#fff" size={20} />
          </Animated.View>
        )}
        {controller.page !== controller.count && (
          <Animated.View
            style={[
              arrow,
              rightArrow,
              {
                opacity: interpolateOpacityRight,
                transform: [{scale: interpolateScaleRight}],
              },
            ]}>
            <Fontisto name="angle-dobule-right" color="#fff" size={20} />
          </Animated.View>
        )}
        <HeaderWithChevron title="Leaderboard" titleTextStyle={headerTextStyle} />
        {boardData && (
          <View style={currentUserContainer}>
            <LeaderBoardItem
              rank={boardData.usersLeaderboard.currentUser.rank}
              userName={`${boardData.usersLeaderboard.currentUser.user.firstName} ${
                boardData.usersLeaderboard.currentUser.user.lastName
              }`}
              location={boardData.usersLeaderboard.currentUser.user.location.prettyLocationName}
              score={boardData.usersLeaderboard.currentUser.score}
              chartColor={colors.orangeDashboard}
              bgColor={colors.dashboardDarkTab}
            />
          </View>
        )}
        <ScrollView
          horizontal
          style={scrollContainer}
          onScroll={onScroll}
          onScrollBeginDrag={showView}
          scrollEventThrottle={0.1}
          onScrollEndDrag={onEndDrag}>
          <FlatList<LeaderBoardUser>
            data={boardData ? boardData.usersLeaderboard.data : []}
            // data={[]}
            ref={outerListRef}
            indicatorStyle="white"
            keyExtractor={item => `${item.rank}`}
            ListEmptyComponent={<LeaderboardEmpty loading={boardLoading} activePage={active} />}
            renderItem={({item: user, index}) => {
              return (
                <LeaderBoardItem
                  userName={user.userPublic.userName}
                  location={user.userPublic.prettyLocationName}
                  score={user.score}
                  rank={user.rank}
                  bgColor={index % 2 ? colors.dashboardDarkTab : 'rgba(255,255,255,0.05)'}
                />
              );
            }}
            ListFooterComponent={
              pages.length > 2 && (
                <Pagination
                  hide={boardLoading || error}
                  changePageAction={changePageAction}
                  pages={pages}
                  active={controller.page}
                />
              )
            }
          />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#000', position: 'relative'},
  scrollContainer: {position: 'relative', overflow: 'visible', zIndex: 2},
  currentUserContainer: {paddingTop: 5},
  flex1: {flex: 1},
  headerTextStyle: {fontSize: 35, ...textStyle.robotoRegular},
  arrow: {
    position: 'absolute',
    zIndex: 3,
    width: 50,
    height: 50,
    top: screenHeight / 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  leftArrow: {
    left: 0,
  },

  rightArrow: {
    right: 0,
  },
});

const {container, flex1, currentUserContainer, headerTextStyle, arrow, leftArrow, rightArrow, scrollContainer} = styles;

export const WishlistLeaderboard = LeaderBoard;
