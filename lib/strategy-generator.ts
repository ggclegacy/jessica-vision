import { generateVision, type GeneratedVision } from "./vision-generator";

export type StrategyBlueprint = {
  vision: GeneratedVision;
  foundation: { mission: string; vision: string; purpose: string; personality: string[]; values: string[] };
  client: { profile: string; lifestyle: string; motivations: string; frustrations: string; transformation: string };
  position: { exists: string; different: string; promise: string };
  opportunities: { title: string; rationale: string }[];
  website: { page: string; direction: string }[];
  products: { name: string; direction: string }[];
  experience: { label: string; recommendation: string }[];
  phases: { phase: string; title: string; focus: string; actions: string[] }[];
  nextSteps: { title: string; reason: string }[];
};

const includesAny = (corpus: string, words: string[]) => words.some((word) => corpus.includes(word));

export function generateStrategy(answers: Record<string, string>, savedThemes: string[] = []): StrategyBlueprint {
  const vision = generateVision(answers, savedThemes);
  const corpus = Object.values(answers).join(" ").toLowerCase();
  const has = (ids: string[]) => vision.themes.some((theme) => ids.includes(theme.id));
  const productSignal = includesAny(corpus, ["product", "natural", "organic", "oil", "serum", "mist", "shampoo", "conditioner", "retail"]);
  const educationSignal = has(["education"]) || includesAny(corpus, ["teach", "class", "course", "workshop", "mentor", "education"]);
  const communitySignal = has(["community"]) || includesAny(corpus, ["community", "membership", "events", "together"]);
  const growthSignal = has(["growth"]) || includesAny(corpus, ["studio", "team", "expand", "booked", "scale"]);
  const digitalSignal = includesAny(corpus, ["online", "digital", "content", "video", "course", "e-commerce", "ecommerce"]);
  const primary = vision.themes[0];
  const secondary = vision.themes[1] ?? vision.themes[0];

  const opportunities = [
    { supported: true, title: "Premium Signature Services", rationale: `Package the Rooted Essence standard around ${primary.label.toLowerCase()}, consultation, and a consistent client ritual.` },
    { supported: productSignal, title: "Focused Product Line", rationale: "Begin with one clearly validated client need before expanding into a collection." },
    { supported: productSignal, title: "Curated Retail", rationale: "Offer a small, trusted edit of care products that supports results between appointments." },
    { supported: productSignal || digitalSignal, title: "E-commerce", rationale: "Create a simple purchasing path that extends trusted care beyond local appointments." },
    { supported: educationSignal, title: "Education & Workshops", rationale: "Turn Jessica’s repeatable knowledge into intimate learning experiences for clients or professionals." },
    { supported: communitySignal, title: "Rooted Community", rationale: "Develop gatherings or membership only after a clear shared need and rhythm emerge." },
    { supported: educationSignal && digitalSignal, title: "Digital Education", rationale: "Translate proven teaching into guides or courses that can serve beyond the studio." },
  ].filter((item) => item.supported).map(({ title, rationale }) => ({ title, rationale }));

  const website = [
    { include: true, page: "Homepage", direction: `Lead with the transformation: ${primary.clientFeeling}. Make the booking path unmistakable.` },
    { include: true, page: "About", direction: "Tell Jessica’s founder story through her philosophy of care, not a résumé." },
    { include: true, page: "Services", direction: "Organize signature services by client need and outcome, with clear expectations." },
    { include: true, page: "Booking", direction: "Create a calm, low-friction path with preparation guidance and transparent policies." },
    { include: productSignal, page: "Products", direction: "Present each product through the ritual, need, and result it supports." },
    { include: true, page: "Testimonials", direction: "Prioritize stories about confidence, trust, care, and lasting results." },
    { include: educationSignal, page: "Education", direction: "Separate client guidance from professional learning and clarify who each offer serves." },
    { include: true, page: "Contact", direction: "Keep inquiries intentional and route booking questions toward the booking experience." },
  ].filter((item) => item.include).map(({ page, direction }) => ({ page, direction }));

  const productCandidates = [
    { match: ["oil", "natural product", "hair growth"], name: "Signature Hair Oil", direction: "Validate the primary use case, ingredient philosophy, and repeat-purchase need first." },
    { match: ["scalp", "itch", "dry scalp"], name: "Scalp Serum", direction: "Develop around a specific scalp-care need already voiced by clients." },
    { match: ["loc", "locks", "mist"], name: "Hydrating Loc Mist", direction: "Focus on lightweight hydration and an easy between-visit ritual." },
    { match: ["shampoo", "cleanse", "wash"], name: "Gentle Cleanser", direction: "Clarify hair type, cleansing frequency, and ingredient boundaries before formulation." },
    { match: ["conditioner", "moisture", "detangle"], name: "Moisture Conditioner", direction: "Anchor the formula to the strongest recurring moisture or manageability need." },
    { match: ["bonnet", "scarf", "accessory", "accessories"], name: "Care Accessories", direction: "Select only tools that reinforce the at-home care method." },
  ].filter((product) => includesAny(corpus, product.match)).map(({ name, direction }) => ({ name, direction }));
  const products = productCandidates.length ? productCandidates : productSignal ? [{ name: "Signature Care Product", direction: "Use client interviews and small tests to choose the first format; do not begin with a broad collection." }] : [];

  const coreValues = vision.themes.slice(0, 6).map((theme) => theme.pillar);
  return {
    vision,
    foundation: {
      mission: `To ${primary.purpose}, through skilled service and an experience grounded in ${secondary.label.toLowerCase()}.`,
      vision: `To grow Rooted Essence into a trusted, recognizable brand that carries Jessica’s standard of care beyond a single appointment.`,
      purpose: vision.purpose,
      personality: ["Warm", "Grounded", has(["premium-service"]) ? "Refined" : "Intentional", has(["creativity"]) ? "Expressive" : "Assured", "Nurturing"],
      values: coreValues,
    },
    client: {
      profile: `A woman who values expertise and wants her beauty experience to respect her identity, time, and long-term care—not simply deliver a temporary result.`,
      lifestyle: has(["wellness", "premium-service"]) ? "She is intentional about where she invests and is drawn to elevated, restorative experiences." : "She balances a full life and values service that feels personal, reliable, and thoughtfully paced.",
      motivations: `She wants to feel ${primary.clientFeeling} while building confidence in how she cares for herself.`,
      frustrations: "She is tired of rushed appointments, generic advice, and short-term results that do not account for her individual needs.",
      transformation: `From uncertainty or disconnection to ${secondary.clientFeeling}.`,
    },
    position: {
      exists: `Rooted Essence exists because personal care can be both highly skilled and deeply human.`,
      different: `Jessica’s advantage is the combination of ${primary.label.toLowerCase()}, ${secondary.label.toLowerCase()}, and an experience shaped around the individual rather than a transaction.`,
      promise: `You will leave feeling seen, cared for, and more confident in what comes next.`,
    },
    opportunities,
    website,
    products,
    experience: [
      { label: "Visual style", recommendation: "Botanical depth, tactile natural materials, generous space, and restrained metallic detail." },
      { label: "Photography", recommendation: "Intimate, editorial portraits; authentic texture; hands at work; quiet moments of client care." },
      { label: "Color feeling", recommendation: "Deep espresso and olive create grounding; copper and muted gold signal warmth and earned refinement." },
      { label: "Tone of voice", recommendation: `Warm, clear, knowledgeable, and assured—guided by ${primary.label.toLowerCase()}, never hype.` },
      { label: "Customer experience", recommendation: "Personal consultation, clear preparation, unrushed service, thoughtful follow-up, and consistent details." },
      { label: "Luxury level", recommendation: has(["premium-service"]) ? "Quiet luxury: elevated in execution, personal in delivery, and never performative." : "Accessible premium: intentional, polished, and rooted in genuine value." },
    ],
    phases: [
      { phase: "Phase 1", title: "Clarify the Core", focus: "Create a consistent foundation before adding complexity.", actions: ["Finalize positioning and signature client promise", "Refine service architecture and booking", "Establish visual identity and core photography"] },
      { phase: "Phase 2", title: "Build the Experience", focus: "Turn the promise into visible, repeatable touchpoints.", actions: ["Launch the focused website", "Create a sustainable content rhythm", ...(productSignal ? ["Validate one product concept with clients"] : educationSignal ? ["Pilot one intimate education offer"] : ["Document the signature service method"])] },
      { phase: "Phase 3", title: growthSignal || productSignal ? "Extend with Discipline" : "Grow with Intention", focus: "Expand only where client demand and operational readiness meet.", actions: [productSignal ? "Launch the first validated product" : "Strengthen referral and retention systems", educationSignal ? "Package proven education" : "Deepen the signature service line", growthSignal ? "Assess studio or team capacity" : "Review the next best growth channel"] },
    ],
    nextSteps: [
      { title: "Finalize the brand foundation", reason: "Use the mission, position, and promise as the filter for every next decision." },
      { title: "Refine services and booking", reason: "Make the current business easier to understand and easier to enter." },
      { title: "Create the visual identity", reason: "Translate Rooted Essence’s warmth and standard of care into a recognizable system." },
      { title: "Plan a focused photography day", reason: "Capture Jessica, the craft, client emotion, and the atmosphere the website needs." },
      { title: "Build the first website", reason: "Create one clear home for story, services, proof, and booking." },
      ...(productSignal ? [{ title: "Validate the first product", reason: "Interview clients and test demand before investing in a broad line." }] : []),
    ].slice(0, 6),
  };
}
