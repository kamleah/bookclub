import React from "react";
import styles from "./LinkText.module.css";

type LinkTextProps = {
  title?: string;
};

const LinkText: React.FC<LinkTextProps> = ({ title }) => {
  return (
    <div className={styles.container}>
      <h2>{title || "LinkText Component"}</h2>
    </div>
  );
};

export default LinkText;
