# AIbet Prediction System — Technical Integration Spec
**Date:** April 7, 2026  
**Status:** URGENT — Fix Required  
**Owner:** Dev Team (with Zac/David support)

---

## 🚨 Problem Statement

Current system uses **stale historical data** as primary prediction input, causing mismatches with live odds. Users see AI picking +$8.80 underdogs when market shows -$1.12 favorites.

**Impact:** Zero user trust, product appears broken.

---

## ✅ Required Fix — Data Pipeline v2

### New Flow
```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│  Live Odds API  │────→│  Prediction      │────→│  Display        │
│  (Primary)      │     │  Engine          │     │  Layer          │
└─────────────────┘     └──────────────────┘     └─────────────────┘
         │                       ▲
         │              ┌────────┴────────┐
         │              │  Historical     │
         └──────────────│  (Context Only) │
                        └─────────────────┘
```

### Data Priority
| Priority | Source | Use Case |
|----------|--------|----------|
| **1** | `Odds` table (live) | Primary input — current market prices |
| **2** | `Matches` table | Game context — teams, time, location |
| **3** | `HistoricalData` | Trend analysis — line movement, patterns |

---

## 🔧 Implementation Steps

### Step 1: Data Layer (Dev Team)
- [ ] Update `Odds` table fetch to run every 15 minutes
- [ ] Add `last_updated` timestamp to all odds records
- [ ] Create freshness check: reject data >30 minutes old

### Step 2: Prediction Engine (Zac/David + Dev Team)
- [ ] Replace `HistoricalData` as primary input with `Odds`
- [ ] Implement prediction logic (see below)
- [ ] Add confidence scoring based on data freshness

### Step 3: Display Layer (Dev Team)
- [ ] Show prediction timestamp
- [ ] Add visual indicator for data freshness
- [ ] Display mismatch warning if odds moved >10% since prediction

---

## 🧠 Prediction Logic (To Implement)

### Input Parameters
```json
{
  "game_id": "CLE-MEM-20260407",
  "home_team": "CLE",
  "away_team": "MEM",
  "odds": {
    "home": 1.12,
    "away": 8.80,
    "timestamp": "2026-04-07T18:00:00Z"
  },
  "historical": {
    "line_movement": "CLE opened 1.25, now 1.12",
    "public_betting": "70% on CLE",
    "sharp_action": "CLE"
  },
  "context": {
    "home_rest": 2,
    "away_rest": 1,
    "home_injuries": [],
    "away_injuries": ["Ja Morant"],
    "playoff_implications": "CLE chasing #1 seed"
  }
}
```

### Decision Algorithm
```python
def generate_prediction(game_data):
    # 1. Market Signal (50% weight)
    market_favorite = get_favorite_from_odds(game_data['odds'])
    market_confidence = calculate_edge(game_data['odds'])
    
    # 2. Context Analysis (30% weight)
    rest_advantage = calculate_rest_diff(game_data['context'])
    injury_impact = calculate_injury_impact(game_data['context'])
    motivation = calculate_motivation(game_data['context'])
    
    # 3. Historical Trend (20% weight)
    line_movement = analyze_line_shift(game_data['historical'])
    public_vs_sharp = detect_sharp_money(game_data['historical'])
    
    # 4. Consensus
    prediction = weighted_average([
        (market_favorite, 0.5),
        (context_signal, 0.3),
        (trend_signal, 0.2)
    ])
    
    return {
        "pick": prediction.team,
        "confidence": prediction.confidence,
        "reasoning": prediction.factors,
        "data_timestamp": game_data['odds']['timestamp']
    }
```

### Key Rules
1. **Never pick against heavy favorites** (> -$1.20 odds) unless strong contrarian signal
2. **Confidence scales with data freshness** — stale data = lower confidence
3. **Always display timestamp** — transparency builds trust

---

## 📊 API Response Format

### Current (Broken)
```json
{
  "prediction": "MEM",
  "confidence": 61,
  "odds": { "home": 1.12, "away": 8.80 }
}
```

### Fixed (Required)
```json
{
  "prediction": "CLE",
  "confidence": 78,
  "pick_type": "favorite",  // "favorite", "underdog", "pass"
  "odds_at_prediction": { "home": 1.12, "away": 8.80 },
  "data_timestamp": "2026-04-07T18:00:00Z",
  "data_freshness": "current",  // "current", "stale", "expired"
  "reasoning": [
    "Market heavily favors CLE (1.12)",
    "CLE has rest advantage (2 days vs 1)",
    "MEM missing Ja Morant",
    "Line moved from 1.25 to 1.12 (sharp money on CLE)"
  ],
  "warnings": []  // ["Odds have moved 5% since prediction"]
}
```

---

## ⏱️ Timeline

| Phase | Task | Owner | ETA |
|-------|------|-------|-----|
| 1 | Fix data pipeline (live odds primary) | Dev Team | 24 hours |
| 2 | Implement prediction logic | Zac/David + Dev | 48 hours |
| 3 | Update display layer | Dev Team | 24 hours |
| 4 | Testing & QA | Both | 24 hours |
| **Total** | | | **5 days** |

---

## 🤝 Collaboration Model

**Dev Team owns:**
- Data pipeline infrastructure
- API endpoints
- Database queries
- Frontend display

**Zac/David owns:**
- Prediction algorithm logic
- Context analysis rules
- Confidence scoring
- Quality validation

**Joint:**
- Testing & iteration
- Performance monitoring

---

## 🎯 Success Criteria

- [ ] Predictions align with market favorites (>80% of picks)
- [ ] No picks against -$1.20+ favorites without clear justification
- [ ] All predictions show timestamp
- [ ] Data freshness <30 minutes for all live games
- [ ] User trust metrics improve (engagement, retention)

---

## 📞 Next Steps

1. **Dev Team:** Confirm timeline and assign owners
2. **Zac/David:** Provide detailed algorithm pseudocode
3. **Both:** Daily standup until fix deployed

**Questions?** Reply here or schedule 30-min sync.
