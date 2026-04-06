# AIbet NBA Predictions

NBA prediction system using specialized AI agents.

## Structure

```
/
├── predictions/          # Daily prediction outputs
│   └── YYYY-MM-DD/
│       ├── jake.json     # Form/Pace/Scheduling analysis
│       ├── dylan.json    # Market/Matchup analysis
│       └── consensus.json # Tyson aggregated output
├── results/              # Actual game results for tracking
│   └── YYYY-MM-DD.json
├── performance/          # Agent accuracy tracking
│   ├── jake-stats.json
│   ├── dylan-stats.json
│   └── leaderboard.json
├── templates/            # Task templates
│   └── daily-analysis.md
└── README.md
```

## Agents

| Agent | Role | Output |
|-------|------|--------|
| jake | NBA Form/Pace/Scheduling | `jake.json` |
| dylan | NBA Market/Matchup | `dylan.json` |
| Tyson | Supervisor/Consensus | `consensus.json` |

## Daily Workflow

1. Task created with game slate
2. jake analyzes form/pace/scheduling
3. dylan analyzes market/movement
4. Tyson aggregates → consensus pick
5. Results logged after games
6. Performance updated

## Prediction Format

```json
{
  "date": "2026-04-06",
  "agent": "jake",
  "games": [
    {
      "game_id": "LAL-GSW-20260406",
      "teams": {"home": "LAL", "away": "GSW"},
      "pick": "LAL -4.5",
      "confidence": 72,
      "win_probability": 68,
      "reasoning": "LAL on 2 days rest, GSW on B2B...",
      "factors": ["rest_advantage", "home_court"],
      "data_sources": ["nba.com", "espn"],
      "timestamp": "2026-04-06T10:00:00Z"
    }
  ]
}
```

## Consensus Format

```json
{
  "date": "2026-04-06",
  "agent": "tyson",
  "consensus_picks": [
    {
      "game_id": "LAL-GSW-20260406",
      "pick": "LAL -4.5",
      "confidence": 70,
      "agreement": "strong",
      "jake": {"pick": "LAL -4.5", "confidence": 72},
      "dylan": {"pick": "LAL -3.5", "confidence": 68},
      "notes": "Both agree on LAL, slight line difference"
    }
  ]
}
```
