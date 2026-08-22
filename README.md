# 💧 Jal-Setu AI

**AI-powered water tanker distribution and fair allocation platform for water-scarce urban areas.**

> Replacing guesswork and political favoritism in tanker dispatch with verified requests, AI-driven priority scoring, and GPS-tracked, fully auditable deliveries.

![Status](https://img.shields.io/badge/status-hackathon%20prototype-orange)
![License](https://img.shields.io/badge/license-MIT-blue)
![Made for](https://img.shields.io/badge/made%20for-urban%20water%20equity-0EA5B7)

---

## 📌 The Problem

Cities like Pune face a recurring cycle every summer: municipal water pressure drops, and residents — especially in slums, informal settlements, hospitals, and schools — are pushed onto an unregulated tanker market with no transparency in who gets water first.

- Housing societies in areas like **Warje, Kothrud, and Baner** routinely order 7–12 private tankers a day at ₹1,000+ each just to meet basic needs.¹
- Residents and local representatives repeatedly report **no transparency in tanker allocation** — some areas wait for days despite urgent need.²
- A well-documented **"tanker mafia"** dynamic means water is often allocated based on political pressure rather than actual demand.³
- Vulnerable institutions — hospitals mid-surgery, schools serving mid-day meals, informal slum settlements — have no reliable way to signal urgency over a random residential request.
- Delhi's 2025 rollout of 1,100+ GPS-enabled tankers to fight this exact problem shows the fix is technically proven — it just hasn't reached most cities yet.⁴

Jal-Setu AI exists to close that gap: one verified request pipeline, one AI engine deciding who gets water next and why, and full GPS/OTP-based proof that it arrived.

<sub>¹ [Pune tanker shortage — TheBridgeChronicle](https://www.thebridgechronicle.com/news/pune-vimannagar-faces-severe-water-shortage-residents-forced-to-depend-on-pricey-tankers) · ² [Western suburbs allocation transparency — TheBridgeChronicle](https://www.thebridgechronicle.com/amp/story/pune/pune-water-shortage-western-suburbs-supply-crisis-agn97) · ³ [Tanker mafia & political pressure — Free Press Journal](https://www.freepressjournal.in/pune/tanker-mafia-political-pressure-broken-promises-why-pune-is-facing-water-cuts-despite-water-in-reservoirs) · ⁴ [Delhi GPS tankers — Organiser](https://organiser.org/2025/04/21/288364/bharat/delhi-bjp-delivers-in-10-weeks-what-aap-couldnt-in-10-years-cm-rekha-gupta-flags-off-1111-gps-water-tankers/)</sub>

---

## 💡 The Solution

Jal-Setu AI connects every stakeholder in the water tanker supply chain — **citizens, institutions, filling stations, drivers, and authorities** — through a single AI-driven pipeline that:

1. Accepts **verified requests** from an authorized representative per area (society manager, slum volunteer, ward officer, hospital admin, school principal) — not one request per household — to keep data reliable and duplicate/fake requests low.
2. Runs every request through an **AI priority engine** that scores urgency using water availability, population affected, institutional criticality, and unresolved complaint history.
3. **Assigns the best tanker, filling point, and route** automatically, and tracks the tanker live via GPS.
4. **Detects diversions and delays** (route changes, long stops, GPS dropouts, volume mismatches) and flags them for authority review.
5. Confirms every delivery with an **OTP/QR token + geotagged photo**, producing a digital, auditable delivery receipt.

---

## ✨ Key Features

### 🧑‍🤝‍🧑 Citizen / Beneficiary App
- Role-based signup (Resident, Society Manager, Slum Volunteer, Ward Officer, Hospital Admin, School Principal)
- Guided, multi-step water shortage request form with photo & GPS evidence
- Live request tracking — priority score, queue position, ETA
- OTP/QR delivery confirmation
- Real-time notifications (dispatched, delayed, arrived)

### 🏛️ Authority / Filling Point Dashboard
- Live fleet & request map with priority-sorted queue
- Filling Point Health Score (available water, queue length, status)
- Area **Water Equity Score** and **Complaint Resolution Health Score**
- Verified hospital/school registries used to auto-check citizen-submitted claims
- Diversion & fraud risk alerts requiring review

### 🚚 Tanker Driver App
- AI-assigned tasks only — drivers follow, not decide
- Nearby filling points with live availability and AI-recommended choice + reason
- Route deviation detection with driver-reported reason capture
- Delivery confirmation via token entry + geotagged photo
- Digital delivery receipts and full task history

### 🧠 AI Engine
- Demand prediction & priority scoring
- Fair tanker allocation (not first-come-first-served, not politically influenced)
- Route optimization & ETA prediction
- Diversion risk scoring (route change, long stop, GPS-off, volume mismatch)
- Emergency detection & automatic re-routing

---

## 🏗️ System Architecture

![Jal-Setu AI System Architecture](./assets/architecture-diagram.png)

```
USERS → FRONTEND → BACKEND → AI ENGINE → REAL-TIME SYSTEM → DATABASE → EXTERNAL SERVICES
```

**Main request flow:**
`User → App → Backend → AI Engine → Tanker Allocation → Route Optimization → GPS Tracking → Delivery → Verification`

| Layer | Responsibility |
|---|---|
| Users | Admin, Beneficiary, Driver, Filling Station, Private Customer |
| Frontend | Web / mobile app, role-based authentication |
| Backend | Java Spring Boot, REST APIs, user/request/tanker management |
| AI Engine | Demand prediction, priority scoring, fair allocation, route optimization, ETA prediction, diversion detection |
| Real-Time System | GPS, WebSocket / Socket.IO, live tanker tracking |
| Database | Users, requests, tankers, deliveries, filling stations, orders |
| External Services | Maps/routing API, payment gateway, notifications |

---

## 🛠️ Tech Stack

> Update this table to match your actual implementation choices.

| Layer | Technology |
|---|---|
| Frontend (mobile) | React Native / Flutter *(TBD)* |
| Frontend (dashboard) | React + Tailwind CSS |
| Backend | Java, Spring Boot, REST APIs |
| AI / ML | Python (scoring & routing models) *(TBD)* |
| Real-time | WebSocket / Socket.IO, GPS |
| Database | PostgreSQL / MySQL *(TBD)* |
| Maps & Routing | Google Maps Platform / Mapbox *(TBD)* |
| Notifications | Firebase Cloud Messaging / Twilio *(TBD)* |
| Payments (private delivery) | Razorpay / Stripe *(TBD)* |

---

## 🚀 Getting Started

```bash
# Clone the repository
git clone https://github.com/<your-username>/jal-setu-ai.git
cd jal-setu-ai

# Backend
cd backend
./mvnw spring-boot:run

# Frontend
cd ../frontend
npm install
npm run dev
```

> Update the commands above once your actual folder structure and package manager are finalized.

### Prerequisites
- JavaScript +
- Node.js 18+
- PostgreSQL / MySQL instance
- Google Maps / routing API key

---

## 📸 Screenshots

| Citizen App | Authority Dashboard | Driver App |
|---|---|---|
| _add screenshot_ | _add screenshot_ | _add screenshot_ |

---

## 🗺️ Roadmap

- [ ] Core request → priority → allocation pipeline (MVP)
- [ ] Live GPS tracking integration
- [ ] Diversion risk scoring in production
- [ ] Multi-language support (Hindi/Marathi/English)
- [ ] Public equity dashboard for citizens (transparency layer)
- [ ] Pilot deployment with a municipal ward

---

## 👥 Team

| Name | Role |
|---|---|
| _Your name_ | _Role_ |
| _Teammate_ | _Role_ |

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

## 🙏 References & Acknowledgements

- [Pune water shortage & tanker dependency — The Bridge Chronicle](https://www.thebridgechronicle.com/news/pune-vimannagar-faces-severe-water-shortage-residents-forced-to-depend-on-pricey-tankers)
- [Tanker allocation transparency concerns — The Bridge Chronicle](https://www.thebridgechronicle.com/amp/story/pune/pune-water-shortage-western-suburbs-supply-crisis-agn97)
- [Tanker mafia & political pressure in Pune — Free Press Journal](https://www.freepressjournal.in/pune/tanker-mafia-political-pressure-broken-promises-why-pune-is-facing-water-cuts-despite-water-in-reservoirs)
- [Delhi's GPS-enabled tanker rollout — Organiser](https://organiser.org/2025/04/21/288364/bharat/delhi-bjp-delivers-in-10-weeks-what-aap-couldnt-in-10-years-cm-rekha-gupta-flags-off-1111-gps-water-tankers/)
