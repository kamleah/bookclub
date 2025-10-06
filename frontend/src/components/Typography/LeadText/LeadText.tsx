import React from "react";
import styles from "./LeadText.module.css";

type LeadTextProps = {
  title?: string;
};

const LeadText: React.FC<LeadTextProps> = ({ title }) => {
  return (
    <div className={styles.container}>
      <h2>{title || "LeadText Component"}</h2>
    </div>
  );
};

export default LeadText;
