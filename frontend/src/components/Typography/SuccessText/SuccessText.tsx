import React from "react";
import styles from "./SuccessText.module.css";

type SuccessTextProps = {
  title?: string;
};

const SuccessText: React.FC<SuccessTextProps> = ({ title }) => {
  return (
    <div className={styles.container}>
      <h2>{title || "SuccessText Component"}</h2>
    </div>
  );
};

export default SuccessText;
