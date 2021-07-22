import React, {FC} from 'react';
import {View, StyleSheet, Keyboard} from 'react-native';
import {InputNew} from '../../../../new_components';
import Colors from '../../../../constants/colors';

type Props = {
  requestedPrice: number;
  requestedCount: number;
};

const Details: FC<Props> = ({requestedPrice, requestedCount}) => {
  return (
    <View style={container}>
      <View style={[StyleSheet.absoluteFill, zIndex1]} />
      <View style={flex1}>
        <InputNew
          placeHolder={'Number of bottles'}
          value={`${requestedCount}`}
          onChange={() => {}}
          onSubmitEditing={() => Keyboard.dismiss()}
          keyboardType={'default'}
          returnKeyType={'done'}
          error={''}
          requiredColorValidation={Colors.inputBorderGrey}
        />
      </View>
      <View style={flex1}>
        <InputNew
          placeHolder={'Cost per bottle'}
          value={`${requestedPrice}`}
          onChange={() => {}}
          onSubmitEditing={() => Keyboard.dismiss()}
          keyboardType={'default'}
          returnKeyType={'done'}
          error={''}
          requiredColorValidation={Colors.inputBorderGrey}
          containerStyle={{marginTop: 20}}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {paddingHorizontal: 20, position: 'relative', marginTop: 20},
  zIndex1: {zIndex: 1},
  flex1: {flex: 1},
});

const {container, zIndex1, flex1} = styles;

export const CounterDetails = Details;
