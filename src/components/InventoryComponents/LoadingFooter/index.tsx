import React from 'react';
import {View, ActivityIndicator} from 'react-native';
interface Loading {
  color?: string;
}
const Loading: React.FC<Loading> = ({color}) => {
  return (
    <View style={{height: 50, alignItems: 'center', justifyContent: 'center'}}>
      <ActivityIndicator size="large" color={color || 'black'} />
    </View>
  );
};
export const LoadingFooter = Loading;
