/** SCAMPER 창의적 사고 게임 정적 데이터 */

export type ScamperKey = "S" | "C" | "A" | "M" | "P" | "E" | "R";

export interface ScamperTechnique {
  key: ScamperKey;
  name: string;
  english: string;
  icon: string;
  color: string;
  desc: string;
  formula: string;
  example: string;
}

export interface ScamperQuizQuestion {
  question: string;
  answer: ScamperKey;
  hint: string;
  item: string;
}

export interface CreativeChallenge {
  object: string;
  emoji: string;
  techniques: ScamperKey[];
  hints: Partial<Record<ScamperKey, string>>;
}

export const SCAMPER_DATA: ScamperTechnique[] = [
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

export const QUIZ_QUESTIONS: ScamperQuizQuestion[] = [
  {
    question: "카페에서 플라스틱 컵 대신 먹을 수 있는 컵을 사용한다면?",
    answer: "S",
    hint: "기존 재료를 다른 것으로 바꿨어요!",
    item: "🥤",
  },
  {
    question: "스마트폰에 카메라와 음악 플레이어 기능을 합친 것은?",
    answer: "C",
    hint: "여러 기능을 하나로 합쳤어요!",
    item: "📱",
  },
  {
    question: "도마뱀의 벽타기 능력을 보고 접착 테이프를 발명한 것은?",
    answer: "A",
    hint: "자연에서 아이디어를 가져왔어요!",
    item: "🦎",
  },
  {
    question: "일반 피자를 접시만큼 크게 만들어 파티용으로 판매한다면?",
    answer: "M",
    hint: "크기를 변화시켰어요!",
    item: "🍕",
  },
  {
    question: "낡은 타이어를 놀이터 그네로 재활용한 것은?",
    answer: "P",
    hint: "원래 용도가 아닌 새로운 용도로 사용했어요!",
    item: "🛞",
  },
  {
    question: "에어팟에서 이어폰 줄을 없앤 것은?",
    answer: "E",
    hint: "불필요한 것을 과감히 없앴어요!",
    item: "🎧",
  },
  {
    question: "학생이 선생님에게 가르치는 '거꾸로 교실'은?",
    answer: "R",
    hint: "역할을 뒤바꿨어요!",
    item: "🏫",
  },
  {
    question: "종이 빨대를 금속 빨대로 바꾼 것은?",
    answer: "S",
    hint: "재질을 다른 것으로 교체했어요!",
    item: "🥤",
  },
  {
    question: "칫솔에 치약을 내장시킨 여행용 칫솔은?",
    answer: "C",
    hint: "두 가지 제품을 하나로!",
    item: "🪥",
  },
  {
    question: "연어가 거슬러 올라가는 모습에서 영감을 받아 역발상 마케팅을 한다면?",
    answer: "A",
    hint: "자연 현상을 비즈니스에 가져왔어요!",
    item: "🐟",
  },
  {
    question: "미니어처 음식 모형을 만들어 키링으로 판매한다면?",
    answer: "M",
    hint: "크기를 아주 작게 바꿨어요!",
    item: "🍔",
  },
  {
    question: "쇼핑백을 에코백으로 재사용하는 것은?",
    answer: "P",
    hint: "본래 용도와 다르게 활용했어요!",
    item: "🛍️",
  },
  {
    question: "자동차에서 핸들을 없애고 자율주행으로 만든다면?",
    answer: "E",
    hint: "핵심 부품을 과감히 제거했어요!",
    item: "🚗",
  },
  {
    question: "배달 음식 대신 고객이 직접 요리하는 밀키트는?",
    answer: "R",
    hint: "요리사와 소비자의 역할을 바꿨어요!",
    item: "🥘",
  },
];

export const CREATIVE_CHALLENGES: CreativeChallenge[] = [
  {
    object: "우산",
    emoji: "☂️",
    techniques: ["S", "C", "M"],
    hints: {
      S: "우산의 천을 다른 소재로 바꾼다면?",
      C: "우산에 다른 기능을 합친다면?",
      M: "우산의 크기나 모양을 바꾼다면?",
    },
  },
  {
    object: "학교 가방",
    emoji: "🎒",
    techniques: ["E", "C", "P"],
    hints: {
      E: "가방에서 무엇을 없앨 수 있을까?",
      C: "가방에 어떤 기능을 합칠 수 있을까?",
      P: "가방을 다른 용도로 쓸 수 있을까?",
    },
  },
  {
    object: "자전거",
    emoji: "🚲",
    techniques: ["M", "A", "R"],
    hints: {
      M: "자전거의 바퀴 수나 크기를 바꾸면?",
      A: "다른 탈것의 아이디어를 적용하면?",
      R: "자전거의 구조를 뒤집으면?",
    },
  },
  {
    object: "교실",
    emoji: "🏫",
    techniques: ["R", "S", "E"],
    hints: {
      R: "교실의 역할을 뒤집는다면?",
      S: "칠판을 다른 것으로 바꾸면?",
      E: "교실에서 책상을 없앤다면?",
    },
  },
];
