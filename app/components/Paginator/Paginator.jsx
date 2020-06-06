import usePaginator from "./hooks"

function Paginator({ onPageChanged, currentPage, totalPages, ...props }) {
  const { gotoPage, gotoNextPage, gotoPreviousPage, Component } = usePaginator(
    pageNumber,
    onPageChanged,
    currentPage,
    totalPages
  );

  return (
    totalPages > 1 && (
      <Component
        {...{
          ...props,
          ...state,
          gotoPage,
          gotoNextPage,
          gotoPreviousPage
        }}
      />
    )
  );
}

export default Paginator;
