import React, { useState } from 'react';

const vibeTypes = {
  chill: {
    name: "The Zen Coder",
    description: "You bring calm, steady energy to any team. Your thoughtful approach and ability to stay cool under pressure makes you the perfect person to have during crunch time.",
    color: "linear-gradient(90deg, #6dd5ed 0%, #b2b6ff 100%)",
    traits: ["Calm under pressure", "Great listener", "Steady contributor", "Zen master"],
    percentage: 0
  },
  energy: {
    name: "The Hype Developer",
    description: "You're the spark that ignites the team! Your enthusiasm is contagious, and you turn mundane standup meetings into exciting collaboration sessions.",
    color: "linear-gradient(90deg, #ff7300 0%, #ff5e62 100%)",
    traits: ["High energy", "Team motivator", "Creative problem solver", "Vibe curator"],
    percentage: 0
  },
  thoughtful: {
    name: "The Strategic Mind",
    description: "You're the one who thinks three steps ahead. Your careful planning and attention to detail saves the team from technical debt and architectural nightmares.",
    color: "linear-gradient(90deg, #43e97b 0%, #38f9d7 100%)",
    traits: ["Strategic thinker", "Detail-oriented", "Problem solver", "Long-term vision"],
    percentage: 0
  },
  adventurous: {
    name: "The Innovation Explorer",
    description: "You're always pushing boundaries and trying new technologies. Your willingness to experiment leads to breakthrough solutions and keeps the team cutting-edge.",
    color: "linear-gradient(90deg, #b721ff 0%, #21d4fd 100%)",
    traits: ["Innovation driver", "Risk taker", "Tech explorer", "Creative visionary"],
    percentage: 0
  }
};

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

function VibeBar({ label, percent, color }) {
  return (
    <div className="vibe-bar-row">
      <span className="vibe-bar-label">{label}</span>
      <div className="vibe-bar-bg">
        <div
          className="vibe-bar-fill"
          style={{ width: `${percent}%`, background: color }}
        ></div>
      </div>
      <span className="vibe-bar-percent">{percent}%</span>
    </div>
  );
}

const App = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [result, setResult] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [userName, setUserName] = useState('');
  const [showNameInput, setShowNameInput] = useState(true);

  const handleAnswer = (value) => {
    const newAnswers = [...answers, value];
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      calculateResult(newAnswers);
    }
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

  if (showNameInput) {
    return (
      <div className="plain-bg">
        <div className="plain-modal">
          <div className="plain-title">🌈</div>
          <h1 className="plain-heading">Vibe Check</h1>
          <p className="plain-subheading">Discover your developer personality!</p>
          <input
            type="text"
            placeholder="Enter your name"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            className="plain-input"
            onKeyPress={(e) => e.key === 'Enter' && handleStartQuiz()}
          />
          <button
            onClick={handleStartQuiz}
            disabled={!userName.trim()}
            className="plain-btn"
          >
            Start Vibe Check ✨
          </button>
        </div>
        <style>{plainCss}</style>
      </div>
    );
  }

  if (showResult) {
    return (
      <div className="plain-bg">
        <div className="plain-modal result-modal">
          <div className="plain-icon">
            <span role="img" aria-label="bolt">⚡️</span>
          </div>
          <h2 className="plain-hello">
            Hey {result.userName}! <span className="wave">👋</span>
          </h2>
          <h3 className="plain-role">You're {result.name}</h3>
          <p className="plain-desc">{result.description}</p>
          <div className="plain-tags">
            {result.traits.map((trait, i) => (
              <div key={i} className="plain-tag">{trait}</div>
            ))}
          </div>
          <div className="plain-breakdown-title">Your Vibe Breakdown:</div>
          <div>
            {Object.entries(vibeTypes).map(([key, vibe]) => (
              <VibeBar
                key={key}
                label={vibe.name}
                percent={result.percentages[key] || 0}
                color={vibe.color}
              />
            ))}
          </div>
          <button className="plain-btn" onClick={resetQuiz} style={{marginTop: 24}}>Retake Quiz</button>
        </div>
        <style>{plainCss}</style>
      </div>
    );
  }

  const question = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="plain-bg">
      <div className="plain-modal">
        <div className="plain-progress-bar">
          <div className="plain-progress" style={{width: `${progress}%`}}></div>
        </div>
        <div className="plain-question">{question.text}</div>
        <div className="plain-options">
          {question.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswer(option.value)}
              className="plain-option"
            >
              <span className="plain-emoji">{option.emoji}</span>
              <span>{option.text}</span>
            </button>
          ))}
        </div>
        <div className="plain-footer">
          <p>Hey {userName}! Pick the option that vibes with you most 🌟</p>
        </div>
      </div>
      <style>{plainCss}</style>
    </div>
  );
};

const plainCss = `
.plain-bg {
  min-height: 100vh;
  background: linear-gradient(135deg, #6a82fb 0%, #fc5c7d 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
}
.plain-modal {
  background: rgba(30, 20, 60, 0.92);
  border-radius: 24px;
  padding: 40px 32px;
  width: 400px;
  max-width: 95vw;
  box-shadow: 0 8px 32px rgba(0,0,0,0.25);
  color: #fff;
  text-align: center;
  position: relative;
  margin: 32px 0;
}
.result-modal {
  padding-bottom: 32px;
}
.plain-title {
  font-size: 3rem;
  margin-bottom: 12px;
}
.plain-heading {
  font-size: 2.2rem;
  font-weight: bold;
  margin-bottom: 8px;
}
.plain-subheading {
  color: #e0d6ff;
  margin-bottom: 24px;
}
.plain-input {
  width: 100%;
  padding: 12px 16px;
  border-radius: 12px;
  border: none;
  margin-bottom: 18px;
  background: rgba(255,255,255,0.08);
  color: #fff;
  font-size: 1rem;
  outline: none;
}
.plain-btn {
  width: 100%;
  padding: 12px 0;
  border-radius: 12px;
  border: none;
  background: linear-gradient(90deg, #ff5e62 0%, #6a82fb 100%);
  color: #fff;
  font-weight: 600;
  font-size: 1.1rem;
  cursor: pointer;
  margin-top: 8px;
  transition: background 0.2s, transform 0.2s;
}
.plain-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
.plain-btn:hover:not(:disabled) {
  background: linear-gradient(90deg, #6a82fb 0%, #ff5e62 100%);
  transform: scale(1.04);
}
.plain-icon {
  background: linear-gradient(135deg, #ffb347 0%, #ff5e62 100%);
  width: 64px;
  height: 64px;
  border-radius: 50%;
  margin: 0 auto 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
}
.plain-hello {
  font-size: 1.6rem;
  font-weight: bold;
  margin-bottom: 4px;
}
.wave {
  font-size: 1.3rem;
}
.plain-role {
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 12px;
}
.plain-desc {
  color: #f3eaff;
  margin-bottom: 18px;
  font-size: 1.05rem;
}
.plain-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  justify-content: center;
  margin-bottom: 24px;
}
.plain-tag {
  background: rgba(255,255,255,0.08);
  border-radius: 12px;
  padding: 8px 18px;
  font-size: 1rem;
  font-weight: 500;
}
.plain-breakdown-title {
  text-align: left;
  font-weight: bold;
  margin-bottom: 10px;
  font-size: 1.1rem;
}
.vibe-bar-row {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}
.vibe-bar-label {
  flex: 1.5;
  font-size: 0.98rem;
  text-align: left;
}
.vibe-bar-bg {
  flex: 3;
  background: rgba(255,255,255,0.15);
  border-radius: 8px;
  height: 10px;
  margin: 0 10px;
  overflow: hidden;
}
.vibe-bar-fill {
  height: 100%;
  border-radius: 8px;
  transition: width 0.6s cubic-bezier(.4,0,.2,1);
}
.vibe-bar-percent {
  width: 38px;
  text-align: right;
  font-size: 0.95rem;
}
.plain-progress-bar {
  width: 100%;
  background: rgba(255,255,255,0.12);
  border-radius: 8px;
  height: 10px;
  margin-bottom: 24px;
  overflow: hidden;
}
.plain-progress {
  height: 100%;
  background: linear-gradient(90deg, #ff5e62 0%, #6a82fb 100%);
  border-radius: 8px;
  transition: width 0.5s;
}
.plain-question {
  font-size: 1.2rem;
  font-weight: bold;
  margin-bottom: 24px;
}
.plain-options {
  display: flex;
  flex-direction: column;
  gap: 14px;
  margin-bottom: 18px;
}
.plain-option {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 18px;
  border-radius: 12px;
  background: rgba(255,255,255,0.08);
  color: #fff;
  font-size: 1.05rem;
  border: none;
  cursor: pointer;
  transition: background 0.2s, transform 0.2s;
  text-align: left;
}
.plain-option:hover {
  background: rgba(255,255,255,0.18);
  transform: scale(1.03);
}
.plain-emoji {
  font-size: 1.5rem;
}
.plain-footer {
  margin-top: 18px;
  color: #e0d6ff;
  font-size: 0.98rem;
}
`;

export default App;