import {useQuery} from '@apollo/react-hooks';
import {GET_LOCAL_PROFILE} from '../apollo/client/queries';
import {useEffect, useState} from 'react';
import {TradeRole} from '../types/trade';

export function useTradeRole(sellerID: number): TradeRole {
  const [role, setRole] = useState<TradeRole>('Buyer');

  const {
    data: {
      userProfile: {id: currentUserID},
    },
  } = useQuery(GET_LOCAL_PROFILE);

  useEffect(() => {
    if (sellerID === currentUserID) {
      setRole('Seller');
    }
  }, [sellerID]);

  return role;
}
