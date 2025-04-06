import type { VerificationResult, NewsCategory } from '@/types'

interface MockParams {
  title?: string
  content?: string
  category?: NewsCategory
  type?: string
  url?: string
}

export const mockVerifyResponse = (params: MockParams): VerificationResult => {
  return {
    id: Math.random().toString(36).substr(2, 9),
    title: params.title || '测试新闻',
    content: params.content || '测试内容',
    category: params.category || 'other',
    credibility: Math.random() * 0.5 + 0.5,
    source: '新闻检测系统',
    verifiedAt: new Date().toISOString(),
    summary: '这是一个自动生成的检测结果摘要。',
    score: Math.random() * 0.5 + 0.5,
    details: [
      {
        type: 'factCheck',
        score: Math.random() * 0.5 + 0.5,
        explanation: '基于事实核查的分析结果',
        evidence: ['来源可靠', '数据准确']
      },
      {
        type: 'sourceAnalysis',
        score: Math.random() * 0.5 + 0.5,
        explanation: '基于来源分析的结果',
        evidence: ['官方媒体', '权威来源']
      },
      {
        type: 'textAnalysis',
        score: Math.random() * 0.5 + 0.5,
        explanation: '基于文本分析的结果',
        evidence: ['语言客观', '描述准确']
      }
    ]
  }
} 