// SKILLBRIDGE — DEMO FLOW TESTING CHECKLIST
// ─────────────────────────────────────────────────────────────────────────────
// Test every step below before your hackathon demo.
// Fix anything marked ❌ before presenting.
// ─────────────────────────────────────────────────────────────────────────────

DEMO FLOW (what judges will see in 3-5 minutes):

STEP 1 — Landing page  /
  □ Page loads with dark navy background
  □ Hero text and floating skill cards are visible
  □ "Start sharing skills" button → goes to /auth/login
  □ "Browse skills nearby" button → goes to /explore
  □ Navbar "Explore skills" → goes to /explore
  □ Stats bar animates when scrolled to
  □ Scroll down — all sections visible (How it works, Features, Skills, Testimonials, CTA)
  □ Footer links visible

STEP 2 — Register  /auth/login
  □ Left panel visible with quote carousel
  □ "Create one free" → switches to register form
  □ Step indicator shows 3 steps
  □ Step 1: Fill name, email, password → Continue
  □ Step 2: Fill location → Continue
  □ Step 3: Pick 2-3 skill categories → "Join SkillBridge"
  □ Loading state shows "Creating account…"
  □ ✅ REDIRECTS TO /onboarding (not dashboard)

STEP 3 — Onboarding  /onboarding
  □ Welcome message with user name
  □ 3-step wizard completes
  □ Final step → redirects to /dashboard

STEP 4 — Dashboard  /dashboard
  □ Welcome header with name and level progress
  □ 4 stat cards visible and animated
  □ My Skills section shows skills (or empty state if none)
  □ Requests section shows requests with Accept/Decline buttons
  □ Accept a request → status changes to "Accepted" ✅
  □ "Explore matches" button → goes to /explore
  □ AI Recommended section shows 3 skill cards
  □ "Request session" on recommended → goes to /skill/1
  □ Recent activity timeline visible

STEP 5 — Explore  /explore
  □ Search bar works — type "Python" → filters results
  □ Category pills work — click "Tech" → filters to Tech only
  □ Distance slider works
  □ Rating filter works
  □ "Available now" toggle works
  □ Results count updates with every filter change
  □ Each skill card hover effect works
  □ "Request session" on a card → goes to /skill/[id]
  □ Toggle to Map view → pins visible on map
  □ Click a pin → popup card appears with "View skill" button
  □ "Clear all filters" button resets everything

STEP 6 — Skill Detail  /skill/1
  □ Breadcrumb "Explore" → goes back to /explore
  □ Skill hero shows title, rating, meta info
  □ About, What you'll learn, Requirements all visible
  □ Availability calendar shows days with slots
  □ Click a time slot → slot highlights and button updates
  □ "Request [selected slot]" button visible
  □ Reviews section with star breakdown visible
  □ Sidebar: Provider card with "View full profile" → /profile/1
  □ "Message provider" → goes to /chat
  □ Similar skills section at bottom

STEP 7 — Profile  /profile/1
  □ Cover banner and avatar visible
  □ Verified badge, level chip visible
  □ 4 stat cards visible
  □ About card with bio, availability, languages
  □ Skills tab → 3 skills with "Request this skill" buttons
  □ Reviews tab → rating summary + review cards
  □ Activity tab → bar chart of sessions

STEP 8 — Chat  /chat
  □ Conversation list on left with unread badges
  □ Click different conversations → messages update
  □ Type a message → send button lights up
  □ Press Enter → message sends and appears in chat
  □ Message shows with timestamp and read receipt
  □ Session panel on right shows scheduled session
  □ "Confirm" and "Reschedule" buttons visible

STEP 9 — Impact  /impact
  □ Impact score ring visible
  □ Rank shown ("Top 12% in city")
  □ Level progress bar visible
  □ 4 metric cards with trend arrows
  □ Bar chart — toggle Sessions/Hours works
  □ Skills breakdown with progress bars
  □ Leaderboard with gold/silver/bronze medals
  □ Your position highlighted with "You" badge
  □ Badges section — Earned vs Locked tabs work
  □ Impact map — 4 city cards visible
  □ "Explore more cities" → goes to /explore

STEP 10 — Mobile check
  □ Open on phone or resize browser to 375px width
  □ Landing page hero readable
  □ Navbar collapses to hamburger menu
  □ Mobile drawer opens and closes
  □ Dashboard cards stack vertically
  □ Explore filters accessible
  □ Chat page usable on mobile

─────────────────────────────────────────────────────────────────────────────
DEMO SCRIPT (what to say to judges — 3 minutes):
─────────────────────────────────────────────────────────────────────────────

"SkillBridge is a hyperlocal skill sharing platform.
The problem: people have valuable skills they never share,
and people nearby need exactly those skills but can't afford courses.

[Show landing] Here's our landing — built on Next.js with MUI.

[Click register] New users go through a 3-step onboarding —
name, location, and skill categories — so our AI can start matching immediately.

[Show explore] On Explore, users can search, filter by category,
distance and rating — or switch to map view to find skills literally near them.

[Open a skill] Each skill has full detail — what you'll learn,
availability calendar, provider profile, and a slot picker to request a session.

[Open chat] Once matched, users chat in real time and confirm sessions.

[Open impact] And finally — every session earns an impact score.
We show leaderboards, badges, and analytics to keep people engaged.

The whole frontend is production-ready. Our backend team has
the FastAPI + Firebase + ML matching algorithm running on Google Cloud Run.

SkillBridge turns unused knowledge into community capital — completely free."

─────────────────────────────────────────────────────────────────────────────