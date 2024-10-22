import antfu from "@antfu/eslint-config";

export default antfu({
  ignores: ["!**/.server", "!**/.client", "*.config.js"],
  formatters: true,
  react: true,
  stylistic: {
    quotes: "double",
    semi: true,
  },
  typescript: {
    tsconfigPath: "./tsconfig.json",
  },
});
