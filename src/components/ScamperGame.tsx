"use client";

import { useCallback, useMemo, useRef, useState, type ReactNode } from "react";
import {
  CREATIVE_CHALLENGES,
  QUIZ_QUESTIONS,
  SCAMPER_DATA,
  type ScamperKey,
  type ScamperQuizQuestion,
  type ScamperTechnique,
} from "@/data/scamper";
import { ScamperGameHeader } from "@/components/scamper/ScamperGameHeader";
import { ScamperParticles } from "@/components/scamper/ScamperParticles";

type ScamperScreen =
  | "home"
  | "learn"
  | "quiz"
  | "quizResult"
  | "challenge"
  | "challengeResult"
  | "ideaGallery";

function shuffleQuizQuestions(): ScamperQuizQuestion[] {
  return [...QUIZ_QUESTIONS].sort(() => Math.random() - 0.5);
}

function getScamperByKey(key: ScamperKey): ScamperTechnique {
  const found = SCAMPER_DATA.find((s) => s.key === key);
  if (!found) {
    throw new Error(`Unknown SCAMPER key: ${key}`);
  }
  return found;
}

export function ScamperGame() {
  const [screen, setScreen] = useState<ScamperScreen>("home");
  const [currentCard, setCurrentCard] = useState(0);
  const [quizIndex, setQuizIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [, setTotalAnswered] = useState(0);
  const [selected, setSelected] = useState<ScamperKey | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [celebrate, setCelebrate] = useState(0);
  const [challengeIndex, setChallengeIndex] = useState(0);
  const [userIdeas, setUserIdeas] = useState<Record<string, string>>({});
  const [selectedTechnique, setSelectedTechnique] = useState<ScamperKey | null>(null);
  const [shuffledQuiz, setShuffledQuiz] = useState<ScamperQuizQuestion[]>(() => shuffleQuizQuestions());
  const [streakCount, setStreakCount] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const resetQuiz = useCallback(() => {
    setShuffledQuiz(shuffleQuizQuestions());
    setQuizIndex(0);
    setScore(0);
    setTotalAnswered(0);
    setSelected(null);
    setShowResult(false);
    setShowHint(false);
    setStreakCount(0);
  }, []);

  const handleQuizAnswer = useCallback(
    (key: ScamperKey) => {
      if (showResult) return;
      const q = shuffledQuiz[quizIndex];
      if (!q) return;
      setSelected(key);
      setShowResult(true);
      setTotalAnswered((p) => p + 1);
      if (key === q.answer) {
        setScore((p) => p + 1);
        setStreakCount((p) => p + 1);
        setCelebrate((c) => c + 1);
      } else {
        setStreakCount(0);
      }
    },
    [quizIndex, shuffledQuiz, showResult]
  );

  const nextQuestion = useCallback(() => {
    if (quizIndex < shuffledQuiz.length - 1) {
      setQuizIndex((p) => p + 1);
      setSelected(null);
      setShowResult(false);
      setShowHint(false);
    } else {
      setScreen("quizResult");
    }
  }, [quizIndex, shuffledQuiz.length]);

  const saveIdea = useCallback(() => {
    const value = textareaRef.current?.value.trim() ?? "";
    if (!value || !selectedTechnique) return;
    const ideaKey = `${challengeIndex}-${selectedTechnique}`;
    setUserIdeas((prev) => ({ ...prev, [ideaKey]: value }));
    if (textareaRef.current) textareaRef.current.value = "";
    setCelebrate((c) => c + 1);
  }, [challengeIndex, selectedTechnique]);

  const totalSlots = useMemo(
    () => CREATIVE_CHALLENGES.reduce((sum, ch) => sum + ch.techniques.length, 0),
    []
  );
  const completedIdeas = Object.keys(userIdeas).length;

  const renderScreen = (): ReactNode => {
    switch (screen) {
      case "home":
        return (
    <div style={{ textAlign: "center", paddingTop: 40 }}>
      <div style={{ fontSize: 64, marginBottom: 8, animation: "scamperFloat 3s ease-in-out infinite" }}>
        💡
      </div>
      <h1
        style={{
          fontSize: 36,
          fontWeight: 900,
          marginBottom: 4,
          letterSpacing: -1,
          background: "linear-gradient(135deg, #FF6B6B, #4ECDC4, #45B7D1, #FFEAA7)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        }}
      >
        SCAMPER
      </h1>
      <p style={{ fontSize: 14, color: "#8888aa", marginBottom: 32, letterSpacing: 3 }}>
        창의적 사고 게임
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: 12, maxWidth: 320, margin: "0 auto" }}>
        {[
          { id: "learn" as const, icon: "📖", title: "기법 배우기", sub: "7가지 SCAMPER 기법 학습" },
          { id: "quiz" as const, icon: "🎮", title: "퀴즈 도전", sub: "배운 기법을 테스트하기" },
          { id: "challenge" as const, icon: "🚀", title: "창의력 챌린지", sub: "직접 아이디어 만들어보기" },
        ].map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => {
              if (item.id === "quiz") resetQuiz();
              setScreen(item.id);
            }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              padding: "18px 20px",
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 16,
              cursor: "pointer",
              transition: "all 0.25s ease",
              textAlign: "left",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,0.08)";
              e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,0.04)";
              e.currentTarget.style.transform = "translateY(0)";
            }}
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
        <button
          type="button"
          onClick={() => setScreen("ideaGallery")}
          style={{
            marginTop: 20,
            padding: "14px 24px",
            borderRadius: 14,
            background: "linear-gradient(135deg, #4ECDC422, #FFEAA722)",
            border: "1px solid rgba(78,205,196,0.3)",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 10,
            margin: "20px auto 0",
          }}
        >
          <span style={{ fontSize: 20 }}>📋</span>
          <div style={{ textAlign: "left" }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#4ECDC4" }}>나의 아이디어 모아보기</div>
            <div style={{ fontSize: 12, color: "#8888aa" }}>{completedIdeas}개의 아이디어 저장됨</div>
          </div>
        </button>
      )}

      <div
        style={{
          marginTop: 28,
          padding: 16,
          background: "rgba(255,255,255,0.03)",
          borderRadius: 12,
          border: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <p style={{ fontSize: 12, color: "#6666aa", lineHeight: 1.8 }}>
          SCAMPER는 기존 아이디어를 7가지 관점에서
          <br />
          변형하여 새로운 해결책을 찾는 창의적 사고 기법이에요
        </p>
      </div>
    </div>
        );

      case "learn": {
        const card = SCAMPER_DATA[currentCard];
        if (!card) return null;
        return (
      <div>
        <ScamperGameHeader
          title="기법 배우기"
          onBack={() => {
            setScreen("home");
            setCurrentCard(0);
          }}
        />
        <div style={{ display: "flex", gap: 4, marginBottom: 24 }}>
          {SCAMPER_DATA.map((s, i) => (
            <button
              key={s.key}
              type="button"
              onClick={() => setCurrentCard(i)}
              aria-label={`${s.key} ${s.name}`}
              style={{
                flex: 1,
                height: 4,
                borderRadius: 2,
                cursor: "pointer",
                transition: "all 0.3s ease",
                border: "none",
                padding: 0,
                background:
                  i === currentCard ? s.color : i < currentCard ? `${s.color}66` : "rgba(255,255,255,0.1)",
              }}
            />
          ))}
        </div>
        <div
          key={currentCard}
          style={{
            background: `linear-gradient(145deg, ${card.color}11, ${card.color}05)`,
            border: `1px solid ${card.color}33`,
            borderRadius: 20,
            padding: 28,
            animation: "scamperSlideIn 0.4s ease",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: 14,
                background: `${card.color}22`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 28,
              }}
            >
              {card.icon}
            </div>
            <div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                <span style={{ fontSize: 28, fontWeight: 900, color: card.color }}>{card.key}</span>
                <span style={{ fontSize: 18, fontWeight: 700 }}>{card.name}</span>
              </div>
              <span style={{ fontSize: 12, color: "#8888aa" }}>{card.english}</span>
            </div>
          </div>
          <p style={{ fontSize: 15, lineHeight: 1.8, color: "#ccccdd", marginBottom: 20 }}>{card.desc}</p>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 16,
              background: "rgba(0,0,0,0.3)",
              borderRadius: 12,
              marginBottom: 16,
            }}
          >
            <span style={{ fontSize: 24, fontWeight: 800, color: card.color, letterSpacing: 4 }}>
              {card.formula}
            </span>
          </div>
          <div
            style={{
              padding: 14,
              background: `${card.color}11`,
              borderRadius: 10,
              borderLeft: `3px solid ${card.color}`,
            }}
          >
            <span
              style={{
                fontSize: 11,
                color: card.color,
                fontWeight: 600,
                display: "block",
                marginBottom: 4,
              }}
            >
              💡 예시
            </span>
            <span style={{ fontSize: 14, color: "#ccccdd" }}>{card.example}</span>
          </div>
        </div>
        <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
          <button
            type="button"
            onClick={() => setCurrentCard(Math.max(0, currentCard - 1))}
            disabled={currentCard === 0}
            style={{
              flex: 1,
              padding: "14px 0",
              borderRadius: 12,
              border: "1px solid rgba(255,255,255,0.1)",
              background: "rgba(255,255,255,0.04)",
              color: currentCard === 0 ? "#444" : "#aaa",
              fontSize: 14,
              fontWeight: 600,
              cursor: currentCard === 0 ? "default" : "pointer",
            }}
          >
            ← 이전
          </button>
          <button
            type="button"
            onClick={() => {
              if (currentCard < SCAMPER_DATA.length - 1) setCurrentCard(currentCard + 1);
              else {
                setScreen("home");
                setCurrentCard(0);
              }
            }}
            style={{
              flex: 1,
              padding: "14px 0",
              borderRadius: 12,
              border: "none",
              background: card.color,
              color: "#000",
              fontSize: 14,
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            {currentCard < SCAMPER_DATA.length - 1 ? "다음 →" : "완료 ✓"}
          </button>
        </div>
      </div>
        );
      }

      case "quiz": {
    if (!shuffledQuiz.length) return null;
    const q = shuffledQuiz[quizIndex];
    if (!q) return null;
    const correct = showResult && selected === q.answer;
    const answerTech = getScamperByKey(q.answer);
    return (
      <div>
        <ScamperGameHeader title="퀴즈 도전" onBack={() => setScreen("home")} />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <span style={{ fontSize: 13, color: "#8888aa" }}>
            {quizIndex + 1} / {shuffledQuiz.length}
          </span>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            {streakCount >= 3 && (
              <span style={{ fontSize: 12, color: "#FFEAA7" }}>🔥 {streakCount}연속!</span>
            )}
            <span style={{ fontSize: 13, fontWeight: 700, color: "#4ECDC4" }}>✅ {score}점</span>
          </div>
        </div>
        <div style={{ height: 3, background: "rgba(255,255,255,0.06)", borderRadius: 2, marginBottom: 24 }}>
          <div
            style={{
              height: "100%",
              width: `${((quizIndex + 1) / shuffledQuiz.length) * 100}%`,
              background: "linear-gradient(90deg, #4ECDC4, #45B7D1)",
              borderRadius: 2,
              transition: "width 0.5s ease",
            }}
          />
        </div>
        <div
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 16,
            padding: 24,
            marginBottom: 20,
            textAlign: "center",
          }}
        >
          <span style={{ fontSize: 40, display: "block", marginBottom: 12 }}>{q.item}</span>
          <p style={{ fontSize: 16, lineHeight: 1.7, color: "#dddde8", fontWeight: 500 }}>{q.question}</p>
        </div>
        {!showResult && (
          <button
            type="button"
            onClick={() => setShowHint(!showHint)}
            style={{
              display: "block",
              margin: "0 auto 16px",
              padding: "8px 20px",
              background: "transparent",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 20,
              color: "#FFEAA7",
              fontSize: 12,
              cursor: "pointer",
            }}
          >
            {showHint ? `💡 ${q.hint}` : "💡 힌트 보기"}
          </button>
        )}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {SCAMPER_DATA.map((s) => {
            const isCorrectAnswer = q.answer === s.key;
            let bg = "rgba(255,255,255,0.04)";
            let border = "rgba(255,255,255,0.08)";
            if (showResult) {
              if (isCorrectAnswer) {
                bg = "#4ECDC422";
                border = "#4ECDC4";
              } else if (selected === s.key) {
                bg = "#FF6B6B22";
                border = "#FF6B6B";
              }
            }
            return (
              <button
                key={s.key}
                type="button"
                onClick={() => handleQuizAnswer(s.key)}
                style={{
                  padding: "14px 10px",
                  background: bg,
                  border: `1.5px solid ${border}`,
                  borderRadius: 12,
                  cursor: showResult ? "default" : "pointer",
                  transition: "all 0.2s ease",
                  textAlign: "center",
                }}
              >
                <div style={{ fontSize: 20, marginBottom: 2 }}>{s.icon}</div>
                <div style={{ fontSize: 16, fontWeight: 800, color: s.color }}>{s.key}</div>
                <div style={{ fontSize: 12, color: "#aaa" }}>{s.name}</div>
              </button>
            );
          })}
        </div>
        {showResult && (
          <div
            style={{
              marginTop: 16,
              padding: 16,
              borderRadius: 12,
              textAlign: "center",
              animation: "scamperSlideIn 0.3s ease",
              background: correct ? "#4ECDC411" : "#FF6B6B11",
              border: `1px solid ${correct ? "#4ECDC433" : "#FF6B6B33"}`,
            }}
          >
            <p
              style={{
                fontSize: 16,
                fontWeight: 700,
                color: correct ? "#4ECDC4" : "#FF6B6B",
                marginBottom: 6,
              }}
            >
              {correct ? "🎉 정답이에요!" : "😅 아쉬워요!"}
            </p>
            {!correct && (
              <p style={{ fontSize: 13, color: "#aaa" }}>
                정답은{" "}
                <strong style={{ color: answerTech.color }}>
                  {q.answer} - {answerTech.name}
                </strong>{" "}
                이에요
              </p>
            )}
            <button
              type="button"
              onClick={nextQuestion}
              style={{
                marginTop: 12,
                padding: "10px 28px",
                borderRadius: 10,
                border: "none",
                background: correct ? "#4ECDC4" : "#FF6B6B",
                color: "#000",
                fontSize: 14,
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              {quizIndex < shuffledQuiz.length - 1 ? "다음 문제 →" : "결과 보기"}
            </button>
          </div>
        )}
      </div>
        );
      }

      case "quizResult": {
    const pct = Math.round((score / shuffledQuiz.length) * 100);
    let grade: string;
    let gradeColor: string;
    let msg: string;
    if (pct >= 90) {
      grade = "S";
      gradeColor = "#FFEAA7";
      msg = "SCAMPER 마스터! 🏆";
    } else if (pct >= 70) {
      grade = "A";
      gradeColor = "#4ECDC4";
      msg = "훌륭해요! 거의 다 맞췄어요!";
    } else if (pct >= 50) {
      grade = "B";
      gradeColor = "#45B7D1";
      msg = "좋아요! 조금만 더 연습하면 완벽!";
    } else {
      grade = "C";
      gradeColor = "#FF6B6B";
      msg = "기법 카드를 다시 한번 살펴볼까요?";
    }
    return (
      <div style={{ textAlign: "center", paddingTop: 32 }}>
        <ScamperGameHeader title="퀴즈 결과" onBack={() => setScreen("home")} />
        <div
          style={{
            width: 120,
            height: 120,
            borderRadius: "50%",
            background: `${gradeColor}22`,
            border: `3px solid ${gradeColor}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "24px auto",
            animation: "scamperFloat 2s ease-in-out infinite",
          }}
        >
          <span style={{ fontSize: 48, fontWeight: 900, color: gradeColor }}>{grade}</span>
        </div>
        <p style={{ fontSize: 24, fontWeight: 800, marginBottom: 6 }}>
          {score} / {shuffledQuiz.length}
        </p>
        <p style={{ fontSize: 14, color: "#8888aa", marginBottom: 24 }}>{msg}</p>
        <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
          <button
            type="button"
            onClick={() => {
              resetQuiz();
              setScreen("quiz");
            }}
            style={{
              padding: "12px 24px",
              borderRadius: 12,
              border: "1px solid rgba(255,255,255,0.1)",
              background: "rgba(255,255,255,0.04)",
              color: "#ccc",
              fontSize: 14,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            🔄 다시 도전
          </button>
          <button
            type="button"
            onClick={() => setScreen("home")}
            style={{
              padding: "12px 24px",
              borderRadius: 12,
              border: "none",
              background: gradeColor,
              color: "#000",
              fontSize: 14,
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            🏠 홈으로
          </button>
        </div>
      </div>
        );
      }

      case "challenge": {
    const ch = CREATIVE_CHALLENGES[challengeIndex];
    if (!ch) return null;
    const currentDone = ch.techniques.filter((t) => userIdeas[`${challengeIndex}-${t}`]).length;
    const currentTotal = ch.techniques.length;
    const allDone = currentDone === currentTotal;

    return (
      <div>
        <ScamperGameHeader
          title="창의력 챌린지"
          onBack={() => {
            setScreen("home");
            setSelectedTechnique(null);
          }}
          right={
            completedIdeas > 0 ? (
              <button
                type="button"
                onClick={() => setScreen("ideaGallery")}
                style={{
                  padding: "6px 12px",
                  borderRadius: 8,
                  border: "1px solid rgba(78,205,196,0.3)",
                  background: "rgba(78,205,196,0.1)",
                  color: "#4ECDC4",
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                📋 모아보기
              </button>
            ) : null
          }
        />

        <div style={{ display: "flex", gap: 8, marginBottom: 20, overflowX: "auto", paddingBottom: 4 }}>
          {CREATIVE_CHALLENGES.map((c, i) => {
            const done = c.techniques.filter((t) => userIdeas[`${i}-${t}`]).length;
            const total = c.techniques.length;
            return (
              <button
                key={c.object}
                type="button"
                onClick={() => {
                  setChallengeIndex(i);
                  setSelectedTechnique(null);
                  if (textareaRef.current) textareaRef.current.value = "";
                }}
                style={{
                  padding: "10px 16px",
                  borderRadius: 10,
                  whiteSpace: "nowrap",
                  flexShrink: 0,
                  border: i === challengeIndex ? "1px solid #4ECDC4" : "1px solid rgba(255,255,255,0.08)",
                  background: i === challengeIndex ? "#4ECDC422" : "rgba(255,255,255,0.04)",
                  color: i === challengeIndex ? "#4ECDC4" : "#888",
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                {c.emoji} {c.object}
                {done > 0 && (
                  <span
                    style={{
                      marginLeft: 6,
                      fontSize: 10,
                      padding: "1px 5px",
                      borderRadius: 6,
                      background: done === total ? "#4ECDC433" : "rgba(255,255,255,0.1)",
                      color: done === total ? "#4ECDC4" : "#888",
                    }}
                  >
                    {done}/{total}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <div style={{ marginBottom: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
            <span style={{ fontSize: 11, color: "#8888aa" }}>전체 진행률</span>
            <span style={{ fontSize: 11, color: "#4ECDC4", fontWeight: 700 }}>
              {completedIdeas} / {totalSlots}
            </span>
          </div>
          <div style={{ height: 4, background: "rgba(255,255,255,0.06)", borderRadius: 2 }}>
            <div
              style={{
                height: "100%",
                borderRadius: 2,
                transition: "width 0.5s ease",
                width: `${(completedIdeas / totalSlots) * 100}%`,
                background:
                  completedIdeas === totalSlots
                    ? "linear-gradient(90deg, #FFEAA7, #FF6B6B)"
                    : "linear-gradient(90deg, #4ECDC4, #45B7D1)",
              }}
            />
          </div>
        </div>

        <div
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 16,
            padding: 24,
            marginBottom: 16,
            textAlign: "center",
          }}
        >
          <span style={{ fontSize: 48, display: "block", marginBottom: 8 }}>{ch.emoji}</span>
          <p style={{ fontSize: 18, fontWeight: 700, marginBottom: 6 }}>&quot;{ch.object}&quot;를 혁신해보세요!</p>
          <p style={{ fontSize: 13, color: "#8888aa" }}>
            {allDone ? "🎉 모든 기법을 완료했어요!" : "아래 SCAMPER 기법을 선택하고 아이디어를 적어보세요"}
          </p>
        </div>

        <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
          {ch.techniques.map((key) => {
            const s = getScamperByKey(key);
            const isActive = selectedTechnique === key;
            const hasIdea = userIdeas[`${challengeIndex}-${key}`];
            return (
              <button
                key={key}
                type="button"
                onClick={() => {
                  setSelectedTechnique(key);
                  if (textareaRef.current) textareaRef.current.value = "";
                }}
                style={{
                  flex: 1,
                  padding: "12px 8px",
                  borderRadius: 12,
                  cursor: "pointer",
                  textAlign: "center",
                  position: "relative",
                  transition: "all 0.2s ease",
                  border: `1.5px solid ${isActive ? s.color : hasIdea ? `${s.color}44` : "rgba(255,255,255,0.08)"}`,
                  background: isActive ? `${s.color}22` : "rgba(255,255,255,0.04)",
                }}
              >
                {hasIdea && (
                  <span style={{ position: "absolute", top: -6, right: -6, fontSize: 14 }}>✅</span>
                )}
                <div style={{ fontSize: 18 }}>{s.icon}</div>
                <div style={{ fontSize: 14, fontWeight: 800, color: s.color }}>{s.key}</div>
                <div style={{ fontSize: 11, color: "#aaa" }}>{s.name}</div>
              </button>
            );
          })}
        </div>

        {selectedTechnique && (
          <div style={{ animation: "scamperSlideIn 0.3s ease" }}>
            {(() => {
              const tech = getScamperByKey(selectedTechnique);
              const hintText = ch.hints[selectedTechnique] ?? "";
              return (
                <>
                  <div
                    style={{
                      padding: 12,
                      borderRadius: 10,
                      marginBottom: 12,
                      background: `${tech.color}11`,
                      borderLeft: `3px solid ${tech.color}`,
                    }}
                  >
                    <p style={{ fontSize: 13, color: tech.color }}>💡 {hintText}</p>
                  </div>

                  {userIdeas[`${challengeIndex}-${selectedTechnique}`] ? (
                    <div
                      style={{
                        padding: 16,
                        borderRadius: 12,
                        background: "rgba(78, 205, 196, 0.08)",
                        border: "1px solid rgba(78, 205, 196, 0.2)",
                      }}
                    >
                      <p style={{ fontSize: 12, color: "#4ECDC4", fontWeight: 600, marginBottom: 6 }}>
                        ✨ 나의 아이디어
                      </p>
                      <p style={{ fontSize: 14, color: "#ddd", lineHeight: 1.6 }}>
                        {userIdeas[`${challengeIndex}-${selectedTechnique}`]}
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          const k = `${challengeIndex}-${selectedTechnique}`;
                          setUserIdeas((prev) => {
                            const n = { ...prev };
                            delete n[k];
                            return n;
                          });
                        }}
                        style={{
                          marginTop: 10,
                          padding: "6px 14px",
                          borderRadius: 8,
                          border: "1px solid rgba(255,255,255,0.1)",
                          background: "transparent",
                          color: "#888",
                          fontSize: 12,
                          cursor: "pointer",
                        }}
                      >
                        다시 작성하기
                      </button>
                    </div>
                  ) : (
                    <div>
                      <textarea
                        ref={textareaRef}
                        placeholder="여기에 창의적인 아이디어를 적어보세요..."
                        style={{
                          width: "100%",
                          minHeight: 80,
                          padding: 14,
                          borderRadius: 12,
                          border: `1px solid ${tech.color}44`,
                          background: "rgba(255,255,255,0.04)",
                          color: "#e8e8f0",
                          fontSize: 14,
                          lineHeight: 1.6,
                          resize: "vertical",
                          outline: "none",
                          fontFamily: "inherit",
                          boxSizing: "border-box",
                        }}
                      />
                      <button
                        type="button"
                        onClick={saveIdea}
                        style={{
                          marginTop: 10,
                          width: "100%",
                          padding: "12px 0",
                          borderRadius: 10,
                          border: "none",
                          background: tech.color,
                          color: "#000",
                          fontSize: 14,
                          fontWeight: 700,
                          cursor: "pointer",
                        }}
                      >
                        💾 아이디어 저장
                      </button>
                    </div>
                  )}
                </>
              );
            })()}
          </div>
        )}

        {allDone && (
          <button
            type="button"
            onClick={() => setScreen("challengeResult")}
            style={{
              marginTop: 20,
              width: "100%",
              padding: "16px 0",
              borderRadius: 14,
              border: "none",
              background: "linear-gradient(135deg, #4ECDC4, #45B7D1)",
              color: "#000",
              fontSize: 15,
              fontWeight: 800,
              cursor: "pointer",
              animation: "scamperSlideIn 0.4s ease",
            }}
          >
            🏆 &quot;{ch.object}&quot; 챌린지 결과 보기
          </button>
        )}

        {completedIdeas > 0 && !allDone && (
          <div
            style={{
              marginTop: 20,
              padding: 12,
              background: "rgba(255,255,255,0.03)",
              borderRadius: 10,
              textAlign: "center",
            }}
          >
            <span style={{ fontSize: 13, color: "#8888aa" }}>
              이 챌린지:{" "}
              <strong style={{ color: "#4ECDC4" }}>
                {currentDone}/{currentTotal}
              </strong>
              {" · "}전체:{" "}
              <strong style={{ color: "#FFEAA7" }}>
                {completedIdeas}/{totalSlots}
              </strong>
            </span>
          </div>
        )}
      </div>
        );
      }

      case "challengeResult": {
    const ch = CREATIVE_CHALLENGES[challengeIndex];
    if (!ch) return null;
    return (
      <div>
        <ScamperGameHeader
          title={`${ch.emoji} ${ch.object} 결과`}
          onBack={() => setScreen("challenge")}
        />

        <div style={{ textAlign: "center", marginBottom: 24, animation: "scamperSlideIn 0.4s ease" }}>
          <div
            style={{
              width: 80,
              height: 80,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #4ECDC422, #FFEAA722)",
              border: "2px solid #4ECDC4",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 12px",
              animation: "scamperFloat 2.5s ease-in-out infinite",
            }}
          >
            <span style={{ fontSize: 36 }}>{ch.emoji}</span>
          </div>
          <p style={{ fontSize: 20, fontWeight: 800, marginBottom: 4 }}>&quot;{ch.object}&quot; 혁신 완료!</p>
          <p style={{ fontSize: 13, color: "#8888aa" }}>
            {ch.techniques.length}가지 관점으로 아이디어를 만들었어요
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 24 }}>
          {ch.techniques.map((key, i) => {
            const s = getScamperByKey(key);
            const idea = userIdeas[`${challengeIndex}-${key}`];
            return (
              <div
                key={key}
                style={{
                  padding: 18,
                  borderRadius: 14,
                  background: `linear-gradient(135deg, ${s.color}11, transparent)`,
                  border: `1px solid ${s.color}33`,
                  animation: `scamperSlideIn 0.4s ease ${i * 0.1}s both`,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 8,
                      background: `${s.color}22`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 16,
                    }}
                  >
                    {s.icon}
                  </div>
                  <span style={{ fontSize: 14, fontWeight: 800, color: s.color }}>{s.key}</span>
                  <span style={{ fontSize: 12, color: "#8888aa" }}>
                    {s.name} ({s.english})
                  </span>
                </div>
                <p
                  style={{
                    fontSize: 14,
                    color: "#ddd",
                    lineHeight: 1.7,
                    padding: 12,
                    background: "rgba(0,0,0,0.2)",
                    borderRadius: 10,
                  }}
                >
                  💬 {idea ?? "—"}
                </p>
              </div>
            );
          })}
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <button
            type="button"
            onClick={() => setScreen("challenge")}
            style={{
              flex: 1,
              padding: "14px 0",
              borderRadius: 12,
              border: "1px solid rgba(255,255,255,0.1)",
              background: "rgba(255,255,255,0.04)",
              color: "#aaa",
              fontSize: 14,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            ← 수정하기
          </button>
          {completedIdeas >= 3 ? (
            <button
              type="button"
              onClick={() => setScreen("ideaGallery")}
              style={{
                flex: 1,
                padding: "14px 0",
                borderRadius: 12,
                border: "none",
                background: "linear-gradient(135deg, #FFEAA7, #FF6B6B)",
                color: "#000",
                fontSize: 14,
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              📋 전체 모아보기
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                const nextIdx = CREATIVE_CHALLENGES.findIndex(
                  (c, i) => i !== challengeIndex && c.techniques.some((t) => !userIdeas[`${i}-${t}`])
                );
                if (nextIdx >= 0) {
                  setChallengeIndex(nextIdx);
                  setSelectedTechnique(null);
                  setScreen("challenge");
                } else setScreen("ideaGallery");
              }}
              style={{
                flex: 1,
                padding: "14px 0",
                borderRadius: 12,
                border: "none",
                background: "#4ECDC4",
                color: "#000",
                fontSize: 14,
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              🚀 다음 챌린지
            </button>
          )}
        </div>
      </div>
        );
      }

      case "ideaGallery": {
    const pct = Math.round((completedIdeas / totalSlots) * 100);
    let grade: string;
    let gradeColor: string;
    let gradeMsg: string;
    if (pct === 100) {
      grade = "🏆";
      gradeColor = "#FFEAA7";
      gradeMsg = "모든 챌린지 완료! 창의력 마스터!";
    } else if (pct >= 75) {
      grade = "🌟";
      gradeColor = "#4ECDC4";
      gradeMsg = "대단해요! 거의 다 채웠어요!";
    } else if (pct >= 50) {
      grade = "✨";
      gradeColor = "#45B7D1";
      gradeMsg = "절반 이상 완료! 잘하고 있어요!";
    } else {
      grade = "🌱";
      gradeColor = "#96CEB4";
      gradeMsg = "좋은 시작이에요! 더 도전해볼까요?";
    }

    return (
      <div>
        <ScamperGameHeader title="나의 아이디어 갤러리" onBack={() => setScreen("home")} />

        <div
          style={{
            textAlign: "center",
            padding: 24,
            marginBottom: 20,
            borderRadius: 16,
            background: "linear-gradient(145deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))",
            border: `1px solid ${gradeColor}33`,
          }}
        >
          <span
            style={{
              fontSize: 48,
              display: "block",
              marginBottom: 8,
              animation: "scamperFloat 2.5s ease-in-out infinite",
            }}
          >
            {grade}
          </span>
          <p style={{ fontSize: 22, fontWeight: 800, marginBottom: 4 }}>{completedIdeas}개의 아이디어</p>
          <p style={{ fontSize: 13, color: gradeColor, marginBottom: 16 }}>{gradeMsg}</p>

          <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap" }}>
            {CREATIVE_CHALLENGES.map((ch, ci) => {
              const done = ch.techniques.filter((t) => userIdeas[`${ci}-${t}`]).length;
              const total = ch.techniques.length;
              return (
                <div
                  key={ch.object}
                  style={{
                    padding: "8px 12px",
                    borderRadius: 10,
                    background: done === total ? "#4ECDC422" : "rgba(255,255,255,0.04)",
                    border: `1px solid ${done === total ? "#4ECDC444" : "rgba(255,255,255,0.08)"}`,
                  }}
                >
                  <span style={{ fontSize: 18, display: "block" }}>{ch.emoji}</span>
                  <span
                    style={{
                      fontSize: 11,
                      color: done === total ? "#4ECDC4" : "#888",
                      fontWeight: 600,
                    }}
                  >
                    {done}/{total}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {CREATIVE_CHALLENGES.map((ch, ci) => {
          const ideas = ch.techniques.filter((t) => userIdeas[`${ci}-${t}`]);
          if (ideas.length === 0) return null;
          return (
            <div key={ch.object} style={{ marginBottom: 20 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                <span style={{ fontSize: 20 }}>{ch.emoji}</span>
                <span style={{ fontSize: 15, fontWeight: 700 }}>{ch.object}</span>
                <span style={{ fontSize: 11, color: "#4ECDC4", fontWeight: 600 }}>
                  {ideas.length}/{ch.techniques.length}
                </span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {ideas.map((t) => {
                  const s = getScamperByKey(t);
                  return (
                    <div
                      key={t}
                      style={{
                        padding: 14,
                        borderRadius: 12,
                        background: `${s.color}09`,
                        border: `1px solid ${s.color}22`,
                      }}
                    >
                      <span
                        style={{
                          fontSize: 12,
                          fontWeight: 800,
                          color: s.color,
                          padding: "2px 8px",
                          borderRadius: 6,
                          background: `${s.color}22`,
                        }}
                      >
                        {s.key} {s.name}
                      </span>
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
          <button
            type="button"
            onClick={() => setScreen("challenge")}
            style={{
              flex: 1,
              padding: "14px 0",
              borderRadius: 12,
              border: "1px solid rgba(255,255,255,0.1)",
              background: "rgba(255,255,255,0.04)",
              color: "#aaa",
              fontSize: 14,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            🚀 더 도전하기
          </button>
          <button
            type="button"
            onClick={() => {
              setUserIdeas({});
              setScreen("home");
            }}
            style={{
              flex: 1,
              padding: "14px 0",
              borderRadius: 12,
              border: "1px solid rgba(255,107,107,0.3)",
              background: "rgba(255,107,107,0.08)",
              color: "#FF6B6B",
              fontSize: 14,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            🗑️ 초기화
          </button>
        </div>
      </div>
        );
      }

      default:
        return null;
    }
  };

  return (
    <div
      className="scamper-game flex min-h-0 min-w-0 flex-1 flex-col"
      style={{
        background: "linear-gradient(135deg, #0a0a1a 0%, #1a1a2e 50%, #16213e 100%)",
        fontFamily: "'Pretendard', 'Noto Sans KR', -apple-system, sans-serif",
        color: "#e8e8f0",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;600;700;800;900&display=swap');
        .scamper-game * { box-sizing: border-box; }
        @keyframes scamperFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        @keyframes scamperSlideIn {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes scamperParticleFade {
          0% { opacity: 0; transform: scale(0) translateY(0); }
          30% { opacity: 1; transform: scale(1.2); }
          100% { opacity: 0; transform: scale(0.5) translateY(-60px); }
        }
        .scamper-game textarea::placeholder { color: #555; }
        .scamper-game ::-webkit-scrollbar { width: 4px; }
        .scamper-game ::-webkit-scrollbar-track { background: transparent; }
        .scamper-game ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 2px; }
      `}</style>

      <ScamperParticles burstKey={celebrate} />

      <div
        className="min-h-0 flex-1 overflow-y-auto"
        style={{ maxWidth: 520, margin: "0 auto", padding: "20px 16px", position: "relative", width: "100%" }}
      >
        {renderScreen()}
      </div>
    </div>
  );
}
