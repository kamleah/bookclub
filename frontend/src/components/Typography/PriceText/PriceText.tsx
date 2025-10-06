import React from "react";
import styles from "./PriceText.module.css";

type PriceTextProps = {
  title?: string;
};

const PriceText: React.FC<PriceTextProps> = ({ title }) => {
  return (
    <div className={styles.container}>
      <h2>{title || "PriceText Component"}</h2>
    </div>
  );
};

export default PriceText;
