// scripts/createRedux.mjs
import fs from "fs";
import path from "path";

const sliceName = process.argv[2];

if (!sliceName) {
  console.error("❌ Usage: npm run create:redux SliceName");
  process.exit(1);
}

// Paths
const reduxDir = path.join("src", "redux", sliceName);

// Check if already exists
if (fs.existsSync(reduxDir)) {
  console.error(`❌ Redux slice ${sliceName} already exists!`);
  process.exit(1);
}

// Create folder
fs.mkdirSync(reduxDir, { recursive: true });
console.log(`📁 Created folder: ${reduxDir}`);

// --- Slice file ---
const sliceFile = `import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { ${sliceName}State } from "./${sliceName}.types";

const initialState: ${sliceName}State = {
  data: [],
  loading: false,
  error: null,
};

const ${sliceName}Slice = createSlice({
  name: "${sliceName.toLowerCase()}",
  initialState,
  reducers: {
    setData(state, action: PayloadAction<any[]>) {
      state.data = action.payload;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
  },
});

export const { setData, setLoading, setError } = ${sliceName}Slice.actions;
export default ${sliceName}Slice.reducer;
`;
fs.writeFileSync(path.join(reduxDir, `${sliceName}.slice.ts`), sliceFile);
console.log(`📄 Created: ${sliceName}.slice.ts`);

// --- Types file ---
const typesFile = `export interface ${sliceName}State {
  data: any[];
  loading: boolean;
  error: string | null;
}
`;
fs.writeFileSync(path.join(reduxDir, `${sliceName}.types.ts`), typesFile);
console.log(`📄 Created: ${sliceName}.types.ts`);

// --- Local index ---
const indexFile = `export { default as ${sliceName}Reducer } from "./${sliceName}.slice";
export * from "./${sliceName}.types";
`;
fs.writeFileSync(path.join(reduxDir, "index.ts"), indexFile);
console.log(`📄 Created: index.ts`);

// --- Global Redux index.ts ---
const globalIndexPath = path.join("src", "redux", "index.ts");
const exportLine = `export { ${sliceName}Reducer } from "./${sliceName}";`;

if (fs.existsSync(globalIndexPath)) {
  const current = fs.readFileSync(globalIndexPath, "utf8");
  if (!current.includes(exportLine)) {
    fs.appendFileSync(globalIndexPath, exportLine + "\n");
    console.log(`✅ Updated global index.ts`);
  }
} else {
  fs.writeFileSync(globalIndexPath, exportLine + "\n");
  console.log(`✅ Created global index.ts`);
}

// --- Sample store.ts if not exists ---
const storePath = path.join("src", "redux", "store.ts");
if (!fs.existsSync(storePath)) {
  const storeFile = `import { configureStore } from "@reduxjs/toolkit";
import { ${sliceName}Reducer } from "./index";

export const store = configureStore({
  reducer: {
    ${sliceName.toLowerCase()}: ${sliceName}Reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
`;
  fs.writeFileSync(storePath, storeFile);
  console.log(`📄 Created sample store.ts`);
}

console.log(`✨ Redux slice ${sliceName} setup completed!`);
