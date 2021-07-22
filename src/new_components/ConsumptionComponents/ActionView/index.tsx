import React from 'react';
import {Text, StyleSheet, View, TouchableOpacity} from 'react-native';
import {InventoryIcon, WineOrangeIcon} from '../../../assets/svgIcons';
import textStyle from '../../../constants/Styles/textStyle';
import Colors from '../../../constants/colors';
import Navigation from '../../../types/navigation';
interface EmptyProps {
  quantity: number;
  onPressDrink: () => void;
  onPressAdd: () => void;
}

const Action: React.FC<EmptyProps> = ({quantity, onPressDrink, onPressAdd}) => {
  return (
    <View style={container}>
      <TouchableOpacity onPress={onPressDrink} style={touchableStyle}>
        <Text style={text}>Drink</Text>
      </TouchableOpacity>

      <View style={quantityContainer}>
        <View style={itemStyle}>
          <Text style={quantityText}>{quantity}</Text>
        </View>
        <View style={itemStyle}>
          <WineOrangeIcon height={30} width={15} />
        </View>
      </View>

      <TouchableOpacity onPress={onPressAdd} style={[touchableStyle, {backgroundColor: Colors.orangeDashboard}]}>
        <Text style={text}>Add</Text>
      </TouchableOpacity>
    </View>
  );
};
export const ActionView = Action;

const style = StyleSheet.create({
  container: {
    backgroundColor: 'black',
    borderTopWidth: 4,
    borderBottomWidth: 4,
    borderColor: Colors.borderGreen,
    width: '100%',
    marginTop: 30,
    marginBottom: 30,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    paddingLeft: 8,
    paddingRight: 8,
    paddingBottom: 20,
    paddingTop: 20,
  },
  text: {
    color: 'white',
    ...textStyle.mediumText,
    fontSize: 36,
  },
  touchableStyle: {
    minHeight: 76,
    width: '40%',
    backgroundColor: Colors.dashboardRed,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityContainer: {
    minHeight: 76,
    minWidth: '20%',
    backgroundColor: 'black',
    justifyContent: 'space-around',
  },
  quantityText: {
    color: 'white',
    ...textStyle.mediumText,
    fontSize: 24,
    alignSelf: 'center',
  },
  itemStyle: {
    alignItems: 'center',
  },
});

const {container, text, touchableStyle, quantityContainer, quantityText, itemStyle} = style;
