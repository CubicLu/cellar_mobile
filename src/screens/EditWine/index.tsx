import React, {FC} from 'react';
import {Dimensions, StyleSheet} from 'react-native';
import {HeaderWithAside} from '../../components';
import {InventoryEditWineBody} from '../../components/InventoryComponents/InventoryEditBody';
import Photos from '../../assets/photos';

const screenWidth = Dimensions.get('screen').width;

const EditWine: FC = () => {
  return (
    <HeaderWithAside asideSrc={Photos.bgCellar} headerTitleTextStyle={styles.asideHeader} text="Edit Wine">
      <InventoryEditWineBody />
    </HeaderWithAside>
  );
};

const styles = StyleSheet.create({
  asideHeader: {fontSize: screenWidth < 375 ? 40 : 50, paddingTop: 10},
});

export const EditWineScreen = EditWine;
