import PageButton from "./PageButton";
import ActionButton from "./ActionButton";
import style from "./Paginator.module.css";

function MediumPaginator({
  gotoNextPage,
  totalPages,
  currentPage,
  gotoPage,
  gotoPreviousPage
}) {
  return (
    <div className={style.paginator}>
      <ActionButton direction="previous" onClick={gotoNextPage} />
      {[...Array(totalPages)].map((x, i) => (
        <PageButton
          key={i}
          isCurrent={currentPage === i}
          onClick={gotoPage}
          value={i}
        />
      ))}
      <ActionButton direction="next" onClick={gotoPreviousPage} />
    </div>
  );
}

export default MediumPaginator;
