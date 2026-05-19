# Vendored fonts

These `.woff2` files are vendored so the offline desktop build can produce the
exact same UI without any runtime or build-time fetch from Google Fonts. The
plan's §10 security checklist forbids third-party CDNs at runtime.

## Noto Sans Tamil v31

Downloaded from Google Fonts (gstatic) on 2026-05-06. License: SIL Open Font
License 1.1 (https://scripts.sil.org/OFL).

Both `font-weight: 400` and `font-weight: 700` resolve to the same files on
the gstatic CDN — Google's subsetter emits identical bytes for the two weights
in this family, so we mirror that and serve one file per Unicode subset.

| File                              | Subset    | sha256                                                             |
|-----------------------------------|-----------|--------------------------------------------------------------------|
| `NotoSansTamil-tamil.woff2`       | tamil     | `638b641579abe5d74506bbceeec8f92048baa2a62f0a1b0a19a2fcb7985b7c14` |
| `NotoSansTamil-latin-ext.woff2`   | latin-ext | `3496b17b92e1a96873fb899aab8e5dcaca54d879115847a356b8e76bf611cb36` |
| `NotoSansTamil-latin.woff2`       | latin     | `120f903ef3186154f9f30d20254e12e12020b1ab3619cc4d950c4822bec9a9a4` |

Source URLs (recorded for `scripts/desktop/artifact-manifest.json` later):

- `https://fonts.gstatic.com/s/notosanstamil/v31/ieVp2YdFI3GCY6SyQy1KfStzYKZgzN1z4LKDbeZce-048cFpwFNLIdyzxg.woff2`
- `https://fonts.gstatic.com/s/notosanstamil/v31/ieVp2YdFI3GCY6SyQy1KfStzYKZgzN1z4LKDbeZce-048dlpwFNLIdyzxg.woff2`
- `https://fonts.gstatic.com/s/notosanstamil/v31/ieVp2YdFI3GCY6SyQy1KfStzYKZgzN1z4LKDbeZce-048ddpwFNLIdw.woff2`

The `@font-face` declarations live in `frontend/app/globals.css`; layout sets
`--font-noto-tamil` so Tailwind's `font-tamil` utility resolves to this stack.
