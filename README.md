# Debdutta Ghosh — Portfolio

A five-part personal portfolio with a Kolkata-inspired introduction, interactive About journal, scroll-driven project exhibition, illustrated journey timeline, and postcard contact page.

## Stack

Next.js App Router, React, TypeScript, CSS modules, GSAP and ScrollTrigger. Inter is installed through Fontsource. The production build uses Next.js static export.

## Run locally

Requires a recent Node.js version supported by Next.js 16.

```bash
npm ci
npm run dev
```

Open `http://localhost:3000`. Validate and export the site with:

```bash
npm run typecheck
npm run build
```

Static output is written to `out/`. The site has no required environment variables or server-side API.

## Deployment

Import this repository into Vercel with the **Next.js** framework preset, repository root as the root directory, `npm run build` as the build command, and `out` as the output directory. Next.js static export and trailing slash routing are configured in `next.config.ts`.

Portfolio text and project links are maintained in the components under `components/`. Project metadata is in `components/projects/project-data.ts`; timeline milestones are in `components/journey/`. Images are served from `public/images/`.
