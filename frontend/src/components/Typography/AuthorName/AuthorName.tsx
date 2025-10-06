import React from "react";
import styles from "./AuthorName.module.css";

type AuthorNameProps = {
  title?: string;
};

const AuthorName: React.FC<AuthorNameProps> = ({ title }) => {
  return (
    <div className={styles.container}>
      <h2>{title || "AuthorName Component"}</h2>
    </div>
  );
};

export default AuthorName;
