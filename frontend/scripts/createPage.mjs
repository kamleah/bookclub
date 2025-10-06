import fs from "fs";
import path from "path";

const pageName = process.argv[2];

if (!pageName) {
  console.error("❌ Please provide a page name. Example:");
  console.error("   npm run create:page Home");
  process.exit(1);
}

const pageDir = path.join("src", "pages", pageName);

if (fs.existsSync(pageDir)) {
  console.error(`❌ Page ${pageName} already exists!`);
  process.exit(1);
}

fs.mkdirSync(pageDir, { recursive: true });

// --- Page Component ---
const pageFile = `import React from "react";

const ${pageName}: React.FC = () => {
  return (
    <div>
      <h1>${pageName} Page</h1>
    </div>
  );
};

export default ${pageName};
`;
fs.writeFileSync(path.join(pageDir, `${pageName}.tsx`), pageFile);

// --- Local Index ---
const indexFile = `export { default as ${pageName} } from "./${pageName}";\n`;
fs.writeFileSync(path.join(pageDir, "index.ts"), indexFile);

// --- Global Pages Index ---
const pagesIndexPath = path.join("src", "pages", "index.ts");
const exportLine = `export { ${pageName} } from "./${pageName}";`;

if (fs.existsSync(pagesIndexPath)) {
  const currentContent = fs.readFileSync(pagesIndexPath, "utf8");
  if (!currentContent.includes(exportLine)) {
    fs.appendFileSync(pagesIndexPath, exportLine + "\n");
  }
} else {
  fs.writeFileSync(pagesIndexPath, exportLine + "\n");
}

console.log(`✅ Page ${pageName} created at src/pages/${pageName}`);
console.log(`✅ Updated src/pages/index.ts`);