import { InvisibleButton } from "buttons";
import style from "./Paginator.module.css";

function ActionButton({ direction, onClick }) {
  const labels = {
    next: "▶",
    previous: "◀"
  };
  const classNames = {
    next: style.paginatorActionButtonNext,
    previous: style.paginatorActionButtonPrevious
  };

  return (
    <InvisibleButton
      className={classNames[direction]}
      onClick={() => {
        onClick(direction);
      }}>
      {labels[direction]}
    </InvisibleButton>
  );
}

export default ActionButton;
