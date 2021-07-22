import React from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import textStyle from '../../../constants/Styles/textStyle';
import Colors from '../../../constants/colors';
import {
  AppellationIcon,
  CountryIcon,
  ProducerIcon,
  RegionIcon,
  SubRegionIcon,
  VarietalIcon,
  VintageIcon,
} from '../../../assets/svgIcons';
import _ from 'lodash';

interface itemProps {
  formattedFilters: any;
}

const switchIcon = field => {
  const defaultSize = 50;
  switch (field.toLowerCase()) {
    case 'producer':
      return <ProducerIcon height={defaultSize} width={defaultSize * 1.13} />;
    case 'varietal':
      return <VarietalIcon height={defaultSize} width={defaultSize} />;
    case 'country':
      return <CountryIcon height={defaultSize} width={defaultSize} />;
    case 'region':
      return <RegionIcon height={defaultSize} width={defaultSize} />;
    case 'subregion':
      return <SubRegionIcon height={defaultSize} width={defaultSize * 1.17} />;
    case 'appellation':
      return <AppellationIcon height={defaultSize} width={defaultSize * 0.63} />;
    case 'vintage':
      return <VintageIcon height={defaultSize} width={defaultSize * 0.61} />;
    default:
      return <CountryIcon height={defaultSize} width={defaultSize} />;
  }
};
const icons = formattedFilters => {
  let combinedFilters = [];
  const test = _.cloneDeep(formattedFilters);
  test.forEach(item => {
    const found = combinedFilters.some(el => el.field === item.field);
    if (found) {
      combinedFilters.map(el => {
        if (el.field === item.field) {
          el.values = [...el.values, ...item.values];
        }
      });
    } else {
      combinedFilters.push(item);
    }
  });
  return combinedFilters.map(item => {
    return (
      <View style={outerContainer} key={item.field}>
        {switchIcon(item.field)}
        <View style={container}>
          <View style={countContainer}>
            <Text style={text}>{item.values.length}</Text>
          </View>
        </View>
      </View>
    );
  });
};
const InventoryIcons: React.FC<itemProps> = ({formattedFilters}) => {
  return (
    <View style={{flex: 1, minHeight: 60}}>
      <ScrollView
        horizontal
        contentContainerStyle={{flexGrow: 1, paddingRight: 6}}
        style={{
          width: '100%',
          flex: 1,
        }}>
        {icons(formattedFilters)}
      </ScrollView>
    </View>
  );
};
export const InventoryFiltersIcons = InventoryIcons;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    bottom: -4,
    left: 0,
    right: 0,
    alignSelf: 'center',
  },
  text: {
    ...textStyle.mediumText,
    fontSize: 16,
    color: 'white',
  },
  countContainer: {
    backgroundColor: Colors.orangeDashboard,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 20,
    minHeight: 20,
  },
  outerContainer: {
    marginBottom: 20,
    marginLeft: 10,
  },
});
const {container, text, countContainer, outerContainer} = styles;
