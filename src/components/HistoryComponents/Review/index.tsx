import React, {FC, ReactNode} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import moment from 'moment';
import {Avatar} from 'react-native-elements';

import {NoAvatarUserIcon, VerifiedUserIcon} from '../../../assets/svgIcons';
import textStyle from '../../../constants/Styles/textStyle';
import {RateValue} from '../RateValue';

type Props = {
  userName: string;
  rating: number;
  date: Date;
  highlight: boolean;
  avatarUrl: string;
  customNoteComponent: () => ReactNode;
  note: string;
  location?: string;
  isVerified?: boolean;
};

export const Review: FC<Props> = ({
  userName,
  note,
  rating,
  date,
  highlight,
  avatarUrl,
  location,
  customNoteComponent,
  isVerified,
}) => {
  return (
    <View style={[container, highlight && evenHighlight]}>
      <View style={infoContainer}>
        <View style={avatarContainer}>
          <Avatar
            renderPlaceholderContent={<NoAvatarUserIcon height={40} width={40} />}
            rounded
            source={avatarUrl ? {uri: avatarUrl} : null}
          />
        </View>
        <View style={flex1}>
          <View style={flexRow}>
            <Text style={[text, h1]}>{userName}</Text>
            {/*TODO:Uncomment when would be needed to show status of user account*/}
            {/*<View style={[{marginLeft: 10}, !isVerified && invisible]}>*/}
            {/*  <VerifiedUserIcon height={22} width={18} />*/}
            {/*</View>*/}
            <View style={startContainer}>{!!rating && <RateValue rating={rating} size={13} />}</View>
          </View>

          {location ? (
            <Text style={[text, h3]}>{location}</Text>
          ) : (
            <Text style={[text, h3]}>{moment(date).format('MMMM D, YYYY - h:mm A')}</Text>
          )}
        </View>
      </View>
      {customNoteComponent
        ? customNoteComponent()
        : !!note && (
            <View style={commentContainer}>
              <Text style={[text, h2]}>{note}</Text>
            </View>
          )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {paddingBottom: 5, paddingHorizontal: 20},
  evenHighlight: {backgroundColor: 'rgba(0,0,0,0.3)'},
  infoContainer: {flexDirection: 'row', alignItems: 'center'},
  avatarContainer: {marginRight: 10, flex: 0.15},
  startContainer: {alignItems: 'flex-start', flex: 0.2},
  text: {color: '#fff', ...textStyle.mediumText},
  flex1: {flex: 1},
  h1: {fontSize: 18},
  h2: {fontSize: 16, ...textStyle.mediumItalic},
  h3: {fontSize: 12, color: 'gray'},
  commentContainer: {marginTop: 10},
  invisible: {opacity: 0},
  flexRow: {flexDirection: 'row'},
});

const {
  container,
  evenHighlight,
  infoContainer,
  avatarContainer,
  startContainer,
  commentContainer,
  flex1,
  text,
  h1,
  h2,
  h3,
  invisible,
  flexRow,
} = styles;
