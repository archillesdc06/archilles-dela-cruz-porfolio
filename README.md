# Create T3 App

This is a [T3 Stack](https://create.t3.gg/) project bootstrapped with `create-t3-app`.

## What's next? How do I make an app with this?

We try to keep this project as simple as possible, so you can start with just the scaffolding we set up for you, and add additional things later when they become necessary.

If you are not familiar with the different technologies used in this project, please refer to the respective docs. If you still are in the wind, please join our [Discord](https://t3.gg/discord) and ask for help.

- [Next.js](https://nextjs.org)
- [NextAuth.js](https://next-auth.js.org)
- [Prisma](https://prisma.io)
- [Drizzle](https://orm.drizzle.team)
- [Tailwind CSS](https://tailwindcss.com)
- [tRPC](https://trpc.io)

## Learn More

To learn more about the [T3 Stack](https://create.t3.gg/), take a look at the following resources:

- [Documentation](https://create.t3.gg/)
- [Learn the T3 Stack](https://create.t3.gg/en/faq#what-learning-resources-are-currently-available) — Check out these awesome tutorials

You can check out the [create-t3-app GitHub repository](https://github.com/t3-oss/create-t3-app) — your feedback and contributions are welcome!

## AI metadata analysis

Certification and project metadata can be drafted from source assets, but nothing is published automatically. The analyzer writes proposals to `src/data/certification-analysis-drafts.json` and `src/data/project-analysis-drafts.json` for manual review.

Required environment variables (see `.env.example`):

- `AI_ANALYSIS_API_KEY` or `GROQ_API_KEY` — vision model access
- `GOOGLE_DRIVE_FOLDER_ID` — public folder that holds the certification files
- `GITHUB_TOKEN` — optional, raises the GitHub API rate limit
- `GITHUB_USERNAME` — repository owner, defaults to `archillesdc06`

Commands:

```bash
npm run ai:analyze                  # both sources
npm run ai:analyze:certifications   # Drive previews only
npm run ai:analyze:projects         # GitHub README and screenshots only
npm run ai:promote -- --kind=certification --id=<driveFileId>   # dry run
npm run ai:promote -- --kind=certification --id=<driveFileId> --apply
npm run ai:promote -- --kind=project --id=<repository> --apply
```

Only `--apply` writes to `src/data/certification-metadata.json` or `src/data/github-metadata.json`, and each draft must still be in the `pending` state. `.github/workflows/ai-analysis.yml` runs the analysis every four hours and opens or updates a draft review pull request.

## How do I deploy this?

Follow our deployment guides for [Vercel](https://create.t3.gg/en/deployment/vercel), [Netlify](https://create.t3.gg/en/deployment/netlify) and [Docker](https://create.t3.gg/en/deployment/docker) for more information.
