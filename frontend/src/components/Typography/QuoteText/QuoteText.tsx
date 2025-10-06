import React from "react";
import styles from "./QuoteText.module.css";

type QuoteTextProps = {
  title?: string;
};

const QuoteText: React.FC<QuoteTextProps> = ({ title }) => {
  return (
    <div className={styles.container}>
      <h2>{title || "QuoteText Component"}</h2>
    </div>
  );
};

export default QuoteText;
