import React from 'react';
import {Text, StyleSheet, TouchableOpacity, View, FlatList} from 'react-native';
import {RFPercentage} from 'react-native-responsive-fontsize';
import textStyle from '../../../constants/Styles/textStyle';
import Colors from '../../../constants/colors';

interface CellItemProps {
  onPress: () => void;
  icon: any;
  title: string;
  selectedTabTitle: string;
}

const Tab: React.FC<CellItemProps> = ({onPress, icon, title, selectedTabTitle}) => {
  return (
    <View>
      <TouchableOpacity onPress={() => onPress()} style={container}>
        {icon}
        <Text
          allowFontScaling={false}
          style={[text, {...textStyle.robotoRegular}, title === selectedTabTitle && {color: Colors.orangeDashboard}]}>
          {title}
        </Text>
      </TouchableOpacity>
    </View>
  );
};
export const TabItem = Tab;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 80,
    width: 85,
    zIndex: 10,
    marginTop: 5,
    marginBottom: 5,
  },
  imageStyle: {
    height: 30,
    width: 30,
  },
  text: {
    color: 'white',
    marginTop: 2,
    fontSize: RFPercentage(1.75),
    ...textStyle.mediumText,
  },
});
const {container, text} = styles;
