import PageButton from "./PageButton";
import ActionButton from "./ActionButton";
import style from "./Paginator.module.css";
import { useMemo } from "react";

function LargePaginator({
  currentPage,
  totalPages,
  gotoPreviousPage,
  gotoPage,
  gotoNextPage
}) {
  const pages = useMemo(() => {
    let pages = [];
    if (currentPage < 6) {
      pages.push(0, 1, 2, 3, 4, 5, 6, 7, 8, "...", totalPages - 1);
    } else if (currentPage > totalPages - 8) {
      pages = [-9, -8, -7, -6, -5, -4, -3, -2, -1].map((x) => totalPages + x);
      pages.unshift(1, "...");
    } else {
      pages = [-3, -2, -1, 0, 1, 2, 3].map((x) => currentPage + x);
      pages.unshift(0, "...");
      pages.push("...", totalPages - 1);
    }
    return pages;
  }, [currentPage, totalPages]);

  return (
    <div className={style.paginator}>
      <ActionButton direction="previous" onClick={gotoPreviousPage} />
      {pages.map((pageNumber, i) => (
        <PageButton
          isCurrent={currentPage === pageNumber}
          disabled={pageNumber === "..."}
          key={i}
          onClick={gotoPage}
          value={pageNumber}
        />
      ))}
      <ActionButton direction="next" onClick={gotoNextPage} />
    </div>
  );
}

export default LargePaginator;
