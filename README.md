<div align="center">

#  Git_Canvas

### Design Your GitHub Contribution Graph. Earn Every Square.

*A Progressive Web App that lets you plan custom pixel art or patterns on your GitHub contribution graph — then guides you day by day with smart reminders so you earn each green square through real commits.*

![Copyright: All Rights Reserved](https://img.shields.io/badge/Copyright-All%20Rights%20Reserved-lightgrey)
![Status: In Development](https://img.shields.io/badge/Status-In%20Development-yellow)
![Platform: PWA](https://img.shields.io/badge/Platform-PWA-blue)

</div>
                                                 
---

## 📌 Table of Contents

- [Why This Exists](#-why-this-exists)
- [Prior Art & Landscape Research](#-prior-art--landscape-research)
- [The Gap Nobody Has Filled](#-the-gap-nobody-has-filled)
- [Features](#-features)
- [How It Works](#-how-it-works)
- [Tech Stack](#-tech-stack)
- [Notification System](#-notification-system)
- [GitHub Integration](#-github-integration)
- [Roadmap](#-roadmap)
- [Getting Started](#-getting-started)
- [Contributing](#-contributing)
- [License](#-license)

---

##  Why This Exists

The GitHub contribution graph is one of the first things a recruiter, hiring manager, or collaborator notices on a developer's profile. A consistent, intentional pattern signals discipline, daily coding habits, and long-term commitment to the craft. Many developers are aware of this — and yet, maintaining a pattern across 52 weeks of a contribution grid is genuinely hard without a structured system.

There are two extremes in the current tooling landscape:

1. **Fake it entirely** — scripts that push backdated commits automatically to manufacture a green graph. This is trivially detectable, dishonest, and provides zero actual coding practice.
2. **No help at all** — GitHub itself provides no planning tools, no reminders, and no way to visualise a target pattern before committing to it.

**Git_Canvas fills the empty space between these two extremes.** It is a tool for developers who want to design a real, intentional pattern on their contribution graph — and then actually earn it, one commit at a time, guided by smart daily reminders that tell them exactly what they need to do today.

No faking. No backdating. Just consistency, gamified and visualised.

---

##  Prior Art & Landscape Research

Before building Git_Canvas, an extensive survey of every existing tool, repository, website, and app in the GitHub contribution tracking space was conducted. The findings are documented below — not to dismiss existing work, but to precisely identify what each tool does well and where the gap remains.

---

### 1. `gprm.itsvg.in` — GitHub Profile README Generator

**What it does:** A web tool that generates customised GitHub profile README badges and components — contribution stats cards, streak counters, bar graphs, language breakdowns — all embedded as SVG images via a URL parameter system.

**Strengths:** Excellent for profile presentation. Highly customisable visual components. Widely used across the developer community.

**What it lacks:** It is entirely a *display and presentation* tool. It reads your existing contribution data and renders it beautifully, but it plays no role in helping you plan, target, or be reminded about future contributions. There is no pattern planning, no scheduling, and no reminder system.

**Verdict:** A profile decoration tool, not a contribution planning tool.

---

### 2. GitHub Contribution Chart Generators (various)

**What they do:** A category of tools — including contributions widgets on shields.io, readme-stats by anuraghazra, and similar — that render your real-time GitHub contribution chart as an embeddable image or downloadable graphic. These can be dropped into a README or sent to someone as a snapshot of your activity.

**Strengths:** Useful for sharing your activity. Integrates with GitHub's public API cleanly. Zero setup friction.

**What they lack:** These are purely read-only, retrospective tools. They show what you have already done. There is no mechanism to define what you want your graph to look like in the future, and no system to guide you toward getting there.

**Verdict:** Retrospective visualisation, not forward planning.

---

### 3. `gitgraph.dev` — Contribution Graph Customiser

**What it does:** Allows users to customise the visual appearance of their GitHub contribution graph — changing colours, styles, and themes — and generates an embeddable link that can be placed on portfolio sites or resumes to showcase the graph in a personalised style.

**Strengths:** The aesthetic customisation is genuinely useful for portfolio presentation. The embeddable link approach is clean and practical.

**What it lacks:** This tool operates entirely on the visual layer — it changes how an existing graph *looks*, not what it *contains*. It cannot help a user design a target pattern, calculate what commits they need, or remind them to contribute on specific days. The actual green squares themselves are untouched.

**Verdict:** A visual skin for an existing graph. No planning or reminder capability.

---

### 4. Git Streak Tracker — iOS App (App Store)

**What it does:** An iOS app that tracks your current GitHub contribution streak and sends you a daily reminder to make a commit and maintain the streak. Includes a home screen widget that shows your current streak count.

**Strengths:** The habit-loop mechanic is genuinely effective. Reviews confirm it motivated users to code more consistently. The widget implementation is clean.

**What it lacks:** Two significant limitations. First, it is iOS-exclusive — Android users and desktop-only developers are excluded entirely. Second, and more critically, it only tracks streaks (a binary "did you commit today" signal) — it has no concept of a target pattern. There is no grid planning, no shade targeting, no day-specific commit count guidance. It also stopped receiving updates and has been reported as broken by multiple users.

**Verdict:** Right habit, wrong scope. Streak-only, iOS-only, and currently unmaintained.

---

### 5. `github.com/ganesshkumar/git-reminder` — Telegram Bot

**What it does:** A GitHub repository containing a Telegram bot that sends daily reminder messages to users prompting them to make a GitHub contribution and keep their streak alive.

**Strengths:** Open source. Simple to understand and modify. Useful proof-of-concept for reminder-driven contribution habits.

**What it lacks:** Three structural limitations. First, it is Telegram-dependent — if Telegram is blocked, the app is uninstalled, or notifications are disabled, the entire reminder system breaks. Second, it sends the same generic daily reminder to everyone regardless of what they need that day — there is no concept of a personalised pattern or a day-specific commit target. Third, it has no pattern designer, no progress tracking, and no GitHub sync. It is a blunt daily ping, nothing more.

**Verdict:** A reminder bot, not a planning system. Platform-dependent and non-personalised.

---

### 6. `github.com/motdotla/github-streaker` — Email Reminder Tool

**What it does:** Sends email reminders to users to maintain their GitHub contribution streak. An improvement over the Telegram bot in one respect: it uses email, which is more universally accessible and less likely to be blocked or uninstalled.

**Strengths:** Email delivery is more reliable and platform-agnostic than Telegram. Open source and self-hostable.

**What it lacks:** The same fundamental limitation as the streak tracker and Telegram bot — it reminds you to commit *something*, but has no knowledge of *what* you need to commit today to stay on your personal target pattern. There is no grid, no shade differentiation, no day-specific count, and no visual planning layer. The tool doesn't know if you need 1 commit today or 9 commits today — it just knows you haven't committed yet.

**Verdict:** Better delivery mechanism, same shallow scope. Still no pattern-aware intelligence.

---

### 7. `masniper.github.io/github-contrib-ui/` — Contribution Painter / Script Generator

**What it does:** A web interface where users can paint a pattern on a GitHub-style contribution grid, and the tool generates a shell script that, when run, pushes backdated commits to a repository to manufacture that pattern artificially.

**Strengths:** The grid painting UI is the closest thing to the pattern designer in CommitCanvas. It demonstrates that users genuinely want to visualise and plan a target pattern on the grid — the demand is real.

**What it lacks:** The entire execution layer is the opposite of what CommitCanvas stands for. The generated script creates fake backdated commits, which is immediately detectable by any interviewer who looks at commit timestamps. It provides zero real coding practice, undermines the credibility of the developer's profile, and defeats the entire purpose of the contribution graph. This is not a judgment on the tool's author — it's a recognition that the *UI concept* is right, but the *execution philosophy* is the inverse of what developers who want to genuinely build their profiles need.

**Verdict:** Correct UI concept, wrong execution entirely. The inspiration for what CommitCanvas's grid designer should look like — without the backdating.

---

##  The Gap Nobody Has Filled

After surveying every tool in this space, a precise gap emerges:

| Capability | gprm | Chart Generators | gitgraph.dev | Git Streak Tracker | git-reminder | github-streaker | masniper contrib-ui | **CommitCanvas** |
|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| Visual pattern designer (grid UI) | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ (fake) | ✅ Real |
| Shade/intensity targeting (1–4 levels) | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ (fake) | ✅ Real |
| Day-specific commit count reminders | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| Push notifications (phone + desktop) | ❌ | ❌ | ❌ | ✅ iOS only | Telegram only | Email only | ❌ | ✅ Both |
| Real-time GitHub sync | ❌ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ✅ |
| Works on Android | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ | ❌ | ✅ |
| Cross-platform (phone + laptop) | ❌ | ❌ | ❌ | ❌ | Partial | Partial | ❌ | ✅ |
| No fake commits | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ |
| Pattern-aware (not just streak) | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ |

**No single tool combines: a real pattern designer + shade targeting + day-specific intelligent reminders + real-time GitHub sync + cross-platform push notifications + a commitment to real earned contributions.**

CommitCanvas is built to be exactly that.

---

##  Features

###  Visual Pattern Designer
- An interactive grid mirroring the exact layout of GitHub's contribution graph (53 columns × 7 rows)
- Click cells to toggle contributions on/off
- Choose the shade of green for each cell — GitHub renders 4 intensity levels based on commit count thresholds
- Draw freehand patterns, write your name, or import a preset pixel art design
- Set a start date — the app maps your grid design to real calendar dates

###  Daily Contribution Scheduler
- Calculates exactly how many contributions are needed on each calendar date based on your designed pattern
- Generates a full day-by-day schedule from start date to end date
- Accounts for GitHub's contribution intensity thresholds (1 commit = lightest, 9+ commits = darkest)
- Recalculates dynamically if you miss or exceed a day's target

###  Smart Daily Reminders
- Set your preferred notification time
- Push notifications on phone and desktop — even when the app is closed
- Reminders are pattern-aware: *"Today you need 4 contributions to stay on pattern. You've done 1 so far. 3 left!"*
- Morning reminder, optional midday check-in, and evening nudge if target unmet
- Completion confirmation fires in real time the moment your daily target is reached

###  Real-Time GitHub Sync via Webhooks
- Connect via GitHub OAuth — no password stored
- App registers webhooks on your chosen repos
- Every commit you push anywhere triggers an instant update (within 1–3 seconds)
- Progress dashboard reflects your actual contribution count in real time

###  Live Progress Dashboard
- Today's count vs today's target
- Overall pattern completion percentage
- Side-by-side view: current graph vs target pattern
- Streak tracking and missed-day alerts

###  Cross-Platform — Phone & Laptop Simultaneously
- Built as a PWA — installable on Android, iOS, Windows, and Mac from the browser
- Primary delivery on mobile (Android + iOS via Safari PWA)
- Desktop notifications available for users without a phone
- All data syncs across devices in real time via cloud database

---

##  How It Works

```
User designs a pattern on the interactive 53×7 contribution grid
                        ↓
App maps each filled cell to a real calendar date and calculates
the exact commit count needed per day based on shade intensity
                        ↓
User connects their GitHub account via OAuth
                        ↓
App registers webhooks on user's repositories
                        ↓
User makes real commits to any repo throughout the day
                        ↓
GitHub sends a push event to the app backend within seconds
                        ↓
Dashboard updates in real time — today's count vs today's target
                        ↓
If target unmet → reminder fires at user's set notification time
                        ↓
Once target met → confirmation push notification sent immediately
                        ↓
Pattern fills up on GitHub, day by day, earned through real work
```

---

##  Tech Stack

| Layer | Technology | Reason |
|---|---|---|
| Frontend | React + Next.js (PWA) | Cross-platform, installable, single codebase for phone and desktop |
| Pattern Designer | HTML5 Canvas / SVG | Smooth, performant interactive grid drawing |
| Push Notifications | Web Push API + Service Workers | Native notifications on Android and desktop without an app store |
| Backend | Node.js + Express | Webhook receiver, notification scheduler, GitHub API intermediary |
| Database | Supabase (PostgreSQL + Realtime) | Real-time cross-device sync, open source, generous free tier |
| GitHub Integration | GitHub OAuth 2.0 + Webhooks + REST API | Secure auth, instant commit detection, contribution data fetch |
| Hosting | Vercel (frontend) + Railway (backend) | Free tier available, zero-config deployment |

---

##  Notification System

| Trigger | Message | Delivery |
|---|---|---|
| Morning (user-set time) | *"Today's target: 3 contributions. Let's go."* | Push (phone/desktop) |
| Midday check-in (optional) | *"You've done 1 of 3 today. Keep it moving."* | Push (phone/desktop) |
| Evening nudge (if unmet by 8 PM) | *"2 contributions left. Don't break the pattern."* | Push (phone/desktop) |
| Target reached (real-time) | *"✅ Done. Today's square is locked in."* | Push (phone/desktop) |
| Missed day | *"Yesterday's cell wasn't completed. Recalculating..."* | Push (phone/desktop) |

---

##  GitHub Integration Details

- **Authentication:** GitHub OAuth 2.0 — CommitCanvas never stores or sees your password
- **Webhook scope:** Registers on repos you select (or all repos) to listen for `push` events
- **Data accessed:** Only commit metadata — timestamps, repo name. No code content is ever read or transmitted
- **API usage:** GitHub REST API fetches your existing contribution data on first sync to calculate baseline
- **Real-time detection:** Push events arrive at the backend within 1–3 seconds of you pushing a commit

---

##  Roadmap

**Core (v1.0)**
- [ ] Visual pattern designer with 4-shade intensity selection
- [ ] Daily target calculator from designed pattern
- [ ] GitHub OAuth login
- [ ] Webhook registration and real-time commit detection
- [ ] Push notification system (Web Push API + Service Workers)
- [ ] Cross-device sync via Supabase Realtime
- [ ] PWA manifest + service worker for installability
- [ ] Mobile-optimised UI

**Extended (v1.x)**
- [ ] Preset pattern library (text, pixel art, logos)
- [ ] Pattern sharing between users
- [ ] Streak history and stats
- [ ] iOS native wrapper via Capacitor (improved iOS notification support)
- [ ] Multi-account support

---

##  Getting Started

> ⚠️ Currently in early development. Full setup instructions will be added as the project stabilises.

```bash
# Clone the repository
git clone https://github.com/yourusername/commitcanvas.git
cd commitcanvas

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Add your GitHub OAuth credentials and Supabase keys

# Run development server
npm run dev
```

---

## 🤝 Contributing

Contributions, ideas, and feature requests are welcome. If you've been looking for exactly this kind of tool, open an issue describing what you'd want — or submit a pull request.

---

## 📄 Legal Notice

**Copyright**

© 2026 Git_Canvas. All rights reserved.

**License**

Use, modification, and redistribution are permitted only with clear credit to the original project.

**Terms of Service**

Use of this site is subject to these terms. Do not remove attribution, misrepresent authorship, or redistribute the project without credit.

---

## 👤 Author

Built because this tool should exist and nobody had built it yet.

*If you find this useful, give it a ⭐ — it helps others find it too.*