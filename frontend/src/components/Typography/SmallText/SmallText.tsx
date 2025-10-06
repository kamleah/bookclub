import React from "react";
import styles from "./SmallText.module.css";

type SmallTextProps = {
  title?: string;
};

const SmallText: React.FC<SmallTextProps> = ({ title }) => {
  return (
    <div className={styles.container}>
      <h2>{title || "SmallText Component"}</h2>
    </div>
  );
};

export default SmallText;
