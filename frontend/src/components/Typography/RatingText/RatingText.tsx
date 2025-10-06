import React from "react";
import styles from "./RatingText.module.css";

type RatingTextProps = {
  title?: string;
};

const RatingText: React.FC<RatingTextProps> = ({ title }) => {
  return (
    <div className={styles.container}>
      <h2>{title || "RatingText Component"}</h2>
    </div>
  );
};

export default RatingText;
