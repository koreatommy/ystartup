import type { LucideIcon } from "lucide-react";
import {
  Award,
  BookOpen,
  Briefcase,
  GraduationCap,
  Heart,
  Lightbulb,
  MapPin,
  MessageSquare,
  Rocket,
  Sparkles,
  Target,
  TrendingUp,
  Users,
} from "lucide-react";

export type PublicFeature = {
  icon: LucideIcon;
  title: string;
  description: string;
  color: string;
  bgColor: string;
};

export const PUBLIC_LANDING_FEATURES: PublicFeature[] = [
  {
    icon: Target,
    title: "단계별 프로젝트형 학습",
    description: "체계적인 20차시 커리큘럼으로 창업 역량을 단계적으로 성장시킵니다.",
    color: "text-mint-500",
    bgColor: "bg-mint-50",
  },
  {
    icon: BookOpen,
    title: "실습 중심 워크북 체계",
    description: "이론보다 실습에 집중한 워크북으로 실제 경험을 통해 학습합니다.",
    color: "text-orange-500",
    bgColor: "bg-orange-50",
  },
  {
    icon: Users,
    title: "청소년 친화형 사례 기반",
    description: "청소년의 눈높이에 맞춘 실제 사례와 콘텐츠로 몰입도를 높입니다.",
    color: "text-mint-500",
    bgColor: "bg-mint-50",
  },
  {
    icon: Sparkles,
    title: "STEAM 융합형 창의교육",
    description: "과학, 기술, 예술, 수학을 통합한 창의적 문제해결 교육을 제공합니다.",
    color: "text-orange-500",
    bgColor: "bg-orange-50",
  },
  {
    icon: MessageSquare,
    title: "협업·소통 중심",
    description: "팀워크와 의사소통 능력을 키우는 협업 프로젝트 중심 학습입니다.",
    color: "text-mint-500",
    bgColor: "bg-mint-50",
  },
  {
    icon: TrendingUp,
    title: "성장 중심 평가 구조",
    description: "결과보다 과정을 중시하며 학습자의 성장을 측정하는 평가 시스템입니다.",
    color: "text-orange-500",
    bgColor: "bg-orange-50",
  },
];

export const PUBLIC_LANDING_CURRICULUM = [
  { session: 1, title: "문제 인식", description: "주변의 문제를 발견하고 정의합니다" },
  { session: 2, title: "아이디어 도출", description: "창의적 방법으로 해결 아이디어를 찾습니다" },
  { session: 3, title: "시장 조사", description: "타깃 고객과 시장을 분석합니다" },
  { session: 4, title: "가설 설정", description: "검증 가능한 비즈니스 가설을 수립합니다" },
  { session: 5, title: "프로토타입", description: "아이디어를 간단한 형태로 구현합니다" },
  { session: 6, title: "시장 검증", description: "실제 사용자 반응을 통해 검증합니다" },
  { session: 7, title: "비즈니스 모델", description: "지속 가능한 수익 모델을 설계합니다" },
  { session: 8, title: "마케팅 전략", description: "고객에게 다가갈 방법을 기획합니다" },
  {
    session: 9,
    title: "피칭 준비",
    description: "아이디어를 효과적으로 전달할 방법을 학습합니다",
  },
  { session: 10, title: "피칭 & 성찰", description: "최종 발표를 하고 전체 과정을 성찰합니다" },
] as const;

export const PUBLIC_LANDING_WORKBOOK_CONTENTS = [
  {
    number: "01",
    title: "창업 이해와 팀 기반 창의 활동",
    subtitle: "Entrepreneurship and Team Creativity",
    color: "from-purple-500 to-pink-500",
    borderColor: "border-purple-200",
  },
  {
    number: "02",
    title: "창업의 기초 및 개념 이해하기",
    subtitle: "Basics & Concepts of Entrepreneurship",
    color: "from-pink-500 to-red-500",
    borderColor: "border-pink-200",
  },
  {
    number: "03",
    title: "시장조사 및 분석",
    subtitle: "Market Research & Analysis",
    color: "from-orange-500 to-orange-400",
    borderColor: "border-orange-200",
  },
  {
    number: "04",
    title: "고객 문제와 해결 방안",
    subtitle: "Customer Pain & Solution",
    color: "from-yellow-400 to-lime-400",
    borderColor: "border-yellow-200",
  },
  {
    number: "05",
    title: "제품 서비스 설계",
    subtitle: "Product / Service Design",
    color: "from-green-500 to-emerald-500",
    borderColor: "border-green-200",
  },
  {
    number: "06",
    title: "비즈니스 모델 설계",
    subtitle: "Business Model Design",
    color: "from-teal-400 to-cyan-400",
    borderColor: "border-teal-200",
  },
  {
    number: "07",
    title: "운영 계획 및 실행 전략",
    subtitle: "Operating & Execution Plan",
    color: "from-blue-500 to-blue-400",
    borderColor: "border-blue-200",
  },
  {
    number: "08",
    title: "마케팅 홍보 전략",
    subtitle: "Marketing & Promotion Strategy",
    color: "from-blue-600 to-indigo-500",
    borderColor: "border-blue-300",
  },
  {
    number: "09",
    title: "재무 계획",
    subtitle: "Financial Plan",
    color: "from-indigo-600 to-purple-600",
    borderColor: "border-indigo-300",
  },
  {
    number: "10",
    title: "발표 및 피칭 전략",
    subtitle: "Presentation & Pitching Strategy",
    color: "from-purple-700 to-purple-800",
    borderColor: "border-purple-400",
  },
] as const;

export type PublicEffect = {
  icon: LucideIcon;
  title: string;
  description: string;
};

export const PUBLIC_LANDING_EFFECTS: PublicEffect[] = [
  {
    icon: Lightbulb,
    title: "문제해결력",
    description: "복잡한 문제를 체계적으로 분석하고 해결하는 능력",
  },
  {
    icon: Sparkles,
    title: "창의적 사고력",
    description: "새로운 관점에서 아이디어를 창출하는 능력",
  },
  {
    icon: Users,
    title: "협업·의사소통",
    description: "팀원과 효과적으로 소통하고 협력하는 능력",
  },
  { icon: Rocket, title: "자기주도성", description: "스스로 목표를 설정하고 추진하는 능력" },
  { icon: Heart, title: "사회적 책임 의식", description: "사회 문제를 해결하려는 의지와 책임감" },
];

export type PublicOperationType = {
  type: string;
  description: string;
  icon: LucideIcon;
};

export const PUBLIC_LANDING_OPERATION_TYPES: PublicOperationType[] = [
  { type: "정규수업형", description: "학교 정규 수업 시간에 운영하는 형태", icon: GraduationCap },
  { type: "창업캠프형", description: "집중적인 단기 캠프 형태로 운영", icon: Briefcase },
  { type: "동아리형", description: "자율동아리 활동으로 진행하는 형태", icon: Users },
  { type: "공공기관형", description: "청소년 기관, 도서관 등에서 운영", icon: MapPin },
];

export const PUBLIC_LANDING_ROADMAP_STEPS = [
  { step: "문제 인식", icon: Lightbulb },
  { step: "아이디어", icon: Sparkles },
  { step: "시장 검증", icon: Target },
  { step: "제품 설계", icon: Rocket },
  { step: "피칭·성찰", icon: Award },
] as const;
