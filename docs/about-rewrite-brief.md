# Briefing: rewrite the About section for profile.mitya.dev

This document is a prompt. It is addressed to the writer (human or agent) who will produce
the copy. It is self-contained: everything you need is in here, including the current copy,
and you are not expected to have access to the site's repository or to the machine it was
written on.

---

## 1. Role and task

You are writing the About section — and the small amount of surrounding copy that frames it —
for the personal site of a freelance full-stack developer in Israel.

The site today reads as a job-seeker's portfolio. Its About section ends with *"I'm looking
for a role where the work matters… I am open to technical leadership and senior developer
positions."* That framing is now wrong. He is not looking for a role. He is operating as a
freelance full-stack developer under the brand **mitya.dev**, selling complete custom
software builds to Israeli businesses. The copy has to say that, in his voice, without
turning into a sales page.

Produce four deliverables:

1. **`about-business`** — the About section written for an Israeli business decision-maker.
2. **`about-technical`** — the About section written for a technical reader (CTO, hiring
   manager, engineering leader, another developer).
3. **`about-business-he`** — the Hebrew counterpart of deliverable 1, in native Israeli
   business register.
4. **`seo` + `intro-line`** — page title and meta description per audience, replacement
   descriptions for two other pages, and the typed hero line on the home page.

Exact output format is specified in § 8. Hard constraints in § 7 are not negotiable; read
them before you start writing, not after.

---

## 2. Who he is

**Mitya Kurs.** Based in Israel. Works in Hebrew and English. Full-stack developer, and for
most of the last decade a full-stack team lead.

**Years of experience: use "14 years" and nothing else.** His career starts in 2012, so 14
years is the number his own site and CV already carry, and it is the one you should use.

> **Flag, so you are not surprised by it:** his separate campaign brief says "15+ years
> development, 8+ years leading teams". Those numbers conflict with the 14-year figure and
> with his own dated career timeline (team-lead roles run 2018–2025, which is seven years,
> not eight). The brief you are reading resolves this in favour of **14 years**, and asks you
> to avoid a separate numeric claim about years of leadership entirely — say "years leading
> full-stack teams" or name the two companies' worth of leadership by shape, not by count.
> If you think the copy genuinely needs a leadership number, say so in your closing note
> rather than inventing one.

**What he works with** (this is the toolbox the site already displays; see § 9 for the full
inventory): React, Vue, Next.js on the frontend; Node, Express, NestJS, REST and GraphQL on
the backend; TypeScript throughout; PostgreSQL, MySQL, MongoDB, Redis; AWS and GCP,
serverless, Docker, Terraform and CDK; self-hosted infrastructure on Hetzner via Coolify;
Jest, Playwright and Puppeteer; GitHub Actions for CI/CD.

**AI-assisted development is treated as a core engineering skill, not a gimmick and not a
shortcut.** This is already a load-bearing claim in the current copy and it should survive
the rewrite: his solo output is possible because he deliberately leaned into it. Do not
soften this into "I use AI tools", and do not inflate it into a product claim.

---

## 3. Career spine

These are the verbatim facts from his published timeline. Do not invent an employer, a
metric, a client or a date beyond this list. You do not have to use all of it — most of it
is context so that your copy is *consistent* with what a reader finds one click away.

- **2025–2026 — LawPDF, independent.** Built a platform that lets legal professionals and
  clients gather case files and automatically generate referenced, summarized documents.
  Handled all technical execution, from initial infrastructure setup through production
  deployment and data security. *(See § 7: you may not name LawPDF in the copy.)*
- **2023–2025 — Clarity, Fullstack Team Lead.** Ran technical design and delivery for the
  company's core product. Established architectural standards, managed the CI/CD pipeline,
  ensured high availability and performance for high-traffic, business-critical features.
  Stack: AWS, serverless, Vue.js, Node.js, Apollo, MongoDB.
- **2018–2023 — Daytwo, Fullstack Team Lead.** Directed local and offshore engineering
  teams. Scaled backend infrastructure for high-throughput processing, enforcing strict
  security and compliance standards for sensitive international data (healthcare). Stack:
  GCP, AWS, CDK, React, Node.js, MySQL.
- **2016–2018 — Softwave, Fullstack Dev.** End-to-end features for enterprise clients.
  Moved legacy systems onto modern frontend frameworks and built the supporting backend
  architecture and database schemas. Azure, Angular, React, .NET Core, SQL.
- **2015–2016 — Eternity, Fullstack Dev.** Provisioned and maintained production cloud
  environments on Azure: deployment pipelines, server configuration, operational monitoring.
- **2014–2015 — Qpoint, Fullstack Dev.** Highly structured enterprise codebase; testable
  code, rigorous reviews, strict engineering and version-control standards.
- **2012–2014 — Bynet, Fullstack Dev.** Foundational server- and client-side logic;
  database design, API creation, frontend integration.

The useful shape of this spine, if you want one sentence of it: enterprise and .NET roots,
then a decade of full-stack product work, then seven years leading teams, then solo
end-to-end delivery.

---

## 4. What he actually builds now — context only

**Read this section for calibration and then do not quote from it.** Not one of these may be
named, linked, numbered or described identifiably in the copy (§ 7). They are here so that
when you write "I take a build from decision to production", you know it is true and you
know at what scale.

Described by shape only:

- A solo-built legal-tech document platform — product decisions, architecture,
  implementation, infrastructure, production.
- A Hebrew/RTL consumer funnel for buying and selling cars: lead capture, pricing, and a
  sales back-office for the operators. Live in production.
- A bookkeeping and tax-guidance product for Israeli small businesses, with an admin
  console — Python/FastAPI plus Next.js, built on agents and retrieval.
- An Israel-first parts and price-index data platform.
- A B2B outreach platform built under hard legal constraints.
- A physics-simulated multiplayer game.
- Scraping and data-pipeline work.
- Programmatic SEO page generation at scale.
- His own infrastructure: mitya.dev self-hosted on Hetzner via Coolify, plus an autonomous
  issue-tracker → coding-agent → GitHub delivery loop.

**The single point to take from this list:** the output of one person now looks like the
output of a team — across product, architecture, implementation, infrastructure and
production. That is the claim the copy is allowed to make. The list itself is not.

---

## 5. The positioning to write toward

This is lifted from the positioning document for the mitya.dev brand. It is settled. Write
toward it; do not reinterpret it.

- **A solo developer who takes ownership of a complete build end to end** — product
  decisions, architecture, implementation, infrastructure, production.
- **The band he works in:** between what commodity SaaS already solves and what an agency
  can profitably take on. Above the first, below the second.
- **The segment is a buying situation, not a vertical:** established businesses with real
  operational or digital complexity, budget for custom software, and no internal capacity to
  build it. Do not write a vertical ("I work with logistics companies") — write the
  situation.
- **Three entry points, which the reader self-selects into.** The business copy should let a
  reader recognise themselves in one of them, without turning into a bulleted services menu:
  - **A** — the process is still manual: Excel, email, WhatsApp, staff retyping data between
    systems.
  - **B** — an existing system has become a business constraint: dated admin, poor
    integrations, architecture that is now holding the business back.
  - **C** — they know what they need built and have no team to deliver it.
  - *(A fourth, inbound only: strengthening an existing development team. It applies only
    where a dev team already exists. Mention it at most in passing, or not at all.)*
- **Freelance is the move, not the fallback.** State this plainly enough in the copy that it
  can never be read as "between jobs". No "currently available", no "open to opportunities",
  no language that implies he is waiting for something better. He chose this; the copy should
  sound like a decision, not a status.

For the **technical** version, the same positioning holds but the proof is different: a
technical reader cares about what he owns end to end, what he has led, what the systems
looked like, and how he works — not about whether their process runs on Excel.

---

## 6. Voice

### Keep

Plain, direct, slightly blunt. First person. Short sentences. No hype, no superlatives, only
concrete claims. Earned confidence rather than asserted confidence — the best line in the
current copy is *"I know what a well-built system looks like, and I know exactly what it
costs when it isn't."* That is the register. Hit it.

### The current copy, in full — your voice reference

Four paragraphs, as they stand on the page today:

> 1. "I am a full-stack developer and team lead with 14 years of experience. I ship
>    products, build resilient teams, and leverage AI to move incredibly fast."
>
> 2. "This year, I built and shipped a legal-tech product from scratch, handling the product
>    decisions, architecture, design, and implementation entirely solo. That level of output
>    was only possible because I've deliberately leaned into AI-assisted development,
>    treating it as a core engineering skill rather than a shortcut. It has fundamentally
>    changed what one person can deliver."
>
> 3. "Before that, I spent years leading full-stack teams: decomposing monoliths,
>    integrating with complex healthcare and insurance systems, mentoring engineers, and
>    closing the gap between product and engineering. I know what a well-built system looks
>    like, and I know exactly what it costs when it isn't."
>
> 4. **← THIS IS THE PARAGRAPH BEING REPLACED.** "I'm looking for a role where the work
>    matters and the bar is high. I am open to technical leadership and senior developer
>    positions, as the best of both overlap more than people assume. What I care about is the
>    outcome: a product that makes sense to the user, architecture that won't fight you six
>    months later, and a team that knows exactly what it's building and why."

Notes on the reference. Paragraph 4 is the job-seeking framing and the reason this brief
exists — replace it. Paragraphs 2 and 3 are the voice you are matching, and paragraph 3's
closing sentence is worth preserving almost verbatim if it still earns its place. Paragraph 1
has two problems of its own: "leverage AI" (banned verb, see below) and "move incredibly
fast", which is the one piece of unearned hype in the set. Paragraph 2 names a product
category and a client-identifying detail; under § 7 you may keep the *shape* of that
paragraph ("built and shipped a product from scratch, solo, decisions through production")
but not the sector label if it identifies the client. The final paragraph of the new copy
should land on what he does now and how to engage — not on what he is looking for.

### Banned

- "passionate", "results-driven", "cutting-edge", "best-in-class", "world-class",
  "innovative", "synergy".
- **"leverage" as a verb.** It is in the current copy. Remove it.
- Em-dash-heavy cadence. The register where every sentence has a dramatic mid-clause pivot
  reads as machine-written. Use full stops.
- Rhetorical-question openers. No "Ever wondered why…", no "What if your system…".
- **We-language.** He is one person. No "we", no "our team", no "at mitya.dev we believe".
  The brand is a name he operates under, not a company with staff.
- Pricing of any kind (§ 7).
- Fake urgency, scarcity, or availability framing ("only taking two projects this quarter").

### Hebrew (deliverable 3)

- **Native Israeli business register.** Not translated English. Not AI register. Write it as
  Hebrew, do not render the English version into Hebrew.
- Short declaratives. Second-person-light. Scoped, verifiable claims only — no outcome,
  traffic, revenue or ranking promises.
- Latin fragments (React, Next.js, AWS, mitya.dev) run `direction: ltr` inside the RTL text.
  Flag any fragment that needs this so it can be marked up correctly.
- **Follow the `anthropic-skills:hebrew-docs` skill as the standard.** If you have access to
  it, load it before writing the Hebrew and apply it. If you do not, treat the bullets above
  as the binding substitute and say in your closing note that you worked without it.
- Acceptable neutral self-identification in Hebrew: `מפתח תוכנה עצמאי`. His name in Hebrew is
  `מיטיה קורס`.

---

## 7. Hard constraints

**No proof yet. This is the constraint most likely to trip you up.** He is not ready to show
proof, and the copy must not pretend otherwise:

- **No client names. No product names. No brand names. No URLs, links or logos.** Everything
  in § 3 and § 4 is background for you, not material to quote. "LawPDF", "Clarity",
  "Daytwo" and every product in § 4 are off-limits in the copy.
- **No proof block, no case studies, no testimonials, no customer logos, no screenshots.**
  Do not propose one, do not leave a placeholder for one, do not write a sentence that only
  works once a reference is dropped in.
- **No numbers he cannot stand behind.** No traffic, revenue, ranking, headcount, uptime,
  performance or conversion figures. None exist in a publishable form.
- **No pricing.** The project band he works in is ₪30k–120k; that number is here purely so
  you pitch the copy at the right level of seriousness. It must not appear, and neither must
  any hourly rate, day rate, retainer or "starting from".

What you *may* claim, because it is verifiable:

- 14 years in software.
- Full-stack: frontend, backend, infrastructure, production.
- Team leadership — leading local and offshore full-stack teams, architecture standards,
  CI/CD, high availability.
- Solo end-to-end delivery: product decisions, architecture, implementation, infrastructure,
  production, by one person.
- High-throughput systems; sensitive data under compliance constraints; complex
  integrations; legacy modernisation; enterprise codebases.
- AI-assisted development as a core engineering practice.
- Based in Israel; works in Hebrew and English.

One more: **if the copy ever refers to a third person** (a hypothetical reader, a client, a
developer), use **they/them**. Do not assign a gender to anyone.

---

## 8. Format of your answer

Output these five keys, in this order, so the copy drops straight into the code. Paragraphs
are **plain strings** — no markdown, no bold, no links, no bullet characters inside them.
Straight apostrophes are fine; the site renders them as-is.

```
about-business:     2–3 paragraphs. Israeli business decision-maker.
about-technical:    3–4 paragraphs. Technical reader. Same shape as the current four-string array.
about-business-he:  the Hebrew counterpart of about-business. Same paragraph count.
seo:                see below.
intro-line:         see below.
```

### `seo`

The site currently sets a title and meta description per route. Provide:

- **About page** — one title (**≤60 characters**) and one meta description (**≤160
  characters**), for each audience framing you think is worth offering (business-framed,
  technical-framed). Say which one you recommend shipping and why, in one sentence.
- **Home page** — a replacement description. The current one sells him as a candidate:
  *"Mitya Kurs is a senior full-stack developer and team lead with 14 years of experience
  shipping products, leading teams, and building scalable systems."* It needs to describe a
  service, not a résumé. Same ≤60 / ≤160 limits (title optional — propose one if the current
  title, below in § 9, is also wrong).
- **CV page** — a replacement description. Current: *"Download or view the CV of Mitya Kurs —
  senior engineering leader and hands-on full-stack builder with 14 years shipping production
  systems across legal-tech, healthcare, and SaaS."* This page genuinely is a CV download, so
  it may stay résumé-shaped — but it must not read as "candidate seeking position", and note
  that it names sectors (legal-tech, healthcare) which brush against § 7's no-client rule.
  Decide and justify.

Character counts are hard limits; count them, don't estimate.

### `intro-line`

The home page types out a single line, currently **`"Hi, I'm Mitya 👋"`**. It is a JSON array
of objects shaped `{ "text": "…" }`, so one or two lines are both possible — a second entry
types after the first.

Propose one or two lines to replace it, **or say explicitly that it should stay as it is** if
nothing you can write earns the change. A friendly greeting is not automatically wrong on a
personal site; a weak positioning statement would be worse. Make the call and defend it in
one sentence.

### Closing note

End with **one paragraph** on anything you think is weak, missing, or wrong — in this brief,
in the positioning, or in what the site is being asked to do. Including anything you believe
he is attached to. That paragraph is part of the deliverable, not a courtesy.

---

## 9. Reference appendix — what already exists on the page

So you never have to guess.

### Site structure

Five pages: home (the typed intro line), and three sections — **About**, **Experience**,
**Toolbox** — plus a **CV** page. The About section renders as an `<h1>About</h1>` followed
by the paragraph array; the paragraphs are the whole page. Experience renders the timeline in
§ 3 verbatim, so a reader is always one click from those employer names and dates even though
your copy may not use them. Toolbox renders the inventory below as icon cards.

### Current SEO strings

- **Home** — title: `Mitya Kurs | Senior Full-Stack Developer & Team Lead`; description:
  "Mitya Kurs is a senior full-stack developer and team lead with 14 years of experience
  shipping products, leading teams, and building scalable systems."
- **About** — title: `About Mitya Kurs | Senior Full-Stack Developer`; description: "Read
  about Mitya Kurs: full-stack developer and technical lead focused on product outcomes,
  resilient architecture, and high-performing teams."
- **CV** — title: `CV — Mitya Kurs, Senior Engineering Leader`; description: "Download or view
  the CV of Mitya Kurs — senior engineering leader and hands-on full-stack builder with 14
  years shipping production systems across legal-tech, healthcare, and SaaS."
- Social-card alt text, site-wide: "Mitya Kurs — Senior Engineering Leader & Hands-On
  Builder". Structured data gives his job title as "Senior Full-Stack Developer and Team
  Lead". Both carry the same candidate framing and will be revisited in the same pass; you
  may propose replacements if you have a better line, but they are not required deliverables.

### Toolbox inventory, as grouped on the page

- **Frontend** — React, Vue.js, Next.js, Tailwind, TanStack, Storybook, Vite
- **Backend** — Node.js, Express, NestJS, REST APIs, GraphQL, Prisma, Zod, Drizzle
- **Infra** — AWS, Serverless, Terraform, CDK, Docker, Hetzner
- **Databases** — MongoDB, MySQL, PostgreSQL, Redis
- **Tests** — Jest, Puppeteer, Playwright
- **CI/CD** — GitHub, Amplify, Coolify
- **AI** — Claude, Codex

### Contact surface

Four links in the navbar: **email** (`mitekk@gmail.com`), **LinkedIn**, **GitHub**, and a
**CV download** (PDF). There is no contact form, no phone number and no booking link on this
site. So: if your copy ends with a call to action, the only things it can point at are email
and those profiles. Write accordingly — "send me an email" works; "book a call" does not.

---

## 10. What happens to your output

The copy is reviewed first, then pasted into the site by hand: the paragraph arrays into the
About page, the SEO strings into the route config, the intro line into its JSON file. Nothing
is deployed automatically from what you write, so a proposal you are unsure about is better
flagged than quietly smoothed over.
