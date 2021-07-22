import {useEffect} from 'react';
import {useAsyncStorage} from '@react-native-community/async-storage';
import Rate from 'react-native-rate';
import moment from 'moment';

export const useAppReview = (): Function => {
  const {getItem: getAppReview, setItem: setAppReview} = useAsyncStorage('appReview');
  const {getItem: getRateState, setItem: setRateState} = useAsyncStorage('rateState');

  function showReview() {
    const options = {
      AppleAppID: '1528260692',
      preferInApp: true,
      openAppStoreIfInAppFails: true,
    };
    Rate.rate(options, () => {
      setRateState(JSON.stringify(true));
    });
  }

  useEffect(() => {
    async function getValue() {
      const review = await getAppReview();
      const isReviewShown = await getRateState();
      const today = moment();

      function setToday() {
        setAppReview(JSON.stringify(today));
      }

      if (review) {
        if (moment().isAfter(moment(JSON.parse(review)).add('15', 'minute')) && !JSON.parse(isReviewShown)) {
          showReview();
        }
      } else {
        setToday();
      }
    }

    getValue();
  }, []);

  return showReview;
};
