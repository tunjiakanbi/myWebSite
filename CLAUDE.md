# Notes for Claude

## CSS build
- `css/style.scss` is the source. `css/style.css` is generated from it; never edit it by hand.
- After changing `style.scss`, run `npm install` (once) and then `npm run build:css`, and commit both files.
- Don't compile with any other command (e.g. `npx sass ...`): its output differs and causes merge conflicts.
  `npm run build:css` matches the VS Code Live Sass Compiler settings in `.vscode/settings.json` exactly.
- No source map is generated or committed.
- Merge conflict in `css/style.css`: resolve `css/style.scss` first, then run `npm run build:css` and stage
  the result. Don't hand-merge the CSS.
- CI (`.github/workflows/css.yml`) fails if `style.css` doesn't match `style.scss`; `npm run check:css` runs the same check locally.
