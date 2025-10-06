import React from "react";
import styles from "./HeroTitle.module.css";

type HeroTitleProps = {
  title?: string;
};

const HeroTitle: React.FC<HeroTitleProps> = ({ title }) => {
  return (
    <div className={styles.container}>
      <h2>{title || "HeroTitle Component"}</h2>
    </div>
  );
};

export default HeroTitle;
