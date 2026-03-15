import React, { useState, useEffect } from 'react'
import { getDailyQuestions, PASS_SCORE } from '../quizQuestions'

const SARCASTIC_WRONG = [
  "Nope. Try again, genius. 🤦",
  "Really? REALLY? 😐",
  "She's going to be so disappointed. 😬",
  "Bold guess. Incredibly wrong. 💀",
  "Did you even try? 🙃",
]
const SARCASTIC_CORRECT = [
  "Ok fine, correct. 🙄",
  "Wow, you do listen sometimes. 😮",
  "Lucky guess but sure. 🎲",
  "She'd be mildly impressed. 😌",
]
const FAIL_MSGS = [
  "Go study your girlfriend. 📚",
  "She told you this. Multiple times. 😤",
  "Unbelievable. Truly. 💀",
  "This is embarrassing for you. 😂",
]

function rand(arr) { return arr[Math.floor(Math.random() * arr.length)] }

// Simple pixel cloud SVG
function Cloud({ style }) {
  return (
    <div style={{ position: 'absolute', ...style }}>
      <svg width="80" height="40" viewBox="0 0 80 40">
        <ellipse cx="40" cy="28" rx="35" ry="12" fill="white" opacity="0.9" />
        <ellipse cx="28" cy="22" rx="18" ry="14" fill="white" opacity="0.9" />
        <ellipse cx="52" cy="20" rx="16" ry="13" fill="white" opacity="0.9" />
      </svg>
    </div>
  )
}

export default function EntryGate({ onEnter }) {
  const [questions] = useState(getDailyQuestions)
  const [phase, setPhase] = useState('quiz')
  const [current, setCurrent] = useState(0)
  const [score, setScore] = useState(0)
  const [selected, setSelected] = useState(null)
  const [feedback, setFeedback] = useState(null)
  const [feedbackMsg, setFeedbackMsg] = useState('')
  const [coins, setCoins] = useState([])

  useEffect(() => {
    if (phase === 'success') {
      const interval = setInterval(() => {
        setCoins(c => [...c, { id: Math.random(), x: 20 + Math.random() * 60 }])
      }, 150)
      setTimeout(() => { clearInterval(interval); setTimeout(onEnter, 800) }, 2500)
      return () => clearInterval(interval)
    }
  }, [phase, onEnter])

  const handleAnswer = (opt) => {
    if (feedback) return
    setSelected(opt)
    const correct = opt === questions[current].answer
    const newScore = correct ? score + 1 : score
    setFeedback(correct ? 'correct' : 'wrong')
    setFeedbackMsg(correct ? rand(SARCASTIC_CORRECT) : rand(SARCASTIC_WRONG))
    setTimeout(() => {
      setFeedback(null); setSelected(null); setFeedbackMsg('')
      if (correct) setScore(newScore)
      if (current + 1 >= questions.length) {
        setPhase(newScore >= PASS_SCORE ? 'success' : 'failed')
      } else {
        setCurrent(c => c + 1)
      }
    }, 1000)
  }

  const retry = () => { setCurrent(0); setScore(0); setSelected(null); setFeedback(null); setFeedbackMsg(''); setPhase('quiz') }

  return (
    <div style={styles.gate}>
      <Cloud style={{ top: '8%', left: '5%' }} />
      <Cloud style={{ top: '12%', left: '60%' }} />
      <Cloud style={{ top: '25%', left: '30%', transform: 'scale(0.7)' }} />

      {phase === 'success' && (
        <div style={styles.overlay}>
          {coins.map(c => (
            <div key={c.id} style={{ ...styles.coin, left: `${c.x}%` }}>🪙</div>
          ))}
          <div style={{ ...styles.box, textAlign: 'center', animation: 'pop 0.4s ease' }}>
            <div style={{ fontSize: 64, marginBottom: 8 }}>🍄</div>
            <div className="pixel-title" style={{ fontSize: 14, color: 'var(--green)', marginBottom: 8 }}>ACCESS GRANTED!</div>
            <p style={{ fontSize: 16, color: 'var(--text2)', fontWeight: 700 }}>She'd be mildly impressed. 😌</p>
          </div>
        </div>
      )}

      {phase === 'failed' && (
        <div style={styles.centerWrap}>
          <div style={{ ...styles.box, ...styles.failBox }}>
            <div style={{ fontSize: 56, marginBottom: 8 }}>💀</div>
            <div className="pixel-title" style={{ fontSize: 12, color: 'var(--red)', marginBottom: 12 }}>GAME OVER</div>
            <p style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)', marginBottom: 4 }}>{rand(FAIL_MSGS)}</p>
            <p style={{ fontSize: 14, color: 'var(--text2)', marginBottom: 20 }}>
              {score}/{questions.length} correct. Need {PASS_SCORE} to enter.
            </p>
            <button className="btn btn-red" onClick={retry}>🔄 Try Again</button>
          </div>
        </div>
      )}

      {phase === 'quiz' && (
        <div style={styles.centerWrap}>
          <div style={styles.box}>
            {/* Header */}
            <div style={styles.titleArea}>
              <div style={{ fontSize: 40, animation: 'float 2s ease-in-out infinite' }}>❤️</div>
              <div>
                <div className="pixel-title" style={{ fontSize: 11, color: 'var(--red)', marginBottom: 4 }}>HELENA & SAMI</div>
                <p style={{ fontSize: 14, color: 'var(--text2)', fontWeight: 600 }}>prove u know ur girl to enter 🎮</p>
              </div>
              <div style={{ fontSize: 40, animation: 'float 2s ease-in-out infinite 0.5s' }}>⭐</div>
            </div>

            {/* Progress */}
            <div style={styles.progressWrap}>
              {questions.map((_, i) => (
                <div key={i} style={{
                  ...styles.pip,
                  background: i < current
                    ? (i < score ? 'var(--green)' : 'var(--red)')
                    : i === current ? 'var(--yellow)' : '#ddd'
                }} />
              ))}
              <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text2)', marginLeft: 8 }}>
                Q{current + 1}/{questions.length}
              </span>
            </div>

            {/* Question */}
            <div style={styles.questionBox}>
              <span style={{ fontSize: 18 }}>❓</span>
              <p style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)', lineHeight: 1.5 }}>
                {questions[current].question}
              </p>
            </div>

            {/* Feedback */}
            {feedbackMsg && (
              <div style={{ ...styles.feedbackBubble, background: feedback === 'correct' ? '#e8f8e8' : '#fce8e8', borderColor: feedback === 'correct' ? 'var(--green)' : 'var(--red)' }}>
                <p style={{ fontSize: 15, fontWeight: 700, color: feedback === 'correct' ? 'var(--green-dark)' : 'var(--red-dark)' }}>
                  {feedbackMsg}
                </p>
              </div>
            )}

            {/* Options */}
            <div style={styles.options}>
              {questions[current].options.map(opt => {
                let bg = 'white', border = '#ddd', color = 'var(--text)'
                if (selected === opt) {
                  if (feedback === 'correct') { bg = '#e8f8e8'; border = 'var(--green)'; color = 'var(--green-dark)' }
                  else if (feedback === 'wrong') { bg = '#fce8e8'; border = 'var(--red)'; color = 'var(--red-dark)' }
                }
                return (
                  <button key={opt} onClick={() => handleAnswer(opt)} style={{ ...styles.optBtn, background: bg, borderColor: border, color }}>
                    <span style={{ fontSize: 16 }}>
                      {selected === opt ? (feedback === 'correct' ? '✅' : '❌') : '🍄'}
                    </span>
                    <span style={{ fontSize: 15, fontWeight: 700 }}>{opt}</span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* Ground */}
      <div style={styles.ground}>
        <span style={{ fontSize: 24, position: 'absolute', left: '10%' }}>🌿</span>
        <span style={{ fontSize: 24, position: 'absolute', left: '30%' }}>🌿</span>
        <span style={{ fontSize: 24, position: 'absolute', left: '55%' }}>🌿</span>
        <span style={{ fontSize: 24, position: 'absolute', left: '80%' }}>🌿</span>
      </div>
    </div>
  )
}

const styles = {
  gate: {
    minHeight: '100vh', background: 'var(--bg)',
    display: 'flex', flexDirection: 'column',
    alignItems: 'center', justifyContent: 'center',
    padding: '2rem 1rem 0', position: 'relative', overflow: 'hidden'
  },
  centerWrap: { flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', padding: '1rem 0' },
  box: {
    background: 'var(--white)', borderRadius: 16,
    border: '3px solid var(--brown)',
    boxShadow: '0 6px 0 var(--brown), 0 10px 30px rgba(0,0,0,0.15)',
    padding: '28px 24px', maxWidth: 480, width: '100%'
  },
  failBox: { textAlign: 'center' },
  titleArea: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 },
  progressWrap: { display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 },
  pip: { width: 18, height: 18, borderRadius: 4, border: '2px solid rgba(0,0,0,0.1)', transition: 'background 0.3s' },
  questionBox: {
    background: '#F0F8FF', borderRadius: 12, border: '2px solid var(--blue-light)',
    padding: '14px 16px', marginBottom: 12, display: 'flex', gap: 10, alignItems: 'flex-start'
  },
  feedbackBubble: {
    borderRadius: 10, border: '2px solid', padding: '10px 14px',
    marginBottom: 12, animation: 'slideIn 0.2s ease'
  },
  options: { display: 'flex', flexDirection: 'column', gap: 8 },
  optBtn: {
    display: 'flex', alignItems: 'center', gap: 10,
    padding: '12px 16px', borderRadius: 10, border: '2px solid',
    cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s',
    fontFamily: "'Nunito', sans-serif",
    boxShadow: '0 3px 0 rgba(0,0,0,0.1)'
  },
  overlay: {
    position: 'fixed', inset: 0, background: 'rgba(135,206,235,0.9)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    zIndex: 10, overflow: 'hidden'
  },
  coin: { position: 'absolute', bottom: '20%', fontSize: 28, animation: 'float 1s ease-out forwards' },
  ground: {
    position: 'fixed', bottom: 0, left: 0, right: 0,
    height: 40, background: 'var(--green)',
    borderTop: '4px solid var(--green-dark)'
  }
}
