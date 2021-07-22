import React from 'react';
import {Text, Image, TouchableOpacity, StyleSheet, View} from 'react-native';
import Images from '../../../assets/images';
interface CellItemProps {
  isFailed: boolean;
  onPress: () => void;
}

const FailComponent = ({onPress}) => {
  return (
    <>
      <Image source={Images.redCross} style={{height: 40, width: 40}} />
      <Text style={{fontSize: 25, color: 'red', marginTop: 10}}>Wine not found</Text>
      <TouchableOpacity onPress={() => onPress()} style={{marginTop: '5%'}}>
        <Text style={{fontSize: 20}}>Add wine manually</Text>
      </TouchableOpacity>
    </>
  );
};

const SuccessComponent = () => {
  return (
    <>
      <Image source={Images.checkMark} style={{height: 40, width: 40}} />
      <Text style={{fontSize: 25, color: 'green', marginTop: 10}}>Wine found</Text>
    </>
  );
};

const FailSuccess: React.FC<CellItemProps> = ({isFailed, onPress}) => {
  return (
    <View
      style={{
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        height: '30%',
      }}>
      {isFailed ? <FailComponent onPress={onPress} /> : <SuccessComponent />}
    </View>
  );
};
export const FailSuccessView = FailSuccess;

const style = StyleSheet.create({});
