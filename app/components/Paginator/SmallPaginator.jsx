import PageButton from "./PageButton";
import style from "./Paginator.module.css";

function SmallPaginator({ totalPages, currentPage, gotoPage }) {
  return (
    <div className={style.paginator}>
      {[...Array(totalPages)].map((x, i) => (
        <PageButton
          key={i}
          isCurrent={currentPage === i}
          onClick={gotoPage}
          value={i}
        />
      ))}
    </div>
  );
}

export default SmallPaginator;
