import { useState, useEffect } from 'react';

// Quiz data: Car brand from image description
const quizData = [
  {
    description: "A sleek red Italian sports car with a prancing horse emblem on the side. Iconic for Formula 1 dominance.",
    brand: "Ferrari",
    options: ["Ferrari", "Lamborghini", "Porsche", "Maserati"]
  },
  {
    description: "An angular supercar from Italy featuring scissor doors and a bull logo. Known for its aggressive styling.",
    brand: "Lamborghini",
    options: ["Lamborghini", "Ferrari", "Bugatti", "Aston Martin"]
  },
  {
    description: "A German luxury sports car with a flat-six engine sound. Features a distinctive rear-engine layout and 911 badge.",
    brand: "Porsche",
    options: ["Porsche", "BMW", "Audi", "Mercedes-Benz"]
  },
  {
    description: "An iconic British luxury GT car with a winged emblem. Elegant design and powerful V8 engine.",
    brand: "Aston Martin",
    options: ["Aston Martin", "Bentley", "Rolls-Royce", "Jaguar"]
  },
  {
    description: "A French hypercar known for its butterfly doors and W16 engine. Extremely rare and powerful.",
    brand: "Bugatti",
    options: ["Bugatti", "Koenigsegg", "Pagani", "McLaren"]
  },
  {
    description: "An American muscle car legend with a pony on the grille. Classic fastback design and V8 rumble.",
    brand: "Ford Mustang",
    options: ["Ford Mustang", "Chevrolet Camaro", "Dodge Challenger", "Pontiac Firebird"]
  },
  {
    description: "A Japanese sports car icon with pop-up headlights and a rotary engine. Lightweight and agile.",
    brand: "Mazda MX-5",
    options: ["Mazda MX-5", "Toyota Supra", "Nissan 370Z", "Honda S2000"]
  },
  {
    description: "A British grand tourer with a leaping cat logo. Combines luxury with high performance.",
    brand: "Jaguar",
    options: ["Jaguar", "Land Rover", "Bentley", "Aston Martin"]
  },
  {
    description: "A Swedish hypercar with a diamond-shaped badge. Known for record-breaking top speeds.",
    brand: "Koenigsegg",
    options: ["Koenigsegg", "Bugatti", "Rimac", "Hennessey"]
  },
  {
    description: "An Italian hypercar with exposed carbon fiber and scissor doors. Features a screaming V12.",
    brand: "Pagani",
    options: ["Pagani", "Lamborghini", "Ferrari", "Maserati"]
  }
];

interface Question {
  description: string;
  brand: string;
  options: string[];
}

const TOTAL_QUESTIONS = 8;
const TIME_PER_QUESTION = 15;

export default function CarBrandQuiz() {
  const [gameState, setGameState] = useState<'start' | 'playing' | 'end'>('start');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(TIME_PER_QUESTION);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [shuffledOptions, setShuffledOptions] = useState<string[]>([]);
  const [correctCount, setCorrectCount] = useState(0);

  // Shuffle array helper
  const shuffleArray = <T,>(array: T[]): T[] => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  // Start the game
  const startGame = () => {
    const shuffledQuestions = shuffleArray(quizData).slice(0, TOTAL_QUESTIONS);
    const firstQuestion = shuffledQuestions[0];
    
    setQuestions(shuffledQuestions);
    setCurrentIndex(0);
    setScore(0);
    setCorrectCount(0);
    setTimeLeft(TIME_PER_QUESTION);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setShuffledOptions(shuffleArray(firstQuestion.options));
    setGameState('playing');
  };

  // Handle answer selection
  const handleAnswer = (answer: string) => {
    if (isAnswered) return;

    const currentQuestion = questions[currentIndex];
    const isCorrect = answer === currentQuestion.brand;

    setSelectedAnswer(answer);
    setIsAnswered(true);

    if (isCorrect) {
      const timeBonus = Math.floor(timeLeft / 3);
      const points = 10 + timeBonus;
      setScore(prev => prev + points);
      setCorrectCount(prev => prev + 1);
    }

    // Auto-advance after 1.8 seconds
    setTimeout(() => {
      nextQuestion();
    }, 1800);
  };

  // Move to next question or end game
  const nextQuestion = () => {
    if (currentIndex + 1 >= questions.length) {
      setGameState('end');
    } else {
      const nextIndex = currentIndex + 1;
      const nextQ = questions[nextIndex];
      
      setCurrentIndex(nextIndex);
      setTimeLeft(TIME_PER_QUESTION);
      setSelectedAnswer(null);
      setIsAnswered(false);
      setShuffledOptions(shuffleArray(nextQ.options));
    }
  };

  // Timer countdown
  useEffect(() => {
    if (gameState !== 'playing' || isAnswered) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          // Time's up - treat as wrong answer
          setIsAnswered(true);
          setSelectedAnswer(null);
          setTimeout(() => {
            nextQuestion();
          }, 1800);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState, currentIndex, isAnswered]);

  // Restart game
  const restartGame = () => {
    setGameState('start');
  };

  const currentQuestion = questions[currentIndex];
  const progress = ((currentIndex) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-zinc-950 text-white relative overflow-hidden">
      {/* Car racing background theme */}
      <div className="absolute inset-0 bg-[radial-gradient(#27272a_0.8px,transparent_1px)] bg-[length:5px_5px] opacity-60" />
      <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,#18181b_51%)] bg-[length:100%_6px] opacity-30" />
      <div className="absolute top-10 right-[-60px] text-[420px] text-zinc-900/70 pointer-events-none select-none">🏎️</div>
      <div className="absolute bottom-[-80px] left-[-50px] text-[300px] text-zinc-900/60 pointer-events-none select-none rotate-[-25deg]">🏁</div>
      {/* Header */}
      <div className="border-b border-zinc-800 bg-zinc-900">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-red-600 flex items-center justify-center text-2xl">🏎️</div>
            <div>
              <h1 className="font-black text-3xl tracking-[-2.5px]">REV UP</h1>
              <p className="text-[10px] text-red-500 -mt-1 tracking-[3px]">RACING EDITION</p>
            </div>
          </div>
          {gameState === 'playing' && (
            <div className="flex items-center gap-4 text-sm">
              <div className="px-4 py-1.5 bg-zinc-800 rounded-full flex items-center gap-2">
                <span className="text-zinc-400">Score</span>
                <span className="font-mono font-semibold text-emerald-400">{score}</span>
              </div>
              <div className="px-4 py-1.5 bg-zinc-800 rounded-full flex items-center gap-2">
                <span className="text-zinc-400">Q</span>
                <span className="font-mono font-semibold">{currentIndex + 1}/{questions.length}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12 relative z-10">
        {/* START SCREEN */}
        {gameState === 'start' && (
          <div className="text-center pt-12">
            <div className="inline-block mb-8 relative">
              <div className="text-[110px] mb-1 opacity-10 absolute -top-8 -left-6">🏎️</div>
              <div className="text-8xl mb-3">🏁</div>
              <div className="text-7xl font-black tracking-[-4px]">REV UP</div>
              <div className="text-3xl text-red-500 font-medium tracking-[6px] mt-1">RACE TO THE FINISH</div>
              <div className="mt-5 text-xs text-zinc-500 tracking-widest italic">"If everything seems under control, you're not going fast enough."</div>
            </div>

            <div className="max-w-md mx-auto mb-10">
              <p className="text-zinc-400 text-lg">Test your knowledge of legendary car brands. 8 questions, 15 seconds each.</p>
            </div>

            <button
              onClick={startGame}
              className="px-16 py-4 bg-white text-zinc-950 font-semibold text-xl rounded-2xl hover:bg-zinc-200 active:scale-[0.985] transition-all flex items-center gap-3 mx-auto shadow-xl"
            >
              START RACE <span className="text-2xl">🏁</span>
            </button>

            <div className="mt-16 flex justify-center gap-8 text-sm text-zinc-500">
              <div>⏱️ 15s per question</div>
              <div>🎯 Time bonuses</div>
              <div>🔀 Shuffled</div>
            </div>
          </div>
        )}

        {/* PLAYING SCREEN */}
        {gameState === 'playing' && currentQuestion && (
          <div>
            {/* Progress bar */}
            <div className="h-1 bg-zinc-800 rounded mb-8">
              <div 
                className="h-1 bg-red-600 rounded transition-all duration-300" 
                style={{ width: `${progress}%` }}
              />
            </div>

            {/* Timer */}
            <div className="flex justify-center mb-8">
              <div className={`flex items-center gap-2 px-5 py-1.5 rounded-full border text-sm font-mono tracking-[3px] ${timeLeft <= 5 ? 'border-red-500 text-red-500 bg-red-950/40' : 'border-zinc-700 text-zinc-400'}`}>
                <div className="w-2 h-2 rounded-full bg-current animate-pulse" />
                {timeLeft}s
              </div>
            </div>

            {/* Question Card */}
            <div className="relative bg-zinc-900 border border-zinc-800 rounded-3xl p-10 mb-8 overflow-hidden">
              <div className="absolute top-6 right-8 text-[120px] opacity-[0.04] pointer-events-none">🏎️</div>
              <div className="uppercase tracking-[4px] text-xs text-red-500 mb-4 font-medium flex items-center gap-2">
                <span>🏁</span> IMAGE DESCRIPTION
              </div>
              <div className="text-3xl leading-tight font-light tracking-tight text-balance pr-10">
                "{currentQuestion.description}"
              </div>
              <div className="mt-4 text-xs tracking-widest text-zinc-600">WHAT CAR BRAND IS THIS?</div>
            </div>

            {/* Options */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {shuffledOptions.map((option, idx) => {
                const isCorrectAnswer = option === currentQuestion.brand;
                const isSelected = selectedAnswer === option;
                
                let btnClass = "border border-zinc-700 hover:border-zinc-500 bg-zinc-900 hover:bg-zinc-800 text-left";
                
                if (isAnswered) {
                  if (isCorrectAnswer) {
                    btnClass = "border-emerald-600 bg-emerald-950 text-emerald-400";
                  } else if (isSelected) {
                    btnClass = "border-red-600 bg-red-950/60 text-red-400";
                  } else {
                    btnClass = "border-zinc-800 bg-zinc-950 text-zinc-500";
                  }
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleAnswer(option)}
                    disabled={isAnswered}
                    className={`px-7 py-5 rounded-2xl font-medium text-xl transition-all text-left flex items-center justify-between group ${btnClass}`}
                  >
                    <span>{option}</span>
                    {isAnswered && isCorrectAnswer && <span className="text-xl">✓</span>}
                    {isAnswered && isSelected && !isCorrectAnswer && <span className="text-xl">✕</span>}
                  </button>
                );
              })}
            </div>

            {isAnswered && (
              <div className="text-center mt-8 text-sm text-zinc-400 tracking-wide">
                {selectedAnswer === currentQuestion.brand ? "CORRECT! Great eye." : "Not quite..."} Moving to next question...
              </div>
            )}
          </div>
        )}

        {/* END SCREEN */}
        {gameState === 'end' && (
          <div className="text-center pt-10">
            <div className="text-[100px] mb-2">🏆</div>
            <div className="inline-block px-4 py-px text-xs tracking-[4px] bg-zinc-900 border border-zinc-800 rounded mb-3 text-red-500">FINISH LINE</div>
            <h2 className="text-7xl font-black tracking-[-3px] mb-2">RACE COMPLETE</h2>
            <p className="text-2xl text-zinc-400 mb-12">You scored <span className="font-mono font-bold text-white">{score}</span> points</p>

            <div className="max-w-xs mx-auto bg-zinc-900 border border-zinc-800 rounded-3xl p-8 mb-10">
              <div className="flex justify-between items-baseline mb-2">
                <div className="text-zinc-400">Correct answers</div>
                <div className="font-mono text-4xl font-semibold">{correctCount}<span className="text-lg text-zinc-500">/{TOTAL_QUESTIONS}</span></div>
              </div>
              <div className="h-px bg-zinc-800 my-5" />
              <div className="text-sm text-emerald-400">Accuracy: {Math.round((correctCount / TOTAL_QUESTIONS) * 100)}%</div>
            </div>

            <div className="flex gap-4 justify-center">
              <button
                onClick={restartGame}
                className="px-10 py-4 border border-zinc-700 hover:bg-zinc-900 rounded-2xl font-medium text-lg transition-all"
              >
                PLAY AGAIN
              </button>
              <button
                onClick={startGame}
                className="px-10 py-4 bg-white text-black font-semibold rounded-2xl text-lg hover:bg-zinc-200 active:scale-[0.985] transition-all"
              >
                NEW SET OF CARS
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="text-center pb-8 text-[10px] text-zinc-700 tracking-[3px] relative z-10">🏎️ SHUFFLED • TIMED ROUNDS • HIGH-SPEED SCORING 🏁</div>
    </div>
  );
}
