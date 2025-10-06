// scripts/createFeature.mjs
import fs from "fs";
import path from "path";

const featureName = process.argv[2];
if (!featureName) {
  console.error("❌ Please provide a feature name. Example: npm run create:feature Auth");
  process.exit(1);
}

// Extract folder structure and base feature name
const featureParts = featureName.split(/[\\/]/); // handles both / and \
const baseFeatureName = featureParts.pop(); // e.g. "BookSearch"
const featurePath = featureParts.join("/"); // e.g. "Search"

const basePath = path.resolve("src/features", featurePath, baseFeatureName);
const reduxPath = path.join(basePath, "redux");
const apiPath = path.join(basePath, "api");
const dataPath = path.join(basePath, "data");

// ✅ Create directories
[basePath, reduxPath, apiPath, dataPath].forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`📁 Created folder: ${dir}`);
  }
});

// ✅ Files with starter content
const files = {
  [path.join(reduxPath, `${baseFeatureName}.slice.ts`)]: `import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ${baseFeatureName}State } from "./${baseFeatureName}.types";

const initialState: ${baseFeatureName}State = {
  // define initial state
};

const ${baseFeatureName}Slice = createSlice({
  name: "${baseFeatureName.toLowerCase()}",
  initialState,
  reducers: {
    setData: (state, action: PayloadAction<any>) => {
      // update state logic
    }
  }
});

export const { setData } = ${baseFeatureName}Slice.actions;
export default ${baseFeatureName}Slice.reducer;
`,

  [path.join(reduxPath, `${baseFeatureName}.types.ts`)]: `export interface ${baseFeatureName}State {
  // define your state shape
}
`,

  [path.join(reduxPath, "index.ts")]: `export { default as ${baseFeatureName}Reducer } from "./${baseFeatureName}.slice";
export * from "./${baseFeatureName}.types";
`,

  [path.join(apiPath, `${baseFeatureName}.api.ts`)]: `// API calls for ${baseFeatureName}
export const fetch${baseFeatureName}Data = async () => {
  // implement API call
};
`,

  [path.join(dataPath, `${baseFeatureName}.dummy.ts`)]: `// Dummy data for ${baseFeatureName}
export const dummy${baseFeatureName} = {};
`,

  [path.join(basePath, `${baseFeatureName}.tsx`)]: `import React from "react";

const ${baseFeatureName} = () => {
  return <div>${baseFeatureName} Feature</div>;
};

export default ${baseFeatureName};
`,

  [path.join(basePath, "index.ts")]: `export { default as ${baseFeatureName} } from "./${baseFeatureName}";
export * from "./redux";
export * from "./api/${baseFeatureName}.api";
export * from "./data/${baseFeatureName}.dummy";
`,
};

// ✅ Write files
for (const [file, content] of Object.entries(files)) {
  if (!fs.existsSync(file)) {
    fs.writeFileSync(file, content, "utf8");
    console.log(`📄 Created file: ${file}`);
  }
}

console.log(`✨ Feature ${featureName} created successfully!`);

const featuresIndex = path.join("src/features", "index.ts");
const exportLine = `export { ${baseFeatureName} } from "./${featureName.replace(/\\/g, "/")}";`;

if (fs.existsSync(featuresIndex)) {
  const current = fs.readFileSync(featuresIndex, "utf8");
  if (!current.includes(exportLine)) {
    fs.appendFileSync(featuresIndex, exportLine + "\n");
  }
} else {
  fs.writeFileSync(featuresIndex, exportLine + "\n");
}
