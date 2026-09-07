# 1. Frontend — What We Are Building

The frontend is the **IBVAP Command & Control Dashboard**.

Its job is to allow an authorized security operator to:

* Monitor cameras
* See live AI detections
* Receive alerts
* Investigate incidents
* View evidence
* Verify evidence integrity
* Manage cameras
* Manage watchlists
* View border locations on a map
* Monitor system health

The UI should look like a **professional government/security command center**, not like a normal SaaS dashboard.

---

# 2. Frontend Technology

```text
Next.js
React
TypeScript
Tailwind CSS
shadcn/ui
Lucide Icons
MapLibre / Leaflet
WebSocket
Recharts
```

For the SIH prototype, use **mock data initially**, then connect the APIs.

---

# 3. Main Navigation

The sidebar should contain:

```text
IBVAP
Intelligent Border Surveillance

├── Dashboard
├── Live Surveillance
├── Cameras
├── Alerts
├── Events
├── Investigation
├── Evidence
├── Border Map
├── Watchlist
├── Analytics
└── System Health

──────────────

Settings
Logout
```

---

# 4. Login Page

### `/login`

Simple secure login screen.

Contains:

* IBVAP logo
* System name
* Email/username
* Password
* Sign In
* Forgot password
* Security notice

Example:

```text
┌──────────────────────────────────────┐
│              IBVAP                   │
│ Intelligent Border Video Analytics   │
│                                      │
│ Username                             │
│ [________________________]           │
│                                      │
│ Password                             │
│ [________________________]           │
│                                      │
│         [ SIGN IN ]                  │
│                                      │
│ Authorized personnel only            │
└──────────────────────────────────────┘
```

---

# 5. Dashboard

### `/dashboard`

This is the most important page.

### Top KPI cards

```text
Total Cameras     Online Cameras
    128                121

Active Alerts     Critical Alerts
     17                  3
```

### Main section

**Live Threat Overview**

Show:

* Critical alerts
* High alerts
* Medium alerts
* Low alerts

### Camera status

```text
Online     121
Offline      7
Warning      3
```

### Recent incidents

Table:

```text
Event ID | Type | Camera | Location | Severity | Time | Status
```

### Threat map

Small map showing:

* BOPs
* Cameras
* Active incidents

---

# 6. Live Surveillance

### `/live`

This is the CCTV monitoring page.

Display multiple camera feeds:

```text
┌───────────────┬───────────────┐
│ CAM-01        │ CAM-02        │
│ LIVE          │ LIVE          │
│               │               │
│ Person #21    │ Vehicle #32   │
└───────────────┴───────────────┘

┌───────────────┬───────────────┐
│ CAM-03        │ CAM-04        │
│ LIVE          │ LIVE          │
│               │               │
│ NORMAL        │ ⚠ INTRUSION   │
└───────────────┴───────────────┘
```

Each feed shows:

* Camera name
* BOP
* Online status
* FPS
* AI detection boxes
* Track IDs
* Event indicator
* Timestamp

Clicking a camera opens full-screen view.

---

# 7. Camera Management

### `/cameras`

Table of all cameras.

Columns:

```text
Camera ID
Camera Name
BOP
Location
Status
FPS
AI Status
Last Seen
Actions
```

Actions:

* View
* Edit
* Start
* Stop
* Delete

### Add Camera

Form:

```text
Camera Name
Camera ID
BOP
RTSP URL
Location
Camera Type
Zone
```

---

# 8. Camera Details

### `/cameras/[id]`

Shows:

* Live feed
* Camera information
* Current detections
* Current events
* FPS
* Latency
* GPU usage
* Connection status

Also allow the operator to configure:

### Virtual Fence

Draw:

* Line
* Polygon
* Restricted area

Example:

```text
              CAMERA VIEW

       ┌───────────────────────┐
       │                       │
       │       PERSON          │
       │          ↓            │
       │-----------------------│
       │   RESTRICTED ZONE     │
       │                       │
       └───────────────────────┘
```

---

# 9. Alerts Page

### `/alerts`

This is where operators handle threats.

Filters:

* Severity
* Event type
* Camera
* BOP
* Date
* Status

Alert cards:

```text
🚨 CRITICAL

Border Intrusion

BOP-12 / CAM-04
02:31 AM

Threat Score: 91

[Investigate]
```

Actions:

* Acknowledge
* Investigate
* Resolve
* Escalate

---

# 10. Event Page

### `/events`

All AI-generated events.

Example:

```text
EVT-10021
INTRUSION
CAM-04
BOP-12
CRITICAL
02:31:14
```

Other events:

* PERSON_DETECTED
* VEHICLE_DETECTED
* ANPR_MATCH
* FACE_MATCH
* INTRUSION
* LOITERING
* ABANDONED_OBJECT
* SUSPICIOUS_ACTIVITY

---

# 11. Event Details

### `/events/[id]`

This is an important investigation page.

Show:

```text
EVENT EVT-10021

Type:
Border Intrusion

Camera:
BOP-12-CAM-04

Location:
North Fence

Time:
02:31:14

Threat Score:
91 / 100

Severity:
CRITICAL
```

Then:

### Detection information

```text
Object: Person
Track ID: 72
Confidence: 96%
Direction: North
```

### Evidence

* Snapshot
* Video clip
* Metadata

### Blockchain

```text
Evidence ID: EVD-10021

SHA-256:
a94f...72bc

Blockchain:
Hyperledger Fabric

Status:
✓ VERIFIED
```

---

# 12. Investigation Page

### `/investigation`

This should feel like a professional investigation workspace.

Left:

```text
Event List
```

Center:

```text
Evidence Viewer
```

Right:

```text
Event Information
Timeline
Threat Score
Blockchain Status
```

This is where the operator investigates an incident.

---

# 13. Evidence Page

### `/evidence`

Shows all stored evidence.

Filters:

* Event
* Camera
* Date
* Evidence type
* Verification status

Example:

```text
EVD-10021
Snapshot + Video

Event:
EVT-10021

Hash:
a94f...72bc

Blockchain:
VERIFIED

Created:
02:31:15
```

---

# 14. Evidence Verification Page

### `/evidence/[id]`

This page demonstrates the **AI + cybersecurity + blockchain** concept.

Display:

```text
              EVIDENCE VERIFICATION

Evidence ID
EVD-10021

Current File Hash
a94f...72bc

Blockchain Hash
a94f...72bc

────────────────────────────

✓ HASH MATCH

Evidence Integrity Verified

Blockchain Transaction
TX-8F72A91...

Recorded By
BOP-12

Timestamp
02:31:16
```

If hashes don't match:

```text
⚠ INTEGRITY VERIFICATION FAILED

The current evidence does not match
the blockchain-recorded hash.
```

This will be an excellent SIH demo screen.

---

# 15. Border Map

### `/map`

Full-screen map.

Show:

* BOPs
* CCTV cameras
* Restricted zones
* Active alerts
* Incidents

Click camera:

```text
CAM-04

BOP-12
Online

Active Alert:
INTRUSION

[Open Camera]
```

---

# 16. Watchlist

### `/watchlist`

Two sections:

### Person Watchlist

```text
Person ID
Name/Reference
Status
Last Match
Actions
```

### Vehicle Watchlist

```text
Vehicle ID
Number Plate
Vehicle Type
Status
Last Match
Actions
```

Don't expose unnecessary sensitive biometric information in the UI.

---

# 17. Analytics

### `/analytics`

Charts for:

* Alerts by day
* Intrusions
* Vehicle detections
* Person detections
* ANPR matches
* Camera activity
* Threat distribution
* BOP-wise incidents

Example:

```text
Threat Distribution

CRITICAL ███
HIGH     ███████
MEDIUM   ███████████
LOW      ███████████████
```

---

# 18. System Health

### `/system-health`

Display:

```text
API                 ● ONLINE
Database            ● ONLINE
Redis               ● ONLINE
AI Engine           ● ONLINE
Blockchain          ● ONLINE
Evidence Storage    ● ONLINE
```

Hardware:

```text
CPU       42%
RAM       61%
GPU       73%
Storage   48%
```

Camera:

```text
128 Total
121 Online
7 Offline
```

---

# 19. Settings

### `/settings`

Sections:

* Profile
* Security
* Notifications
* Alert thresholds
* Threat scoring
* Camera preferences
* System configuration

---

# 20. Frontend Component Structure

```text
frontend/
│
├── app/
│
├── components/
│   ├── layout/
│   │   ├── Sidebar.tsx
│   │   ├── Header.tsx
│   │   └── PageContainer.tsx
│   │
│   ├── dashboard/
│   │   ├── StatsCard.tsx
│   │   ├── ThreatOverview.tsx
│   │   ├── RecentEvents.tsx
│   │   └── ThreatMap.tsx
│   │
│   ├── cameras/
│   │   ├── CameraCard.tsx
│   │   ├── CameraGrid.tsx
│   │   ├── CameraTable.tsx
│   │   ├── CameraForm.tsx
│   │   └── VideoPlayer.tsx
│   │
│   ├── alerts/
│   │   ├── AlertCard.tsx
│   │   ├── AlertTable.tsx
│   │   └── SeverityBadge.tsx
│   │
│   ├── events/
│   │   ├── EventTable.tsx
│   │   ├── EventDetails.tsx
│   │   └── DetectionTimeline.tsx
│   │
│   ├── evidence/
│   │   ├── EvidenceViewer.tsx
│   │   ├── HashVerification.tsx
│   │   └── BlockchainStatus.tsx
│   │
│   ├── map/
│   │   ├── BorderMap.tsx
│   │   ├── CameraMarker.tsx
│   │   └── IncidentMarker.tsx
│   │
│   └── ui/
│       └── shadcn components
│
├── hooks/
├── lib/
└── types/
```

---

# 21. Frontend Design Direction

For the SIH project, I recommend:

### Visual style

**Dark command-center interface**

* Dark background
* High contrast
* Professional typography
* Minimal gradients
* Clear status indicators
* Dense but organized information
* Subtle borders
* Security/operations aesthetic

Don't make it look like:

❌ Crypto dashboard
❌ Gaming UI
❌ Generic SaaS template

It should look like:

✅ Government command center
✅ Border surveillance system
✅ Mission-control interface

---

# 22. COMPLETE FRONTEND PROMPT

Now this is the **copy-paste prompt** you can give to an AI coding tool such as Cursor/Copilot/Claude Code.

Build the frontend for a project called **IBVAP — Intelligent Border Video Analytics Platform**.

IBVAP is an AI-powered border surveillance platform that uses existing CCTV infrastructure and analyzes video streams using AI to detect people, vehicles, suspicious movement, restricted-zone intrusion, ANPR events, and other security events. The frontend is the central Command & Control Dashboard used by authorized security personnel.

IMPORTANT:

* Build only the frontend.
* Do not build the backend yet.
* Do not implement real AI inference yet.
* Do not implement real Hyperledger Fabric integration yet.
* Use realistic mock data and clean API service abstractions so the backend can be connected later.
* Do not require Docker.
* The frontend must run locally with npm/pnpm.
* Use TypeScript throughout.

TECH STACK:

* Next.js with App Router
* React
* TypeScript
* Tailwind CSS
* shadcn/ui
* Lucide React icons
* Recharts for analytics
* MapLibre GL or Leaflet for maps
* WebSocket abstraction for future real-time events
* Mock data for initial development

PROJECT OBJECTIVE:

Create a professional security command-center interface rather than a generic SaaS dashboard.

The UI should feel like a government/border-security operations platform:

* Professional
* Dark command-center aesthetic
* High information density
* Clear hierarchy
* Minimal unnecessary animations
* Strong status indicators
* Responsive
* Desktop-first
* Accessible
* Clean typography
* Consistent spacing
* Reusable components

MAIN NAVIGATION:

Dashboard
Live Surveillance
Cameras
Alerts
Events
Investigation
Evidence
Border Map
Watchlist
Analytics
System Health
Settings

Include:

* Persistent sidebar
* Top header
* Current system status
* Logged-in user/role
* Notification indicator
* Responsive sidebar behavior

PAGES:

1. LOGIN
   Route:
   /login

Create a professional login page with:

* IBVAP logo/name
* "Intelligent Border Video Analytics Platform"
* Username/email field
* Password field
* Sign-in button
* Forgot password link
* Authorized personnel warning
* Clean security-focused design

2. DASHBOARD
   Route:
   /dashboard

Create the primary command-center dashboard.

Show KPI cards:

* Total Cameras
* Online Cameras
* Offline Cameras
* Active Alerts
* Critical Alerts
* Events Today

Create:

* Threat overview
* Recent incidents table
* Camera status summary
* Active critical alerts
* Small border map
* System health summary

Recent incidents table columns:

* Event ID
* Event Type
* Camera
* BOP
* Severity
* Time
* Status
* Action

3. LIVE SURVEILLANCE
   Route:
   /live

Create a multi-camera surveillance interface.

Display a grid of CCTV camera cards.

Each camera card should show:

* Camera ID
* Camera name
* BOP
* Online/offline status
* Live indicator
* Timestamp
* FPS
* AI detection overlays
* Bounding boxes
* Track IDs
* Current event
* Severity indicator

Use simulated video placeholders for now.

Allow:

* Grid layout
* Camera selection
* Full-screen camera view
* Search
* Filtering
* Camera status filtering

4. CAMERAS
   Route:
   /cameras

Create a camera management page.

Show:

* Search
* Filters
* Add camera button
* Camera table

Columns:

* Camera ID
* Name
* BOP
* Location
* Status
* FPS
* AI Status
* Last Seen
* Actions

Actions:

* View
* Edit
* Start
* Stop
* Delete

Create an Add/Edit Camera modal/form containing:

* Camera name
* Camera ID
* BOP
* RTSP URL
* Location
* Camera type
* Zone
* Status

5. CAMERA DETAILS
   Route:
   /cameras/[id]

Show:

* Large video area
* Camera information
* Connection status
* FPS
* Latency
* AI status
* Current detections
* Recent events
* Camera health

Add a Virtual Fence configuration section.

Allow the UI to visually represent:

* Virtual line
* Restricted polygon
* Restricted zone

The actual AI/geometric processing will be implemented later.

6. ALERTS
   Route:
   /alerts

Create an alert-management center.

Show:

* Critical
* High
* Medium
* Low alerts

Filters:

* Severity
* Event type
* Camera
* BOP
* Date
* Status

Alert cards/table should show:

* Alert ID
* Event
* Camera
* BOP
* Threat score
* Severity
* Timestamp
* Status

Actions:

* Acknowledge
* Investigate
* Resolve
* Escalate

Critical alerts should have visually strong but professional indicators.

7. EVENTS
   Route:
   /events

Create an event-management page.

Event types include:

* PERSON_DETECTED
* VEHICLE_DETECTED
* ANPR_MATCH
* FACE_MATCH
* INTRUSION
* LOITERING
* ABANDONED_OBJECT
* SUSPICIOUS_ACTIVITY
* NIGHT_ACTIVITY

Show:

* Event ID
* Type
* Camera
* BOP
* Timestamp
* Object
* Confidence
* Threat score
* Severity
* Status

Add filtering and search.

8. EVENT DETAILS
   Route:
   /events/[id]

Create a detailed incident page.

Show:

* Event ID
* Event type
* Camera
* BOP
* Location
* Timestamp
* Threat score
* Severity
* Object type
* Track ID
* Detection confidence
* Direction
* Detection timeline

Show evidence:

* Snapshot placeholder
* Video clip placeholder
* Metadata

Show blockchain status:

* Evidence ID
* SHA-256 hash
* Blockchain transaction ID
* Verification status

9. INVESTIGATION
   Route:
   /investigation

Create a professional investigation workspace.

Layout:

* Left: incident/event list
* Center: evidence viewer
* Right: incident details

The investigator should be able to:

* Select an event
* View evidence
* View event timeline
* View detection information
* View threat score
* View blockchain verification status

10. EVIDENCE
    Route:
    /evidence

Create evidence-management interface.

Show:

* Evidence ID
* Event ID
* Evidence type
* Camera
* Timestamp
* SHA-256 hash
* Blockchain status
* Verification status

Filters:

* Camera
* BOP
* Event type
* Date
* Verification status

11. EVIDENCE DETAILS / VERIFICATION
    Route:
    /evidence/[id]

This is a major demonstration page.

Create a professional evidence verification interface.

Show:

Evidence ID:
EVD-10021

Current File Hash:
a94f...72bc

Blockchain Hash:
a94f...72bc

Blockchain:
Hyperledger Fabric

Transaction ID:
TX-8F72A91

Status:
VERIFIED

If hashes match:
Display:
"Evidence Integrity Verified"

If hashes do not match:
Display:
"Evidence Integrity Verification Failed"

Use mock verification data initially.

Create a clear visual comparison between:

* Current evidence hash
* Blockchain-recorded hash

12. BORDER MAP
    Route:
    /map

Create a full-page interactive map.

Show:

* BOP locations
* CCTV cameras
* Restricted zones
* Active alerts
* Incidents

Use MapLibre or Leaflet.

Marker states:

* Online camera
* Offline camera
* Active alert
* Critical incident

Clicking a camera marker should show:

* Camera ID
* BOP
* Status
* Current event
* Open camera button

Use mock geospatial data.

13. WATCHLIST
    Route:
    /watchlist

Create two sections:

PERSON WATCHLIST

* Reference ID
* Name/reference
* Status
* Last match
* Added date
* Actions

VEHICLE WATCHLIST

* Vehicle ID
* Number plate
* Vehicle type
* Status
* Last match
* Actions

Include:

* Add person
* Add vehicle
* Search
* Filter
* Edit
* Delete

Do not display unnecessary sensitive biometric information.

14. ANALYTICS
    Route:
    /analytics

Create charts using Recharts.

Show:

* Alerts over time
* Intrusions over time
* Person detections
* Vehicle detections
* ANPR matches
* Threat distribution
* Camera activity
* BOP-wise incidents

Use realistic mock data.

15. SYSTEM HEALTH
    Route:
    /system-health

Show service health:

API
ONLINE

Database
ONLINE

Redis
ONLINE

AI Engine
ONLINE

Blockchain
ONLINE

Evidence Storage
ONLINE

Show system resources:

* CPU
* RAM
* GPU
* Storage

Show camera health:

* Total
* Online
* Offline

Show:

* AI inference latency
* API latency
* Event processing rate

16. SETTINGS
    Route:
    /settings

Sections:

* Profile
* Security
* Notifications
* Threat scoring
* Alert thresholds
* Camera preferences
* System configuration

COMPONENT ARCHITECTURE:

Create reusable components.

components/
layout/
Sidebar
Header
PageContainer

dashboard/
StatsCard
ThreatOverview
RecentEvents
ThreatMap
CameraStatus

cameras/
CameraCard
CameraGrid
CameraTable
CameraForm
VideoPlayer
VirtualFenceEditor

alerts/
AlertCard
AlertTable
SeverityBadge

events/
EventTable
EventDetails
DetectionTimeline

evidence/
EvidenceViewer
EvidenceTable
HashVerification
BlockchainStatus

map/
BorderMap
CameraMarker
IncidentMarker

watchlist/
PersonWatchlist
VehicleWatchlist

ui/
reusable shadcn/ui components

DATA TYPES:

Create TypeScript interfaces for:

Camera
BOP
Event
Alert
Detection
Evidence
WatchlistPerson
WatchlistVehicle
ThreatScore
BlockchainRecord
SystemHealth

Example Event:

{
eventId: "EVT-10021",
cameraId: "BOP12-CAM04",
bopId: "BOP12",
timestamp: "2026-09-03T02:31:14Z",
eventType: "INTRUSION",
objectType: "PERSON",
trackId: 72,
confidence: 0.96,
zone: "NORTH_FENCE",
severity: "CRITICAL",
threatScore: 91,
evidenceId: "EVD-10021"
}

MOCK API LAYER:

Create:

lib/api.ts

Do not directly hardcode data inside pages.

Create functions such as:

getCameras()
getCamera(id)
getEvents()
getEvent(id)
getAlerts()
getEvidence()
getEvidence(id)
verifyEvidence(id)
getWatchlist()
getSystemHealth()

Initially these functions should return mock data.

Structure the API layer so that it can later call FastAPI endpoints without changing the page components.

WEBSOCKET:

Create:

lib/websocket.ts
hooks/useWebSocket.ts

For now simulate real-time alerts.

The architecture should later support:

AI Event
→ FastAPI
→ WebSocket
→ Next.js
→ Alert appears instantly

Create a mock event generator if necessary.

DESIGN REQUIREMENTS:

Use a professional dark command-center UI.

Avoid:

* Excessive gradients
* Excessive rounded cards
* Huge decorative elements
* Crypto-style visuals
* Gaming UI
* Unnecessary animations
* Excessive glassmorphism

Prefer:

* Dark surfaces
* Clear borders
* Compact cards
* High contrast
* Professional typography
* Consistent spacing
* Clear status badges
* Tables
* Operational information

Use color only where it communicates status:

* Critical
* High
* Medium
* Low
* Online
* Offline
* Verified
* Failed

RESPONSIVE DESIGN:

Desktop is the primary target because this is a command-center application.

Still support:

* Laptop
* Tablet
* Mobile

On smaller screens:

* Collapse sidebar
* Convert tables into cards where appropriate
* Keep critical alerts visible

SECURITY UX:

The interface represents a sensitive security system.

Therefore:

* Show current user role
* Show authorization status
* Hide unnecessary sensitive information
* Add confirmation dialogs for destructive actions
* Provide audit information where appropriate
* Do not expose passwords or secrets
* Do not expose API keys in frontend code

ROUTING:

Implement all routes:

/login
/dashboard
/live
/cameras
/cameras/[id]
/alerts
/events
/events/[id]
/investigation
/evidence
/evidence/[id]
/map
/watchlist
/analytics
/system-health
/settings

IMPLEMENTATION ORDER:

1. Create Next.js project
2. Configure Tailwind
3. Configure shadcn/ui
4. Create global layout
5. Create sidebar/header
6. Build Dashboard
7. Build Live Surveillance
8. Build Cameras
9. Build Alerts
10. Build Events
11. Build Investigation
12. Build Evidence
13. Build Map
14. Build Watchlist
15. Build Analytics
16. Build System Health
17. Build Settings
18. Add mock API layer
19. Add mock WebSocket layer
20. Add loading states
21. Add empty states
22. Add error states
23. Test navigation
24. Ensure TypeScript has no errors
25. Ensure production build succeeds

IMPORTANT:

Do not create fake backend endpoints.

Do not require Docker.

Do not implement blockchain directly in the frontend.

Do not put blockchain private keys or secrets in the frontend.

Do not implement real face recognition in the browser.

The frontend should be a clean, production-style Command & Control Dashboard ready to connect to the future FastAPI backend.

The final result should look like a realistic **AI-powered border surveillance command center** suitable for demonstrating the IBVAP project to Smart India Hackathon judges.

### One important recommendation

**Don't ask the coding AI to build the entire frontend in one shot.** Use the master prompt as the specification, but implement it in stages:

**Prompt 1:** Project setup + layout
**Prompt 2:** Dashboard
**Prompt 3:** Live surveillance + cameras
**Prompt 4:** Alerts + events
**Prompt 5:** Investigation + evidence
**Prompt 6:** Map + watchlist
**Prompt 7:** Analytics + system health
**Prompt 8:** Mock API + WebSocket
**Prompt 9:** Final UI polish + bug fixing

