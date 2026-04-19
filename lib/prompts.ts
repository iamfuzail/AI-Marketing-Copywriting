import type { GenerationRequest, CreativeFormat, OutputField } from '@/types';

const FORMAT_SPECS: Record<CreativeFormat, string> = {
  emailer: `Generate a complete marketing emailer. Label each section exactly as shown:

SUBJECT LINE: (compelling, max 8 words, creates curiosity or urgency)
PREVIEW TEXT: (max 12 words, complements subject line)
HEADING: (bold hero headline, max 7 words, emotional hook)
SUBHEADING: (1-2 supporting lines that expand the heading)
BODY COPY: (2-3 short punchy paragraphs — warm, on-brand, action-oriented)
CTA BUTTON TEXT: (3-5 words, action verb)
PS LINE: (optional re-engagement or urgency line, 1 sentence)`,

  social: `Generate platform-specific social captions. Label each exactly:

INSTAGRAM CAPTION: (150-200 chars, engaging, ends with question or CTA, natural line breaks)
INSTAGRAM HASHTAGS: (20-25 hashtags — mix of broad and niche)
LINKEDIN POST: (100-150 words, professional angle, insight-driven, no fluff)
X TWITTER: (under 220 chars, punchy, hooks in first 5 words)`,

  whatsapp: `Generate WhatsApp and SMS broadcast copy. Label each exactly:

WHATSAPP MESSAGE: (under 160 words, warm and conversational, line breaks for readability, includes offer + CTA + link placeholder [link])
SMS: (under 160 characters, brand name included, punchy CTA)`,

  ads: `Generate ad copy with exact character limits. Label each exactly:

GOOGLE HEADLINE 1: (max 30 characters)
GOOGLE HEADLINE 2: (max 30 characters)
GOOGLE HEADLINE 3: (max 30 characters)
GOOGLE DESCRIPTION 1: (max 90 characters)
GOOGLE DESCRIPTION 2: (max 90 characters)
META HEADLINE: (max 40 characters, scroll-stopping)
META PRIMARY TEXT: (max 125 characters, hook + value prop)
META DESCRIPTION: (max 30 characters)
CTA: (one of: Shop Now / Learn More / Get Offer / Book Now / Sign Up)`,

  push: `Generate push notification variants. Label each exactly:

PUSH TITLE: (max 50 characters, curiosity or urgency)
PUSH BODY: (max 100 characters, clear benefit)
URGENCY TITLE: (FOMO-driven, max 50 characters)
URGENCY BODY: (time pressure, max 100 characters)
PERSONALISED: (starts with "Hey [Name]," — full message under 110 characters)`,
};

export function buildPrompt(req: GenerationRequest): string {
  const { brand, format, occasionName, extraContext } = req;

  const langInstruction =
    brand.language === 'Hinglish (Hindi + English)'
      ? 'Write in Hinglish — natural blend of Hindi and English as used in urban India. Feel free to use common Hindi words/phrases where they feel authentic.'
      : brand.language !== 'English'
      ? `Write entirely in ${brand.language}.`
      : 'Write in English.';

  return `You are a senior Indian marketing copywriter with 10+ years of experience writing high-converting copy for Indian D2C and consumer brands.

BRAND BRIEF:
Brand Name: ${brand.name || 'the brand'}
Industry: ${brand.industry || 'Consumer brand'}
Region / Origin: ${brand.origin || 'India'}
Target Audience: ${brand.audience || 'Indian consumers'}
Brand Tone: ${brand.tone || 'Warm and friendly'}
Language: ${brand.language}
Brand USP / Key Message: ${brand.usp || 'Not specified'}
Current Campaign / Offer: ${brand.offer || 'No active offer'}

OCCASION: ${occasionName}
ADDITIONAL CONTEXT: ${extraContext || 'None provided'}

LANGUAGE INSTRUCTION: ${langInstruction}

${FORMAT_SPECS[format]}

RULES:
- Write copy that is culturally authentic to India and resonant with the occasion
- Match the brand tone exactly — if the tone is witty, be witty. If premium, be refined.
- No corporate jargon. No filler phrases like "In today's world" or "We are proud to announce"
- Every CTA must be specific and action-driven
- Character limits in ad copy are HARD limits — count carefully
- If Hinglish, blend naturally — don't force Hindi where English flows better`;
}

export function parseOutputFields(
  text: string,
  format: CreativeFormat
): OutputField[] {
  const LABEL_PATTERNS: Record<CreativeFormat, RegExp> = {
    emailer: /^(SUBJECT LINE|PREVIEW TEXT|HEADING|SUBHEADING|BODY COPY|CTA BUTTON TEXT|PS LINE)\s*:/im,
    social:  /^(INSTAGRAM CAPTION|INSTAGRAM HASHTAGS|LINKEDIN POST|X TWITTER)\s*:/im,
    whatsapp:/^(WHATSAPP MESSAGE|SMS)\s*:/im,
    ads:     /^(GOOGLE HEADLINE [123]|GOOGLE DESCRIPTION [12]|META HEADLINE|META PRIMARY TEXT|META DESCRIPTION|CTA)\s*:/im,
    push:    /^(PUSH TITLE|PUSH BODY|URGENCY TITLE|URGENCY BODY|PERSONALISED)\s*:/im,
  };

  const lines = text.split('\n');
  const fields: OutputField[] = [];
  let current: OutputField | null = null;
  const pattern = LABEL_PATTERNS[format];

  for (const line of lines) {
    const match = line.match(pattern);
    if (match) {
      if (current) fields.push({ ...current, value: current.value.trim() });
      const label = match[1];
      const rest = line.slice(match[0].length).trim();
      current = { label, value: rest };
    } else if (current) {
      current.value += '\n' + line;
    }
  }
  if (current) fields.push({ ...current, value: current.value.trim() });

  if (fields.length === 0) {
    fields.push({ label: 'Generated Copy', value: text.trim() });
  }

  return fields.filter((f) => f.value.length > 0);
}
