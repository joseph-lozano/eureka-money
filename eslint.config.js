import antfu from "@antfu/eslint-config";

export default antfu({
  ignores: ["!**/.server", "!**/.client", "*.config.js", "convex/_generated"],
  formatters: true,
  react: true,
  stylistic: {
    quotes: "double",
    semi: true,
  },
  typescript: {
    tsconfigPath: "./tsconfig.json",
  },
  rules: {
    "node/prefer-global/process": "off",
    "no-restricted-imports": ["error", {
      "paths": [{
        "name": "@remix-run/node",
        "message": "Use '@vercel/remix' instead of '@remix-run/node' for better Vercel compatibility."
      }]
    }],
  },
});
