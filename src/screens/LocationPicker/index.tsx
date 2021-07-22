import React, {FC, useState, useCallback, useEffect, useRef} from 'react';
import {View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Image, Platform} from 'react-native';
import MapView, {PROVIDER_GOOGLE} from 'react-native-maps';
import {fetchPrettyLocation} from '../../utils/ProfileUtils/locationPicker';
import {androidRequestLocationPermissions} from '../../utils/ProfileUtils/permissionUtils';
import Geolocation from '@react-native-community/geolocation';

import Images from '../../assets/images';
import Navigation from '../../types/navigation';
import {Save} from '../../components';
import {isNull} from 'lodash';

interface LocationProps {
  navigation: Navigation;
}

const Picker: FC<LocationProps> = ({navigation}) => {
  const mapRef = useRef<MapView>(null);
  const title = navigation.getParam('title', 'Location');
  const [bottomMargin, setBottomMargin] = useState({marginBottom: 1});
  const [locationText, setLocationText] = useState('');

  const initialRegion = {
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  const [formatedLocation, setFormatedLocation] = useState({prettyLocationName: '', city: ''});
  const location = JSON.parse(navigation.getParam('location', '"{"latitude":-14.5994134,"longitude":-28.6731465}"'));

  useEffect(() => {
    Geolocation.getCurrentPosition(
      ({coords: {latitude, longitude}}) => {
        mapRef.current.animateCamera({center: {latitude, longitude}});
        console.log({latitude, longitude});
      },
      () => {
        mapRef.current.animateCamera({
          center: {latitude: initialRegion.latitude, longitude: initialRegion.longitude},
        });
      },
    );
  }, []);

  const onMapIsReady = async () => {
    console.log('map is ready');
    setBottomMargin({marginBottom: 0});
    if (Platform.OS === 'android') {
      await androidRequestLocationPermissions();
    }
  };

  const _onRegionChangeComplete = async region => {
    try {
      const response = await fetchPrettyLocation(region);
      setFormatedLocation(response);

      isNull(response) || response.city === ''
        ? setLocationText('Please, select valid location')
        : setLocationText(response.prettyLocationName);
    } catch (error) {
      setLocationText('Error while fetching location');
    }
  };

  const onSave = useCallback(() => {
    navigation.state.params.onSelect(formatedLocation);
    navigation.popToTop();
  }, [formatedLocation, navigation]);

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={header}>
        <TouchableOpacity
          style={touchableStyle}
          onPress={() => {
            navigation.popToTop();
          }}>
          <Image source={Images.backArrow} style={backArrow} resizeMode={'stretch'} />
        </TouchableOpacity>
        <View style={topBarContent}>
          <Text style={topBarText}>{title}</Text>
        </View>
        <Save onPress={onSave} disabled={!formatedLocation || !formatedLocation.city} />
      </View>
      <View style={{flex: 1, position: 'relative'}}>
        <MapView
          onRegionChangeComplete={region => _onRegionChangeComplete(region)}
          provider={PROVIDER_GOOGLE}
          onMapReady={onMapIsReady}
          ref={mapRef}
          style={[mapViewContainer, bottomMargin]}
          initialRegion={
            location.latitude
              ? {
                  latitude: location.latitude,
                  longitude: location.longitude,
                  latitudeDelta: 0.0922,
                  longitudeDelta: 0.0421,
                }
              : initialRegion
          }
          minZoomLevel={5}
          maxZoomLevel={13}
          showsMyLocationButton={true}
          showsUserLocation={true}>
          <View style={[locationStringBlock, bottomMargin]}>
            <Text style={locationString}>{locationText}</Text>
          </View>
          <Image source={Images.mapPin} style={mapPin} />
        </MapView>
      </View>
    </SafeAreaView>
  );
};

const stylesMain = StyleSheet.create({
  header: {
    height: 80,
    width: '100%',
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: 'white',
    shadowOffset: {width: 0, height: 3},
    shadowColor: 'black',
    shadowOpacity: 0.4,
    zIndex: 1,
  },
  backArrow: {
    width: 30,
    height: 30,
  },
  topBarContent: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginLeft: 40,
    alignItems: 'center',
  },
  topBarText: {fontSize: 26},
  touchableStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 60,
    width: 60,
  },
  locationStringBlock: {
    position: 'absolute',
    top: 0,
    width: '100%',
    alignItems: 'center',
  },
  locationString: {
    top: 10,
    padding: 7,
    width: '96%',
    backgroundColor: 'white',
    textAlign: 'center',
    shadowOffset: {width: 0, height: 3},
    shadowColor: 'black',
    shadowOpacity: 0.2,
  },
  mapPin: {
    transform: [{translateY: -18}],
    width: 40,
    height: 35,
    resizeMode: 'contain',
    zIndex: 1,
  },
  mapViewContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
});

const {
  header,
  backArrow,
  topBarContent,
  topBarText,
  touchableStyle,
  locationStringBlock,
  locationString,
  mapPin,
  mapViewContainer,
} = stylesMain;

export const LocationPicker = Picker;
