
import SmallPaginator from "./SmallPaginator";
import MediumPaginator from "./MediumPaginator";
import LargePaginator from "./LargePaginator";
import { useCallback, useMemo } from "react";

export function usePaginator(onPageChanged, currentPage, totalPages) {
  const gotoPage = useCallback((pageNumber) => {
    onPageChanged(pageNumber, Math.sign(pageNumber - currentPage));
  }, [onPageChanged, currentPage]);

  const gotoNextPage = useCallback(() => {
    if (currentPage < totalPages - 1) {
      onPageChanged(currentPage + 1, +1);
    }
  }, [onPageChanged, currentPage, totalPages]);

  const gotoPreviousPage = useCallback(() => {
    if (currentPage > 0) {
      onPageChanged(currentPage - 1, -1);
    }
  }, [onPageChanged, currentPage]);

  const Component = useMemo(() => (
    totalPages < 10
      ? SmallPaginator
      : totalPages == 11
        ? MediumPaginator
        : LargePaginator)
    , [totalPages]);

  return {
    gotoPage,
    gotoNextPage,
    gotoPreviousPage,
    Component
  };
}
