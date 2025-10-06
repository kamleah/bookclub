import React from "react";
import styles from "./DiscountText.module.css";

type DiscountTextProps = {
  title?: string;
};

const DiscountText: React.FC<DiscountTextProps> = ({ title }) => {
  return (
    <div className={styles.container}>
      <h2>{title || "DiscountText Component"}</h2>
    </div>
  );
};

export default DiscountText;
