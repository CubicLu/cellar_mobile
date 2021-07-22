import React, {FC, useEffect} from 'react';
import {View, Text, StyleSheet, ActivityIndicator} from 'react-native';
import textStyle from '../../../constants/Styles/textStyle';
import {formatInventoryValuation} from '../../../utils/currencies';

type valuationDataType = {
  valuation: number;
  currency?: string;
  quantity?: number;
  marketValuation: number;
};

type Props = {
  loading: boolean;
  data?: valuationDataType;
  refetch: () => void;
};

const Valuation: FC<Props> = ({loading, data, refetch}) => {
  useEffect(() => {
    if (data) {
      const {valuation} = data;

      if (valuation === 0) {
        refetch();
      }
    }
  }, [data, refetch]);

  const {valuation, marketValuation} = data;
  const resizingText =
    (valuation && valuation.toLocaleString.length > 3) ||
    (marketValuation && marketValuation.toLocaleString.length > 3);

  return (
    <View style={container}>
      {!data.marketValuation ? (
        <>
          <View style={[priceContainer, {maxWidth: '50%'}]}>
            {loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              data && (
                <Text style={resizingText ? smallPriceDescText : priceDescText}>
                  Cellar Value: <Text style={priceText}>${formatInventoryValuation(data.valuation)}</Text>
                </Text>
              )
            )}
          </View>
          {/*<View style={priceContainer}>*/}
          {/*  {loading ? (*/}
          {/*    <ActivityIndicator size="small" color="#fff" />*/}
          {/*  ) : (*/}
          {/*    data && (*/}
          {/*      <Text style={resizingText ? smallPriceDescText : priceDescText}>*/}
          {/*        Market Value: <Text style={priceText}>${formatInventoryValuation(data.marketValuation + 1)}</Text>*/}
          {/*      </Text>*/}
          {/*    )*/}
          {/*  )}*/}
          {/*</View>*/}
        </>
      ) : (
        <View style={cellarPriceContainer}>
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            data && <Text style={priceText}>${formatInventoryValuation(data.valuation)}</Text>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flexDirection: 'row', justifyContent: 'flex-end'},
  priceContainer: {
    backgroundColor: 'rgba(230, 117, 14, 0.6)',
    height: 41,
    flex: 1,
    margin: 5,
    justifyContent: 'center',
    paddingHorizontal: 3,
    alignItems: 'center',
  },
  cellarPriceContainer: {
    backgroundColor: 'rgba(230, 117, 14, 0.6)',
    height: 41,
    marginRight: 20,
    justifyContent: 'center',
    paddingHorizontal: 3,
    alignItems: 'center',
  },
  priceDescText: {
    fontSize: 16,
    color: '#fff',
    ...textStyle.mediumText,
  },
  smallPriceDescText: {
    fontSize: 14,
    color: '#fff',
    ...textStyle.mediumText,
  },
  priceText: {...textStyle.boldText, fontSize: 16, color: '#fff'},
});

const {priceContainer, container, priceText, priceDescText, cellarPriceContainer, smallPriceDescText} = styles;

export const InventoryValuation = Valuation;
