import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {CloseIconWhite} from '../../../assets/svgIcons';
import textStyle from '../../../constants/Styles/textStyle';

type HederType = {
  label: string;
  goBack: () => void;
};

const Header: React.FC<HederType> = ({label, goBack}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{label}</Text>
      <TouchableOpacity onPress={goBack} style={styles.backContainer}>
        <CloseIconWhite width={20} height={20} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    alignItems: 'center',
    paddingBottom: 20,
  },
  text: {fontSize: 24, color: 'white', ...textStyle.mediumText},
  backContainer: {height: 30, width: 30, justifyContent: 'center', alignItems: 'flex-end'},
});

export default Header;
