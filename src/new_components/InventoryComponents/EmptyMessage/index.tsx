import React from 'react';
import {Text, StyleSheet, View} from 'react-native';
import {ButtonNew} from '../../CommonComponents/Button';
import textStyle from '../../../constants/Styles/textStyle';
import {withNavigation, NavigationScreenProp} from 'react-navigation';
import Routes from '../../../constants/navigator-name';
import Colors from '../../../constants/colors';

interface EmptyProps {
  emptyMessage: string;
  navigation: NavigationScreenProp<any>;
  isImportAllowed: boolean;
}

const Empty: React.FC<EmptyProps> = ({emptyMessage, navigation, isImportAllowed}) => {
  return (
    <View style={[container, isImportAllowed && topOffset]}>
      <Text style={[text, !isImportAllowed && bottomMargin]}>{emptyMessage}</Text>

      {isImportAllowed && (
        <ButtonNew
          text="IMPORT NOW"
          style={[button, bottomMargin]}
          onPress={() => navigation.navigate(Routes.cellarImport.name, {from: Routes.inventoryNewUI.name})}
        />
      )}
    </View>
  );
};
export const InventoryEmptyMessage = withNavigation(Empty);

const style = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
    alignItems: 'center',
  },
  topOffset: {},
  text: {
    textAlign: 'center',
    fontSize: 25,
    color: 'white',
    ...textStyle.mediumText,
    marginTop: 20,
  },
  button: {
    minHeight: 50,
    justifyContent: 'center',
    alignItems: 'center',
    width: '80%',
    backgroundColor: Colors.orangeDashboard,
    marginTop: 20,
  },

  bottomMargin: {
    marginBottom: 200,
  },
});

const {container, text, button, bottomMargin, topOffset} = style;
