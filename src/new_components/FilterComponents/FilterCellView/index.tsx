import React from 'react';
import {Text, StyleSheet, View, TouchableOpacity} from 'react-native';
import Colors from '../../../constants/colors';
import textStyle from '../../../constants/Styles/textStyle';
import {ChevronRightIcon} from '../../../assets/svgIcons';

interface CellItemProps {
  title: string;
  count: number;
  onPress: () => void;
}

const FilterCell: React.FC<CellItemProps> = ({title, count, onPress}) => {
  return (
    <View style={container}>
      <View style={countBox}>
        {count > 0 && (
          <View style={countContainer}>
            <Text allowFontScaling={false} style={text}>
              {count}
            </Text>
          </View>
        )}
      </View>
      <TouchableOpacity style={cellContainer} onPress={onPress}>
        <Text style={cellText}>{title}</Text>
        <View style={chevronContainer}>
          <ChevronRightIcon height={15} width={15} />
        </View>
      </TouchableOpacity>
      <View style={{height: 0, width: '10%'}} />
    </View>
  );
};
export const FilterCellView = FilterCell;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    minHeight: 60,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  countBox: {
    width: '10%',
    minHeight: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  countContainer: {
    height: 25,
    width: 25,
    borderRadius: 14,
    backgroundColor: Colors.orangeDashboard,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    ...textStyle.mediumText,
    color: 'white',
    fontSize: 16,
  },
  cellContainer: {
    height: 60,
    width: '80%',
    backgroundColor: 'black',
    borderWidth: 3,
    borderColor: Colors.borderGreen,
    flexDirection: 'row',
    alignItems: 'center',
  },
  cellText: {
    ...textStyle.mediumText,
    color: 'white',
    fontSize: 24,
    marginLeft: 20,
    width: '75%',
  },
  chevronContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '25%',
  },
});
const {container, text, countBox, countContainer, cellContainer, cellText, chevronContainer} = styles;
