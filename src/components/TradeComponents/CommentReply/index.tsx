import React, {FC, useEffect, useState} from 'react';
import {View, Text, StyleSheet, Dimensions} from 'react-native';
import {useQuery} from '@apollo/react-hooks';

import textStyle from '../../../constants/Styles/textStyle';
import {CommentInput} from '../CommentInput';
import {GET_LOCAL_PROFILE} from '../../../apollo/client/queries';

type Props = {
  note: string;
  message: string;
  setMessage: (string) => void;
  sellerID: number;
  buyerID: number;
  noReply?: boolean;
  style: any;
};

const screenWidth = Dimensions.get('screen').width;

export const CommentReply: FC<Props> = ({note, style, noReply, message, setMessage, buyerID}) => {
  const [isOwnMessage, setIsOwnMessage] = useState(false);
  const [currentRole, setCurrentRole] = useState(null);
  const [role, noteText] = note.split('::');

  const {
    data: {
      userProfile: {id: currentUserID},
    },
  } = useQuery(GET_LOCAL_PROFILE);

  useEffect(() => {
    if (currentUserID === buyerID) {
      setCurrentRole('Buyer');
    } else {
      setCurrentRole('Seller');
    }
  }, [currentUserID]);

  useEffect(() => {
    if (role === currentRole) {
      setIsOwnMessage(true);
    } else {
      setIsOwnMessage(false);
    }
  }, [role, currentRole]);

  if (!noteText || isOwnMessage) {
    return (
      <View style={noTextContainer}>
        <CommentInput
          message={message}
          setMessage={setMessage}
          getButtonText={isVisible => (isVisible ? '+ Add notice' : '- Hide notice')}
          isHidden={false}
        />
      </View>
    );
  }
  return (
    <View style={[container, style && style]}>
      <View style={notePreviewContainer}>
        <Text style={roleText}>From {role}:</Text>
        <Text style={noteTextStyle}>{noteText}</Text>
      </View>

      {!noReply && (
        <View style={replyContainer}>
          <CommentInput
            message={message}
            setMessage={setMessage}
            getButtonText={isVisible => (isVisible ? 'Reply' : 'Hide')}
            isHidden={false}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#041B1E',
    flex: 1,
    width: screenWidth,
    paddingVertical: 20,
    marginBottom: 30,
  },
  notePreviewContainer: {paddingHorizontal: 40},
  roleText: {color: '#E6750E', fontSize: 16, lineHeight: 21, ...textStyle.mediumText},
  noteTextStyle: {color: '#fff', ...textStyle.mediumText, fontSize: 21, lineHeight: 28},
  replyContainer: {paddingHorizontal: 20},
  noTextContainer: {marginVertical: 20, flex: 0},
});

const {container, notePreviewContainer, roleText, noteTextStyle, replyContainer, noTextContainer} = styles;
