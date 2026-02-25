export interface ChapterMeta {
  id: string;
  color: string;
  titleKo: string;
  titleEn: string;
}

export interface WorkbookItem {
  label: string;
  subtitle: string;
  pdfPath?: string;
  thumbnailPath?: string;
  /** 표시용 순번 (비연속 번호·합침 표기 시 사용, 예: "4·5", "6") */
  badgeNumber?: string;
  /** 항목 클릭 시 이동할 경로 (예: 도구/게임 페이지) */
  href?: string;
  /** 항목 설명(게임/도구 요약 등). 있으면 카드 내에 표시 */
  description?: string;
}

/** 학습 내용용 간단 테이블 (컬럼 키 → 셀 값) */
export interface SummaryTableColumn {
  key: string;
  label: string;
}

export interface SummaryTable {
  title?: string;
  columns: SummaryTableColumn[];
  rows: Record<string, string>[];
}

export interface WorkbookContent {
  wbId: string;
  titleKo: string;
  titleEn: string;
  items: WorkbookItem[];
  /** 대시보드 카드용 학습 내용 제목 (있을 때만 학습 내용 영역 표시) */
  summaryTitle?: string;
  /** 대시보드 카드용 학습 내용 본문. **텍스트** 는 강조로 렌더링됨 */
  summaryBody?: string;
  /** 학습 내용 내 테이블 */
  summaryTable?: SummaryTable;
  /** 학습 내용 내 핵심 통찰/하이라이트 문구 (이모지 포함 가능) */
  summaryHighlight?: string;
  /** 학습 내용 내 체크리스트 (선택, 이모지 포함 가능) */
  summaryChecklist?: string[];
  /** 학습 내용 내 순서 목록 (예: 프로세스 단계). summaryStepsTitle 로 블록 제목 지정 가능 */
  summarySteps?: string[];
  summaryStepsTitle?: string;
  /** 학습 내용 마무리 문단 */
  summaryClosing?: string;
}
