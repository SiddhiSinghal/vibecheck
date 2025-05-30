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
    id: 'butterfly_soul',
    name: 'Butterfly Soul',
    description: 'Achieved a Butterfly badge!',
    emoji: '🦋',
    condition: (history) => {
      return history.some(h => {
        const percentages = Object.values(h.percentages);
        return percentages.some(p => p === 20 || p === 40);
      });
    }
  }
];

function TeamDashboard({ onClose, userName, userResult }) {
  const [teamCode, setTeamCode] = useState('');
  const [setIsCreatingTeam] = useState(false);
  const [currentTeam, setCurrentTeam] = useState(null);
  const [teams, setTeams] = useState([]);

  useEffect(() => {
    const savedTeams = JSON.parse(localStorage.getItem('vibeCheckTeams')) || [];
    setTeams(savedTeams);
  }, []);

  const generateTeamCode = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  };

  const createTeam = () => {
    if (!userResult || !userName) return;
    
    const newTeamCode = generateTeamCode();
    const newTeam = {
      code: newTeamCode,
      name: `${userName}'s Team`,
      createdBy: userName,
      members: [{
        name: userName,
        vibe: userResult.primaryVibe,
        result: userResult,
        joinedAt: Date.now()
      }],
      createdAt: Date.now()
    };
    
    const updatedTeams = [...teams, newTeam];
    setTeams(updatedTeams);
    setCurrentTeam(newTeam);
    // Save to localStorage
    localStorage.setItem('vibeCheckTeams', JSON.stringify(updatedTeams));
    setIsCreatingTeam(false);
  };

  const joinTeam = () => {
    if (!teamCode || !userResult || !userName) return;
    
    const team = teams.find(t => t.code === teamCode.toUpperCase());
    if (!team) {
      alert('Team not found! Please check the code.');
      return;
    }
    
    const existingMember = team.members.find(m => m.name === userName);
    if (existingMember) {
      setCurrentTeam(team);
      return;
    }
    
    const updatedTeam = {
      ...team,
      members: [...team.members, {
        name: userName,
        vibe: userResult.primaryVibe,
        result: userResult,
        joinedAt: Date.now()
      }]
    };
    
    const updatedTeams = teams.map(t => t.code === team.code ? updatedTeam : t);
    setTeams(updatedTeams);
    setCurrentTeam(updatedTeam);
    // Save to localStorage
    localStorage.setItem('vibeCheckTeams', JSON.stringify(updatedTeams));
    setTeamCode('');
  };

  const getTeamCompatibility = (team) => {
    if (team.members.length < 2) return null;
    
    const vibeCompatibility = {
      chill: ['thoughtful', 'chill'],
      energy: ['adventurous', 'energy'],
      thoughtful: ['chill', 'thoughtful'],
      adventurous: ['energy', 'adventurous']
    };
    
    let compatiblePairs = 0;
    let totalPairs = 0;
    
    for (let i = 0; i < team.members.length; i++) {
      for (let j = i + 1; j < team.members.length; j++) {
        totalPairs++;
        const vibe1 = team.members[i].vibe;
        const vibe2 = team.members[j].vibe;
        
        if (vibeCompatibility[vibe1]?.includes(vibe2)) {
          compatiblePairs++;
        }
      }
    }
    
    return totalPairs > 0 ? Math.round((compatiblePairs / totalPairs) * 100) : 0;
  };

  if (currentTeam) {
    const compatibility = getTeamCompatibility(currentTeam);
    
    return (
      <div className="achievement-overlay">
        <div className="achievement-modal team-dashboard">
          <div className="achievement-header">
            <h3>🤝 Team: {currentTeam.name}</h3>
            <button className="close-btn" onClick={onClose}>×</button>
          </div>
          
          <div className="team-content">
            <div className="team-info">
              <div className="team-code">Team Code: <strong>{currentTeam.code}</strong></div>
              {compatibility !== null && (
                <div className="team-compatibility">
                  <div className="compatibility-score">
                    Team Compatibility: <strong>{compatibility}%</strong>
                    <div className="compatibility-bar">
                      <div 
                        className="compatibility-fill" 
                        style={{ width: `${compatibility}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="team-members">
              <h4>Team Members ({currentTeam.members.length})</h4>
              <div className="members-grid">
                {currentTeam.members.map((member, index) => (
                  <div key={index} className="member-card">
                    <div className="member-avatar">{vibeTypes[member.vibe].emoji}</div>
                    <div className="member-info">
                      <div className="member-name">{member.name}</div>
                      <div className="member-vibe">{vibeTypes[member.vibe].name}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="team-actions">
              <button 
                className="plain-btn secondary" 
                onClick={() => setCurrentTeam(null)}
              >
                Leave Team
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="achievement-overlay">
      <div className="achievement-modal team-dashboard">
        <div className="achievement-header">
          <h3>🤝 Team Collaboration</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        <div className="team-content">
          <div className="team-section">
            <h4>Create New Team</h4>
            <p>Start a team and invite others to compare vibes!</p>
            <button 
              className="plain-btn" 
              onClick={createTeam}
              disabled={!userResult}
            >
              Create Team 🚀
            </button>
          </div>
          
          <div className="team-divider">OR</div>
          
          <div className="team-section">
            <h4>Join Existing Team</h4>
            <input
              type="text"
              placeholder="Enter team code"
              value={teamCode}
              onChange={(e) => setTeamCode(e.target.value.toUpperCase())}
              className="plain-input"
              style={{ marginBottom: '12px' }}
            />
            <button 
              className="plain-btn secondary" 
              onClick={joinTeam}
              disabled={!teamCode || !userResult}
            >
              Join Team 🤝
            </button>
          </div>
          
          {teams.length > 0 && (
            <div className="team-section">
              <h4>Your Teams</h4>
              <div className="existing-teams">
                {teams.map((team, index) => (
                  <div key={index} className="team-item" onClick={() => setCurrentTeam(team)}>
                    <div className="team-item-name">{team.name}</div>
                    <div className="team-item-info">
                      {team.members.length} members • {team.code}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
function MoodDashboard({ history, onClose }) {
  const getLast7Days = () => {
    const today = new Date();
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      last7Days.push({
        date: date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
        fullDate: date.toDateString()
      });
    }
    return last7Days;
  };

  const getMoodTrend = () => {
    const last7Days = getLast7Days();
    return last7Days.map(day => {
      const dayResults = history.filter(h => {
        const resultDate = new Date(h.timestamp || Date.now());
        return resultDate.toDateString() === day.fullDate;
      });
      
      if (dayResults.length === 0) {
        return { ...day, vibe: null, emoji: '⭕', intensity: 0 };
      }
      
      const latestResult = dayResults[0];
      const vibe = vibeTypes[latestResult.primaryVibe];
      return {
        ...day,
        vibe: latestResult.primaryVibe,
        emoji: vibe.emoji,
        intensity: Math.max(...Object.values(latestResult.percentages))
      };
    });
  };

  const getVibeInsights = () => {
    if (history.length < 3) return null;
    
    const recentVibes = history.slice(0, 5).map(h => h.primaryVibe);
    const vibeCounts = recentVibes.reduce((acc, vibe) => {
      acc[vibe] = (acc[vibe] || 0) + 1;
      return acc;
    }, {});
    
    const dominantVibe = Object.keys(vibeCounts).reduce((a, b) => 
      vibeCounts[a] > vibeCounts[b] ? a : b
    );
    
    const trend = history.length >= 7 ? 
      (history[0].percentages[dominantVibe] > history[6].percentages[dominantVibe] ? 'increasing' : 'decreasing') 
      : 'stable';
    
    return { dominantVibe, trend };
  };

  const moodTrend = getMoodTrend();
  const insights = getVibeInsights();

  return (
    <div className="achievement-overlay">
      <div className="achievement-modal mood-dashboard">
        <div className="achievement-header">
          <h3>📊 Your Mood Dashboard</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        <div className="mood-content">
          <div className="mood-section">
            <h4>7-Day Mood Trend</h4>
            <div className="mood-timeline">
              {moodTrend.map((day, index) => (
                <div key={index} className="mood-day">
                  <div className="mood-day-emoji" style={{
                    fontSize: day.intensity ? `${Math.max(1.5, day.intensity / 30)}rem` : '1.5rem',
                    opacity: day.intensity ? 1 : 0.3
                  }}>
                    {day.emoji}
                  </div>
                  <div className="mood-day-label">{day.date}</div>
                  {day.intensity > 0 && (
                    <div className="mood-intensity-bar">
                      <div 
                        className="mood-intensity-fill" 
                        style={{
                          width: `${day.intensity}%`,
                          background: day.vibe ? vibeTypes[day.vibe].color : '#ccc'
                        }}
                      ></div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {insights && (
            <div className="mood-section">
              <h4>Mood Insights</h4>
              <div className="mood-insights">
                <div className="insight-card">
                  <div className="insight-icon">{vibeTypes[insights.dominantVibe].emoji}</div>
                  <div className="insight-content">
                    <div className="insight-title">Dominant Vibe</div>
                    <div className="insight-text">{vibeTypes[insights.dominantVibe].name}</div>
                  </div>
                </div>
                <div className="insight-card">
                  <div className="insight-icon">{insights.trend === 'increasing' ? '📈' : insights.trend === 'decreasing' ? '📉' : '➡️'}</div>
                  <div className="insight-content">
                    <div className="insight-title">Trend</div>
                    <div className="insight-text">
                      {insights.trend === 'increasing' ? 'Growing stronger' : 
                       insights.trend === 'decreasing' ? 'Slightly declining' : 'Staying consistent'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="mood-section">
            <h4>Vibe Distribution</h4>
            <div className="vibe-distribution">
              {Object.entries(vibeTypes).map(([key, vibe]) => {
                const count = history.filter(h => h.primaryVibe === key).length;
                const percentage = history.length > 0 ? Math.round((count / history.length) * 100) : 0;
                return (
                  <div key={key} className="distribution-item">
                    <div className="distribution-icon">{vibe.emoji}</div>
                    <div className="distribution-info">
                      <div className="distribution-name">{vibe.name.replace('The ', '')}</div>
                      <div className="distribution-bar">
                        <div 
                          className="distribution-fill" 
                          style={{ width: `${percentage}%`, background: vibe.color }}
                        ></div>
                      </div>
                      <div className="distribution-percent">{percentage}%</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function VibeRecommendations({ result, onClose }) {
  const getRecommendations = (vibe) => {
    const recommendations = {
      chill: {
        activities: [
          { emoji: '🧘‍♀️', title: 'Meditation Session', desc: 'Try a 10-minute mindfulness meditation' },
          { emoji: '📚', title: 'Read a Book', desc: 'Dive into a calming fiction or self-help book' },
          { emoji: '🌱', title: 'Indoor Plants', desc: 'Care for some plants to enhance your zen space' },
          { emoji: '🍵', title: 'Tea Time', desc: 'Brew your favorite herbal tea and enjoy the moment' }
        ],
        tools: [
          { name: 'Notion', desc: 'Organize your thoughts and projects calmly', icon: '📝' },
          { name: 'Forest App', desc: 'Stay focused with peaceful productivity', icon: '🌲' },
          { name: 'Calm', desc: 'Meditation and sleep stories', icon: '🌙' }
        ],
        workStyle: 'Take regular breaks, prefer quiet environments, and tackle complex problems with patience.'
      },
      energy: {
        activities: [
          { emoji: '🎵', title: 'Create Playlist', desc: 'Make an energizing coding playlist' },
          { emoji: '💃', title: 'Dance Break', desc: 'Take 5-minute dance breaks between tasks' },
          { emoji: '☕', title: 'Coffee Shop Work', desc: 'Work from a bustling coffee shop for energy' },
          { emoji: '🎮', title: 'Gamify Tasks', desc: 'Turn your work into challenges and competitions' }
        ],
        tools: [
          { name: 'Spotify', desc: 'High-energy playlists for coding', icon: '🎧' },
          { name: 'Todoist', desc: 'Gamified task management', icon: '✅' },
          { name: 'Discord', desc: 'Stay connected with your team', icon: '💬' }
        ],
        workStyle: 'Collaborate frequently, use time-boxing, and celebrate small wins to maintain momentum.'
      },
      thoughtful: {
        activities: [
          { emoji: '📊', title: 'Plan & Strategize', desc: 'Create detailed project roadmaps' },
          { emoji: '🔍', title: 'Research Deep Dive', desc: 'Explore new technologies thoroughly' },
          { emoji: '📖', title: 'Documentation', desc: 'Write comprehensive guides and docs' },
          { emoji: '🧩', title: 'Problem Solving', desc: 'Tackle complex algorithms and architecture' }
        ],
        tools: [
          { name: 'Obsidian', desc: 'Connected note-taking and knowledge management', icon: '🧠' },
          { name: 'Figma', desc: 'Design and plan before coding', icon: '🎨' },
          { name: 'Linear', desc: 'Structured project management', icon: '📋' }
        ],
        workStyle: 'Plan thoroughly before coding, document everything, and prefer detailed specifications.'
      },
      adventurous: {
        activities: [
          { emoji: '🚀', title: 'Try New Tech', desc: 'Experiment with the latest frameworks' },
          { emoji: '🌍', title: 'Remote Work', desc: 'Code from different locations for inspiration' },
          { emoji: '💡', title: 'Side Projects', desc: 'Build something completely different' },
          { emoji: '🎯', title: 'Hackathons', desc: 'Join coding competitions and challenges' }
        ],
        tools: [
          { name: 'GitHub Codespaces', desc: 'Code from anywhere with cloud environments', icon: '☁️' },
          { name: 'Repl.it', desc: 'Quick prototyping and experimentation', icon: '⚡' },
          { name: 'Product Hunt', desc: 'Discover new tools and get inspired', icon: '🔍' }
        ],
        workStyle: 'Embrace new technologies, take calculated risks, and don\'t be afraid to refactor boldly.'
      }
    };
    
    return recommendations[vibe] || recommendations.chill;
  };

  const recommendations = getRecommendations(result.primaryVibe);

  return (
    <div className="achievement-overlay">
      <div className="achievement-modal recommendations-dashboard">
        <div className="achievement-header">
          <h3>💡 Personalized Recommendations</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        <div className="recommendations-content">
          <div className="rec-intro">
            <div className="rec-vibe-icon">{vibeTypes[result.primaryVibe].emoji}</div>
            <h4>Perfect for {result.name}</h4>
            <p>Here are personalized suggestions to enhance your {result.name.toLowerCase()} energy!</p>
          </div>
          
          <div className="rec-section">
            <h4>🎯 Recommended Activities</h4>
            <div className="activities-grid">
              {recommendations.activities.map((activity, index) => (
                <div key={index} className="activity-card">
                  <div className="activity-emoji">{activity.emoji}</div>
                  <div className="activity-content">
                    <div className="activity-title">{activity.title}</div>
                    <div className="activity-desc">{activity.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="rec-section">
            <h4>🛠️ Recommended Tools</h4>
            <div className="tools-list">
              {recommendations.tools.map((tool, index) => (
                <div key={index} className="tool-item">
                  <div className="tool-icon">{tool.icon}</div>
                  <div className="tool-content">
                    <div className="tool-name">{tool.name}</div>
                    <div className="tool-desc">{tool.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="rec-section">
            <h4>💼 Work Style Tips</h4>
            <div className="work-style-card">
              <p>{recommendations.workStyle}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

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
  const [showMoodDashboard, setShowMoodDashboard] = useState(false);
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [showTeamDashboard, setShowTeamDashboard] = useState(false);

  useEffect(() => {
    const memoryHistory = window.vibeCheckHistory || [];
    setQuizHistory(memoryHistory);

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
          <style>{enhancedCss}</style>
          <button 
              className="plain-btn secondary" 
              onClick={() => setShowTeamDashboard(true)}
            >
              Team Collaboration 🤝
          </button>
          <button 
            className="plain-btn secondary" 
            onClick={() => setShowMoodDashboard(true)}
          >
          Mood Dashboard 📊
          </button>
          <style>{enhancedCss}</style>
          <button 
            className="plain-btn secondary" 
            onClick={() => setShowRecommendations(true)}
          >
          Get Recommendations 💡
          </button>
          <style>{enhancedCss}</style>
          {showMoodDashboard && (
          <MoodDashboard 
          history={quizHistory}
          onClose={() => setShowMoodDashboard(false)}
          />
        )}

        {showRecommendations && (
        <VibeRecommendations 
        result={result} 
        onClose={() => setShowRecommendations(false)}
        />
      )}
      {showTeamDashboard && (
          <TeamDashboard
            onClose={() => setShowTeamDashboard(false)}
            userName={userName}
            userResult={result}
          />
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
/* Mood Dashboard & Recommendations CSS */

/* Base overlay styling */
.achievement-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* Modal base styling */
.achievement-modal {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 20px;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.3);
  max-width: 90vw;
  max-height: 90vh;
  overflow-y: auto;
  animation: modalSlideIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  position: relative;
}

@keyframes modalSlideIn {
  from {
    transform: translateY(50px) scale(0.9);
    opacity: 0;
  }
  to {
    transform: translateY(0) scale(1);
    opacity: 1;
  }
}

/* Mood Dashboard Specific Styling */
.mood-dashboard {
  width: 800px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.recommendations-dashboard {
  width: 700px;
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

/* Header styling */
.achievement-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 25px 30px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
}

.achievement-header h3 {
  color: white;
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.close-btn {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  font-size: 1.5rem;
  width: 35px;
  height: 35px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(1.1);
}

/* Content areas */
.mood-content,
.recommendations-content {
  padding: 30px;
}

/* Mood sections */
.mood-section {
  margin-bottom: 30px;
}

.mood-section h4 {
  color: white;
  font-size: 1.2rem;
  font-weight: 600;
  margin: 0 0 20px 0;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
}

/* 7-Day Mood Timeline */
.mood-timeline {
  display: flex;
  gap: 15px;
  align-items: end;
  padding: 20px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  backdrop-filter: blur(10px);
}

.mood-day {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  position: relative;
}

.mood-day-emoji {
  margin-bottom: 10px;
  transition: all 0.3s ease;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
}

.mood-day-label {
  color: rgba(255, 255, 255, 0.9);
  font-size: 0.8rem;
  font-weight: 500;
  text-align: center;
  margin-bottom: 8px;
}

.mood-intensity-bar {
  width: 100%;
  height: 6px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 3px;
  overflow: hidden;
}

.mood-intensity-fill {
  height: 100%;
  border-radius: 3px;
  transition: width 0.8s ease;
  box-shadow: 0 0 10px rgba(255, 255, 255, 0.3);
}

/* Mood Insights */
.mood-insights {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
}

.insight-card {
  background: rgba(255, 255, 255, 0.15);
  padding: 20px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 15px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: transform 0.3s ease;
}

.insight-card:hover {
  transform: translateY(-2px);
}

.insight-icon {
  font-size: 2rem;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
}

.insight-content {
  flex: 1;
}

.insight-title {
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.9rem;
  font-weight: 500;
  margin-bottom: 5px;
}

.insight-text {
  color: white;
  font-size: 1rem;
  font-weight: 600;
}

/* Vibe Distribution */
.vibe-distribution {
  display: flex;
  flex-direction: column;
  gap: 12px;
  background: rgba(255, 255, 255, 0.1);
  padding: 20px;
  border-radius: 15px;
  backdrop-filter: blur(10px);
}

.distribution-item {
  display: flex;
  align-items: center;
  gap: 15px;
}

.distribution-icon {
  font-size: 1.5rem;
  width: 40px;
  text-align: center;
  filter: drop-shadow(0 1px 3px rgba(0, 0, 0, 0.3));
}

.distribution-info {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 15px;
}

.distribution-name {
  color: white;
  font-weight: 600;
  min-width: 80px;
  font-size: 0.9rem;
}

.distribution-bar {
  flex: 1;
  height: 8px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  overflow: hidden;
}

.distribution-fill {
  height: 100%;
  border-radius: 4px;
  transition: width 1s ease;
  box-shadow: 0 0 8px rgba(255, 255, 255, 0.4);
}

.distribution-percent {
  color: white;
  font-weight: 600;
  min-width: 40px;
  text-align: right;
  font-size: 0.9rem;
}

/* Recommendations Styling */
.rec-intro {
  text-align: center;
  margin-bottom: 30px;
  padding: 25px;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 15px;
  backdrop-filter: blur(10px);
}

.rec-vibe-icon {
  font-size: 3rem;
  margin-bottom: 15px;
  filter: drop-shadow(0 3px 6px rgba(0, 0, 0, 0.3));
}

.rec-intro h4 {
  color: white;
  font-size: 1.3rem;
  margin: 0 0 10px 0;
  font-weight: 700;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.rec-intro p {
  color: rgba(255, 255, 255, 0.9);
  margin: 0;
  font-size: 1rem;
}

.rec-section {
  margin-bottom: 30px;
}

.rec-section h4 {
  color: white;
  font-size: 1.2rem;
  font-weight: 600;
  margin: 0 0 20px 0;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
}

/* Activities Grid */
.activities-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 15px;
}

.activity-card {
  background: rgba(255, 255, 255, 0.15);
  padding: 20px;
  border-radius: 12px;
  display: flex;
  align-items: flex-start;
  gap: 15px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
}

.activity-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
}

.activity-emoji {
  font-size: 1.8rem;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
}

.activity-content {
  flex: 1;
}

.activity-title {
  color: white;
  font-weight: 600;
  font-size: 1rem;
  margin-bottom: 5px;
}

.activity-desc {
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.9rem;
  line-height: 1.4;
}

/* Tools List */
.tools-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.tool-item {
  background: rgba(255, 255, 255, 0.15);
  padding: 18px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 15px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
}

.tool-item:hover {
  transform: translateX(5px);
  background: rgba(255, 255, 255, 0.2);
}

.tool-icon {
  font-size: 1.5rem;
  width: 40px;
  text-align: center;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
}

.tool-content {
  flex: 1;
}

.tool-name {
  color: white;
  font-weight: 600;
  font-size: 1rem;
  margin-bottom: 3px;
}

.tool-desc {
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.9rem;
}

/* Work Style Card */
.work-style-card {
  background: rgba(255, 255, 255, 0.15);
  padding: 25px;
  border-radius: 15px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.work-style-card p {
  color: white;
  font-size: 1rem;
  line-height: 1.6;
  margin: 0;
  font-weight: 500;
}

/* Responsive Design */
@media (max-width: 768px) {
  .mood-dashboard,
  .recommendations-dashboard {
    width: 95vw;
    margin: 20px;
  }
  
  .mood-content,
  .recommendations-content {
    padding: 20px;
  }
  
  .mood-timeline {
    gap: 8px;
    padding: 15px;
  }
  
  .mood-day-emoji {
    font-size: 1.2rem !important;
  }
  
  .mood-day-label {
    font-size: 0.7rem;
  }
  
  .mood-insights {
    grid-template-columns: 1fr;
  }
  
  .activities-grid {
    grid-template-columns: 1fr;
  }
  
  .achievement-header {
    padding: 20px;
  }
  
  .achievement-header h3 {
    font-size: 1.3rem;
  }
}

@media (max-width: 480px) {
  .mood-timeline {
    flex-wrap: wrap;
    justify-content: center;
  }
  
  .mood-day {
    min-width: 60px;
  }
  
  .distribution-info {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
  
  .distribution-name {
    min-width: auto;
  }
  
  .distribution-bar {
    width: 100%;
  }
  
  .activity-card,
  .tool-item {
    flex-direction: column;
    text-align: center;
  }
  
  .activity-emoji,
  .tool-icon {
    margin-bottom: 10px;
  }
}

/* Accessibility improvements */
@media (prefers-reduced-motion: reduce) {
  .achievement-overlay,
  .achievement-modal,
  .mood-day-emoji,
  .mood-intensity-fill,
  .distribution-fill,
  .activity-card,
  .tool-item {
    animation: none;
    transition: none;
  }
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  .achievement-modal {
    border: 2px solid white;
  }
  
  .mood-timeline,
  .insight-card,
  .vibe-distribution,
  .activity-card,
  .tool-item,
  .work-style-card {
    border: 1px solid rgba(255, 255, 255, 0.5);
  }
}

/* Print styles */
@media print {
  .achievement-overlay {
    position: relative;
    background: white;
    color: black;
  }
  
  .achievement-modal {
    box-shadow: none;
    background: white;
    color: black;
  }
  
  .close-btn {
    display: none;
  }
}
/* Achievement Modal Styles */
.achievement-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.3s ease-out;
}

.achievement-modal {
  background: rgba(30, 20, 60, 0.95);
  border-radius: 24px;
  padding: 32px;
  width: 500px;
  max-width: 90vw;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
  color: #fff;
  position: relative;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.achievement-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.achievement-header h3 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: bold;
  background: linear-gradient(135deg, #ff5e62, #6a82fb);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.close-btn {
  background: rgba(255, 255, 255, 0.1);
  border: none;
  color: #fff;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  font-size: 1.2rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: scale(1.1);
}

.achievement-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.achievement-item {
  display: flex;
  align-items: center;
  padding: 16px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  transition: all 0.3s ease;
  border: 1px solid transparent;
}

.achievement-item.earned {
  background: linear-gradient(135deg, rgba(255, 94, 98, 0.1), rgba(106, 130, 251, 0.1));
  border: 1px solid rgba(255, 255, 255, 0.1);
  animation: achievementGlow 2s ease-in-out infinite alternate;
}

.achievement-item:hover {
  transform: translateY(-2px);
  background: rgba(255, 255, 255, 0.1);
}

.achievement-emoji {
  font-size: 2.5rem;
  margin-right: 16px;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3));
}

.achievement-content {
  flex: 1;
}

.achievement-name {
  font-size: 1.2rem;
  font-weight: bold;
  margin-bottom: 4px;
  color: #fff;
}

.achievement-desc {
  font-size: 0.95rem;
  color: #e0d6ff;
  line-height: 1.4;
}

.achievement-empty {
  text-align: center;
  padding: 40px 20px;
  opacity: 0.7;
}

.achievement-empty-icon {
  font-size: 4rem;
  display: block;
  margin-bottom: 20px;
  filter: grayscale(50%);
}

.achievement-empty p {
  margin: 8px 0;
  font-size: 1rem;
}

.achievement-empty p:first-of-type {
  font-weight: bold;
  font-size: 1.1rem;
}

/* Comparison Chart Styles */
.comparison-modal {
  width: 600px;
  max-width: 95vw;
}

.comparison-chart {
  padding: 20px 0;
}

.comparison-chart h4 {
  margin: 0 0 24px 0;
  font-size: 1.3rem;
  font-weight: bold;
  text-align: center;
  color: #fff;
}

.chart-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.chart-row {
  display: flex;
  align-items: center;
  gap: 16px;
}

.chart-label {
  min-width: 120px;
  font-size: 0.95rem;
  font-weight: 500;
  text-align: right;
  color: #e0d6ff;
}

.chart-bars {
  flex: 1;
  display: flex;
  align-items: end;
  gap: 8px;
  height: 60px;
  padding: 8px 0;
}

.chart-bar-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  min-height: 60px;
}

.chart-bar {
  width: 100%;
  min-height: 4px;
  border-radius: 4px;
  transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.chart-value {
  font-size: 0.8rem;
  color: #b0b0b0;
  font-weight: 500;
  text-align: center;
  min-height: 16px;
}

/* Animations */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes achievementGlow {
  0% {
    box-shadow: 0 4px 20px rgba(255, 94, 98, 0.2);
  }
  100% {
    box-shadow: 0 4px 20px rgba(106, 130, 251, 0.3);
  }
}

/* Responsive Design */
@media (max-width: 600px) {
  .achievement-modal {
    padding: 24px 20px;
    margin: 20px;
  }
  
  .comparison-modal {
    width: 95vw;
  }
  
  .chart-row {
    flex-direction: column;
    align-items: stretch;
    gap: 8px;
  }
  
  .chart-label {
    text-align: left;
    min-width: auto;
    font-size: 1rem;
  }
  
  .chart-bars {
    height: 40px;
  }
  
  .achievement-item {
    padding: 12px;
  }
  
  .achievement-emoji {
    font-size: 2rem;
    margin-right: 12px;
  }
  
  .achievement-name {
    font-size: 1.1rem;
  }
  
  .achievement-desc {
    font-size: 0.9rem;
  }
}

/* Scrollbar Styling for Achievement Modal */
.achievement-modal::-webkit-scrollbar {
  width: 6px;
}

.achievement-modal::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
}

.achievement-modal::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 3px;
}

.achievement-modal::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.5);
}
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