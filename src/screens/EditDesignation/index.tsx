import React, {FC, useCallback, useEffect, useState} from 'react';
import RNProgressHud from 'progress-hud';
import _ from 'lodash';
import {useMutation, useQuery} from '@apollo/react-hooks';
import {NavigationScreenProp} from 'react-navigation';

import {View, Text, StyleSheet, SafeAreaView, TouchableOpacity, FlatList, Alert} from 'react-native';
import {DesignationInput} from '../../components';
import Colors from '../../constants/colors';
import {HeaderWithChevron} from '../../components';
import textStyle from '../../constants/Styles/textStyle';
import {UPDATE_CELLAR_DESIGNATIONS} from '../../apollo/mutations/invenotry';
import {GET_LOCAL_DESIGNATION_LIST} from '../../apollo/client/queries/InventoryLocalQueries';
import {SAVE_DESIGNATION_LIST} from '../../apollo/client/mutations';
import {GET_DESIGNATION_LIST} from '../../apollo/queries/inventory';

type Props = {
  navigation: NavigationScreenProp<any>;
};

export type LocationItem = {
  id: number;
  name: string;
};

const Edit: FC<Props> = ({navigation}) => {
  const [isEditionActive, setIsEditionActive] = useState<boolean>(false);
  const [locationList, setLocationList] = useState([]);
  const [activeRef, setActiveRef] = useState(null);

  const {data: localDesignationList} = useQuery(GET_LOCAL_DESIGNATION_LIST, {
    onCompleted: data => {
      if (data) {
        setLocationList(data.designationList);
      }
    },
  });
  const setLocation = navigation.getParam('setLocation');
  const [saveDesignationList] = useMutation(SAVE_DESIGNATION_LIST, {onCompleted: () => RNProgressHud.dismiss()});

  useQuery(GET_DESIGNATION_LIST, {
    fetchPolicy: 'network-only',
    onCompleted: data => {
      setLocationList(data.cellarDesignations);
      saveDesignationList({
        variables: {
          list: data.cellarDesignations,
        },
      });
    },
    onError: error => {
      Alert.alert(error.message);
    },
  });

  const [updateDesignationArray] = useMutation(UPDATE_CELLAR_DESIGNATIONS, {
    onCompleted: data => {
      Alert.alert('', data.updateCellarDesignations.message);
      saveDesignationList({variables: {list: data.updateCellarDesignations.cellarDesignations}});
      RNProgressHud.show();
    },
  });

  useEffect(() => {}, []);

  const onSetLocation = (value: LocationItem) => {
    navigation.goBack();
    setLocation(value);
  };

  const onSaveEdition = useCallback(() => {
    let isInputValid = true;
    const diffArray = _.differenceBy(locationList, localDesignationList.designationList, 'name');

    setIsEditionActive(v => !v);

    diffArray.map(el => (el.name === '' ? (isInputValid = false) : null));

    if (activeRef) {
      if (isInputValid) {
        updateDesignationArray({
          variables: {cellarDesignations: diffArray},
        });

        activeRef.current.blur();
        setActiveRef(null);
      } else {
        Alert.alert('', 'Location must include more than 1 symbol');
        setIsEditionActive(true);
      }
    }
  }, [locationList, activeRef]);

  return (
    <View style={[flex1, screenContainer]}>
      <SafeAreaView>
        <HeaderWithChevron
          titleTextProps={{numberOfLines: 1}}
          title="Edit Location"
          renderRightButton={() => (
            <TouchableOpacity onPress={onSaveEdition} style={headerRightButtonContainer}>
              <Text style={headerRightButtonText}>{isEditionActive ? 'Save' : 'Edit'}</Text>
            </TouchableOpacity>
          )}
        />

        <FlatList<LocationItem>
          style={listContainer}
          data={locationList ? locationList : []}
          keyExtractor={(__, index) => `${index}`}
          renderItem={({item}) => (
            <DesignationInput
              onChangeValue={(newItem: LocationItem) =>
                setLocationList(locationList.map(el => (el.id === newItem.id ? newItem : el)))
              }
              onSelectLocation={setLocation && onSetLocation}
              item={item}
              setActiveRef={ref => setActiveRef(ref)}
              editActive={isEditionActive}
            />
          )}
        />
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  flex1: {flex: 1},
  screenContainer: {
    backgroundColor: Colors.inventoryItemBg,
  },
  headerRightButtonText: {color: '#fff', ...textStyle.mediumText, fontSize: 20},
  listContainer: {paddingTop: 20, flexGrow: 1, paddingBottom: '50%'},
  headerRightButtonContainer: {
    backgroundColor: Colors.orangeDashboard,
    width: 80,
    justifyContent: 'center',
    alignItems: 'center',
    height: 80,
  },
});

const {flex1, screenContainer, headerRightButtonContainer, listContainer, headerRightButtonText} = styles;

export const EditDesignationScreen = Edit;
