import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Image, Text, TouchableOpacity, ScrollView, Alert} from 'react-native';
import {DrawerContentComponentProps} from 'react-navigation-drawer';
import {getStatusBarHeight} from 'react-native-iphone-x-helper';
import {useApolloClient, useQuery} from '@apollo/react-hooks';

import {GET_ACCESS_DATA} from '../../../apollo/queries/accessData';
import Images from '../../../assets/images';
import {DrawerCell} from '../../../components/CommonComponents/DrawerCell';
import {Routes} from '../../../constants';
import Colors from '../../../constants/colors';
import {logout} from '../../../utils/logout';
import AsyncStorage from '@react-native-community/async-storage';

const Drawer: React.ComponentType<DrawerContentComponentProps> = ({navigation}) => {
  const client = useApolloClient();
  const [email, setEmail] = useState('');
  const [isChanged, setIsChanged] = useState(false);
  const [invalidate, setInvalidate] = useState(false);

  const {data: userData} = useQuery(GET_ACCESS_DATA);
  useEffect(() => {
    if (userData.codeVerification.user.email) {
      setEmail(userData.codeVerification.user.email);
    }
  }, [userData.codeVerification.user.email]);

  const onChangeTest = val => {
    setIsChanged(val);
  };

  const onSelectTest = val => {
    setInvalidate(val);
  };

  const onPressItem = (routeName, param) => {
    if (isChanged && navigation.state.index === 6 && navigation.state.isDrawerOpen) {
      Alert.alert(
        'Alert',
        'Are you sure you want to leave this page? Changes made to this page haven’t been saved yet.',
        [
          {
            text: 'Cancel',
            onPress: () => {},
            style: 'cancel',
          },
          {
            text: 'OK',
            onPress: () => {
              navigation.navigate(routeName, param);
              AsyncStorage.setItem('ResetProfile', JSON.stringify({reset: true}));
              setTimeout(() => {
                navigation.closeDrawer();
              });
            },
          },
        ],
        {cancelable: false},
      );
    } else {
      if (routeName === 'InventoryStack' || routeName === 'CommunityInventoryStack') {
        const data = {
          listData: {
            __typename: 'List',
            list: '[]',
          },
        };
        client.writeData({data});
      }
      navigation.navigate(routeName, param);
      navigation.closeDrawer();
    }
  };

  return (
    <View style={container}>
      <TouchableOpacity
        style={accountContainer}
        onPress={() => {
          navigation.closeDrawer();
          navigation.navigate(Routes.profile.name, {
            onChange: onChangeTest,
            invalidate,
            onSelect: onSelectTest,
          });
        }}>
        <Image source={Images.logoRegistration} style={photoPlaceholder} />
        <View style={emailContainer}>
          <Text style={emailText}>{email}</Text>
          <TouchableOpacity style={imageContainer}>
            <Image source={Images.triangle} style={image} resizeMode={'stretch'} />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
      <ScrollView style={drawerContainer}>
        <DrawerCell title={'Inventory'} image={Images.apps} onPress={() => onPressItem('InventoryStack', {})} />
        <DrawerCell
          title={'Dashboard'}
          image={Images.dashboard}
          onPress={() => onPressItem(Routes.dashboard.name, {})}
        />
        <DrawerCell title={'Camera'} image={Images.camera} onPress={() => onPressItem('PhotoRecognitionStack', {})} />
        <DrawerCell title={'Add wine'} image={Images.add} onPress={() => onPressItem('InventoryAdditionStack', {})} />
        <DrawerCell title={'Wishlist'} image={Images.favorite} onPress={() => onPressItem('WishStack', {})} />
        <DrawerCell title={'Sync Now'} image={Images.sync} onPress={() => onPressItem(Routes.cellarImport.name, {})} />
        <DrawerCell
          title={'Info & Contacts'}
          image={Images.info}
          onPress={() => onPressItem(Routes.infoContacts.name, {})}
        />
        <DrawerCell
          title={'Community Inventory'}
          image={Images.community}
          onPress={() => onPressItem('CommunityInventoryStack', {})}
        />
        <DrawerCell title={'Logout'} image={Images.logout} onPress={() => logout(client)} />
      </ScrollView>
    </View>
  );
};

export const DrawerScreen = Drawer;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: getStatusBarHeight(true),
    backgroundColor: Colors.darkGray,
  },
  accountContainer: {
    width: '100%',
    backgroundColor: 'rgba(97,97,97,1)',
    padding: 20,
  },
  photoPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.moreLightGray,
  },
  emailContainer: {
    marginTop: 40,
    flexDirection: 'row',
    alignItems: 'center',
  },
  emailText: {
    color: 'white',
    fontSize: 16,
    width: '90%',
  },
  imageContainer: {
    width: '10%',
    height: 20,
    justifyContent: 'center',
  },
  image: {
    height: 8,
    width: 12,
    alignSelf: 'flex-end',
  },
  drawerContainer: {
    height: '90%',
    width: '100%',
    backgroundColor: 'white',
  },
});

const {
  container,
  accountContainer,
  photoPlaceholder,
  emailContainer,
  emailText,
  imageContainer,
  image,
  drawerContainer,
} = styles;
