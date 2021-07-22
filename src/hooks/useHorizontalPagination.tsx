import {useEffect, useMemo, useState} from 'react';
import Pagination from '../utils/WishlistUtils/pagination';

type onChangeCallback = (arg1: number, arg2?: number) => void;

export const useHorizontalPagination = (callback: onChangeCallback, totalPages = 1) => {
  const [pages, setPages] = useState([]);

  const controller = useMemo(() => {
    const _ = new Pagination({
      onChange: (page, count) => {
        setPages(_.getPages());

        callback(page, count);
      },

      showLast: false,
      showFirst: false,
      siblingCount: 1,
      count: 2,
    });

    _.setCount(totalPages);

    return _;
  }, []);

  useEffect(() => {
    controller.setCount(totalPages);
  }, [totalPages]);

  const changePageAction = type => {
    if (typeof type === 'string') {
      controller[type]();
      return;
    }

    controller.setPage(type);
  };

  return {pages, controller, changePageAction, active: controller.page - 1};
};
