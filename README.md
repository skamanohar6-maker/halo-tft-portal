# halo-tft-portal — archived

> **This repository has been merged into [Target-halo](https://github.com/skamanohar6-maker/Target-halo).**
> New location: `src/features/tft/` · live at https://target-halo.vercel.app/tft

## Why archived

This was a standalone Next.js prototype of the TFT (Technology, Finance & Transactions)
document tracker for Indian VD/PE legal workflows — Condition Precedents and Condition
Subsequents across Debentures, Preference Shares, and Execution Version documents.

As part of the Target-halo SaaS modularisation (April 2026), the components were lifted
into the main Halo application rather than kept as a separate deployment. The rationale
is documented in
[`docs/strategy/saas-modularization.md`](https://github.com/skamanohar6-maker/Target-halo/blob/main/docs/strategy/saas-modularization.md)
— both repos were Stride-owned, TFT had no backend or auth, and the merge lets the module
share Halo's identity, audit, entity graph, and deal workflow when W1/W3 land.

## Where things moved

| Old path (this repo) | New path (Target-halo) |
|---|---|
| `src/types/index.ts` | `src/features/tft/types.ts` |
| `src/data/categories.ts` | `src/features/tft/data/categories.ts` |
| `src/data/facilities.ts` | `src/features/tft/data/facilities.ts` |
| `src/data/store.ts` | `src/features/tft/data/store.ts` |
| `src/components/*.tsx` | `src/features/tft/components/*.tsx` |
| `src/app/page.tsx` | `src/features/tft/TftWorkspace.tsx` + `src/pages/TftPage.tsx` |

## Migration commit

[`2a1487b`](https://github.com/skamanohar6-maker/Target-halo/commit/2a1487b) — feat(tft):
merge halo-tft-portal as a native module under /tft
