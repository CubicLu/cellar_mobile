import React from 'react';
import {Text, StyleSheet, View} from 'react-native';

interface CellItemProps {
  title: string;
  icon: any;
  index: number;
}

const Section: React.FC<CellItemProps> = ({title, icon, index}) => {
  return (
    <View style={[container, {marginTop: index === 0 ? 0 : 45}]}>
      {icon}
      <Text style={text}>{title}</Text>
    </View>
  );
};
export const SectionHeader = Section;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    marginBottom: 22,
    marginLeft: 20,
  },
  text: {
    fontSize: 24,
    color: 'white',
    fontFamily: 'Futura-Bold',
    marginLeft: 10,
  },
});
const {container, text} = styles;
