## NBA Daily Analysis Task

**Date:** {{DATE}}
**Games:** {{GAME_COUNT}}

### Game Slate

{{GAMES_LIST}}

### Your Task

Analyze each game and output predictions to:
`predictions/{{DATE}}/{{AGENT_NAME}}.json`

### Required Output Format

```json
{
  "date": "{{DATE}}",
  "agent": "{{AGENT_NAME}}",
  "games": [
    {
      "game_id": "HOME-AWAY-YYYYMMDD",
      "teams": {"home": "...", "away": "..."},
      "pick": "TEAM SPREAD or MONEYLINE",
      "confidence": 0-100,
      "win_probability": 0-100,
      "reasoning": "...",
      "key_factors": ["..."],
      "data_sources": ["..."],
      "risk_flags": []
    }
  ]
}
```

### Analysis Focus

**For jake (Form/Pace/Scheduling):**
- Recent form (last 5 games)
- Pace of play matchup
- Rest days (B2B, 3-in-4, etc.)
- Home/away splits
- Injury impact

**For dylan (Market/Matchup):**
- Line movement
- Matchup edges
- Rotation patterns
- Spot analysis (revenge, lookahead, etc.)

### Confidence Guidelines

- 80%+: Strong edge, high confidence
- 60-79%: Moderate edge, playable
- 40-59%: Lean, low confidence
- <40%: Pass

### Risk Flags

Include if applicable:
- `back_to_back`
- `injury_uncertainty`
- `late_season_rest`
- `motivation_gap`
- `line_movement_against`

### Data Sources

Use at minimum:
- NBA.com stats
- ESPN
- Basketball-Reference
- Team injury reports

### Completion

1. Write predictions to repo
2. Commit with message: "{{DATE}} predictions - {{AGENT_NAME}}"
3. Update this issue with summary
4. Assign to Tyson for consensus
