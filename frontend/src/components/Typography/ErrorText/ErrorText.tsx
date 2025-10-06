import React from "react";
import styles from "./ErrorText.module.css";

type ErrorTextProps = {
  title?: string;
};

const ErrorText: React.FC<ErrorTextProps> = ({ title }) => {
  return (
    <div className={styles.container}>
      <h2>{title || "ErrorText Component"}</h2>
    </div>
  );
};

export default ErrorText;
