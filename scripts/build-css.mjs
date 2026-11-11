// Compiles css/style.scss -> css/style.css.
// Matches the VS Code Live Sass Compiler setup in .vscode/settings.json
// (Sass "expanded" + Autoprefixer "defaults", no source map), so the file is
// byte-identical whether it is built in the editor, from the terminal or in CI.
//
//   npm run build:css   write css/style.css
//   npm run check:css   exit 1 if css/style.css is out of date
import { readFileSync, writeFileSync } from "node:fs";
import * as sass from "sass";
import postcss from "postcss";
import autoprefixer from "autoprefixer";

const SRC = "css/style.scss";
const OUT = "css/style.css";

const compiled = sass.compile(SRC, { style: "expanded" }).css;
const css = postcss([autoprefixer({ overrideBrowserslist: "defaults" })])
  .process(compiled, { from: undefined }).css;

if (process.argv.includes("--check")) {
  let current = "";
  try { current = readFileSync(OUT, "utf8"); } catch {}
  if (current !== css) {
    console.error(`${OUT} is out of date with ${SRC}. Run: npm run build:css`);
    process.exit(1);
  }
  console.log(`${OUT} is up to date.`);
} else {
  writeFileSync(OUT, css);
  console.log(`Wrote ${OUT}`);
}
