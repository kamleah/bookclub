import fs from "fs";
import path from "path";

const inputName = process.argv[2];

if (!inputName) {
  console.error("❌ Please provide a component name. Example:");
  console.error("   npm run create Card/ProfileCard");
  process.exit(1);
}

const parts = inputName.split("/");
const componentName = parts.pop(); // Last part = component
const parentDir = path.join("src", "components", ...parts);
const targetDir = path.join(parentDir, componentName);

if (fs.existsSync(targetDir)) {
  console.error(`❌ Component ${componentName} already exists in ${parts.join("/")}`);
  process.exit(1);
}

fs.mkdirSync(targetDir, { recursive: true });

// --- Component File ---
const componentFile = `import React from "react";
import styles from "./${componentName}.module.css";

type ${componentName}Props = {
  title?: string;
};

const ${componentName}: React.FC<${componentName}Props> = ({ title }) => {
  return (
    <div className={styles.container}>
      <h2>{title || "${componentName} Component"}</h2>
    </div>
  );
};

export default ${componentName};
`;

fs.writeFileSync(path.join(targetDir, `${componentName}.tsx`), componentFile);

// --- CSS Module ---
const cssFile = `.container {
  padding: 1rem;
  border-radius: 0.75rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  background: white;
}
`;
fs.writeFileSync(path.join(targetDir, `${componentName}.module.css`), cssFile);

// --- Local Index File ---
const indexFile = `export { default as ${componentName} } from "./${componentName}";\n`;
fs.writeFileSync(path.join(targetDir, "index.ts"), indexFile);

// --- Update Parent Index File ---
const parentIndexPath = path.join(parentDir, "index.ts");
const exportLine = `export { ${componentName} } from "./${componentName}";`;

if (fs.existsSync(parentIndexPath)) {
  // Append if not already present
  const currentContent = fs.readFileSync(parentIndexPath, "utf8");
  if (!currentContent.includes(exportLine)) {
    fs.appendFileSync(parentIndexPath, exportLine + "\n");
  }
} else {
  // Create new parent index.ts
  fs.writeFileSync(parentIndexPath, exportLine + "\n");
}

console.log(`✅ Component ${componentName} created at ${targetDir}`);
console.log(`✅ Updated index.ts at ${parentDir}`);
