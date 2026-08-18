import type { MetadataRoute } from 'next'
import { SITE, SITE_URL } from '@/lib/site'

// Explicitly allow the major AI crawlers per current GEO best practices.
// See https://platform.openai.com/docs/bots
export default function robots(): MetadataRoute.Robots {
  const allowedBots = [
    'GPTBot',
    'OAI-SearchBot',
    'ChatGPT-User',
    'ClaudeBot',
    'Claude-SearchBot',
    'Claude-Web',
    'anthropic-ai',
    'PerplexityBot',
    'Perplexity-User',
    'Google-Extended',
    'Googlebot',
    'Bingbot',
    'CCBot',
    'Applebot-Extended',
    'meta-externalagent',
    'cohere-ai',
  ]
  return {
    rules: [
      { userAgent: '*', allow: '/' },
      ...allowedBots.map((bot) => ({ userAgent: bot, allow: '/' })),
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  }
}
