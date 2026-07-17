export type VisionTheme = {
  id: string;
  label: string;
  keywords: string[];
  purpose: string;
  clientFeeling: string;
  pillar: string;
};

export type VisionOpportunity = {
  label: string;
  signal: string;
  keywords: string[];
};

export type GeneratedVision = {
  themes: VisionTheme[];
  purpose: string;
  experience: { moment: string; statement: string }[];
  opportunities: VisionOpportunity[];
  pillars: { title: string; line: string }[];
  founderVision: string;
};

export const themeLibrary: VisionTheme[] = [
  { id: "care", label: "Care", keywords: ["care", "caring", "listen", "safe", "seen", "trust", "nurture", "personal"], purpose: "make every client feel genuinely cared for", clientFeeling: "deeply seen, understood, and cared for", pillar: "Care that can be felt" },
  { id: "confidence", label: "Confidence", keywords: ["confidence", "confident", "beautiful", "empower", "self-esteem", "feel good"], purpose: "restore confidence through thoughtful beauty", clientFeeling: "more confident in the woman she already is", pillar: "Confidence without compromise" },
  { id: "healthy-hair", label: "Healthy Hair", keywords: ["healthy hair", "hair health", "scalp", "repair", "protective", "damage", "healthy"], purpose: "protect the health and integrity of textured hair", clientFeeling: "informed and optimistic about her hair health", pillar: "Health before performance" },
  { id: "identity", label: "Identity", keywords: ["identity", "herself", "authentic", "individual", "who she is", "culture", "self"], purpose: "honor identity through personal, expressive care", clientFeeling: "recognized without having to explain herself", pillar: "Identity, honored" },
  { id: "natural-products", label: "Natural Products", keywords: ["natural", "organic", "ingredients", "product", "products", "clean", "oil"], purpose: "bring intentional care into the rituals between appointments", clientFeeling: "equipped with products she can understand and trust", pillar: "Products with purpose" },
  { id: "education", label: "Education", keywords: ["teach", "teaching", "education", "educate", "learn", "classes", "knowledge", "mentor"], purpose: "turn expertise into knowledge women can carry with them", clientFeeling: "clear about how to care for her hair with confidence", pillar: "Knowledge generously shared" },
  { id: "community", label: "Community", keywords: ["community", "together", "women", "belong", "connection", "support", "sisterhood"], purpose: "create belonging around beauty, care, and shared growth", clientFeeling: "connected to something larger than an appointment", pillar: "Belonging by design" },
  { id: "freedom", label: "Freedom", keywords: ["freedom", "flexibility", "independent", "balance", "family", "financial", "time"], purpose: "build a sustainable business that creates room for life", clientFeeling: "at ease in an experience that never feels rushed", pillar: "Growth with freedom" },
  { id: "legacy", label: "Legacy", keywords: ["legacy", "generational", "children", "impact", "lasting", "future", "story"], purpose: "create something meaningful enough to outlast a single season", clientFeeling: "part of a brand built with lasting intention", pillar: "A legacy of care" },
  { id: "premium-service", label: "Premium Service", keywords: ["luxury", "premium", "experience", "exclusive", "quality", "detail", "high-end", "service"], purpose: "elevate personal care into a refined, memorable experience", clientFeeling: "considered in every detail", pillar: "Elevated, never impersonal" },
  { id: "creativity", label: "Creativity", keywords: ["creative", "creativity", "create", "art", "artist", "expression", "design", "unique"], purpose: "make space for beauty that feels individual and expressive", clientFeeling: "free to imagine a look that feels unmistakably hers", pillar: "Craft with a point of view" },
  { id: "wellness", label: "Wellness", keywords: ["wellness", "healing", "peace", "relax", "rest", "ritual", "well-being", "whole"], purpose: "connect beauty with restoration and whole-person wellness", clientFeeling: "restored, grounded, and renewed", pillar: "Beauty as a restorative ritual" },
  { id: "growth", label: "Growth", keywords: ["grow", "growth", "expand", "scale", "bigger", "team", "booked", "multiple"], purpose: "grow personal excellence into an enduring brand", clientFeeling: "certain she has found a brand that can grow with her", pillar: "Disciplined, meaningful growth" },
];

const opportunityLibrary: VisionOpportunity[] = [
  { label: "Purposeful Products", signal: "Extend trusted care into the rituals clients practice at home.", keywords: ["product", "products", "natural", "organic", "oil", "ingredients", "retail"] },
  { label: "Considered E-commerce", signal: "Create a simple home for products, guidance, and continued client care.", keywords: ["online", "e-commerce", "ecommerce", "website", "shop", "sell", "shipping", "product"] },
  { label: "Education", signal: "Turn Jessica’s method and knowledge into guidance others can use.", keywords: ["teach", "education", "class", "course", "mentor", "training", "workshop", "knowledge"] },
  { label: "Story-led Content", signal: "Use consistent content to teach, reassure, and deepen trust before an appointment.", keywords: ["content", "video", "social", "youtube", "instagram", "share", "educate", "story"] },
  { label: "Rooted Community", signal: "Build connection among women who value care, confidence, and healthy growth.", keywords: ["community", "women", "events", "membership", "together", "support", "connection"] },
  { label: "Studio Growth", signal: "Shape a physical experience that can hold the standard, team, and atmosphere of the brand.", keywords: ["studio", "salon", "space", "location", "team", "chairs", "expand", "booked"] },
];

function occurrences(corpus: string, keywords: string[]) {
  return keywords.reduce((score, keyword) => score + (corpus.includes(keyword) ? 1 : 0), 0);
}

export function detectVisionThemes(answers: Record<string, string>, savedThemeNames: string[] = []) {
  const corpus = Object.values(answers).join(" ").toLowerCase();
  const saved = new Set(savedThemeNames.map((name) => name.toLowerCase()));
  const ranked = themeLibrary
    .map((theme, order) => ({ theme, order, score: occurrences(corpus, theme.keywords) + (saved.has(theme.label.toLowerCase()) ? 3 : 0) }))
    .sort((a, b) => b.score - a.score || a.order - b.order)
    .filter(({ score }) => score > 0)
    .slice(0, 5)
    .map(({ theme }) => theme);

  return ranked.length >= 3
    ? ranked
    : [...ranked, ...themeLibrary.filter((theme) => !ranked.includes(theme) && ["care", "confidence", "growth"].includes(theme.id))].slice(0, 3);
}

export function generateVision(answers: Record<string, string>, savedThemeNames: string[] = []): GeneratedVision {
  const corpus = Object.values(answers).join(" ").toLowerCase();
  const themes = detectVisionThemes(answers, savedThemeNames);
  const primary = themes[0];
  const secondary = themes[1] ?? themeLibrary[1];
  const supportedOpportunities = opportunityLibrary.filter((opportunity) => occurrences(corpus, opportunity.keywords) > 0).slice(0, 4);
  const opportunities = supportedOpportunities.length
    ? supportedOpportunities
    : [{ label: "A Signature Experience", signal: "Clarify the care, atmosphere, and method that make Rooted Essence distinctly its own.", keywords: [] }];

  return {
    themes,
    purpose: `Rooted Essence exists to ${primary.purpose}—combining ${secondary.label.toLowerCase()} with a standard of service that feels personal, grounded, and distinctly Jessica’s.`,
    experience: [
      { moment: "Before", statement: `She feels welcomed before she ever sits down—${primary.clientFeeling}.` },
      { moment: "During", statement: `She experiences unhurried attention, honest guidance, and craft shaped around her.` },
      { moment: "After", statement: `She leaves ${secondary.clientFeeling}, with a sense that the care continues beyond the chair.` },
    ],
    opportunities,
    pillars: themes.slice(0, 5).map((theme) => ({ title: theme.pillar, line: `Rooted in ${theme.label.toLowerCase()}, expressed with consistency and intention.` })),
    founderVision: `Jessica, you are not simply building a service business. You are shaping a Rooted Essence experience where ${primary.label.toLowerCase()} and ${secondary.label.toLowerCase()} can become a clear, trusted standard—one thoughtful decision, one client, and one disciplined season of growth at a time.`,
  };
}
