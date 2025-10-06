import React from "react";
import styles from "./LabelText.module.css";

type LabelTextProps = {
  title?: string;
};

const LabelText: React.FC<LabelTextProps> = ({ title }) => {
  return (
    <div className={styles.container}>
      <h2>{title || "LabelText Component"}</h2>
    </div>
  );
};

export default LabelText;
