interface ThreatInput {
  confidence: number;
  eventType: string;
  isRestrictedZone: boolean;
  isNightActivity: boolean;
  isLoitering: boolean;
  isWatchlistMatch: boolean;
  cameraRisk: number;  // 0-1
  bopRisk: number;     // 0-1
}

interface ThreatOutput {
  score: number;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  reasons: string[];
}

// Configurable weights
const WEIGHTS = {
  confidence: 0.15,
  eventType: 0.25,
  restrictedZone: 0.15,
  nightActivity: 0.10,
  loitering: 0.08,
  watchlistMatch: 0.15,
  cameraRisk: 0.06,
  bopRisk: 0.06,
};

const EVENT_TYPE_SCORES: Record<string, number> = {
  INTRUSION: 95,
  FACE_MATCH: 90,
  SUSPICIOUS_ACTIVITY: 85,
  ANPR_MATCH: 80,
  NIGHT_ACTIVITY: 75,
  LOITERING: 65,
  ABANDONED_OBJECT: 60,
  PERSON_DETECTED: 30,
  VEHICLE_DETECTED: 20,
};

const SEVERITY_THRESHOLDS = {
  CRITICAL: 80,
  HIGH: 60,
  MEDIUM: 40,
};

export class ThreatService {
  static calculate(input: ThreatInput): ThreatOutput {
    const reasons: string[] = [];
    let rawScore = 0;

    // Confidence contribution
    const confScore = input.confidence * 100;
    rawScore += confScore * WEIGHTS.confidence;

    // Event type contribution
    const eventScore = EVENT_TYPE_SCORES[input.eventType] || 30;
    rawScore += eventScore * WEIGHTS.eventType;
    if (eventScore >= 80) reasons.push(`High-threat event type: ${input.eventType}`);

    // Restricted zone
    if (input.isRestrictedZone) {
      rawScore += 100 * WEIGHTS.restrictedZone;
      reasons.push('Activity detected in restricted zone');
    }

    // Night activity
    if (input.isNightActivity) {
      rawScore += 100 * WEIGHTS.nightActivity;
      reasons.push('Night-time activity detected');
    }

    // Loitering
    if (input.isLoitering) {
      rawScore += 100 * WEIGHTS.loitering;
      reasons.push('Loitering behavior detected');
    }

    // Watchlist match
    if (input.isWatchlistMatch) {
      rawScore += 100 * WEIGHTS.watchlistMatch;
      reasons.push('Watchlist match identified');
    }

    // Camera & BOP risk
    rawScore += (input.cameraRisk * 100) * WEIGHTS.cameraRisk;
    rawScore += (input.bopRisk * 100) * WEIGHTS.bopRisk;

    const score = Math.min(Math.round(rawScore), 100);

    let severity: ThreatOutput['severity'];
    if (score >= SEVERITY_THRESHOLDS.CRITICAL) severity = 'CRITICAL';
    else if (score >= SEVERITY_THRESHOLDS.HIGH) severity = 'HIGH';
    else if (score >= SEVERITY_THRESHOLDS.MEDIUM) severity = 'MEDIUM';
    else severity = 'LOW';

    if (reasons.length === 0) reasons.push('Standard detection event');

    return { score, severity, reasons };
  }
}
