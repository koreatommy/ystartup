/**
 * 구조화된 랜딩 페이지 콘텐츠 (Y-START UP 10단계 창업 교육)
 */

export interface CurriculumItem {
  id: string;
  session: string;
  titleKo: string;
  titleEn: string;
}

export interface TableColumn {
  key: string;
  label: string;
}

export interface TableRow {
  [key: string]: string;
}

export interface TableData {
  title?: string;
  columns: TableColumn[];
  rows: TableRow[];
}

export interface ChecklistItem {
  label: string;
  checked?: boolean;
}

export type BlockType = "paragraph" | "list" | "highlight" | "table" | "checklist";

export interface ContentBlockData {
  type: BlockType;
  paragraph?: string;
  listItems?: string[];
  highlight?: string;
  table?: TableData;
  checklist?: ChecklistItem[];
}

export interface LandingSectionData {
  id: string;
  title: string;
  subtitle?: string;
  blocks: ContentBlockData[];
}

export const landingHero = {
  title: "꿈을 현실로 만드는 창업 여정",
  subtitle: "아이디어에서 실행까지의 로드맵",
  intro: [
    "안녕하세요, 미래의 주인공인 청소년 창업가 여러분! 여러분은 '창업'이라는 단어를 들으면 무엇이 떠오르나요? 거창한 회사를 세우는 것만이 창업은 아닙니다. 우리 주변의 문제를 발견하고, 새로운 해결 방법을 찾아가는 과정 자체가 창업입니다.",
    "이 여정은 여러분의 창의성(Creativity), 도전정신(Challenge), 그리고 협업 능력(Collaboration)을 키워가는 아주 특별한 탐험이 될 것입니다. 10단계의 지도를 따라 \"나도 세상을 바꿀 수 있다\"는 자신감을 얻어보세요!",
  ],
};

export const landingCurriculumIntro = {
  title: "창업 여정의 시작: 나만의 '큰 그림' 그리기",
  paragraphs: [
    "창업은 낯선 곳으로 떠나는 여행과 같습니다. 길을 잃지 않으려면 전체 지도를 먼저 파악하는 것이 중요하죠. 이 교육 과정은 여러분이 창업가로 성장할 수 있도록 다음과 같이 유기적으로 연결된 10가지 단계로 구성되어 있습니다.",
  ],
  outro: "이제 우리가 함께 걸어갈 이 지도의 첫 번째 도착지, 아이디어의 씨앗을 찾는 단계로 가볼까요?",
};

export const curriculumItems: CurriculumItem[] = [
  { id: "01", session: "01회차", titleKo: "창업 이해와 팀 기반 창의 활동", titleEn: "(창업 탐험대 구성)" },
  { id: "02", session: "02회차", titleKo: "창업의 기초 및 개념 이해", titleEn: "(아이디어 발견 및 원인 분석)" },
  { id: "03", session: "03회차", titleKo: "시장조사 및 분석", titleEn: "(페르소나 설정 및 경쟁사 분석)" },
  { id: "04", session: "04회차", titleKo: "고객 문제와 해결 방안 구체화", titleEn: "(공감지도 및 SCAMPER 활용)" },
  { id: "05", session: "05회차", titleKo: "제품 서비스 설계", titleEn: "(MVP 제작 및 브랜드 아이덴티티 구축)" },
  { id: "06", session: "06회차", titleKo: "비즈니스 모델 설계", titleEn: "(BMC 작성 및 가치 제안)" },
  { id: "07", session: "07회차", titleKo: "마케팅 홍보 전략", titleEn: "(4P vs 4C 및 콘텐츠 기획)" },
  { id: "08", session: "08회차", titleKo: "운영 계획 및 실행 전략", titleEn: "(팀 역할 분담 및 일정 관리)" },
  { id: "09", session: "09회차", titleKo: "재무 계획", titleEn: "(비용 분석 및 손익분기점 계산)" },
  { id: "10", session: "10회차", titleKo: "발표 및 피칭 전략", titleEn: "(스토리텔링 기반 피칭)" },
];

const fiveWhysTable: TableData = {
  title: "5 Whys 기법 활용 예시: \"지각 문제 분석\"",
  columns: [
    { key: "step", label: "질문 단계" },
    { key: "answer", label: "답변 내용 (원인 분석)" },
  ],
  rows: [
    { step: "1단계 Why: 왜 지각을 하나요?", answer: "아침에 버스를 놓쳐서요." },
    { step: "2단계 Why: 왜 버스를 놓쳤나요?", answer: "정류장에 사람이 너무 많아 못 탔어요." },
    { step: "3단계 Why: 왜 사람이 많았나요?", answer: "배차 간격이 길고 탑승 인원 확인이 안 돼요." },
    { step: "4단계 Why: 왜 확인이 안 되나요?", answer: "실시간 혼잡도를 알려주는 정보가 부족해요." },
    { step: "5단계 Why (근본 원인)", answer: "버스의 실시간 혼잡도를 미리 알 수 있는 시스템이 없기 때문입니다." },
  ],
};

const personaChecklist: ChecklistItem[] = [
  { label: "기본 프로필: 이름, 나이, 성별, 직업, 거주 지역을 정했는가?" },
  { label: "삶의 모습: 이 사람의 취미와 평소 중요하게 생각하는 가치관/목표는 무엇인가?" },
  { label: "Pain Point (불편함): 일상에서 느끼는 가장 뼈아픈 고통은 무엇인가?" },
  { label: "Needs (요구사항): 이 사람이 문제를 해결하고 진정으로 얻고 싶어 하는 것은 무엇인가?" },
];

const painGainTable: TableData = {
  title: "고객 공감 분석: Pain vs Gain",
  columns: [
    { key: "type", label: "구분" },
    { key: "content", label: "내용 (고객의 입장)" },
  ],
  rows: [
    { type: "Pain (힘든 점)", content: "정보를 찾는 데 시간이 너무 오래 걸려 스트레스를 받고 답답함" },
    { type: "Gain (얻는 점)", content: "원하는 정보를 즉시 확인하여 시간을 절약하고 삶의 편리함을 느낌" },
  ],
};

const appSixSteps: string[] = [
  "Planning (기획): 서비스의 흐름과 구조도를 설계합니다.",
  "Design (디자인): 브랜드의 성격을 보여주는 로고와 색상을 결정합니다.",
  "Prototyping (프로토타이핑): 와이어프레임으로 화면의 러프 스케치를 작성합니다.",
  "Development (개발): 핵심 기능을 중심으로 실제 형태를 구현합니다.",
  "Deployment (배포/출시): 완성된 서비스를 고객이 쓸 수 있게 세상에 내놓습니다.",
  "Testing (테스트): 실제 사용해보며 버그를 찾고 개선점을 점검합니다.",
];

const bmcThreeTable: TableData = {
  title: "비즈니스 모델 핵심 3요소",
  columns: [
    { key: "element", label: "요소" },
    { key: "definition", label: "정의" },
    { key: "tip", label: "신규 창업자를 위한 팁" },
  ],
  rows: [
    { element: "고객 (Customer)", definition: "서비스를 이용할 타깃 층", tip: "\"누가 우리 서비스를 가장 간절히 원하는가?\"를 고민하세요." },
    { element: "가치 제안 (Value)", definition: "우리가 고객을 돕는 특별한 방식", tip: "고객이 우리를 선택해야만 하는 결정적인 이유를 적으세요." },
    { element: "수익원 (Revenue)", definition: "돈을 버는 구체적인 방법", tip: "판매, 구독, 광고 등 지속 가능한 수익 구조를 설계하세요." },
  ],
};

const fourPFourCTable: TableData = {
  title: "마케팅 관점의 전환: 4P vs 4C",
  columns: [
    { key: "fourP", label: "기업 중심 (4P)" },
    { key: "fourC", label: "고객 중심 (4C)" },
    { key: "meaning", label: "마케팅의 진정한 의미" },
  ],
  rows: [
    { fourP: "Product (제품)", fourC: "Customer Value (고객 가치)", meaning: "고객에게 어떤 특별한 혜택을 주는가?" },
    { fourP: "Price (가격)", fourC: "Cost (고객의 비용)", meaning: "고객이 시간과 돈을 들일 만한 가치가 있는가?" },
    { fourP: "Place (유통)", fourC: "Convenience (편의성)", meaning: "고객이 얼마나 쉽고 편하게 접근할 수 있는가?" },
    { fourP: "Promotion (홍보)", fourC: "Communication (소통)", meaning: "고객과 어떤 메시지로 신뢰를 형성할 것인가?" },
  ],
};

const teamRoles: string[] = [
  "CEO (대표): 팀을 이끄는 리더이자 중심점, 전체 목표 설정",
  "CMO (마케팅): 에너지와 활력을 담아 마케팅 및 고객 소통 주도",
  "CTO (기술): 분석적인 사고로 제품 개발 및 기술적 문제 해결",
  "CFO (재무): 예산 및 돈의 흐름을 꼼꼼하게 관리하는 역할",
  "CPO (제품): 서비스 기획 및 아이디어 전구(디자인 감각) 역할",
];

const startupPositionsTable: TableData = {
  title: "스타트업 핵심 포지션 및 역할 설정",
  columns: [
    { key: "position", label: "포지션" },
    { key: "role", label: "주요 역할 및 특징 (원인 분석 및 강점 활용)" },
  ],
  rows: [
    {
      position: "1. CEO (최고경영자)",
      role: "팀을 이끄는 중심 역할로 리더십과 자신감이 필요합니다",
    },
    {
      position: "2. CMO (최고마케팅책임자)",
      role: "마케팅과 홍보를 담당하며 팀의 아이디어를 세상에 알리는 생동감을 표현합니다",
    },
    {
      position: "3. CTO (최고기술책임자)",
      role: "기술과 개발을 주도하며 논리적이고 분석적인 사고로 문제를 해결합니다",
    },
    {
      position: "4. CFO (최고재무책임자)",
      role: "예산과 자금을 관리하며 꼼꼼하게 팀의 살림을 책임집니다",
    },
    {
      position: "5. CPO (최고제품책임자)",
      role: "기획과 제품 개발의 감각을 발휘하여 창의적인 해결 방안을 설계합니다",
    },
  ],
};

const priorityCode: string[] = [
  "Red (레드): 지금 바로 처리해야 하는 최우선 업무",
  "Yellow (옐로): 중요하지만 시간적 여유가 있는 업무",
  "Green (그린): 급하지 않은 후순위 업무",
];

export const landingSections: LandingSectionData[] = [
  {
    id: "step-0",
    title: "[단계 0] 팀 빌딩과 협업: 창업 여정의 시작 (WB 01)",
    blocks: [
      {
        type: "paragraph",
        paragraph:
          "창업은 거창한 것이 아닙니다. 단순히 회사를 만드는 일을 넘어, 일상에서 문제를 발견하고 이를 해결하기 위해 새로운 방법을 만들어내는 모든 창의적인 활동이 바로 창업입니다. 이 여정을 함께 걸을 팀을 만드는 것이 창업의 첫걸음입니다.",
      },
      { type: "table", table: startupPositionsTable },
      {
        type: "highlight",
        highlight:
          "팀워크는 창업의 첫걸음! 서로 다른 개성과 아이디어를 모으면 하나의 멋진 브랜드가 될 수 있습니다. 우리 팀만의 이름으로 세상을 바꿀 준비를 시작하세요.",
      },
      {
        type: "paragraph",
        paragraph:
          "팀을 구성하고 창업의 정의를 내렸다면, 이제 우리 팀이 해결할 '일상 속의 작은 불편함'을 본격적으로 찾아 나설 차례입니다.",
      },
    ],
  },
  {
    id: "step-1",
    title: "[단계 1] 씨앗 뿌리기: 아이디어 발견 및 원인 분석 (WB 02)",
    blocks: [
      {
        type: "paragraph",
        paragraph:
          "창업 아이디어는 결코 거창할 필요가 없습니다. 일상에서 느끼는 '작은 불편함'이 바로 위대한 아이디어의 씨앗입니다. 아이디어가 조금 이상해도 괜찮습니다. 중요한 것은 현상 아래에 숨겨진 '진짜 원인'을 찾는 것입니다. 눈에 보이는 문제만 해결하면 문제는 다시 발생합니다. 이때 근본 원인을 찾기 위해 '5 Whys' 기법을 활용해 보세요.",
      },
      { type: "table", table: fiveWhysTable },
      {
        type: "highlight",
        highlight:
          "작은 불편함이 세상을 바꾸는 큰 아이디어가 되는 과정! 겉으로 보이는 현상을 넘어, 5번의 질문으로 뿌리 깊은 근본 원인을 찾아내세요.",
      },
      {
        type: "paragraph",
        paragraph: "문제를 찾았다면, 이제 이 문제를 가장 간절하게 해결하고 싶어 할 '누군가'를 만나러 갈 차례입니다.",
      },
    ],
  },
  {
    id: "step-2",
    title: "[단계 2] 토양 다지기: 시장조사 및 페르소나 설정 (WB 03)",
    blocks: [
      {
        type: "paragraph",
        paragraph:
          "내 아이디어가 정말 사람들에게 필요한지 확인하는 과정이 '시장조사'입니다. \"얼마나 많은 사람이 이 문제를 겪고 있는가?\"를 파악하여 시장의 크기를 가늠해 보세요. 또한, 우리 서비스를 이용할 가상의 대표 고객인 '페르소나(Persona)'를 아주 구체적으로 설정해야 합니다.",
      },
      {
        type: "checklist",
        checklist: personaChecklist,
      },
      {
        type: "paragraph",
        paragraph: "고객을 이해했다면, 그들의 마음속으로 더 깊이 들어가 그들이 느끼는 감정에 공감해 봅시다.",
      },
    ],
  },
  {
    id: "step-3",
    title: "[단계 3] 뿌리 내리기: 고객 공감 및 해결 방안 구체화 (WB 04)",
    blocks: [
      {
        type: "paragraph",
        paragraph:
          "고객의 입장에서 보고, 듣고, 생각하는 공감지도(Empathy Map)를 그려보세요. \"어떻게 하면(How Might We) ~할 수 있을까?\"라는 질문을 던져 아이디어를 확장해 봅시다. 이때 SCAMPER 기법을 활용하면 좋습니다. SCAMPER는 기존 아이디어를 대체(S), 결합(C), 적용(A), 수정(M), 용도 변경(P), 제거(E), 역발상(R)의 7가지 렌즈로 변형해보는 도구입니다.",
      },
      { type: "table", table: painGainTable },
      {
        type: "paragraph",
        paragraph: "이제 막연했던 아이디어가 뿌리를 내렸습니다. 이제 눈에 보이는 형태인 '제품'으로 만들어볼까요?",
      },
    ],
  },
  {
    id: "step-4",
    title: "[단계 4] 싹 틔우기: 제품 서비스 설계 및 MVP 제작 (WB 05)",
    blocks: [
      {
        type: "paragraph",
        paragraph:
          "처음부터 완벽한 제품을 만들려고 애쓰지 마세요. 핵심 기능만 담은 MVP(최소 기능 제품)를 빠르게 만들어 고객의 반응을 확인하는 것이 핵심입니다. 앱 서비스를 기획한다면 아래의 6단계 프로세스를 기억하세요.",
      },
      {
        type: "list",
        listItems: appSixSteps,
      },
      {
        type: "paragraph",
        paragraph: "제품이 준비되었다면, 이제 이 사업이 어떻게 돈을 벌고 운영될지 구조를 세워야 합니다.",
      },
    ],
  },
  {
    id: "step-5",
    title: "[단계 5] 줄기 세우기: 비즈니스 모델 설계 (WB 06)",
    blocks: [
      {
        type: "paragraph",
        paragraph:
          "비즈니스 모델 캔버스(BMC)는 사업의 가치를 어떻게 창출하고 전달할지 보여주는 지도입니다. 9가지 요소 중 특히 다음 3가지의 연결성이 가장 중요합니다.",
      },
      { type: "table", table: bmcThreeTable },
      {
        type: "paragraph",
        paragraph: "튼튼한 줄기가 세워졌으니, 이제 우리 서비스를 세상에 널리 알릴 잎을 틔울 시간입니다.",
      },
    ],
  },
  {
    id: "step-6",
    title: "[단계 6] 잎 펼치기: 마케팅 및 홍보 전략 (WB 07)",
    blocks: [
      {
        type: "paragraph",
        paragraph:
          "마케팅은 단순히 광고를 하는 행위가 아니라, 고객과 '관계를 맺고 신뢰를 쌓는 과정'입니다. 기업 중심의 시각(4P)에서 벗어나, 고객의 마음을 읽는 시각(4C)으로 전략을 전환해 보세요.",
      },
      { type: "table", table: fourPFourCTable },
      {
        type: "paragraph",
        paragraph: "홍보 전략까지 세웠다면, 이제 팀원들과 함께 실제로 움직일 계획을 짤 차례입니다.",
      },
    ],
  },
  {
    id: "step-7",
    title: "[단계 7] 성장의 동력: 운영 계획 및 실행 전략 (WB 08)",
    blocks: [
      {
        type: "paragraph",
        paragraph:
          "창업팀은 하나의 작은 사회입니다. 각자의 강점을 살려 역할을 나누고, 업무의 우선순위를 정하는 것이 실행력의 핵심입니다.",
      },
      {
        type: "list",
        listItems: teamRoles,
      },
      {
        type: "paragraph",
        paragraph: "업무 우선순위 관리 코드",
      },
      {
        type: "list",
        listItems: priorityCode,
      },
      {
        type: "paragraph",
        paragraph: "마지막으로, 우리 사업이 멈추지 않고 계속 달릴 수 있게 해줄 '연료'를 점검해 봅시다.",
      },
    ],
  },
  {
    id: "step-8",
    title: "[단계 8] 열매 맺기: 재무 계획 및 손익분기점 (WB 09)",
    blocks: [
      {
        type: "paragraph",
        paragraph:
          "지속 가능한 사업을 위해서는 돈의 흐름을 정확히 읽어야 합니다. 손익분기점(BEP)은 \"이익도 손해도 없는 지점\"으로, 사업이 생존하기 위해 최소한 몇 개를 팔아야 하는지 알려주는 지표입니다.",
      },
      {
        type: "highlight",
        highlight:
          "총 수익 (판매 단가 × 판매 수량) - 총 비용 (고정비 + 변동비) = 0",
      },
      {
        type: "list",
        listItems: [
          "흑자: 순이익이 0보다 큰(+) 상태 (수익 발생!)",
          "적자: 순이익이 0보다 작은(-) 상태 (손해 발생!)",
          "BEP 해석: \"우리가 망하지 않고 살아남기 위해 팔아야 할 최소한의 양\"",
        ],
      },
      {
        type: "paragraph",
        paragraph: "드디어 모든 준비가 끝났습니다! 이제 여러분의 멋진 여행 결과물을 세상에 발표할 차례입니다.",
      },
    ],
  },
  {
    id: "step-9",
    title: "[단계 9]여정의 완성: \"나도 세상을 바꿀 수 있다\"(WB 10)",
    blocks: [
      {
        type: "paragraph",
        paragraph:
          "마지막 10회차의 꽃은 바로 '피칭(Pitching)'입니다. 피칭은 단순히 슬라이드를 읽는 것이 아닙니다. 스티브 잡스처럼 감성적인 스토리텔링을 통해 청중의 마음을 사로잡는 과정입니다. 창의적으로 문제를 해결하고, 팀원들과 소통하며 여기까지 온 여러분은 이미 훌륭한 창업가입니다. 이 여정을 통해 얻은 자신감으로 여러분만의 멋진 미래를 만들어가세요!",
      },
      {
        type: "paragraph",
        paragraph:
          "여러분의 빛나는 창업가 정신을 담아 아래 다짐을 완성해 보세요.",
      },
      {
        type: "highlight",
        highlight:
          '"우리 팀은 앞으로 ________________________________________________ 하는 창업가가 되겠다!"',
      },
      {
        type: "paragraph",
        paragraph: "여러분의 용기 있는 도전을 진심으로 응원합니다!",
      },
    ],
  },
];

export const landingCta = {
  title: "나도 세상을 바꿀 수 있다",
  message:
    "여정을 마치셨다면, 이제 워크북에서 단계별 활동을 직접 채워보며 실천해 보세요.",
  ctaLabel: "워크북에서 시작하기",
};
