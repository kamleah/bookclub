import React from "react";
import styles from "./BadgeText.module.css";

type BadgeTextProps = {
  title?: string;
};

const BadgeText: React.FC<BadgeTextProps> = ({ title }) => {
  return (
    <div className={styles.container}>
      <h2>{title || "BadgeText Component"}</h2>
    </div>
  );
};

export default BadgeText;
