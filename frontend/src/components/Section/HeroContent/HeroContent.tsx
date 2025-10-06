import React from "react";
import styles from "./HeroContent.module.css";

type HeroContentProps = {
  title?: string;
};

const HeroContent: React.FC<HeroContentProps> = ({ title }) => {
  return (
    <div className={styles.container}>
      <h2>{title || "HeroContent Component"}</h2>
    </div>
  );
};

export default HeroContent;
