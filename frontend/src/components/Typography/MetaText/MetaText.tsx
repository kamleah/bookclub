import React from "react";
import styles from "./MetaText.module.css";

type MetaTextProps = {
  title?: string;
};

const MetaText: React.FC<MetaTextProps> = ({ title }) => {
  return (
    <div className={styles.container}>
      <h2>{title || "MetaText Component"}</h2>
    </div>
  );
};

export default MetaText;
