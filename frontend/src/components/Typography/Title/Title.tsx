import React from "react";
import styles from "./Title.module.css";

type TitleProps = {
  title?: string;
};

const Title: React.FC<TitleProps> = ({ title }) => {
  return (
    <div className={styles.container}>
      <h2>{title || "Title Component"}</h2>
    </div>
  );
};

export default Title;
