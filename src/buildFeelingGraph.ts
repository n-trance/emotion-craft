import { EmotionGraph } from './EmotionGraph'

interface EmotionCombination {
  [key: string]: {
    [key: string]: string;
  };
}

/**
 * Builds a FeelingGraph from the existing combination data structure
 */
export const buildFeelingGraph = (baseFeelings: string[]): EmotionGraph => {
  const graph = new EmotionGraph(baseFeelings)
  
  const combinations: EmotionCombination = {
    'Joy': {
      'Anticipation': 'Optimism', 'Surprise': 'Delight', 'Fear': 'Nervous Excitement',
      'Anger': 'Pride', 'Sadness': 'Bittersweet', 'Disgust': 'Morbid Curiosity', 'Trust': 'Love'
    },
    'Fear': {
      'Surprise': 'Awe', 'Joy': 'Nervous Excitement', 'Anticipation': 'Anxiety',
      'Anger': 'Hate', 'Sadness': 'Despair', 'Disgust': 'Horror'
    },
    'Surprise': {
      'Sadness': 'Disappointment', 'Joy': 'Delight', 'Fear': 'Awe',
      'Anger': 'Outrage', 'Anticipation': 'Trust', 'Disgust': 'Revulsion'
    },
    'Sadness': {
      'Disgust': 'Remorse', 'Surprise': 'Disappointment', 'Joy': 'Bittersweet', 'Anger': 'Envy',
      'Fear': 'Despair', 'Anticipation': 'Pessimism'
    },
    'Disgust': {
      'Anger': 'Contempt', 'Sadness': 'Remorse', 'Surprise': 'Revulsion', 'Fear': 'Horror',
      'Joy': 'Morbid Curiosity', 'Anticipation': 'Apprehension', 'Trust': 'Acceptance'
    },
    'Anger': {
      'Anticipation': 'Aggressiveness', 'Disgust': 'Contempt', 'Joy': 'Pride',
      'Fear': 'Hate', 'Surprise': 'Outrage', 'Sadness': 'Envy', 'Trust': 'Dominance'
    },
    'Anticipation': {
      'Joy': 'Optimism', 'Anger': 'Aggressiveness', 'Fear': 'Anxiety',
      'Surprise': 'Trust', 'Sadness': 'Pessimism', 'Disgust': 'Apprehension'
    },
    'Trust': {
      'Anticipation': 'Hope',
      'Sadness': 'Peace',
      'Surprise': 'Faith',
      'Joy': 'Love',
      'Peace': 'Harmony',
      'Fear': 'Courage'
    },
    'Love': {
      'Fear': 'Vulnerability', 'Anger': 'Passion', 'Sadness': 'Heartbreak', 'Joy': 'Euphoria',
      'Surprise': 'Infatuation', 'Anticipation': 'Longing', 'Disgust': 'Disillusionment',
      'Trust': 'Deep Love', 'Hope': 'Devotion'
    },
    'Optimism': {
      'Fear': 'Hope', 'Anger': 'Determination', 'Sadness': 'Resilience', 'Joy': 'Elation',
      'Trust': 'Confidence', 'Surprise': 'Wonder', 'Disgust': 'Tolerance',
      'Hope': 'Euphoria', 'Peace': 'Serenity'
    },
    'Awe': {
      'Joy': 'Transcendence', 'Fear': 'Terror', 'Trust': 'Reverence', 'Anger': 'Indignation',
      'Sadness': 'Melancholy', 'Surprise': 'Amazement', 'Anticipation': 'Wonder'
    },
    'Anxiety': {
      'Joy': 'Relief', 'Anger': 'Frustration', 'Sadness': 'Desperation', 'Fear': 'Panic',
      'Trust': 'Reassurance', 'Surprise': 'Shock', 'Disgust': 'Apprehension'
    },
    'Hate': {
      'Joy': 'Schadenfreude', 'Fear': 'Terror', 'Anger': 'Rage', 'Sadness': 'Despair',
      'Trust': 'Betrayal', 'Surprise': 'Outrage', 'Disgust': 'Revulsion'
    },
    'Contempt': {
      'Joy': 'Smugness', 'Anger': 'Scorn', 'Sadness': 'Disdain', 'Fear': 'Revulsion',
      'Trust': 'Skepticism', 'Surprise': 'Disbelief', 'Anticipation': 'Cynicism'
    },
    'Despair': {
      'Joy': 'Catharsis', 'Anger': 'Rage', 'Fear': 'Hopelessness', 'Trust': 'Resignation',
      'Surprise': 'Shock', 'Anticipation': 'Dread', 'Disgust': 'Self-Loathing'
    },
    'Guilt': {
      'Joy': 'Relief', 'Anger': 'Shame', 'Sadness': 'Remorse', 'Fear': 'Dread',
      'Trust': 'Confession', 'Surprise': 'Regret', 'Anticipation': 'Worry',
      'Anxiety': 'Embarrassment'
    },
    'Pride': {
      'Joy': 'Triumph', 'Anger': 'Arrogance', 'Sadness': 'Nostalgia', 'Fear': 'Humility',
      'Trust': 'Confidence', 'Surprise': 'Amazement', 'Anticipation': 'Excitement'
    },
    'Envy': {
      'Joy': 'Satisfaction', 'Anger': 'Resentment', 'Sadness': 'Self-Pity', 'Fear': 'Insecurity',
      'Trust': 'Admiration', 'Surprise': 'Jealousy', 'Anticipation': 'Covetousness'
    },
    // Third level combinations
    'Vulnerability': {
      'Trust': 'Intimacy', 'Fear': 'Terror', 'Joy': 'Acceptance', 'Anger': 'Defensiveness'
    },
    'Heartbreak': {
      'Anger': 'Bitterness', 'Sadness': 'Grief', 'Fear': 'Abandonment', 'Trust': 'Healing'
    },
    'Hope': {
      'Joy': 'Euphoria', 'Trust': 'Faith', 'Fear': 'Anxiety', 'Anticipation': 'Optimism',
      'Love': 'Devotion', 'Peace': 'Renewal', 'Optimism': 'Euphoria'
    },
    'Rage': {
      'Fear': 'Terror', 'Anger': 'Fury', 'Sadness': 'Despair', 'Disgust': 'Revulsion'
    },
    'Terror': {
      'Anger': 'Panic', 'Fear': 'Horror', 'Surprise': 'Shock', 'Sadness': 'Despair'
    },
    'Schadenfreude': {
      'Joy': 'Malicious Joy', 'Anger': 'Vindictiveness', 'Contempt': 'Scorn'
    },
    'Catharsis': {
      'Joy': 'Relief', 'Sadness': 'Release', 'Anger': 'Purification'
    },
    'Intimacy': {
      'Love': 'Deep Love', 'Trust': 'Bonding', 'Joy': 'Connection'
    },
    'Grief': {
      'Sadness': 'Sorrow', 'Anger': 'Bargaining', 'Fear': 'Denial', 'Acceptance': 'Peace'
    },
    'Acceptance': {
      'Joy': 'Contentment', 'Trust': 'Peace', 'Sadness': 'Resignation',
      'Peace': 'Equanimity', 'Hope': 'Renewal', 'Grief': 'Peace'
    },
    // Fourth level combinations
    'Deep Love': {
      'Trust': 'Devotion', 'Joy': 'Bliss', 'Fear': 'Protectiveness', 'Sadness': 'Yearning'
    },
    'Peace': {
      'Joy': 'Serenity', 'Trust': 'Harmony', 'Acceptance': 'Equanimity',
      'Hope': 'Renewal', 'Love': 'Sacredness', 'Contentment': 'Tranquility',
      'Surprise': 'Anticipation',
      'Fear': 'Trust',
      'Anxiety': 'Shyness'
    },
    'Fury': {
      'Anger': 'Wrath', 'Hate': 'Vengeance', 'Despair': 'Nihilism'
    },
    'Panic': {
      'Fear': 'Hysteria', 'Terror': 'Paranoia', 'Anxiety': 'Overwhelm'
    },
    'Malicious Joy': {
      'Contempt': 'Cruelty', 'Hate': 'Spite', 'Anger': 'Sadism'
    },
    'Healing': {
      'Hope': 'Renewal', 'Acceptance': 'Recovery', 'Trust': 'Restoration'
    },
    'Connection': {
      'Love': 'Unity', 'Trust': 'Empathy', 'Intimacy': 'Oneness'
    },
    'Bitterness': {
      'Anger': 'Resentment', 'Envy': 'Cynicism', 'Despair': 'Apathy'
    },
    'Defensiveness': {
      'Fear': 'Paranoia', 'Anger': 'Hostility', 'Trust': 'Caution'
    },
    'Bonding': {
      'Love': 'Attachment', 'Trust': 'Loyalty', 'Intimacy': 'Commitment'
    },
    'Purification': {
      'Catharsis': 'Renewal', 'Acceptance': 'Forgiveness', 'Peace': 'Redemption'
    },
    'Release': {
      'Catharsis': 'Liberation', 'Peace': 'Freedom', 'Joy': 'Relief'
    },
    'Sorrow': {
      'Grief': 'Melancholy', 'Despair': 'Desolation', 'Sadness': 'Lament'
    },
    'Bargaining': {
      'Hope': 'Desperation', 'Fear': 'Anxiety', 'Anger': 'Frustration'
    },
    'Denial': {
      'Fear': 'Avoidance', 'Anger': 'Defiance', 'Sadness': 'Repression'
    },
    // Fifth level combinations
    'Devotion': {
      'Deep Love': 'Adoration', 'Trust': 'Fidelity', 'Peace': 'Sacredness'
    },
    'Serenity': {
      'Peace': 'Tranquility', 'Contentment': 'Stillness', 'Acceptance': 'Zen'
    },
    'Wrath': {
      'Fury': 'Ire', 'Hate': 'Vindictiveness', 'Anger': 'Ire'
    },
    'Hysteria': {
      'Panic': 'Mania', 'Terror': 'Phobia', 'Anxiety': 'Breakdown'
    },
    'Cruelty': {
      'Malicious Joy': 'Torture', 'Hate': 'Malice', 'Contempt': 'Brutality'
    },
    'Renewal': {
      'Healing': 'Rebirth', 'Hope': 'Revival', 'Peace': 'Regeneration'
    },
    'Unity': {
      'Connection': 'Oneness', 'Love': 'Harmony', 'Trust': 'Solidarity'
    },
    'Apathy': {
      'Bitterness': 'Numbness', 'Despair': 'Indifference', 'Resignation': 'Detachment'
    },
    'Paranoia': {
      'Defensiveness': 'Suspicion', 'Fear': 'Distrust', 'Anxiety': 'Delusion'
    },
    'Attachment': {
      'Bonding': 'Dependency', 'Love': 'Possessiveness', 'Trust': 'Devotion'
    },
    'Redemption': {
      'Purification': 'Salvation', 'Peace': 'Absolution', 'Acceptance': 'Grace'
    },
    'Liberation': {
      'Release': 'Emancipation', 'Peace': 'Freedom', 'Joy': 'Elation'
    },
    'Desolation': {
      'Sorrow': 'Void', 'Despair': 'Emptiness', 'Grief': 'Abyss'
    },
    'Lament': {
      'Sorrow': 'Mourning', 'Grief': 'Loss', 'Despair': 'Loneliness'
    },
    'Fidelity': {
      'Devotion': 'Loyalty', 'Trust': 'Allegiance', 'Love': 'Dedication'
    },
    'Tranquility': {
      'Serenity': 'Calm', 'Peace': 'Quietude', 'Contentment': 'Repose'
    },
    'Oneness': {
      'Unity': 'Wholeness', 'Connection': 'Integration', 'Love': 'Transcendence'
    },
    'Numbness': {
      'Apathy': 'Desensitization', 'Despair': 'Void', 'Bitterness': 'Emptiness'
    },
    'Suspicion': {
      'Paranoia': 'Distrust', 'Fear': 'Wariness', 'Defensiveness': 'Vigilance'
    },
    'Dependency': {
      'Attachment': 'Codependency', 'Love': 'Enmeshment', 'Trust': 'Reliance'
    },
    'Salvation': {
      'Redemption': 'Deliverance', 'Peace': 'Sanctuary', 'Hope': 'Rescue'
    },
    'Emancipation': {
      'Liberation': 'Independence', 'Freedom': 'Autonomy', 'Peace': 'Sovereignty'
    },
    'Void': {
      'Desolation': 'Nothingness', 'Despair': 'Absence', 'Apathy': 'Vacant'
    },
    'Mourning': {
      'Lament': 'Bereavement', 'Grief': 'Sorrow', 'Despair': 'Melancholy'
    },
    'Wholeness': {
      'Oneness': 'Completeness', 'Unity': 'Integration', 'Peace': 'Harmony'
    },
    'Desensitization': {
      'Numbness': 'Indifference', 'Apathy': 'Callousness', 'Void': 'Emptiness', 'Detachment': 'Vacant'
    },
    'Distrust': {
      'Suspicion': 'Wariness', 'Fear': 'Caution', 'Paranoia': 'Vigilance'
    },
    'Codependency': {
      'Dependency': 'Enmeshment', 'Attachment': 'Fused', 'Love': 'Entanglement'
    },
    'Deliverance': {
      'Salvation': 'Rescue', 'Redemption': 'Liberation', 'Hope': 'Escape'
    },
    'Independence': {
      'Emancipation': 'Autonomy', 'Freedom': 'Self-Reliance', 'Peace': 'Sovereignty'
    },
    'Nothingness': {
      'Void': 'Absence', 'Desolation': 'Emptiness', 'Apathy': 'Vacuity'
    },
    'Bereavement': {
      'Mourning': 'Loss', 'Grief': 'Sorrow', 'Despair': 'Loneliness'
    },
    'Completeness': {
      'Wholeness': 'Perfection', 'Unity': 'Fulfillment', 'Peace': 'Satisfaction'
    },
    // Missing emotion definitions that are used as parents
    'Freedom': {
      'Peace': 'Liberation', 'Joy': 'Elation', 'Trust': 'Autonomy', 'Hope': 'Independence'
    },
    'Contentment': {
      'Joy': 'Satisfaction', 'Peace': 'Tranquility', 'Trust': 'Serenity', 'Acceptance': 'Stillness'
    },
    // Additional missing emotions - Second level
    'Excitement': {
      'Joy': 'Elation', 'Anticipation': 'Enthusiasm', 'Surprise': 'Thrill', 'Pride': 'Triumph'
    },
    'Satisfaction': {
      'Joy': 'Contentment', 'Pride': 'Fulfillment', 'Peace': 'Serenity', 'Acceptance': 'Stillness'
    },
    'Determination': {
      'Anger': 'Resolve', 'Hope': 'Perseverance', 'Pride': 'Confidence', 'Optimism': 'Resilience'
    },
    'Resilience': {
      'Hope': 'Strength', 'Acceptance': 'Recovery', 'Optimism': 'Renewal', 'Peace': 'Equanimity'
    },
    'Tolerance': {
      'Acceptance': 'Patience', 'Peace': 'Harmony', 'Trust': 'Understanding', 'Optimism': 'Hope'
    },
    'Reverence': {
      'Awe': 'Transcendence', 'Trust': 'Faith', 'Peace': 'Sacredness', 'Love': 'Devotion'
    },
    'Indignation': {
      'Anger': 'Outrage', 'Disgust': 'Moral Disgust', 'Awe': 'Righteousness', 'Hate': 'Vengeance'
    },
    'Reassurance': {
      'Trust': 'Confidence', 'Peace': 'Calm', 'Hope': 'Relief', 'Anxiety': 'Comfort',
      'Comfort': 'Solace'
    },
    'Betrayal': {
      'Hate': 'Vengeance', 'Sadness': 'Heartbreak', 'Anger': 'Rage', 'Trust': 'Distrust'
    },
    'Smugness': {
      'Pride': 'Arrogance', 'Contempt': 'Scorn', 'Joy': 'Schadenfreude', 'Satisfaction': 'Complacency'
    },
    'Disdain': {
      'Contempt': 'Scorn', 'Disgust': 'Revulsion', 'Anger': 'Hostility', 'Hate': 'Malice'
    },
    'Skepticism': {
      'Distrust': 'Wariness', 'Contempt': 'Cynicism', 'Fear': 'Caution', 'Surprise': 'Disbelief'
    },
    'Disbelief': {
      'Surprise': 'Shock', 'Fear': 'Terror', 'Contempt': 'Skepticism', 'Trust': 'Distrust'
    },
    'Hopelessness': {
      'Despair': 'Desolation', 'Sadness': 'Grief', 'Fear': 'Terror', 'Acceptance': 'Resignation'
    },
    'Self-Loathing': {
      'Guilt': 'Shame', 'Despair': 'Desolation', 'Hate': 'Malice', 'Disgust': 'Revulsion'
    },
    'Shame': {
      'Guilt': 'Remorse', 'Fear': 'Humility', 'Anger': 'Self-Loathing', 'Sadness': 'Regret'
    },
    'Confession': {
      'Guilt': 'Relief', 'Trust': 'Acceptance', 'Hope': 'Forgiveness', 'Peace': 'Redemption'
    },
    'Regret': {
      'Sadness': 'Remorse', 'Guilt': 'Shame', 'Fear': 'Dread', 'Acceptance': 'Forgiveness'
    },
    'Worry': {
      'Fear': 'Anxiety', 'Anticipation': 'Dread', 'Sadness': 'Desperation', 'Guilt': 'Regret'
    },
    'Triumph': {
      'Pride': 'Arrogance', 'Joy': 'Euphoria', 'Excitement': 'Elation', 'Satisfaction': 'Fulfillment'
    },
    'Arrogance': {
      'Pride': 'Smugness', 'Contempt': 'Scorn', 'Anger': 'Hostility', 'Triumph': 'Hubris'
    },
    'Nostalgia': {
      'Sadness': 'Melancholy', 'Joy': 'Bittersweet', 'Love': 'Longing', 'Peace': 'Serenity'
    },
    'Humility': {
      'Fear': 'Submission', 'Trust': 'Faith', 'Peace': 'Acceptance', 'Pride': 'Acceptance'
    },
    'Resentment': {
      'Anger': 'Bitterness', 'Envy': 'Jealousy', 'Hate': 'Vengeance', 'Despair': 'Apathy'
    },
    'Self-Pity': {
      'Sadness': 'Despair', 'Envy': 'Insecurity', 'Anger': 'Resentment', 'Fear': 'Hopelessness'
    },
    'Embarrassment': {
      'Guilt': 'Shame',
      'Fear': 'Anxiety'
    },
    'Shyness': {
      'Fear': 'Anxiety',
      'Sadness': 'Self-Pity'
    },
    'Insecurity': {
      'Fear': 'Anxiety', 'Envy': 'Jealousy', 'Sadness': 'Self-Pity', 'Anger': 'Defensiveness'
    },
    'Admiration': {
      'Trust': 'Reverence', 'Love': 'Adoration', 'Joy': 'Wonder', 'Envy': 'Hope'
    },
    'Jealousy': {
      'Envy': 'Covetousness', 'Anger': 'Resentment', 'Fear': 'Insecurity', 'Hate': 'Malice'
    },
    'Covetousness': {
      'Envy': 'Jealousy', 'Longing': 'Yearning', 'Anger': 'Resentment', 'Anticipation': 'Desire'
    },
    'Abandonment': {
      'Fear': 'Terror', 'Sadness': 'Desolation', 'Anger': 'Bitterness', 'Heartbreak': 'Grief'
    },
    'Vindictiveness': {
      'Hate': 'Vengeance', 'Anger': 'Rage', 'Schadenfreude': 'Malice', 'Contempt': 'Cruelty'
    },
    'Harmony': {
      'Peace': 'Serenity', 'Love': 'Unity', 'Trust': 'Empathy', 'Acceptance': 'Equanimity'
    },
    'Vengeance': {
      'Hate': 'Malice', 'Anger': 'Wrath', 'Fury': 'Nihilism', 'Betrayal': 'Vindictiveness'
    },
    'Nihilism': {
      'Despair': 'Void', 'Fury': 'Destruction', 'Apathy': 'Nothingness', 'Hate': 'Malice'
    },
    'Overwhelm': {
      'Anxiety': 'Breakdown', 'Fear': 'Panic', 'Sadness': 'Despair', 'Anger': 'Fury'
    },
    'Sadism': {
      'Malicious Joy': 'Torture', 'Hate': 'Brutality', 'Contempt': 'Cruelty', 'Anger': 'Wrath'
    },
    'Recovery': {
      'Healing': 'Renewal', 'Hope': 'Revival', 'Acceptance': 'Peace', 'Peace': 'Regeneration'
    },
    'Restoration': {
      'Healing': 'Renewal', 'Trust': 'Faith', 'Peace': 'Harmony', 'Hope': 'Revival'
    },
    'Caution': {
      'Fear': 'Wariness', 'Distrust': 'Vigilance', 'Defensiveness': 'Suspicion', 'Anxiety': 'Apprehension'
    },
    'Commitment': {
      'Love': 'Dedication', 'Trust': 'Loyalty', 'Bonding': 'Attachment', 'Hope': 'Devotion'
    },
    'Forgiveness': {
      'Acceptance': 'Peace', 'Love': 'Grace', 'Peace': 'Redemption', 'Guilt': 'Relief'
    },
    'Avoidance': {
      'Fear': 'Denial', 'Anxiety': 'Repression', 'Sadness': 'Numbness', 'Anger': 'Defiance'
    },
    'Defiance': {
      'Anger': 'Hostility', 'Fear': 'Anger', 'Hate': 'Vengeance', 'Pride': 'Arrogance'
    },
    'Repression': {
      'Denial': 'Numbness', 'Fear': 'Avoidance', 'Anger': 'Bitterness', 'Sadness': 'Apathy'
    },
    // Additional missing emotions - Third level
    'Bliss': {
      'Joy': 'Euphoria', 'Love': 'Deep Love', 'Peace': 'Transcendence', 'Deep Love': 'Adoration'
    },
    'Protectiveness': {
      'Love': 'Devotion', 'Fear': 'Caution', 'Anger': 'Hostility', 'Deep Love': 'Sacredness'
    },
    'Yearning': {
      'Longing': 'Heartbreak', 'Sadness': 'Nostalgia', 'Love': 'Heartbreak', 'Deep Love': 'Devotion'
    },
    'Hostility': {
      'Anger': 'Aggressiveness', 'Hate': 'Malice', 'Defensiveness': 'Paranoia', 'Contempt': 'Scorn'
    },
    'Loyalty': {
      'Trust': 'Fidelity', 'Love': 'Devotion', 'Bonding': 'Commitment', 'Faith': 'Allegiance'
    },
    'Empathy': {
      'Love': 'Connection', 'Trust': 'Intimacy', 'Connection': 'Unity', 'Intimacy': 'Oneness'
    },
    'Calm': {
      'Peace': 'Serenity', 'Acceptance': 'Stillness', 'Tranquility': 'Zen', 'Relief': 'Quietude'
    },
    'Spite': {
      'Hate': 'Malice', 'Anger': 'Vindictiveness', 'Contempt': 'Cruelty', 'Malicious Joy': 'Torture'
    },
    'Callousness': {
      'Apathy': 'Indifference', 'Numbness': 'Desensitization', 'Contempt': 'Brutality', 'Hate': 'Malice'
    },
    'Fused': {
      'Connection': 'Oneness', 'Love': 'Unity', 'Bonding': 'Enmeshment', 'Intimacy': 'Entanglement'
    },
    'Reliance': {
      'Trust': 'Dependency', 'Hope': 'Faith', 'Love': 'Attachment', 'Bonding': 'Codependency'
    },
    'Sanctuary': {
      'Peace': 'Calm', 'Trust': 'Hope', 'Hope': 'Rescue', 'Salvation': 'Deliverance'
    },
    'Rescue': {
      'Hope': 'Deliverance', 'Love': 'Protectiveness', 'Trust': 'Sanctuary', 'Salvation': 'Escape'
    },
    'Autonomy': {
      'Freedom': 'Independence', 'Trust': 'Self-Reliance', 'Peace': 'Sovereignty', 'Liberation': 'Emancipation'
    },
    'Absence': {
      'Void': 'Nothingness', 'Desolation': 'Emptiness', 'Sadness': 'Loss', 'Apathy': 'Vacant'
    },
    'Vacant': {
      'Void': 'Absence', 'Emptiness': 'Nothingness', 'Apathy': 'Desensitization', 'Numbness': 'Indifference'
    },
    // Additional missing emotions - Fourth level
    'Ire': {
      'Anger': 'Wrath', 'Fury': 'Nihilism', 'Hate': 'Malice', 'Rage': 'Fury'
    },
    'Mania': {
      'Euphoria': 'Bliss', 'Excitement': 'Hysteria', 'Hysteria': 'Breakdown', 'Joy': 'Euphoria'
    },
    'Phobia': {
      'Fear': 'Terror', 'Terror': 'Horror', 'Anxiety': 'Panic', 'Hysteria': 'Breakdown'
    },
    'Breakdown': {
      'Overwhelm': 'Despair', 'Hysteria': 'Mania', 'Despair': 'Desolation', 'Anxiety': 'Panic'
    },
    'Torture': {
      'Sadism': 'Brutality', 'Cruelty': 'Malice', 'Hate': 'Vengeance', 'Malicious Joy': 'Cruelty'
    },
    'Malice': {
      'Hate': 'Vengeance', 'Cruelty': 'Brutality', 'Spite': 'Torture', 'Anger': 'Wrath'
    },
    'Brutality': {
      'Cruelty': 'Torture', 'Sadism': 'Malice', 'Hate': 'Vengeance', 'Callousness': 'Indifference'
    },
    'Rebirth': {
      'Renewal': 'Revival', 'Healing': 'Recovery', 'Hope': 'Regeneration', 'Peace': 'Transcendence'
    },
    'Revival': {
      'Renewal': 'Rebirth', 'Hope': 'Regeneration', 'Recovery': 'Restoration', 'Peace': 'Harmony'
    },
    'Regeneration': {
      'Renewal': 'Rebirth', 'Healing': 'Recovery', 'Peace': 'Harmony', 'Hope': 'Revival'
    },
    'Solidarity': {
      'Unity': 'Oneness', 'Trust': 'Allegiance', 'Connection': 'Empathy', 'Love': 'Harmony'
    },
    'Indifference': {
      'Apathy': 'Detachment', 'Numbness': 'Desensitization', 'Despair': 'Void', 'Bitterness': 'Emptiness'
    },
    'Detachment': {
      'Apathy': 'Indifference', 'Numbness': 'Void', 'Despair': 'Emptiness', 'Resignation': 'Vacant'
    },
    'Delusion': {
      'Paranoia': 'Breakdown', 'Fear': 'Phobia', 'Anxiety': 'Hysteria', 'Distrust': 'Suspicion'
    },
    'Possessiveness': {
      'Love': 'Enmeshment', 'Attachment': 'Codependency', 'Jealousy': 'Hostility', 'Bonding': 'Dependency'
    },
    'Absolution': {
      'Forgiveness': 'Grace', 'Redemption': 'Salvation', 'Peace': 'Sanctuary', 'Acceptance': 'Peace'
    },
    'Grace': {
      'Forgiveness': 'Absolution', 'Peace': 'Sacredness', 'Love': 'Adoration', 'Acceptance': 'Redemption'
    },
    'Emptiness': {
      'Void': 'Nothingness', 'Desolation': 'Absence', 'Apathy': 'Vacant', 'Numbness': 'Desensitization'
    },
    'Abyss': {
      'Desolation': 'Void', 'Despair': 'Nothingness', 'Grief': 'Loss', 'Void': 'Absence'
    },
    'Loneliness': {
      'Sadness': 'Desolation', 'Grief': 'Abyss', 'Despair': 'Void', 'Lament': 'Bereavement'
    },
    'Allegiance': {
      'Loyalty': 'Dedication', 'Trust': 'Fidelity', 'Devotion': 'Sacredness', 'Solidarity': 'Unity'
    },
    'Dedication': {
      'Devotion': 'Adoration', 'Loyalty': 'Fidelity', 'Commitment': 'Sacredness', 'Love': 'Grace'
    },
    'Quietude': {
      'Calm': 'Stillness', 'Peace': 'Repose', 'Tranquility': 'Zen', 'Serenity': 'Stillness'
    },
    'Repose': {
      'Calm': 'Quietude', 'Peace': 'Stillness', 'Tranquility': 'Zen', 'Serenity': 'Quietude'
    },
    'Integration': {
      'Unity': 'Wholeness', 'Oneness': 'Completeness', 'Connection': 'Harmony', 'Peace': 'Fulfillment'
    },
    'Wariness': {
      'Caution': 'Vigilance', 'Distrust': 'Suspicion', 'Fear': 'Apprehension', 'Paranoia': 'Vigilance'
    },
    'Vigilance': {
      'Caution': 'Wariness', 'Suspicion': 'Distrust', 'Fear': 'Paranoia', 'Defensiveness': 'Hostility'
    },
    'Enmeshment': {
      'Codependency': 'Fused', 'Attachment': 'Entanglement', 'Love': 'Possessiveness', 'Dependency': 'Fused'
    },
    'Entanglement': {
      'Enmeshment': 'Fused', 'Codependency': 'Dependency', 'Love': 'Possessiveness', 'Attachment': 'Enmeshment'
    },
    'Escape': {
      'Freedom': 'Liberation', 'Hope': 'Deliverance', 'Fear': 'Avoidance', 'Desperation': 'Rescue'
    },
    'Self-Reliance': {
      'Autonomy': 'Independence', 'Confidence': 'Sovereignty', 'Freedom': 'Emancipation', 'Trust': 'Autonomy'
    },
    'Sovereignty': {
      'Independence': 'Autonomy', 'Freedom': 'Self-Reliance', 'Peace': 'Harmony', 'Liberation': 'Emancipation'
    },
    'Vacuity': {
      'Void': 'Absence', 'Emptiness': 'Nothingness', 'Apathy': 'Indifference', 'Numbness': 'Desensitization'
    },
    'Loss': {
      'Grief': 'Bereavement', 'Sadness': 'Lament', 'Despair': 'Loneliness', 'Mourning': 'Sorrow'
    },
    'Perfection': {
      'Completeness': 'Fulfillment', 'Wholeness': 'Harmony', 'Unity': 'Transcendence', 'Peace': 'Sacredness'
    },
    'Fulfillment': {
      'Satisfaction': 'Completeness', 'Contentment': 'Perfection', 'Peace': 'Harmony', 'Joy': 'Bliss'
    },
    // Additional feelings from descriptions that need graph connections
    'Submission': {
      'Fear': 'Resignation', 'Trust': 'Faith', 'Anger': 'Humility', 'Sadness': 'Acceptance'
    },
    'Curiosity': {
      'Surprise': 'Wonder', 'Trust': 'Faith', 'Joy': 'Excitement', 'Anticipation': 'Hope'
    },
    'Faith': {
      'Trust': 'Devotion', 'Hope': 'Renewal', 'Love': 'Sacredness', 'Peace': 'Tranquility'
    },
    'Dominance': {
      'Anger': 'Hostility', 'Pride': 'Arrogance', 'Trust': 'Confidence', 'Hate': 'Vengeance'
    },
    'Resignation': {
      'Sadness': 'Acceptance', 'Despair': 'Apathy', 'Fear': 'Submission', 'Peace': 'Equanimity'
    },
    'Moral Disgust': {
      'Disgust': 'Contempt', 'Anger': 'Indignation', 'Trust': 'Betrayal', 'Hate': 'Malice'
    },
    'Horror': {
      'Fear': 'Terror', 'Disgust': 'Revulsion', 'Surprise': 'Shock', 'Despair': 'Desolation'
    },
    'Disappointment': {
      'Sadness': 'Grief', 'Surprise': 'Shock', 'Anger': 'Resentment', 'Hope': 'Despair'
    },
    'Outrage': {
      'Anger': 'Rage', 'Surprise': 'Shock', 'Disgust': 'Revulsion', 'Hate': 'Vengeance'
    },
    'Revulsion': {
      'Disgust': 'Contempt', 'Fear': 'Horror', 'Anger': 'Hate', 'Sadness': 'Despair'
    },
    'Remorse': {
      'Guilt': 'Shame', 'Sadness': 'Grief', 'Anger': 'Self-Loathing', 'Acceptance': 'Forgiveness'
    },
    'Pessimism': {
      'Sadness': 'Despair', 'Fear': 'Hopelessness', 'Anticipation': 'Dread', 'Despair': 'Nihilism'
    },
    'Aggressiveness': {
      'Anger': 'Hostility', 'Anticipation': 'Determination', 'Hate': 'Vengeance', 'Pride': 'Arrogance'
    },
    'Amazement': {
      'Surprise': 'Wonder', 'Awe': 'Transcendence', 'Joy': 'Euphoria', 'Trust': 'Reverence'
    },
    // New meaningful feelings
    'Gratitude': {
      'Joy': 'Appreciation', 'Trust': 'Devotion', 'Love': 'Appreciation', 'Peace': 'Contentment'
    },
    'Courage': {
      'Fear': 'Valor', 'Trust': 'Confidence', 'Hope': 'Valor', 'Determination': 'Perseverance'
    },
    'Compassion': {
      'Love': 'Kindness', 'Sadness': 'Sympathy', 'Empathy': 'Kindness', 'Trust': 'Kindness'
    },
    'Sympathy': {
      'Sadness': 'Compassion', 'Love': 'Compassion', 'Empathy': 'Understanding', 'Trust': 'Compassion'
    },
    'Kindness': {
      'Compassion': 'Tenderness', 'Love': 'Tenderness', 'Trust': 'Generosity', 'Peace': 'Harmony'
    },
    'Appreciation': {
      'Gratitude': 'Reverence', 'Love': 'Adoration', 'Joy': 'Contentment', 'Trust': 'Devotion'
    },
    'Valor': {
      'Courage': 'Heroism', 'Hope': 'Determination', 'Fear': 'Bravery', 'Trust': 'Confidence'
    },
    'Tenderness': {
      'Love': 'Intimacy', 'Kindness': 'Compassion', 'Vulnerability': 'Intimacy', 'Peace': 'Serenity'
    },
    'Solace': {
      'Comfort': 'Peace', 'Peace': 'Serenity', 'Hope': 'Relief', 'Acceptance': 'Contentment'
    },
    'Generosity': {
      'Kindness': 'Charity', 'Love': 'Devotion', 'Trust': 'Faith', 'Joy': 'Gratitude'
    },
    'Bravery': {
      'Courage': 'Valor', 'Fear': 'Determination', 'Hope': 'Perseverance', 'Trust': 'Confidence'
    },
    'Heroism': {
      'Valor': 'Sacrifice', 'Courage': 'Nobility', 'Hope': 'Devotion', 'Love': 'Sacrifice'
    },
    'Charity': {
      'Generosity': 'Benevolence', 'Kindness': 'Compassion', 'Love': 'Devotion', 'Trust': 'Faith'
    },
    'Benevolence': {
      'Charity': 'Grace', 'Kindness': 'Compassion', 'Love': 'Sacredness', 'Peace': 'Harmony'
    },
    'Nobility': {
      'Heroism': 'Honor', 'Courage': 'Integrity', 'Trust': 'Fidelity', 'Love': 'Devotion'
    },
    'Honor': {
      'Nobility': 'Integrity', 'Pride': 'Dignity', 'Trust': 'Fidelity', 'Respect': 'Reverence'
    },
    'Integrity': {
      'Honor': 'Dignity', 'Trust': 'Fidelity', 'Courage': 'Nobility', 'Peace': 'Harmony'
    },
    'Dignity': {
      'Honor': 'Respect', 'Pride': 'Self-Respect', 'Trust': 'Confidence', 'Peace': 'Equanimity'
    },
    'Respect': {
      'Honor': 'Reverence', 'Trust': 'Admiration', 'Love': 'Adoration', 'Peace': 'Harmony'
    },
    // Missing combination entries for emotions that are created but don't have their own entries
    'Adoration': {
      'Love': 'Deep Love', 'Devotion': 'Sacredness', 'Admiration': 'Reverence', 'Deep Love': 'Grace'
    },
    'Apprehension': {
      'Fear': 'Anxiety', 'Anticipation': 'Dread', 'Disgust': 'Horror', 'Anxiety': 'Panic'
    },
    'Bittersweet': {
      'Joy': 'Nostalgia', 'Sadness': 'Melancholy', 'Love': 'Longing', 'Peace': 'Serenity',
      'Trust': 'Acceptance'
    },
    'Comfort': {
      'Peace': 'Serenity', 'Trust': 'Confidence', 'Hope': 'Relief'
    },
    'Complacency': {
      'Satisfaction': 'Contentment', 'Smugness': 'Arrogance', 'Peace': 'Stillness', 'Pride': 'Acceptance'
    },
    'Confidence': {
      'Trust': 'Faith', 'Pride': 'Arrogance', 'Optimism': 'Determination', 'Hope': 'Perseverance'
    },
    'Cynicism': {
      'Contempt': 'Skepticism', 'Bitterness': 'Apathy', 'Envy': 'Resentment', 'Disgust': 'Disdain'
    },
    'Delight': {
      'Joy': 'Euphoria', 'Surprise': 'Wonder', 'Love': 'Infatuation', 'Trust': 'Reverence',
      'Peace': 'Serenity'
    },
    'Desire': {
      'Anticipation': 'Longing', 'Love': 'Passion', 'Joy': 'Euphoria', 'Hope': 'Devotion',
      'Trust': 'Intimacy', 'Envy': 'Covetousness'
    },
    'Desperation': {
      'Despair': 'Hopelessness', 'Anxiety': 'Panic', 'Fear': 'Terror', 'Hope': 'Bargaining'
    },
    'Destruction': {
      'Fury': 'Nihilism', 'Hate': 'Malice', 'Anger': 'Wrath', 'Despair': 'Void'
    },
    'Disillusionment': {
      'Love': 'Heartbreak', 'Disgust': 'Contempt', 'Sadness': 'Despair', 'Trust': 'Betrayal',
      'Anger': 'Bitterness', 'Surprise': 'Disappointment'
    },
    'Dread': {
      'Fear': 'Terror', 'Anticipation': 'Anxiety', 'Despair': 'Hopelessness', 'Guilt': 'Worry',
      'Sadness': 'Guilt'
    },
    'Elation': {
      'Joy': 'Euphoria', 'Excitement': 'Thrill', 'Hope': 'Euphoria', 'Optimism': 'Euphoria',
      'Freedom': 'Liberation'
    },
    'Enthusiasm': {
      'Excitement': 'Elation', 'Joy': 'Euphoria', 'Anticipation': 'Hope', 'Optimism': 'Euphoria',
      'Trust': 'Confidence', 'Hope': 'Devotion'
    },
    'Equanimity': {
      'Peace': 'Serenity', 'Acceptance': 'Stillness', 'Calm': 'Zen', 'Contentment': 'Tranquility'
    },
    'Euphoria': {
      'Joy': 'Bliss', 'Love': 'Deep Love', 'Hope': 'Devotion', 'Excitement': 'Elation',
      'Peace': 'Transcendence', 'Trust': 'Reverence'
    },
    'Frustration': {
      'Anger': 'Rage', 'Anxiety': 'Desperation', 'Despair': 'Apathy', 'Hope': 'Bargaining'
    },
    'Hubris': {
      'Arrogance': 'Smugness', 'Pride': 'Arrogance', 'Triumph': 'Arrogance', 'Contempt': 'Scorn'
    },
    'Infatuation': {
      'Love': 'Deep Love', 'Surprise': 'Wonder', 'Joy': 'Euphoria', 'Anticipation': 'Longing',
      'Trust': 'Intimacy', 'Hope': 'Devotion'
    },
    'Longing': {
      'Love': 'Heartbreak', 'Anticipation': 'Hope', 'Sadness': 'Nostalgia', 'Joy': 'Bittersweet',
      'Trust': 'Yearning', 'Peace': 'Serenity'
    },
    'Melancholy': {
      'Sadness': 'Sorrow', 'Nostalgia': 'Bittersweet', 'Despair': 'Desolation', 'Grief': 'Mourning'
    },
    'Morbid Curiosity': {
      'Disgust': 'Horror', 'Joy': 'Schadenfreude', 'Surprise': 'Shock', 'Fear': 'Terror',
      'Curiosity': 'Apprehension'
    },
    'Nervous Excitement': {
      'Fear': 'Anxiety', 'Joy': 'Delight', 'Anticipation': 'Hope', 'Surprise': 'Wonder',
      'Excitement': 'Thrill'
    },
    'Passion': {
      'Love': 'Devotion', 'Anger': 'Rage', 'Joy': 'Euphoria', 'Desire': 'Longing',
      'Trust': 'Intimacy', 'Fear': 'Vulnerability', 'Hope': 'Devotion'
    },
    'Patience': {
      'Tolerance': 'Acceptance', 'Peace': 'Stillness', 'Trust': 'Faith', 'Calm': 'Quietude'
    },
    'Perseverance': {
      'Determination': 'Resilience', 'Hope': 'Strength', 'Optimism': 'Renewal', 'Confidence': 'Triumph'
    },
    'Relief': {
      'Joy': 'Contentment', 'Anxiety': 'Comfort', 'Fear': 'Calm', 'Guilt': 'Forgiveness'
    },
    'Resolve': {
      'Determination': 'Perseverance', 'Anger': 'Hostility', 'Hope': 'Strength', 'Confidence': 'Triumph'
    },
    'Righteousness': {
      'Indignation': 'Outrage', 'Awe': 'Reverence', 'Anger': 'Wrath', 'Trust': 'Faith'
    },
    'Sacredness': {
      'Peace': 'Tranquility', 'Love': 'Grace', 'Devotion': 'Adoration', 'Faith': 'Transcendence'
    },
    'Scorn': {
      'Contempt': 'Disdain', 'Anger': 'Hostility', 'Hate': 'Malice', 'Smugness': 'Arrogance'
    },
    'Shock': {
      'Surprise': 'Disbelief', 'Fear': 'Terror', 'Terror': 'Horror', 'Anxiety': 'Panic'
    },
    'Stillness': {
      'Calm': 'Zen', 'Peace': 'Quietude', 'Contentment': 'Repose', 'Acceptance': 'Equanimity'
    },
    'Strength': {
      'Resilience': 'Recovery', 'Hope': 'Renewal', 'Determination': 'Perseverance', 'Confidence': 'Triumph'
    },
    'Thrill': {
      'Excitement': 'Elation', 'Surprise': 'Wonder', 'Joy': 'Euphoria', 'Fear': 'Nervous Excitement',
      'Anticipation': 'Enthusiasm'
    },
    'Transcendence': {
      'Awe': 'Reverence', 'Peace': 'Sacredness', 'Bliss': 'Adoration', 'Oneness': 'Wholeness'
    },
    'Understanding': {
      'Tolerance': 'Acceptance', 'Trust': 'Empathy', 'Peace': 'Harmony', 'Curiosity': 'Faith'
    },
    'Wonder': {
      'Surprise': 'Amazement', 'Awe': 'Transcendence', 'Joy': 'Euphoria', 'Trust': 'Reverence',
      'Love': 'Adoration', 'Curiosity': 'Faith', 'Amazement': 'Curiosity'
    },
    'Zen': {
      'Stillness': 'Quietude', 'Serenity': 'Repose', 'Peace': 'Tranquility', 'Acceptance': 'Equanimity'
    }
  }

  // Track potential data issues
  const duplicateWarnings: Array<{ edgeKey: string; existing: string; incoming: string }> = []

  // Build the graph by iterating through all combinations
  // Skip property updates during building for better performance
  for (const [parent1, children] of Object.entries(combinations)) {
    for (const [parent2, child] of Object.entries(children)) {
      // Skip self-combinations that result in the same emotion
      if (parent1 === parent2 && parent1 === child) {
        continue
      }

      // Detect duplicate parent-pair definitions before overriding
      const edgeKey = [parent1, parent2].sort().join('+')
      const existing = graph.getCombination(parent1, parent2)
      if (existing && existing !== child) {
        duplicateWarnings.push({ edgeKey, existing, incoming: child })
      }

      graph.addCombination(parent1, parent2, child, true) // Skip property updates
    }
  }

  // Finalize graph by calculating all properties in a single efficient pass
  graph.finalizeGraph()

  // Warn about unreachable nodes (level >= 10 signals no path from the six bases)
  const unreachable: string[] = []
  graph.getAllEmotions().forEach(emotion => {
    if (graph.getLevel(emotion) >= 10) {
      unreachable.push(emotion)
    }
  })
  if (unreachable.length > 0) {
    console.warn('[EmotionGraph] Unreachable emotions (no base path):', unreachable)
  }

  // Warn about parent-pair collisions
  if (duplicateWarnings.length > 0) {
    console.warn('[EmotionGraph] Duplicate parent-pair definitions (last wins):', duplicateWarnings)
  }

  return graph
}

