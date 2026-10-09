# Portfolio PDF

Portfolio for the hh.ru "Портфолио" block, built with LuaLaTeX.

```bash
pnpm portfolio        # or: cd portfolio && latexmk portfolio.tex
```

Needs a TeX distribution with `latexmk` and `lualatex` (MacTeX or TeX Live) and `pdftoppm` from Poppler. hh.ru accepts only
JPG and PNG, so the script also renders every page to `images/portfolio-N.png` at 200 dpi (1654 × 2339). Both the PDF and the
PNGs are committed, ready to upload.

- `portfolio.tex` holds the text, the case diagrams (TikZ) and the layout. Colours match `src/styles/tokens.css`.
- `fonts/` holds static Geologica instances cut from the variable font (SIL Open Font License, see `fonts/OFL.txt`).
  `Geologica-Display` has sharp terminals for headings, the rest are soft for body text.
- Keep the copy in sync with `src/content/cases.ts` when a case changes.
