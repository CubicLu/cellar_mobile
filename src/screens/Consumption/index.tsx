import RNProgressHud from 'progress-hud';
import React, {useState, useRef, FC} from 'react';
import {
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  Keyboard,
  Alert,
  TextProperties,
  StatusBar,
  Dimensions,
} from 'react-native';

import {OutlinedTextField} from 'react-native-material-textfield-label-fixed';
import {Picker} from '@davidgovea/react-native-wheel-datepicker';
import DateTimePicker from '@react-native-community/datetimepicker';
import {NavigationEvents} from 'react-navigation';
import {useMutation} from '@apollo/react-hooks';

import Navigation from '../../types/navigation';

import {flagsToUpdateAll} from '../../utils/inventory.utils';
import textStyle from '../../constants/Styles/textStyle';
import {reasonList} from '../../constants/reasonList';
import Colors from '../../constants/colors';
import Photos from '../../assets/photos';

import {ADD_OR_REMOVE_BOTTLES} from '../../apollo/mutations/addOrRemoveBottles';

import {HeaderWithAside} from '../../components';
import {InfoCell, BottomSheetNew, InputNew} from '../../new_components';

import {requiredBottleScore} from '../../utils/validation';

interface InventoryProps {
  navigation: Navigation;
}

const now = new Date();
const screenWidth = Dimensions.get('screen').width;

const Consumption: FC<InventoryProps> = ({navigation}) => {
  const bottleCountRef = useRef();
  const dateRef = useRef();
  const reasonRef = useRef();
  const bottleNoteRef = useRef();
  const bottleScoreRef = useRef();

  const [bottleScore, setBottleScore] = useState(null);
  const [bottleNote, setBottleNote] = useState('');
  const [bottleCount, setBottleCount] = useState(1);
  const [displayBottleCount, setDisplayBottleCount] = useState(1);
  const [reason, setReason] = useState('Consumed');
  const [displayReason, setDisplayReason] = useState('Consumed');
  const [isDrink] = useState(navigation.getParam('isDrink', true));
  const [date, setDate] = useState(now);
  const [displayDate, setDisplayDate] = useState(now.toDateString());

  const isRateError = requiredBottleScore(bottleScore);

  const [addOrRemove] = useMutation(ADD_OR_REMOVE_BOTTLES, {
    onCompleted: async data => {
      console.log(data);
      navigation.goBack();
      navigation.state.params.onRefresh();
      await flagsToUpdateAll();
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

  const onPressDone = async () => {
    RNProgressHud.show();
    const dateNow = new Date();
    await addOrRemove({
      variables: {
        wineId: navigation.getParam('wineId', 'error'),
        numberOfBottles: isDrink ? -bottleCount : bottleCount,
        date: `${displayDate} ${dateNow.getUTCHours()}:${dateNow.getUTCMinutes()}:${dateNow.getUTCSeconds()}:`,
        note: bottleNote,
        rating: bottleScore,
        reason: isDrink ? displayReason.replace('/', '_') : undefined,
      },
    });
  };

  const onChangeRate = value => {
    const parseRate = parseInt(value, 10);
    setBottleScore(parseRate);
  };

  return (
    <View style={container}>
      <NavigationEvents
        onWillFocus={() => {
          StatusBar.setBarStyle('dark-content');
        }}
      />

      <HeaderWithAside
        text={isDrink ? 'Drink wine' : 'Add to cellar'}
        asideSrc={Photos.bgAddCellar}
        headerTitleStyle={screenWidth > 375 && topPadding}
        renderHeaderRightButton={() => (
          <TouchableOpacity
            disabled={!!(isDrink && isRateError)}
            onPress={onPressDone}
            style={[addButtonStyle, isDrink && drinkButtonStyle, isRateError && errorDrinkButtonStyle]}>
            <Text style={addButtonTextStyle}>{isDrink ? 'Drink' : 'Add'}</Text>
          </TouchableOpacity>
        )}>
        <View style={flex1}>
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
          {isDrink && (
            <View style={topMargin}>
              <InputNew
                placeHolder={'Wine Score 1-100'}
                value={bottleScore}
                onChange={(value: string) => onChangeRate(value)}
                onSubmitEditing={() => Keyboard.dismiss()}
                keyboardType={'numeric'}
                returnKeyType={'done'}
                requiredColorValidation={Colors.inputBorderGrey}
                x1={-2.5}
                error={requiredBottleScore(bottleScore)}
                getRef={bottleScoreRef}
              />
            </View>
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
            maxLength={280}
            activeLineWidth={2}
            fontSize={21}
            autoCorrect={false}
            disabledLineWidth={2}
            baseColor={Colors.inputBorderGrey}
            containerStyle={containerInput}
            inputContainerStyle={inputStyle}
            autoFocus={false}
            style={[styleMultiline, multilineInputMargin]}
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
        </View>

        <BottomSheetNew
          onPressDone={() => {
            setDisplayDate(date.toDateString());
            (dateRef as any).current.close();
          }}
          ref={dateRef}>
          <DateTimePicker
            display="spinner"
            mode="date"
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
      </HeaderWithAside>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {height: '100%', backgroundColor: '#000'},
  flex1: {flex: 1},
  bottomSheetContainer: {
    width: '100%',
    backgroundColor: 'black',
  },
  containerInput: {
    marginTop: 20,
    minHeight: 200,
    width: '100%',
    alignItems: 'flex-start',
  },
  inputStyle: {
    paddingTop: 0,
    paddingBottom: 0,
    minHeight: 125,
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
  addButtonStyle: {
    width: 80,
    backgroundColor: '#E6750E',
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  drinkButtonStyle: {backgroundColor: '#64091C'},
  errorDrinkButtonStyle: {opacity: 0.5},
  whiteColor: {color: '#fff'},
  addButtonTextStyle: {color: '#fff', fontSize: 25, ...textStyle.mediumText},
  topPadding: {paddingTop: 20},
  topMargin: {marginTop: 20},
  multilineInputMargin: {marginLeft: 22},
});

const {
  container,
  flex1,
  bottomSheetContainer,
  containerInput,
  inputStyle,
  styleMultiline,
  addButtonStyle,
  addButtonTextStyle,
  drinkButtonStyle,
  errorDrinkButtonStyle,
  whiteColor,
  topPadding,
  topMargin,
  multilineInputMargin,
} = styles;

export const ConsumptionScreen = Consumption;
