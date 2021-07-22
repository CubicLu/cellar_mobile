import React, {FC, useState, useCallback} from 'react';
import {View, Text, StyleSheet, SafeAreaView, Alert} from 'react-native';
import {withNavigation, NavigationScreenProp} from 'react-navigation';
import {useMutation} from '@apollo/react-hooks';
import RNProgressHud from 'progress-hud';

import {HeaderWithChevron} from '../../components';
import Routes from '../../constants/navigator-name';
import textStyles from '../../constants/Styles/textStyle';
import {CheckBox} from '../../components';
import {ButtonNew} from '../../new_components';
import Colors from '../../constants/colors';
import {BACKUP_PROFILE} from '../../apollo/mutations/backupProfile';

type Props = {
  navigation: NavigationScreenProp<any>;
};

const Backup: FC<Props> = ({navigation}) => {
  const [backup, {loading}] = useMutation(BACKUP_PROFILE, {
    onCompleted: ({createBackup: data}) => {
      console.log(data);
      RNProgressHud.dismiss();
      Alert.alert(
        data.message,
        `Backuped: \nInventory wines: ${data.numberOfInventoryWines} \nHistory entries: ${
          data.numberOfHistoryWines
        } \nWishlist wines: ${data.numberOfWishlistWines}`,
      );
    },
    onError: error => {
      RNProgressHud.dismiss();
      console.log(error);
    },
  });

  const onPressFaq = () => {
    navigation.navigate(Routes.faq.name, {});
  };

  const onBackupProfile = useCallback(() => {
    RNProgressHud.show();
    backup();
  }, [backup]);

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#000'}}>
      <HeaderWithChevron title="Backup" customBack={() => navigation.popToTop()} />
      <View style={container}>
        <Text style={text}>
          A backup will be created and stored on our servers. Your inventory can be restored to the current state upon
          request. See the{' '}
          <Text style={[text, faqLink]} onPress={onPressFaq}>
            FAQ{' '}
          </Text>{' '}
          for more details.
        </Text>
        <ButtonNew style={buttonStyle} text="SAVE" isDisabled={loading} onPress={onBackupProfile} />
        <View style={{flex: 1}} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  text: {color: '#fff', fontSize: 21, ...textStyles.mediumText},
  faqLink: {
    textDecorationLine: 'underline',
  },
  container: {paddingHorizontal: 20, justifyContent: 'center', alignItems: 'center', flex: 1, marginTop: 20},
  buttonStyle: {
    minHeight: 50,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    backgroundColor: Colors.orangeDashboard,
    marginTop: 20,
  },
});

const {text, faqLink, buttonStyle, container} = styles;

export const BackupScreen = withNavigation(Backup);
