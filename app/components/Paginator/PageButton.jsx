import { InvisibleButton } from "buttons";
import style from "./Paginator.module.css";

function PageButton({ value, isCurrent, disabled, onClick }) {
  return (
    <InvisibleButton
      className={[style.paginatorPageButton, isCurrent ? "active" : ""].join(
        " "
      )}
      disabled={disabled}
      onClick={onClick}>
      {isFinite(value) ? value + 1 : value}
    </InvisibleButton>
  );
}

export default PageButton;
