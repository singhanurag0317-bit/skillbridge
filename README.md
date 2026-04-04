# SkillBridge 🤝

> **Share a skill. Change a life.**

A hyperlocal, AI-powered skill sharing platform that connects people who have knowledge with people who need it — completely free. Built for the **Google Hackathon 2025** under the **Smart Resource Allocation · Open Innovation** track.

---

## 🌟 What is SkillBridge?

SkillBridge is a community-driven platform where people share skills with their neighbours — teaching, coding, cooking, music, career advice — with zero money involved. Our AI matching engine connects the right people at the right time, in the right place.

---

## ✨ Key Features

- **AI-powered matching** — Skill-to-need recommendation engine using NLP and cosine similarity
- **Hyperlocal** — Google Maps integration to find skill providers within walking distance
- **Zero cost** — No money exchanges hands. Pure community value
- **Impact tracking** — Personal impact score, leaderboard, badges and analytics
- **Real-time chat** — Firebase-powered messaging with scheduling
- **Verified profiles** — Rating system, session history, community trust score

---

## 🖥️ Pages

| Page | URL | Description |
|---|---|---|
| Landing | `/` | Marketing page with hero, features, testimonials |
| Auth | `/auth/login` | Login and 3-step registration |
| Explore | `/explore` | Search + filter + map view of all skills |
| Dashboard | `/dashboard` | Personal hub — skills, requests, recommendations |
| Profile | `/profile/[id]` | Public profile with skills, reviews, activity |
| Skill detail | `/skill/[id]` | Full skill page with slot picker and provider info |
| Chat | `/chat` | Real-time messaging with session scheduling |
| Impact | `/impact` | Analytics — score, charts, leaderboard, badges |

---

## 🛠️ Tech Stack

### Frontend
| Tool | Purpose |
|---|---|
| Next.js 16 (App Router) | React framework |
| TypeScript | Type safety |
| Material UI (MUI) | Component library |
| Axios | API calls |
| Firebase Auth | User authentication |

### Backend (teammates)
| Tool | Purpose |
|---|---|
| FastAPI (Python) | REST API |
| Firestore | Database |
| Firebase Auth | Auth verification |
| scikit-learn | AI matching algorithm |
| Google Cloud Run | Deployment |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- A Firebase project (see setup below)

### Installation

```bash
# Clone the repository
git clone https://github.com/yourteam/skillbridge.git
cd skillbridge

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Fill in your Firebase config and API URL

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## ⚙️ Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_GOOGLE_MAPS_KEY=your_maps_key
NEXT_PUBLIC_API_URL=http://localhost:8000
```

---

## 📁 Project Structure

```
skillbridge/
├── app/
│   ├── layout.tsx              # Root layout with MUI theme
│   ├── page.tsx                # Landing page
│   ├── auth/login/page.tsx     # Login + Register
│   ├── explore/page.tsx        # Explore skills + map
│   ├── dashboard/page.tsx      # User dashboard
│   ├── chat/page.tsx           # Messaging
│   ├── impact/page.tsx         # Impact analytics
│   ├── profile/[id]/page.tsx   # User profile
│   └── skill/[id]/page.tsx     # Skill detail
├── components/
│   └── layout/
│       └── Navbar.tsx          # Shared navbar
├── theme/
│   ├── theme.ts                # MUI theme (Emerald + Coral)
│   └── ThemeRegistry.tsx       # MUI + Next.js SSR fix
├── lib/
│   ├── api.ts                  # All Axios API calls
│   └── firebase.ts             # Firebase config
└── types/
    └── index.ts                # TypeScript types
```

---

## 🎨 Design System

**Color palette:** Emerald + Coral on Deep Ink

| Token | Hex | Usage |
|---|---|---|
| Emerald | `#10B981` | Primary actions, active states |
| Coral | `#F4623A` | Accents, highlights |
| Gold | `#F4B83A` | Ratings, badges |
| Deep Ink | `#080F1E` | Page background |

**Fonts:** Playfair Display (headings) + DM Sans (body)

---

## 👥 Team

| Name | Role |
|---|---|
| Anurag Sharma | Frontend (Next.js + MUI) |
| teammate 2 | Backend (FastAPI + Python) |
| teammate 3 | ML Engineer (Matching algorithm) |
| teammate 4 | Cloud + Database (Firebase + GCP) |

---

## 🏆 Hackathon Info

- **Event:** Google Hackathon 2025
- **Track:** Smart Resource Allocation · Open Innovation
- **Theme:** Data-Driven Volunteer and Community Skill Coordination for Social Impact

---

## 📸 Screenshots

| Page | Preview |
|---|---|
| Landing | ![Landing](./public/images/landing.png) |
| Dashboard | ![Dashboard](./public/images/dashboard.png) |
| Explore | ![Explore](./public/images/explore.png) |
| Profile | ![Profile](./public/images/profile.png) |

---

## 📄 License

MIT License — built for educational and hackathon purposes.
