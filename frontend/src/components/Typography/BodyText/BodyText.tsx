import React from "react";
import styles from "./BodyText.module.css";

type BodyTextProps = {
  title?: string;
};

const BodyText: React.FC<BodyTextProps> = ({ title }) => {
  return (
    <div className={styles.container}>
      <h2>{title || "BodyText Component"}</h2>
    </div>
  );
};

export default BodyText;
