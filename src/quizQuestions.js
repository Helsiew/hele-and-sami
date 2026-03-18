export const ALL_QUESTIONS = [
  {
    question: "Where did Helena and Sami first meet?",
    options: ["Baes", "Jeffos", "Barbary", "Spectre"],
    answer: "Jeffos"
  },
  {
    question: "What's Helena's go-to drink order?",
    options: ["Vodka", "Gin", "Whiskey", "Tequila"],
    answer: "Tequila"
  },
  {
    question: "What does Helena do for work?",
    options: ["Designer", "Engineer", "Marketing", "OnlyFans"],
    answer: "Marketing"
  },
  {
    question: "What cartoon character would Helena tattoo on herself?",
    options: ["Hello Kitty", "Stewie", "Pickle Rick", "One Piece"],
    answer: "Pickle Rick"
  },
  {
    question: "Right answers only",
    options: ["I am better than Helena, in general.", "I am the bigger LOSER", "I can beat Helena at every sport known to mankind.", "She's no queen."],
    answer: "I am the bigger LOSER"
  },
  {
    question: "How many followers does Helena have?",
    options: ["1410", "1415", "1420", "who cares"],
    answer: "who cares"
  },
  {
    question: "Her favorite cuisine",
    options: ["Japanese", "Korean", "French (ME)", "Italian"],
    answer: "French (ME)"
  },
  {
    question: "How many siblings does Helena have?",
    options: ["1", "2", "3", "4"],
    answer: "3"
  },
  {
    question: "When is her birthday? (day of the month)",
    options: ["10", "11", "12", "13"],
    answer: "11"
  },
  {
    question: "Who is the better athlete?",
    options: ["Helena. Obviously", "Helena, but Sami tries", "Still Helena", "I refuse to comment"],
    answer: "I refuse to comment"
  },
  {
    question: "Who will win in a padel match?",
    options: ["Sami who ONCE played pro handball", "Sami, duh", "Sami, again", "Sami, if she's being blindfolded"],
    answer: "Sami, if she's being blindfolded"
  },
  {
    question: "Who would survive in a reality show longer?",
    options: ["Sami, obviously", "Sami, no contest", "Sami, easily", "Sami, final answer"],
    answer: "Sami, final answer"
  },
  {
    question: "Who is the real MVP?",
    options: ["Sami", "The quiz is biased and I stand by it", "Also Sami", "Still Sami"],
    answer: "The quiz is biased and I stand by it"
  },
  {
    question: "Who is the real main character?",
    options: ["Sami", "Mohand", "Mr.Terki", "None of the options"],
    answer: "None of the options"
  },
  {
    question: "Who is the funnier one?",
    options: ["Sami thinks its him, but its Helena", "Sami but Sami laughs the loudest", "Helena without trying", "All of the options"],
    answer: "All of the options"
  },
  {
    question: "Who actually runs the show here?",
    options: ["Helena", "Also Helena", "Still Helena", "Sami just works here"],
    answer: "Sami just works here"
  },
  {
    question: "When did Helena moved to SG?",
    options: ["2021", "2022", "2023", "2024"],
    answer: "2022"
   }
]

export const QUESTIONS_PER_VISIT = 3
export const PASS_SCORE = 2

export function getDailyQuestions() {
  const shuffled = [...ALL_QUESTIONS]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled.slice(0, QUESTIONS_PER_VISIT)
}