import React from 'react';
import {StyleSheet, TouchableOpacity, View, Text} from 'react-native';
import Colors from '../../../constants/colors';
import textStyle from '../../../constants/Styles/textStyle';
import {ChartItem} from '../../../components';

interface CellItemProps {
  item: any;
  onPress: () => void;
  totalSum: number;
  tabName: string;
}

const conditionalView = (tabName, item, totalSum, onPress) => {
  switch (tabName) {
    case 'country':
      return CountryCell({item, totalSum, onPress});
    case 'varietal':
      return VarietalCell({item, totalSum, onPress});
    case 'producer':
      return ProducerCell({item, totalSum, onPress});
    case 'price':
      return PriceCell({item, totalSum, onPress});

    default:
      return DefaultDashboardCell({item, totalSum, onPress});
  }
};

const ProducerCell = ({item, totalSum, onPress}) => {
  return (
    <View style={[defaultContainer]}>
      <ChartItem total={totalSum} title={item.title} count={item.count} onClick={onPress} icon={item.icon} />
    </View>
  );
};

export const PriceCell = ({item, totalSum, onPress}) => {
  return (
    <View style={[defaultContainer]}>
      <ChartItem
        total={totalSum}
        title={`${item.min ? (item.max ? '$' + item.min : '>') : '<'}${`${
          item.hasOwnProperty('min') && item.hasOwnProperty('max') ? ' - ' : ''
        }`} ${item.max ? '$' + item.max : '$' + item.min}`}
        count={item.count}
        onClick={onPress}
        icon={item.icon}
      />
    </View>
  );
};

const DashboardCell: React.FC<CellItemProps> = ({onPress, item, totalSum, tabName}) => {
  return (
    <TouchableOpacity style={[tabName !== 'producer' && container]}>
      {conditionalView(tabName, item, totalSum, onPress)}
    </TouchableOpacity>
  );
};

const CountryCell = ({item, totalSum, onPress}) => {
  return (
    <>
      <View style={defaultContainer}>
        <ChartItem total={totalSum} title={item.title} count={item.count} onClick={onPress} icon={item.icon} />
      </View>
    </>
  );
};

const DefaultDashboardCell = ({item, totalSum, onPress}) => {
  return (
    <>
      <View style={defaultContainer}>
        <ChartItem total={totalSum} title={item.title} count={item.count} onClick={onPress} icon={item.icon} />
      </View>
    </>
  );
};

const VarietalCell = ({item, totalSum, onPress}) => {
  return (
    <>
      <View style={[defaultContainer, {position: 'relative'}]}>
        <TouchableOpacity onPress={onPress} style={producerContainer}>
          <View style={[backLayerProgress]}>
            <View style={[containerProgress, {paddingLeft: 0}]}>
              <Text style={text} numberOfLines={1}>
                {item.title}
              </Text>
            </View>
            <View style={[backLayerProgress, varietalProgress]}>
              <View
                style={[
                  frontLayerProgress,
                  {
                    width: `${(item.count / totalSum) * 100}%`,
                    minHeight: 10,
                    backgroundColor: item.color,
                  },
                ]}
              />
            </View>
          </View>
          <View style={percentage}>
            <Text style={[countText, {...textStyle.robotoBold}]} maxFontSizeMultiplier={1.1}>
              {item.count} ({((item.count / totalSum) * 100).toFixed(2)}%)
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </>
  );
};

export const DashboardCellItem = DashboardCell;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    marginBottom: 10,
    flexShrink: 1,
  },
  varietalProgress: {
    minHeight: 12,
    position: 'absolute',
    bottom: 0,
    left: 0,
  },
  defaultContainer: {
    flex: 1,
    paddingHorizontal: 10,
  },
  backLayerProgress: {
    width: '100%',
    minHeight: 40,
    justifyContent: 'center',
  },
  text: {
    alignSelf: 'center',
    marginLeft: 10,
    marginBottom: 5,
    fontSize: 16,
    color: 'white',
    ...textStyle.robotoRegular,
  },
  frontLayerProgress: {
    minWidth: 10,
    height: '100%',
    fontFamily: 'Futura-Medium',
    backgroundColor: Colors.dashboardRed,
    position: 'absolute',
  },
  countBox: {
    height: 40,
    width: '15%',
    justifyContent: 'center',
    alignItems: 'flex-end',
    position: 'absolute',
    right: 0,
  },
  countText: {
    fontSize: 16,
    color: 'white',
    ...textStyle.boldText,
  },
  containerProgress: {
    flexDirection: 'row',
    width: '70%',
    paddingLeft: 10,
    paddingRight: 15,
  },
  producerContainer: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    width: '100%',
    marginTop: 0,
    marginRight: 'auto',
    marginBottom: 0,
    marginLeft: 'auto',
  },
  percentage: {position: 'absolute', right: 5, flex: 1, bottom: 0, top: 0, justifyContent: 'center'},
});
const {
  container,
  defaultContainer,
  backLayerProgress,
  text,
  frontLayerProgress,
  producerContainer,
  countText,
  containerProgress,
  percentage,
  varietalProgress,
} = styles;
