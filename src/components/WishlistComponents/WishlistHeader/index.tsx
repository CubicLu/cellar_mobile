import React, {FC} from 'react';
import {Text, StyleSheet, View, TouchableOpacity} from 'react-native';

import textStyle from '../../../constants/Styles/textStyle';
import {NavigationScreenProp, withNavigation} from 'react-navigation';
import {Routes} from '../../../constants';
import {LeaderboardIcon} from '../../../assets/svgIcons';

type Props = {
  count: number;
  navigation: NavigationScreenProp<any>;
};

const Header: FC<Props> = ({count, navigation}) => {
  return (
    <View style={container}>
      <Text allowFontScaling={false} adjustsFontSizeToFit style={text}>
        Wish List
      </Text>

      <View style={rowContainer}>
        <TouchableOpacity onPress={() => navigation.navigate(Routes.WishlistLeaderboard.name)}>
          <View style={leaderboardContainer}>
            <LeaderboardIcon width={50} height={50} />
            <Text style={leaderboardText}>Leaderboard</Text>
          </View>
        </TouchableOpacity>
        <View style={[countContainer, !count && invisible]}>
          <Text style={h1}>{count}</Text>
          <Text numberOfLines={2} adjustsFontSizeToFit style={h2}>
            Total number of wines
          </Text>
        </View>
      </View>
    </View>
  );
};
export const WishlistHeader = withNavigation(Header);

const styles = StyleSheet.create({
  container: {paddingLeft: 90, paddingBottom: 10, paddingTop: 10},
  rowContainer: {flexDirection: 'row', justifyContent: 'space-between', marginTop: 25},
  text: {
    fontSize: 40,
    color: 'white',
    ...textStyle.mediumText,
  },
  invisible: {opacity: 0},
  countContainer: {
    backgroundColor: '#041B1E',
    padding: 10,
    maxWidth: '60%',
    alignSelf: 'flex-end',
  },
  h1: {color: '#fff', ...textStyle.boldText, textAlign: 'center', fontSize: 25},
  h2: {color: '#fff', ...textStyle.mediumText, textAlign: 'center'},
  leaderboardContainer: {alignItems: 'center'},
  leaderboardText: {
    color: '#fff',
    fontSize: 15,
    ...textStyle.mediumText,
  },
});
const {
  container,
  text,
  countContainer,
  h1,
  h2,
  leaderboardContainer,
  leaderboardText,
  invisible,
  rowContainer,
} = styles;
