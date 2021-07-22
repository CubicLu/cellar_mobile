import React, {useState} from 'react';

type PaginationReturnType = {
  incrementSkip: (number?) => void;
  resetSkip: () => void;
  loadingFooter: boolean;
  toggleLoadingFooter: (val?: boolean) => void;
  reset: () => void;
  invalidate: boolean;
  setInvalidate: React.Dispatch<React.SetStateAction<boolean>>;
  skip: number;
};

export const usePagination = (): PaginationReturnType => {
  const [skip, setSkip] = useState(0);
  const [loadingFooter, setLoadingFooter] = useState(true);
  const [invalidate, setInvalidate] = useState(true);

  const incrementSkip = (val: number = 25) => {
    if (!loadingFooter) {
      setSkip(skip + val);
      setLoadingFooter(true);
    }
  };

  const resetSkip = () => setSkip(0);

  const toggleLoadingFooter = (value: boolean | undefined = undefined) => setLoadingFooter(v => (value ? value : !v));

  const reset = () => {
    setSkip(0);
    setLoadingFooter(false);
    setInvalidate(true);
  };

  return {incrementSkip, resetSkip, loadingFooter, toggleLoadingFooter, reset, invalidate, setInvalidate, skip};
};
