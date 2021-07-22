import React, {FC, useRef} from 'react';
import {View, Text, StyleSheet, ActivityIndicator, Dimensions, Alert} from 'react-native';
import {Avatar, Icon} from 'react-native-elements';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {NavigationScreenProp, withNavigation} from 'react-navigation';
import {useMutation} from '@apollo/react-hooks';

import {NoAvatarUserIcon} from '../../../assets/svgIcons';
import textStyle from '../../../constants/Styles/textStyle';
import {BottomSheetNew, ButtonNew} from '../../../new_components';
import {Routes} from '../../../constants';
import {ScalableImage} from '../../../components';
import {compareEditionDate} from '../../../utils/other.utils';
import {DELETE_OWN_POST} from '../../../apollo/mutations/photoStream';

const screenWidth = Dimensions.get('screen').width;

type Props = {
  avatarUrl: string;
  imageUrl: string;
  navigation: NavigationScreenProp<any>;
  location: string;
  text: string;
  canDelete?: boolean;
  canEdit?: boolean;
  userName: string;
  createdAt: string;
  updatedAt: string;
  postID: number;
  onDeleteComplete: () => void;
};

const LiveListItem: FC<Props> = ({
  userName,
  avatarUrl,
  canEdit,
  canDelete,
  imageUrl,
  navigation,
  text,
  location,
  createdAt,
  updatedAt,
  postID,
  onDeleteComplete,
}) => {
  const sheetRef = useRef<any>();

  const [deleteOwnPost] = useMutation(DELETE_OWN_POST, {
    variables: {
      id: postID,
    },
    onCompleted: data => {
      Alert.alert('Success', data.stream__deletePost);
      onDeleteComplete();
    },
    onError: error => Alert.alert('Error', error.message),
  });

  const onDeletePost = () => {
    Alert.alert('', 'Your post will be permanently deleted', [
      {
        text: 'Delete',
        onPress: () => {
          sheetRef.current.close();
          deleteOwnPost();
        },
      },
      {text: 'Cancel'},
    ]);
  };

  return (
    <View style={flex1}>
      <View style={headerContainer}>
        <Avatar
          renderPlaceholderContent={<NoAvatarUserIcon height={40} width={40} />}
          rounded
          source={{uri: avatarUrl}}
        />

        <View style={userInfoContainer}>
          <Text style={[textBasic, userNameText]}>{userName}</Text>
          <View style={locationContainer}>
            <MaterialIcons name="location-on" size={13} color="#ccc" />
            <Text numberOfLines={1} style={[textBasic, locationText]}>
              {location}
            </Text>
          </View>
        </View>

        {(canDelete || canEdit) && (
          <Icon
            underlayColor="transparent"
            name="dots-three-vertical"
            type="entypo"
            color="#fff"
            onPress={() => sheetRef.current.open()}
          />
        )}
      </View>

      <View style={imageContainer}>
        <ScalableImage
          PlaceholderContent={<ActivityIndicator color="#fff" size="large" />}
          width={screenWidth}
          height={screenWidth}
          source={{uri: imageUrl}}
          placeholderStyle={imagePlaceholder}
          resizeMode={'contain'}
        />
      </View>

      <View style={textContainer}>
        {!!text && (
          <Text numberOfLines={5} style={textBasic}>
            {text}
          </Text>
        )}
        <Text style={[textBasic, dateText]}>{compareEditionDate(createdAt, updatedAt)}</Text>
      </View>

      <BottomSheetNew onPressDone={() => {}} sheetContainerBG="transparent" controls={false} ref={sheetRef}>
        <View style={contextMenuContainer}>
          {canEdit && (
            <ButtonNew
              onPress={() => {
                sheetRef.current.close();
                navigation.navigate(Routes.LivePhotoAddition.name, {
                  payload: {
                    imageUrl,
                    text,
                    postID,
                  },
                });
              }}
              style={buttonContainer}
              textStyle={{...textStyle.mediumText}}
              text="Edit"
            />
          )}

          {canDelete && (
            <ButtonNew
              textStyle={{...textStyle.mediumText}}
              onPress={onDeletePost}
              style={buttonContainer}
              text="Delete"
            />
          )}
        </View>
      </BottomSheetNew>
    </View>
  );
};

const styles = StyleSheet.create({
  textBasic: {
    color: '#fff',
    ...textStyle.mediumText,
  },
  userNameText: {
    fontSize: 16,
  },
  locationText: {
    fontSize: 12,
    color: '#ccc',
  },
  headerContainer: {
    paddingHorizontal: 10,
    flexDirection: 'row',
    paddingVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userInfoContainer: {marginLeft: 10, flex: 1},
  locationContainer: {flexDirection: 'row', alignItems: 'center'},
  textContainer: {paddingHorizontal: 20, marginTop: 10},
  imageContainer: {justifyContent: 'center', alignItems: 'center', height: screenWidth},
  dateText: {textAlign: 'right', color: 'gray'},
  contextMenuContainer: {flex: 1, justifyContent: 'space-around', maxHeight: 120},
  buttonContainer: {
    backgroundColor: '#000',
    borderWidth: 3,
    borderColor: '#fff',
  },
  flex1: {flex: 1},
  imagePlaceholder: {backgroundColor: '#000'},
});

const {
  userNameText,
  textBasic,
  locationText,
  headerContainer,
  userInfoContainer,
  locationContainer,
  textContainer,
  imageContainer,
  dateText,
  contextMenuContainer,
  buttonContainer,
  flex1,
  imagePlaceholder,
} = styles;

export const LiveCommunityListItem = withNavigation(LiveListItem);
