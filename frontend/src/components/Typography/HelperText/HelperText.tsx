import React from "react";
import styles from "./HelperText.module.css";

type HelperTextProps = {
  title?: string;
};

const HelperText: React.FC<HelperTextProps> = ({ title }) => {
  return (
    <div className={styles.container}>
      <h2>{title || "HelperText Component"}</h2>
    </div>
  );
};

export default HelperText;
