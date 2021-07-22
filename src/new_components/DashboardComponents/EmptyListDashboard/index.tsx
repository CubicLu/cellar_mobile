import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {ButtonNew} from '../../../new_components/CommonComponents/Button';
import textStyle from '../../../constants/Styles/textStyle';
import Colors from '../../../constants/colors';
import {EMPTY_DASHBOARD_ERROR, EMPTY_SYNC_DASHBOARD_ERROR} from '../../../constants/dashboard.constants';
import {withNavigation, NavigationScreenProp} from 'react-navigation';
import Routes from '../../../constants/navigator-name';

interface itemProps {
  errorTitle: any;
  isImportAllowed: boolean;
  navigation: NavigationScreenProp<any>;
}

const Empty: React.FC<itemProps> = ({errorTitle, isImportAllowed, navigation}) => {
  return (
    <View style={container}>
      <Text style={text}>
        {errorTitle ? errorTitle : isImportAllowed ? EMPTY_SYNC_DASHBOARD_ERROR : EMPTY_DASHBOARD_ERROR}
      </Text>
      {errorTitle === '' && isImportAllowed && (
        <ButtonNew
          style={button}
          text="Import now"
          onPress={() => navigation.navigate(Routes.cellarImport.name, {from: Routes.dashboard.name})}
        />
      )}
    </View>
  );
};
export const EmptyListDashboard = withNavigation(Empty);

const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
    alignItems: 'center',
    flexDirection: 'column',
    paddingHorizontal: 20,
  },
  text: {
    fontSize: 20,
    color: 'white',
    ...textStyle.mediumText,
  },
  button: {
    minHeight: 50,
    justifyContent: 'center',
    alignItems: 'center',
    width: '80%',
    backgroundColor: Colors.orangeDashboard,
    marginTop: 20,
  },
});
const {container, text, button} = styles;
