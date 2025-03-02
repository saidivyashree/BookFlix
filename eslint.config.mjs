import globals from "globals";
import pluginJs from "@eslint/js";

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    files: ["**/*.{js,mjs,cjs}"], // Removed `.jsx`
    languageOptions: {
      globals: {
        ...globals.node, // Only keep Node.js globals for backend
      },
    },
  },
  pluginJs.configs.recommended,
];
