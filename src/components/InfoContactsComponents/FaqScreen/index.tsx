import RNProgressHud from 'progress-hud';
import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  StatusBar,
  ImageBackground,
  Platform,
  Linking,
  ScrollView,
} from 'react-native';
import Accordion from 'react-native-collapsible/Accordion';
import ParsedText from 'react-native-parsed-text';
import {getStatusBarHeight} from 'react-native-iphone-x-helper';
import {useLazyQuery} from '@apollo/react-hooks';

import Images from '../../../assets/images';
import Photos from '../../../assets/photos';
import {GET_FAQ} from '../../../apollo/queries/faq';
import Colors from '../../../constants/colors';
import textStyle from '../../../constants/Styles/textStyle';
import Navigation from '../../../types/navigation';
import {timeoutError} from '../../../utils/errorCodes';

interface InventoryProps {
  navigation: Navigation;
}
const Faq: React.FC<InventoryProps> = ({navigation}) => {
  const [data, setData]: any = useState([]);
  const [active, setActive]: any = useState([]);
  const [errorText, setError]: any = useState();
  const [headerCellHeights]: any = useState([]);
  const scrollRef = useRef();
  const _updateSections = activeSections => {
    /*if (activeSections.length === 0) {
      setContentHeight(-contentHeight);
    }*/
    setActive(activeSections);
  };
  const [loadFaq, {loading, data: serverFaq, error}] = useLazyQuery(GET_FAQ, {
    fetchPolicy: 'network-only',
  });
  const handleEmailPress = (email: string) => {
    Linking.openURL(`mailto:${email}`);
  };

  useEffect(() => {
    if (loading) {
      RNProgressHud.show();
    } else {
      RNProgressHud.dismiss();
    }
    if (serverFaq) {
      setData(serverFaq.faq);
    }
    if (error) {
      timeoutError(error);
      setError(error.message.toString());
    }
  }, [serverFaq, loading, error]);

  /* useEffect(() => {
    setTimeout(() => {
      if (headerCellHeights.length) {
        console.log('CONTent', contentHeight);
        let y = active[0] > 1 ? headerCellHeights.reduce((a, b, i) => (i < active[0] ? a + b : a)) : 0;
        const fullHeight = y + contentHeight + getStatusBarHeight(true) + 50;
        console.log('FULL', fullHeight);
        const screenHeight =
          Dimensions.get('window').height - getStatusBarHeight(true) + currentScroll - contentHeight - 50;
        console.log('SCREEN', screenHeight);
        (scrollRef as any).current.scrollTo({x: 0, y: y, animated: true});
      }
    }, 200);
  }, [contentHeight]);
*/
  useEffect(() => {
    loadFaq();
  }, []);

  const _renderContent = section => {
    return (
      <View
        /* onLayout={event => {
          const {height} = event.nativeEvent.layout;
          if (height !== 40) {
            setContentHeight(height);
          }
        }}*/
        style={contentContainer}>
        <ParsedText style={contentText} parse={[{type: 'email', style: {color: '#007AFF'}, onPress: handleEmailPress}]}>
          {section.content}
        </ParsedText>
      </View>
    );
  };
  return (
    <View style={{height: '100%', backgroundColor: 'black'}}>
      <StatusBar barStyle={'light-content'} />
      <ImageBackground source={Photos.splash} style={{flex: 1}}>
        <View style={{flex: 1, flexDirection: 'row'}}>
          <View style={leftTabContainer}>
            <View style={backContainer}>
              <TouchableOpacity
                style={backTouchable}
                onPress={() => {
                  navigation.goBack();
                }}>
                <Image source={Images.backWhite} style={{height: 30, width: 30}} />
              </TouchableOpacity>
            </View>
          </View>
          {!errorText ? (
            <ScrollView
              /*  onScroll={event => {
                setCurrentScroll(event.nativeEvent.contentOffset.y);
              }}*/
              ref={scrollRef}
              indicatorStyle={'white'}
              contentContainerStyle={{paddingBottom: 100}}
              style={container}>
              <Text style={header}>FAQ</Text>
              <Accordion
                sections={data}
                activeSections={active}
                renderHeader={section => (
                  <View
                    onLayout={event => {
                      const {height: heightHeader} = event.nativeEvent.layout;
                      headerCellHeights.push(heightHeader);
                    }}
                    style={itemContainer}>
                    <Text style={title}>{section.title}</Text>
                  </View>
                )}
                renderContent={_renderContent}
                onChange={_updateSections}
              />
            </ScrollView>
          ) : (
            <View style={[errorContainer, container]}>
              <Text style={errorTextStyle}>{errorText}</Text>
            </View>
          )}
        </View>
      </ImageBackground>
    </View>
  );
};

export const FaqScreen = Faq;

export const stylesInfo = StyleSheet.create({
  container: {
    paddingTop: Platform.select({
      ios: getStatusBarHeight(true),
      android: 0,
    }),
    height: '100%',
    width: '80%',
    paddingLeft: 20,
    paddingRight: 20,
    backgroundColor: 'black',
  },
  leftTabContainer: {
    height: '100%',
    width: '20%',
    paddingTop: Platform.select({
      ios: getStatusBarHeight(true),
      android: 0,
    }),
    backgroundColor: 'transparent',
  },
  backContainer: {
    backgroundColor: Colors.dashboardRed,
  },
  backTouchable: {
    width: 80,
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemContainer: {
    paddingLeft: 20,
    paddingRight: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'white',
    marginTop: 20,
  },
  title: {
    fontSize: 20,
    color: 'white',
    marginBottom: 20,
    ...textStyle.mediumText,
  },
  header: {
    fontSize: 30,
    color: 'white',
    ...textStyle.boldText,
    paddingLeft: 20,
  },
  contentContainer: {
    padding: 20,
    flex: 1,
    backgroundColor: 'rgba(255,255,255, 0.2)',
  },
  contentText: {
    color: 'white',
    fontSize: 17,
    ...textStyle.mediumText,
  },
  errorContainer: {
    justifyContent: 'center',
    alignContent: 'center',
    paddingBottom: 100,
  },
  errorTextStyle: {
    color: 'white',
    ...textStyle.mediumText,
    fontSize: 20,
    textAlign: 'center',
  },
});

const {
  leftTabContainer,
  backContainer,
  container,
  backTouchable,
  itemContainer,
  title,
  header,
  contentContainer,
  contentText,
  errorContainer,
  errorTextStyle,
} = stylesInfo;
