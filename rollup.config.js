import resolve from "@rollup/plugin-node-resolve";
import analyze from "rollup-plugin-analyzer";
import filesize from "rollup-plugin-filesize";
import makeBadge from "./scripts/make-badge";

const badgeReporter = (...args) => {
  const [, , { minSize, gzipSize }] = args;
  return makeBadge({ minSize, gzipSize });
};

export default {
  input: "./src/index.js",
  output: {
    dir: "build",
  },
  plugins: [
    resolve({ browser: true }),
    analyze({ summaryOnly: true }),
    filesize({
      showMinifiedSize: true,
      showGzippedSize: true,
      reporter: ["boxen", badgeReporter],
    }),
  ],
};
