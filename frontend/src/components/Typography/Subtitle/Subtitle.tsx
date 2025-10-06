import React from "react";
import styles from "./Subtitle.module.css";

type SubtitleProps = {
  title?: string;
};

const Subtitle: React.FC<SubtitleProps> = ({ title }) => {
  return (
    <div className={styles.container}>
      <h2>{title || "Subtitle Component"}</h2>
    </div>
  );
};

export default Subtitle;
