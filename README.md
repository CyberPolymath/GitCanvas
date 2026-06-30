# 🟩 G Reminder — Draw Your GitHub Graph. Earn It For Real.

> A cross-platform Progressive Web App that lets you **visually design your GitHub contribution graph pattern**, then guides you day by day with smart reminders — so you actually *earn* every green square through real commits.

---

## 🧠 Why This Exists

The GitHub contribution graph is one of the first things people notice on a developer's profile. Most tools out there either fake the entire graph instantly with backdated commits (which is obvious and dishonest), or give you no help at all in planning a real pattern.

**This project fills the gap nobody has filled yet.**

It's built for developers who want to:
- Design a custom pixel art or pattern on their GitHub contribution graph
- Actually earn that pattern through real, daily commits
- Get smart daily reminders so they never lose track of how many contributions they need on a specific day
- See real-time progress synced directly from their GitHub account

No faking. No backdating. Just consistency, gamified.

---

## ✨ Features

### 🎨 Visual Pattern Designer
- An interactive grid that mirrors the exact layout of the GitHub contribution graph (53 columns × 7 rows)
- Click individual cells to toggle them on or off
- Choose the shade of green for each cell — GitHub has 4 levels of contribution intensity (light to dark), and you can target each level precisely
- Import a preset pixel art pattern or draw your own freehand
- Set a start date for when your pattern should begin

### 📅 Daily Contribution Scheduler
- Once your pattern is finalised, the app calculates exactly how many contributions you need on each specific date
- Generates a full day-by-day schedule from your start date to your end date
- Accounts for GitHub's contribution levels (1 commit = lightest green, 9+ commits = darkest green, etc.)

### 🔔 Smart Daily Reminders
- Set your preferred reminder time (e.g., 9:00 AM every day)
- Receive push notifications directly on your phone or laptop, even when the app is closed
- Reminder message tells you exactly what you need: *"Today you need 4 contributions to stay on pattern. You've done 1 so far. 3 left!"*
- If you miss a day, the app notifies you and recalculates

### ⚡ Real-Time GitHub Sync via Webhooks
- Connect your GitHub account via OAuth
- The app registers GitHub Webhooks on your repos — so every time you push a commit, GitHub instantly notifies the app (within seconds)
- Your progress dashboard updates in real time without needing to refresh
- Works across all your repos simultaneously — any commit to any repo counts

### 📊 Live Progress Dashboard
- Today's contribution count vs today's target
- Overall pattern completion percentage
- A live preview of how your GitHub graph currently looks vs how it will look when complete
- Streak tracking and missed-day alerts

### 📱 Cross-Platform (Phone + Laptop Simultaneously)
- Built as a **Progressive Web App (PWA)** — install it on Android, iOS, Windows, or Mac from the browser with one tap
- All data syncs in real time across all your devices via cloud database
- Push notifications work natively on Android and desktop (Chrome/Edge/Firefox)
- iOS support via PWA installation from Safari

---

## 🛠 Tech Stack

| Layer | Technology | Why |
|---|---|---|
| Frontend | React + Next.js (PWA) | Cross-platform, installable, one codebase |
| Pattern Designer | HTML5 Canvas / SVG | Smooth interactive grid drawing |
| Push Notifications | Web Push API + Service Workers | Native notifications on Android + desktop |
| Backend | Node.js + Express or Python FastAPI | Webhook receiver, notification scheduler |
| Database | Supabase (PostgreSQL + Realtime) | Real-time sync across devices |
| GitHub Integration | GitHub OAuth + Webhooks + REST API | Secure auth + instant commit detection |
| Hosting | Vercel (frontend) + Railway or Render (backend) | Free tier available, easy deploy |

---

## 🔄 How It Works — End to End

```
User designs pattern in the app
        ↓
App calculates daily contribution targets for each date
        ↓
User connects GitHub account via OAuth
        ↓
App registers Webhooks on user's GitHub repos
        ↓
User makes real commits throughout the day on any repo
        ↓
GitHub sends instant webhook event to app backend (within seconds)
        ↓
App updates today's progress in real time across all devices
        ↓
If target not yet met → push notification reminds user at set time
        ↓
Pattern fills up on GitHub day by day, earned through real contributions
```

---

## 📲 Notification Flow

1. **Morning reminder** (user-set time): *"Good morning! Today's target: 3 contributions. Let's go!"*
2. **Midday check-in** (optional): *"You've done 1 out of 3 today. Keep it up!"*
3. **Evening nudge** (if target not met by 8 PM): *"2 contributions left today to stay on pattern. Don't break the streak!"*
4. **Completion confirmation** (real-time, via webhook): *"✅ Daily target complete! Today's cell is locked in."*

---

## 🔐 GitHub Integration Details

- **Authentication**: GitHub OAuth 2.0 — the app never stores your password
- **Webhook scope**: Registers a webhook on repos you choose (or all repos) to receive `push` events
- **API usage**: GitHub REST API to fetch your current contribution data on first sync
- **Real-time detection**: Every push event arrives at the app backend within 1–3 seconds of you pushing a commit
- **Privacy**: Only commit metadata is read (timestamps, repo name). No code content is accessed.

---

## 🗺 Roadmap

- [ ] Visual pattern designer with shade selection
- [ ] Daily target calculator based on designed pattern
- [ ] GitHub OAuth login
- [ ] Webhook registration and real-time commit detection
- [ ] Push notification system (Web Push API)
- [ ] Cross-device sync via Supabase Realtime
- [ ] PWA manifest + service worker for installability
- [ ] Mobile-optimised UI
- [ ] Preset pattern library (pixel art, text, logos)
- [ ] Pattern sharing between users
- [ ] iOS native wrapper via Capacitor (for better iOS notification support)
- [ ] Stats and streak history

---

## 🚀 Getting Started (Development)

> ⚠️ This project is currently in early development. Setup instructions will be added as the project progresses.

```bash
# Clone the repo
git clone https://github.com/yourusername/gitart-reminder.git
cd gitart-reminder

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

Contributions, ideas, and feature requests are welcome. If you've been looking for exactly this kind of tool, feel free to open an issue describing what you'd want, or submit a pull request.

---

## 📄 License

MIT License — free to use, modify, and distribute.

---

## 👤 Author

Built because this tool should exist and nobody had built it yet.

*If you find this useful, give it a ⭐ — it helps others find it too.*
