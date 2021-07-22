import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import textStyle from '../../../constants/Styles/textStyle';
interface EmptyProps {
  errorMessage: string;
  styleContainer?: object;
}

const Empty: React.FC<EmptyProps> = ({errorMessage, styleContainer}) => {
  return (
    <View style={[container, styleContainer]}>
      <Text style={text}>
        {errorMessage !== ''
          ? errorMessage
          : 'We noticed you have an empty and lonely cellar. You can sync your Cellar Tracker inventory on the link below. We can also help you import your Vivino Inventory or Wish List. See the Info & Contacts section'}
      </Text>
    </View>
  );
};
export const WishlistEmpty = Empty;

const style = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
    alignItems: 'center',
    padding: 20,
    marginTop: '20%',
  },
  text: {
    fontSize: 17,
    color: 'white',
    ...textStyle.mediumText,
    marginTop: 20,
  },
});

const {container, text} = style;
