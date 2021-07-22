import React, {FC} from 'react';
import {View, Text, StyleSheet, SafeAreaView, Modal, FlatList} from 'react-native';

import {CommunityListItem} from '../../';
import {ButtonNew} from '../../../new_components';
import textStyle from '../../../constants/Styles/textStyle';
import colors from '../../../constants/colors';
import {PHOTO_RECOGNITION_SUGGESTION_TEXT} from '../../../constants/text';
import {parseVuforiaMetadata} from '../../../utils/PhotoRecognitionUtils';

type Props = {
  visible: boolean;
  onClose: () => void;
  list: any[];
  onSuccess: (RecognizedWine) => void;
};

export const WinePicker: FC<Props> = ({visible, onClose, onSuccess, list}) => {
  return (
    <Modal animated visible={visible} presentationStyle="pageSheet">
      <View style={container}>
        <SafeAreaView style={flex1}>
          {list && (
            <FlatList
              data={list}
              keyExtractor={(_, index) => `${index}`}
              ListHeaderComponent={
                <View style={listHeaderContainer}>
                  <Text style={[text, listHeaderText]}>{PHOTO_RECOGNITION_SUGGESTION_TEXT}</Text>
                </View>
              }
              contentContainerStyle={flexGrow1}
              indicatorStyle="white"
              ListFooterComponentStyle={listFooterComponentStyle}
              renderItem={({item}) => {
                const parsedWine = parseVuforiaMetadata(item.metadata);

                if (!parsedWine) {
                  return (
                    <View style={wrongMetaContainer}>
                      <Text style={[text, textAlignCenter]}>
                        Vuforia returned an incompatible metadata for the name: {item.name}
                      </Text>
                    </View>
                  );
                }
                return (
                  <CommunityListItem
                    search=""
                    wine={{wine: parsedWine} as any}
                    onItemPress={() => {
                      onSuccess({
                        producer: parsedWine.producer,
                        ...parsedWine.locale,
                        wineName: parsedWine.wineName,
                        displayVintage: `${parsedWine.vintage}`,
                        vintage: parsedWine.vintage,
                        varietal: parsedWine.varietal,
                      });
                    }}
                  />
                );
              }}
              ListFooterComponent={
                <View style={listFooterContainer}>
                  <ButtonNew onPress={onClose} text="No matches" style={buttonContainer} />
                </View>
              }
            />
          )}
        </SafeAreaView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {backgroundColor: '#000', flex: 1},
  flex1: {flex: 1},
  text: {...textStyle.mediumText, color: '#fff', fontSize: 18},
  listHeaderText: {
    ...textStyle.boldText,
    fontSize: 20,
    textAlign: 'center',
    color: colors.orangeDashboard,
    marginBottom: 10,
  },
  listHeaderContainer: {alignItems: 'center', flex: 1, paddingHorizontal: 20},
  listFooterContainer: {
    margin: 20,
  },
  buttonContainer: {backgroundColor: colors.orangeDashboard},
  wrongMetaContainer: {justifyContent: 'center', alignItems: 'center', padding: 20},
  textAlignCenter: {textAlign: 'center'},
  flexGrow1: {flexGrow: 1},
  listFooterComponentStyle: {flex: 1, justifyContent: 'flex-end'},
});

const {
  container,
  flex1,
  text,
  listHeaderText,
  listFooterContainer,
  buttonContainer,
  textAlignCenter,
  listHeaderContainer,
  wrongMetaContainer,
  flexGrow1,
  listFooterComponentStyle,
} = styles;
