---
name: tamil-i18n
description: Review and update Tamil (ta.json) i18n to use colloquial business terminology  preferred by traders, ensuring key parity with English (en.json).
# tools: ['vscode', 'execute', 'read', 'agent', 'edit', 'search', 'web', 'todo'] # specify the tools this agent can use. If not set, all enabled tools are allowed.
---

Review and update `messages/ta.json` to use colloquial business Tamil — the language shopkeepers and traders actually use — rather than formal/literary translations.

## Reference files
- English reference: `messages/en.json` (read-only)
- Tamil target: `messages/ta.json` (update this)
- India variant: `messages/ta-IN.json` (update only keys that differ from ta.json for Indian users)

## Core principles
1. **Colloquial > literary** — use what traders say, not what textbooks write
2. **English transliterations are preferred** where they are the natural business term (e.g. ஸ்டாக், பில், குடோன், சப்ளையர்)
3. **Target audience**: both retail and wholesale traders in Tamil Nadu

## Mandatory terminology replacements

| Avoid | Use instead | Context |
|-------|-------------|---------|
| கிடங்கு | குடோன் | warehouse |
| விற்பனையாளர் (as supplier) | சப்ளையர் | vendor/supplier |
| விலைப்பட்டியல் | பில் | invoice |
| நிலுவை | பாக்கி | outstanding balance |
| சரக்கு | ஸ்டாக் | inventory/stock |
| விளிம்பு | லாபம் | margin/profit |
| உள்ளீடு / வெளியீடு | வரவு / செலவு | inflow/outflow |
| முழுமையாக்கம் | ரவுண்ட் ஆஃப் | rounding |
| வரைவு | டிராஃப்ட் | draft |
| நிலுவையில் | பென்டிங் | pending |
| அனுப்பப்பட்டது | டிஸ்பாட்ச் ஆனது | dispatched |
| வாழ்நாள் மதிப்பு | மொத்த வணிக மதிப்பு | lifetime value |
| சராசரி ஆர்டர் மதிப்பு | சராசரி பில் தொகை | average order value |
| வாங்கும் விலை | கொள்முதல் விலை | purchase price |
| HSN குறியீடு | HSN கோடு | HSN code |
| மீண்டும் ஆர்டர் அளவு | ரீஆர்டர் லெவல் | reorder level |
| விலைப்பட்டியல் ஊழியர் | பில்லிங் கிளார்க் | billing_clerk role |
| கிடங்கு ஊழியர் | குடோன் கிளார்க் | warehouse_clerk role |
| கடன் தவறியோர் | பாக்கி தட்டியவர்கள் | credit defaulters |
| விரைவு பில் | குயிக் பில் | quick bill |
| நினைவூட்டல் | ரிமைண்டர் | reminder |
| நிறுத்தம் | ஹோல்ட் | hold |
| கடன் | க்ரெடிட் | credit (financial) |

## Key parity requirement
`ta.json` must have **exactly the same keys** as `en.json`. After making all changes, validate with:

```bash
npm run check:i18n
```

Or inline:

```bash
node -e 'const en=require("./messages/en.json"),ta=require("./messages/ta.json");function g(o,p){let k=[];for(const x of Object.keys(o)){const f=p?p+"."+x:x;typeof o[x]==="object"&&o[x]!==null?k.push(...g(o[x],f)):k.push(f)}return k}const ek=new Set(g(en,"")),tk=new Set(g(ta,""));const m=[...ek].filter(k=>!tk.has(k)),e=[...tk].filter(k=>!ek.has(k));console.log("EN:",ek.size,"TA:",tk.size);if(m.length)console.log("Missing in TA:",JSON.stringify(m));if(e.length)console.log("Extra in TA:",JSON.stringify(e));if(!m.length&&!e.length)console.log("All keys match!")'
```

Also run `npm run typecheck` and `npm run test` before finishing.