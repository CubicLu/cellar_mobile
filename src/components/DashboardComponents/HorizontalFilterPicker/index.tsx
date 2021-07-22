import React, {FC, useEffect, useRef, useState} from 'react';
import {View, Text, StyleSheet, ScrollView, Dimensions, TouchableOpacity, FlatList, Alert} from 'react-native';
import _ from 'lodash';
import {useLazyQuery, useMutation} from '@apollo/react-hooks';
import RNProgressHud from 'progress-hud';

import {GET_CASCADING_FILTERS} from '../../../apollo/queries/filtersList';
import textStyle from '../../../constants/Styles/textStyle';
import {ChevronLeftIcon} from '../../../assets/svgIcons';
import {ADD_LOCAL_FILTER, CLEAR_ALL_INV_FILTERS} from '../../../apollo/client/mutations';
import {Routes} from '../../../constants';
import {NavigationEvents, NavigationScreenProp, withNavigation} from 'react-navigation';
import {checkSyncStatus} from '../../../utils/other.utils';

type Props = {
  data: any;
  renderItem: any;
  navigation: NavigationScreenProp<any>;
};

const screenWidth = Dimensions.get('screen').width;

const ORDER = {
  0: 'price',
  1: 'varietal',
  2: 'country',
  3: 'producer',
};

const HorizontalFilterPickerItem: FC<Props> = ({data, renderItem, navigation}) => {
  const [active, setActive] = useState(0);
  const scrollRef = useRef<ScrollView>();
  const [pickedFilters, setPickedFilters] = useState([]);
  const [list, setList] = useState([data]);
  const [clearAllLocalFilters] = useMutation(CLEAR_ALL_INV_FILTERS);
  const [addLocalFilter] = useMutation(ADD_LOCAL_FILTER);
  const [getFilters] = useLazyQuery(GET_CASCADING_FILTERS, {
    fetchPolicy: 'no-cache',
    onCompleted: data => {
      setList(prevState => [...prevState, data.filters[ORDER[prevState.length]]]);
      setTimeout(onScrollNext, 200);
    },
    onError: error => {
      RNProgressHud.dismiss();
      setPickedFilters(_.initial(pickedFilters));
      setActive(a => a - 1);
      Alert.alert('Error', error.message);
    },
  });

  useEffect(() => {
    setList([data]);
  }, [data]);

  function onScrollNext() {
    scrollRef.current.scrollTo({animated: true, y: 0, x: list.length * screenWidth});
    RNProgressHud.dismiss();
  }
  function reset() {
    setActive(0);
    setList([data]);
    setPickedFilters([]);
  }

  const onPressBack = () => {
    scrollRef.current.scrollTo({animated: false, x: (list.length - 2) * screenWidth});
    if (list.length > 1) {
      setPickedFilters(_.initial(pickedFilters));
      setActive(a => a - 1);
      setList(_.initial(list));
    }
  };

  return (
    <View style={flex1}>
      <NavigationEvents onWillFocus={async () => await checkSyncStatus('Dashboard-price', reset)} />
      <View style={headerContainer}>
        <TouchableOpacity onPress={onPressBack} onLongPress={reset} style={backContainer}>
          <Text style={[!active && opacity0, {alignItems: 'center', justifyContent: 'center'}]}>
            <ChevronLeftIcon height={12} width={12} />
            <Text style={backText}> Back</Text>
          </Text>
        </TouchableOpacity>
        <View style={activeHeaderContainer}>
          <Text style={activeHeaderText}>{_.capitalize(ORDER[active])}</Text>
        </View>
      </View>
      <ScrollView
        onScrollAnimationEnd={() => {}}
        ref={scrollRef}
        style={scrollView}
        horizontal
        pagingEnabled
        scrollEnabled={false}>
        {list.map((el, index) => (
          <FlatList
            style={{width: screenWidth}}
            key={index}
            data={el}
            keyExtractor={(_, i) => `${i}`}
            renderItem={args =>
              renderItem(
                args,
                async () => {
                  const {item}: any = args;
                  const filters = [
                    ...pickedFilters,
                    {
                      field: ORDER[index],
                      values: index === 0 ? [JSON.stringify(item)] : [item.title],
                    },
                  ];

                  if (index === Object.keys(ORDER).length - 1) {
                    await clearAllLocalFilters();
                    filters.map(async f => {
                      await addLocalFilter({
                        variables: {filter: {title: f.values[0]}, category: _.capitalize(f.field)},
                      });
                      navigation.navigate(Routes.inventoryStackForDashboard.name, {isDashboard: true});
                    });
                    return;
                  }
                  RNProgressHud.show();
                  setPickedFilters(filters);

                  getFilters({
                    variables: {
                      filters: filters,
                    },
                  });
                  setActive(a => a + 1);
                },
                {tabName: ORDER[index]},
              )
            }
          />
        ))}
      </ScrollView>
    </View>
  );
};

export const HorizontalFilterPicker = withNavigation(HorizontalFilterPickerItem);

const styles = StyleSheet.create({
  flex1: {flex: 1},
  headerContainer: {flexDirection: 'row', alignItems: 'center'},
  backContainer: {borderRadius: 5, padding: 10, justifyContent: 'center', alignItems: 'center', flexDirection: 'row'},
  backText: {color: '#fff', fontSize: 18, ...textStyle.mediumText},
  opacity0: {opacity: 0},
  activeHeaderContainer: {marginLeft: '25%'},
  activeHeaderText: {color: '#fff', ...textStyle.mediumText, fontSize: 20, textAlign: 'center'},
  scrollView: {flexGrow: 1},
});

const {
  flex1,
  headerContainer,
  backContainer,
  backText,
  opacity0,
  activeHeaderContainer,
  activeHeaderText,
  scrollView,
} = styles;
