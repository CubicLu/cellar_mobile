import React, {FC} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import textStyle from '../../../constants/Styles/textStyle';
import Colors from '../../../constants/colors';
import {isNull} from 'lodash';

type Props = {
  data: {bottleNote: string | null}[];
  loading: boolean;
};

const Notes: FC<Props> = ({data, loading}) => {
  const isBottleNotesExist = data.reduce((t, c) => {
    if (isNull(c.bottleNote)) {
      return t || false;
    }
    return true;
  }, false);

  return (
    isBottleNotesExist && (
      <>
        {loading && (
          <View style={container}>
            <Text style={h1}>Bottle notes</Text>
            {data.map(
              (bottle, index) =>
                bottle.bottleNote && (
                  <View style={noteContainer} key={index}>
                    <Text style={noteText}>{bottle.bottleNote}</Text>
                  </View>
                ),
            )}
          </View>
        )}
      </>
    )
  );
};

const styles = StyleSheet.create({
  container: {paddingLeft: 18, marginTop: 20, paddingRight: 18, paddingBottom: 5},
  noteText: {...textStyle.mediumText, color: '#fff', fontSize: 16},
  noteContainer: {borderBottomWidth: 3, borderBottomColor: Colors.inputBorderGrey, marginBottom: 20},
  h1: {color: '#fff', fontSize: 24, ...textStyle.boldText},
});

const {noteText, container, h1, noteContainer} = styles;

export const BottleNotes = Notes;
