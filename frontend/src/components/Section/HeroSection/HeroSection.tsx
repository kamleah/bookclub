import React from "react";
import styles from "./HeroSection.module.css";

type HeroSectionProps = {
  title?: string;
};

const HeroSection: React.FC<HeroSectionProps> = ({ title }) => {
  return (
    <div className={styles.container}>
      <h2>{title || "HeroSection Component"}</h2>
    </div>
  );
};

export default HeroSection;
