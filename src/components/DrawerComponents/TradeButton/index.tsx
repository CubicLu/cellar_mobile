import React, {useEffect, useState} from 'react';
import {Text, StyleSheet, TouchableOpacity} from 'react-native';
import {useSubscription, useQuery, useMutation} from '@apollo/react-hooks';

import {TRADE_MESSAGES_SUBSCRIPTION, INIT_UNREAD_TRADE_OFFERS} from '../../../apollo/queries/appInitialization';
import {GET_SUBSCRIPTION_ID} from '../../../apollo/client/queries';
import textStyle from '../../../constants/Styles/textStyle';
import colors from '../../../constants/colors';
import {SET_WS_DATA} from '../../../apollo/client/mutations';
import {GET_SUBSCRIPTION_STATE} from '../../../apollo/client/queries/other';
import {GlassCounter} from '../../CommonComponents/GlassCounter';

interface Props {
  text: string;
  onPress: () => void;
}

export const TradeButton: React.FC<Props> = ({text, onPress}) => {
  const [unreadMessages, setUnreadMessages] = useState<number>(0);

  const {data: profileSubscription} = useQuery(GET_SUBSCRIPTION_ID);
  const [setWSData] = useMutation(SET_WS_DATA);

  useQuery(INIT_UNREAD_TRADE_OFFERS, {
    onCompleted: res => {
      setWSData({
        variables: {
          payload: res.unreadTradeMessages.unansweredTradeMessages,
        },
      });
    },
    onError: err => console.log(err.message),
    fetchPolicy: 'network-only',
  });

  const {data: wsData} = useSubscription(TRADE_MESSAGES_SUBSCRIPTION, {
    variables: {subscriptionId: profileSubscription ? profileSubscription.userProfile.subscriptionId : ''},
  });

  useEffect(() => {
    if (wsData) {
      setWSData({
        variables: {
          payload: {
            ...wsData.unreadTradeMessagesSubscription.unansweredTradeMessages,
          },
        },
      });
    }
  }, [wsData]);

  const {data: subscriptionState} = useQuery(GET_SUBSCRIPTION_STATE);

  useEffect(() => {
    if (subscriptionState) {
      setUnreadMessages(reduceUnreadCount(subscriptionState.unreadTradeMessages.unansweredTradeMessages));
    }
  }, [subscriptionState]);

  return (
    <TouchableOpacity style={container} onPress={onPress}>
      <Text style={styleText} allowFontScaling={false}>
        {text}
      </Text>
      <GlassCounter unreadMessages={unreadMessages} />
    </TouchableOpacity>
  );
};

function reduceUnreadCount(unansweredTradeMessages: any) {
  const keys = Object.keys(unansweredTradeMessages);

  let count = 0;

  keys.map(key => {
    if (key !== 'numberOfUnansweredTradeOffers') {
      count += unansweredTradeMessages[key];
    }
  });

  return count;
}

const styles = StyleSheet.create({
  container: {
    height: 50,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    backgroundColor: colors.orangeDashboard,
  },
  styleText: {
    color: 'white',
    fontSize: 21,
    ...textStyle.boldText,
  },
});

const {container, styleText} = styles;
