import React from "react";
import styles from "./ButtonText.module.css";

type ButtonTextProps = {
  title?: string;
};

const ButtonText: React.FC<ButtonTextProps> = ({ title }) => {
  return (
    <div className={styles.container}>
      <h2>{title || "ButtonText Component"}</h2>
    </div>
  );
};

export default ButtonText;
