import React, { useState, useEffect } from 'react';

const achievements = [
  {
    id: 'first_quiz',
    name: 'First Steps',
    description: 'Completed your first vibe check!',
    emoji: '🌟',
    condition: (history) => history.length >= 1
  },
  {
    id: 'quiz_master',
    name: 'Quiz Master',
    description: 'Completed 5 vibe checks!',
    emoji: '🏆',
    condition: (history) => history.length >= 5
  },
  {
    id: 'vibe_explorer',
    name: 'Vibe Explorer',
    description: 'Discovered all 4 different vibe types!',
    emoji: '🌈',
    condition: (history) => {
      const uniqueVibes = new Set(history.map(h => h.primaryVibe));
      return uniqueVibes.size >= 4;
    }
  },
  {
    id: 'consistent_vibe',
    name: 'Consistent Vibe',
    description: 'Got the same result 3 times in a row!',
    emoji: '🎯',
    condition: (history) => {
      if (history.length < 3) return false;
      const lastThree = history.slice(0, 3);
      return lastThree.every(h => h.primaryVibe === lastThree[0].primaryVibe);
    }
  },
  {
    id: 'balanced_soul',
    name: 'Balanced Soul',
    description: 'Achieved a perfectly balanced result (25% each)!',
    emoji: '⚖️',
    condition: (history) => {
      return history.some(h => {
        const percentages = Object.values(h.percentages);
        return percentages.every(p => p === 25);
      });
    }
  }
];

function AchievementModal({ achievements, onClose }) {
  return (
    <div className="achievement-overlay">
      <div className="achievement-modal">
        <div className="achievement-header">
          <h3>🏆 Your Achievements</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        <div className="achievement-list">
          {achievements.map((achievement) => (
            <div key={achievement.id} className="achievement-item earned">
              <div className="achievement-emoji">{achievement.emoji}</div>
              <div className="achievement-content">
                <div className="achievement-name">{achievement.name}</div>
                <div className="achievement-desc">{achievement.description}</div>
              </div>
            </div>
          ))}
          {achievements.length === 0 && (
            <div className="achievement-empty">
              <span className="achievement-empty-icon">🎯</span>
              <p>No achievements yet!</p>
              <p>Complete more quizzes to unlock achievements.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ComparisonChart({ results }) {
  const vibeNames = Object.keys(vibeTypes);
  const chartData = vibeNames.map(vibe => ({
    vibe: vibeTypes[vibe].name.replace('The ', ''),
    ...results.reduce((acc, result, index) => ({
      ...acc,
      [`Quiz ${index + 1}`]: result.percentages[vibe] || 0
    }), {})
  }));

  return (
    <div className="comparison-chart">
      <h4>Vibe Evolution 📈</h4>
      <div className="chart-container">
        {chartData.map((data, index) => (
          <div key={index} className="chart-row">
            <div className="chart-label">{data.vibe}</div>
            <div className="chart-bars">
              {results.map((_, quizIndex) => (
                <div key={quizIndex} className="chart-bar-container">
                  <div 
                    className="chart-bar"
                    style={{
                      height: `${data[`Quiz ${quizIndex + 1}`]}%`,
                      background: vibeTypes[vibeNames[index]].color
                    }}
                  ></div>
                  <span className="chart-value">{data[`Quiz ${quizIndex + 1}`]}%</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const vibeTypes = {
  chill: {
    name: "The Zen Coder",
    description: "You bring calm, steady energy to any team. Your thoughtful approach and ability to stay cool under pressure makes you the perfect person to have during crunch time.",
    color: "linear-gradient(90deg, #6dd5ed 0%, #b2b6ff 100%)",
    traits: ["Calm under pressure", "Great listener", "Steady contributor", "Zen master"],
    emoji: "🧘",
    percentage: 0
  },
  energy: {
    name: "The Hype Developer",
    description: "You're the spark that ignites the team! Your enthusiasm is contagious, and you turn mundane standup meetings into exciting collaboration sessions.",
    color: "linear-gradient(90deg, #ff7300 0%, #ff5e62 100%)",
    traits: ["High energy", "Team motivator", "Creative problem solver", "Vibe curator"],
    emoji: "⚡",
    percentage: 0
  },
  thoughtful: {
    name: "The Strategic Mind",
    description: "You're the one who thinks three steps ahead. Your careful planning and attention to detail saves the team from technical debt and architectural nightmares.",
    color: "linear-gradient(90deg, #43e97b 0%, #38f9d7 100%)",
    traits: ["Strategic thinker", "Detail-oriented", "Problem solver", "Long-term vision"],
    emoji: "🧠",
    percentage: 0
  },
  adventurous: {
    name: "The Innovation Explorer",
    description: "You're always pushing boundaries and trying new technologies. Your willingness to experiment leads to breakthrough solutions and keeps the team cutting-edge.",
    color: "linear-gradient(90deg, #b721ff 0%, #21d4fd 100%)",
    traits: ["Innovation driver", "Risk taker", "Tech explorer", "Creative visionary"],
    emoji: "🚀",
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

function ShareButton({ result, onShare }) {
  const shareText = `I just found out I'm ${result.name}! 🌟 ${result.description.slice(0, 100)}... Take the Vibe Check quiz too! ✨`;
  
  const handleShare = async (platform) => {
    const url = window.location.href;
    let shareUrl = '';
    
    switch(platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(url)}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
        break;
      case 'copy':
        try {
          await navigator.clipboard.writeText(`${shareText}\n\n${url}`);
          onShare('Results copied to clipboard! 📋');
          return;
        } catch (err) {
          onShare('Unable to copy to clipboard');
          return;
        }
      default:
        return;
    }
    
    window.open(shareUrl, '_blank', 'width=600,height=400');
    onShare('Thanks for sharing! 🎉');
  };

  return (
    <div className="share-container">
      <div className="share-title">Share Your Vibe! 🌟</div>
      <div className="share-buttons">
        <button className="share-btn twitter" onClick={() => handleShare('twitter')}>
          🐦 Twitter
        </button>
        <button className="share-btn linkedin" onClick={() => handleShare('linkedin')}>
          💼 LinkedIn
        </button>
        <button className="share-btn copy" onClick={() => handleShare('copy')}>
          📋 Copy
        </button>
      </div>
    </div>
  );
}

function QuizHistory({ history, onViewResult, onClearHistory }) {
  if (history.length === 0) {
    return (
      <div className="history-empty">
        <span className="history-empty-icon">📊</span>
        <p>No quiz history yet!</p>
        <p>Complete a quiz to see your results here.</p>
      </div>
    );
  }

  return (
    <div className="history-container">
      <div className="history-header">
        <h3>Your Quiz History 📈</h3>
        <button className="clear-history-btn" onClick={onClearHistory}>
          Clear All
        </button>
      </div>
      <div className="history-list">
        {history.map((result, index) => (
          <div key={index} className="history-item" onClick={() => onViewResult(result)}>
            <div className="history-item-emoji">{vibeTypes[result.primaryVibe].emoji}</div>
            <div className="history-item-content">
              <div className="history-item-name">{result.name}</div>
              <div className="history-item-date">{result.date}</div>
            </div>
            <div className="history-item-arrow">→</div>
          </div>
        ))}
      </div>
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
  const [showHistory, setShowHistory] = useState(false);
  const [quizHistory, setQuizHistory] = useState([]);
  const [shareMessage, setShareMessage] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);
  const [showComparison, setShowComparison] = useState(false);
  const [comparisonResults, setComparisonResults] = useState([]);
  const [showAchievements, setShowAchievements] = useState(false);
  const [userAchievements, setUserAchievements] = useState([]);

  // Load history from memory on component mount
  useEffect(() => {
    const memoryHistory = window.vibeCheckHistory || [];
    setQuizHistory(memoryHistory);
    
    // Load achievements
    const memoryAchievements = window.vibeCheckAchievements || [];
    setUserAchievements(memoryAchievements);
  }, []);

  const saveToHistory = (resultData) => {
    const historyEntry = {
      ...resultData,
      date: new Date().toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
      }),
      timestamp: Date.now()
    };
    
    const newHistory = [historyEntry, ...quizHistory].slice(0, 10); // Keep only last 10 results
    setQuizHistory(newHistory);
    
    // Store in memory instead of localStorage for Claude artifacts
    window.vibeCheckHistory = newHistory;
    
    // Check for new achievements
    checkAchievements(newHistory);
  };

  const checkAchievements = (history) => {
    const newAchievements = [];
    achievements.forEach(achievement => {
      if (achievement.condition(history) && !userAchievements.find(a => a.id === achievement.id)) {
        newAchievements.push(achievement);
      }
    });
    
    if (newAchievements.length > 0) {
      const updatedAchievements = [...userAchievements, ...newAchievements];
      setUserAchievements(updatedAchievements);
      window.vibeCheckAchievements = updatedAchievements;
      
      // Show achievement notification
      setTimeout(() => {
        setShareMessage(`🎉 New achievement unlocked: ${newAchievements[0].name}!`);
        setTimeout(() => setShareMessage(''), 4000);
      }, 1000);
    }
  };

  const handleAnswer = (value) => {
    setIsAnimating(true);
    
    setTimeout(() => {
      const newAnswers = [...answers, value];
      setAnswers(newAnswers);

      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
      } else {
        calculateResult(newAnswers);
      }
      setIsAnimating(false);
    }, 300);
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
    saveToHistory(resultData);
    setShowResult(true);
  };

  const handleStartQuiz = () => {
    if (userName.trim()) {
      setShowNameInput(false);
    }
  };

  const resetQuiz = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentQuestion(0);
      setAnswers([]);
      setResult(null);
      setShowResult(false);
      setShowNameInput(true);
      setUserName('');
      setShareMessage('');
      setIsAnimating(false);
    }, 300);
  };

  const viewHistoryResult = (historicalResult) => {
    setResult(historicalResult);
    setShowResult(true);
    setShowHistory(false);
  };

  const clearHistory = () => {
    setQuizHistory([]);
    window.vibeCheckHistory = [];
    setUserAchievements([]);
    window.vibeCheckAchievements = [];
  };

  const showComparisons = () => {
    if (quizHistory.length >= 2) {
      setComparisonResults(quizHistory.slice(0, 5)); // Show last 5 results
      setShowComparison(true);
    }
  };

  const handleShare = (message) => {
    setShareMessage(message);
    setTimeout(() => setShareMessage(''), 3000);
  };

  if (showNameInput) {
    return (
      <div className="plain-bg">
        <div className={`plain-modal ${isAnimating ? 'fade-out' : 'fade-in'}`}>
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
          {quizHistory.length > 0 && (
            <button
              onClick={() => setShowHistory(true)}
              className="plain-btn secondary"
            >
              View Quiz History 📊
            </button>
          )}
          {userAchievements.length > 0 && (
            <button
              onClick={() => setShowAchievements(true)}
              className="plain-btn secondary"
            >
              View Achievements 🏆
            </button>
          )}
        </div>
        <style>{enhancedCss}</style>
        {showAchievements && (
          <AchievementModal 
            achievements={userAchievements} 
            onClose={() => setShowAchievements(false)} 
          />
        )}
        {showComparison && (
          <div className="achievement-overlay">
            <div className="achievement-modal comparison-modal">
              <div className="achievement-header">
                <h3>📊 Vibe Comparison</h3>
                <button className="close-btn" onClick={() => setShowComparison(false)}>×</button>
              </div>
              <ComparisonChart results={comparisonResults} />
            </div>
          </div>
        )}
      </div>
    );
  }

  if (showHistory) {
    return (
      <div className="plain-bg">
        <div className="plain-modal history-modal">
          <QuizHistory 
            history={quizHistory}
            onViewResult={viewHistoryResult}
            onClearHistory={clearHistory}
          />
          <button 
            className="plain-btn" 
            onClick={() => setShowHistory(false)}
            style={{marginTop: 20}}
          >
            Back to Quiz
          </button>
        </div>
        <style>{enhancedCss}</style>
        {showAchievements && (
          <AchievementModal 
            achievements={userAchievements} 
            onClose={() => setShowAchievements(false)} 
          />
        )}
        {showComparison && (
          <div className="achievement-overlay">
            <div className="achievement-modal comparison-modal">
              <div className="achievement-header">
                <h3>📊 Vibe Comparison</h3>
                <button className="close-btn" onClick={() => setShowComparison(false)}>×</button>
              </div>
              <ComparisonChart results={comparisonResults} />
            </div>
          </div>
        )}
      </div>
    );
  }

  if (showResult) {
    return (
      <div className="plain-bg">
        <div className={`plain-modal result-modal ${isAnimating ? 'fade-out' : 'fade-in'}`}>
          <div className="plain-icon">
            <span role="img" aria-label="result">{vibeTypes[result.primaryVibe].emoji}</span>
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
          
          <ShareButton result={result} onShare={handleShare} />
          
          {shareMessage && (
            <div className="share-message">{shareMessage}</div>
          )}
          
          <div className="result-actions">
            <button className="plain-btn" onClick={resetQuiz}>
              Retake Quiz
            </button>
            <button 
              className="plain-btn secondary" 
              onClick={() => setShowHistory(true)}
            >
              View History
            </button>
            {quizHistory.length >= 2 && (
              <button 
                className="plain-btn secondary" 
                onClick={showComparisons}
              >
                Compare Results 📊
              </button>
            )}
            {userAchievements.length > 0 && (
              <button 
                className="plain-btn secondary" 
                onClick={() => setShowAchievements(true)}
              >
                Achievements 🏆
              </button>
            )}
          </div>
        </div>
        <style>{enhancedCss}</style>
        {showAchievements && (
          <AchievementModal 
            achievements={userAchievements} 
            onClose={() => setShowAchievements(false)} 
          />
        )}
        {showComparison && (
          <div className="achievement-overlay">
            <div className="achievement-modal comparison-modal">
              <div className="achievement-header">
                <h3>📊 Vibe Comparison</h3>
                <button className="close-btn" onClick={() => setShowComparison(false)}>×</button>
              </div>
              <ComparisonChart results={comparisonResults} />
            </div>
          </div>
        )}
      </div>
    );
  }

  const question = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="plain-bg">
      <div className={`plain-modal ${isAnimating ? 'slide-out' : 'slide-in'}`}>
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
              disabled={isAnimating}
            >
              <span className="plain-emoji">{option.emoji}</span>
              <span>{option.text}</span>
            </button>
          ))}
        </div>
        <div className="plain-footer">
          <p>Hey {userName}! Pick the option that vibes with you most 🌟</p>
          <div className="question-counter">
            Question {currentQuestion + 1} of {questions.length}
          </div>
        </div>
      </div>
      <style>{enhancedCss}</style>
    </div>
  );
};


const enhancedCss = `
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
  transition: all 0.3s ease;
}
.result-modal {
  padding-bottom: 32px;
}
.history-modal {
  width: 450px;
  max-height: 80vh;
  overflow-y: auto;
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
  transition: all 0.2s;
}
.plain-btn.secondary {
  background: rgba(255,255,255,0.1);
  margin-top: 12px;
}
.plain-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
.plain-btn:hover:not(:disabled) {
  background: linear-gradient(90deg, #6a82fb 0%, #ff5e62 100%);
  transform: scale(1.02);
}
.plain-btn.secondary:hover {
  background: rgba(255,255,255,0.15);
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
  animation: wave 2s infinite;
}
@keyframes wave {
  0%, 100% { transform: rotate(0deg); }
  25% { transform: rotate(15deg); }
  75% { transform: rotate(-15deg); }
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
  transition: all 0.2s;
  text-align: left;
}
.plain-option:hover:not(:disabled) {
  background: rgba(255,255,255,0.18);
  transform: scale(1.02);
}
.plain-option:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
.plain-emoji {
  font-size: 1.5rem;
}
.plain-footer {
  margin-top: 18px;
  color: #e0d6ff;
  font-size: 0.98rem;
}
.question-counter {
  margin-top: 8px;
  font-size: 0.85rem;
  opacity: 0.7;
}

/* Share Features */
.share-container {
  margin: 24px 0;
  padding: 20px;
  background: rgba(255,255,255,0.05);
  border-radius: 16px;
}
.share-title {
  font-weight: bold;
  margin-bottom: 12px;
  font-size: 1.1rem;
}
.share-buttons {
  display: flex;
  gap: 8px;
  justify-content: center;
}
.share-btn {
  padding: 8px 16px;
  border-radius: 8px;
  border: none;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s;
  font-weight: 500;
}
.share-btn.twitter {
  background: #1da1f2;
  color: white;
}
.share-btn.linkedin {
  background: #0077b5;
  color: white;
}
.share-btn.copy {
  background: rgba(255,255,255,0.1);
  color: white;
}
.share-btn:hover {
  transform: scale(1.05);
}
.share-message {
  background: rgba(76, 175, 80, 0.2);
  color: #4caf50;
  padding: 8px 16px;
  border-radius: 8px;
  margin: 12px 0;
  font-size: 0.9rem;
}

/* History Features */
.history-container {
  text-align: left;
}
.history-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}
.history-header h3 {
  margin: 0;
  font-size: 1.3rem;
}
.clear-history-btn {
  background: rgba(255,255,255,0.1);
  border: none;
  color: #ff6b6b;
  padding: 4px 12px;
  border-radius: 6px;
  font-size: 0.8rem;
  cursor: pointer;
}
.history-list {
  max-height: 300px;
  overflow-y: auto;
}
.history-item {
  display: flex;
  align-items: center;
  padding: 12px;
  margin-bottom: 8px;
  background: rgba(255,255,255,0.05);
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s;
}
.history-item:hover {
  background: rgba(255,255,255,0.1);
  transform: translateX(4px);
}
.history-item-emoji {
  font-size: 1.8rem;
  margin-right: 12px;
}
.history-item-content {
  flex: 1;
}
.history-item-name {
  font-weight: 600;
  font-size: 1rem;
}
.history-item-date {
  font-size: 0.8rem;
  opacity: 0.7;
  margin-top: 2px;
}
.history-item-arrow {
  opacity: 0.5;
  font-size: 1.2rem;
}
.history-empty {
  text-align: center;
  padding: 40px 20px;
  opacity: 0.7;
}
.history-empty-icon {
  font-size: 3rem;
  display: block;
  margin-bottom: 16px;
}
.result-actions {
  display: flex;
  gap: 12px;
  margin-top: 20px;
}
.result-actions .plain-btn {
  margin-top: 0;
}

/* Animations */
.fade-in {
  animation: fadeIn 0.5s ease-in;
}
.fade-out {
  animation: fadeOut 0.3s ease-out;
}
.slide-in {
  animation: slideIn 0.4s ease-out;
}
.slide-out {
  animation: slideOut 0.3s ease-in;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes fadeOut {
  from { opacity: 1; transform: translateY(0); }
  to { opacity: 0; transform: translateY(-20px); }
}
@keyframes slideIn {
  from { opacity: 0; transform: translateX(30px); }
  to { opacity: 1; transform: translateX(0); }
}
@keyframes slideOut {
  from { opacity: 1; transform: translateX(0); }
  to { opacity: 0; transform: translateX(-30px); }
}
`;

export default App;