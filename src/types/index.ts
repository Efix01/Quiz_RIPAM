/* ========================================================
   Tipi TypeScript per Quiz RIPAM
   ======================================================== */

/** I 4 profili del concorso RIPAM */
export type ProfileId = 'AMM' | 'ECO' | 'INF' | 'TEC';

/** Tipo di domanda */
export type QuestionType = 'knowledge' | 'logic' | 'situational';

/** Profilo concorso */
export interface ConcorsoProfile {
    id: ProfileId;
    name: string;
    description: string;
    totalPositions: number;
    subjects: string[];
    icon: string; // Lucide icon name
}

/** Singola domanda quiz */
export interface QuizQuestion {
    id: number;
    profileId: ProfileId | null;    // null = domanda comune a tutti i profili
    category: string;               // materia (es. "Diritto amministrativo")
    subcategory?: string;
    questionType: QuestionType;
    question: string;
    options: Record<string, string>; // {A: "...", B: "...", C: "...", D: "..."}
    correctAnswer?: string;         // per knowledge/logic (es. "A")
    answerScores?: Record<string, number>; // per situazionali: {A: 0.75, B: 0.375, C: 0, D: 0.375}
    explanation: string;
    source?: string;
    difficulty?: number;            // 1-5
}

/** Progresso utente per singola domanda (sistema Leitner) */
export interface UserProgressData {
    box: number;          // SRS Box: 0 (Nuovo) a 5 (Padroneggiato)
    nextReview: number;   // Timestamp
    lastReviewed: number;
    history: boolean[];   // Ultimi 5 tentativi
}

/** Statistiche globali utente */
export interface UserStats {
    totalAnswered: number;
    correctCount: number;
    currentStreak: number;
    bestStreak: number;
    level: number;
    xp: number;
    badges: string[];
    dailyBonusClaimedDate?: string;
}

/** Risultato simulazione esame */
export interface SimulationResult {
    id: string;
    profileId: ProfileId;
    startedAt: string;
    finishedAt: string;
    timeUsed: number;       // secondi
    answers: Record<number, string>; // questionId -> risposta scelta
    score: number;          // punteggio finale
    maxScore: number;
    passed: boolean;
    sectionScores: {
        knowledge: number;
        logic: number;
        situational: number;
    };
}

export type SubscriptionTier = 'free' | 'pro';

/** Profilo utente (estende auth.users di Supabase) */
export interface UserProfile {
    id: string;
    email: string;
    displayName: string;
    selectedProfile: ProfileId | null;
    preferredRegion?: string;
    diplomaScore?: number;
    diplomaYear?: number;
    additionalTitles?: AdditionalTitle[];
    subscriptionTier: SubscriptionTier;
    createdAt: string;
}

/** Titolo aggiuntivo per calcolo punteggio */
export interface AdditionalTitle {
    type: 'laurea_triennale' | 'laurea_magistrale' | 'master_primo' | 'master_secondo' | 'specializzazione' | 'dottorato';
    name: string;
    year?: number;
}

/** Stato globale quiz */
export interface QuizState {
    questions: QuizQuestion[];
    userProgress: Record<number, UserProgressData>;
    stats: UserStats;
    loading: boolean;
    error: string | null;
}

/** Configurazione simulazione RIPAM */
export const SIMULATION_CONFIG = {
    totalQuestions: 40,
    timeMinutes: 60,
    passingScore: 21,
    maxScore: 30,
    sections: {
        commonKnowledge: 10,
        specificKnowledge: 15,
        logic: 7,
        situational: 8,
    },
    scoring: {
        correct: 0.75,
        wrong: -0.25,
        blank: 0,
        situational: {
            mostEffective: 0.75,
            neutral: 0.375,
            leastEffective: 0,
        },
    },
} as const;

/** Configurazione profili concorso */
export const PROFILES: ConcorsoProfile[] = [
    {
        id: 'AMM',
        name: 'Assistente Amministrativo',
        description: 'Contabilità di Stato, Diritto UE, Pubblico impiego',
        totalPositions: 2913,
        subjects: [
            'Contabilità di Stato e degli enti pubblici',
            'Diritto dell\'Unione Europea',
            'Pubblico impiego, responsabilità, doveri e diritti',
        ],
        icon: 'FileText',
    },
    {
        id: 'ECO',
        name: 'Assistente Economico',
        description: 'Ragioneria, Economia politica e pubblica',
        totalPositions: 498,
        subjects: [
            'Contabilità di Stato e degli enti pubblici',
            'Ragioneria generale ed applicata',
            'Economia politica e pubblica',
            'Pubblico impiego, responsabilità, doveri e diritti',
        ],
        icon: 'TrendingUp',
    },
    {
        id: 'INF',
        name: 'Assistente Informatico',
        description: 'Sistemi IT, Programmazione, Database, Sicurezza',
        totalPositions: 583,
        subjects: [
            'Hardware e software, gestione comunicazione dati',
            'Linguaggi di programmazione web',
            'Architetture software',
            'Database relazionali',
            'Sicurezza informatica e reti',
            'CAD e accessibilità',
            'Project e service management (ITIL, SCRUM, PRINCE2)',
            'Metodologie di sviluppo e test',
            'GDPR',
            'Gestione sicurezza informazioni e servizi IT',
        ],
        icon: 'Monitor',
    },
    {
        id: 'TEC',
        name: 'Assistente Tecnico',
        description: 'Codice contratti pubblici, TU Edilizia',
        totalPositions: 3,
        subjects: [
            'Codice dei contratti pubblici (D.Lgs. 36/2023)',
            'Testo Unico Edilizia (DPR 380/2001)',
        ],
        icon: 'Ruler',
    },
];
