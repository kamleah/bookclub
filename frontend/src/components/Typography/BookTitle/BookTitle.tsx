import React from "react";
import styles from "./BookTitle.module.css";

type BookTitleProps = {
  title?: string;
};

const BookTitle: React.FC<BookTitleProps> = ({ title }) => {
  return (
    <div className={styles.container}>
      <h2>{title || "BookTitle Component"}</h2>
    </div>
  );
};

export default BookTitle;
