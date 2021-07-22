import gql from 'graphql-tag';
import {GET_LOCAL_RELEASE_LIST, GET_LOCAL_RELEASE_NOTES, GET_SUBSCRIPTION_STATE} from '../queries/other';
import {Routes} from '../../../constants';

export const INIT_RELEASE_LIST = gql`
  mutation initReleaseList($releaseList: Array, $watched: Array) {
    initReleaseList(releaseList: $releaseList, watched: $watched) @client
  }
`;

export const DISABLE_INDICATOR = gql`
  mutation disableWhatNewIndicator {
    disableWhatNewIndicator @client
  }
`;

export const SET_RELEASE_LIST = gql`
  mutation setReleaseList($releaseList: Array) {
    setReleaseList(releaseList: $releaseList) @client
  }
`;

export const SET_IS_WATCHED = gql`
  mutation setWatched($release: String) {
    setWatched(release: $release) @client
  }
`;

export const SET_WS_DATA = gql`
  mutation setSocketData($payload: Object) {
    setSocketData(payload: $payload) @client
  }
`;

export const RESET_WS_FIELD = gql`
  mutation resetSocketField($payload: String!) {
    resetSocketField(payload: $payload) @client
  }
`;

export const otherUtilMutations = {
  initReleaseList: async (_, variables, {client}) => {
    const {releaseList, watched} = variables;
    let unWatchedExist = false;

    let updatedArray = releaseList.map(el => {
      let isWatched = watched.includes(el.release);

      if (!isWatched) {
        unWatchedExist = true;
      }

      return {...el, isWatched};
    });

    client.writeQuery({
      query: GET_LOCAL_RELEASE_NOTES,
      data: {whatNewIndicator: unWatchedExist},
    });

    client.writeQuery({
      query: GET_LOCAL_RELEASE_LIST,
      data: {releaseList: updatedArray},
    });
  },
  disableWhatNewIndicator: (_, __, {client}) => {
    client.writeQuery({
      query: GET_LOCAL_RELEASE_NOTES,
      data: {whatNewIndicator: false},
    });
  },
  setReleaseList: (_, variables, {client}) => {
    const {releaseList} = variables;

    client.writeQuery({
      query: GET_LOCAL_RELEASE_LIST,
      data: {releaseList: releaseList},
    });
  },
  setWatched: (_, variables, {client}) => {
    const {release} = variables;
    let releaseList = client.readQuery({query: GET_LOCAL_RELEASE_LIST}).releaseList;
    let unWatchedExist = false;

    const updated = releaseList.map(el => {
      let temp = el;
      if (el.release === release) {
        temp = {...temp, isWatched: true};
      } else {
        if (!el.isWatched) {
          unWatchedExist = true;
        }
      }

      return temp;
    });

    client.writeQuery({
      query: GET_LOCAL_RELEASE_LIST,
      data: {releaseList: updated},
    });

    client.writeQuery({
      query: GET_LOCAL_RELEASE_NOTES,
      data: {whatNewIndicator: unWatchedExist},
    });
  },

  setSocketData: (_, variables, {client}) => {
    const {
      numberOfCurrentTradeOffers,
      numberOfPastTradeOffers,
      numberOfTransactionReceiptsTradeOffers,
      numberOfUnansweredTradeOffers,
    } = variables.payload;

    client.writeQuery({
      query: GET_SUBSCRIPTION_STATE,
      data: {
        unreadTradeMessages: {
          unansweredTradeMessages: {
            numberOfCurrentTradeOffers,
            numberOfPastTradeOffers,
            numberOfTransactionReceiptsTradeOffers,
            numberOfUnansweredTradeOffers,
          },
        },
      },
    });
  },

  resetSocketField: (_, variables, {client}) => {
    const field = variables.payload;

    switch (field) {
      case Routes.tradingOffers.name: {
        client.writeQuery({
          query: GET_SUBSCRIPTION_STATE,
          data: {
            unreadTradeMessages: {
              unansweredTradeMessages: {
                numberOfCurrentTradeOffers: 0,
              },
            },
          },
        });

        return;
      }
      case Routes.receipts.name: {
        client.writeQuery({
          query: GET_SUBSCRIPTION_STATE,
          data: {
            unreadTradeMessages: {
              unansweredTradeMessages: {
                numberOfTransactionReceiptsTradeOffers: 0,
              },
            },
          },
        });

        return;
      }
      case Routes.expiredOffers.name: {
        client.writeQuery({
          query: GET_SUBSCRIPTION_STATE,
          data: {
            unreadTradeMessages: {
              unansweredTradeMessages: {
                numberOfPastTradeOffers: 0,
              },
            },
          },
        });

        return;
      }
    }
  },
};
