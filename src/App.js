import React, { useState } from 'react';
import { Heart, Zap, Coffee, Moon, Sun, Share2, RotateCcw, Sparkles } from 'lucide-react';

const App = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [result, setResult] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [userName, setUserName] = useState('');
  const [showNameInput, setShowNameInput] = useState(true);
  const [animationClass, setAnimationClass] = useState('');

  const questions = [
    {
      id: 1,
      text: "It's Friday night, what's your ideal vibe?",
      options: [
        { text: "Netflix and chill at home", value: "chill", emoji: "🛋️" },
        { text: "Dancing until 3 AM", value: "energy", emoji: "🕺" },
        { text: "Deep conversations with friends", value: "thoughtful", emoji: "💭" },
        { text: "Solo adventure exploring the city", value: "adventurous", emoji: "🌃" }
      ]
    },
    {
      id: 2,
      text: "Your perfect workspace would be:",
      options: [
        { text: "Cozy coffee shop with ambient noise", value: "chill", emoji: "☕" },
        { text: "High-energy co-working space", value: "energy", emoji: "⚡" },
        { text: "Quiet library corner", value: "thoughtful", emoji: "📚" },
        { text: "Rooftop with a view", value: "adventurous", emoji: "🏙️" }
      ]
    },
    {
      id: 3,
      text: "When facing a coding challenge, you:",
      options: [
        { text: "Take breaks and approach it slowly", value: "chill", emoji: "🧘" },
        { text: "Dive in with high energy and music", value: "energy", emoji: "🎵" },
        { text: "Research thoroughly before starting", value: "thoughtful", emoji: "🔍" },
        { text: "Try unconventional solutions first", value: "adventurous", emoji: "🚀" }
      ]
    },
    {
      id: 4,
      text: "Your ideal team meeting would include:",
      options: [
        { text: "Casual chat before getting to business", value: "chill", emoji: "💬" },
        { text: "High-energy brainstorming session", value: "energy", emoji: "💡" },
        { text: "Structured agenda with clear goals", value: "thoughtful", emoji: "📋" },
        { text: "Walking meeting or change of scenery", value: "adventurous", emoji: "🚶" }
      ]
    },
    {
      id: 5,
      text: "Your GitHub commit messages are usually:",
      options: [
        { text: "Simple and to the point", value: "chill", emoji: "✅" },
        { text: "Enthusiastic with emojis", value: "energy", emoji: "🎉" },
        { text: "Detailed and descriptive", value: "thoughtful", emoji: "📝" },
        { text: "Creative and sometimes cryptic", value: "adventurous", emoji: "🔮" }
      ]
    }
  ];

  const vibeTypes = {
    chill: {
      name: "The Zen Coder",
      description: "You bring calm, steady energy to any team. Your thoughtful approach and ability to stay cool under pressure makes you the perfect person to have during crunch time.",
      color: "from-blue-400 to-purple-500",
      icon: <Moon className="w-12 h-12" />,
      traits: ["Calm under pressure", "Great listener", "Steady contributor", "Zen master"],
      percentage: 0
    },
    energy: {
      name: "The Hype Developer",
      description: "You're the spark that ignites the team! Your enthusiasm is contagious, and you turn mundane standup meetings into exciting collaboration sessions.",
      color: "from-orange-400 to-red-500",
      icon: <Zap className="w-12 h-12" />,
      traits: ["High energy", "Team motivator", "Creative problem solver", "Vibe curator"],
      percentage: 0
    },
    thoughtful: {
      name: "The Strategic Mind",
      description: "You're the one who thinks three steps ahead. Your careful planning and attention to detail saves the team from technical debt and architectural nightmares.",
      color: "from-green-400 to-blue-500",
      icon: <Coffee className="w-12 h-12" />,
      traits: ["Strategic thinker", "Detail-oriented", "Problem solver", "Long-term vision"],
      percentage: 0
    },
    adventurous: {
      name: "The Innovation Explorer",
      description: "You're always pushing boundaries and trying new technologies. Your willingness to experiment leads to breakthrough solutions and keeps the team cutting-edge.",
      color: "from-purple-400 to-pink-500",
      icon: <Sparkles className="w-12 h-12" />,
      traits: ["Innovation driver", "Risk taker", "Tech explorer", "Creative visionary"],
      percentage: 0
    }
  };

  const handleAnswer = (value) => {
    setAnimationClass('animate-pulse');
    setTimeout(() => {
      const newAnswers = [...answers, value];
      setAnswers(newAnswers);
      
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
      } else {
        calculateResult(newAnswers);
      }
      setAnimationClass('');
    }, 200);
  };

  const calculateResult = (allAnswers) => {
    const counts = allAnswers.reduce((acc, answer) => {
      acc[answer] = (acc[answer] || 0) + 1;
      return acc;
    }, {});

    const total = allAnswers.length;
    const percentages = {};
    
    Object.keys(vibeTypes).forEach(vibe => {
      percentages[vibe] = Math.round(((counts[vibe] || 0) / total) * 100);
    });

    const primaryVibe = Object.keys(counts).reduce((a, b) => 
      counts[a] > counts[b] ? a : b
    );

    const resultData = {
      ...vibeTypes[primaryVibe],
      percentages,
      primaryVibe,
      userName
    };

    setResult(resultData);
    setShowResult(true);
  };

  const handleStartQuiz = () => {
    if (userName.trim()) {
      setShowNameInput(false);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setResult(null);
    setShowResult(false);
    setShowNameInput(true);
    setUserName('');
  };

  const shareResult = () => {
    const shareText = `I just took the Vibe Check quiz and I'm "${result.name}"! 🚀 What's your developer vibe?`;
    
    if (navigator.share) {
      navigator.share({
        title: 'My Vibe Check Result',
        text: shareText,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(shareText + ' ' + window.location.href);
      alert('Results copied to clipboard!');
    }
  };

  if (showNameInput) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center p-4">
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 max-w-md w-full border border-white/20 shadow-2xl">
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">🌈</div>
            <h1 className="text-4xl font-bold text-white mb-2">Vibe Check</h1>
            <p className="text-white/70">Discover your developer personality!</p>
          </div>
          
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Enter your name"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30"
              onKeyPress={(e) => e.key === 'Enter' && handleStartQuiz()}
            />
            <button
              onClick={handleStartQuiz}
              disabled={!userName.trim()}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-pink-500 to-violet-500 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 transition-transform duration-200"
            >
              Start Vibe Check ✨
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (showResult) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 p-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 shadow-2xl">
            <div className="text-center mb-8">
              <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br ${result.color} mb-4 text-white`}>
                {result.icon}
              </div>
              <h1 className="text-3xl font-bold text-white mb-2">
                Hey {result.userName}! 👋
              </h1>
              <h2 className="text-2xl font-semibold text-white mb-4">
                You're {result.name}
              </h2>
              <p className="text-white/80 text-lg leading-relaxed">
                {result.description}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-8">
              {result.traits.map((trait, index) => (
                <div key={index} className="bg-white/5 rounded-xl p-3 text-center">
                  <span className="text-white/90 font-medium">{trait}</span>
                </div>
              ))}
            </div>

            <div className="mb-8">
              <h3 className="text-xl font-semibold text-white mb-4">Your Vibe Breakdown:</h3>
              <div className="space-y-3">
                {Object.entries(vibeTypes).map(([key, vibe]) => {
                  const percentage = result.percentages[key] || 0;
                  return (
                    <div key={key} className="flex items-center space-x-3">
                      <span className="text-white/80 w-24 text-sm">{vibe.name}</span>
                      <div className="flex-1 bg-white/10 rounded-full h-3">
                        <div 
                          className={`h-3 rounded-full bg-gradient-to-r ${vibe.color} transition-all duration-1000 ease-out`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="text-white/90 font-semibold w-12 text-right">{percentage}%</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex space-x-4">
              <button
                onClick={shareResult}
                className="flex-1 flex items-center justify-center space-x-2 py-3 rounded-xl bg-gradient-to-r from-green-500 to-blue-500 text-white font-semibold hover:scale-105 transition-transform duration-200"
              >
                <Share2 className="w-5 h-5" />
                <span>Share Result</span>
              </button>
              <button
                onClick={resetQuiz}
                className="flex-1 flex items-center justify-center space-x-2 py-3 rounded-xl bg-white/10 border border-white/20 text-white font-semibold hover:bg-white/20 transition-colors duration-200"
              >
                <RotateCcw className="w-5 h-5" />
                <span>Retake Quiz</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const question = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between text-white/80 mb-4">
            <span>Question {currentQuestion + 1} of {questions.length}</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <div className="w-full bg-white/10 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-pink-500 to-violet-500 h-2 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className={`bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 shadow-2xl ${animationClass}`}>
          <h2 className="text-2xl font-bold text-white mb-8 text-center">
            {question.text}
          </h2>
          
          <div className="grid gap-4">
            {question.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(option.value)}
                className="flex items-center space-x-4 p-4 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/20 hover:scale-105 transition-all duration-200 text-left"
              >
                <span className="text-2xl">{option.emoji}</span>
                <span className="font-medium">{option.text}</span>
              </button>
            ))}
          </div>
        </div>
        
        <div className="text-center mt-8">
          <p className="text-white/60 text-sm">
            Hey {userName}! Pick the option that vibes with you most 🌟
          </p>
        </div>
      </div>
    </div>
  );
};

export default App;