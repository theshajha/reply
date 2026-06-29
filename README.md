# Re:ply

Inbound that answers everyone. Drafts you sign, never autopilot.

You are hiring and the inbound is a flood. Re:ply reads it, tells you who is worth your time, and drafts a real reply for everyone else in your voice. You approve and send. Nobody gets ghosted.

Made by [Re:Work](https://rwhq.io). If you would rather someone just ran your hiring, that is what Re:Work does. This is the same idea, open and yours to run.

## What it does

Three agents work your inbound:

- **Screener** sorts every applicant against your rubric: worth your time, maybe, or a kind no.
- **Researcher** reads the public links an applicant included, their GitHub or their portfolio, and only those. It never goes looking for them.
- **Responder** drafts a reply in your voice for every applicant. A warm next step, a real question, or an honest no.

Nothing sends on its own. Every reply is a draft you approve.

## Quickstart

```bash
npm install
npm run onboard          # sets up yours/: your role, rubric, voice, preferences
# drop a CSV or JSON export of your inbound into yours/inbound/
npx eve dev              # talk to Re:ply, then type: run
```

Then open `/board` to see the triage and the drafts.

## Your layer

Everything personal lives in `yours/` (git-ignored), scaffolded from `yours.example/`:

- `yours/role.md`: the role and your rubric (what a yes, a maybe, and a no look like)
- `yours/voice.md`: two or three real replies you have sent, so the drafts sound like you
- `yours/preferences.json`: draft vs send, research on or off, which sources to read
- `yours/inbound/`: drop your CSV or JSON exports here

Because you only ever edit `yours/`, you can pull updates to Re:ply without merge conflicts.

## Gmail (optional)

Re:ply can read from a Gmail label and write replies as drafts you send yourself.

1. Create an OAuth client (Desktop) in Google Cloud and enable the Gmail API.
2. Scopes: `gmail.readonly` and `gmail.compose`.
3. Put `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, and `GOOGLE_REFRESH_TOKEN` in `.env.local`.

Sending stays off until you turn it on during onboarding. By default Re:ply makes a draft and you press send.

## Deploy

Run it locally with `npx eve dev`, the way a one-person desk runs. You can deploy to Vercel with `npx eve deploy`, but the board and the Gmail token are single-operator for now. A hosted version with a real intake form is the next step.

## License

MIT.
