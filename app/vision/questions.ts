export type VisionQuestion = {
  id: string;
  section: string;
  prompt: string;
  context?: string;
};

export const visionQuestions: VisionQuestion[] = [
  { id: "heart-feeling", section: "The Heart", prompt: "When someone sits in your chair, what do you want them to feel before they leave?", context: "Think beyond the finished style—consider the feeling they carry with them." },
  { id: "heart-care", section: "The Heart", prompt: "What part of caring for people through your work means the most to you?" },
  { id: "heart-trust", section: "The Heart", prompt: "What do your best clients trust you with beyond simply doing their hair?" },
  { id: "craft-difference", section: "The Craft", prompt: "What do you believe you do differently from other people in your field?" },
  { id: "craft-signals", section: "The Craft", prompt: "What have your clients repeatedly asked you for, complimented, or encouraged you to create?", context: "The patterns in their words may be pointing toward your next opportunity." },
  { id: "craft-mastery", section: "The Craft", prompt: "Which parts of your work feel most natural to you, and which parts do you want to master next?" },
  { id: "possibility-three-years", section: "The Possibility", prompt: "Imagine Rooted Essence is thriving three years from now. What exists that does not exist today?", context: "Give yourself permission to describe the fullest version of the vision." },
  { id: "possibility-future", section: "The Possibility", prompt: "Which future excites you most: a booked-out service brand, a product company, education, a studio, a community, or a combination?" },
  { id: "possibility-life", section: "The Possibility", prompt: "What would this business need to provide for your life to feel truly worth building?" },
  { id: "brand-feeling", section: "The Brand", prompt: "What should people instantly understand or feel when they encounter Rooted Essence?" },
  { id: "brand-woman", section: "The Brand", prompt: "Describe the kind of woman you most want this brand to serve." },
  { id: "brand-boundary", section: "The Brand", prompt: "What should Rooted Essence never become, even if the business grows?" },
  { id: "breakthrough-barrier", section: "The Breakthrough", prompt: "What is currently keeping the business smaller than you believe it could be?" },
  { id: "breakthrough-unbound", section: "The Breakthrough", prompt: "What would you build if money, fear, time, and uncertainty were temporarily removed?", context: "Set practicality aside for a moment and answer from instinct." },
  { id: "breakthrough-story", section: "The Breakthrough", prompt: "If someone told your story five years from now, what would you want them to say you created?" },
];
