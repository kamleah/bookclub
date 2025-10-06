import React from "react";
import styles from "./CodeText.module.css";

type CodeTextProps = {
  title?: string;
};

const CodeText: React.FC<CodeTextProps> = ({ title }) => {
  return (
    <div className={styles.container}>
      <h2>{title || "CodeText Component"}</h2>
    </div>
  );
};

export default CodeText;
