import type { WorkbookContent } from "@/types/workbook";
import { chapters } from "./chapters";

const wb01PositionsTable: WorkbookContent["summaryTable"] = {
  title: "📊 스타트업 핵심 포지션 및 역할 설정",
  columns: [
    { key: "position", label: "포지션" },
    { key: "role", label: "주요 역할 및 특징 (원인 분석 및 강점 활용)" },
  ],
  rows: [
    {
      position: "1. CEO (최고경영자)",
      role: "팀을 이끄는 중심 역할로 리더십과 자신감이 필요합니다.",
    },
    {
      position: "2. CMO (최고마케팅책임자)",
      role: "마케팅과 홍보를 담당하며 팀의 아이디어를 세상에 알리는 생동감을 표현합니다.",
    },
    {
      position: "3. CTO (최고기술책임자)",
      role: "기술과 개발을 주도하며 논리적이고 분석적인 사고로 문제를 해결합니다.",
    },
    {
      position: "4. CFO (최고재무책임자)",
      role: "예산과 자금을 관리하며 꼼꼼하게 팀의 살림을 책임집니다.",
    },
    {
      position: "5. CPO (최고제품책임자)",
      role: "기획과 제품 개발의 감각을 발휘하여 창의적인 해결 방안을 설계합니다.",
    },
  ],
};

const workbook01: WorkbookContent = {
  wbId: "WB 01",
  titleKo: "창업 이해와 팀 기반 창의 활동",
  titleEn: "(Entrepreneurship and Team Creativity)",
  summaryTitle: "📌 [단계 1] 팀 빌딩과 협업: 창업 여정의 시작 (WB 01)",
  summaryBody:
    "💡 창업은 거창한 것이 아닙니다. 단순히 회사를 만드는 일을 넘어, 일상에서 문제를 발견하고 이를 해결하기 위해 새로운 방법을 만들어내는 모든 창의적인 활동이 바로 창업입니다. 이 새로운 여행을 성공적으로 시작하기 위해 가장 먼저 할 일은 여정을 함께할 **'팀'**을 꾸리는 것입니다. 👥 서로 다른 개성과 강점을 가진 팀원들이 모여 하나의 브랜드를 만들어가는 과정이 창업의 핵심입니다. ✨",
  summaryTable: wb01PositionsTable,
  summaryHighlight:
    '💡 핵심 통찰 "팀워크는 창업의 첫걸음! 서로 다른 개성과 아이디어를 모으면 하나의 멋진 브랜드가 될 수 있습니다. 우리 팀만의 이름으로 세상을 바꿀 준비를 시작하세요."',
  summaryClosing:
    "🚀 팀을 구성하고 창업의 정의를 내렸다면, 이제 우리 팀이 해결할 **'일상 속의 작은 불편함'**을 본격적으로 찾아 나설 차례입니다.",
  items: [
    {
      label: "WB1-① 우리 팀, 우리의 브랜드(창업 탐험대 구성하기)",
      subtitle: "(Our Team, Our Brand (Forming an Entrepreneurship Expedition Team))",
      pdfPath: "/pdf/01_workbook_ori_부분1.pdf",
      thumbnailPath: "/pdf/thumbnails/01_workbook_ori_부분1.jpg",
    },
    {
      label: "WB1-② 팀원들의 강점 알아보기",
      subtitle: "(Discovering Team Members' Strengths)",
      pdfPath: "/pdf/01_workbook_ori_부분2.pdf",
      thumbnailPath: "/pdf/thumbnails/01_workbook_ori_부분2.jpg",
    },
    {
      label: "WB1-③ 팀원들의 협업 포지션 정하기",
      subtitle: "(Defining Team Members' Collaboration Positions)",
      pdfPath: "/pdf/01_workbook_ori_부분3.pdf",
      thumbnailPath: "/pdf/thumbnails/01_workbook_ori_부분3.jpg",
    },
    {
      label: "WB1-④ 우리 팀에게 창업이란?",
      subtitle: "(What is Entrepreneurship to Our Team?)",
      pdfPath: "/pdf/01_workbook_ori_부분4.pdf",
      thumbnailPath: "/pdf/thumbnails/01_workbook_ori_부분4.jpg",
    },
    {
      label: "WB1-⑤ 오늘의 배움 정리",
      subtitle: "(Summary of Today's Learning)",
      pdfPath: "/pdf/01_workbook_ori_부분5.pdf",
      thumbnailPath: "/pdf/thumbnails/01_workbook_ori_부분5.jpg",
    },
  ],
};

function placeholderWorkbook(chapterId: string, overrides?: Partial<WorkbookContent>): WorkbookContent {
  const meta = chapters.find((c) => c.id === chapterId);
  return {
    wbId: `WB ${chapterId}`,
    titleKo: meta?.titleKo ?? "",
    titleEn: meta?.titleEn ?? "",
    items: [
      {
        label: "워크북 콘텐츠 준비 중입니다.",
        subtitle: "(Content coming soon)",
      },
    ],
    ...overrides,
  };
}

const wb02FiveWhysTable: WorkbookContent["summaryTable"] = {
  title: '🔍 5 Whys 기법 활용 예시: "지각 문제 분석"',
  columns: [
    { key: "step", label: "질문 단계" },
    { key: "answer", label: "답변 내용 (원인 분석)" },
  ],
  rows: [
    { step: "1단계 Why: 왜 지각을 하나요?", answer: "아침에 버스를 놓쳐서요." },
    { step: "2단계 Why: 왜 버스를 놓쳤나요?", answer: "정류장에 사람이 너무 많아 못 탔어요." },
    {
      step: "3단계 Why: 왜 사람이 많았나요?",
      answer: "배차 간격이 길고 탑승 인원 확인이 안 돼요.",
    },
    {
      step: "4단계 Why: 왜 확인이 안 되나요?",
      answer: "실시간 혼잡도를 알려주는 정보가 부족해요.",
    },
    {
      step: "5단계 Why (근본 원인)",
      answer: "버스의 실시간 혼잡도를 미리 알 수 있는 시스템이 없기 때문입니다.",
    },
  ],
};

const workbook02Items: WorkbookContent["items"] = [
  {
    label: "WB2-① 세상은 어떤 문제로 불편할까?",
    subtitle: "What problems in the world are inconvenient?",
    pdfPath: "/pdf/02_workbook_ori_부분1.pdf",
    thumbnailPath: "/pdf/thumbnails/02_workbook_ori_부분1.jpg",
  },
  {
    label: "WB2-② 5 Whys 문제 분석하기",
    subtitle: "Analyzing problems using the 5 Whys technique",
    pdfPath: "/pdf/02_workbook_ori_부분2.pdf",
    thumbnailPath: "/pdf/thumbnails/02_workbook_ori_부분2.jpg",
  },
  {
    label: "WB2-③ 해결 아이디어 떠올리기",
    subtitle: "Brainstorming solution ideas",
    pdfPath: "/pdf/02_workbook_ori_부분3.pdf",
    thumbnailPath: "/pdf/thumbnails/02_workbook_ori_부분3.jpg",
  },
  {
    label: "WB2-④ 한 문장으로 내 사업 설명하기",
    subtitle: "Explaining my business in one sentence",
    pdfPath: "/pdf/02_workbook_ori_부분4.pdf",
    thumbnailPath: "/pdf/thumbnails/02_workbook_ori_부분4.jpg",
  },
  {
    label: "WB2-⑤ 사업명과 슬로건 만들기",
    subtitle: "Creating a business name and slogan",
    pdfPath: "/pdf/02_workbook_ori_부분5.pdf",
    thumbnailPath: "/pdf/thumbnails/02_workbook_ori_부분5.jpg",
  },
  {
    label: "WB2-⑥ 우리팀 창업 아이디어 카드 만들기",
    subtitle: "Creating our team's startup idea card",
    pdfPath: "/pdf/02_workbook_ori_부분6.pdf",
    thumbnailPath: "/pdf/thumbnails/02_workbook_ori_부분6.jpg",
  },
  {
    label: "WB2-⑦ 오늘의 배움 정리",
    subtitle: "Summarizing today's learning",
    pdfPath: "/pdf/02_workbook_ori_부분7.pdf",
    thumbnailPath: "/pdf/thumbnails/02_workbook_ori_부분7.jpg",
  },
];

const workbook02: WorkbookContent = {
  ...placeholderWorkbook("02"),
  items: workbook02Items,
  summaryTitle: "📌 [단계 2] 씨앗 뿌리기: 아이디어 발견 및 원인 분석 (WB 02)",
  summaryBody:
    "창업 아이디어는 결코 거창할 필요가 없습니다. 일상에서 느끼는 **'작은 불편함'**이 바로 위대한 아이디어의 씨앗입니다. 아이디어가 조금 이상해도 괜찮습니다. 중요한 것은 현상 아래에 숨겨진 **'진짜 원인'**을 찾는 것입니다. 눈에 보이는 문제만 해결하면 문제는 다시 발생합니다. 이때 근본 원인을 찾기 위해 '5 Whys' 기법을 활용해 보세요.",
  summaryTable: wb02FiveWhysTable,
  summaryHighlight:
    '💡 핵심 통찰 "작은 불편함이 세상을 바꾸는 큰 아이디어가 되는 과정! 겉으로 보이는 현상을 넘어, 5번의 질문으로 뿌리 깊은 근본 원인을 찾아내세요."',
  summaryClosing:
    "👤 문제를 찾았다면, 이제 이 문제를 가장 간절하게 해결하고 싶어 할 '누군가'를 만나러 갈 차례입니다.",
};

const workbook03Items: WorkbookContent["items"] = [
  {
    label: "WB3-① 시장조사란 무엇일까?",
    subtitle: "What is market research?",
    pdfPath: "/pdf/03_workbook_ori_부분1.pdf",
    thumbnailPath: "/pdf/thumbnails/03_workbook_ori_부분1.jpg",
  },
  {
    label: "WB3-② 우리 아이디어의 고객은 누구일까? (대표고객:페르소나 선정)",
    subtitle: "Who are the customers of our idea? (Representative customer: Persona selection)",
    pdfPath: "/pdf/03_workbook_ori_부분2.pdf",
    thumbnailPath: "/pdf/thumbnails/03_workbook_ori_부분2.jpg",
  },
  {
    label: "WB3-③ 고객의 목소리 듣기",
    subtitle: "Listening to the customer's voice",
    pdfPath: "/pdf/03_workbook_ori_부분3.pdf",
    thumbnailPath: "/pdf/thumbnails/03_workbook_ori_부분3.jpg",
  },
  {
    label: "WB3-④·⑤ 경쟁사 찾아보기 · 우리아이디어의 차별성 찾기",
    subtitle: "Looking for competitors / Finding the differentiation of our idea",
    pdfPath: "/pdf/03_workbook_ori_부분4.pdf",
    thumbnailPath: "/pdf/thumbnails/03_workbook_ori_부분4.jpg",
    badgeNumber: "4·5",
  },
  {
    label: "WB3-⑥ 시장의 크기 알아보기",
    subtitle: "Understanding the market size",
    pdfPath: "/pdf/03_workbook_ori_부분5.pdf",
    thumbnailPath: "/pdf/thumbnails/03_workbook_ori_부분5.jpg",
    badgeNumber: "6",
  },
  {
    label: "WB3-⑦ 조사 결과 정리 카드",
    subtitle: "Summary card of survey results",
    pdfPath: "/pdf/03_workbook_ori_부분6.pdf",
    thumbnailPath: "/pdf/thumbnails/03_workbook_ori_부분6.jpg",
    badgeNumber: "7",
  },
  {
    label: "WB3-⑧ 오늘의 배움 정리",
    subtitle: "Summary of today's learning",
    pdfPath: "/pdf/03_workbook_ori_부분7.pdf",
    thumbnailPath: "/pdf/thumbnails/03_workbook_ori_부분7.jpg",
    badgeNumber: "8",
  },
];

const workbook03: WorkbookContent = {
  ...placeholderWorkbook("03"),
  items: workbook03Items,
  summaryTitle: "📌 [단계 3] 토양 다지기: 시장조사 및 페르소나 설정 (WB 03)",
  summaryBody:
    "🔍 내 아이디어가 정말 사람들에게 필요한지 확인하는 과정이 '시장조사'입니다. \"얼마나 많은 사람이 이 문제를 겪고 있는가?\"를 파악하여 시장의 크기를 가늠해 보세요. 또한, 우리 서비스를 이용할 가상의 대표 고객인 **'페르소나(Persona)'**를 아주 구체적으로 설정해야 합니다. 👤",
  summaryChecklist: [
    "📋 기본 프로필: 이름, 나이, 성별, 직업, 거주 지역을 정했는가?",
    "🎯 삶의 모습: 이 사람의 취미와 평소 중요하게 생각하는 가치관/목표는 무엇인가?",
    "😣 Pain Point (불편함): 일상에서 느끼는 가장 뼈아픈 고통은 무엇인가?",
    "✨ Needs (요구사항): 이 사람이 문제를 해결하고 진정으로 얻고 싶어 하는 것은 무엇인가?",
  ],
  summaryClosing:
    "💜 고객을 이해했다면, 그들의 마음속으로 더 깊이 들어가 그들이 느끼는 감정에 공감해 봅시다.",
};

const wb04PainGainTable: WorkbookContent["summaryTable"] = {
  title: "💜 고객 공감 분석: Pain vs Gain",
  columns: [
    { key: "type", label: "구분" },
    { key: "content", label: "내용 (고객의 입장)" },
  ],
  rows: [
    {
      type: "😣 Pain (힘든 점)",
      content: "정보를 찾는 데 시간이 너무 오래 걸려 스트레스를 받고 답답함",
    },
    {
      type: "✨ Gain (얻는 점)",
      content: "원하는 정보를 즉시 확인하여 시간을 절약하고 삶의 편리함을 느낌",
    },
  ],
};

const workbook04Items: WorkbookContent["items"] = [
  {
    label: "WB4-① 고객의 문제를 찾아라",
    subtitle: "Find the customer's problem",
    pdfPath: "/pdf/04_workbook_ori_부분1.pdf",
    thumbnailPath: "/pdf/thumbnails/04_workbook_ori_부분1.jpg",
  },
  {
    label: "WB4-② 공감지도(Empathy Map) 만들기",
    subtitle: "Create an Empathy Map",
    pdfPath: "/pdf/04_workbook_ori_부분2.pdf",
    thumbnailPath: "/pdf/thumbnails/04_workbook_ori_부분2.jpg",
  },
  {
    label: "WB4-③ 문제 정의하기 (Problem Statement)",
    subtitle: "Define the problem",
    pdfPath: "/pdf/04_workbook_ori_부분3.pdf",
    thumbnailPath: "/pdf/thumbnails/04_workbook_ori_부분3.jpg",
  },
  {
    label: "WB4-④ 해결 아이디어 브레인스토밍",
    subtitle: "Solution idea brainstorming",
    pdfPath: "/pdf/04_workbook_ori_부분4.pdf",
    thumbnailPath: "/pdf/thumbnails/04_workbook_ori_부분4.jpg",
  },
  {
    label: "WB4-⑤ How Might We? 질문 만들기",
    subtitle: "How Might We? questions",
    pdfPath: "/pdf/04_workbook_ori_부분5.pdf",
    thumbnailPath: "/pdf/thumbnails/04_workbook_ori_부분5.jpg",
  },
  {
    label: "WB4-⑥ 해결방안 개발 및 구체화 (SCAMPER 기법)",
    subtitle: "Solution development (SCAMPER)",
    pdfPath: "/pdf/04_workbook_ori_부분6.pdf",
    thumbnailPath: "/pdf/thumbnails/04_workbook_ori_부분6.jpg",
  },
  {
    label: "WB4-⑦·⑧ 고객에게 줄 가치(Value Proposition) · 발표 준비",
    subtitle: "Value Proposition for customers / Presentation preparation",
    pdfPath: "/pdf/04_workbook_ori_부분7.pdf",
    thumbnailPath: "/pdf/thumbnails/04_workbook_ori_부분7.jpg",
    badgeNumber: "7·8",
  },
  {
    label: "WB4-⑨ 오늘의 배움 정리",
    subtitle: "Summary of today's learning",
    pdfPath: "/pdf/04_workbook_ori_부분8.pdf",
    thumbnailPath: "/pdf/thumbnails/04_workbook_ori_부분8.jpg",
    badgeNumber: "9",
  },
];

const workbook04: WorkbookContent = {
  ...placeholderWorkbook("04"),
  items: workbook04Items,
  summaryTitle: "📌 [단계 4] 뿌리 내리기: 고객 공감 및 해결 방안 구체화 (WB 04)",
  summaryBody:
    "🧩 고객의 입장에서 보고, 듣고, 생각하는 **공감지도(Empathy Map)**를 그려보세요. \"어떻게 하면(How Might We) ~할 수 있을까?\"라는 질문을 던져 아이디어를 확장해 봅시다. 이때 SCAMPER 기법을 활용하면 좋습니다. SCAMPER는 기존 아이디어를 **대체(S), 결합(C), 적용(A), 수정(M), 용도 변경(P), 제거(E), 역발상(R)**의 7가지 렌즈로 변형해보는 도구입니다.",
  summaryTable: wb04PainGainTable,
  summaryClosing:
    "📦 이제 막연했던 아이디어가 뿌리를 내렸습니다. 이제 눈에 보이는 형태인 '제품'으로 만들어볼까요?",
};

const wb05AppSteps: string[] = [
  "Planning (기획): 서비스의 흐름과 구조도를 설계합니다.",
  "Design (디자인): 브랜드의 성격을 보여주는 로고와 색상을 결정합니다.",
  "Prototyping (프로토타이핑): 와이어프레임으로 화면의 러프 스케치를 작성합니다.",
  "Development (개발): 핵심 기능을 중심으로 실제 형태를 구현합니다.",
  "Deployment (배포/출시): 완성된 서비스를 고객이 쓸 수 있게 세상에 내놓습니다.",
  "Testing (테스트): 실제 사용해보며 버그를 찾고 개선점을 점검합니다.",
];

const workbook05Items: WorkbookContent["items"] = [
  {
    label: "WB5-①·② MVP란 무엇일까? · 우리 아이디어의 핵심 기능 정리",
    subtitle: "What is MVP? / Organize the core features of our idea",
    pdfPath: "/pdf/05_workbook_ori_부분1.pdf",
    thumbnailPath: "/pdf/thumbnails/05_workbook_ori_부분1.jpg",
    badgeNumber: "1·2",
  },
  {
    label: "WB5-③ 제품(서비스) 구조도 그리기",
    subtitle: "Draw the product/service structure diagram",
    pdfPath: "/pdf/05_workbook_ori_부분2.pdf",
    thumbnailPath: "/pdf/thumbnails/05_workbook_ori_부분2.jpg",
    badgeNumber: "3",
  },
  {
    label: "WB5-④ Lo-fi 프로토타이핑 (제품 러프 스케치)",
    subtitle: "Lo-fi Prototyping (product rough sketch)",
    pdfPath: "/pdf/05_workbook_ori_부분3.pdf",
    thumbnailPath: "/pdf/thumbnails/05_workbook_ori_부분3.jpg",
    badgeNumber: "4",
  },
  {
    label: "WB5-⑤ 시제품(MVP) 구상(와이어프레임 스케치)",
    subtitle: "Conceive a prototype (MVP) (wireframe sketch)",
    pdfPath: "/pdf/05_workbook_ori_부분4.pdf",
    thumbnailPath: "/pdf/thumbnails/05_workbook_ori_부분4.jpg",
    badgeNumber: "5",
  },
  {
    label: "WB5-⑥·⑦ 제품/서비스의 강점 정리 · 발표 준비",
    subtitle: "Summarize the strengths / Presentation preparation",
    pdfPath: "/pdf/05_workbook_ori_부분5.pdf",
    thumbnailPath: "/pdf/thumbnails/05_workbook_ori_부분5.jpg",
    badgeNumber: "6·7",
  },
  {
    label: "WB5-⑧ 오늘의 배움 정리",
    subtitle: "Summary of today's learning",
    pdfPath: "/pdf/05_workbook_ori_부분6.pdf",
    thumbnailPath: "/pdf/thumbnails/05_workbook_ori_부분6.jpg",
    badgeNumber: "8",
  },
];

const workbook05: WorkbookContent = {
  ...placeholderWorkbook("05"),
  items: workbook05Items,
  summaryTitle: "📌 [단계 5] 싹 틔우기: 제품 서비스 설계 및 MVP 제작 (WB 05)",
  summaryBody:
    "🌱 처음부터 완벽한 제품을 만들려고 애쓰지 마세요. 핵심 기능만 담은 **MVP(최소 기능 제품)**를 빠르게 만들어 고객의 반응을 확인하는 것이 핵심입니다. 앱 서비스를 기획한다면 아래의 6단계 프로세스를 기억하세요.",
  summarySteps: wb05AppSteps,
  summaryStepsTitle: "📱 앱 개발 6단계 프로세스",
  summaryClosing:
    "💰 제품이 준비되었다면, 이제 이 사업이 어떻게 돈을 벌고 운영될지 구조를 세워야 합니다.",
};

const wb06BmcTable: WorkbookContent["summaryTable"] = {
  title: "🎯 비즈니스 모델 핵심 3요소",
  columns: [
    { key: "element", label: "요소" },
    { key: "definition", label: "정의" },
    { key: "tip", label: "신규 창업자를 위한 팁" },
  ],
  rows: [
    {
      element: "👥 고객 (Customer)",
      definition: "서비스를 이용할 타깃 층",
      tip: '"누가 우리 서비스를 가장 간절히 원하는가?"를 고민하세요.',
    },
    {
      element: "💎 가치 제안 (Value)",
      definition: "우리가 고객을 돕는 특별한 방식",
      tip: "고객이 우리를 선택해야만 하는 결정적인 이유를 적으세요.",
    },
    {
      element: "💰 수익원 (Revenue)",
      definition: "돈을 버는 구체적인 방법",
      tip: "판매, 구독, 광고 등 지속 가능한 수익 구조를 설계하세요.",
    },
  ],
};

const workbook06Items: WorkbookContent["items"] = [
  {
    label: "WB6-① 비즈니스 모델이란?",
    subtitle: "What is a business model?",
    pdfPath: "/pdf/06_workbook_ori_부분1.pdf",
    thumbnailPath: "/pdf/thumbnails/06_workbook_ori_부분1.jpg",
    badgeNumber: "1",
  },
  {
    label: "WB6-② BMC의 9가지 요소 및 우리팀의 비즈니스모델 캔버스",
    subtitle: "9 elements of BMC and our team's business model canvas",
    pdfPath: "/pdf/06_workbook_ori_부분2.pdf",
    thumbnailPath: "/pdf/thumbnails/06_workbook_ori_부분2.jpg",
    badgeNumber: "2",
  },
  {
    label: "WB6-③·④ 고객에게 주는 가치(Value Proposition) · 발표 준비",
    subtitle: "Value Proposition for customers / Presentation preparation",
    pdfPath: "/pdf/06_workbook_ori_부분3.pdf",
    thumbnailPath: "/pdf/thumbnails/06_workbook_ori_부분3.jpg",
    badgeNumber: "3·4",
  },
  {
    label: "WB6-⑤ 오늘의 배움 정리",
    subtitle: "Summary of today's learning",
    pdfPath: "/pdf/06_workbook_ori_부분4.pdf",
    thumbnailPath: "/pdf/thumbnails/06_workbook_ori_부분4.jpg",
    badgeNumber: "5",
  },
];

const workbook06: WorkbookContent = {
  ...placeholderWorkbook("06"),
  items: workbook06Items,
  summaryTitle: "📌 [단계 6] 줄기 세우기: 비즈니스 모델 설계 (WB 06)",
  summaryBody:
    "🗺️ **비즈니스 모델 캔버스(BMC)**는 사업의 가치를 어떻게 창출하고 전달할지 보여주는 지도입니다. 9가지 요소 중 특히 다음 3가지의 연결성이 가장 중요합니다.",
  summaryTable: wb06BmcTable,
  summaryClosing:
    "🌿 튼튼한 줄기가 세워졌으니, 이제 우리 서비스를 세상에 널리 알릴 잎을 틔울 시간입니다.",
};

const wb074P4CTable: WorkbookContent["summaryTable"] = {
  title: "📢 마케팅 관점의 전환: 4P vs 4C",
  columns: [
    { key: "p4", label: "기업 중심 (4P)" },
    { key: "c4", label: "고객 중심 (4C)" },
    { key: "meaning", label: "마케팅의 진정한 의미" },
  ],
  rows: [
    {
      p4: "Product (제품)",
      c4: "Customer Value (고객 가치)",
      meaning: "고객에게 어떤 특별한 혜택을 주는가?",
    },
    {
      p4: "Price (가격)",
      c4: "Cost (고객의 비용)",
      meaning: "고객이 시간과 돈을 들일 만한 가치가 있는가?",
    },
    {
      p4: "Place (유통)",
      c4: "Convenience (편의성)",
      meaning: "고객이 얼마나 쉽고 편하게 접근할 수 있는가?",
    },
    {
      p4: "Promotion (홍보)",
      c4: "Communication (소통)",
      meaning: "고객과 어떤 메시지로 신뢰를 형성할 것인가?",
    },
  ],
};

const workbook07Items: WorkbookContent["items"] = [
  {
    label: "WB7-① 마케팅이란 무엇일까?",
    subtitle: "What is marketing?",
    pdfPath: "/pdf/07_workbook_ori_부분1.pdf",
    thumbnailPath: "/pdf/thumbnails/07_workbook_ori_부분1.jpg",
    badgeNumber: "1",
  },
  {
    label: "WB7-②·③ 마케팅의 기본 4P · 고객 중심 4C로 바꿔보기",
    subtitle: "Marketing 4P basics / Switching to customer-centric 4C",
    pdfPath: "/pdf/07_workbook_ori_부분2.pdf",
    thumbnailPath: "/pdf/thumbnails/07_workbook_ori_부분2.jpg",
    badgeNumber: "2·3",
  },
  {
    label: "WB7-④·⑤ 타깃 고객에게 알리는 방법 · 홍보 콘텐츠 기획",
    subtitle: "Ways to reach target customers / Promotion content planning",
    pdfPath: "/pdf/07_workbook_ori_부분3.pdf",
    thumbnailPath: "/pdf/thumbnails/07_workbook_ori_부분3.jpg",
    badgeNumber: "4·5",
  },
  {
    label: "WB7-⑥ 홍보 포스터 초안",
    subtitle: "Promotion poster draft",
    pdfPath: "/pdf/07_workbook_ori_부분4.pdf",
    thumbnailPath: "/pdf/thumbnails/07_workbook_ori_부분4.jpg",
    badgeNumber: "6",
  },
  {
    label: "WB7-⑦ 홍보 영상 기획 시트",
    subtitle: "Promotion video planning sheet",
    pdfPath: "/pdf/07_workbook_ori_부분5.pdf",
    thumbnailPath: "/pdf/thumbnails/07_workbook_ori_부분5.jpg",
    badgeNumber: "7",
  },
  {
    label: "WB7-⑧ 발표 준비",
    subtitle: "Presentation preparation",
    pdfPath: "/pdf/07_workbook_ori_부분6.pdf",
    thumbnailPath: "/pdf/thumbnails/07_workbook_ori_부분6.jpg",
    badgeNumber: "8",
  },
  {
    label: "WB7-⑨ 오늘의 배움 정리",
    subtitle: "Summary of today's learning",
    pdfPath: "/pdf/07_workbook_ori_부분7.pdf",
    thumbnailPath: "/pdf/thumbnails/07_workbook_ori_부분7.jpg",
    badgeNumber: "9",
  },
];

const workbook07: WorkbookContent = {
  ...placeholderWorkbook("07"),
  items: workbook07Items,
  summaryTitle: "📌 [단계 7] 잎 펼치기: 마케팅 및 홍보 전략 (WB 07)",
  summaryBody:
    "📣 마케팅은 단순히 광고를 하는 행위가 아니라, 고객과 **'관계를 맺고 신뢰를 쌓는 과정'**입니다. 기업 중심의 시각(4P)에서 벗어나, 고객의 마음을 읽는 시각(4C)으로 전략을 전환해 보세요.",
  summaryTable: wb074P4CTable,
  summaryClosing:
    "📋 홍보 전략까지 세웠다면, 이제 팀원들과 함께 실제로 움직일 계획을 짤 차례입니다.",
};

const wb08RolesTable: WorkbookContent["summaryTable"] = {
  title: "👥 창업팀의 주요 역할 (WB 01 기반)",
  columns: [
    { key: "role", label: "역할" },
    { key: "description", label: "주요 역할" },
  ],
  rows: [
    {
      role: "CEO (대표)",
      description: "팀을 이끄는 리더이자 중심축으로서, 전체적인 목표 설정 및 방향성을 제시합니다.",
    },
    {
      role: "CMO (마케팅)",
      description: "에너지와 활력을 바탕으로 마케팅 활동 및 고객 소통을 주도합니다.",
    },
    {
      role: "CTO (기술)",
      description: "분석적인 사고를 통해 제품 개발 및 기술적 문제 해결을 담당합니다.",
    },
    {
      role: "CFO (재무)",
      description: "예산 관리 및 자금 흐름을 꼼꼼하게 관리하는 역할을 수행합니다.",
    },
    {
      role: "CPO (제품)",
      description: "서비스 기획 및 아이디어 전구(디자인 감각) 역할을 담당합니다.",
    },
  ],
};

const wb08PrioritySteps: string[] = [
  "🔴 Red (레드): 즉시 처리해야 하는 최우선 업무입니다.",
  "🟡 Yellow (옐로): 중요하지만 시간적 여유가 있는 업무입니다.",
  "🟢 Green (그린): 급하지 않은 후순위 업무입니다.",
];

const workbook08Items: WorkbookContent["items"] = [
  {
    label: "WB8-①·② 운영계획이란 무엇일까? · 팀 역할 분담표 작성하기",
    subtitle: "Operating plan - What is it? / Create a team role distribution chart",
    pdfPath: "/pdf/08_workbook_ori_부분1.pdf",
    thumbnailPath: "/pdf/thumbnails/08_workbook_ori_부분1.jpg",
    badgeNumber: "1·2",
  },
  {
    label: "WB8-③ 실행 일정표 만들기",
    subtitle: "Create an execution schedule",
    pdfPath: "/pdf/08_workbook_ori_부분2.pdf",
    thumbnailPath: "/pdf/thumbnails/08_workbook_ori_부분2.jpg",
    badgeNumber: "3",
  },
  {
    label: "WB8-④ 오늘의 배움 정리",
    subtitle: "Summary of today's learning",
    pdfPath: "/pdf/08_workbook_ori_부분3.pdf",
    thumbnailPath: "/pdf/thumbnails/08_workbook_ori_부분3.jpg",
    badgeNumber: "4",
  },
];

const workbook08: WorkbookContent = {
  ...placeholderWorkbook("08"),
  items: workbook08Items,
  summaryTitle: "📌 [단계 8] 성장의 동력: 운영 계획 및 실행 전략 (WB 08)",
  summaryBody:
    "⚙️ 창업팀은 하나의 소규모 사회로서, 각 구성원의 강점을 기반으로 역할을 분담하고 업무의 우선순위를 명확히 설정하는 것이 실행력의 핵심 요소입니다.",
  summaryTable: wb08RolesTable,
  summarySteps: wb08PrioritySteps,
  summaryStepsTitle: "📅 업무 우선순위 관리 코드 (간트 차트 활용 예시)",
  summaryClosing:
    "⛽ 마지막으로, 사업의 지속적인 성장을 위한 '연료'를 점검해야 합니다.",
};

const wb09BepSteps: string[] = [
  "🟢 흑자: 순이익이 0보다 큰(+) 상태 (수익 발생!)",
  "🔴 적자: 순이익이 0보다 작은(-) 상태 (손해 발생!)",
  "📌 BEP 해석: \"우리가 망하지 않고 살아남기 위해 팔아야 할 최소한의 양\"",
];

const workbook09Items: WorkbookContent["items"] = [
  {
    label: "WB9-① 재무계획이란 무엇일까?",
    subtitle: "What is a financial plan?",
    pdfPath: "/pdf/09_workbook_ori_부분1.pdf",
    thumbnailPath: "/pdf/thumbnails/09_workbook_ori_부분1.jpg",
    badgeNumber: "1",
  },
  {
    label: "WB9-②·③ 비용 구조 정리하기 · 수익 구조 설계하기",
    subtitle: "Organizing the cost structure / Designing the revenue structure",
    pdfPath: "/pdf/09_workbook_ori_부분2.pdf",
    thumbnailPath: "/pdf/thumbnails/09_workbook_ori_부분2.jpg",
    badgeNumber: "2·3",
  },
  {
    label: "WB9-④ 손익 계산하기",
    subtitle: "Calculating profit and loss",
    pdfPath: "/pdf/09_workbook_ori_부분3.pdf",
    thumbnailPath: "/pdf/thumbnails/09_workbook_ori_부분3.jpg",
    badgeNumber: "4",
  },
  {
    label: "WB9-⑤ 오늘의 배움 정리",
    subtitle: "Summary of today's learning",
    pdfPath: "/pdf/09_workbook_ori_부분4.pdf",
    thumbnailPath: "/pdf/thumbnails/09_workbook_ori_부분4.jpg",
    badgeNumber: "5",
  },
];

const workbook09: WorkbookContent = {
  ...placeholderWorkbook("09"),
  items: workbook09Items,
  summaryTitle: "📌 [단계 9] 열매 맺기: 재무 계획 및 손익분기점 (WB 09)",
  summaryBody:
    "💰 지속 가능한 사업을 위해서는 돈의 흐름을 정확히 읽어야 합니다. **손익분기점(BEP)**은 \"이익도 손해도 없는 지점\"으로, 사업이 생존하기 위해 최소한 몇 개를 팔아야 하는지 알려주는 지표입니다.",
  summaryHighlight:
    "📐 손익분기점(BEP) 계산 공식\n총 수익 (판매 단가 × 판매 수량) − 총 비용 (고정비 + 변동비) = 0",
  summarySteps: wb09BepSteps,
  summaryStepsTitle: "📊 손익분기점 해석",
  summaryClosing:
    "🎤 드디어 모든 준비가 끝났습니다! 이제 여러분의 멋진 여행 결과물을 세상에 발표할 차례입니다.",
};

const workbook10Items: WorkbookContent["items"] = [
  {
    label: "WB10-① 피칭이란 무엇일까? / 피칭의 기본구조",
    subtitle: "What is pitching? / Basic structure of pitching",
    pdfPath: "/pdf/10_workbook_ori_부분1.pdf",
    thumbnailPath: "/pdf/thumbnails/10_workbook_ori_부분1.jpg",
    badgeNumber: "1",
  },
  {
    label: "WB10-② 발표 슬라이드 구성하기",
    subtitle: "Structuring presentation slides",
    pdfPath: "/pdf/10_workbook_ori_부분2.pdf",
    thumbnailPath: "/pdf/thumbnails/10_workbook_ori_부분2.jpg",
    badgeNumber: "2",
  },
  {
    label: "WB10-③ 발표 스크립트 작성",
    subtitle: "Writing the presentation script",
    pdfPath: "/pdf/10_workbook_ori_부분3.pdf",
    thumbnailPath: "/pdf/thumbnails/10_workbook_ori_부분3.jpg",
    badgeNumber: "3",
  },
  {
    label: "WB10-④·⑤ 발표 연습 체크리스트 · 피드백 받기",
    subtitle: "Presentation practice checklist / Receiving feedback",
    pdfPath: "/pdf/10_workbook_ori_부분4.pdf",
    thumbnailPath: "/pdf/thumbnails/10_workbook_ori_부분4.jpg",
    badgeNumber: "4·5",
  },
  {
    label: "WB10-⑥ 오늘의 배움 정리",
    subtitle: "Summary of today's learning",
    pdfPath: "/pdf/10_workbook_ori_부분5.pdf",
    thumbnailPath: "/pdf/thumbnails/10_workbook_ori_부분5.jpg",
    badgeNumber: "6",
  },
];

const workbook10: WorkbookContent = {
  ...placeholderWorkbook("10"),
  items: workbook10Items,
  summaryTitle: "📌 [단계 10] 여정의 완성: \"나도 세상을 바꿀 수 있다\"",
  summaryBody:
    "🌟 마지막 10회차의 꽃은 바로 **'피칭(Pitching)'**입니다. 피칭은 단순히 슬라이드를 읽는 것이 아닙니다. 스티브 잡스처럼 감성적인 스토리텔링을 통해 청중의 마음을 사로잡는 과정입니다. 창의적으로 문제를 해결하고, 팀원들과 소통하며 여기까지 온 여러분은 이미 훌륭한 창업가입니다. 이 여정을 통해 얻은 자신감으로 여러분만의 멋진 미래를 만들어가세요!",
  summaryHighlight:
    "✨ 여러분의 빛나는 창업가 정신을 담아 아래 다짐을 완성해 보세요.\n\n\"우리 팀은 앞으로 ________________________________________________ 하는 창업가가 되겠다!\"",
  summaryClosing:
    "🎉 여러분의 용기 있는 도전을 진심으로 응원합니다!",
};

const workbookMap: Record<string, WorkbookContent> = {
  "01": workbook01,
  "02": workbook02,
  "03": workbook03,
  "04": workbook04,
  "05": workbook05,
  "06": workbook06,
  "07": workbook07,
  "08": workbook08,
  "09": workbook09,
  "10": workbook10,
};

export function getWorkbook(chapterId: string): WorkbookContent {
  return workbookMap[chapterId] ?? placeholderWorkbook(chapterId);
}
