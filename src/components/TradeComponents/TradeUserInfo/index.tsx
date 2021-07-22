import React, {FC} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import PinIcon from 'react-native-vector-icons/MaterialIcons';
import {useQuery} from '@apollo/react-hooks';
import {Avatar} from 'react-native-elements';

import textStyles from '../../../constants/Styles/textStyle';
import Colors from '../../../constants/colors';
import {selectScreenSize} from '../../../utils/other.utils';
import {GET_PUBLIC_PROFILE} from '../../../apollo/queries/trading';

type Props = {
  userId: number;
  hideAvatar?: boolean;
  renderRight?: () => React.ReactNode;
};

const UserInfo: FC<Props> = ({userId, hideAvatar = false, renderRight}) => {
  const {data: profile} = useQuery(GET_PUBLIC_PROFILE, {
    variables: {
      userId: userId,
    },
    fetchPolicy: 'network-only',
  });

  return (
    <View style={container}>
      {profile && (
        <>
          {!hideAvatar && (
            <Avatar
              {...profile.profilePublic.avatarURL !== '' && {
                source: {
                  uri: profile.profilePublic.avatarURL,
                },
              }}
              rounded
              overlayContainerStyle={overlayContainer}
              icon={{
                type: 'feather',
                name: 'user',
                color: '#fff',
              }}
              size={60}
            />
          )}
          <View style={[infoContainer]}>
            <Text allowFontScaling={false} numberOfLines={1} adjustsFontSizeToFit style={nameText}>
              {`${profile.profilePublic.userName}`}
            </Text>
            <Text numberOfLines={3} style={[geoText]}>
              <PinIcon name="location-on" size={13} />
              {profile.profilePublic.prettyLocationName}
            </Text>
          </View>
        </>
      )}
      {renderRight && renderRight()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  infoContainer: {flex: 1, marginLeft: 20, marginRight: 20},
  geoText: {
    fontSize: 16,
    ...textStyles.mediumText,
    color: Colors.textGray,
    lineHeight: 21,
  },
  nameText: {
    fontSize: selectScreenSize(18, 21),
    color: '#fff',
    ...textStyles.boldText,
  },
  overlayContainer: {backgroundColor: '#64091c'},
});

const {geoText, nameText, container, infoContainer, overlayContainer} = styles;

export const TradeUserInfo = UserInfo;
