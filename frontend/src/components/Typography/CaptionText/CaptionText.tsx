import React from "react";
import styles from "./CaptionText.module.css";

type CaptionTextProps = {
  title?: string;
};

const CaptionText: React.FC<CaptionTextProps> = ({ title }) => {
  return (
    <div className={styles.container}>
      <h2>{title || "CaptionText Component"}</h2>
    </div>
  );
};

export default CaptionText;
