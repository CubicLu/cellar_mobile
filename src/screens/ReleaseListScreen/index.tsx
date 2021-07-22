import RNProgressHud from 'progress-hud';
import React, {FC} from 'react';
import {View, StyleSheet, FlatList, Text, TouchableOpacity, Alert, SafeAreaView, Image, Dimensions} from 'react-native';
import {useLazyQuery, useQuery} from '@apollo/react-hooks';
import {NavigationScreenProp} from 'react-navigation';

import {Routes} from '../../constants';
import {GET_RELEASE_ITEM} from '../../apollo/queries/faq';
import textStyle from '../../constants/Styles/textStyle';
import photo from '../../assets/photos';
import {GET_LOCAL_RELEASE_LIST} from '../../apollo/client/queries/other';
import {HeaderWithChevron} from '../../components';
import colors from '../../constants/colors';

type Props = {
  navigation: NavigationScreenProp<any>;
};
type ReleaseItem = {
  from: string;
  release: string;
  isWatched?: boolean;
};

const screenHeight = Dimensions.get('screen').height;

const ReleaseList: FC<Props> = ({navigation}) => {
  const {data: localReleaseList} = useQuery(GET_LOCAL_RELEASE_LIST);

  const [getRelease] = useLazyQuery(GET_RELEASE_ITEM, {
    onCompleted: async data => {
      RNProgressHud.dismiss();

      navigation.navigate(Routes.releaseNotesWebView.name, {
        releaseNotes: data.releaseNotes,
      });
    },
    onError: error => {
      RNProgressHud.dismiss();
      Alert.alert('', error.message);
    },
    fetchPolicy: 'no-cache',
  });

  const onGetRelease = (item: ReleaseItem) => {
    RNProgressHud.show();
    getRelease({variables: {release: item.release}});
  };

  return (
    <View style={container}>
      <SafeAreaView>
        <HeaderWithChevron title="Releases" titleTextStyle={headerTitleText} customBack={() => navigation.goBack()} />
        <View style={contentContainer}>
          <Image source={photo.bgAsideLoginScreen} width={80} height={screenHeight} />
          <FlatList<ReleaseItem>
            data={localReleaseList.releaseList}
            keyExtractor={item => item.release}
            contentContainerStyle={contentContainerStyle}
            indicatorStyle="white"
            renderItem={({item}) => {
              return (
                <TouchableOpacity style={releaseItemContainer} onPress={() => onGetRelease(item)}>
                  <Text
                    numberOfLines={1}
                    adjustsFontSizeToFit
                    style={[releaseText, item.isWatched && watchedTextColor]}>{`Version ${item.release}`}</Text>
                </TouchableOpacity>
              );
            }}
          />
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#000'},
  contentContainer: {flexDirection: 'row'},
  releaseItemContainer: {marginBottom: 15, marginLeft: 20},
  releaseText: {color: colors.orangeDashboard, ...textStyle.mediumText, fontSize: 24},
  watchedTextColor: {color: '#fff'},
  headerTitleText: {color: '#fff', fontSize: 25, ...textStyle.boldText},
  contentContainerStyle: {paddingTop: '10%', flexGrow: 1},
});

const {
  container,
  contentContainer,
  releaseText,
  watchedTextColor,
  contentContainerStyle,
  headerTitleText,
  releaseItemContainer,
} = styles;

export const ReleaseListScreen = ReleaseList;
