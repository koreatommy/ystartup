import { useState, useEffect, useRef } from "react";

const SCAMPER_DATA = [
  {
    key: "S",
    name: "대체",
    english: "Substitute",
    icon: "🔄",
    color: "#FF6B6B",
    desc: "기존 요소를 다른 것으로 바꿔보는 거예요!",
    formula: "A → B",
    example: "연필 대신 터치펜으로 바꾸면?",
  },
  {
    key: "C",
    name: "결합",
    english: "Combine",
    icon: "🤝",
    color: "#4ECDC4",
    desc: "두 가지 이상의 아이디어를 합쳐보는 거예요!",
    formula: "A + B",
    example: "시계 + 전화기 = 스마트워치!",
  },
  {
    key: "A",
    name: "적용",
    english: "Adapt",
    icon: "🔧",
    color: "#45B7D1",
    desc: "다른 곳의 아이디어를 가져와 적용해보는 거예요!",
    formula: "A → B",
    example: "거미줄 구조를 건축에 적용하면?",
  },
  {
    key: "M",
    name: "수정",
    english: "Modify",
    icon: "✨",
    color: "#96CEB4",
    desc: "크기, 색상, 모양 등을 바꿔보는 거예요!",
    formula: "A → A+",
    example: "햄버거를 아주 작게 만들면? → 미니버거!",
  },
  {
    key: "P",
    name: "다른 용도",
    english: "Put to another use",
    icon: "🎯",
    color: "#FFEAA7",
    desc: "원래 용도가 아닌 다른 용도로 사용해보는 거예요!",
    formula: "A → C",
    example: "빈 캔으로 화분을 만들면?",
  },
  {
    key: "E",
    name: "제거",
    english: "Eliminate",
    icon: "✂️",
    color: "#DDA0DD",
    desc: "불필요한 요소를 과감히 없애보는 거예요!",
    formula: "A → ✕",
    example: "무선 이어폰 = 줄을 제거!",
  },
  {
    key: "R",
    name: "거꾸로",
    english: "Reverse",
    icon: "🔃",
    color: "#98D8C8",
    desc: "순서나 방향을 뒤집어 생각해보는 거예요!",
    formula: "A↔B",
    example: "선생님이 학생에게 배우면?",
  },
];

const QUIZ_QUESTIONS = [
  { question: "카페에서 플라스틱 컵 대신 먹을 수 있는 컵을 사용한다면?", answer: "S", hint: "기존 재료를 다른 것으로 바꿨어요!", item: "🥤" },
  { question: "스마트폰에 카메라와 음악 플레이어 기능을 합친 것은?", answer: "C", hint: "여러 기능을 하나로 합쳤어요!", item: "📱" },
  { question: "도마뱀의 벽타기 능력을 보고 접착 테이프를 발명한 것은?", answer: "A", hint: "자연에서 아이디어를 가져왔어요!", item: "🦎" },
  { question: "일반 피자를 접시만큼 크게 만들어 파티용으로 판매한다면?", answer: "M", hint: "크기를 변화시켰어요!", item: "🍕" },
  { question: "낡은 타이어를 놀이터 그네로 재활용한 것은?", answer: "P", hint: "원래 용도가 아닌 새로운 용도로 사용했어요!", item: "🛞" },
  { question: "에어팟에서 이어폰 줄을 없앤 것은?", answer: "E", hint: "불필요한 것을 과감히 없앴어요!", item: "🎧" },
  { question: "학생이 선생님에게 가르치는 '거꾸로 교실'은?", answer: "R", hint: "역할을 뒤바꿨어요!", item: "🏫" },
  { question: "종이 빨대를 금속 빨대로 바꾼 것은?", answer: "S", hint: "재질을 다른 것으로 교체했어요!", item: "🥤" },
  { question: "칫솔에 치약을 내장시킨 여행용 칫솔은?", answer: "C", hint: "두 가지 제품을 하나로!", item: "🪥" },
  { question: "연어가 거슬러 올라가는 모습에서 영감을 받아 역발상 마케팅을 한다면?", answer: "A", hint: "자연 현상을 비즈니스에 가져왔어요!", item: "🐟" },
  { question: "미니어처 음식 모형을 만들어 키링으로 판매한다면?", answer: "M", hint: "크기를 아주 작게 바꿨어요!", item: "🍔" },
  { question: "쇼핑백을 에코백으로 재사용하는 것은?", answer: "P", hint: "본래 용도와 다르게 활용했어요!", item: "🛍️" },
  { question: "자동차에서 핸들을 없애고 자율주행으로 만든다면?", answer: "E", hint: "핵심 부품을 과감히 제거했어요!", item: "🚗" },
  { question: "배달 음식 대신 고객이 직접 요리하는 밀키트는?", answer: "R", hint: "요리사와 소비자의 역할을 바꿨어요!", item: "🥘" },
];

const CREATIVE_CHALLENGES = [
  {
    object: "우산", emoji: "☂️", techniques: ["S", "C", "M"],
    hints: { S: "우산의 천을 다른 소재로 바꾼다면?", C: "우산에 다른 기능을 합친다면?", M: "우산의 크기나 모양을 바꾼다면?" },
  },
  {
    object: "학교 가방", emoji: "🎒", techniques: ["E", "C", "P"],
    hints: { E: "가방에서 무엇을 없앨 수 있을까?", C: "가방에 어떤 기능을 합칠 수 있을까?", P: "가방을 다른 용도로 쓸 수 있을까?" },
  },
  {
    object: "자전거", emoji: "🚲", techniques: ["M", "A", "R"],
    hints: { M: "자전거의 바퀴 수나 크기를 바꾸면?", A: "다른 탈것의 아이디어를 적용하면?", R: "자전거의 구조를 뒤집으면?" },
  },
  {
    object: "교실", emoji: "🏫", techniques: ["R", "S", "E"],
    hints: { R: "교실의 역할을 뒤집는다면?", S: "칠판을 다른 것으로 바꾸면?", E: "교실에서 책상을 없앤다면?" },
  },
];

function Particles({ active }) {
  const [particles, setParticles] = useState([]);
  useEffect(() => {
    if (active) {
      const p = Array.from({ length: 20 }, (_, i) => ({
        id: i, x: Math.random() * 100, y: Math.random() * 100,
        size: Math.random() * 8 + 4,
        color: ["#FF6B6B", "#4ECDC4", "#45B7D1", "#FFEAA7", "#DDA0DD", "#96CEB4"][Math.floor(Math.random() * 6)],
        delay: Math.random() * 0.5,
      }));
      setParticles(p);
      const t = setTimeout(() => setParticles([]), 1500);
      return () => clearTimeout(t);
    }
  }, [active]);
  if (!particles.length) return null;
  return (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 999 }}>
      {particles.map((p) => (
        <div key={p.id} style={{
          position: "absolute", left: `${p.x}%`, top: `${p.y}%`,
          width: p.size, height: p.size, borderRadius: "50%", backgroundColor: p.color,
          animation: `particleFade 1.2s ease-out ${p.delay}s forwards`, opacity: 0,
        }} />
      ))}
    </div>
  );
}

function Header({ title, onBack, right }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
      <button onClick={onBack} style={{
        width: 36, height: 36, borderRadius: 10,
        border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.04)",
        color: "#aaa", fontSize: 16, cursor: "pointer",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>←</button>
      <h2 style={{ fontSize: 18, fontWeight: 700, flex: 1 }}>{title}</h2>
      {right}
    </div>
  );
}

export default function ScamperGame() {
  const [screen, setScreen] = useState("home");
  const [currentCard, setCurrentCard] = useState(0);
  const [quizIndex, setQuizIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [totalAnswered, setTotalAnswered] = useState(0);
  const [selected, setSelected] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [celebrate, setCelebrate] = useState(0);
  const [challengeIndex, setChallengeIndex] = useState(0);
  const [userIdeas, setUserIdeas] = useState({});
  const [selectedTechnique, setSelectedTechnique] = useState(null);
  const [shuffledQuiz, setShuffledQuiz] = useState([]);
  const [streakCount, setStreakCount] = useState(0);
  const textareaRef = useRef(null);

  useEffect(() => {
    setShuffledQuiz([...QUIZ_QUESTIONS].sort(() => Math.random() - 0.5));
  }, []);

  const resetQuiz = () => {
    setShuffledQuiz([...QUIZ_QUESTIONS].sort(() => Math.random() - 0.5));
    setQuizIndex(0); setScore(0); setTotalAnswered(0);
    setSelected(null); setShowResult(false); setShowHint(false); setStreakCount(0);
  };

  const handleQuizAnswer = (key) => {
    if (showResult) return;
    setSelected(key); setShowResult(true); setTotalAnswered((p) => p + 1);
    if (key === shuffledQuiz[quizIndex].answer) {
      setScore((p) => p + 1); setStreakCount((p) => p + 1); setCelebrate((c) => c + 1);
    } else { setStreakCount(0); }
  };

  const nextQuestion = () => {
    if (quizIndex < shuffledQuiz.length - 1) {
      setQuizIndex((p) => p + 1); setSelected(null); setShowResult(false); setShowHint(false);
    } else { setScreen("quizResult"); }
  };

  const saveIdea = () => {
    const value = textareaRef.current ? textareaRef.current.value.trim() : "";
    if (!value || !selectedTechnique) return;
    const key = `${challengeIndex}-${selectedTechnique}`;
    setUserIdeas((prev) => ({ ...prev, [key]: value }));
    if (textareaRef.current) textareaRef.current.value = "";
    setCelebrate((c) => c + 1);
  };

  const getScamperByKey = (key) => SCAMPER_DATA.find((s) => s.key === key);

  const totalSlots = CREATIVE_CHALLENGES.reduce((sum, ch) => sum + ch.techniques.length, 0);
  const completedIdeas = Object.keys(userIdeas).length;

  // ════════════════════════════════════
  // HOME
  // ════════════════════════════════════
  const HomeScreen = () => (
    <div style={{ textAlign: "center", paddingTop: 40 }}>
      <div style={{ fontSize: 64, marginBottom: 8, animation: "float 3s ease-in-out infinite" }}>💡</div>
      <h1 style={{
        fontSize: 36, fontWeight: 900, marginBottom: 4, letterSpacing: -1,
        background: "linear-gradient(135deg, #FF6B6B, #4ECDC4, #45B7D1, #FFEAA7)",
        WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
      }}>SCAMPER</h1>
      <p style={{ fontSize: 14, color: "#8888aa", marginBottom: 32, letterSpacing: 3 }}>창의적 사고 게임</p>

      <div style={{ display: "flex", flexDirection: "column", gap: 12, maxWidth: 320, margin: "0 auto" }}>
        {[
          { id: "learn", icon: "📖", title: "기법 배우기", sub: "7가지 SCAMPER 기법 학습", color: "#4ECDC4" },
          { id: "quiz", icon: "🎮", title: "퀴즈 도전", sub: "배운 기법을 테스트하기", color: "#FF6B6B" },
          { id: "challenge", icon: "🚀", title: "창의력 챌린지", sub: "직접 아이디어 만들어보기", color: "#FFEAA7" },
        ].map((item) => (
          <button key={item.id} onClick={() => {
            if (item.id === "quiz") resetQuiz();
            setScreen(item.id);
          }} style={{
            display: "flex", alignItems: "center", gap: 14, padding: "18px 20px",
            background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 16, cursor: "pointer", transition: "all 0.25s ease", textAlign: "left",
          }}
          onMouseOver={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.08)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
          onMouseOut={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; e.currentTarget.style.transform = "translateY(0)"; }}
          >
            <span style={{ fontSize: 32 }}>{item.icon}</span>
            <div>
              <div style={{ fontSize: 16, fontWeight: 700, color: "#e8e8f0" }}>{item.title}</div>
              <div style={{ fontSize: 12, color: "#8888aa", marginTop: 2 }}>{item.sub}</div>
            </div>
          </button>
        ))}
      </div>

      {completedIdeas > 0 && (
        <button onClick={() => setScreen("ideaGallery")} style={{
          marginTop: 20, padding: "14px 24px", borderRadius: 14,
          background: "linear-gradient(135deg, #4ECDC422, #FFEAA722)",
          border: "1px solid rgba(78,205,196,0.3)", cursor: "pointer",
          display: "flex", alignItems: "center", gap: 10, margin: "20px auto 0",
        }}>
          <span style={{ fontSize: 20 }}>📋</span>
          <div style={{ textAlign: "left" }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#4ECDC4" }}>나의 아이디어 모아보기</div>
            <div style={{ fontSize: 12, color: "#8888aa" }}>{completedIdeas}개의 아이디어 저장됨</div>
          </div>
        </button>
      )}

      <div style={{
        marginTop: 28, padding: 16, background: "rgba(255,255,255,0.03)",
        borderRadius: 12, border: "1px solid rgba(255,255,255,0.06)",
      }}>
        <p style={{ fontSize: 12, color: "#6666aa", lineHeight: 1.8 }}>
          SCAMPER는 기존 아이디어를 7가지 관점에서<br />
          변형하여 새로운 해결책을 찾는 창의적 사고 기법이에요
        </p>
      </div>
    </div>
  );

  // ════════════════════════════════════
  // LEARN
  // ════════════════════════════════════
  const LearnScreen = () => {
    const card = SCAMPER_DATA[currentCard];
    return (
      <div>
        <Header title="기법 배우기" onBack={() => { setScreen("home"); setCurrentCard(0); }} />
        <div style={{ display: "flex", gap: 4, marginBottom: 24 }}>
          {SCAMPER_DATA.map((s, i) => (
            <div key={i} onClick={() => setCurrentCard(i)} style={{
              flex: 1, height: 4, borderRadius: 2, cursor: "pointer", transition: "all 0.3s ease",
              background: i === currentCard ? s.color : i < currentCard ? s.color + "66" : "rgba(255,255,255,0.1)",
            }} />
          ))}
        </div>
        <div key={currentCard} style={{
          background: `linear-gradient(145deg, ${card.color}11, ${card.color}05)`,
          border: `1px solid ${card.color}33`, borderRadius: 20, padding: 28, animation: "slideIn 0.4s ease",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
            <div style={{
              width: 56, height: 56, borderRadius: 14, background: card.color + "22",
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28,
            }}>{card.icon}</div>
            <div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                <span style={{ fontSize: 28, fontWeight: 900, color: card.color }}>{card.key}</span>
                <span style={{ fontSize: 18, fontWeight: 700 }}>{card.name}</span>
              </div>
              <span style={{ fontSize: 12, color: "#8888aa" }}>{card.english}</span>
            </div>
          </div>
          <p style={{ fontSize: 15, lineHeight: 1.8, color: "#ccccdd", marginBottom: 20 }}>{card.desc}</p>
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "center",
            padding: 16, background: "rgba(0,0,0,0.3)", borderRadius: 12, marginBottom: 16,
          }}>
            <span style={{ fontSize: 24, fontWeight: 800, color: card.color, letterSpacing: 4 }}>{card.formula}</span>
          </div>
          <div style={{
            padding: 14, background: card.color + "11", borderRadius: 10, borderLeft: `3px solid ${card.color}`,
          }}>
            <span style={{ fontSize: 11, color: card.color, fontWeight: 600, display: "block", marginBottom: 4 }}>💡 예시</span>
            <span style={{ fontSize: 14, color: "#ccccdd" }}>{card.example}</span>
          </div>
        </div>
        <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
          <button onClick={() => setCurrentCard(Math.max(0, currentCard - 1))} disabled={currentCard === 0}
            style={{
              flex: 1, padding: "14px 0", borderRadius: 12,
              border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.04)",
              color: currentCard === 0 ? "#444" : "#aaa", fontSize: 14, fontWeight: 600,
              cursor: currentCard === 0 ? "default" : "pointer",
            }}>← 이전</button>
          <button onClick={() => {
            if (currentCard < 6) setCurrentCard(currentCard + 1);
            else { setScreen("home"); setCurrentCard(0); }
          }} style={{
            flex: 1, padding: "14px 0", borderRadius: 12, border: "none",
            background: card.color, color: "#000", fontSize: 14, fontWeight: 700, cursor: "pointer",
          }}>{currentCard < 6 ? "다음 →" : "완료 ✓"}</button>
        </div>
      </div>
    );
  };

  // ════════════════════════════════════
  // QUIZ
  // ════════════════════════════════════
  const QuizScreen = () => {
    if (!shuffledQuiz.length) return null;
    const q = shuffledQuiz[quizIndex];
    const correct = showResult && selected === q.answer;
    return (
      <div>
        <Header title="퀴즈 도전" onBack={() => setScreen("home")} />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <span style={{ fontSize: 13, color: "#8888aa" }}>{quizIndex + 1} / {shuffledQuiz.length}</span>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            {streakCount >= 3 && <span style={{ fontSize: 12, color: "#FFEAA7" }}>🔥 {streakCount}연속!</span>}
            <span style={{ fontSize: 13, fontWeight: 700, color: "#4ECDC4" }}>✅ {score}점</span>
          </div>
        </div>
        <div style={{ height: 3, background: "rgba(255,255,255,0.06)", borderRadius: 2, marginBottom: 24 }}>
          <div style={{
            height: "100%", width: `${((quizIndex + 1) / shuffledQuiz.length) * 100}%`,
            background: "linear-gradient(90deg, #4ECDC4, #45B7D1)", borderRadius: 2, transition: "width 0.5s ease",
          }} />
        </div>
        <div style={{
          background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 16, padding: 24, marginBottom: 20, textAlign: "center",
        }}>
          <span style={{ fontSize: 40, display: "block", marginBottom: 12 }}>{q.item}</span>
          <p style={{ fontSize: 16, lineHeight: 1.7, color: "#dddde8", fontWeight: 500 }}>{q.question}</p>
        </div>
        {!showResult && (
          <button onClick={() => setShowHint(!showHint)} style={{
            display: "block", margin: "0 auto 16px", padding: "8px 20px",
            background: "transparent", border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 20, color: "#FFEAA7", fontSize: 12, cursor: "pointer",
          }}>{showHint ? "💡 " + q.hint : "💡 힌트 보기"}</button>
        )}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {SCAMPER_DATA.map((s) => {
            const isCorrectAnswer = q.answer === s.key;
            let bg = "rgba(255,255,255,0.04)", border = "rgba(255,255,255,0.08)";
            if (showResult) {
              if (isCorrectAnswer) { bg = "#4ECDC422"; border = "#4ECDC4"; }
              else if (selected === s.key) { bg = "#FF6B6B22"; border = "#FF6B6B"; }
            }
            return (
              <button key={s.key} onClick={() => handleQuizAnswer(s.key)} style={{
                padding: "14px 10px", background: bg, border: `1.5px solid ${border}`,
                borderRadius: 12, cursor: showResult ? "default" : "pointer",
                transition: "all 0.2s ease", textAlign: "center",
              }}>
                <div style={{ fontSize: 20, marginBottom: 2 }}>{s.icon}</div>
                <div style={{ fontSize: 16, fontWeight: 800, color: s.color }}>{s.key}</div>
                <div style={{ fontSize: 12, color: "#aaa" }}>{s.name}</div>
              </button>
            );
          })}
        </div>
        {showResult && (
          <div style={{
            marginTop: 16, padding: 16, borderRadius: 12, textAlign: "center", animation: "slideIn 0.3s ease",
            background: correct ? "#4ECDC411" : "#FF6B6B11",
            border: `1px solid ${correct ? "#4ECDC433" : "#FF6B6B33"}`,
          }}>
            <p style={{ fontSize: 16, fontWeight: 700, color: correct ? "#4ECDC4" : "#FF6B6B", marginBottom: 6 }}>
              {correct ? "🎉 정답이에요!" : "😅 아쉬워요!"}
            </p>
            {!correct && (
              <p style={{ fontSize: 13, color: "#aaa" }}>
                정답은 <strong style={{ color: getScamperByKey(q.answer).color }}>
                  {q.answer} - {getScamperByKey(q.answer).name}
                </strong> 이에요
              </p>
            )}
            <button onClick={nextQuestion} style={{
              marginTop: 12, padding: "10px 28px", borderRadius: 10, border: "none",
              background: correct ? "#4ECDC4" : "#FF6B6B", color: "#000", fontSize: 14, fontWeight: 700, cursor: "pointer",
            }}>{quizIndex < shuffledQuiz.length - 1 ? "다음 문제 →" : "결과 보기"}</button>
          </div>
        )}
      </div>
    );
  };

  // ════════════════════════════════════
  // QUIZ RESULT
  // ════════════════════════════════════
  const QuizResultScreen = () => {
    const pct = Math.round((score / shuffledQuiz.length) * 100);
    let grade, gradeColor, msg;
    if (pct >= 90) { grade = "S"; gradeColor = "#FFEAA7"; msg = "SCAMPER 마스터! 🏆"; }
    else if (pct >= 70) { grade = "A"; gradeColor = "#4ECDC4"; msg = "훌륭해요! 거의 다 맞췄어요!"; }
    else if (pct >= 50) { grade = "B"; gradeColor = "#45B7D1"; msg = "좋아요! 조금만 더 연습하면 완벽!"; }
    else { grade = "C"; gradeColor = "#FF6B6B"; msg = "기법 카드를 다시 한번 살펴볼까요?"; }
    return (
      <div style={{ textAlign: "center", paddingTop: 32 }}>
        <Header title="퀴즈 결과" onBack={() => setScreen("home")} />
        <div style={{
          width: 120, height: 120, borderRadius: "50%", background: `${gradeColor}22`,
          border: `3px solid ${gradeColor}`, display: "flex", alignItems: "center", justifyContent: "center",
          margin: "24px auto", animation: "float 2s ease-in-out infinite",
        }}>
          <span style={{ fontSize: 48, fontWeight: 900, color: gradeColor }}>{grade}</span>
        </div>
        <p style={{ fontSize: 24, fontWeight: 800, marginBottom: 6 }}>{score} / {shuffledQuiz.length}</p>
        <p style={{ fontSize: 14, color: "#8888aa", marginBottom: 24 }}>{msg}</p>
        <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
          <button onClick={() => { resetQuiz(); setScreen("quiz"); }} style={{
            padding: "12px 24px", borderRadius: 12, border: "1px solid rgba(255,255,255,0.1)",
            background: "rgba(255,255,255,0.04)", color: "#ccc", fontSize: 14, fontWeight: 600, cursor: "pointer",
          }}>🔄 다시 도전</button>
          <button onClick={() => setScreen("home")} style={{
            padding: "12px 24px", borderRadius: 12, border: "none",
            background: gradeColor, color: "#000", fontSize: 14, fontWeight: 700, cursor: "pointer",
          }}>🏠 홈으로</button>
        </div>
      </div>
    );
  };

  // ════════════════════════════════════
  // CHALLENGE
  // ════════════════════════════════════
  const ChallengeScreen = () => {
    const ch = CREATIVE_CHALLENGES[challengeIndex];
    const currentDone = ch.techniques.filter((t) => userIdeas[`${challengeIndex}-${t}`]).length;
    const currentTotal = ch.techniques.length;
    const allDone = currentDone === currentTotal;

    return (
      <div>
        <Header title="창의력 챌린지"
          onBack={() => { setScreen("home"); setSelectedTechnique(null); }}
          right={completedIdeas > 0 ? (
            <button onClick={() => setScreen("ideaGallery")} style={{
              padding: "6px 12px", borderRadius: 8,
              border: "1px solid rgba(78,205,196,0.3)", background: "rgba(78,205,196,0.1)",
              color: "#4ECDC4", fontSize: 12, fontWeight: 600, cursor: "pointer",
            }}>📋 모아보기</button>
          ) : null}
        />

        {/* Challenge tabs */}
        <div style={{ display: "flex", gap: 8, marginBottom: 20, overflowX: "auto", paddingBottom: 4 }}>
          {CREATIVE_CHALLENGES.map((c, i) => {
            const done = c.techniques.filter((t) => userIdeas[`${i}-${t}`]).length;
            const total = c.techniques.length;
            return (
              <button key={i} onClick={() => { setChallengeIndex(i); setSelectedTechnique(null); if (textareaRef.current) textareaRef.current.value = ""; }}
                style={{
                  padding: "10px 16px", borderRadius: 10, whiteSpace: "nowrap", flexShrink: 0,
                  border: i === challengeIndex ? "1px solid #4ECDC4" : "1px solid rgba(255,255,255,0.08)",
                  background: i === challengeIndex ? "#4ECDC422" : "rgba(255,255,255,0.04)",
                  color: i === challengeIndex ? "#4ECDC4" : "#888", fontSize: 13, fontWeight: 600, cursor: "pointer",
                }}>
                {c.emoji} {c.object}
                {done > 0 && (
                  <span style={{
                    marginLeft: 6, fontSize: 10, padding: "1px 5px", borderRadius: 6,
                    background: done === total ? "#4ECDC433" : "rgba(255,255,255,0.1)",
                    color: done === total ? "#4ECDC4" : "#888",
                  }}>{done}/{total}</span>
                )}
              </button>
            );
          })}
        </div>

        {/* Progress bar */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
            <span style={{ fontSize: 11, color: "#8888aa" }}>전체 진행률</span>
            <span style={{ fontSize: 11, color: "#4ECDC4", fontWeight: 700 }}>{completedIdeas} / {totalSlots}</span>
          </div>
          <div style={{ height: 4, background: "rgba(255,255,255,0.06)", borderRadius: 2 }}>
            <div style={{
              height: "100%", borderRadius: 2, transition: "width 0.5s ease",
              width: `${(completedIdeas / totalSlots) * 100}%`,
              background: completedIdeas === totalSlots
                ? "linear-gradient(90deg, #FFEAA7, #FF6B6B)"
                : "linear-gradient(90deg, #4ECDC4, #45B7D1)",
            }} />
          </div>
        </div>

        {/* Challenge card */}
        <div style={{
          background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 16, padding: 24, marginBottom: 16, textAlign: "center",
        }}>
          <span style={{ fontSize: 48, display: "block", marginBottom: 8 }}>{ch.emoji}</span>
          <p style={{ fontSize: 18, fontWeight: 700, marginBottom: 6 }}>"{ch.object}"를 혁신해보세요!</p>
          <p style={{ fontSize: 13, color: "#8888aa" }}>
            {allDone ? "🎉 모든 기법을 완료했어요!" : "아래 SCAMPER 기법을 선택하고 아이디어를 적어보세요"}
          </p>
        </div>

        {/* Technique buttons */}
        <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
          {ch.techniques.map((key) => {
            const s = getScamperByKey(key);
            const isActive = selectedTechnique === key;
            const hasIdea = userIdeas[`${challengeIndex}-${key}`];
            return (
              <button key={key} onClick={() => { setSelectedTechnique(key); if (textareaRef.current) textareaRef.current.value = ""; }}
                style={{
                  flex: 1, padding: "12px 8px", borderRadius: 12, cursor: "pointer", textAlign: "center",
                  position: "relative", transition: "all 0.2s ease",
                  border: `1.5px solid ${isActive ? s.color : hasIdea ? s.color + "44" : "rgba(255,255,255,0.08)"}`,
                  background: isActive ? s.color + "22" : "rgba(255,255,255,0.04)",
                }}>
                {hasIdea && <span style={{ position: "absolute", top: -6, right: -6, fontSize: 14 }}>✅</span>}
                <div style={{ fontSize: 18 }}>{s.icon}</div>
                <div style={{ fontSize: 14, fontWeight: 800, color: s.color }}>{s.key}</div>
                <div style={{ fontSize: 11, color: "#aaa" }}>{s.name}</div>
              </button>
            );
          })}
        </div>

        {/* Input / Preview */}
        {selectedTechnique && (
          <div style={{ animation: "slideIn 0.3s ease" }}>
            <div style={{
              padding: 12, borderRadius: 10, marginBottom: 12,
              background: getScamperByKey(selectedTechnique).color + "11",
              borderLeft: `3px solid ${getScamperByKey(selectedTechnique).color}`,
            }}>
              <p style={{ fontSize: 13, color: getScamperByKey(selectedTechnique).color }}>
                💡 {ch.hints[selectedTechnique]}
              </p>
            </div>

            {userIdeas[`${challengeIndex}-${selectedTechnique}`] ? (
              <div style={{
                padding: 16, borderRadius: 12,
                background: "rgba(78, 205, 196, 0.08)", border: "1px solid rgba(78, 205, 196, 0.2)",
              }}>
                <p style={{ fontSize: 12, color: "#4ECDC4", fontWeight: 600, marginBottom: 6 }}>✨ 나의 아이디어</p>
                <p style={{ fontSize: 14, color: "#ddd", lineHeight: 1.6 }}>
                  {userIdeas[`${challengeIndex}-${selectedTechnique}`]}
                </p>
                <button onClick={() => {
                  const k = `${challengeIndex}-${selectedTechnique}`;
                  setUserIdeas((prev) => { const n = { ...prev }; delete n[k]; return n; });
                }} style={{
                  marginTop: 10, padding: "6px 14px", borderRadius: 8,
                  border: "1px solid rgba(255,255,255,0.1)", background: "transparent",
                  color: "#888", fontSize: 12, cursor: "pointer",
                }}>다시 작성하기</button>
              </div>
            ) : (
              <div>
                <textarea
                  ref={textareaRef}
                  placeholder="여기에 창의적인 아이디어를 적어보세요..."
                  style={{
                    width: "100%", minHeight: 80, padding: 14, borderRadius: 12,
                    border: `1px solid ${getScamperByKey(selectedTechnique).color}44`,
                    background: "rgba(255,255,255,0.04)", color: "#e8e8f0",
                    fontSize: 14, lineHeight: 1.6, resize: "vertical",
                    outline: "none", fontFamily: "inherit", boxSizing: "border-box",
                  }}
                />
                <button onClick={saveIdea} style={{
                  marginTop: 10, width: "100%", padding: "12px 0", borderRadius: 10, border: "none",
                  background: getScamperByKey(selectedTechnique).color,
                  color: "#000", fontSize: 14, fontWeight: 700, cursor: "pointer",
                }}>💾 아이디어 저장</button>
              </div>
            )}
          </div>
        )}

        {/* Complete button */}
        {allDone && (
          <button onClick={() => setScreen("challengeResult")} style={{
            marginTop: 20, width: "100%", padding: "16px 0", borderRadius: 14, border: "none",
            background: "linear-gradient(135deg, #4ECDC4, #45B7D1)",
            color: "#000", fontSize: 15, fontWeight: 800, cursor: "pointer", animation: "slideIn 0.4s ease",
          }}>🏆 "{ch.object}" 챌린지 결과 보기</button>
        )}

        {completedIdeas > 0 && !allDone && (
          <div style={{
            marginTop: 20, padding: 12, background: "rgba(255,255,255,0.03)", borderRadius: 10, textAlign: "center",
          }}>
            <span style={{ fontSize: 13, color: "#8888aa" }}>
              이 챌린지: <strong style={{ color: "#4ECDC4" }}>{currentDone}/{currentTotal}</strong>
              {" · "}전체: <strong style={{ color: "#FFEAA7" }}>{completedIdeas}/{totalSlots}</strong>
            </span>
          </div>
        )}
      </div>
    );
  };

  // ════════════════════════════════════
  // CHALLENGE RESULT (per object)
  // ════════════════════════════════════
  const ChallengeResultScreen = () => {
    const ch = CREATIVE_CHALLENGES[challengeIndex];
    return (
      <div>
        <Header title={`${ch.emoji} ${ch.object} 결과`} onBack={() => setScreen("challenge")} />

        <div style={{ textAlign: "center", marginBottom: 24, animation: "slideIn 0.4s ease" }}>
          <div style={{
            width: 80, height: 80, borderRadius: "50%",
            background: "linear-gradient(135deg, #4ECDC422, #FFEAA722)",
            border: "2px solid #4ECDC4", display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 12px", animation: "float 2.5s ease-in-out infinite",
          }}>
            <span style={{ fontSize: 36 }}>{ch.emoji}</span>
          </div>
          <p style={{ fontSize: 20, fontWeight: 800, marginBottom: 4 }}>"{ch.object}" 혁신 완료!</p>
          <p style={{ fontSize: 13, color: "#8888aa" }}>{ch.techniques.length}가지 관점으로 아이디어를 만들었어요</p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 24 }}>
          {ch.techniques.map((key, i) => {
            const s = getScamperByKey(key);
            const idea = userIdeas[`${challengeIndex}-${key}`];
            return (
              <div key={key} style={{
                padding: 18, borderRadius: 14,
                background: `linear-gradient(135deg, ${s.color}11, transparent)`,
                border: `1px solid ${s.color}33`, animation: `slideIn 0.4s ease ${i * 0.1}s both`,
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: 8, background: s.color + "22",
                    display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16,
                  }}>{s.icon}</div>
                  <span style={{ fontSize: 14, fontWeight: 800, color: s.color }}>{s.key}</span>
                  <span style={{ fontSize: 12, color: "#8888aa" }}>{s.name} ({s.english})</span>
                </div>
                <p style={{
                  fontSize: 14, color: "#ddd", lineHeight: 1.7,
                  padding: 12, background: "rgba(0,0,0,0.2)", borderRadius: 10,
                }}>💬 {idea || "—"}</p>
              </div>
            );
          })}
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={() => setScreen("challenge")} style={{
            flex: 1, padding: "14px 0", borderRadius: 12,
            border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.04)",
            color: "#aaa", fontSize: 14, fontWeight: 600, cursor: "pointer",
          }}>← 수정하기</button>
          {completedIdeas >= 3 ? (
            <button onClick={() => setScreen("ideaGallery")} style={{
              flex: 1, padding: "14px 0", borderRadius: 12, border: "none",
              background: "linear-gradient(135deg, #FFEAA7, #FF6B6B)",
              color: "#000", fontSize: 14, fontWeight: 700, cursor: "pointer",
            }}>📋 전체 모아보기</button>
          ) : (
            <button onClick={() => {
              const nextIdx = CREATIVE_CHALLENGES.findIndex((c, i) =>
                i !== challengeIndex && c.techniques.some((t) => !userIdeas[`${i}-${t}`])
              );
              if (nextIdx >= 0) { setChallengeIndex(nextIdx); setSelectedTechnique(null); setScreen("challenge"); }
              else setScreen("ideaGallery");
            }} style={{
              flex: 1, padding: "14px 0", borderRadius: 12, border: "none",
              background: "#4ECDC4", color: "#000", fontSize: 14, fontWeight: 700, cursor: "pointer",
            }}>🚀 다음 챌린지</button>
          )}
        </div>
      </div>
    );
  };

  // ════════════════════════════════════
  // IDEA GALLERY (all ideas)
  // ════════════════════════════════════
  const IdeaGalleryScreen = () => {
    let grade, gradeColor, gradeMsg;
    const pct = Math.round((completedIdeas / totalSlots) * 100);
    if (pct === 100) { grade = "🏆"; gradeColor = "#FFEAA7"; gradeMsg = "모든 챌린지 완료! 창의력 마스터!"; }
    else if (pct >= 75) { grade = "🌟"; gradeColor = "#4ECDC4"; gradeMsg = "대단해요! 거의 다 채웠어요!"; }
    else if (pct >= 50) { grade = "✨"; gradeColor = "#45B7D1"; gradeMsg = "절반 이상 완료! 잘하고 있어요!"; }
    else { grade = "🌱"; gradeColor = "#96CEB4"; gradeMsg = "좋은 시작이에요! 더 도전해볼까요?"; }

    return (
      <div>
        <Header title="나의 아이디어 갤러리" onBack={() => setScreen("home")} />

        {/* Summary */}
        <div style={{
          textAlign: "center", padding: 24, marginBottom: 20, borderRadius: 16,
          background: "linear-gradient(145deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))",
          border: `1px solid ${gradeColor}33`,
        }}>
          <span style={{ fontSize: 48, display: "block", marginBottom: 8, animation: "float 2.5s ease-in-out infinite" }}>{grade}</span>
          <p style={{ fontSize: 22, fontWeight: 800, marginBottom: 4 }}>{completedIdeas}개의 아이디어</p>
          <p style={{ fontSize: 13, color: gradeColor, marginBottom: 16 }}>{gradeMsg}</p>

          <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
            {CREATIVE_CHALLENGES.map((ch, ci) => {
              const done = ch.techniques.filter((t) => userIdeas[`${ci}-${t}`]).length;
              const total = ch.techniques.length;
              return (
                <div key={ci} style={{
                  padding: "8px 12px", borderRadius: 10,
                  background: done === total ? "#4ECDC422" : "rgba(255,255,255,0.04)",
                  border: `1px solid ${done === total ? "#4ECDC444" : "rgba(255,255,255,0.08)"}`,
                }}>
                  <span style={{ fontSize: 18, display: "block" }}>{ch.emoji}</span>
                  <span style={{ fontSize: 11, color: done === total ? "#4ECDC4" : "#888", fontWeight: 600 }}>
                    {done}/{total}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Ideas grouped by challenge */}
        {CREATIVE_CHALLENGES.map((ch, ci) => {
          const ideas = ch.techniques.filter((t) => userIdeas[`${ci}-${t}`]);
          if (ideas.length === 0) return null;
          return (
            <div key={ci} style={{ marginBottom: 20 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                <span style={{ fontSize: 20 }}>{ch.emoji}</span>
                <span style={{ fontSize: 15, fontWeight: 700 }}>{ch.object}</span>
                <span style={{ fontSize: 11, color: "#4ECDC4", fontWeight: 600 }}>{ideas.length}/{ch.techniques.length}</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {ideas.map((t) => {
                  const s = getScamperByKey(t);
                  return (
                    <div key={t} style={{
                      padding: 14, borderRadius: 12,
                      background: `${s.color}09`, border: `1px solid ${s.color}22`,
                    }}>
                      <span style={{
                        fontSize: 12, fontWeight: 800, color: s.color,
                        padding: "2px 8px", borderRadius: 6, background: s.color + "22",
                      }}>{s.key} {s.name}</span>
                      <p style={{ fontSize: 13, color: "#ccc", lineHeight: 1.6, marginTop: 8 }}>
                        {userIdeas[`${ci}-${t}`]}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}

        <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
          <button onClick={() => setScreen("challenge")} style={{
            flex: 1, padding: "14px 0", borderRadius: 12,
            border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.04)",
            color: "#aaa", fontSize: 14, fontWeight: 600, cursor: "pointer",
          }}>🚀 더 도전하기</button>
          <button onClick={() => { setUserIdeas({}); setScreen("home"); }} style={{
            flex: 1, padding: "14px 0", borderRadius: 12,
            border: "1px solid rgba(255,107,107,0.3)", background: "rgba(255,107,107,0.08)",
            color: "#FF6B6B", fontSize: 14, fontWeight: 600, cursor: "pointer",
          }}>🗑️ 초기화</button>
        </div>
      </div>
    );
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0a0a1a 0%, #1a1a2e 50%, #16213e 100%)",
      fontFamily: "'Pretendard', 'Noto Sans KR', -apple-system, sans-serif",
      color: "#e8e8f0", overflow: "auto",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;600;700;800;900&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes particleFade {
          0% { opacity: 0; transform: scale(0) translateY(0); }
          30% { opacity: 1; transform: scale(1.2); }
          100% { opacity: 0; transform: scale(0.5) translateY(-60px); }
        }
        textarea::placeholder { color: #555; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 2px; }
      `}</style>

      <Particles active={celebrate} />

      <div style={{ maxWidth: 520, margin: "0 auto", padding: "20px 16px", position: "relative" }}>
        {screen === "home" && <HomeScreen />}
        {screen === "learn" && <LearnScreen />}
        {screen === "quiz" && <QuizScreen />}
        {screen === "quizResult" && <QuizResultScreen />}
        {screen === "challenge" && <ChallengeScreen />}
        {screen === "challengeResult" && <ChallengeResultScreen />}
        {screen === "ideaGallery" && <IdeaGalleryScreen />}
      </div>
    </div>
  );
}
