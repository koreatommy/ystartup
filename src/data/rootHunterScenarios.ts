/** 뿌리를 찾아라(Root Hunter) 게임 시나리오 데이터 */

export interface LevelOption {
  text: string;
  correct: boolean;
}

export interface Level {
  question: string;
  depth: string;
  options: LevelOption[];
  hint: string;
}

export interface Scenario {
  id: number;
  title: string;
  fruit: string;
  levels: Level[];
  rootCause: string;
  solution: string;
}

export const ROOT_HUNTER_SCENARIOS: Scenario[] = [
  {
    id: 1,
    title: "학교 성적이 갑자기 떨어졌어요",
    fruit: "🍎",
    levels: [
      {
        question: "왜 성적이 떨어졌을까요?",
        depth: "가지 1",
        options: [
          { text: "시험을 못 봤다", correct: true },
          { text: "선생님이 어렵게 냈다", correct: false },
          { text: "운이 나빴다", correct: false },
        ],
        hint: "증상을 먼저 파악해요",
      },
      {
        question: "왜 시험을 못 봤을까요?",
        depth: "가지 2",
        options: [
          { text: "공부를 충분히 못 했다", correct: true },
          { text: "시험지가 어려웠다", correct: false },
          { text: "연필이 부러졌다", correct: false },
        ],
        hint: "행동의 결과를 살펴봐요",
      },
      {
        question: "왜 공부를 충분히 못 했을까요?",
        depth: "줄기",
        options: [
          { text: "게임을 너무 많이 했다", correct: true },
          { text: "책이 없었다", correct: false },
          { text: "시험 날짜를 몰랐다", correct: false },
        ],
        hint: "행동의 원인을 찾아봐요",
      },
      {
        question: "왜 게임을 너무 많이 했을까요?",
        depth: "뿌리 1",
        options: [
          { text: "스트레스 해소 방법이 게임밖에 없었다", correct: true },
          { text: "게임이 재미있어서", correct: false },
          { text: "친구들이 하자고 해서", correct: false },
        ],
        hint: "더 깊은 이유를 찾아봐요",
      },
      {
        question: "왜 스트레스 해소 방법이 없었을까요?",
        depth: "뿌리 2 (근본)",
        options: [
          { text: "누군가와 고민을 나눌 기회나 건강한 취미가 없었다", correct: true },
          { text: "게임이 제일 쉬워서", correct: false },
          { text: "부모님이 바빠서", correct: false },
        ],
        hint: "진짜 뿌리에 다가왔어요!",
      },
    ],
    rootCause: "소통과 건강한 취미 활동의 부재",
    solution: "정기적인 대화 시간 마련 + 운동이나 독서 같은 취미 찾기",
  },
  {
    id: 2,
    title: "공장 기계가 자꾸 고장나요",
    fruit: "⚙️",
    levels: [
      {
        question: "왜 기계가 고장났을까요?",
        depth: "가지 1",
        options: [
          { text: "부품이 마모되었다", correct: true },
          { text: "기계가 오래됐다", correct: false },
          { text: "날씨 탓이다", correct: false },
        ],
        hint: "직접적인 물리 현상을 봐요",
      },
      {
        question: "왜 부품이 마모되었을까요?",
        depth: "가지 2",
        options: [
          { text: "윤활유가 부족했다", correct: true },
          { text: "기계를 오래 썼다", correct: false },
          { text: "금속이 약해서", correct: false },
        ],
        hint: "마찰·열·화학 반응을 생각해봐요",
      },
      {
        question: "왜 윤활유가 부족했을까요?",
        depth: "줄기",
        options: [
          { text: "정기 점검을 하지 않았다", correct: true },
          { text: "윤활유가 비쌌다", correct: false },
          { text: "담당자가 몰랐다", correct: false },
        ],
        hint: "관리 시스템을 살펴봐요",
      },
      {
        question: "왜 정기 점검을 안 했을까요?",
        depth: "뿌리 1",
        options: [
          { text: "점검 절차가 문서화되지 않았다", correct: true },
          { text: "바빠서", correct: false },
          { text: "필요 없다고 생각했다", correct: false },
        ],
        hint: "시스템과 프로세스를 봐요",
      },
      {
        question: "왜 절차가 문서화되지 않았을까요?",
        depth: "뿌리 2 (근본)",
        options: [
          { text: "예방 정비 문화와 표준 체계가 없었다", correct: true },
          { text: "귀찮아서", correct: false },
          { text: "원래 안 하던 일이라", correct: false },
        ],
        hint: "조직 문화의 뿌리입니다!",
      },
    ],
    rootCause: "예방 정비 문화와 표준화된 절차 체계의 부재",
    solution: "SOP 문서 작성 + 정기 점검 스케줄 시스템화",
  },
  {
    id: 3,
    title: "강이 점점 오염되고 있어요",
    fruit: "🌊",
    levels: [
      {
        question: "왜 강이 오염되었을까요?",
        depth: "가지 1",
        options: [
          { text: "오염 물질이 강으로 흘러들었다", correct: true },
          { text: "비가 너무 많이 왔다", correct: false },
          { text: "물고기가 줄었다", correct: false },
        ],
        hint: "오염의 경로를 추적해요",
      },
      {
        question: "왜 오염 물질이 강으로 흘렀을까요?",
        depth: "가지 2",
        options: [
          { text: "공장 폐수가 무단 방류되었다", correct: true },
          { text: "사람들이 쓰레기를 버렸다", correct: false },
          { text: "농약이 비에 씻겼다", correct: false },
        ],
        hint: "주요 오염원을 찾아봐요",
      },
      {
        question: "왜 폐수가 무단 방류되었을까요?",
        depth: "줄기",
        options: [
          { text: "처리 비용이 높아 몰래 버렸다", correct: true },
          { text: "방법을 몰랐다", correct: false },
          { text: "처리 시설이 고장났다", correct: false },
        ],
        hint: "경제·동기 구조를 살펴봐요",
      },
      {
        question: "왜 처리 비용 문제가 생겼을까요?",
        depth: "뿌리 1",
        options: [
          { text: "단속과 처벌이 너무 약했다", correct: true },
          { text: "기업이 욕심을 부려서", correct: false },
          { text: "환경부가 몰랐다", correct: false },
        ],
        hint: "제도적 인센티브 구조를 봐요",
      },
      {
        question: "왜 단속이 약했을까요?",
        depth: "뿌리 2 (근본)",
        options: [
          { text: "환경 규제 체계와 사회적 감시 문화가 미약했다", correct: true },
          { text: "인력이 부족했다", correct: false },
          { text: "예산이 없었다", correct: false },
        ],
        hint: "사회 시스템의 뿌리입니다!",
      },
    ],
    rootCause: "환경 규제 체계와 시민 감시 문화의 미약함",
    solution: "강력한 환경법 + 시민 참여 모니터링 시스템 구축",
  },
];
