# Portfolio PDF

Portfolio for the hh.ru "Портфолио" block, built with LuaLaTeX.

```bash
pnpm portfolio        # or: cd portfolio && latexmk portfolio.tex
```

Needs a TeX distribution with `latexmk` and `lualatex` (MacTeX or TeX Live). The built `portfolio.pdf` is committed, so the
file is always ready to upload.

- `portfolio.tex` holds the text, the case diagrams (TikZ) and the layout. Colours match `src/styles/tokens.css`.
- `fonts/` holds static Geologica instances cut from the variable font (SIL Open Font License, see `fonts/OFL.txt`).
  `Geologica-Display` has sharp terminals for headings, the rest are soft for body text.
- Keep the copy in sync with `src/content/cases.ts` when a case changes.
