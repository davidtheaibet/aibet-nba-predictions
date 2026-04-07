// utils/featureScoring/nba.js
// NBA Prediction Module — Market-Aware Algorithm
// Integrates with AIbet backend prediction engine

import { calculateBias, applyBias } from "../sportBiasEngine.js";

/**
 * Generate NBA prediction using live odds as primary input
 * Historical data used for context only
 */
export async function scoreNBA({ homeTeam, awayTeam, matchData }) {
    // 1. EXTRACT LIVE ODDS (Primary Input)
    const liveOdds = matchData.odds || {};
    const homeOdds = liveOdds.home || 0;
    const awayOdds = liveOdds.away || 0;
    const oddsTimestamp = liveOdds.timestamp || new Date().toISOString();
    
    // Check data freshness
    const dataAgeMinutes = (new Date() - new Date(oddsTimestamp)) / (1000 * 60);
    const isFresh = dataAgeMinutes < 30;
    
    // 2. MARKET SIGNAL (50% weight)
    const marketFavorite = homeOdds < awayOdds ? homeTeam : awayTeam;
    const marketUnderdog = homeOdds < awayOdds ? awayTeam : homeTeam;
    const marketConfidence = calculateMarketConfidence(homeOdds, awayOdds);
    
    // 3. CONTEXT ANALYSIS (30% weight)
    const context = matchData.context || {};
    const restAdvantage = calculateRestAdvantage(context.homeRest, context.awayRest);
    const injuryImpact = calculateInjuryImpact(context.injuries);
    const motivation = calculateMotivation(context.standings);
    const homeCourt = 0.03; // 3% home court advantage
    
    // 4. HISTORICAL TREND (20% weight) — Context only
    const historical = matchData.historical || {};
    const lineMovement = analyzeLineMovement(historical.openingOdds, liveOdds);
    const sharpMoney = detectSharpMoney(historical.publicBetting, historical.lineMovement);
    
    // 5. CALCULATE PROBABILITIES
    let homeProbability = 50;
    let awayProbability = 50;
    
    // Market signal (50%)
    if (marketFavorite === homeTeam) {
        homeProbability += marketConfidence * 0.5;
        awayProbability -= marketConfidence * 0.5;
    } else {
        awayProbability += marketConfidence * 0.5;
        homeProbability -= marketConfidence * 0.5;
    }
    
    // Context factors (30%)
    const contextBias = (restAdvantage + injuryImpact + motivation + homeCourt) * 0.3;
    homeProbability += contextBias * 100;
    awayProbability -= contextBias * 100;
    
    // Historical trend (20%)
    const trendBias = (lineMovement + sharpMoney) * 0.2;
    homeProbability += trendBias * 100;
    awayProbability -= trendBias * 100;
    
    // Normalize to 100%
    const total = homeProbability + awayProbability;
    homeProbability = (homeProbability / total) * 100;
    awayProbability = (awayProbability / total) * 100;
    
    // 6. DETERMINE PICK
    const pick = homeProbability > awayProbability ? homeTeam : awayTeam;
    const confidence = Math.abs(homeProbability - awayProbability);
    const pickType = pick === marketFavorite ? "favorite" : "underdog";
    
    // 7. VALIDATION — Never pick heavy underdogs without strong signal
    const heavyFavoriteOdds = Math.min(homeOdds, awayOdds);
    if (pickType === "underdog" && heavyFavoriteOdds < 1.25 && confidence < 15) {
        // Flip to favorite if trying to pick against -$1.25+ fav with weak confidence
        return {
            prediction: marketFavorite,
            confidence: marketConfidence * 100,
            pickType: "favorite",
            probabilities: {
                [homeTeam]: homeProbability.toFixed(2),
                [awayTeam]: awayProbability.toFixed(2)
            },
            reasoning: ["Market heavily favors " + marketFavorite, "Data supports favorite"],
            dataTimestamp: oddsTimestamp,
            dataFreshness: isFresh ? "current" : "stale",
            warnings: isFresh ? [] : ["Prediction based on stale data (>30 min)"]
        };
    }
    
    // 8. BUILD REASONING
    const reasoning = [];
    if (marketFavorite === pick) {
        reasoning.push(`Market favors ${pick} (${Math.min(homeOdds, awayOdds)} odds)`);
    } else {
        reasoning.push(`Contrarian pick: ${pick} despite ${Math.max(homeOdds, awayOdds)} odds`);
    }
    
    if (Math.abs(restAdvantage) > 0.02) {
        reasoning.push(restAdvantage > 0 ? `${homeTeam} has rest advantage` : `${awayTeam} has rest advantage`);
    }
    
    if (Math.abs(injuryImpact) > 0.03) {
        reasoning.push(injuryImpact > 0 ? `${homeTeam} benefits from injuries` : `${awayTeam} benefits from injuries`);
    }
    
    if (Math.abs(lineMovement) > 0.02) {
        reasoning.push(lineMovement > 0 ? `Line moved toward ${homeTeam}` : `Line moved toward ${awayTeam}`);
    }
    
    return {
        prediction: pick,
        confidence: confidence.toFixed(2),
        pickType: pickType,
        probabilities: {
            [homeTeam]: homeProbability.toFixed(2),
            [awayTeam]: awayProbability.toFixed(2)
        },
        marketFavorite: marketFavorite,
        reasoning: reasoning,
        dataTimestamp: oddsTimestamp,
        dataFreshness: isFresh ? "current" : "stale",
        warnings: isFresh ? [] : ["Prediction based on stale data (>30 min)"]
    };
}

// Helper functions
function calculateMarketConfidence(homeOdds, awayOdds) {
    // Higher confidence when odds are more lopsided
    const ratio = Math.max(homeOdds, awayOdds) / Math.min(homeOdds, awayOdds);
    return Math.min(0.3, (ratio - 1) * 0.1); // Max 30% confidence from market
}

function calculateRestAdvantage(homeRest, awayRest) {
    if (!homeRest || !awayRest) return 0;
    const diff = homeRest - awayRest;
    return diff * 0.01; // 1% per day of rest advantage
}

function calculateInjuryImpact(injuries) {
    if (!injuries) return 0;
    let impact = 0;
    if (injuries.home) impact += injuries.home.length * 0.02;
    if (injuries.away) impact -= injuries.away.length * 0.02;
    return impact;
}

function calculateMotivation(standings) {
    if (!standings) return 0;
    // Teams fighting for playoff spots get boost
    const homeMotivation = standings.home?.playoffRace ? 0.03 : 0;
    const awayMotivation = standings.away?.playoffRace ? 0.03 : 0;
    return homeMotivation - awayMotivation;
}

function analyzeLineMovement(openingOdds, currentOdds) {
    if (!openingOdds || !currentOdds) return 0;
    const homeMovement = (openingOdds.home - currentOdds.home) / openingOdds.home;
    return homeMovement * 0.05; // 5% weight on line movement
}

function detectSharpMoney(publicBetting, lineMovement) {
    if (!publicBetting || !lineMovement) return 0;
    // If line moves opposite to public betting = sharp money
    const sharpSignal = (publicBetting > 60 && lineMovement < 0) || 
                        (publicBetting < 40 && lineMovement > 0);
    return sharpSignal ? 0.03 : 0;
}