"use client";

import { useState } from "react";
import { ROOT_HUNTER_SCENARIOS } from "@/data/rootHunterScenarios";
import type { Scenario, LevelOption } from "@/data/rootHunterScenarios";

const SCENARIOS = ROOT_HUNTER_SCENARIOS;

interface TreeSVGProps {
  progress: number;
  isComplete: boolean;
  shake: boolean;
  wrong?: boolean;
  fruitLabel?: string;
}

function TreeSVG({ progress, isComplete, shake, fruitLabel }: TreeSVGProps) {
  const trunkColor = isComplete ? "#4a7c59" : "#6b4c2a";
  const leafColor = isComplete ? "#2d6a4f" : "#52b788";
  const rootColor = isComplete ? "#1b4332" : "#795548";
  const displayFruit = fruitLabel ?? SCENARIOS[0].fruit;

  return (
    <svg viewBox="0 0 200 280" style={{ width: "100%", height: "100%", overflow: "visible" }}>
      <ellipse cx="100" cy="230" rx="80" ry="10" fill="#8B7355" opacity="0.4" />
      {[0, 1, 2, 3, 4].map((i) => {
        const angle = -60 + i * 30;
        const rad = (angle * Math.PI) / 180;
        const len = progress >= 4 ? 35 + i * 5 : progress >= 3 ? 20 : 0;
        const x2 = 100 + Math.cos(rad) * len;
        const y2 = 230 + Math.sin(rad) * len * 0.6 + 10;
        return (
          <line
            key={i}
            x1="100"
            y1="225"
            x2={x2}
            y2={y2}
            stroke={rootColor}
            strokeWidth={progress >= 5 ? 4 : 3}
            strokeLinecap="round"
            style={{ transition: "all 0.8s ease" }}
          />
        );
      })}
      <rect
        x="90"
        y={230 - (progress >= 1 ? 130 : 10)}
        width="20"
        height={progress >= 1 ? 130 : 10}
        rx="5"
        fill={trunkColor}
        style={{ transition: "all 0.8s ease" }}
      />
      {progress >= 2 && (
        <>
          <line
            x1="100"
            y1="130"
            x2="60"
            y2="100"
            stroke={trunkColor}
            strokeWidth="8"
            strokeLinecap="round"
            style={{ transition: "all 0.8s ease" }}
          />
          <line
            x1="100"
            y1="130"
            x2="140"
            y2="100"
            stroke={trunkColor}
            strokeWidth="8"
            strokeLinecap="round"
            style={{ transition: "all 0.8s ease" }}
          />
        </>
      )}
      {progress >= 3 && (
        <>
          <line
            x1="60"
            y1="100"
            x2="40"
            y2="75"
            stroke={trunkColor}
            strokeWidth="5"
            strokeLinecap="round"
            style={{ transition: "all 0.8s ease" }}
          />
          <line
            x1="140"
            y1="100"
            x2="160"
            y2="75"
            stroke={trunkColor}
            strokeWidth="5"
            strokeLinecap="round"
            style={{ transition: "all 0.8s ease" }}
          />
          <line
            x1="100"
            y1="110"
            x2="100"
            y2="75"
            stroke={trunkColor}
            strokeWidth="5"
            strokeLinecap="round"
            style={{ transition: "all 0.8s ease" }}
          />
        </>
      )}
      {progress >= 2 && (
        <>
          {[
            [100, 65, 60],
            [55, 75, 45],
            [145, 75, 45],
            [40, 55, 35],
            [160, 55, 35],
            [75, 50, 30],
            [125, 50, 30],
          ].map(([cx, cy, r], i) => (
            <circle
              key={i}
              cx={cx}
              cy={cy}
              r={r}
              fill={leafColor}
              opacity={0.85}
              style={{ transition: "all 0.8s ease" }}
            />
          ))}
        </>
      )}
      {isComplete &&
        [[75, 55], [125, 58], [100, 42], [55, 68], [145, 65]].map(([fx, fy], i) => (
          <text
            key={i}
            x={fx}
            y={fy}
            fontSize="14"
            textAnchor="middle"
            style={{ animation: `fruitPop 0.3s ${i * 0.1}s ease both` }}
          >
            🍒
          </text>
        ))}
      {progress === 0 && (
        <text
          x="100"
          y="55"
          fontSize="28"
          textAnchor="middle"
          style={{
            filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.3))",
            animation: shake ? "shake 0.4s ease" : "none",
          }}
        >
          {displayFruit}
        </text>
      )}
      {isComplete && (
        <ellipse
          cx="100"
          cy="60"
          rx="65"
          ry="55"
          fill="#52b788"
          opacity={0.15}
          style={{ animation: "pulse 2s ease infinite" }}
        />
      )}
    </svg>
  );
}

const depthColors = ["#a8dadc", "#74c69d", "#52b788", "#2d6a4f", "#1b4332"];
const depthEmojis = ["🌿", "🌱", "🪵", "🔍", "💡"];

const styles: Record<string, React.CSSProperties> = {
  app: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #0d1f12 0%, #1b4332 50%, #0d1f12 100%)",
    display: "flex",
    flexDirection: "column",
    fontFamily: "'Gaegu', cursive",
  },
  center: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "24px 16px",
    minHeight: "100vh",
  },
  homeCard: {
    background: "rgba(255,255,255,0.97)",
    borderRadius: 28,
    padding: "48px 40px",
    maxWidth: 480,
    width: "100%",
    textAlign: "center",
    boxShadow: "0 24px 64px rgba(0,0,0,0.4)",
  },
  title: { fontFamily: "'Gaegu', cursive", fontSize: 40, color: "#1b4332", fontWeight: 700, lineHeight: 1.1 },
  subtitle: {
    fontFamily: "'Noto Serif KR', serif",
    fontSize: 15,
    color: "#95d5b2",
    letterSpacing: "4px",
    marginBottom: 16,
    marginTop: 4,
  },
  desc: {
    fontFamily: "'Noto Serif KR', serif",
    fontSize: 15,
    color: "#2d6a4f",
    lineHeight: 1.8,
    marginBottom: 28,
  },
  modeBtn: {
    flex: 1,
    padding: "12px 8px",
    borderRadius: 14,
    border: "2px solid #d8f3dc",
    background: "#f8fff9",
    cursor: "pointer",
    fontFamily: "'Gaegu', cursive",
    fontSize: 15,
    color: "#52b788",
    transition: "all 0.2s",
  },
  modeBtnActive: {
    background: "#d8f3dc",
    borderColor: "#52b788",
    color: "#1b4332",
    fontWeight: 700,
  },
  teamConfig: {
    background: "#f0fdf4",
    borderRadius: 16,
    padding: "16px",
    marginBottom: 20,
    textAlign: "center",
  },
  numBtn: {
    padding: "8px 16px",
    borderRadius: 10,
    border: "2px solid #d8f3dc",
    background: "#fff",
    cursor: "pointer",
    fontFamily: "'Gaegu'",
    fontSize: 15,
    color: "#52b788",
    transition: "all 0.2s",
  },
  numBtnActive: { background: "#52b788", borderColor: "#52b788", color: "#fff" },
  startBtn: {
    padding: "14px 32px",
    borderRadius: 999,
    border: "none",
    background: "linear-gradient(135deg, #52b788, #2d6a4f)",
    color: "#fff",
    cursor: "pointer",
    fontFamily: "'Gaegu', cursive",
    fontSize: 18,
    boxShadow: "0 8px 24px rgba(82,183,136,0.4)",
    transition: "all 0.2s",
  },
  badges: { display: "flex", gap: 8, justifyContent: "center", marginTop: 20, flexWrap: "wrap" },
  badge: {
    padding: "4px 12px",
    background: "#d8f3dc",
    color: "#1b4332",
    borderRadius: 999,
    fontSize: 12,
    fontFamily: "'Noto Serif KR', serif",
  },
  selectWrap: {
    minHeight: "100vh",
    padding: "32px 24px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  backBtn: {
    background: "rgba(255,255,255,0.1)",
    border: "1px solid rgba(255,255,255,0.2)",
    color: "#95d5b2",
    padding: "8px 16px",
    borderRadius: 10,
    cursor: "pointer",
    fontFamily: "'Gaegu'",
    fontSize: 15,
    alignSelf: "flex-start",
    marginBottom: 24,
    transition: "all 0.2s",
  },
  selectTitle: { fontFamily: "'Gaegu', cursive", fontSize: 28, color: "#fff", marginBottom: 8 },
  scenarioGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: 20,
    maxWidth: 880,
    width: "100%",
  },
  scenarioCard: {
    background: "rgba(255,255,255,0.95)",
    borderRadius: 24,
    padding: "32px 24px",
    textAlign: "center",
    boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
    cursor: "pointer",
    transition: "transform 0.2s ease, box-shadow 0.2s ease",
  },
  scenarioTitle: {
    fontFamily: "'Noto Serif KR', serif",
    fontSize: 16,
    color: "#1b4332",
    fontWeight: 600,
    marginBottom: 6,
  },
  scenarioSub: { fontFamily: "'Gaegu'", fontSize: 13, color: "#95d5b2" },
  tagChip: { padding: "3px 10px", borderRadius: 999, fontSize: 11, fontFamily: "'Gaegu'" },
  gameWrap: { display: "flex", minHeight: "100vh", gap: 0, flexWrap: "wrap" },
  treePanel: {
    flex: "0 0 300px",
    background: "rgba(0,0,0,0.25)",
    padding: "24px 16px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    minHeight: "100vh",
    borderRight: "1px solid rgba(255,255,255,0.08)",
  },
  problemBubble: {
    background: "rgba(255,255,255,0.9)",
    borderRadius: 16,
    padding: "10px 16px",
    display: "flex",
    gap: 10,
    alignItems: "center",
    width: "100%",
    marginBottom: 8,
    boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
  },
  progressRow: { display: "flex", gap: 8, marginTop: 8 },
  questionPanel: {
    flex: 1,
    padding: "32px 28px",
    display: "flex",
    flexDirection: "column",
    maxWidth: 640,
    minWidth: 280,
  },
  topBar: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 },
  playerTag: {
    background: "rgba(255,255,255,0.15)",
    borderRadius: 999,
    padding: "6px 16px",
    fontFamily: "'Gaegu'",
    fontSize: 15,
    color: "#d8f3dc",
  },
  scoreTag: {
    background: "rgba(82,183,136,0.2)",
    borderRadius: 999,
    padding: "6px 16px",
    fontFamily: "'Gaegu'",
    fontSize: 15,
    color: "#95d5b2",
  },
  whyBadge: { marginBottom: 12 },
  questionBox: {
    background: "rgba(255,255,255,0.08)",
    borderRadius: 20,
    padding: "20px 22px",
    marginBottom: 20,
    border: "1px solid rgba(255,255,255,0.1)",
  },
  questionText: {
    fontFamily: "'Noto Serif KR', serif",
    fontSize: 18,
    color: "#fff",
    fontWeight: 600,
    lineHeight: 1.6,
    marginBottom: 10,
  },
  hintText: { fontFamily: "'Gaegu'", fontSize: 13, color: "#95d5b2" },
  feedbackBox: {
    borderRadius: 14,
    padding: "12px 16px",
    marginTop: 12,
    fontFamily: "'Noto Serif KR', serif",
    fontSize: 14,
    border: "1.5px solid",
    color: "#1b4332",
  },
  teamInfo: { display: "flex", gap: 8, alignItems: "center", marginTop: 20, flexWrap: "wrap" },
  playerChip: {
    width: 36,
    height: 36,
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "'Gaegu'",
    fontSize: 14,
    fontWeight: 700,
    transition: "all 0.3s ease",
  },
  resultCard: {
    background: "rgba(255,255,255,0.97)",
    borderRadius: 28,
    padding: "48px 40px",
    maxWidth: 500,
    width: "100%",
    textAlign: "center",
    boxShadow: "0 24px 64px rgba(0,0,0,0.4)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 12,
  },
  rootCauseBox: {
    background: "#f0fdf4",
    borderRadius: 16,
    padding: "16px 20px",
    width: "100%",
    border: "2px solid #95d5b2",
  },
  rootText: {
    fontFamily: "'Noto Serif KR', serif",
    fontSize: 16,
    color: "#1b4332",
    fontWeight: 600,
    lineHeight: 1.6,
  },
  solutionBox: {
    background: "#fff9f0",
    borderRadius: 16,
    padding: "16px 20px",
    width: "100%",
    border: "2px solid #ffd166",
  },
  scoreDisplay: { display: "flex", flexDirection: "column", alignItems: "center", gap: 4 },
  replayBtn: {
    padding: "14px 24px",
    borderRadius: 999,
    border: "2px solid #52b788",
    background: "transparent",
    color: "#1b4332",
    cursor: "pointer",
    fontFamily: "'Gaegu', cursive",
    fontSize: 16,
    transition: "all 0.2s",
  },
  tip: {
    marginTop: 8,
    background: "#f0fdf4",
    borderRadius: 14,
    padding: "14px 18px",
    fontFamily: "'Noto Serif KR', serif",
    fontSize: 13,
    color: "#2d6a4f",
    lineHeight: 1.8,
    textAlign: "left",
    width: "100%",
    borderLeft: "4px solid #52b788",
  },
};

export function RootHunter() {
  const [screen, setScreen] = useState<"home" | "select" | "game" | "result">("home");
  const [scenario, setScenario] = useState<Scenario | null>(null);
  const [currentLevel, setCurrentLevel] = useState(0);
  const [progress, setProgress] = useState(0);
  const [selected, setSelected] = useState<LevelOption | null>(null);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [score, setScore] = useState(0);
  const [tries, setTries] = useState(0);
  const [shake, setShake] = useState(false);
  const [mode, setMode] = useState<"solo" | "team">("solo");
  const [teamSize, setTeamSize] = useState(3);

  const isComplete = progress >= 5;

  const startGame = (s: Scenario) => {
    setScenario(s);
    setCurrentLevel(0);
    setProgress(0);
    setSelected(null);
    setFeedback(null);
    setScore(0);
    setTries(0);
    setScreen("game");
  };

  const handleAnswer = (opt: LevelOption) => {
    if (feedback === "correct") return;
    setSelected(opt);
    setTries((t) => t + 1);

    if (opt.correct) {
      setFeedback("correct");
      setScore((s) => s + Math.max(10, 30 - (tries + 1) * 5));
      setProgress((p) => p + 1);
      setTimeout(() => {
        if (currentLevel < 4) {
          setCurrentLevel((l) => l + 1);
          setSelected(null);
          setFeedback(null);
          setTries(0);
        } else {
          setScreen("result");
        }
      }, 1400);
    } else {
      setFeedback("wrong");
      setShake(true);
      setTimeout(() => {
        setShake(false);
        setFeedback(null);
        setSelected(null);
      }, 900);
    }
  };

  const currentPlayer =
    mode === "team" ? `플레이어 ${(currentLevel % teamSize) + 1}` : "탐험가";

  return (
    <div style={styles.app}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Gaegu:wght@400;700&family=Noto+Serif+KR:wght@400;600;700&display=swap');
        .root-hunter * { box-sizing: border-box; }
        @keyframes shake {
          0%,100% { transform: translateX(0); }
          20% { transform: translateX(-8px); }
          40% { transform: translateX(8px); }
          60% { transform: translateX(-5px); }
          80% { transform: translateX(5px); }
        }
        @keyframes pulse {
          0%,100% { opacity: 0.1; }
          50% { opacity: 0.25; }
        }
        @keyframes fruitPop {
          from { transform: scale(0) rotate(-20deg); opacity: 0; }
          to { transform: scale(1) rotate(0); opacity: 1; }
        }
        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes bounce {
          0%,100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
        @keyframes glow {
          0%,100% { box-shadow: 0 0 8px rgba(82,183,136,0.3); }
          50% { box-shadow: 0 0 20px rgba(82,183,136,0.7); }
        }
        .root-hunter .btn-option {
          width: 100%;
          padding: 14px 18px;
          margin-bottom: 10px;
          border-radius: 16px;
          border: 2.5px solid #d8f3dc;
          background: rgba(255,255,255,0.9);
          cursor: pointer;
          font-family: 'Noto Serif KR', serif;
          font-size: 15px;
          color: #1b4332;
          text-align: left;
          transition: all 0.2s ease;
          animation: slideUp 0.3s ease both;
        }
        .root-hunter .btn-option:hover { background: #d8f3dc; transform: translateX(4px); border-color: #52b788; }
        .root-hunter .btn-option.correct { background: #b7e4c7; border-color: #52b788; animation: glow 1s ease infinite; }
        .root-hunter .btn-option.wrong { background: #ffd6d6; border-color: #e63946; animation: shake 0.4s ease; }
        .root-hunter .depth-badge {
          display: inline-block;
          padding: 4px 12px;
          border-radius: 999px;
          font-size: 12px;
          font-weight: 700;
          font-family: 'Gaegu', cursive;
          letter-spacing: 0.5px;
        }
        .root-hunter .progress-step {
          width: 36px; height: 36px;
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-size: 16px;
          transition: all 0.4s ease;
          border: 2px solid transparent;
        }
        .root-hunter .card-hover { transition: transform 0.2s ease, box-shadow 0.2s ease; cursor: pointer; }
        .root-hunter .card-hover:hover { transform: translateY(-4px); box-shadow: 0 12px 32px rgba(27,67,50,0.2); }
      `}</style>

      <div className="root-hunter">
        {screen === "home" && (
          <div style={styles.center}>
            <div style={styles.homeCard}>
              <div style={{ fontSize: 72, marginBottom: 16, animation: "bounce 2s ease infinite" }}>
                🌳
              </div>
              <h1 style={styles.title}>뿌리를 찾아라</h1>
              <p style={styles.subtitle}>Root Hunter</p>
              <p style={styles.desc}>
                문제의 겉모습(열매)에서 시작해
                <br />
                &apos;왜?&apos;를 5번 파고들어 진짜 뿌리를 찾아요
              </p>
              <div style={{ display: "flex", gap: 12, marginBottom: 24 }}>
                {(["solo", "team"] as const).map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setMode(m)}
                    style={{ ...styles.modeBtn, ...(mode === m ? styles.modeBtnActive : {}) }}
                  >
                    {m === "solo" ? "🧑 개인 탐험" : "👥 팀 협동"}
                  </button>
                ))}
              </div>
              {mode === "team" && (
                <div style={styles.teamConfig}>
                  <p
                    style={{
                      fontSize: 14,
                      color: "#2d6a4f",
                      marginBottom: 8,
                      fontFamily: "'Noto Serif KR'",
                    }}
                  >
                    팀원 수 선택 (각 팀원이 하나의 Why를 담당해요)
                  </p>
                  <div style={{ display: "flex", gap: 8 }}>
                    {[2, 3, 4, 5].map((n) => (
                      <button
                        key={n}
                        type="button"
                        onClick={() => setTeamSize(n)}
                        style={{
                          ...styles.numBtn,
                          ...(teamSize === n ? styles.numBtnActive : {}),
                        }}
                      >
                        {n}명
                      </button>
                    ))}
                  </div>
                </div>
              )}
              <button type="button" onClick={() => setScreen("select")} style={styles.startBtn}>
                탐험 시작하기 🌿
              </button>
              <div style={styles.badges}>
                {["인과관계 사고", "팀워크", "비판적 사고"].map((b) => (
                  <span key={b} style={styles.badge}>
                    {b}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {screen === "select" && (
          <div style={styles.selectWrap}>
            <button type="button" onClick={() => setScreen("home")} style={styles.backBtn}>
              ← 뒤로
            </button>
            <h2 style={styles.selectTitle}>어떤 문제를 탐험할까요?</h2>
            <p
              style={{
                color: "#52b788",
                fontFamily: "'Gaegu'",
                fontSize: 16,
                marginBottom: 24,
              }}
            >
              나무 열매를 클릭해 시작하세요
            </p>
            <div style={styles.scenarioGrid}>
              {SCENARIOS.map((s, i) => (
                <div
                  key={s.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => startGame(s)}
                  onKeyDown={(e) => e.key === "Enter" && startGame(s)}
                  className="card-hover"
                  style={{
                    ...styles.scenarioCard,
                    animationDelay: `${i * 0.1}s`,
                    animation: "slideUp 0.4s ease both",
                  }}
                >
                  <div style={{ fontSize: 48, marginBottom: 12 }}>{s.fruit}</div>
                  <h3 style={styles.scenarioTitle}>{s.title}</h3>
                  <p style={styles.scenarioSub}>5단계 인과관계 탐험</p>
                  <div
                    style={{
                      marginTop: 12,
                      display: "flex",
                      gap: 6,
                      flexWrap: "wrap",
                      justifyContent: "center",
                    }}
                  >
                    {["가지1", "가지2", "줄기", "뿌리1", "근본"].map((tag, ti) => (
                      <span
                        key={tag}
                        style={{
                          ...styles.tagChip,
                          background: depthColors[ti] + "40",
                          color: depthColors[ti],
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {screen === "game" && scenario && (
          <div style={styles.gameWrap}>
            <div style={styles.treePanel}>
              <div style={styles.problemBubble}>
                <span style={{ fontSize: 20 }}>{scenario.fruit}</span>
                <span
                  style={{
                    fontFamily: "'Noto Serif KR'",
                    fontSize: 13,
                    color: "#1b4332",
                  }}
                >
                  {scenario.title}
                </span>
              </div>
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <TreeSVG
                  progress={progress}
                  isComplete={isComplete}
                  shake={shake}
                  fruitLabel={scenario.fruit}
                />
              </div>
              <div style={styles.progressRow}>
                {[0, 1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="progress-step"
                    style={{
                      background:
                        i < progress
                          ? depthColors[i]
                          : i === currentLevel
                            ? depthColors[i] + "80"
                            : "#e8f5e9",
                      border:
                        i === currentLevel
                          ? `2px solid ${depthColors[i]}`
                          : "2px solid transparent",
                      fontSize: i < progress ? 16 : 14,
                      color: i < progress ? "#fff" : "#888",
                    }}
                  >
                    {i < progress ? "✓" : depthEmojis[i]}
                  </div>
                ))}
              </div>
              <p
                style={{
                  fontFamily: "'Gaegu'",
                  fontSize: 13,
                  color: "#95d5b2",
                  textAlign: "center",
                  marginTop: 6,
                }}
              >
                뿌리 깊이: {progress}/5
              </p>
            </div>
            <div style={styles.questionPanel}>
              <div style={styles.topBar}>
                <div style={styles.playerTag}>
                  {mode === "team" ? `🎮 ${currentPlayer}의 차례` : "🧭 탐험가"}
                </div>
                <div style={styles.scoreTag}>💰 {score}점</div>
              </div>
              <div style={{ marginBottom: 16 }}>
                <span
                  className="depth-badge"
                  style={{
                    background: depthColors[currentLevel] + "30",
                    color: depthColors[currentLevel],
                  }}
                >
                  {depthEmojis[currentLevel]} {scenario.levels[currentLevel].depth}
                </span>
              </div>
              <div style={styles.whyBadge}>
                <span
                  style={{
                    fontSize: 28,
                    fontWeight: 900,
                    color: depthColors[currentLevel],
                  }}
                >
                  Why {currentLevel + 1}?
                </span>
              </div>
              <div style={styles.questionBox}>
                <p style={styles.questionText}>
                  {scenario.levels[currentLevel].question}
                </p>
                <p style={styles.hintText}>
                  💡 {scenario.levels[currentLevel].hint}
                </p>
              </div>
              <div>
                {scenario.levels[currentLevel].options.map((opt, i) => {
                  let cls = "btn-option";
                  if (selected === opt)
                    cls += feedback === "correct" ? " correct" : " wrong";
                  return (
                    <button
                      key={i}
                      type="button"
                      className={cls}
                      onClick={() => handleAnswer(opt)}
                      style={{ animationDelay: `${i * 0.08}s` }}
                    >
                      <span style={{ marginRight: 10, opacity: 0.5 }}>
                        {["A", "B", "C"][i]}.
                      </span>
                      {opt.text}
                    </button>
                  );
                })}
              </div>
              {feedback && (
                <div
                  style={{
                    ...styles.feedbackBox,
                    background: feedback === "correct" ? "#d8f3dc" : "#ffd6d6",
                    borderColor: feedback === "correct" ? "#52b788" : "#e63946",
                    animation: "slideUp 0.3s ease",
                  }}
                >
                  {feedback === "correct"
                    ? "🎉 정확해요! 한 단계 더 깊이 파고들었어요."
                    : "🍂 다시 생각해봐요. 진짜 원인을 찾아보세요!"}
                </div>
              )}
              {mode === "team" && (
                <div style={styles.teamInfo}>
                  {Array.from({ length: teamSize }).map((_, i) => (
                    <div
                      key={i}
                      style={{
                        ...styles.playerChip,
                        background:
                          i === currentLevel % teamSize
                            ? depthColors[currentLevel]
                            : "#e8f5e9",
                        color:
                          i === currentLevel % teamSize ? "#fff" : "#888",
                      }}
                    >
                      P{i + 1}
                    </div>
                  ))}
                  <span
                    style={{
                      fontSize: 12,
                      color: "#95d5b2",
                      fontFamily: "'Gaegu'",
                    }}
                  >
                    팀원 돌아가며 탐험
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {screen === "result" && scenario && (
          <div style={styles.center}>
            <div style={styles.resultCard}>
              <div
                style={{
                  fontSize: 64,
                  animation: "bounce 1.5s ease infinite",
                }}
              >
                🌳
              </div>
              <h2
                style={{
                  fontFamily: "'Gaegu'",
                  fontSize: 32,
                  color: "#1b4332",
                  marginBottom: 4,
                }}
              >
                뿌리 발견! 🎉
              </h2>
              <p
                style={{
                  fontFamily: "'Noto Serif KR'",
                  color: "#52b788",
                  fontSize: 14,
                  marginBottom: 20,
                }}
              >
                나무가 건강하게 자랐어요
              </p>
              <div style={styles.rootCauseBox}>
                <p
                  style={{
                    fontSize: 12,
                    color: "#95d5b2",
                    fontFamily: "'Gaegu'",
                    marginBottom: 6,
                  }}
                >
                  💡 근본 원인 (Root Cause)
                </p>
                <p style={styles.rootText}>{scenario.rootCause}</p>
              </div>
              <div style={styles.solutionBox}>
                <p
                  style={{
                    fontSize: 12,
                    color: "#52b788",
                    fontFamily: "'Gaegu'",
                    marginBottom: 6,
                  }}
                >
                  🌱 해결 방향
                </p>
                <p
                  style={{
                    fontFamily: "'Noto Serif KR'",
                    fontSize: 14,
                    color: "#1b4332",
                    lineHeight: 1.7,
                  }}
                >
                  {scenario.solution}
                </p>
              </div>
              <div style={styles.scoreDisplay}>
                <span
                  style={{
                    fontFamily: "'Gaegu'",
                    fontSize: 18,
                    color: "#52b788",
                  }}
                >
                  최종 점수
                </span>
                <span
                  style={{
                    fontFamily: "'Gaegu'",
                    fontSize: 40,
                    color: "#1b4332",
                    fontWeight: 700,
                  }}
                >
                  {score}점
                </span>
              </div>
              <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
                <button
                  type="button"
                  onClick={() => startGame(scenario)}
                  style={styles.replayBtn}
                >
                  🔄 다시 탐험
                </button>
                <button
                  type="button"
                  onClick={() => setScreen("select")}
                  style={styles.startBtn}
                >
                  🌿 다른 문제 탐험
                </button>
              </div>
              <div style={styles.tip}>
                <strong>교실 활용 팁:</strong> 결과를 보드에 공유하고
                <br />
                &quot;우리 학교/가정에서 이 뿌리를 어떻게 고칠까?&quot; 토론해보세요!
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
