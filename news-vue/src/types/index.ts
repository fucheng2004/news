export type NewsCategory = 'politics' | 'technology' | 'economy' | 'society' | 'international' | 'other'

export interface NewsItem {
  id: string
  title: string
  content: string
  category: NewsCategory
  createdAt: string
}

export interface VerificationDetail {
  type: 'sourceAnalysis' | 'factCheck' | 'textAnalysis'
  score: number
  explanation: string
  evidence?: string[]
}

export interface FakeAnalysis {
  type: 'manipulation' | 'generation' | 'misinformation';
  confidence: number;
  technique: string;
  characteristics: string[];
  impact: string;
  recommendations: string[];
}

export interface VerificationResult {
  sourceScore: number
  sourceEvidence: string[]
  textScore: number
  textEvidence: string[]
  id: string
  title: string
  content: string
  category: NewsCategory
  credibility: number
  source: string
  verifiedAt: string
  summary: string
  score: number
  details: VerificationDetail[]
  fakeAnalysis?: FakeAnalysis
}

export interface NewsSample {
  id: number
  title: string
  content: string
  category: NewsCategory
}

export interface HistoryRecord {
  id: number
  title: string
  content: string
  result: number
  analysis: number
  createdAt: string
  updatedAt: number
} 