# AIbet Prediction System Architecture

**Version:** 1.0  
**Purpose:** End-to-end data flow from agent analysis to website display  
**Target Integration:** www.theaibet.com

---

## System Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           DATA FLOW PIPELINE                                 │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────────┐
│   AGENTS    │───→│  PAPERCLIP  │───→│    REPO     │───→│  THEAIBET.COM   │
│  (Analysis) │    │ (Workflow)  │    │  (Storage)  │    │   (Display)     │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────────┘
       │                  │                  │                   │
       ▼                  ▼                  ▼                   ▼
   jake.json         Issues/Tasks      predictions/         API/Webhook
   dylan.json        Assignments       consensus.json       Dashboard
   tyson.json       Heartbeats         results/             User View
```

---

## 1. AGENT LAYER (Analysis)

### Agent Hierarchy

```
┌─────────────────────────────────────────────────────────┐
│                    DAVID CEO (You)                       │
│              Final approval & override                   │
└─────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────┐
│                    ELI (Sports Chief)                    │
│         Final review before distribution                 │
└─────────────────────────────────────────────────────────┘
                            │
                            ▼
        ┌──────────────────┴──────────────────┐
        │                                     │
        ▼                                     ▼
┌─────────────────┐                 ┌─────────────────┐
│     MASON       │                 │     JORDAN      │
│   (CTO/Sports)  │                 │ (Racing Chief)  │
│  Tech oversight │                 │ Racing oversight│
└────────┬────────┘                 └────────┬────────┘
         │                                   │
         ▼                                   ▼
┌─────────────────┐                 ┌─────────────────┐
│     TYSON       │                 │   (Racing Team) │
│   Supervisor    │                 │  aj, archer...  │
│  NBA/NFL/UFC    │                 │                 │
└────────┬────────┘                 └─────────────────┘
         │
    ┌────┴────┐
    │         │
    ▼         ▼
┌───────┐ ┌───────┐
│ jake  │ │ dylan │
│(Form) │ │(Mkt)  │
└───────┘ └───────┘
```

### Agent Responsibilities

| Agent | Input | Output | Frequency |
|-------|-------|--------|-----------|
| **jake** | NBA schedule, team stats, injuries | `jake.json` — Form/pace/scheduling analysis | Daily (game days) |
| **dylan** | Odds, line movement, matchups | `dylan.json` — Market/matchup analysis | Daily (game days) |
| **Tyson** | jake.json, dylan.json | `consensus.json` — Aggregated picks | After agents complete |

---

## 2. PAPERCLIP LAYER (Workflow)

### Issue Lifecycle

```
┌─────────┐    ┌──────────┐    ┌────────────┐    ┌────────┐    ┌──────┐
│ BACKLOG │───→│   TODO   │───→│ IN_PROGRESS│───→│ IN_REVIEW│───→│ DONE │
└─────────┘    └──────────┘    └────────────┘    └────────┘    └──────┘
                    │                │                │            │
                    ▼                ▼                ▼            ▼
               Auto-created    Agent checkout    ELI review    Results
               by cron/manual   Analysis         Override      logged
```

### Task Flow Example (NBA)

```
Day -1 (Evening):
┌────────────────────────────────────────────────────────────┐
│ 1. Cron/You creates issue: "NBA Analysis: April 7, 2026"   │
│    ├── Game slate attached                                  │
│    ├── Template: templates/daily-analysis.md               │
│    └── Assigned to: jake                                    │
└────────────────────────────────────────────────────────────┘
                            │
                            ▼
Day 0 (Morning):
┌────────────────────────────────────────────────────────────┐
│ 2. jake wakes (heartbeat/checks inbox)                     │
│    ├── Checks out issue                                     │
│    ├── Analyzes games                                       │
│    ├── Writes predictions/2026-04-07/jake.json             │
│    ├── Commits to repo                                      │
│    └── Assigns to: dylan                                    │
└────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────────────┐
│ 3. dylan wakes                                             │
│    ├── Checks out issue                                     │
│    ├── Analyzes markets                                     │
│    ├── Writes predictions/2026-04-07/dylan.json            │
│    ├── Commits to repo                                      │
│    └── Assigns to: Tyson                                    │
└────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────────────┐
│ 4. Tyson wakes                                             │
│    ├── Checks out issue                                     │
│    ├── Aggregates jake + dylan outputs                      │
│    ├── Writes predictions/2026-04-07/consensus.json        │
│    ├── Commits to repo                                      │
│    └── Assigns to: ELI                                      │
└────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────────────┐
│ 5. ELI wakes                                               │
│    ├── Reviews consensus                                    │
│    ├── Applies macro intelligence                           │
│    ├── Approves or overrides                                │
│    ├── Updates consensus.json (if override)                │
│    └── Assigns to: You (DAVID CEO)                         │
└────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────────────┐
│ 6. You review                                              │
│    ├── Check predictions in repo/GitHub UI                 │
│    ├── Approve → Triggers webhook to theaibet.com          │
│    └── Override → Update consensus.json manually           │
└────────────────────────────────────────────────────────────┘
```

---

## 3. REPO LAYER (Storage)

### Folder Structure

```
aibet-nba-predictions/
│
├── 📁 predictions/                    # Daily agent outputs
│   └── 2026-04-07/
│       ├── jake.json                  # Form/pace analysis
│       ├── dylan.json                 # Market analysis
│       ├── consensus.json             # Tyson aggregation
│       └── eli-review.json            # ELI approval notes (optional)
│
├── 📁 results/                        # Actual game results
│   └── 2026-04-07.json                # Scores, covers, outcomes
│
├── 📁 performance/                    # Agent accuracy tracking
│   ├── leaderboard.json               # All-time stats
│   ├── jake-stats.json                # Agent-specific
│   ├── dylan-stats.json
│   └── monthly-reports/               # Archived reports
│
├── 📁 agents/                         # Agent instructions
│   ├── jake/
│   │   └── AGENTS.md                  # Form/pace focus
│   ├── dylan/
│   │   └── AGENTS.md                  # Market focus
│   └── tyson/
│       └── AGENTS.md                  # Consensus logic
│
├── 📁 templates/                      # Reusable templates
│   ├── daily-analysis.md              # Task template
│   ├── prediction-template.json       # Output format
│   └── consensus-template.json        # Aggregation format
│
├── 📁 api/                            # API/webhook specs
│   ├── webhook-spec.json              # theaibet.com integration
│   └── api-spec.md                    # Documentation
│
└── README.md
```

### Data Schemas

#### jake.json (Form Agent)
```json
{
  "schema_version": "1.0",
  "date": "2026-04-07",
  "agent": "jake",
  "agent_role": "NBA Form/Pace/Scheduling",
  "generated_at": "2026-04-07T08:30:00Z",
  "games": [
    {
      "game_id": "NYK-ATL-20260407",
      "teams": {
        "home": {"name": "NYK", "rest_days": 2, "last_game": "2026-04-05"},
        "away": {"name": "ATL", "rest_days": 1, "last_game": "2026-04-06"}
      },
      "pick": "NYK -8.5",
      "confidence": 75,
      "win_probability": 78,
      "projected_score": {"home": 118, "away": 108},
      "margin": 10,
      "analysis": {
        "form": {"home": "W3", "away": "L2"},
        "pace": {"home_rank": 15, "away_rank": 8, "matchup": "moderate"},
        "scheduling": {"advantage": "home", "factors": ["rest", "home_court"]},
        "injuries": {"home": [], "away": ["Trae Young - out"]}
      },
      "key_factors": ["rest_advantage", "home_court", "injury_impact"],
      "data_sources": ["nba.com/stats", "espn.com/nba/injuries"],
      "risk_flags": [],
      "notes": "NYK well-rested at home vs tired ATL"
    }
  ],
  "metadata": {
    "games_analyzed": 5,
    "high_confidence_picks": 3,
    "avg_confidence": 68,
    "analysis_time_ms": 45000
  }
}
```

#### dylan.json (Market Agent)
```json
{
  "schema_version": "1.0",
  "date": "2026-04-07",
  "agent": "dylan",
  "agent_role": "NBA Market/Matchup",
  "generated_at": "2026-04-07T09:00:00Z",
  "games": [
    {
      "game_id": "NYK-ATL-20260407",
      "teams": {"home": "NYK", "away": "ATL"},
      "pick": "NYK -7.5",
      "confidence": 72,
      "win_probability": 76,
      "market_analysis": {
        "open_line": "NYK -6.5",
        "current_line": "NYK -7.5",
        "line_movement": "+1.0 toward NYK",
        "public_betting": {"home": 65, "away": 35},
        "sharp_money": "home"
      },
      "matchup_edges": [
        {"category": "defense", "advantage": "NYK", "strength": "strong"},
        {"category": "rebounding", "advantage": "NYK", "strength": "moderate"}
      ],
      "spot_analysis": {
        "home": "playoff_positioning",
        "away": "playing_out_string"
      },
      "key_factors": ["line_movement_with", "public_sharp_aligned", "motivation_gap"],
      "data_sources": ["actionnetwork.com", "vegasinsider.com"],
      "risk_flags": ["late_season_rest_risk"],
      "notes": "Line moving toward NYK, public/sharp aligned"
    }
  ],
  "metadata": {
    "games_analyzed": 5,
    "high_confidence_picks": 2,
    "avg_confidence": 65
  }
}
```

#### consensus.json (Supervisor)
```json
{
  "schema_version": "1.0",
  "date": "2026-04-07",
  "agent": "tyson",
  "agent_role": "Supervisor/Consensus",
  "generated_at": "2026-04-07T09:30:00Z",
  "reviewed_by": "eli",
  "approval_status": "approved",
  "games": [
    {
      "game_id": "NYK-ATL-20260407",
      "teams": {"home": "NYK", "away": "ATL"},
      "consensus_pick": "NYK -8",
      "consensus_confidence": 74,
      "agreement_level": "strong",
      "recommendation": "play",
      "unit_suggestion": 1.0,
      "inputs": {
        "jake": {"pick": "NYK -8.5", "confidence": 75, "probability": 78},
        "dylan": {"pick": "NYK -7.5", "confidence": 72, "probability": 76}
      },
      "divergence_analysis": {
        "line_agreement": "aligned",
        "confidence_gap": 3,
        "probability_avg": 77,
        "factors_agreement": "high"
      },
      "key_factors": ["rest_advantage", "line_movement_with", "motivation_gap"],
      "risk_flags": ["late_season_rest_risk"],
      "override_notes": "ELI: Confident in NYK, rest advantage too big"
    }
  ],
  "metadata": {
    "games": 5,
    "strong_agreement": 3,
    "moderate_agreement": 1,
    "divergent": 1,
    "avg_confidence": 70
  }
}
```

---

## 4. WEBSITE INTEGRATION (theaibet.com)

### Webhook Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    APPROVAL TRIGGER                              │
│  You approve consensus.json → Webhook fires                     │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  POST https://api.theaibet.com/v1/predictions                   │
│  Headers: Authorization: Bearer <token>                         │
│  Body: consensus.json content                                   │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    THEAIBET.COM BACKEND                          │
│  • Store prediction in database                                 │
│  • Mark as "pending" (game not started)                         │
│  • Trigger cache refresh                                        │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    USER DASHBOARD                                │
│  • Show today's picks                                           │
│  • Display confidence scores                                    │
│  • Track pending vs settled                                     │
└─────────────────────────────────────────────────────────────────┘
```

### API Endpoints for Website

```yaml
# POST /v1/predictions
# Receive new predictions from repo

Request:
  headers:
    Authorization: Bearer {token}
    X-Source: paperclip-aibet
  body:
    date: "2026-04-07"
    games: [...]

Response:
  201: Created
  200: Updated (if already exists)
  401: Unauthorized

---
# GET /v1/predictions?date=2026-04-07
# Fetch predictions for display

Response:
  date: "2026-04-07"
  games:
    - game_id: "NYK-ATL-20260407"
      pick: "NYK -8"
      confidence: 74
      status: "pending"  # pending, won, lost, push

---
# POST /v1/results
# Update with actual game results (automated or manual)

Request:
  date: "2026-04-07"
  games:
    - game_id: "NYK-ATL-20260407"
      home_score: 120
      away_score: 105
      cover: true  # Did pick cover?
```

### Website Display Components

```
┌─────────────────────────────────────────────────────────────┐
│  TODAY'S PICKS — April 7, 2026                              │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  🏀 NYK vs ATL        NYK -8        74% confidence    PLAY  │
│     9:00 AM ET        ↗ Strong Agreement                   │
│                                                             │
│  🏀 ORL vs DET        ORL -6        81% confidence    PLAY  │
│     9:00 AM ET        ↗ Strong Agreement                   │
│                                                             │
│  🏀 DEN vs POR        DEN -12       78% confidence    PLAY  │
│     11:00 AM ET       ↗ Strong Agreement                   │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│  AGENT BREAKDOWN                                            │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐                     │
│  │  jake   │  │  dylan  │  │  tyson  │                     │
│  │  75%    │  │  72%    │  │  74%    │                     │
│  └─────────┘  └─────────┘  └─────────┘                     │
├─────────────────────────────────────────────────────────────┤
│  PERFORMANCE (Last 30 Days)                                 │
│  Consensus: 68% accuracy | +12.4 units                      │
│  jake: 65% | dylan: 62%                                     │
└─────────────────────────────────────────────────────────────┘
```

---

## 5. BIAS DETECTION & APPROVAL

### Your Override Points

```
┌─────────────────────────────────────────────────────────────┐
│  BIAS CHECKPOINTS                                            │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  1. AGENT LEVEL (Automated)                                 │
│     • Flag if confidence >85% (overconfidence)              │
│     • Flag if same pick 5+ days in a row (recency bias)     │
│     • Flag if contradicting public data                     │
│                                                             │
│  2. CONSENSUS LEVEL (Tyson checks)                          │
│     • Flag if agent divergence >10%                         │
│     • Flag if confidence >80% without strong factors        │
│     • Flag if contradicting historical matchup data         │
│                                                             │
│  3. ELI LEVEL (Human-like review)                           │
│     • Macro context (playoff implications)                  │
│     • Weather/venue factors                                 │
│     • Line movement interpretation                          │
│                                                             │
│  4. YOUR LEVEL (Final approval)                             │
│     • Gut check on high-confidence picks                    │
│     • Bankroll management (unit sizing)                     │
│     • Override any pick before publication                  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Approval Workflow in UI

```
┌─────────────────────────────────────────────────────────────┐
│  PENDING APPROVAL — 5 Picks                                 │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ☑️ NYK -8 (74%) — APPROVED                                  │
│     └─ Strong agreement, rest advantage clear               │
│                                                             │
│  ☑️ ORL -6 (81%) — APPROVED                                  │
│     └─ High confidence justified (motivation gap)           │
│                                                             │
│  ⚠️ DEN -12 (78%) — FLAGGED                                  │
│     └─ Large spread, potential trap game?                   │
│     [Approve] [Reduce to 0.5u] [Pass] [Edit]                │
│                                                             │
│  ☑️ CLE -3 (65%) — APPROVED                                  │
│                                                             │
│  ❌ MEM +4 (52%) — REJECTED                                  │
│     └─ Low confidence, B2B risk, skipping                   │
│                                                             │
│  [Publish Approved Picks]                                   │
└─────────────────────────────────────────────────────────────┘
```

---

## 6. IMPLEMENTATION CHECKLIST

### Phase 1: Foundation (Week 1)
- [ ] Configure Paperclip workspaces for jake, dylan, Tyson
- [ ] Create AGENTS.md instruction files
- [ ] Set up GitHub webhook to theaibet.com
- [ ] Test single-day workflow manually

### Phase 2: Automation (Week 2)
- [ ] Cron job: Create daily issues at 6 PM ET (day before)
- [ ] Cron job: Fetch results at midnight ET
- [ ] Auto-update performance/leaderboard.json
- [ ] Email/slack notification when consensus ready

### Phase 3: Integration (Week 3)
- [ ] theaibet.com API endpoints built
- [ ] Webhook authentication secured
- [ ] Dashboard displays predictions
- [ ] Approval UI functional

### Phase 4: Scale (Week 4+)
- [ ] Add NFL (toby agent)
- [ ] Add UFC (mark, ben agents)
- [ ] Add racing vertical (Jordan's team)
- [ ] Performance analytics dashboard

---

## 7. FILE REFERENCES

| File | Purpose |
|------|---------|
| `agents/jake/AGENTS.md` | jake's analysis instructions |
| `agents/dylan/AGENTS.md` | dylan's analysis instructions |
| `agents/tyson/AGENTS.md` | Consensus aggregation logic |
| `templates/prediction-template.json` | Output format spec |
| `templates/consensus-template.json` | Aggregation format spec |
| `api/webhook-spec.json` | theaibet.com integration spec |
| `performance/leaderboard.json` | Accuracy tracking |

---

**Next Step:** Create the agent instruction files (AGENTS.md) for jake, dylan, and Tyson?
