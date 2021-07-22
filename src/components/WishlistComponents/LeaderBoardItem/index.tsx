import React, {FC} from 'react';
import {View, Text, StyleSheet, Dimensions} from 'react-native';
import textStyle from '../../../constants/Styles/textStyle';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

type User = {
  userName: string;
  location: string;
  rank: number;
  score: number;
};

interface Props extends User {
  chartColor?: string;
  bgColor?: string;
}
const screenWidth = Dimensions.get('screen').width;

export const LeaderBoardItem: FC<Props> = ({location, score, rank, chartColor, bgColor, userName}) => {
  return (
    <View style={[container, bgColor && {backgroundColor: bgColor}]}>
      <View style={[absChart, chartColor && {backgroundColor: chartColor}]} />
      <View style={infoContainer}>
        <View style={rankContainer}>
          <Text allowFontScaling={false} adjustsFontSizeToFit style={[text, rankText]}>
            {rank}.
          </Text>
        </View>
        <View style={flex1}>
          <Text style={[text, userNameText]}>{userName ? userName : 'None'}</Text>
          {!!location && (
            <Text style={[text, locationText]}>
              <MaterialIcons name="location-on" size={13} />
              {location}
            </Text>
          )}
        </View>
        <View>
          <Text adjustsFontSizeToFit style={[text, scoreText]}>
            {score}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    marginBottom: 5,
    width: screenWidth,
  },
  rankContainer: {width: '12%'},
  absChart: {
    position: 'absolute',
    width: 10,
    left: 0,
    top: 0,
    bottom: 0,
    zIndex: -1,
  },
  infoContainer: {flexDirection: 'row', alignItems: 'center'},
  flex1: {flex: 1},
  text: {
    color: '#fff',
    ...textStyle.robotoRegular,
  },
  rankText: {
    fontSize: 20,
  },
  userNameText: {
    ...textStyle.robotoBold,
  },
  locationText: {},

  scoreText: {},
});

const {
  container,
  absChart,
  flex1,
  rankText,
  text,
  userNameText,
  locationText,
  infoContainer,
  scoreText,
  rankContainer,
} = styles;
