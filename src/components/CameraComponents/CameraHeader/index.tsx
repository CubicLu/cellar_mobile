import React, {FC} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Dimensions} from 'react-native';
import {withNavigation, NavigationScreenProp} from 'react-navigation';
import {ChevronLeftIcon} from '../../../assets/svgIcons';
import Colors from '../../../constants/colors';
import textStyle from '../../../constants/Styles/textStyle';

type Props = {
  navigation: NavigationScreenProp<any>;
};

const Header: FC<Props> = ({navigation}) => {
  return (
    <View style={headerContainer}>
      <View style={arrowContainer}>
        <TouchableOpacity style={arrowTouchable} onPress={() => navigation.goBack()}>
          <ChevronLeftIcon height={25} width={20} />
        </TouchableOpacity>
      </View>
      <View style={titleContainer}>
        <Text style={titleText}>Add Image</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  arrowContainer: {
    backgroundColor: Colors.dashboardRed,
  },
  arrowTouchable: {
    width: 80,
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleContainer: {
    marginLeft: 22,
  },
  titleText: {
    fontWeight: '500',
    fontSize: Dimensions.get('screen').width < 375 ? 35 : 50,
    lineHeight: 66,
    ...textStyle.mediumText,
    color: '#fff',
  },
});

const {arrowContainer, arrowTouchable, headerContainer, titleContainer, titleText} = styles;
export const CameraHeader = withNavigation(Header);
