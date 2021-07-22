import React, {FC} from 'react';
import {View, StyleSheet, Dimensions, Text, ActivityIndicator} from 'react-native';
import textStyle from '../../../constants/Styles/textStyle';

type Props = {
  activePage: number;
  loading: boolean;
};

const screenWidth = Dimensions.get('screen').width;

export const LeaderboardEmpty: FC<Props> = ({activePage, loading}) => {
  return !loading ? (
    <View style={[{width: screenWidth}, container]}>
      <Text style={text}>Failed to load the page. </Text>
      {activePage > 0 && <Text style={text}>You still able to go back to the previous page</Text>}
    </View>
  ) : (
    <View style={[{width: screenWidth}, container]}>
      <ActivityIndicator size="large" color="#fff" />
    </View>
  );
};

const styles = StyleSheet.create({
  text: {color: '#fff', ...textStyle.mediumText, fontSize: 25, textAlign: 'center'},
  container: {alignItems: 'center', justifyContent: 'center', flex: 1, minHeight: 300},
});

const {text, container} = styles;
