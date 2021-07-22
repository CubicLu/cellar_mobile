import RNProgressHud from 'progress-hud';
import React, {useState, useRef, FC} from 'react';
import {StyleSheet, Text, View, TouchableOpacity, Keyboard, Alert, TextProperties} from 'react-native';
import {useMutation} from '@apollo/react-hooks';
import {Picker} from '@davidgovea/react-native-wheel-datepicker';
import DateTimePicker from '@react-native-community/datetimepicker';
import {NavigationScreenProp} from 'react-navigation';
import {OutlinedTextField} from 'react-native-material-textfield-label-fixed';

import {UPDATE_HISTORY_MUTATION} from '../../apollo/mutations/updateHistoryMutation';
import {DELETE_HISTORY_MUTATION} from '../../apollo/mutations/deleteHistoryMutation';

import {flagsToUpdateAll} from '../../utils/inventory.utils';
import textStyle from '../../constants/Styles/textStyle';
import {reasonList} from '../../constants/reasonList';
import Photos from '../../assets/photos';
import Colors from '../../constants/colors';

import {BottomSheetDelete} from '../../components/InventoryComponents/BottomSheetDelete';
import {HeaderWithAside} from '../../components';
import {InfoCell, BottomSheetNew, ButtonNew} from '../../new_components';

type Props = {
  navigation: NavigationScreenProp<any>;
};

const HistoryChange: FC<Props> = ({navigation}) => {
  const bottleCountRef = useRef();
  const dateRef = useRef();
  const reasonRef = useRef();
  const delRef = useRef();
  const bottleNoteRef = useRef();

  const [historyItem]: any = useState(navigation.getParam('historyItem', null));
  const [bottleNote, setBottleNote] = useState(historyItem.purchaseNote === null ? '' : historyItem.purchaseNote);
  const [bottleCount, setBottleCount] = useState(Math.abs(historyItem.numberOfBottles));
  const [displayBottleCount, setDisplayBottleCount] = useState(Math.abs(historyItem.numberOfBottles));
  const [reason, setReason] = useState(historyItem.reason === null ? '' : historyItem.reason.replace('_', '/'));
  const [displayReason, setDisplayReason] = useState(
    historyItem.reason === null ? '' : historyItem.reason.replace('_', '/'),
  );
  const [date, setDate] = useState(new Date(historyItem.purchaseDate));
  const [displayDate, setDisplayDate] = useState(new Date(historyItem.purchaseDate).toDateString());

  const [isDrink] = useState(historyItem.numberOfBottles <= 0);

  const [updateHistoryEntry, {loading: updateLoading}] = useMutation(UPDATE_HISTORY_MUTATION, {
    onCompleted: data => {
      navigation.state.params.onRefresh();
      navigation.goBack();
      console.log(data);
      flagsToUpdateAll();
    },
    onError: error => {
      RNProgressHud.dismiss();
      try {
        console.log(error);
        Alert.alert('Error', error.graphQLErrors[0].message);
      } catch (e) {
        Alert.alert('Error', error.message);
      }
    },
  });

  const [deleteHistoryEntry, {loading: deleteLoading}] = useMutation(DELETE_HISTORY_MUTATION, {
    onCompleted: data => {
      navigation.state.params.onRefresh();
      navigation.goBack();
      console.log(data);
      flagsToUpdateAll();
    },
    onError: error => {
      RNProgressHud.dismiss();
      try {
        console.log(error);
        Alert.alert('Error', error.graphQLErrors[0].message);
      } catch (e) {
        Alert.alert('Error', error.message);
      }
    },
  });

  //check if data is the same to prevent useless request
  const isDisabled = () => {
    const isChangedNote =
      historyItem.purchaseNote === null ? bottleNote === '' : bottleNote === historyItem.purchaseNote;
    if (!historyItem.reason) {
      return (
        Math.abs(historyItem.numberOfBottles) === displayBottleCount &&
        new Date(historyItem.purchaseDate).toDateString() === displayDate &&
        isChangedNote
      );
    }
    return (
      displayReason === historyItem.reason.replace('_', '/') &&
      Math.abs(historyItem.numberOfBottles) === displayBottleCount &&
      new Date(historyItem.purchaseDate).toDateString() === displayDate &&
      isChangedNote
    );
  };

  const onPressDone = async () => {
    RNProgressHud.show();
    const dateNow = new Date(historyItem.purchaseDate);
    await updateHistoryEntry({
      variables: {
        historyId: historyItem.id,
        numberOfBottles: isDrink ? -displayBottleCount : displayBottleCount,
        date: `${displayDate} ${dateNow.getUTCHours()}:${dateNow.getUTCMinutes()}:${dateNow.getUTCSeconds()}:`,
        reason: isDrink ? displayReason.replace('/', '_') : null,
        note: bottleNote,
      },
    });
  };

  const onPressDelete = async () => {
    RNProgressHud.show();
    (delRef as any).current.close();
    await deleteHistoryEntry({
      variables: {historyId: historyItem.id},
    });
  };

  return (
    <HeaderWithAside
      renderHeaderRightButton={() => (
        <TouchableOpacity
          onPress={onPressDone}
          disabled={isDisabled()}
          style={[doneButtonStyle, isDisabled() && doneButtonDisabledStyle]}>
          <Text style={[doneButtonTextStyle, isDisabled() && disabledDoneText]}>Done</Text>
        </TouchableOpacity>
      )}
      headerTitleStyle={{paddingTop: 20}}
      asideSrc={Photos.bgAddCellar}
      text="Edit">
      <View style={{flex: 1}}>
        {!updateLoading && !deleteLoading && RNProgressHud.dismiss()}
        <InfoCell
          title={'Bottles'}
          content={displayBottleCount.toString()}
          onPress={() => (bottleCountRef as any).current.open()}
          error={''}
          rotate={true}
          required={false}
          contentTextStyle={textStyle.mediumText}
        />

        <InfoCell
          title={'Date'}
          content={displayDate}
          onPress={() => (dateRef as any).current.open()}
          error={''}
          rotate={true}
          required={true}
          contentTextStyle={textStyle.mediumText}
        />

        {isDrink && (
          <InfoCell
            title={'Reason'}
            content={displayReason}
            onPress={() => (reasonRef as any).current.open()}
            error={''}
            rotate={true}
            required={false}
            contentTextStyle={textStyle.mediumText}
          />
        )}

        <OutlinedTextField
          value={bottleNote}
          label={'Note'}
          onChangeText={(val: string) => setBottleNote(val)}
          onSubmitEditing={() => Keyboard.dismiss()}
          keyboardType={'default'}
          tintColor={'white'}
          returnKeyType={'done'}
          lineWidth={2}
          maxLength={100}
          activeLineWidth={2}
          fontSize={21}
          autoCorrect={false}
          disabledLineWidth={2}
          baseColor={Colors.inputBorderGrey}
          containerStyle={containerInput}
          inputContainerStyle={inputStyle}
          autoFocus={false}
          style={[styleMultiline, {marginLeft: 22}]}
          labelOffset={{
            x0: 10,
            x1: 1.5,
            y0: -10,
          }}
          contentInset={{
            left: 0,
            input: 0,
            label: 10,
            bottom: 0,
          }}
          multiline={true}
          blurOnSubmit={false}
          labelTextStyle={{...textStyle.mediumText}}
          error={''}
          errorColor={Colors.inputError}
          backgroundLabelColor={'black'}
          ref={bottleNoteRef}
        />

        <ButtonNew text="DELETE" style={buttonStyle} onPress={() => (delRef as any).current.open()} />
      </View>
      <BottomSheetNew
        onPressDone={() => {
          setDisplayDate(date.toDateString());
          (dateRef as any).current.close();
        }}
        ref={dateRef}>
        <DateTimePicker
          mode="date"
          display="spinner"
          style={bottomSheetContainer}
          textColor="#fff"
          value={date}
          maximumDate={new Date()}
          minimumDate={new Date('1630-07-18T08:26:50.000Z')}
          onChange={(event, value) => setDate(value)}
        />
      </BottomSheetNew>

      <BottomSheetNew
        onPressDone={() => {
          setDisplayBottleCount(bottleCount);
          (bottleCountRef as any).current.close();
        }}
        ref={bottleCountRef}>
        <Picker
          style={bottomSheetContainer}
          itemStyle={whiteColor as TextProperties}
          selectedValue={bottleCount}
          pickerData={Array.from({length: 100}, (v, k) => k + 1)}
          onValueChange={value => setBottleCount(value)}
        />
      </BottomSheetNew>

      <BottomSheetNew
        onPressDone={() => {
          setDisplayReason(reason);
          (reasonRef as any).current.close();
        }}
        ref={reasonRef}>
        <Picker
          style={bottomSheetContainer}
          selectedValue={reason}
          itemStyle={whiteColor as TextProperties}
          pickerData={reasonList}
          onValueChange={value => setReason(value)}
        />
      </BottomSheetNew>

      <BottomSheetDelete
        title={'Remove from my Cellar'}
        onPressDelete={() => onPressDelete()}
        onCancel={() => (delRef as any).current.close()}
        ref={delRef}
      />
    </HeaderWithAside>
  );
};

const styles = StyleSheet.create({
  doneButtonStyle: {
    width: 80,
    backgroundColor: '#0B2E33',
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 5,
  },
  doneButtonDisabledStyle: {
    backgroundColor: '#041214',
  },
  doneButtonTextStyle: {color: '#fff', fontSize: 25, ...textStyle.mediumText},
  disabledDoneText: {color: '#bbb'},
  bottomSheetContainer: {
    width: '100%',
    backgroundColor: 'black',
  },
  whiteColor: {color: '#fff'},
  containerInput: {
    marginTop: 20,
    minHeight: 200,
    width: '100%',
    alignItems: 'flex-start',
  },
  inputStyle: {
    paddingTop: 0,
    paddingBottom: 0,
    minHeight: 200,
  },
  styleMultiline: {
    fontSize: 21,
    color: 'white',
    ...textStyle.mediumText,
    alignSelf: 'flex-start',
    paddingTop: 0,
    paddingBottom: 0,
    marginLeft: 18,
  },
  buttonStyle: {
    minHeight: 50,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    backgroundColor: Colors.orangeDashboard,
    marginTop: 20,
  },
});

const {
  doneButtonStyle,
  doneButtonTextStyle,
  doneButtonDisabledStyle,
  bottomSheetContainer,
  whiteColor,
  containerInput,
  inputStyle,
  styleMultiline,
  buttonStyle,
  disabledDoneText,
} = styles;

export const HistoryChangeScreen = HistoryChange;
