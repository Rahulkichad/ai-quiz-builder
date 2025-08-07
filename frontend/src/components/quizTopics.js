// List of engaging, knowledge-rich quiz topics with public domain images/logos (Wikimedia/Unsplash/Pexels)
// Each topic has: { key, title, image, imageAttribution }

const quizTopics = [
  {
    key: 'ai_future',
    title: 'The Future of AI',
    emoji: '🤖',
    role: 'teacher',
    difficulty: 'medium',
    num_questions: 20,
    prompt: 'Create a comprehensive quiz about artificial intelligence, covering machine learning, neural networks, AI ethics, future applications, potential impacts on society, and emerging AI technologies. Include questions about major AI breakthroughs, leading AI companies, and important AI researchers.'
  },
  {
    key: 'space_exploration',
    title: 'Space Exploration',
    emoji: '🚀',
    role: 'teacher',
    difficulty: 'medium',
    num_questions: 20,
    prompt: 'Generate a detailed quiz about space exploration, including historical missions, current space programs, planets, galaxies, space technology, and future space missions. Cover topics like NASA, SpaceX, ISS, Mars missions, and astronomical discoveries.'
  },
  {
    key: 'world_history',
    title: 'World History',
    emoji: '🌍',
    role: 'teacher',
    difficulty: 'medium',
    num_questions: 20,
    prompt: 'Create an engaging quiz about world history covering ancient civilizations, medieval period, renaissance, industrial revolution, world wars, cold war, and modern history. Include questions about significant events, influential leaders, and cultural developments.'
  },
  {
    key: 'modern_tech',
    title: 'Modern Technology',
    emoji: '💻',
    role: 'teacher',
    difficulty: 'medium',
    num_questions: 20,
    prompt: 'Generate a quiz about modern technology including smartphones, internet, cloud computing, cybersecurity, blockchain, IoT, and emerging tech trends. Cover major tech companies, influential innovations, and recent technological breakthroughs.'
  },
  {
    key: 'nature_wonders',
    title: 'Natural Wonders',
    emoji: '🏞️',
    role: 'teacher',
    difficulty: 'medium',
    num_questions: 20,
    prompt: 'Create a quiz about natural wonders of the world, including famous landscapes, geological formations, waterfalls, mountains, forests, and unique ecosystems. Include questions about their location, formation, and significance.'
  },
  {
    key: 'world_cuisine',
    title: 'World Cuisine',
    emoji: '🍲',
    role: 'teacher',
    difficulty: 'medium',
    num_questions: 20,
    prompt: 'Generate a quiz about global cuisines, traditional dishes, cooking techniques, food culture, and culinary history from different countries. Include questions about famous chefs, signature ingredients, and regional specialties.'
  },
  {
    key: 'world_geography',
    title: 'World Geography',
    emoji: '🗺️',
    role: 'teacher',
    difficulty: 'medium',
    num_questions: 20,
    prompt: 'Create a comprehensive quiz about world geography covering continents, countries, capitals, major cities, rivers, mountains, climate zones, and geographical features. Include questions about population, cultures, and economic geography.'
  },
  {
    key: 'inventions',
    title: 'Great Inventions',
    emoji: '💡',
    role: 'teacher',
    difficulty: 'medium',
    num_questions: 20,
    prompt: 'Generate a quiz about significant inventions throughout history, their inventors, impact on society, and evolution over time. Cover ancient inventions to modern innovations that changed the world.'
  },
  {
    key: 'wildlife',
    title: 'Wildlife & Animals',
    emoji: '🐾',
    role: 'teacher',
    difficulty: 'medium',
    num_questions: 20,
    prompt: 'Create an informative quiz about wildlife, animal species, habitats, behavior, endangered species, and conservation efforts. Include questions about different animal groups, ecosystems, and biodiversity.'
  },
  {
    key: 'environment',
    title: 'Environment & Climate',
    emoji: '🌳',
    role: 'teacher',
    difficulty: 'medium',
    num_questions: 20,
    prompt: 'Generate a quiz about environmental science, climate change, sustainability, renewable energy, conservation, and ecological challenges. Include questions about environmental policies, solutions, and global initiatives.'
  }
];

export default quizTopics;
