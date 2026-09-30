import globals from "globals";
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([
    { files: ["**/*.{js,mjs,cjs}"], languageOptions: { globals: globals.browser } },
    globalIgnores(['**/*.test.js', '**/*.spec.js']),
    {
        rules: {
            "no-unused-vars": "warn",
            "no-undef": "warn",
            "vars-on-top": "warn",
            "no-mixed-spaces-and-tabs": "error",
            "no-debugger": "warn"
        },
    },
]);
