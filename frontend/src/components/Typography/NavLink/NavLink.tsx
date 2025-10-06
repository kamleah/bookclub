import React from "react";
import styles from "./NavLink.module.css";

type NavLinkProps = {
  title?: string;
};

const NavLink: React.FC<NavLinkProps> = ({ title }) => {
  return (
    <div className={styles.container}>
      <h2>{title || "NavLink Component"}</h2>
    </div>
  );
};

export default NavLink;
