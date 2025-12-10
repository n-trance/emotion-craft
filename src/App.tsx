import { useState, useEffect, useRef } from "react";
import "./App.css";
import { buildFeelingGraph } from "./buildFeelingGraph";

const BASE_EMOTIONS = [
  "Joy",
  "Fear",
  "Sadness",
  "Disgust",
  "Anger",
  "Surprise",
];

// Build the emotion graph once
const emotionGraph = buildFeelingGraph(BASE_EMOTIONS);

// Base emotion colors
const BASE_EMOTION_COLORS: { [key: string]: string } = {
  Joy: "#fbbf24",
  Fear: "#8b5cf6",
  Surprise: "#ec4899",
  Sadness: "#06b6d4",
  Disgust: "#10b981",
  Anger: "#ef4444",
};

// Base emotion shapes
const BASE_EMOTION_SHAPES: {
  [key: string]:
    | "circle"
    | "triangleDown"
    | "star"
    | "hexagon"
    | "triangleUp"
    | "diamond"
    | "oval";
} = {
  Joy: "circle",
  Fear: "triangleDown",
  Surprise: "star",
  Sadness: "oval",
  Disgust: "hexagon",
  Anger: "triangleUp",
};

// Feeling descriptions
const FEELING_DESCRIPTIONS: { [key: string]: string } = {
  // Base emotions
  Joy: "A feeling of great pleasure and happiness, often accompanied by a sense of contentment and well-being.",
  Trust:
    "A firm belief in the reliability, truth, or ability of someone or something.",
  Fear: "An unpleasant emotion caused by the threat of danger, pain, or harm.",
  Surprise:
    "A feeling of astonishment or amazement caused by something unexpected.",
  Sadness:
    "An emotional pain associated with feelings of disadvantage, loss, or helplessness.",
  Disgust:
    "A strong feeling of revulsion or profound disapproval aroused by something unpleasant or offensive.",
  Anger: "A strong feeling of annoyance, displeasure, or hostility.",
  Anticipation:
    "The act of looking forward to something; expectation or prediction of future events.",

  // First level combinations
  Love: "An intense feeling of deep affection and care for someone or something.",
  Optimism:
    "Hopefulness and confidence about the future or the successful outcome of something.",
  Delight:
    "Great pleasure or satisfaction, often from something unexpected or charming.",
  "Nervous Excitement":
    "A mix of anxiety and anticipation, feeling both worried and eager about something.",
  Pride:
    "A feeling of deep pleasure or satisfaction derived from achievements or qualities.",
  Bittersweet:
    "A feeling that is both pleasant and painful, often tinged with nostalgia or regret.",
  "Morbid Curiosity":
    "An unhealthy interest in disturbing or unpleasant subjects, especially death.",
  Submission:
    "A feeling of yielding or surrendering to a superior force or authority; a state of submissiveness.",
  Curiosity: "A strong desire to know or learn something.",
  Faith:
    "Complete trust or confidence in someone or something, often without proof.",
  Dominance:
    "Power and influence over others, or the state of being in control.",
  Resignation: "The acceptance of something undesirable but inevitable.",
  "Moral Disgust":
    "A feeling of revulsion toward actions or behaviors that violate moral principles.",
  Awe: "A feeling of reverential respect mixed with fear or wonder.",
  Anxiety:
    "A feeling of worry, nervousness, or unease about something with an uncertain outcome.",
  Hate: "An intense or passionate dislike for someone or something.",
  Despair: "The complete loss or absence of hope.",
  Horror: "An intense feeling of fear, shock, or disgust.",
  Disappointment:
    "Sadness or displeasure caused by the non-fulfillment of one's hopes or expectations.",
  Outrage: "An extremely strong reaction of anger, shock, or indignation.",
  Revulsion: "A sense of disgust and loathing.",
  Remorse: "Deep regret or guilt for a wrong committed.",
  Envy: "A feeling of discontented or resentful longing aroused by someone else's possessions or qualities.",
  Pessimism:
    "A tendency to see the worst aspect of things or believe that the worst will happen.",
  Contempt:
    "The feeling that a person or a thing is beneath consideration, worthless, or deserving scorn.",
  Aggressiveness: "Hostile or violent behavior or attitudes toward others.",

  // Second level combinations
  Vulnerability:
    "A feeling of being exposed, unprotected, or susceptible to harm or emotional hurt.",
  Passion:
    "Strong and barely controllable emotion, often romantic or enthusiastic.",
  Heartbreak:
    "Overwhelming distress, typically caused by the end of a romantic relationship.",
  Euphoria: "A feeling or state of intense excitement and happiness.",
  Infatuation:
    "An intense but short-lived passion or admiration for someone or something.",
  Longing:
    "A yearning desire for something, especially something not currently possessed.",
  Disillusionment:
    "A feeling of disappointment resulting from the discovery that something is not as good as believed.",
  Hope: "A feeling of expectation and desire for a certain thing to happen.",
  Determination: "Firmness of purpose; resoluteness.",
  Resilience: "The capacity to recover quickly from difficulties; toughness.",
  Elation: "Great happiness and exhilaration.",
  Confidence:
    "A feeling of self-assurance arising from an appreciation of one's own abilities or qualities.",
  Wonder:
    "A feeling of amazement and admiration, caused by something beautiful or remarkable.",
  Tolerance:
    "The ability or willingness to accept the existence of opinions or behavior that one dislikes.",
  Transcendence: "Existence or experience beyond the normal or physical level.",
  Terror: "Extreme fear or dread.",
  Reverence: "Deep respect for someone or something.",
  Indignation:
    "Anger or annoyance provoked by what is perceived as unfair treatment.",
  Melancholy: "A feeling of pensive sadness, typically with no obvious cause.",
  Amazement: "A feeling of great surprise or wonder.",
  Relief:
    "A feeling of reassurance and relaxation following release from anxiety or distress.",
  Frustration:
    "The feeling of being upset or annoyed as a result of being unable to change or achieve something.",
  Desperation:
    "A feeling of despair and urgency that drives one toward rash or extreme actions.",
  Panic:
    "Sudden uncontrollable fear or anxiety, often causing wildly unthinking behavior.",
  Reassurance: "A feeling of confidence, comfort, and security; the sense of having one's doubts or fears removed.",
  Shock: "A sudden upsetting or surprising event or experience.",
  Apprehension: "Anxiety or fear that something bad or unpleasant will happen.",
  Schadenfreude: "Pleasure derived from another person's misfortune.",
  Betrayal: "A feeling of being deceived, abandoned, or let down by someone trusted; the emotional pain of broken trust.",
  Smugness: "Excessive pride in oneself or one's achievements.",
  Scorn:
    "The feeling or belief that someone or something is worthless or despicable.",
  Disdain:
    "The feeling that someone or something is unworthy of one's consideration or respect.",
  Skepticism:
    "An attitude of doubt or questioning; uncertainty as to the truth of something.",
  Disbelief: "Inability or refusal to accept that something is true or real.",
  Cynicism:
    "An inclination to believe that people are motivated purely by self-interest.",
  Catharsis:
    "A feeling of emotional release, purification, and relief from strong or repressed emotions; a state of cleansing and renewal.",
  Hopelessness: "A feeling or state of despair; lack of optimism.",
  "Self-Loathing":
    "Hatred of oneself, typically as a result of guilt or shame.",
  Shame:
    "A painful feeling of humiliation or distress caused by the consciousness of wrong or foolish behavior.",
  Dread: "Great fear or apprehension.",
  Confession:
    "A feeling of relief and release from guilt or burden after admitting wrongdoing; the emotional state of being honest about faults.",
  Regret:
    "A feeling of sadness, repentance, or disappointment over something that has happened.",
  Worry:
    "Feel or cause to feel anxious or troubled about actual or potential problems.",
  Triumph: "A great victory or achievement.",
  Arrogance: "An attitude of superiority manifested in an overbearing manner.",
  Nostalgia:
    "A sentimental longing or wistful affection for a period in the past.",
  Humility: "A modest or low view of one's own importance; humbleness.",
  Excitement: "A feeling of great enthusiasm and eagerness.",
  Satisfaction:
    "A feeling of contentment and fulfillment from having one's wishes, expectations, or needs met.",
  Resentment: "Bitter indignation at having been treated unfairly.",
  "Self-Pity": "Excessive, self-absorbed unhappiness over one's own troubles.",
  Insecurity: "Uncertainty or anxiety about oneself; lack of confidence.",
  Admiration: "Respect and warm approval.",
  Jealousy:
    "Feelings of envy, insecurity, and resentment over a perceived threat.",
  Covetousness:
    "A strong desire to possess something belonging to someone else.",

  // Third level combinations
  Intimacy:
    "A feeling of close familiarity, deep connection, and emotional closeness with someone.",
  Defensiveness:
    "The quality of being anxious to challenge or avoid criticism.",
  Bitterness: "Anger and disappointment at being treated unfairly.",
  Grief: "Deep sorrow, especially that caused by someone's death.",
  Abandonment:
    "A feeling of being left alone, deserted, or forsaken by someone important.",
  Healing: "The process of making or becoming sound or healthy again.",
  Fury: "Wild or violent anger.",
  "Malicious Joy": "Pleasure derived from causing harm or suffering to others.",
  Vindictiveness: "A strong desire for revenge.",
  Release:
    "A feeling of liberation, freedom, and relief from confinement, restriction, or emotional burden.",
  Purification: "The removal of contaminants or undesirable elements.",
  "Deep Love": "An intense, profound feeling of affection and care.",
  Bonding:
    "A feeling of deep connection, attachment, and emotional closeness with someone; the sense of being linked through shared experiences.",
  Connection:
    "A feeling of being linked, bonded, or emotionally associated with someone or something.",
  Sorrow:
    "A feeling of deep distress caused by loss, disappointment, or other misfortune.",
  Bargaining: "A feeling or state of trying to negotiate or make deals, often in response to loss or difficult circumstances.",
  Denial: "The action of declaring something to be untrue.",
  Peace:
    "A feeling of inner calm, tranquility, and freedom from disturbance or conflict.",
  Contentment:
    "A feeling of happiness and satisfaction with one's current situation.",

  // Fourth level combinations
  Devotion: "Love, loyalty, or enthusiasm for a person, activity, or cause.",
  Harmony:
    "A feeling of balance, agreement, and pleasing consistency between elements or people.",
  Equanimity:
    "Mental calmness, composure, and evenness of temper, especially in a difficult situation.",
  Wrath: "Extreme anger.",
  Vengeance:
    "A feeling of seeking revenge or retribution for a wrong; the emotional drive to punish those who have caused harm.",
  Nihilism:
    "The rejection of all religious and moral principles, often in the belief that life is meaningless.",
  Hysteria: "Exaggerated or uncontrollable emotion or excitement.",
  Paranoia:
    "A mental condition characterized by delusions of persecution, unwarranted jealousy, or exaggerated self-importance.",
  Overwhelm:
    "A feeling of being completely overcome, buried, or drowned by emotions, responsibilities, or circumstances.",
  Sadism:
    "The tendency to derive pleasure, especially sexual gratification, from inflicting pain, suffering, or humiliation on others.",
  Recovery: "A feeling or state of returning to health, normalcy, or strength after illness, loss, or difficulty.",
  Restoration:
    "A feeling of being restored, renewed, or returned to a previous state of wholeness, peace, or well-being.",
  Oneness:
    "A feeling of being unified, whole, or completely connected with something or someone.",
  Caution: "Care taken to avoid danger or mistakes.",
  Commitment:
    "The state or quality of being dedicated to a cause, activity, etc.",
  Forgiveness:
    "The action or process of pardoning someone for an offense; letting go of resentment or anger.",
  Freedom:
    "A feeling of liberation, autonomy, and the ability to act, speak, or think without restraint.",
  Lament: "A feeling of deep grief, sorrow, or mourning; an expression of sadness and loss.",
  Avoidance: "A feeling or state of keeping away from or evading something unpleasant, threatening, or emotionally difficult.",
  Defiance: "Open resistance; bold disobedience.",
  Repression: "A state of suppressing or holding back emotions, desires, or thoughts, often unconsciously.",

  // Fifth level combinations
  Adoration: "Deep love and respect.",
  Fidelity:
    "Faithfulness to a person, cause, or belief, demonstrated by continuing loyalty and support.",
  Sacredness: "The quality of being holy, worthy of religious veneration.",
  Tranquility:
    "A feeling of calm, peace, and quiet serenity; being free from disturbance or agitation.",
  Stillness:
    "A feeling of calm, quiet, and inner peace; a sense of being motionless and at rest.",
  Zen: "A state of calm attentiveness in which one's actions are guided by intuition rather than by conscious effort.",
  Ire: "Intense anger.",
  Mania:
    "Mental illness marked by periods of great excitement, euphoria, delusions, and overactivity.",
  Phobia: "An extreme or irrational fear of or aversion to something.",
  Breakdown: "A state of collapse, failure, or disintegration; feeling overwhelmed and unable to function normally.",
  Torture:
    "The action or practice of inflicting severe pain on someone as a punishment or to force them to do or say something.",
  Malice: "The intention or desire to do evil; ill will.",
  Brutality: "A feeling or state of extreme cruelty, savagery, and violence; the emotional experience of harshness and lack of mercy.",
  Rebirth: "A feeling of being born again, renewed, or starting fresh; the emotional experience of new beginning and transformation.",
  Revival: "A feeling of renewed energy, strength, or interest; the emotional state of coming back to life or vigor.",
  Regeneration:
    "A feeling of renewal, revival, and being restored; the emotional state of regrowth and fresh beginning.",
  Solidarity:
    "Unity or agreement of feeling or action, especially among individuals with a common interest.",
  Indifference:
    "A feeling of apathy, lack of interest, concern, or emotional investment in something.",
  Detachment:
    "A feeling of being emotionally disconnected, objective, or aloof from a situation or person.",
  Delusion:
    "An idiosyncratic belief or impression that is firmly maintained despite being contradicted by what is generally accepted as reality.",
  Possessiveness: "Demanding someone's total attention and love.",
  Absolution: "A feeling of being absolved, forgiven, or released from guilt, sin, or obligation; a state of spiritual or emotional freedom.",
  Grace: "A feeling of elegance, poise, and effortless beauty; a state of being gracious, kind, and dignified.",
  Emptiness:
    "A feeling of void, hollowness, or lack of meaning, purpose, or emotional connection.",
  Abyss: "A state of profound emptiness, despair, or hopelessness; feeling lost in an endless void.",
  Loneliness:
    "A feeling of sadness, isolation, or disconnection from others, even when not physically alone.",
  Allegiance:
    "Loyalty or commitment of a subordinate to a superior or of an individual to a group or cause.",
  Dedication:
    "The quality of being dedicated or committed to a task or purpose.",
  Quietude:
    "A feeling of stillness, calmness, and quiet tranquility; inner peace and serenity.",
  Repose:
    "A feeling of rest, tranquility, and peaceful relaxation; being at ease and calm.",
  Integration:
    "A feeling or state of being unified, whole, and complete; the sense of having separate parts combined into harmony.",
  Desensitization:
    "The diminished emotional responsiveness to a negative, aversive or positive stimulus after repeated exposure to it.",
  Wariness:
    "A feeling of cautious suspicion or alertness about potential dangers or problems.",
  Vigilance:
    "A feeling or state of being alert, watchful, and attentive to potential dangers or difficulties; heightened awareness and caution.",
  Enmeshment:
    "A feeling of being overly entangled or enmeshed in a relationship; a state of unhealthy emotional fusion and loss of boundaries.",
  Entanglement: "A feeling of being caught in a complicated, compromising, or difficult relationship or situation; emotional complexity and confusion.",
  Escape: "A feeling of breaking free from confinement, control, or oppressive circumstances; a sense of liberation and freedom.",
  "Self-Reliance":
    "A feeling of independence, self-sufficiency, and confidence in one's own abilities; a state of relying on oneself rather than others.",
  Sovereignty: "A feeling of supreme power, authority, and self-control; a state of being in complete command of oneself.",
  Vacuity:
    "A feeling of emptiness, lack of substance, or absence of meaningful thought or emotion.",
  Loss: "A feeling of grief, sadness, or emptiness from losing someone or something important.",
  Perfection:
    "A feeling or state of being flawless, complete, and ideal; the emotional experience of achieving excellence or completeness.",
  Fulfillment:
    "A feeling of satisfaction, completeness, and achievement from having one's desires or potential realized.",

  // Missing feeling descriptions from combinations
  Bliss: "Perfect happiness; great joy.",
  Protectiveness:
    "The quality of wanting to keep someone or something safe from harm; a strong desire to shield and guard.",
  Yearning: "A feeling of intense longing for something.",
  Hostility: "Unfriendly or aggressive behavior or feelings.",
  Loyalty: "A strong feeling of support or allegiance.",
  Empathy: "The ability to understand and share the feelings of another.",
  Calm: "Not showing or feeling nervousness, anger, or other strong emotions.",
  Spite: "A desire to hurt, annoy, or offend someone.",
  Callousness: "Insensitive and cruel disregard for others.",
  Fused: "A feeling of being completely united, merged, or integrated with someone or something; a sense of oneness and connection.",
  Reliance: "Dependence on or trust in someone or something.",
  Sanctuary: "A feeling of safety, refuge, and peace; a sense of being protected and secure.",
  Rescue: "A feeling of being saved, protected, or delivered from danger, distress, or difficult circumstances.",
  Autonomy: "A feeling of independence, self-governance, and freedom to make one's own choices; a state of self-determination.",
  Absence: "A feeling of emptiness, loss, or void caused by being away from someone or something important; the emotional state of missing presence.",
  Vacant: "A feeling of emptiness, void, or lack of emotional presence; a sense of being unoccupied or hollow.",

  // New meaningful feelings
  Gratitude: "The quality of being thankful; readiness to show appreciation for and to return kindness.",
  Courage: "The ability to do something that frightens one; bravery in the face of fear or adversity.",
  Compassion: "Sympathetic pity and concern for the sufferings or misfortunes of others.",
  Sympathy: "Feelings of pity and sorrow for someone else's misfortune.",
  Kindness: "The quality of being friendly, generous, and considerate.",
  Appreciation: "Recognition and enjoyment of the good qualities of someone or something.",
  Valor: "Great courage in the face of danger, especially in battle.",
  Tenderness: "Gentleness and kindness; a feeling of fondness or affection.",
  Solace: "Comfort or consolation in a time of distress or sadness.",
  Generosity: "The quality of being kind and generous; willingness to give.",
  Bravery: "Courageous behavior or character; the ability to face danger or pain without fear.",
  Heroism: "Great bravery; the qualities or attributes of a hero or heroine.",
  Charity: "The voluntary giving of help, typically in the form of money, to those in need.",
  Benevolence: "The quality of being well meaning; kindness and goodwill.",
  Nobility: "The quality of being noble in character, mind, birth, or rank.",
  Honor: "High respect; great esteem; adherence to what is right or to a conventional standard of conduct.",
  Integrity: "The quality of being honest and having strong moral principles; moral uprightness.",
  Dignity: "The state or quality of being worthy of honor or respect.",
  Respect: "A feeling of deep admiration for someone or something elicited by their abilities, qualities, or achievements.",

  // Additional missing feeling descriptions
  Acceptance: "The act of accepting something or someone; a feeling of coming to terms with reality or circumstances.",
  Apathy: "A lack of interest, enthusiasm, or concern; emotional indifference.",
  Attachment: "A feeling of deep emotional connection and bond with someone or something.",
  Bereavement: "A state of sorrow over the death or departure of a loved one; the experience of mourning and loss.",
  Codependency: "An excessive emotional or psychological reliance on a partner, typically one who requires support on account of an illness or addiction.",
  Comfort: "A state of physical ease and freedom from pain or constraint; a feeling of consolation or reassurance.",
  Complacency: "Self-satisfaction accompanied by unawareness of actual dangers or deficiencies; smugness.",
  Completeness: "A feeling of being whole, entire, or finished; the state of having all necessary parts or elements.",
  Cruelty: "A feeling or state of causing pain or suffering to others; callous indifference to or pleasure in causing pain.",
  Deliverance: "A feeling of being rescued or set free from danger, difficulty, or evil; liberation from oppression.",
  Dependency: "A state of relying on or being controlled by someone or something else; emotional or psychological reliance.",
  Desire: "A strong feeling of wanting to have something or wishing for something to happen; longing or craving.",
  Desolation: "A state of complete emptiness or destruction; a feeling of bleak and dismal emptiness.",
  Destruction: "The action or process of causing so much damage to something that it no longer exists or cannot be repaired; a feeling of devastation.",
  Distrust: "A feeling of doubt or suspicion about someone or something; lack of trust or confidence.",
  Emancipation: "The fact or process of being set free from legal, social, or political restrictions; liberation.",
  Enthusiasm: "Intense and eager enjoyment, interest, or approval; great excitement and passion.",
  Guilt: "A feeling of having committed wrong or failed in an obligation; remorse for wrongdoing.",
  Hubris: "Excessive pride or self-confidence; arrogance that leads to downfall.",
  Independence: "A feeling of freedom from the control, influence, or support of others; self-reliance and autonomy.",
  Liberation: "A feeling of being set free from imprisonment, slavery, or oppression; the act of gaining freedom.",
  Mourning: "The expression of deep sorrow for someone who has died; a period of time during which signs of grief are shown.",
  Nothingness: "The absence or cessation of life or existence; a state of being void or empty.",
  Numbness: "A lack of feeling or emotion; insensitivity or unresponsiveness to emotional stimuli.",
  Patience: "The capacity to accept or tolerate delay, problems, or suffering without becoming annoyed or anxious.",
  Perseverance: "Persistence in doing something despite difficulty or delay in achieving success; steadfastness.",
  Rage: "Violent, uncontrollable anger; intense fury or wrath.",
  Redemption: "The action of saving or being saved from sin, error, or evil; atonement or deliverance.",
  Renewal: "The replacing or repair of something that is worn out, run-down, or broken; a feeling of being restored or refreshed.",
  Resolve: "Firm determination to do something; unwavering commitment to a course of action.",
  Righteousness: "The quality of being morally right or justifiable; a feeling of moral superiority or virtue.",
  Sacrifice: "An act of giving up something valued for the sake of other considerations; selfless devotion or offering.",
  Salvation: "Preservation or deliverance from harm, ruin, or loss; a feeling of being saved or rescued.",
  Serenity: "The state of being calm, peaceful, and untroubled; tranquility and composure.",
  Strength: "The quality or state of being physically or mentally strong; resilience and fortitude.",
  Suspicion: "A feeling or thought that something is possible, likely, or true, especially something bad or wrong; distrust.",
  Thrill: "A sudden feeling of excitement and pleasure; a wave of intense emotion.",
  Understanding: "The ability to understand something; comprehension; sympathetic awareness or tolerance.",
  Unity: "The state of being united or joined as a whole; harmony and agreement.",
  Void: "A completely empty space; a feeling of emptiness or absence.",
  Wholeness: "The state of forming a complete and harmonious whole; integrity and completeness.",
};

// Dimension mappings for emotions
type DimensionType =
  | "valence"
  | "arousal"
  | "dominance"
  | "temporalFocus"
  | "motivationalDirection"
  | "certainty"
  | "intensity"
  | "socialContext"
  | "cognitiveAppraisal"
  | "embodiment";

const EMOTION_DIMENSIONS: {
  [key: string]: { [dimension in DimensionType]?: string };
} = {
  // Base emotions
  Joy: {
    valence: "positive",
    arousal: "high",
    dominance: "high",
    temporalFocus: "present",
    motivationalDirection: "approach",
    certainty: "predictable",
    intensity: "strong",
    socialContext: "social",
    cognitiveAppraisal: "positive",
    embodiment: "high",
  },
  Fear: {
    valence: "negative",
    arousal: "high",
    dominance: "low",
    temporalFocus: "future",
    motivationalDirection: "avoidance",
    certainty: "uncertain",
    intensity: "strong",
    socialContext: "individual",
    cognitiveAppraisal: "negative",
    embodiment: "high",
  },
  Surprise: {
    valence: "neutral",
    arousal: "high",
    dominance: "low",
    temporalFocus: "present",
    motivationalDirection: "neutral",
    certainty: "uncertain",
    intensity: "medium",
    socialContext: "individual",
    cognitiveAppraisal: "neutral",
    embodiment: "high",
  },
  Sadness: {
    valence: "negative",
    arousal: "low",
    dominance: "low",
    temporalFocus: "past",
    motivationalDirection: "avoidance",
    certainty: "predictable",
    intensity: "medium",
    socialContext: "individual",
    cognitiveAppraisal: "negative",
    embodiment: "medium",
  },
  Disgust: {
    valence: "negative",
    arousal: "medium",
    dominance: "medium",
    temporalFocus: "present",
    motivationalDirection: "avoidance",
    certainty: "predictable",
    intensity: "medium",
    socialContext: "individual",
    cognitiveAppraisal: "negative",
    embodiment: "medium",
  },
  Anger: {
    valence: "negative",
    arousal: "high",
    dominance: "high",
    temporalFocus: "present",
    motivationalDirection: "approach",
    certainty: "predictable",
    intensity: "strong",
    socialContext: "social",
    cognitiveAppraisal: "negative",
    embodiment: "high",
  },
  // Common first-level combinations
  Love: {
    valence: "positive",
    arousal: "high",
    dominance: "medium",
    temporalFocus: "present",
    motivationalDirection: "approach",
    certainty: "predictable",
    intensity: "strong",
    socialContext: "social",
    cognitiveAppraisal: "positive",
    embodiment: "high",
  },
  Optimism: {
    valence: "positive",
    arousal: "medium",
    dominance: "high",
    temporalFocus: "future",
    motivationalDirection: "approach",
    certainty: "predictable",
    intensity: "medium",
    socialContext: "individual",
    cognitiveAppraisal: "positive",
    embodiment: "medium",
  },
  Hope: {
    valence: "positive",
    arousal: "medium",
    dominance: "medium",
    temporalFocus: "future",
    motivationalDirection: "approach",
    certainty: "uncertain",
    intensity: "medium",
    socialContext: "individual",
    cognitiveAppraisal: "positive",
    embodiment: "medium",
  },
  Anxiety: {
    valence: "negative",
    arousal: "high",
    dominance: "low",
    temporalFocus: "future",
    motivationalDirection: "avoidance",
    certainty: "uncertain",
    intensity: "strong",
    socialContext: "individual",
    cognitiveAppraisal: "negative",
    embodiment: "high",
  },
  Pride: {
    valence: "positive",
    arousal: "medium",
    dominance: "high",
    temporalFocus: "past",
    motivationalDirection: "approach",
    certainty: "predictable",
    intensity: "medium",
    socialContext: "individual",
    cognitiveAppraisal: "positive",
    embodiment: "medium",
  },
  Envy: {
    valence: "negative",
    arousal: "medium",
    dominance: "low",
    temporalFocus: "present",
    motivationalDirection: "approach",
    certainty: "predictable",
    intensity: "medium",
    socialContext: "social",
    cognitiveAppraisal: "negative",
    embodiment: "medium",
  },
  Awe: {
    valence: "positive",
    arousal: "high",
    dominance: "low",
    temporalFocus: "present",
    motivationalDirection: "approach",
    certainty: "uncertain",
    intensity: "strong",
    socialContext: "individual",
    cognitiveAppraisal: "positive",
    embodiment: "high",
  },
  Contempt: {
    valence: "negative",
    arousal: "low",
    dominance: "high",
    temporalFocus: "present",
    motivationalDirection: "avoidance",
    certainty: "predictable",
    intensity: "medium",
    socialContext: "social",
    cognitiveAppraisal: "negative",
    embodiment: "low",
  },
  Despair: {
    valence: "negative",
    arousal: "low",
    dominance: "low",
    temporalFocus: "present",
    motivationalDirection: "avoidance",
    certainty: "predictable",
    intensity: "strong",
    socialContext: "individual",
    cognitiveAppraisal: "negative",
    embodiment: "medium",
  },
  Guilt: {
    valence: "negative",
    arousal: "medium",
    dominance: "low",
    temporalFocus: "past",
    motivationalDirection: "avoidance",
    certainty: "predictable",
    intensity: "medium",
    socialContext: "social",
    cognitiveAppraisal: "negative",
    embodiment: "medium",
  },
  // Common second-level combinations
  Vulnerability: {
    valence: "negative",
    arousal: "medium",
    dominance: "low",
    temporalFocus: "present",
    motivationalDirection: "avoidance",
    certainty: "uncertain",
    intensity: "medium",
    socialContext: "social",
    cognitiveAppraisal: "negative",
    embodiment: "high",
  },
  Passion: {
    valence: "positive",
    arousal: "high",
    dominance: "medium",
    temporalFocus: "present",
    motivationalDirection: "approach",
    certainty: "predictable",
    intensity: "strong",
    socialContext: "social",
    cognitiveAppraisal: "positive",
    embodiment: "high",
  },
  Heartbreak: {
    valence: "negative",
    arousal: "medium",
    dominance: "low",
    temporalFocus: "past",
    motivationalDirection: "avoidance",
    certainty: "predictable",
    intensity: "strong",
    socialContext: "social",
    cognitiveAppraisal: "negative",
    embodiment: "high",
  },
  Euphoria: {
    valence: "positive",
    arousal: "high",
    dominance: "high",
    temporalFocus: "present",
    motivationalDirection: "approach",
    certainty: "predictable",
    intensity: "strong",
    socialContext: "social",
    cognitiveAppraisal: "positive",
    embodiment: "high",
  },
  Determination: {
    valence: "positive",
    arousal: "medium",
    dominance: "high",
    temporalFocus: "future",
    motivationalDirection: "approach",
    certainty: "predictable",
    intensity: "strong",
    socialContext: "individual",
    cognitiveAppraisal: "positive",
    embodiment: "medium",
  },
  Confidence: {
    valence: "positive",
    arousal: "medium",
    dominance: "high",
    temporalFocus: "present",
    motivationalDirection: "approach",
    certainty: "predictable",
    intensity: "medium",
    socialContext: "individual",
    cognitiveAppraisal: "positive",
    embodiment: "low",
  },
  Wonder: {
    valence: "positive",
    arousal: "medium",
    dominance: "low",
    temporalFocus: "present",
    motivationalDirection: "approach",
    certainty: "uncertain",
    intensity: "medium",
    socialContext: "individual",
    cognitiveAppraisal: "positive",
    embodiment: "low",
  },
  Tolerance: {
    valence: "neutral",
    arousal: "low",
    dominance: "medium",
    temporalFocus: "present",
    motivationalDirection: "neutral",
    certainty: "predictable",
    intensity: "weak",
    socialContext: "social",
    cognitiveAppraisal: "neutral",
    embodiment: "low",
  },
  Terror: {
    valence: "negative",
    arousal: "high",
    dominance: "low",
    temporalFocus: "present",
    motivationalDirection: "avoidance",
    certainty: "uncertain",
    intensity: "strong",
    socialContext: "individual",
    cognitiveAppraisal: "negative",
    embodiment: "high",
  },
  Reverence: {
    valence: "positive",
    arousal: "low",
    dominance: "low",
    temporalFocus: "present",
    motivationalDirection: "approach",
    certainty: "predictable",
    intensity: "medium",
    socialContext: "social",
    cognitiveAppraisal: "positive",
    embodiment: "low",
  },
  Relief: {
    valence: "positive",
    arousal: "low",
    dominance: "medium",
    temporalFocus: "present",
    motivationalDirection: "neutral",
    certainty: "predictable",
    intensity: "medium",
    socialContext: "individual",
    cognitiveAppraisal: "positive",
    embodiment: "low",
  },
  Frustration: {
    valence: "negative",
    arousal: "high",
    dominance: "low",
    temporalFocus: "present",
    motivationalDirection: "approach",
    certainty: "predictable",
    intensity: "medium",
    socialContext: "individual",
    cognitiveAppraisal: "negative",
    embodiment: "medium",
  },
  Desperation: {
    valence: "negative",
    arousal: "high",
    dominance: "low",
    temporalFocus: "present",
    motivationalDirection: "avoidance",
    certainty: "uncertain",
    intensity: "strong",
    socialContext: "individual",
    cognitiveAppraisal: "negative",
    embodiment: "high",
  },
  Panic: {
    valence: "negative",
    arousal: "high",
    dominance: "low",
    temporalFocus: "present",
    motivationalDirection: "avoidance",
    certainty: "uncertain",
    intensity: "strong",
    socialContext: "individual",
    cognitiveAppraisal: "negative",
    embodiment: "high",
  },
  Reassurance: {
    valence: "positive",
    arousal: "low",
    dominance: "medium",
    temporalFocus: "present",
    motivationalDirection: "neutral",
    certainty: "predictable",
    intensity: "weak",
    socialContext: "social",
    cognitiveAppraisal: "positive",
    embodiment: "low",
  },
  Shock: {
    valence: "neutral",
    arousal: "high",
    dominance: "low",
    temporalFocus: "present",
    motivationalDirection: "neutral",
    certainty: "uncertain",
    intensity: "strong",
    socialContext: "individual",
    cognitiveAppraisal: "neutral",
    embodiment: "high",
  },
  Apprehension: {
    valence: "negative",
    arousal: "medium",
    dominance: "low",
    temporalFocus: "future",
    motivationalDirection: "avoidance",
    certainty: "uncertain",
    intensity: "medium",
    socialContext: "individual",
    cognitiveAppraisal: "negative",
    embodiment: "medium",
  },
  Schadenfreude: {
    valence: "positive",
    arousal: "medium",
    dominance: "high",
    temporalFocus: "present",
    motivationalDirection: "approach",
    certainty: "predictable",
    intensity: "medium",
    socialContext: "social",
    cognitiveAppraisal: "negative",
    embodiment: "low",
  },
  Betrayal: {
    valence: "negative",
    arousal: "high",
    dominance: "low",
    temporalFocus: "past",
    motivationalDirection: "avoidance",
    certainty: "predictable",
    intensity: "strong",
    socialContext: "social",
    cognitiveAppraisal: "negative",
    embodiment: "high",
  },
  Smugness: {
    valence: "positive",
    arousal: "low",
    dominance: "high",
    temporalFocus: "present",
    motivationalDirection: "approach",
    certainty: "predictable",
    intensity: "weak",
    socialContext: "social",
    cognitiveAppraisal: "negative",
    embodiment: "low",
  },
  Scorn: {
    valence: "negative",
    arousal: "low",
    dominance: "high",
    temporalFocus: "present",
    motivationalDirection: "avoidance",
    certainty: "predictable",
    intensity: "medium",
    socialContext: "social",
    cognitiveAppraisal: "negative",
    embodiment: "low",
  },
  Disdain: {
    valence: "negative",
    arousal: "low",
    dominance: "high",
    temporalFocus: "present",
    motivationalDirection: "avoidance",
    certainty: "predictable",
    intensity: "medium",
    socialContext: "social",
    cognitiveAppraisal: "negative",
    embodiment: "low",
  },
  Skepticism: {
    valence: "neutral",
    arousal: "low",
    dominance: "medium",
    temporalFocus: "present",
    motivationalDirection: "neutral",
    certainty: "uncertain",
    intensity: "weak",
    socialContext: "individual",
    cognitiveAppraisal: "neutral",
    embodiment: "low",
  },
  Disbelief: {
    valence: "neutral",
    arousal: "medium",
    dominance: "low",
    temporalFocus: "present",
    motivationalDirection: "neutral",
    certainty: "uncertain",
    intensity: "medium",
    socialContext: "individual",
    cognitiveAppraisal: "neutral",
    embodiment: "medium",
  },
  Cynicism: {
    valence: "negative",
    arousal: "low",
    dominance: "medium",
    temporalFocus: "present",
    motivationalDirection: "avoidance",
    certainty: "predictable",
    intensity: "weak",
    socialContext: "social",
    cognitiveAppraisal: "negative",
    embodiment: "low",
  },
  Catharsis: {
    valence: "positive",
    arousal: "high",
    dominance: "medium",
    temporalFocus: "present",
    motivationalDirection: "neutral",
    certainty: "predictable",
    intensity: "strong",
    socialContext: "individual",
    cognitiveAppraisal: "positive",
    embodiment: "high",
  },
  Hopelessness: {
    valence: "negative",
    arousal: "low",
    dominance: "low",
    temporalFocus: "future",
    motivationalDirection: "avoidance",
    certainty: "predictable",
    intensity: "strong",
    socialContext: "individual",
    cognitiveAppraisal: "negative",
    embodiment: "low",
  },
  "Self-Loathing": {
    valence: "negative",
    arousal: "medium",
    dominance: "low",
    temporalFocus: "present",
    motivationalDirection: "avoidance",
    certainty: "predictable",
    intensity: "strong",
    socialContext: "individual",
    cognitiveAppraisal: "negative",
    embodiment: "medium",
  },
  Shame: {
    valence: "negative",
    arousal: "medium",
    dominance: "low",
    temporalFocus: "past",
    motivationalDirection: "avoidance",
    certainty: "predictable",
    intensity: "medium",
    socialContext: "social",
    cognitiveAppraisal: "negative",
    embodiment: "medium",
  },
  Dread: {
    valence: "negative",
    arousal: "high",
    dominance: "low",
    temporalFocus: "future",
    motivationalDirection: "avoidance",
    certainty: "uncertain",
    intensity: "strong",
    socialContext: "individual",
    cognitiveAppraisal: "negative",
    embodiment: "high",
  },
  Confession: {
    valence: "neutral",
    arousal: "medium",
    dominance: "low",
    temporalFocus: "past",
    motivationalDirection: "approach",
    certainty: "predictable",
    intensity: "medium",
    socialContext: "social",
    cognitiveAppraisal: "neutral",
    embodiment: "medium",
  },
  Regret: {
    valence: "negative",
    arousal: "low",
    dominance: "low",
    temporalFocus: "past",
    motivationalDirection: "avoidance",
    certainty: "predictable",
    intensity: "medium",
    socialContext: "individual",
    cognitiveAppraisal: "negative",
    embodiment: "low",
  },
  Worry: {
    valence: "negative",
    arousal: "medium",
    dominance: "low",
    temporalFocus: "future",
    motivationalDirection: "avoidance",
    certainty: "uncertain",
    intensity: "medium",
    socialContext: "individual",
    cognitiveAppraisal: "negative",
    embodiment: "medium",
  },
  Triumph: {
    valence: "positive",
    arousal: "high",
    dominance: "high",
    temporalFocus: "present",
    motivationalDirection: "approach",
    certainty: "predictable",
    intensity: "strong",
    socialContext: "individual",
    cognitiveAppraisal: "positive",
    embodiment: "high",
  },
  Arrogance: {
    valence: "positive",
    arousal: "low",
    dominance: "high",
    temporalFocus: "present",
    motivationalDirection: "approach",
    certainty: "predictable",
    intensity: "medium",
    socialContext: "social",
    cognitiveAppraisal: "negative",
    embodiment: "low",
  },
  Nostalgia: {
    valence: "positive",
    arousal: "low",
    dominance: "low",
    temporalFocus: "past",
    motivationalDirection: "approach",
    certainty: "predictable",
    intensity: "medium",
    socialContext: "individual",
    cognitiveAppraisal: "positive",
    embodiment: "low",
  },
  Humility: {
    valence: "positive",
    arousal: "low",
    dominance: "low",
    temporalFocus: "present",
    motivationalDirection: "neutral",
    certainty: "predictable",
    intensity: "weak",
    socialContext: "social",
    cognitiveAppraisal: "positive",
    embodiment: "low",
  },
  Excitement: {
    valence: "positive",
    arousal: "high",
    dominance: "medium",
    temporalFocus: "future",
    motivationalDirection: "approach",
    certainty: "uncertain",
    intensity: "strong",
    socialContext: "social",
    cognitiveAppraisal: "positive",
    embodiment: "high",
  },
  Satisfaction: {
    valence: "positive",
    arousal: "low",
    dominance: "medium",
    temporalFocus: "present",
    motivationalDirection: "neutral",
    certainty: "predictable",
    intensity: "medium",
    socialContext: "individual",
    cognitiveAppraisal: "positive",
    embodiment: "low",
  },
  Resentment: {
    valence: "negative",
    arousal: "medium",
    dominance: "low",
    temporalFocus: "past",
    motivationalDirection: "approach",
    certainty: "predictable",
    intensity: "medium",
    socialContext: "social",
    cognitiveAppraisal: "negative",
    embodiment: "medium",
  },
  "Self-Pity": {
    valence: "negative",
    arousal: "low",
    dominance: "low",
    temporalFocus: "present",
    motivationalDirection: "avoidance",
    certainty: "predictable",
    intensity: "medium",
    socialContext: "individual",
    cognitiveAppraisal: "negative",
    embodiment: "low",
  },
  Insecurity: {
    valence: "negative",
    arousal: "medium",
    dominance: "low",
    temporalFocus: "present",
    motivationalDirection: "avoidance",
    certainty: "uncertain",
    intensity: "medium",
    socialContext: "social",
    cognitiveAppraisal: "negative",
    embodiment: "medium",
  },
  Admiration: {
    valence: "positive",
    arousal: "low",
    dominance: "low",
    temporalFocus: "present",
    motivationalDirection: "approach",
    certainty: "predictable",
    intensity: "medium",
    socialContext: "social",
    cognitiveAppraisal: "positive",
    embodiment: "low",
  },
  Jealousy: {
    valence: "negative",
    arousal: "high",
    dominance: "low",
    temporalFocus: "present",
    motivationalDirection: "approach",
    certainty: "uncertain",
    intensity: "strong",
    socialContext: "social",
    cognitiveAppraisal: "negative",
    embodiment: "high",
  },
  Covetousness: {
    valence: "negative",
    arousal: "medium",
    dominance: "low",
    temporalFocus: "future",
    motivationalDirection: "approach",
    certainty: "uncertain",
    intensity: "medium",
    socialContext: "social",
    cognitiveAppraisal: "negative",
    embodiment: "medium",
  },
  // Common third-level and beyond
  Intimacy: {
    valence: "positive",
    arousal: "medium",
    dominance: "medium",
    temporalFocus: "present",
    motivationalDirection: "approach",
    certainty: "predictable",
    intensity: "strong",
    socialContext: "social",
    cognitiveAppraisal: "positive",
    embodiment: "high",
  },
  Defensiveness: {
    valence: "negative",
    arousal: "medium",
    dominance: "medium",
    temporalFocus: "present",
    motivationalDirection: "avoidance",
    certainty: "predictable",
    intensity: "medium",
    socialContext: "social",
    cognitiveAppraisal: "negative",
    embodiment: "medium",
  },
  Bitterness: {
    valence: "negative",
    arousal: "low",
    dominance: "low",
    temporalFocus: "past",
    motivationalDirection: "avoidance",
    certainty: "predictable",
    intensity: "medium",
    socialContext: "social",
    cognitiveAppraisal: "negative",
    embodiment: "low",
  },
  Grief: {
    valence: "negative",
    arousal: "medium",
    dominance: "low",
    temporalFocus: "past",
    motivationalDirection: "avoidance",
    certainty: "predictable",
    intensity: "strong",
    socialContext: "social",
    cognitiveAppraisal: "negative",
    embodiment: "high",
  },
  Abandonment: {
    valence: "negative",
    arousal: "high",
    dominance: "low",
    temporalFocus: "past",
    motivationalDirection: "avoidance",
    certainty: "predictable",
    intensity: "strong",
    socialContext: "social",
    cognitiveAppraisal: "negative",
    embodiment: "high",
  },
  Healing: {
    valence: "positive",
    arousal: "low",
    dominance: "medium",
    temporalFocus: "present",
    motivationalDirection: "approach",
    certainty: "predictable",
    intensity: "medium",
    socialContext: "individual",
    cognitiveAppraisal: "positive",
    embodiment: "medium",
  },
  Fury: {
    valence: "negative",
    arousal: "high",
    dominance: "high",
    temporalFocus: "present",
    motivationalDirection: "approach",
    certainty: "predictable",
    intensity: "strong",
    socialContext: "social",
    cognitiveAppraisal: "negative",
    embodiment: "high",
  },
  "Malicious Joy": {
    valence: "positive",
    arousal: "medium",
    dominance: "high",
    temporalFocus: "present",
    motivationalDirection: "approach",
    certainty: "predictable",
    intensity: "medium",
    socialContext: "social",
    cognitiveAppraisal: "negative",
    embodiment: "low",
  },
  Vindictiveness: {
    valence: "negative",
    arousal: "high",
    dominance: "high",
    temporalFocus: "future",
    motivationalDirection: "approach",
    certainty: "predictable",
    intensity: "strong",
    socialContext: "social",
    cognitiveAppraisal: "negative",
    embodiment: "high",
  },
  Release: {
    valence: "positive",
    arousal: "medium",
    dominance: "medium",
    temporalFocus: "present",
    motivationalDirection: "neutral",
    certainty: "predictable",
    intensity: "medium",
    socialContext: "individual",
    cognitiveAppraisal: "positive",
    embodiment: "medium",
  },
  Purification: {
    valence: "positive",
    arousal: "low",
    dominance: "medium",
    temporalFocus: "present",
    motivationalDirection: "approach",
    certainty: "predictable",
    intensity: "medium",
    socialContext: "individual",
    cognitiveAppraisal: "positive",
    embodiment: "low",
  },
  "Deep Love": {
    valence: "positive",
    arousal: "medium",
    dominance: "medium",
    temporalFocus: "present",
    motivationalDirection: "approach",
    certainty: "predictable",
    intensity: "strong",
    socialContext: "social",
    cognitiveAppraisal: "positive",
    embodiment: "high",
  },
  Bonding: {
    valence: "positive",
    arousal: "low",
    dominance: "medium",
    temporalFocus: "present",
    motivationalDirection: "approach",
    certainty: "predictable",
    intensity: "medium",
    socialContext: "social",
    cognitiveAppraisal: "positive",
    embodiment: "medium",
  },
  Connection: {
    valence: "positive",
    arousal: "low",
    dominance: "medium",
    temporalFocus: "present",
    motivationalDirection: "approach",
    certainty: "predictable",
    intensity: "medium",
    socialContext: "social",
    cognitiveAppraisal: "positive",
    embodiment: "low",
  },
  Sorrow: {
    valence: "negative",
    arousal: "low",
    dominance: "low",
    temporalFocus: "past",
    motivationalDirection: "avoidance",
    certainty: "predictable",
    intensity: "medium",
    socialContext: "individual",
    cognitiveAppraisal: "negative",
    embodiment: "low",
  },
  Bargaining: {
    valence: "neutral",
    arousal: "medium",
    dominance: "medium",
    temporalFocus: "future",
    motivationalDirection: "approach",
    certainty: "uncertain",
    intensity: "medium",
    socialContext: "individual",
    cognitiveAppraisal: "neutral",
    embodiment: "medium",
  },
  Denial: {
    valence: "neutral",
    arousal: "low",
    dominance: "medium",
    temporalFocus: "present",
    motivationalDirection: "avoidance",
    certainty: "uncertain",
    intensity: "weak",
    socialContext: "individual",
    cognitiveAppraisal: "neutral",
    embodiment: "low",
  },
  Peace: {
    valence: "positive",
    arousal: "low",
    dominance: "medium",
    temporalFocus: "present",
    motivationalDirection: "neutral",
    certainty: "predictable",
    intensity: "weak",
    socialContext: "individual",
    cognitiveAppraisal: "positive",
    embodiment: "low",
  },
  Contentment: {
    valence: "positive",
    arousal: "low",
    dominance: "medium",
    temporalFocus: "present",
    motivationalDirection: "neutral",
    certainty: "predictable",
    intensity: "medium",
    socialContext: "individual",
    cognitiveAppraisal: "positive",
    embodiment: "low",
  },
  // Higher level combinations
  Devotion: {
    valence: "positive",
    arousal: "low",
    dominance: "low",
    temporalFocus: "present",
    motivationalDirection: "approach",
    certainty: "predictable",
    intensity: "strong",
    socialContext: "social",
    cognitiveAppraisal: "positive",
    embodiment: "low",
  },
  Harmony: {
    valence: "positive",
    arousal: "low",
    dominance: "medium",
    temporalFocus: "present",
    motivationalDirection: "neutral",
    certainty: "predictable",
    intensity: "weak",
    socialContext: "social",
    cognitiveAppraisal: "positive",
    embodiment: "low",
  },
  Equanimity: {
    valence: "neutral",
    arousal: "low",
    dominance: "medium",
    temporalFocus: "present",
    motivationalDirection: "neutral",
    certainty: "predictable",
    intensity: "weak",
    socialContext: "individual",
    cognitiveAppraisal: "neutral",
    embodiment: "low",
  },
  Wrath: {
    valence: "negative",
    arousal: "high",
    dominance: "high",
    temporalFocus: "present",
    motivationalDirection: "approach",
    certainty: "predictable",
    intensity: "strong",
    socialContext: "social",
    cognitiveAppraisal: "negative",
    embodiment: "high",
  },
  Vengeance: {
    valence: "negative",
    arousal: "high",
    dominance: "high",
    temporalFocus: "future",
    motivationalDirection: "approach",
    certainty: "predictable",
    intensity: "strong",
    socialContext: "social",
    cognitiveAppraisal: "negative",
    embodiment: "high",
  },
  Nihilism: {
    valence: "negative",
    arousal: "low",
    dominance: "low",
    temporalFocus: "present",
    motivationalDirection: "avoidance",
    certainty: "predictable",
    intensity: "strong",
    socialContext: "individual",
    cognitiveAppraisal: "negative",
    embodiment: "low",
  },
  Hysteria: {
    valence: "negative",
    arousal: "high",
    dominance: "low",
    temporalFocus: "present",
    motivationalDirection: "avoidance",
    certainty: "uncertain",
    intensity: "strong",
    socialContext: "individual",
    cognitiveAppraisal: "negative",
    embodiment: "high",
  },
  Paranoia: {
    valence: "negative",
    arousal: "high",
    dominance: "low",
    temporalFocus: "future",
    motivationalDirection: "avoidance",
    certainty: "uncertain",
    intensity: "strong",
    socialContext: "social",
    cognitiveAppraisal: "negative",
    embodiment: "high",
  },
  Overwhelm: {
    valence: "negative",
    arousal: "high",
    dominance: "low",
    temporalFocus: "present",
    motivationalDirection: "avoidance",
    certainty: "uncertain",
    intensity: "strong",
    socialContext: "individual",
    cognitiveAppraisal: "negative",
    embodiment: "high",
  },
  Sadism: {
    valence: "positive",
    arousal: "high",
    dominance: "high",
    temporalFocus: "present",
    motivationalDirection: "approach",
    certainty: "predictable",
    intensity: "strong",
    socialContext: "social",
    cognitiveAppraisal: "negative",
    embodiment: "high",
  },
  Recovery: {
    valence: "positive",
    arousal: "low",
    dominance: "medium",
    temporalFocus: "present",
    motivationalDirection: "approach",
    certainty: "predictable",
    intensity: "medium",
    socialContext: "individual",
    cognitiveAppraisal: "positive",
    embodiment: "medium",
  },
  Restoration: {
    valence: "positive",
    arousal: "low",
    dominance: "medium",
    temporalFocus: "present",
    motivationalDirection: "approach",
    certainty: "predictable",
    intensity: "medium",
    socialContext: "individual",
    cognitiveAppraisal: "positive",
    embodiment: "low",
  },
  Oneness: {
    valence: "positive",
    arousal: "low",
    dominance: "low",
    temporalFocus: "present",
    motivationalDirection: "neutral",
    certainty: "predictable",
    intensity: "strong",
    socialContext: "social",
    cognitiveAppraisal: "positive",
    embodiment: "low",
  },
  Caution: {
    valence: "neutral",
    arousal: "low",
    dominance: "medium",
    temporalFocus: "future",
    motivationalDirection: "avoidance",
    certainty: "uncertain",
    intensity: "weak",
    socialContext: "individual",
    cognitiveAppraisal: "neutral",
    embodiment: "low",
  },
  Commitment: {
    valence: "positive",
    arousal: "low",
    dominance: "high",
    temporalFocus: "future",
    motivationalDirection: "approach",
    certainty: "predictable",
    intensity: "strong",
    socialContext: "social",
    cognitiveAppraisal: "positive",
    embodiment: "low",
  },
  Forgiveness: {
    valence: "positive",
    arousal: "low",
    dominance: "medium",
    temporalFocus: "past",
    motivationalDirection: "neutral",
    certainty: "predictable",
    intensity: "medium",
    socialContext: "social",
    cognitiveAppraisal: "positive",
    embodiment: "low",
  },
  Freedom: {
    valence: "positive",
    arousal: "medium",
    dominance: "high",
    temporalFocus: "present",
    motivationalDirection: "approach",
    certainty: "predictable",
    intensity: "strong",
    socialContext: "individual",
    cognitiveAppraisal: "positive",
    embodiment: "medium",
  },
  Lament: {
    valence: "negative",
    arousal: "high",
    dominance: "low",
    temporalFocus: "past",
    motivationalDirection: "avoidance",
    certainty: "predictable",
    intensity: "strong",
    socialContext: "social",
    cognitiveAppraisal: "negative",
    embodiment: "high",
  },
  Avoidance: {
    valence: "negative",
    arousal: "low",
    dominance: "low",
    temporalFocus: "present",
    motivationalDirection: "avoidance",
    certainty: "predictable",
    intensity: "weak",
    socialContext: "individual",
    cognitiveAppraisal: "negative",
    embodiment: "low",
  },
  Defiance: {
    valence: "negative",
    arousal: "high",
    dominance: "high",
    temporalFocus: "present",
    motivationalDirection: "approach",
    certainty: "predictable",
    intensity: "strong",
    socialContext: "social",
    cognitiveAppraisal: "negative",
    embodiment: "high",
  },
  Repression: {
    valence: "negative",
    arousal: "low",
    dominance: "high",
    temporalFocus: "past",
    motivationalDirection: "avoidance",
    certainty: "predictable",
    intensity: "medium",
    socialContext: "individual",
    cognitiveAppraisal: "negative",
    embodiment: "low",
  },
  Adoration: {
    valence: "positive",
    arousal: "low",
    dominance: "low",
    temporalFocus: "present",
    motivationalDirection: "approach",
    certainty: "predictable",
    intensity: "strong",
    socialContext: "social",
    cognitiveAppraisal: "positive",
    embodiment: "low",
  },
  Fidelity: {
    valence: "positive",
    arousal: "low",
    dominance: "medium",
    temporalFocus: "present",
    motivationalDirection: "approach",
    certainty: "predictable",
    intensity: "strong",
    socialContext: "social",
    cognitiveAppraisal: "positive",
    embodiment: "low",
  },
  Sacredness: {
    valence: "positive",
    arousal: "low",
    dominance: "low",
    temporalFocus: "present",
    motivationalDirection: "approach",
    certainty: "predictable",
    intensity: "strong",
    socialContext: "social",
    cognitiveAppraisal: "positive",
    embodiment: "low",
  },
  Tranquility: {
    valence: "positive",
    arousal: "low",
    dominance: "medium",
    temporalFocus: "present",
    motivationalDirection: "neutral",
    certainty: "predictable",
    intensity: "weak",
    socialContext: "individual",
    cognitiveAppraisal: "positive",
    embodiment: "low",
  },
  Stillness: {
    valence: "neutral",
    arousal: "low",
    dominance: "medium",
    temporalFocus: "present",
    motivationalDirection: "neutral",
    certainty: "predictable",
    intensity: "weak",
    socialContext: "individual",
    cognitiveAppraisal: "neutral",
    embodiment: "low",
  },
  Zen: {
    valence: "neutral",
    arousal: "low",
    dominance: "medium",
    temporalFocus: "present",
    motivationalDirection: "neutral",
    certainty: "predictable",
    intensity: "weak",
    socialContext: "individual",
    cognitiveAppraisal: "neutral",
    embodiment: "low",
  },
  // New feelings from recent additions
  Gratitude: {
    valence: "positive",
    arousal: "low",
    dominance: "medium",
    temporalFocus: "past",
    motivationalDirection: "approach",
    certainty: "predictable",
    intensity: "medium",
    socialContext: "social",
    cognitiveAppraisal: "positive",
    embodiment: "low",
  },
  Courage: {
    valence: "positive",
    arousal: "medium",
    dominance: "high",
    temporalFocus: "present",
    motivationalDirection: "approach",
    certainty: "predictable",
    intensity: "strong",
    socialContext: "individual",
    cognitiveAppraisal: "positive",
    embodiment: "medium",
  },
  Compassion: {
    valence: "positive",
    arousal: "low",
    dominance: "medium",
    temporalFocus: "present",
    motivationalDirection: "approach",
    certainty: "predictable",
    intensity: "medium",
    socialContext: "social",
    cognitiveAppraisal: "positive",
    embodiment: "medium",
  },
  Sympathy: {
    valence: "negative",
    arousal: "low",
    dominance: "low",
    temporalFocus: "present",
    motivationalDirection: "approach",
    certainty: "predictable",
    intensity: "medium",
    socialContext: "social",
    cognitiveAppraisal: "positive",
    embodiment: "low",
  },
  Kindness: {
    valence: "positive",
    arousal: "low",
    dominance: "medium",
    temporalFocus: "present",
    motivationalDirection: "approach",
    certainty: "predictable",
    intensity: "medium",
    socialContext: "social",
    cognitiveAppraisal: "positive",
    embodiment: "low",
  },
  Appreciation: {
    valence: "positive",
    arousal: "low",
    dominance: "low",
    temporalFocus: "present",
    motivationalDirection: "approach",
    certainty: "predictable",
    intensity: "medium",
    socialContext: "social",
    cognitiveAppraisal: "positive",
    embodiment: "low",
  },
  Valor: {
    valence: "positive",
    arousal: "high",
    dominance: "high",
    temporalFocus: "present",
    motivationalDirection: "approach",
    certainty: "predictable",
    intensity: "strong",
    socialContext: "individual",
    cognitiveAppraisal: "positive",
    embodiment: "high",
  },
  Tenderness: {
    valence: "positive",
    arousal: "low",
    dominance: "low",
    temporalFocus: "present",
    motivationalDirection: "approach",
    certainty: "predictable",
    intensity: "medium",
    socialContext: "social",
    cognitiveAppraisal: "positive",
    embodiment: "medium",
  },
  Solace: {
    valence: "positive",
    arousal: "low",
    dominance: "medium",
    temporalFocus: "present",
    motivationalDirection: "neutral",
    certainty: "predictable",
    intensity: "weak",
    socialContext: "social",
    cognitiveAppraisal: "positive",
    embodiment: "low",
  },
  Generosity: {
    valence: "positive",
    arousal: "low",
    dominance: "medium",
    temporalFocus: "present",
    motivationalDirection: "approach",
    certainty: "predictable",
    intensity: "medium",
    socialContext: "social",
    cognitiveAppraisal: "positive",
    embodiment: "low",
  },
  Bravery: {
    valence: "positive",
    arousal: "medium",
    dominance: "high",
    temporalFocus: "present",
    motivationalDirection: "approach",
    certainty: "uncertain",
    intensity: "strong",
    socialContext: "individual",
    cognitiveAppraisal: "positive",
    embodiment: "medium",
  },
  Heroism: {
    valence: "positive",
    arousal: "high",
    dominance: "high",
    temporalFocus: "present",
    motivationalDirection: "approach",
    certainty: "uncertain",
    intensity: "strong",
    socialContext: "social",
    cognitiveAppraisal: "positive",
    embodiment: "high",
  },
  Charity: {
    valence: "positive",
    arousal: "low",
    dominance: "medium",
    temporalFocus: "present",
    motivationalDirection: "approach",
    certainty: "predictable",
    intensity: "medium",
    socialContext: "social",
    cognitiveAppraisal: "positive",
    embodiment: "low",
  },
  Benevolence: {
    valence: "positive",
    arousal: "low",
    dominance: "medium",
    temporalFocus: "present",
    motivationalDirection: "approach",
    certainty: "predictable",
    intensity: "medium",
    socialContext: "social",
    cognitiveAppraisal: "positive",
    embodiment: "low",
  },
  Nobility: {
    valence: "positive",
    arousal: "low",
    dominance: "high",
    temporalFocus: "present",
    motivationalDirection: "approach",
    certainty: "predictable",
    intensity: "strong",
    socialContext: "social",
    cognitiveAppraisal: "positive",
    embodiment: "low",
  },
  Honor: {
    valence: "positive",
    arousal: "low",
    dominance: "high",
    temporalFocus: "present",
    motivationalDirection: "approach",
    certainty: "predictable",
    intensity: "strong",
    socialContext: "social",
    cognitiveAppraisal: "positive",
    embodiment: "low",
  },
  Integrity: {
    valence: "positive",
    arousal: "low",
    dominance: "high",
    temporalFocus: "present",
    motivationalDirection: "approach",
    certainty: "predictable",
    intensity: "strong",
    socialContext: "individual",
    cognitiveAppraisal: "positive",
    embodiment: "low",
  },
  Dignity: {
    valence: "positive",
    arousal: "low",
    dominance: "high",
    temporalFocus: "present",
    motivationalDirection: "neutral",
    certainty: "predictable",
    intensity: "medium",
    socialContext: "individual",
    cognitiveAppraisal: "positive",
    embodiment: "low",
  },
  Respect: {
    valence: "positive",
    arousal: "low",
    dominance: "low",
    temporalFocus: "present",
    motivationalDirection: "approach",
    certainty: "predictable",
    intensity: "medium",
    socialContext: "social",
    cognitiveAppraisal: "positive",
    embodiment: "low",
  },
};

// Dimension tooltips
const DIMENSION_TOOLTIPS: { [key in DimensionType]: string } = {
  valence:
    "Pleasure–Displeasure: The pleasantness or unpleasantness of an emotion. Positive emotions feel good, negative emotions feel bad.",
  arousal:
    "Activation: High ↔ Low energy or intensity. Example: Excitement (high) vs. calm (low).",
  dominance:
    "Control: Feeling in control ↔ Powerless. Example: Confident vs. helpless.",
  temporalFocus:
    "Temporal Focus: Past ↔ Present ↔ Future. Example: Nostalgia (past) vs. anticipation (future).",
  motivationalDirection:
    "Motivational Direction: Approach ↔ Avoidance. Example: Desire to connect vs. desire to escape.",
  certainty:
    "Certainty / Predictability: Predictable ↔ Uncertain / ambiguous. Example: Calm confidence vs. anxious uncertainty.",
  intensity:
    "Intensity / Strength: Weak ↔ Strong. Example: Mild contentment vs. ecstatic joy.",
  socialContext:
    "Social / Interpersonal Context: Social / relational ↔ Individual / internal. Example: Affection (toward others) vs. personal pride.",
  cognitiveAppraisal:
    "Cognitive Appraisal / Meaning: Positive interpretation ↔ Negative interpretation. Significance or relevance of the feeling.",
  embodiment:
    "Embodiment / Somatic Awareness: Awareness of bodily sensations associated with the feeling. Example: Heart racing (excitement) vs. relaxed muscles (calm).",
};

// Dimension value options
const DIMENSION_VALUES: { [key in DimensionType]: string[] } = {
  valence: ["positive", "negative", "neutral"],
  arousal: ["high", "medium", "low"],
  dominance: ["high", "medium", "low"],
  temporalFocus: ["past", "present", "future"],
  motivationalDirection: ["approach", "avoidance", "neutral"],
  certainty: ["predictable", "uncertain", "ambiguous"],
  intensity: ["weak", "medium", "strong"],
  socialContext: ["social", "individual"],
  cognitiveAppraisal: ["positive", "negative", "neutral"],
  embodiment: ["high", "medium", "low"],
};

// Helper function to format dimension name for display
const getDimensionDisplayName = (dimension: DimensionType): string => {
  const nameMap: { [key in DimensionType]: string } = {
    valence: "Valence",
    arousal: "Arousal",
    dominance: "Dominance",
    temporalFocus: "Temporal Focus",
    motivationalDirection: "Motivational Direction",
    certainty: "Certainty",
    intensity: "Intensity",
    socialContext: "Social Context",
    cognitiveAppraisal: "Cognitive Appraisal",
    embodiment: "Embodiment",
  };
  return nameMap[dimension];
};

// Helper function to get display label for dimension value
const getDimensionValueLabel = (
  dimension: DimensionType,
  value: string
): string => {
  // Special cases for values that appear in multiple dimensions
  const labelMap: { [key: string]: { [dim: string]: string } } = {
    positive: {
      valence: "Positive",
      cognitiveAppraisal: "Positive",
    },
    negative: {
      valence: "Negative",
      cognitiveAppraisal: "Negative",
    },
    neutral: {
      valence: "Neutral",
      motivationalDirection: "Neutral",
      cognitiveAppraisal: "Neutral",
    },
    high: {
      arousal: "High",
      dominance: "High",
      embodiment: "High",
    },
    medium: {
      arousal: "Medium",
      dominance: "Medium",
      intensity: "Medium",
      embodiment: "Medium",
    },
    low: {
      arousal: "Low",
      dominance: "Low",
      embodiment: "Low",
    },
    approach: { motivationalDirection: "Approach" },
    avoidance: { motivationalDirection: "Avoidance" },
    past: { temporalFocus: "Past" },
    present: { temporalFocus: "Present" },
    future: { temporalFocus: "Future" },
    predictable: { certainty: "Predictable" },
    uncertain: { certainty: "Uncertain" },
    ambiguous: { certainty: "Ambiguous" },
    weak: { intensity: "Weak" },
    strong: { intensity: "Strong" },
    social: { socialContext: "Social" },
    individual: { socialContext: "Individual" },
  };

  if (labelMap[value] && labelMap[value][dimension]) {
    return labelMap[value][dimension];
  }

  // Fallback: capitalize first letter
  return value.charAt(0).toUpperCase() + value.slice(1);
};

// Helper function to infer dimension value from base components
const inferDimensionFromComponents = (
  baseComponents: string[],
  dimension: DimensionType
): string | null => {
  if (baseComponents.length === 0) return null;

  const values = baseComponents
    .map((comp) => EMOTION_DIMENSIONS[comp]?.[dimension])
    .filter((v): v is string => v !== undefined);

  if (values.length === 0) return null;

  // Special inference logic for different dimensions
  switch (dimension) {
    case "valence":
      // If all positive -> positive, all negative -> negative, mixed -> neutral
      const allPositive = values.every((v) => v === "positive");
      const allNegative = values.every((v) => v === "negative");
      if (allPositive) return "positive";
      if (allNegative) return "negative";
      return "neutral";

    case "arousal":
    case "dominance":
    case "intensity":
    case "embodiment":
      // For ordinal dimensions, take the highest value
      if (values.includes("high")) return "high";
      if (values.includes("medium")) return "medium";
      if (values.includes("low")) return "low";
      return values[0];

    case "temporalFocus":
      // Prefer present, then future, then past
      if (values.includes("present")) return "present";
      if (values.includes("future")) return "future";
      if (values.includes("past")) return "past";
      return values[0];

    case "motivationalDirection":
      // If all approach -> approach, all avoidance -> avoidance, mixed -> neutral
      const allApproach = values.every((v) => v === "approach");
      const allAvoidance = values.every((v) => v === "avoidance");
      if (allApproach) return "approach";
      if (allAvoidance) return "avoidance";
      return "neutral";

    case "certainty":
      // If any uncertain -> uncertain, else predictable
      if (values.includes("uncertain") || values.includes("ambiguous"))
        return "uncertain";
      return "predictable";

    case "socialContext":
      // If any social -> social, else individual
      if (values.includes("social")) return "social";
      return "individual";

    case "cognitiveAppraisal":
      // If all positive -> positive, all negative -> negative, mixed -> neutral
      const allPos = values.every((v) => v === "positive");
      const allNeg = values.every((v) => v === "negative");
      if (allPos) return "positive";
      if (allNeg) return "negative";
      return "neutral";

    default:
      return values[0];
  }
};

// Helper function to get emotion dimension value
const getEmotionDimension = (
  emotion: string,
  dimension: DimensionType
): string | null => {
  // Check direct mapping first
  if (EMOTION_DIMENSIONS[emotion] && EMOTION_DIMENSIONS[emotion][dimension]) {
    return EMOTION_DIMENSIONS[emotion][dimension] || null;
  }

  // For combined emotions, infer from base components
  const baseComponents = getBaseEmotionComponents(emotion);
  if (baseComponents.length > 0) {
    return inferDimensionFromComponents(baseComponents, dimension);
  }

  return null;
};

// Use graph for combination lookup
const getEmotionCombination = (
  emotion1: string,
  emotion2: string
): string | null => {
  return emotionGraph.getCombination(emotion1, emotion2);
};

// Use graph for base components lookup
const getBaseEmotionComponents = (emotion: string): string[] => {
  return emotionGraph.getBaseComponents(emotion);
};

// Function to generate CSS gradient from base emotion ratios
// Gradient stops are positioned based on the actual composition percentages
// Creates a smooth gradient where each color occupies space proportional to its ratio
const generateGradientFromRatios = (
  ratios: Array<{ emotion: string; ratio: number }>
): string => {
  if (ratios.length === 0) return "linear-gradient(135deg, #667eea, #764ba2)";
  if (ratios.length === 1) {
    return BASE_EMOTION_COLORS[ratios[0].emotion] || "#667eea";
  }

  // Sort by ratio (descending) to ensure proper gradient order
  const sortedRatios = [...ratios].sort((a, b) => b.ratio - a.ratio);

  // Create smooth gradient stops - CSS naturally blends between stops
  // Each color transitions smoothly at percentage boundaries
  const stops: string[] = [];
  let cumulative = 0;

  sortedRatios.forEach(({ emotion, ratio }, index) => {
    const color = BASE_EMOTION_COLORS[emotion] || "#667eea";
    const endPercent = cumulative + ratio * 100;

    if (index === 0) {
      // First color starts at 0%
      stops.push(`${color} 0%`);
    }

    // Add stop at the boundary - CSS will smoothly blend to next color
    if (index === sortedRatios.length - 1) {
      // Last color at 100%
      stops.push(`${color} 100%`);
    } else {
      // Add color at boundary, next color will start blending here
      stops.push(`${color} ${endPercent}%`);
    }

    cumulative = endPercent;
  });

  return `linear-gradient(135deg, ${stops.join(", ")})`;
};

// Calculate base emotion ratios by counting contributions in decomposition paths
// Uses weighted counting where contributions are weighted by path depth
const getBaseEmotionRatios = (
  emotion: string
): Array<{ emotion: string; ratio: number }> => {
  if (BASE_EMOTIONS.includes(emotion)) {
    return [{ emotion, ratio: 1 }];
  }

  // Count weighted contributions of each base emotion
  // Weight decreases with depth to prioritize direct contributions
  const counts = new Map<string, number>();
  const maxDepth = 10; // Prevent infinite recursion

  const countContributions = (
    current: string,
    depth: number = 0,
    weight: number = 1.0
  ): void => {
    if (depth > maxDepth) return;

    if (BASE_EMOTIONS.includes(current)) {
      // Base emotion: add weighted contribution
      counts.set(current, (counts.get(current) || 0) + weight);
      return;
    }

    const parents = emotionGraph.getParents(current);
    if (parents.length === 0) return;

    // For each parent pair, split weight equally and recurse
    // Use first parent pair (most direct path)
    const [p1, p2] = parents[0];
    const childWeight = weight * 0.5; // Split weight between two parents

    countContributions(p1, depth + 1, childWeight);
    countContributions(p2, depth + 1, childWeight);
  };

  countContributions(emotion, 0, 1.0);

  // Convert to ratios
  const total = Array.from(counts.values()).reduce(
    (sum, count) => sum + count,
    0
  );
  if (total === 0) {
    // Fallback: equal distribution among base components
    const baseComponents = getBaseEmotionComponents(emotion);
    return baseComponents.map((comp) => ({
      emotion: comp,
      ratio: 1 / baseComponents.length,
    }));
  }

  return Array.from(counts.entries())
    .map(([emotion, count]) => ({ emotion, ratio: count / total }))
    .sort((a, b) => b.ratio - a.ratio);
};

// Helper function to render a single shape
const renderSingleShape = (
  shape: string,
  fill: string,
  stroke: string,
  strokeWidth: number,
  opacity: number = 1,
  transform?: string,
  emotion?: string
) => {
  const style = { fill, stroke, strokeWidth, opacity };

  switch (shape) {
    case "circle":
      return <circle cx="12" cy="12" r="8" {...style} />;
    case "square":
      return (
        <rect
          x="6"
          y="6"
          width="12"
          height="12"
          {...style}
          transform={transform}
        />
      );
    case "triangleDown":
      return <path d="M12 4 L20 20 L4 20 Z" {...style} transform={transform} />;
    case "star":
      return (
        <path
          d="M12 2 L14.5 8.5 L21 9.5 L16 14 L17.5 20.5 L12 17 L6.5 20.5 L8 14 L3 9.5 L9.5 8.5 Z"
          {...style}
          transform={transform}
        />
      );
    case "droplet":
      // Scale up droplet to match other shapes better
      const dropletScale = 1.25;
      const baseTransform = transform || "";

      if (emotion === "Sadness") {
        // For sadness: fatter teardrop shape, scale up, center, then flip vertically
        return (
          <g
            transform={`translate(12, 12) scale(${dropletScale}) translate(-12, -12) ${baseTransform} scale(1, -1) translate(0, -24)`}
          >
            <path
              d="M12 2 C9 2 7 4 7 6.5 C7 9 8.5 11.5 10.5 13.5 C11.2 14.5 12 15 12 20 C12 15 12.8 14.5 13.5 13.5 C15.5 11.5 17 9 17 6.5 C17 4 15 2 12 2 Z"
              {...style}
            />
          </g>
        );
      } else {
        // For other emotions using droplet: just scale up
        return (
          <g
            transform={`translate(12, 12) scale(${dropletScale}) translate(-12, -12) ${baseTransform}`}
          >
            <path
              d="M12 2 C10 2 8.5 4 8.5 6.5 C8.5 9 9.5 11.5 11 13.5 C11.5 14.5 12 15 12 20 C12 15 12.5 14.5 13 13.5 C14.5 11.5 15.5 9 15.5 6.5 C15.5 4 14 2 12 2 Z"
              {...style}
            />
          </g>
        );
      }
    case "hexagon":
      // Larger, more prominent regular hexagon with radius ~9.5
      return (
        <path
          d="M12 2.5 L19.8 7.2 L19.8 16.8 L12 21.5 L4.2 16.8 L4.2 7.2 Z"
          {...style}
          transform={transform}
        />
      );
    case "triangleUp":
      return <path d="M12 20 L4 4 L20 4 Z" {...style} transform={transform} />;
    case "diamond":
      return (
        <path
          d="M12 2 L22 12 L12 22 L2 12 Z"
          {...style}
          transform={transform}
        />
      );
    case "oval":
      // Horizontal oval (wider than tall)
      return (
        <ellipse
          cx="12"
          cy="12"
          rx="10"
          ry="7"
          {...style}
          transform={transform}
        />
      );
    default:
      return null;
  }
};

// EmotionShape component to render shape icons for base emotions
interface EmotionShapeProps {
  emotion: string;
  color: string;
  size?: number;
}

const EmotionShape = ({ emotion, color, size = 16 }: EmotionShapeProps) => {
  const shape = BASE_EMOTION_SHAPES[emotion];
  if (!shape) return null;

  const viewBox = "0 0 24 24";
  const fill = color;
  const stroke = color;
  const strokeWidth = 1.5;

  return (
    <svg
      width={size}
      height={size}
      viewBox={viewBox}
      className="emotion-shape-icon"
      style={{ flexShrink: 0 }}
    >
      {renderSingleShape(
        shape,
        fill,
        stroke,
        strokeWidth,
        1,
        undefined,
        emotion
      )}
    </svg>
  );
};

// BlendedEmotionShape component to render blended shapes for mixed emotions
interface BlendedEmotionShapeProps {
  emotion: string;
  color: string;
  size?: number;
}

const BlendedEmotionShape = ({
  emotion,
  color,
  size = 16,
}: BlendedEmotionShapeProps) => {
  const ratios = getBaseEmotionRatios(emotion);
  if (ratios.length === 0) return null;

  const viewBox = "0 0 24 24";
  const strokeWidth = 1.5;

  // Get dominant emotion (first in sorted ratios)
  const dominant = ratios[0];
  const dominantShape = BASE_EMOTION_SHAPES[dominant.emotion];
  if (!dominantShape) return null;

  // Get dominant color
  const dominantColor = BASE_EMOTION_COLORS[dominant.emotion] || color;

  // Render dominant shape as base
  const dominantFill = dominantColor;
  const dominantStroke = dominantColor;

  return (
    <svg
      width={size}
      height={size}
      viewBox={viewBox}
      className="emotion-shape-icon"
      style={{ flexShrink: 0 }}
    >
      {/* Render dominant shape at full opacity */}
      {renderSingleShape(
        dominantShape,
        dominantFill,
        dominantStroke,
        strokeWidth,
        1,
        undefined,
        dominant.emotion
      )}

      {/* Render secondary shapes with reduced opacity based on ratio */}
      {ratios.slice(1).map((ratioData, index) => {
        const shape = BASE_EMOTION_SHAPES[ratioData.emotion];
        if (!shape || ratioData.ratio < 0.1) return null; // Skip very small contributions

        const secondaryColor = BASE_EMOTION_COLORS[ratioData.emotion] || color;
        // Opacity based on ratio, with minimum of 0.2 and maximum of 0.6 for secondary shapes
        const opacity = Math.max(0.2, Math.min(0.6, ratioData.ratio * 2));

        // Offset secondary shapes slightly for visual blending
        const offsetX = (index % 2 === 0 ? 1 : -1) * (ratioData.ratio * 2);
        const offsetY = (index % 3 === 0 ? 1 : -1) * (ratioData.ratio * 1.5);
        const transform = `translate(${offsetX}, ${offsetY})`;

        return (
          <g key={ratioData.emotion} opacity={opacity}>
            {renderSingleShape(
              shape,
              secondaryColor,
              secondaryColor,
              strokeWidth,
              1,
              transform,
              ratioData.emotion
            )}
          </g>
        );
      })}
    </svg>
  );
};

type FilterType = "emotion" | "feeling" | "state" | "all";

export const App = () => {
  const [discoveredEmotions, setDiscoveredEmotions] = useState<Set<string>>(
    new Set(BASE_EMOTIONS)
  );
  const [craftingSlots, setCraftingSlots] = useState<string[]>([]);
  const [lastResult, setLastResult] = useState<string | null>(null);
  const [lastCombination, setLastCombination] = useState<string[]>([]);
  const [isNewDiscovery, setIsNewDiscovery] = useState(false);
  const [totalDiscoveries, setTotalDiscoveries] = useState(
    BASE_EMOTIONS.length
  );
  const [highlightedEmotion, setHighlightedEmotion] = useState<string | null>(
    null
  );
  const [combinableEmotions, setCombinableEmotions] = useState<Set<string>>(
    new Set()
  );
  const [unexploredEmotions, setUnexploredEmotions] = useState<Set<string>>(
    new Set()
  );
  const [hoveredEmotion, setHoveredEmotion] = useState<string | null>(null);
  const [triedCombinations, setTriedCombinations] = useState<Set<string>>(
    new Set()
  );
  const [hasAttemptedCombine, setHasAttemptedCombine] = useState(false);
  const [showLegendPopover, setShowLegendPopover] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isCombining, setIsCombining] = useState(false);
  const [selectedDimensionValues, setSelectedDimensionValues] = useState<{
    [dimension in DimensionType]?: string;
  }>({});
  const [hoveredDimension, setHoveredDimension] =
    useState<DimensionType | null>(null);
  const [dimensionsExpanded, setDimensionsExpanded] = useState(false);
  const [typeFilter, setTypeFilter] = useState<FilterType>("all");
  const [hoveredTypeFilter, setHoveredTypeFilter] = useState(false);
  const [hoveredEmotionsLabel, setHoveredEmotionsLabel] = useState(false);
  const [hoveredFeelingsLabel, setHoveredFeelingsLabel] = useState(false);
  const autoCombineTriggered = useRef(false);
  const craftingAreaRef = useRef<HTMLDivElement>(null);
  const resultDisplayRef = useRef<HTMLDivElement>(null);
  const [recentlyAddedEmotion, setRecentlyAddedEmotion] = useState<string | null>(null);
  const [mode, setMode] = useState<"view" | "craft">("craft");

  // Categorize an item as emotion, feeling, or state based on its description
  const getItemType = (item: string): "emotion" | "feeling" | "state" => {
    // Only the 6 base emotions are "emotion"
    if (BASE_EMOTIONS.includes(item)) {
      return "emotion";
    }

    const description = getFeelingDescription(item).toLowerCase();

    // Check if description mentions "state" (and not just "feeling or state")
    if (
      description.includes(" state ") ||
      description.includes("state of") ||
      description.startsWith("the state")
    ) {
      return "state";
    }

    // Check if description mentions "feeling"
    if (description.includes("feeling") || description.includes("feelings")) {
      return "feeling";
    }

    // Default to feeling for others (since they're not base emotions)
    return "feeling";
  };

  const toggleDimensionValue = (dimension: DimensionType, value: string) => {
    const newSelected = { ...selectedDimensionValues };
    // If clicking the same value, deselect it. Otherwise, select this value (deselecting any other value in this dimension)
    if (newSelected[dimension] === value) {
      delete newSelected[dimension];
    } else {
      newSelected[dimension] = value;
    }
    setSelectedDimensionValues(newSelected);
  };

  const getSelectedCount = () => {
    return Object.keys(selectedDimensionValues).length;
  };

  const inferTriedCombinations = (emotions: Set<string>): Set<string> => {
    const inferred = new Set<string>();
    const allEmotions = Array.from(emotions);

    // For each discovered emotion, find what combinations could have created it
    for (const emotion of allEmotions) {
      // Skip base emotions
      if (BASE_EMOTIONS.includes(emotion)) continue;

      // Check all pairs of discovered emotions to see if they combine to this emotion
      for (let i = 0; i < allEmotions.length; i++) {
        for (let j = i + 1; j < allEmotions.length; j++) {
          const result = getEmotionCombination(allEmotions[i], allEmotions[j]);
          if (result === emotion) {
            // Mark both directions as tried
            inferred.add(`${allEmotions[i]}+${allEmotions[j]}`);
            inferred.add(`${allEmotions[j]}+${allEmotions[i]}`);
          }
        }
      }
    }

    return inferred;
  };

  useEffect(() => {
    // Load from localStorage
    const saved = localStorage.getItem("discoveredEmotions");
    if (saved) {
      const parsed = JSON.parse(saved) as string[];
      const discoveredSet = new Set(parsed);
      setDiscoveredEmotions(discoveredSet);
      setTotalDiscoveries(parsed.length);

      // Infer tried combinations from discovered emotions
      const inferred = inferTriedCombinations(discoveredSet);

      // Load saved tried combinations and merge with inferred
      const savedCombinations = localStorage.getItem("triedCombinations");
      if (savedCombinations) {
        const parsedCombinations = JSON.parse(savedCombinations) as string[];
        const savedSet = new Set(parsedCombinations);
        // Merge inferred and saved
        const merged = new Set([...inferred, ...savedSet]);
        setTriedCombinations(merged);
        localStorage.setItem(
          "triedCombinations",
          JSON.stringify(Array.from(merged))
        );
      } else {
        // Just use inferred if nothing saved
        setTriedCombinations(inferred);
        localStorage.setItem(
          "triedCombinations",
          JSON.stringify(Array.from(inferred))
        );
      }
    } else {
      const savedCombinations = localStorage.getItem("triedCombinations");
      if (savedCombinations) {
        const parsed = JSON.parse(savedCombinations) as string[];
        setTriedCombinations(new Set(parsed));
      }
    }
  }, []);

  const saveDiscoveries = (emotions: Set<string>) => {
    const array = Array.from(emotions);
    localStorage.setItem("discoveredEmotions", JSON.stringify(array));
    setTotalDiscoveries(array.length);
  };

  const getCombinableEmotions = (
    emotion: string
  ): { combinable: Set<string>; unexplored: Set<string> } => {
    const combinable = new Set<string>();
    const unexplored = new Set<string>();
    const allEmotions = Array.from(discoveredEmotions);

    for (const otherEmotion of allEmotions) {
      if (otherEmotion !== emotion) {
        const result = getEmotionCombination(emotion, otherEmotion);
        if (result) {
          combinable.add(otherEmotion);
          // Check if this combination has been tried
          const comboKey1 = `${emotion}+${otherEmotion}`;
          const comboKey2 = `${otherEmotion}+${emotion}`;
          if (
            !triedCombinations.has(comboKey1) &&
            !triedCombinations.has(comboKey2)
          ) {
            unexplored.add(otherEmotion);
          }
        }
      }
    }

    return { combinable, unexplored };
  };

  // Get emotions that will result in a valid feeling when combined with items in crafting slots
  const getCombinableEmotionsWithAll = (
    slots: string[]
  ): { combinable: Set<string>; unexplored: Set<string> } => {
    if (slots.length === 0) {
      return { combinable: new Set(), unexplored: new Set() };
    }

    const allEmotions = Array.from(discoveredEmotions);
    const combinable = new Set<string>();
    const unexplored = new Set<string>();

    // Find emotions that, when added to slots, will result in a valid combination
    for (const otherEmotion of allEmotions) {
      // Skip if this emotion is already in slots
      if (slots.includes(otherEmotion)) continue;

      // Check if adding this emotion to the slots would result in a valid combination
      const testSlots = [...slots, otherEmotion];
      const result = combineMultipleEmotions(testSlots);
      
      // Only add if result is valid and not circular (result is not one of the inputs)
      if (result && !testSlots.includes(result)) {
        combinable.add(otherEmotion);
        
        // Check if any combination in the path is unexplored
        let hasUnexplored = false;
        // Check combinations between the new emotion and each slot item
        for (const slotEmotion of slots) {
          const comboKey1 = `${slotEmotion}+${otherEmotion}`;
          const comboKey2 = `${otherEmotion}+${slotEmotion}`;
          if (
            !triedCombinations.has(comboKey1) &&
            !triedCombinations.has(comboKey2)
          ) {
            hasUnexplored = true;
            break;
          }
        }
        
        if (hasUnexplored) {
          unexplored.add(otherEmotion);
        }
      }
    }

    return { combinable, unexplored };
  };

  const handleEmotionClick = (emotion: string, event?: React.MouseEvent) => {
    // Check if right-click or modifier key (Cmd/Ctrl) is pressed (overrides mode)
    const isViewDetails = event?.button === 2 || 
                          event?.ctrlKey || 
                          event?.metaKey;
    
    if (isViewDetails) {
      event?.preventDefault();
      viewFeelingDetails(emotion);
      return;
    }
    
    // Check current mode
    if (mode === "view") {
      viewFeelingDetails(emotion);
      return;
    }
    
    // Craft mode: Add emotion to crafting slots
    const newSlots = [...craftingSlots, emotion];
    setCraftingSlots(newSlots);
    setLastResult(null);
    setLastCombination([]);
    setHasAttemptedCombine(false);

    // Set recently added for animation
    setRecentlyAddedEmotion(emotion);
    setTimeout(() => setRecentlyAddedEmotion(null), 600);

    // Scroll to crafting area smoothly
    setTimeout(() => {
      craftingAreaRef.current?.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'nearest' 
      });
    }, 100);

    // Reset auto-combine trigger when adding first emotion
    if (craftingSlots.length === 0) {
      autoCombineTriggered.current = false;
    }

    // Highlight combinable emotions - show emotions that combine with ALL items in slots
    const { combinable, unexplored } = getCombinableEmotionsWithAll(newSlots);
    setCombinableEmotions(combinable);
    setUnexploredEmotions(unexplored);
    // Set highlighted to show we have items selected (but don't highlight a single emotion)
    if (newSlots.length > 0) {
      setHighlightedEmotion(newSlots[0]); // Use first slot as marker, but we'll show all slots in hint
    }
  };

  const handleEmotionHover = (emotion: string) => {
    setHoveredEmotion(emotion);
    // When hovering, show what combines with the hovered emotion
    // But if we have crafting slots, restore to showing what combines with all slots when leaving
  };

  const handleEmotionLeave = () => {
    setHoveredEmotion(null);
    // Restore combinable emotions based on crafting slots when hover ends
    if (craftingSlots.length > 0) {
      const { combinable, unexplored } = getCombinableEmotionsWithAll(craftingSlots);
      setCombinableEmotions(combinable);
      setUnexploredEmotions(unexplored);
    }
  };

  const getFeelingDescription = (emotion: string): string => {
    return (
      FEELING_DESCRIPTIONS[emotion] ||
      "A feeling discovered through combination."
    );
  };

  const clearHighlight = () => {
    setCraftingSlots([]);
    setHighlightedEmotion(null);
    setCombinableEmotions(new Set());
    setUnexploredEmotions(new Set());
  };

  // View feeling details without crafting
  const viewFeelingDetails = (emotion: string) => {
    // Find the parent combination that created this feeling
    const parents = emotionGraph.getParents(emotion);
    let combination: string[] = [];
    
    if (parents.length > 0) {
      // Use the first parent pair (most direct combination)
      const [parent1, parent2] = parents[0];
      combination = [parent1, parent2];
    } else if (BASE_EMOTIONS.includes(emotion)) {
      // Base emotions don't have parents, so no combination to show
      combination = [];
    }
    
    // Set the result display
    setLastResult(emotion);
    setLastCombination(combination);
    setIsNewDiscovery(false);
    
    // Clear crafting slots to show this is a view, not a craft
    setCraftingSlots([]);
    setHasAttemptedCombine(false);
    
    // Scroll to result display
    setTimeout(() => {
      resultDisplayRef.current?.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'nearest' 
      });
    }, 100);
  };

  const combineMultipleEmotions = (emotions: string[]): string | null => {
    if (emotions.length < 2) return null;
    if (emotions.length === 2) {
      const result = getEmotionCombination(emotions[0], emotions[1]);
      // Prevent circular combinations: result cannot be one of the inputs
      if (result && emotions.includes(result)) {
        return null;
      }
      return result;
    }

    // For multiple emotions, combine them pairwise recursively
    let current = emotions[0];
    for (let i = 1; i < emotions.length; i++) {
      const result = getEmotionCombination(current, emotions[i]);
      if (result) {
        // Prevent circular combinations: intermediate or final result cannot be one of the inputs
        if (emotions.includes(result)) {
          return null;
        }
        current = result;
      } else {
        // If combination fails, return null instead of continuing
        return null;
      }
    }

    // Final check: ensure result is not one of the original inputs
    if (emotions.includes(current)) {
      return null;
    }

    return current;
  };

  const handleCombine = async () => {
    if (craftingSlots.length < 2) {
      return;
    }

    // Prevent multiple simultaneous combines
    if (isCombining) {
      return;
    }

    setIsCombining(true);
    setHasAttemptedCombine(true);
    setLastResult(null);
    setIsNewDiscovery(false);

    // Simulate processing time for better UX
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Try to combine all emotions
    const result = combineMultipleEmotions(craftingSlots);

    // Additional check: prevent circular combinations (result cannot be one of the inputs)
    if (result && !craftingSlots.includes(result)) {
      const wasNew = !discoveredEmotions.has(result);
      const newDiscovered = new Set(discoveredEmotions);
      newDiscovered.add(result);
      setDiscoveredEmotions(newDiscovered);
      setLastResult(result);
      setLastCombination([...craftingSlots]); // Store what was combined
      setIsNewDiscovery(wasNew);
      saveDiscoveries(newDiscovered);

      // Track tried combinations
      const newTried = new Set(triedCombinations);
      for (let i = 0; i < craftingSlots.length - 1; i++) {
        for (let j = i + 1; j < craftingSlots.length; j++) {
          newTried.add(`${craftingSlots[i]}+${craftingSlots[j]}`);
          newTried.add(`${craftingSlots[j]}+${craftingSlots[i]}`);
        }
      }

      // Also infer combinations from the new result
      const newDiscoveredSet = new Set([...discoveredEmotions, result]);
      const inferred = inferTriedCombinations(newDiscoveredSet);
      const merged = new Set([...newTried, ...inferred]);

      setTriedCombinations(merged);
      localStorage.setItem(
        "triedCombinations",
        JSON.stringify(Array.from(merged))
      );

      if (wasNew) {
        setTotalDiscoveries((prev) => prev + 1);
      }

      setIsCombining(false);

      // Clear slots immediately after combining
      setCraftingSlots([]);
      clearHighlight();
      setHasAttemptedCombine(false);
      autoCombineTriggered.current = false;
    } else {
      setLastResult(null);
      setLastCombination([]);
      setIsNewDiscovery(false);
      setIsCombining(false);
    }
  };

  const removeSlot = (index: number) => {
    const newSlots = craftingSlots.filter((_, i) => i !== index);
    setCraftingSlots(newSlots);
    setLastResult(null);
    setLastCombination([]);
    setHasAttemptedCombine(false);
    autoCombineTriggered.current = false;
    if (newSlots.length === 0) {
      clearHighlight();
    }
  };

  const clearAll = () => {
    setCraftingSlots([]);
    setLastResult(null);
    setLastCombination([]);
    setIsNewDiscovery(false);
    setHasAttemptedCombine(false);
    autoCombineTriggered.current = false;
    clearHighlight();
  };

  useEffect(() => {
    if (craftingSlots.length === 0) {
      setHighlightedEmotion(null);
      setCombinableEmotions(new Set());
      setUnexploredEmotions(new Set());
    } else {
      // Update combinable emotions when crafting slots change
      const { combinable, unexplored } = getCombinableEmotionsWithAll(craftingSlots);
      setCombinableEmotions(combinable);
      setUnexploredEmotions(unexplored);
      if (!highlightedEmotion) {
        setHighlightedEmotion(craftingSlots[0]); // Use first slot as marker
      }
    }
  }, [craftingSlots.length, craftingSlots.join(",")]);

  // Auto-combine disabled - user must manually click combine button
  // useEffect(() => {
  //   if (
  //     craftingSlots.length === 2 &&
  //     !isCombining &&
  //     !hasAttemptedCombine &&
  //     !lastResult &&
  //     !autoCombineTriggered.current
  //   ) {
  //     autoCombineTriggered.current = true;
  //     handleCombine();
  //   }
  //   // Reset trigger when slots are cleared
  //   if (craftingSlots.length === 0) {
  //     autoCombineTriggered.current = false;
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [craftingSlots.length]);

  const resetProgress = () => {
    if (
      confirm(
        "Are you sure you want to reset all discoveries? This cannot be undone."
      )
    ) {
      setDiscoveredEmotions(new Set(BASE_EMOTIONS));
      saveDiscoveries(new Set(BASE_EMOTIONS));
      setTriedCombinations(new Set());
      localStorage.removeItem("triedCombinations");
      clearAll();
    }
  };

  const getEmotionColor = (emotion: string) => {
    // Base emotions return their solid color
    if (BASE_EMOTIONS.includes(emotion)) {
      return BASE_EMOTION_COLORS[emotion] || "#667eea";
    }

    // Combined emotions get gradients from their base emotion ratios
    const ratios = getBaseEmotionRatios(emotion);
    if (ratios.length > 0) {
      return generateGradientFromRatios(ratios);
    }

    // Fallback for emotions that can't be traced
    return "#667eea";
  };

  // Helper function to get a solid color for borders (uses first base emotion or average)
  const getEmotionBorderColor = (emotion: string) => {
    if (BASE_EMOTIONS.includes(emotion)) {
      return BASE_EMOTION_COLORS[emotion] || "#667eea";
    }

    const baseComponents = getBaseEmotionComponents(emotion);
    if (baseComponents.length > 0) {
      return BASE_EMOTION_COLORS[baseComponents[0]] || "#667eea";
    }

    return "#667eea";
  };

  const hasCombinableOptions = (emotion: string): boolean => {
    const allEmotions = Array.from(discoveredEmotions);
    for (const otherEmotion of allEmotions) {
      if (otherEmotion !== emotion) {
        const result = getEmotionCombination(emotion, otherEmotion);
        if (result) {
          return true;
        }
      }
    }
    return false;
  };

  const getUndiscoveredEmotions = (emotion: string): string[] => {
    const undiscovered: string[] = [];
    const allEmotions = Array.from(discoveredEmotions);

    for (const otherEmotion of allEmotions) {
      if (otherEmotion !== emotion) {
        const result = getEmotionCombination(emotion, otherEmotion);
        if (result && !discoveredEmotions.has(result)) {
          undiscovered.push(result);
        }
      }
    }

    return undiscovered;
  };

  const allEmotions = Array.from(discoveredEmotions).sort((a, b) => {
    return a.localeCompare(b);
  });

  const filterEmotions = (emotions: string[]) => {
    let filtered = emotions;

    // Apply type filter (emotion/feeling/state)
    if (typeFilter !== "all") {
      filtered = filtered.filter(
        (emotion) => getItemType(emotion) === typeFilter
      );
    }

    // Apply dimension value filters
    const selectedCount = getSelectedCount();
    if (selectedCount > 0) {
      filtered = filtered.filter((emotion) => {
        // Check if emotion matches ALL selected dimension values
        for (const dimension of Object.keys(
          selectedDimensionValues
        ) as DimensionType[]) {
          const selectedValue = selectedDimensionValues[dimension];
          if (selectedValue) {
            const emotionValue = getEmotionDimension(emotion, dimension);
            // If this dimension has a filter and the emotion doesn't match, exclude it
            if (emotionValue !== selectedValue) {
              return false;
            }
          }
        }
        return true;
      });
    }

    // Apply search query filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(
        (emotion) =>
          emotion.toLowerCase().includes(query) ||
          getFeelingDescription(emotion).toLowerCase().includes(query)
      );
    }

    return filtered;
  };

  // Always show all base emotions (excluding those in crafting slots)
  const filteredBaseEmotions = BASE_EMOTIONS.filter(
    (e) => !craftingSlots.includes(e)
  );
  const filteredDiscoveredEmotions = allEmotions.filter(
    (e) => !BASE_EMOTIONS.includes(e) && !craftingSlots.includes(e)
  );

  const baseEmotionsList = filterEmotions(filteredBaseEmotions);
  const discoveredEmotionsList = filterEmotions(filteredDiscoveredEmotions);

  return (
    <div className="App">
      <header className="header">
        <div className="header-content">
          <div>
            <h1>Emotion Craft</h1>
            <p className="header-subtitle">
              Combine emotions to discover new feelings
            </p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
            <div className="stats">
              <div className="stat-item">
                <span className="stat-value">{totalDiscoveries}</span>
                <span className="stat-label">Discovered</span>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <button
                onClick={() => setMode("view")}
                style={{
                  padding: "0.5rem 1rem",
                  fontSize: "0.875rem",
                  fontWeight: 600,
                  border: "1px solid #e2e8f0",
                  borderRadius: "6px",
                  backgroundColor: mode === "view" ? "#667eea" : "#ffffff",
                  color: mode === "view" ? "#ffffff" : "#64748b",
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                }}
                onMouseEnter={(e) => {
                  if (mode !== "view") {
                    e.currentTarget.style.backgroundColor = "#f8fafc";
                  }
                }}
                onMouseLeave={(e) => {
                  if (mode !== "view") {
                    e.currentTarget.style.backgroundColor = "#ffffff";
                  }
                }}
              >
                View
              </button>
              <button
                onClick={() => setMode("craft")}
                style={{
                  padding: "0.5rem 1rem",
                  fontSize: "0.875rem",
                  fontWeight: 600,
                  border: "1px solid #e2e8f0",
                  borderRadius: "6px",
                  backgroundColor: mode === "craft" ? "#667eea" : "#ffffff",
                  color: mode === "craft" ? "#ffffff" : "#64748b",
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                }}
                onMouseEnter={(e) => {
                  if (mode !== "craft") {
                    e.currentTarget.style.backgroundColor = "#f8fafc";
                  }
                }}
                onMouseLeave={(e) => {
                  if (mode !== "craft") {
                    e.currentTarget.style.backgroundColor = "#ffffff";
                  }
                }}
              >
                Craft
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Sticky Mini Crafting Bar */}
      {craftingSlots.length > 0 && mode === "craft" && (
        <div className="sticky-crafting-bar">
          <div className="sticky-crafting-content">
            <div className="sticky-crafting-label">
              Crafting ({craftingSlots.length}):
            </div>
            <div className="sticky-crafting-items">
              {craftingSlots.map((emotion, index) => (
                <div
                  key={index}
                  className="sticky-crafting-item"
                  style={{
                    "--emotion-color": getEmotionColor(emotion),
                  } as React.CSSProperties}
                >
                  {emotion}
                </div>
              ))}
            </div>
            <div className="sticky-crafting-actions">
              <button
                className="combine-button"
                onClick={handleCombine}
                disabled={craftingSlots.length < 2 || isCombining}
              >
                {isCombining ? (
                  <>
                    <span className="loading-spinner"></span>
                    Combining...
                  </>
                ) : (
                  <>
                    Combine{" "}
                    {craftingSlots.length > 0 && `(${craftingSlots.length})`}
                  </>
                )}
              </button>
              {craftingSlots.length > 0 && (
                <button className="clear-button-small" onClick={clearAll}>
                  Clear All
                </button>
              )}
              <button
                className="sticky-crafting-scroll"
                onClick={() => {
                  craftingAreaRef.current?.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'start' 
                  });
                }}
                title="Scroll to crafting area"
              >
                ↑
              </button>
            </div>
          </div>
        </div>
      )}

      <main className="main-content">
        <section className="section crafting-section">
          <h2>Crafting Area</h2>
          <p className="crafting-instructions">
            {mode === "view" 
              ? "Click emotions from below to view their details, or right-click/Cmd+click to view in any mode."
              : "Click emotions from below to add them to crafting slots, then combine them!"}
          </p>

          <div className="crafting-area" ref={craftingAreaRef}>
            <div className="crafting-slots-container">
              {craftingSlots.length === 0 ? (
                <div className="empty-crafting-area">
                  <p>Click emotions below to start crafting</p>
                </div>
              ) : (
                <>
                  {craftingSlots.map((emotion, index) => {
                    const ratios = getBaseEmotionRatios(emotion);
                    const showComposition =
                      ratios.length > 0 && !BASE_EMOTIONS.includes(emotion);

                    return (
                      <div key={index} className="crafting-slot-wrapper">
                        <div
                          className={`crafting-slot filled ${
                            recentlyAddedEmotion === emotion ? "just-added" : ""
                          }`}
                          style={
                            {
                              "--emotion-color": getEmotionColor(emotion),
                              "--emotion-border-color":
                                getEmotionBorderColor(emotion),
                            } as React.CSSProperties
                          }
                        >
                          <div
                            className="slot-emotion"
                            style={
                              {
                                "--emotion-color": getEmotionColor(emotion),
                                "--emotion-border-color":
                                  getEmotionBorderColor(emotion),
                              } as React.CSSProperties
                            }
                          >
                            {emotion}
                            <button
                              className="remove-button"
                              onClick={() => removeSlot(index)}
                              aria-label="Remove emotion"
                            >
                              ×
                            </button>
                          </div>
                          {showComposition && (
                            <div className="slot-composition">
                              <div className="slot-composition-label">
                                Composition:
                              </div>
                              <div className="slot-composition-list">
                                {ratios.map(
                                  ({ emotion: baseEmotion, ratio }) => (
                                    <div
                                      key={baseEmotion}
                                      className="slot-composition-item"
                                    >
                                      <EmotionShape
                                        emotion={baseEmotion}
                                        color={
                                          BASE_EMOTION_COLORS[baseEmotion] ||
                                          "#667eea"
                                        }
                                        size={12}
                                      />
                                      <span className="slot-composition-emotion">
                                        {baseEmotion}
                                      </span>
                                      <span className="slot-composition-percentage">
                                        {(ratio * 100).toFixed(0)}%
                                      </span>
                                    </div>
                                  )
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                        {index < craftingSlots.length - 1 && (
                          <div className="plus-icon-small">+</div>
                        )}
                      </div>
                    );
                  })}
                </>
              )}
            </div>
          </div>

          {isCombining && (
            <div className="loading-result">
              <div className="loading-spinner-large"></div>
              <p>Combining emotions...</p>
            </div>
          )}

          {lastResult && !isCombining && (
            <div
              ref={resultDisplayRef}
              className={`result-display ${
                isNewDiscovery ? "new-discovery" : ""
              }`}
            >
              {isNewDiscovery && <div className="new-badge">NEW!</div>}
              <div className="result-label">Result:</div>
              <div className="result-header">
                <div className="result-emotion">{lastResult}</div>
              </div>
              {lastCombination.length > 0 && (
                <div className="result-combination">
                  {lastCombination.map((emotion, index) => (
                    <span key={index} className="combination-emotion">
                      {emotion}
                      {index < lastCombination.length - 1 && (
                        <span className="combination-plus"> + </span>
                      )}
                    </span>
                  ))}
                  <span className="combination-equals"> = </span>
                  <span className="combination-result">{lastResult}</span>
                </div>
              )}
              <div className="result-description">
                <div className="result-description-label">Description:</div>
                {getFeelingDescription(lastResult)}
              </div>
              {(() => {
                const ratios = getBaseEmotionRatios(lastResult);
                if (ratios.length > 0) {
                  return (
                    <div className="result-ratios">
                      <div className="result-ratios-label">
                        Base Emotion Composition:
                      </div>
                      <div className="result-ratios-list">
                        {ratios.map(({ emotion, ratio }) => (
                          <div key={emotion} className="result-ratio-item">
                            <div className="result-ratio-emotion">
                              <EmotionShape
                                emotion={emotion}
                                color={
                                  BASE_EMOTION_COLORS[emotion] || "#667eea"
                                }
                                size={16}
                              />
                              <span>{emotion}</span>
                            </div>
                            <div className="result-ratio-bar-container">
                              <div
                                className="result-ratio-bar"
                                style={{
                                  width: `${ratio * 100}%`,
                                  backgroundColor:
                                    BASE_EMOTION_COLORS[emotion] || "#667eea",
                                }}
                              />
                            </div>
                            <div className="result-ratio-percentage">
                              {(ratio * 100).toFixed(1)}%
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                }
                return null;
              })()}
              {(() => {
                // Display dimension tags for this emotion
                const dimensions: DimensionType[] = [
                  "valence",
                  "arousal",
                  "dominance",
                  "temporalFocus",
                  "motivationalDirection",
                  "certainty",
                  "intensity",
                  "socialContext",
                  "cognitiveAppraisal",
                  "embodiment",
                ];
                const dimensionValues = dimensions
                  .map((dim) => {
                    const value = getEmotionDimension(lastResult, dim);
                    return value ? { dimension: dim, value } : null;
                  })
                  .filter((item): item is { dimension: DimensionType; value: string } =>
                    item !== null
                  );

                // Always show dimensions section if there are any dimension values or type
                const itemType = getItemType(lastResult);
                if (dimensionValues.length > 0 || itemType) {
                  return (
                    <div className="result-dimensions">
                      <div className="result-dimensions-label">
                        Dimensions:
                      </div>
                      <div className="result-dimensions-tags">
                        {/* Add Type as first dimension */}
                        <span className="result-dimension-tag">
                          <span className="dimension-name">Type:</span>{" "}
                          <span className="dimension-value">
                            {itemType.charAt(0).toUpperCase() + itemType.slice(1)}
                          </span>
                        </span>
                        {dimensionValues.map(({ dimension, value }) => (
                          <span
                            key={dimension}
                            className="result-dimension-tag"
                            title={`${dimension}: ${DIMENSION_TOOLTIPS[dimension]}`}
                          >
                            <span className="dimension-name">
                              {getDimensionDisplayName(dimension)}:
                            </span>{" "}
                            <span className="dimension-value">
                              {getDimensionValueLabel(dimension, value)}
                            </span>
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                }
                return null;
              })()}
            </div>
          )}

          {craftingSlots.length >= 2 &&
            hasAttemptedCombine &&
            !lastResult &&
            !isCombining && (
              <div className="no-result">
                <p>These emotions don't combine. Try different combinations!</p>
              </div>
            )}
        </section>

        {/* Dimension Filters Section */}
        <section className="section">
          <div className="section-header">
            <h2
              style={{ cursor: "pointer", marginBottom: 0 }}
              onClick={() => setDimensionsExpanded(!dimensionsExpanded)}
            >
              Filter {dimensionsExpanded ? "▼" : "▶"}
            </h2>
            {(getSelectedCount() > 0 || typeFilter !== "all") && (
              <button
                onClick={() => {
                  setSelectedDimensionValues({});
                  setTypeFilter("all");
                }}
                style={{
                  padding: "0.375rem 0.75rem",
                  fontSize: "0.75rem",
                  border: "1px solid #e2e8f0",
                  borderRadius: "4px",
                  backgroundColor: "#ffffff",
                  color: "#64748b",
                  cursor: "pointer",
                }}
              >
                Clear All
              </button>
            )}
          </div>
          {dimensionsExpanded && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: "1rem",
                marginTop: "1rem",
              }}
            >
              {/* Type Filter */}
              <div style={{ position: "relative" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                    marginBottom: "0.5rem",
                  }}
                >
                  <label
                    style={{
                      fontSize: "0.75rem",
                      color: "#64748b",
                      fontWeight: "600",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                    }}
                  >
                    Type
                  </label>
                  <span
                    onMouseEnter={() => setHoveredTypeFilter(true)}
                    onMouseLeave={() => setHoveredTypeFilter(false)}
                    style={{
                      cursor: "help",
                      fontSize: "0.7rem",
                      color: "#94a3b8",
                      width: "14px",
                      height: "14px",
                      borderRadius: "50%",
                      border: "1px solid #94a3b8",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      lineHeight: 1,
                    }}
                  >
                    ?
                  </span>
                  {hoveredTypeFilter && (
                    <div
                      style={{
                        position: "absolute",
                        bottom: "100%",
                        left: 0,
                        marginBottom: "8px",
                        background: "#0f172a",
                        color: "white",
                        padding: "0.875rem 1rem",
                        borderRadius: "6px",
                        fontSize: "0.8125rem",
                        lineHeight: 1.6,
                        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                        zIndex: 1000,
                        pointerEvents: "none",
                        maxWidth: "360px",
                        whiteSpace: "normal",
                        wordWrap: "break-word",
                      }}
                    >
                      <div
                        style={{
                          marginBottom: "0.75rem",
                          fontWeight: "600",
                          fontSize: "0.875rem",
                        }}
                      >
                        Type
                      </div>
                      <div style={{ marginBottom: "0.5rem" }}>
                        <strong
                          style={{ display: "block", marginBottom: "0.25rem" }}
                        >
                          Emotion:
                        </strong>{" "}
                        Basic, universal emotional responses (Joy, Fear,
                        Sadness, Disgust, Anger, Surprise)
                      </div>
                      <div style={{ marginBottom: "0.5rem" }}>
                        <strong
                          style={{ display: "block", marginBottom: "0.25rem" }}
                        >
                          Feeling:
                        </strong>{" "}
                        Subjective experiences that combine emotions with
                        personal context and meaning
                      </div>
                      <div>
                        <strong
                          style={{ display: "block", marginBottom: "0.25rem" }}
                        >
                          State:
                        </strong>{" "}
                        Enduring conditions or modes of being that persist over
                        time
                      </div>
                      <div
                        style={{
                          position: "absolute",
                          top: "100%",
                          left: "20px",
                          border: "6px solid transparent",
                          borderTopColor: "#0f172a",
                        }}
                      />
                    </div>
                  )}
                </div>
                <div
                  style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}
                >
                  {(["all", "emotion", "feeling", "state"] as FilterType[]).map(
                    (filterValue) => {
                      const isSelected = typeFilter === filterValue;
                      return (
                        <button
                          key={filterValue}
                          onClick={() => setTypeFilter(filterValue)}
                          style={{
                            padding: "0.375rem 0.75rem",
                            fontSize: "0.8125rem",
                            backgroundColor: isSelected ? "#667eea" : "#e5e7eb",
                            color: isSelected ? "white" : "#374151",
                            border: "none",
                            borderRadius: "4px",
                            cursor: "pointer",
                            fontWeight: "500",
                            transition: "all 0.2s ease",
                            textTransform: "capitalize",
                          }}
                        >
                          {filterValue}
                        </button>
                      );
                    }
                  )}
                </div>
              </div>
              {(Object.keys(DIMENSION_VALUES) as DimensionType[]).map(
                (dimension) => (
                  <div key={dimension} style={{ position: "relative" }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                        marginBottom: "0.5rem",
                      }}
                    >
                      <label
                        style={{
                          fontSize: "0.75rem",
                          color: "#64748b",
                          fontWeight: "600",
                          textTransform: "uppercase",
                          letterSpacing: "0.05em",
                        }}
                      >
                        {getDimensionDisplayName(dimension)}
                      </label>
                      <span
                        onMouseEnter={() => setHoveredDimension(dimension)}
                        onMouseLeave={() => setHoveredDimension(null)}
                        style={{
                          cursor: "help",
                          fontSize: "0.7rem",
                          color: "#94a3b8",
                          width: "14px",
                          height: "14px",
                          borderRadius: "50%",
                          border: "1px solid #94a3b8",
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          lineHeight: 1,
                        }}
                      >
                        ?
                      </span>
                      {hoveredDimension === dimension && (
                        <div
                          style={{
                            position: "absolute",
                            bottom: "100%",
                            left: 0,
                            marginBottom: "8px",
                            background: "#0f172a",
                            color: "white",
                            padding: "0.875rem 1rem",
                            borderRadius: "6px",
                            fontSize: "0.8125rem",
                            lineHeight: 1.6,
                            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                            zIndex: 1000,
                            pointerEvents: "none",
                            maxWidth: "400px",
                            whiteSpace: "normal",
                            wordWrap: "break-word",
                          }}
                        >
                          {DIMENSION_TOOLTIPS[dimension]}
                          <div
                            style={{
                              position: "absolute",
                              top: "100%",
                              left: "20px",
                              border: "6px solid transparent",
                              borderTopColor: "#0f172a",
                            }}
                          />
                        </div>
                      )}
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "0.5rem",
                      }}
                    >
                      {DIMENSION_VALUES[dimension].map((value) => {
                        const isSelected =
                          selectedDimensionValues[dimension] === value;
                        return (
                          <button
                            key={value}
                            onClick={() =>
                              toggleDimensionValue(dimension, value)
                            }
                            style={{
                              padding: "0.375rem 0.75rem",
                              fontSize: "0.8125rem",
                              backgroundColor: isSelected
                                ? "#667eea"
                                : "#e5e7eb",
                              color: isSelected ? "white" : "#374151",
                              border: "none",
                              borderRadius: "4px",
                              cursor: "pointer",
                              fontWeight: "500",
                              transition: "all 0.2s ease",
                            }}
                          >
                            {getDimensionValueLabel(dimension, value)}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )
              )}
            </div>
          )}
        </section>

        <section className="section base-section">
          <div style={{ marginBottom: "1rem" }}>
            <div className="search-container">
              <input
                type="text"
                className="search-input"
                placeholder="Search emotions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  className="search-clear-button"
                  onClick={() => setSearchQuery("")}
                  aria-label="Clear search"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          <div className="section-header">
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                position: "relative",
              }}
            >
              <h2>Emotions</h2>
              <span
                onMouseEnter={() => setHoveredEmotionsLabel(true)}
                onMouseLeave={() => setHoveredEmotionsLabel(false)}
                style={{
                  cursor: "help",
                  fontSize: "0.875rem",
                  color: "#94a3b8",
                  width: "18px",
                  height: "18px",
                  borderRadius: "50%",
                  border: "1px solid #94a3b8",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  lineHeight: 1,
                }}
              >
                ?
              </span>
              {hoveredEmotionsLabel && (
                <div
                  style={{
                    position: "absolute",
                    bottom: "100%",
                    left: 0,
                    marginBottom: "8px",
                    background: "#0f172a",
                    color: "white",
                    padding: "0.875rem 1rem",
                    borderRadius: "6px",
                    fontSize: "0.8125rem",
                    lineHeight: 1.6,
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                    zIndex: 1000,
                    pointerEvents: "none",
                    maxWidth: "420px",
                    whiteSpace: "normal",
                    wordWrap: "break-word",
                  }}
                >
                  <div
                    style={{
                      marginBottom: "0.75rem",
                      fontWeight: "600",
                      fontSize: "0.875rem",
                    }}
                  >
                    Emotions
                  </div>
                  <div style={{ marginBottom: "0" }}>
                    Emotions are complex psychological states that involve
                    subjective experience, physiological responses, and
                    behavioral expressions. They can manifest as feelings, which
                    are the personal, subjective experience of emotions combined
                    with individual context and meaning.
                  </div>
                  <div
                    style={{
                      position: "absolute",
                      top: "100%",
                      left: "20px",
                      border: "6px solid transparent",
                      borderTopColor: "#0f172a",
                    }}
                  />
                </div>
              )}
            </div>
            <div className="section-actions">
              <div className="legend-button-wrapper">
                <button
                  className="legend-button"
                  onMouseEnter={() => setShowLegendPopover(true)}
                  onMouseLeave={(e) => {
                    // Only close on mouse leave if not clicking
                    if (
                      !e.relatedTarget ||
                      !(e.relatedTarget as Element).closest(".legend-popover")
                    ) {
                      setShowLegendPopover(false);
                    }
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowLegendPopover(!showLegendPopover);
                  }}
                  title="Show legend"
                >
                  ?
                </button>
                {showLegendPopover && (
                  <div
                    className="legend-popover"
                    onMouseEnter={() => setShowLegendPopover(true)}
                    onMouseLeave={() => setShowLegendPopover(false)}
                  >
                    <h3>Indicators</h3>
                    <div className="legend-items">
                      <div className="legend-item">
                        <span className="legend-indicator combinable-indicator">
                          +
                        </span>
                        <span className="legend-text">
                          Green + = Can combine to create new emotion (when
                          selected) or can combine with other emotions (when not
                          selected)
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          {craftingSlots.length > 0 && (
            <p className="highlight-hint">
              Showing feelings that combine with{" "}
              <strong>{craftingSlots.join(", ")}</strong>
            </p>
          )}
          <div className="emotions-grid">
            {baseEmotionsList
              .filter((emotion) => {
                // Hide emotions that can't be combined when items are in crafting slots
                if (craftingSlots.length > 0) {
                  const isInSlots = craftingSlots.includes(emotion);
                  const isCombinable = combinableEmotions.has(emotion);
                  return isInSlots || isCombinable;
                }
                return true;
              })
                .map((emotion) => {
                  const isHighlighted = craftingSlots.includes(emotion);
                  const isCombinable = combinableEmotions.has(emotion);
                  const isUnexplored = unexploredEmotions.has(emotion);
                  const isHovered = hoveredEmotion === emotion;
                  const hasOptions = hasCombinableOptions(emotion);

                return (
                  <div key={emotion} className="emotion-wrapper">
                    <button
                      className={`base-emotion ${
                        isHighlighted ? "highlighted" : ""
                      } ${isCombinable ? "combinable" : ""} ${
                        isUnexplored ? "unexplored" : ""
                      } ${hasOptions ? "has-options" : ""}`}
                      onClick={(e) => handleEmotionClick(emotion, e)}
                      onContextMenu={(e) => {
                        e.preventDefault();
                        viewFeelingDetails(emotion);
                      }}
                      onMouseEnter={() => handleEmotionHover(emotion)}
                      onMouseLeave={handleEmotionLeave}
                      style={
                        {
                          "--emotion-color": getEmotionColor(emotion),
                          "--emotion-border-color":
                            getEmotionBorderColor(emotion),
                        } as React.CSSProperties
                      }
                    >
                      {BASE_EMOTIONS.includes(emotion) && (
                        <EmotionShape
                          emotion={emotion}
                          color={
                            isHighlighted
                              ? "white"
                              : getEmotionBorderColor(emotion)
                          }
                          size={14}
                        />
                      )}
                      {emotion}
                    </button>
                    {(() => {
                      if (
                        highlightedEmotion &&
                        highlightedEmotion !== emotion
                      ) {
                        // When another emotion is highlighted, show badge based on combination status with highlighted emotion
                        const result = getEmotionCombination(
                          highlightedEmotion,
                          emotion
                        );
                        const isNew = result && !discoveredEmotions.has(result);

                        if (result && isNew) {
                          // Can combine to create new emotion - show green plus
                          return (
                            <span
                              className="emotion-badge combinable-badge"
                              title={`Can discover: ${result}`}
                            >
                              +
                            </span>
                          );
                        }
                        // Don't show badge if already tried/discovered
                      } else if (!isHighlighted) {
                        // When no emotion is highlighted, show badges based on combination options
                        if (hasOptions) {
                          const undiscovered = getUndiscoveredEmotions(emotion);
                          if (undiscovered.length > 0) {
                            // Show green badge if can combine with other emotions to discover new ones
                            return (
                              <span
                                className="emotion-badge combinable-badge"
                                title="Can combine with other emotions"
                              >
                                +
                              </span>
                            );
                          }
                          // Don't show badge if all combinations are finished
                        }
                        // If hasOptions is false, don't show any badge (nothing to combine with)
                      }
                      return null;
                    })()}
                    {isHovered && (
                      <div className="emotion-tooltip">
                        <div className="tooltip-title">{emotion}</div>
                        <div className="tooltip-description">
                          {getFeelingDescription(emotion)}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
          </div>
        </section>

        <section className="section mixed-section">
          <div className="section-header">
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                position: "relative",
              }}
            >
              <h2>Feelings ({discoveredEmotionsList.length})</h2>
              <span
                onMouseEnter={() => setHoveredFeelingsLabel(true)}
                onMouseLeave={() => setHoveredFeelingsLabel(false)}
                style={{
                  cursor: "help",
                  fontSize: "0.875rem",
                  color: "#94a3b8",
                  width: "18px",
                  height: "18px",
                  borderRadius: "50%",
                  border: "1px solid #94a3b8",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  lineHeight: 1,
                }}
              >
                ?
              </span>
              {hoveredFeelingsLabel && (
                <div
                  style={{
                    position: "absolute",
                    bottom: "100%",
                    left: 0,
                    marginBottom: "8px",
                    background: "#0f172a",
                    color: "white",
                    padding: "0.875rem 1rem",
                    borderRadius: "6px",
                    fontSize: "0.8125rem",
                    lineHeight: 1.6,
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                    zIndex: 1000,
                    pointerEvents: "none",
                    maxWidth: "480px",
                    whiteSpace: "normal",
                    wordWrap: "break-word",
                  }}
                >
                  <div
                    style={{
                      marginBottom: "0.75rem",
                      fontWeight: "600",
                      fontSize: "0.875rem",
                    }}
                  >
                    Feelings
                  </div>
                  <div style={{ marginBottom: "0.75rem" }}>
                    Feelings are the subjective, personal experience of
                    emotions. They represent how we interpret and experience
                    emotions based on our individual context, memories, beliefs,
                    and circumstances.
                  </div>
                  <div style={{ marginBottom: "0" }}>
                    <strong
                      style={{ display: "block", marginBottom: "0.375rem" }}
                    >
                      What affects feelings:
                    </strong>
                    Personal history, cultural background, current situation,
                    physical state, relationships, expectations, and individual
                    psychological factors all influence how emotions are
                    experienced as feelings.
                  </div>
                  <div
                    style={{
                      position: "absolute",
                      top: "100%",
                      left: "20px",
                      border: "6px solid transparent",
                      borderTopColor: "#0f172a",
                    }}
                  />
                </div>
              )}
            </div>
            <div className="section-actions">
              <button className="reset-button" onClick={resetProgress}>
                Reset
              </button>
            </div>
          </div>
          <div className="emotions-list">
            {discoveredEmotionsList.length > 0 ? (
              discoveredEmotionsList
                .filter((emotion) => {
                  // Hide emotions that can't be combined when items are in crafting slots
                  if (craftingSlots.length > 0) {
                    const isInSlots = craftingSlots.includes(emotion);
                    const isCombinable = combinableEmotions.has(emotion);
                    return isInSlots || isCombinable;
                  }
                  return true;
                })
                .map((emotion) => {
                  const isHighlighted = craftingSlots.includes(emotion);
                  const isCombinable = combinableEmotions.has(emotion);
                  const isUnexplored = unexploredEmotions.has(emotion);
                  const isHovered = hoveredEmotion === emotion;
                  const hasOptions = hasCombinableOptions(emotion);

                  return (
                    <div key={emotion} className="emotion-wrapper">
                      <button
                        className={`discovered-emotion ${
                          isHighlighted ? "highlighted" : ""
                        } ${isCombinable ? "combinable" : ""} ${
                          isUnexplored ? "unexplored" : ""
                        } ${hasOptions ? "has-options" : ""}`}
                        onClick={(e) => handleEmotionClick(emotion, e)}
                        onContextMenu={(e) => {
                          e.preventDefault();
                          viewFeelingDetails(emotion);
                        }}
                        onMouseEnter={() => handleEmotionHover(emotion)}
                        onMouseLeave={handleEmotionLeave}
                        style={
                          {
                            "--emotion-color": getEmotionColor(emotion),
                            "--emotion-border-color":
                              getEmotionBorderColor(emotion),
                          } as React.CSSProperties
                        }
                      >
                        {BASE_EMOTIONS.includes(emotion) ? (
                          <EmotionShape
                            emotion={emotion}
                            color={
                              isHighlighted
                                ? "white"
                                : getEmotionBorderColor(emotion)
                            }
                            size={14}
                          />
                        ) : (
                          <BlendedEmotionShape
                            emotion={emotion}
                            color={
                              isHighlighted
                                ? "white"
                                : getEmotionBorderColor(emotion)
                            }
                            size={14}
                          />
                        )}
                        {emotion}
                      </button>
                      {(() => {
                        if (
                          highlightedEmotion &&
                          highlightedEmotion !== emotion
                        ) {
                          // When another emotion is highlighted, show badge based on combination status with highlighted emotion
                          const result = getEmotionCombination(
                            highlightedEmotion,
                            emotion
                          );
                          const isNew =
                            result && !discoveredEmotions.has(result);

                          if (result && isNew) {
                            // Can combine to create new emotion - show green plus
                            return (
                              <span
                                className="emotion-badge combinable-badge"
                                title={`Can discover: ${result}`}
                              >
                                +
                              </span>
                            );
                          }
                          // Don't show badge if already tried/discovered
                        } else if (!isHighlighted) {
                          // When no emotion is highlighted, show badges based on combination options
                          if (hasOptions) {
                            const undiscovered =
                              getUndiscoveredEmotions(emotion);
                            if (undiscovered.length > 0) {
                              // Show green badge if can combine with other emotions to discover new ones
                              return (
                                <span
                                  className="emotion-badge combinable-badge"
                                  title="Can combine with other emotions"
                                >
                                  +
                                </span>
                              );
                            }
                            // Don't show badge if all combinations are finished
                          }
                          // If hasOptions is false, don't show any badge (nothing to combine with)
                        }
                        return null;
                      })()}
                      {isHovered && (
                        <div className="emotion-tooltip">
                          <div className="tooltip-title">{emotion}</div>
                          <div className="tooltip-description">
                            {getFeelingDescription(emotion)}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })
            ) : (
              <p className="empty-state">
                Combine feelings to discover new ones!
              </p>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default App;
