module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
  settings: { react: { version: '18.2' } },
  plugins: ['react-refresh'],
  rules: {
    'react/jsx-no-target-blank': 'off',
    "no-unused-vars": "warn", // định nghĩa nhưng không dùng báo lỗi
    "no-extra-boolean-cast": "off", // dùng toán tử !! báo lỗi
    "react/prop-types": "off", // truyền props children báo lỗi
    "no-useless-escape": "off", // ký tự \. trong regex báo lỗi
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
  },
}
