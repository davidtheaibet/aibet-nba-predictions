## NBA Analysis: April 7, 2026

**Date:** 2026-04-07
**Games:** 5

### Game Slate

| Time (AEDT) | Matchup | Notes |
|-------------|---------|-------|
| 9:00 AM | Hawks vs Knicks | NYK playoff positioning |
| 9:00 AM | Magic vs Pistons | ORL play-in hunt, DET eliminated |
| 10:00 AM | Spurs vs 76ers | Both eliminated |
| 10:00 AM | Grizzlies vs Cavaliers | MEM on B2B, CLE may rest |
| 11:00 AM | Nuggets vs Trail Blazers | DEN seeding race, POR eliminated |

### Your Task

Analyze each game and output predictions to:
`predictions/2026-04-07/jake.json`

### Required Output Format

```json
{
  "date": "2026-04-07",
  "agent": "jake",
  "games": [
    {
      "game_id": "NYK-ATL-20260407",
      "teams": {"home": "NYK", "away": "ATL"},
      "pick": "NYK -8.5",
      "confidence": 75,
      "win_probability": 78,
      "projected_score": {"home": 118, "away": 108},
      "margin": 10,
      "reasoning": "...",
      "key_factors": ["rest_advantage", "home_court", "playoff_motivation"],
      "data_sources": ["nba.com", "espn"],
      "risk_flags": [],
      "timestamp": "2026-04-07T08:00:00Z"
    }
  ],
  "metadata": {
    "games_analyzed": 5,
    "high_confidence_picks": 3,
    "notes": "Focus on motivation gaps"
  }
}
```

### Analysis Focus (jake)

- Recent form (last 5 games)
- Pace of play matchup
- Rest days (B2B, 3-in-4, etc.)
- Home/away splits
- Injury impact
- **Late season motivation** (playoff seeding vs eliminated)

### Key Factors for Today

**High Motivation:** Knicks, Magic, Nuggets
**Low Motivation:** Pistons, Spurs, 76ers, Blazers
**B2B Risk:** Grizzlies (played tonight vs MIL)
**Rest Advantage:** Check each team's rest days

### Confidence Guidelines

- 80%+: Strong edge, high confidence
- 60-79%: Moderate edge, playable
- 40-59%: Lean, low confidence
- <40%: Pass

### Risk Flags to Watch

- `back_to_back` — Grizzlies
- `late_season_rest` — Cavaliers (if seeding locked)
- `motivation_gap` — Magic vs Pistons, Nuggets vs Blazers
- `injury_uncertainty` — Check morning reports

### Data Sources

- NBA.com stats
- ESPN
- Basketball-Reference
- Team injury reports (check 1 hour before tip-off)

### Completion Checklist

- [ ] Write predictions to `predictions/2026-04-07/jake.json`
- [ ] Commit with message: "2026-04-07 predictions - jake"
- [ ] Update this issue with summary
- [ ] Assign to dylan for market analysis
