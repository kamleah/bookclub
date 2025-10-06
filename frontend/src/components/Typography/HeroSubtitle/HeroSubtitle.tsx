import React from "react";
import styles from "./HeroSubtitle.module.css";

type HeroSubtitleProps = {
  title?: string;
};

const HeroSubtitle: React.FC<HeroSubtitleProps> = ({ title }) => {
  return (
    <div className={styles.container}>
      <h2>{title || "HeroSubtitle Component"}</h2>
    </div>
  );
};

export default HeroSubtitle;
