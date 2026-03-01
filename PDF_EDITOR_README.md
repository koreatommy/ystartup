# PDF 편집기 모바일/태블릿 지원 구현

## 개요

모바일, 태블릿, 데스크톱에서 동일한 PDF 편집 경험을 제공하는 기능이 구현되었습니다. 브라우저 기본 PDF 뷰어에 의존하지 않고, PDF.js 기반 커스텀 뷰어와 Canvas 드로잉 레이어를 사용하여 모든 기기에서 일관된 편집 툴바를 제공합니다.

## 주요 기능

### 1. 편집 도구
- **펜**: 자유 드로잉 (색상/굵기 조절 가능)
- **형광펜**: 반투명 마커
- **텍스트**: 텍스트 박스 추가
- **도형**: 사각형, 원, 화살표, 선
- **지우개**: 주석 삭제
- **실행취소/다시실행**: 편집 히스토리 관리

### 2. 저장 옵션
- **로컬 다운로드**: jspdf로 주석이 포함된 PDF 생성 및 다운로드
- **서버 저장**: 사용자별 편집 내용을 JSON으로 저장하고 복원

### 3. 반응형 UI
- **모바일**: 풀스크린 캔버스, 하단 고정 툴바
- **태블릿**: 상단/사이드 툴바, 터치 최적화
- **데스크톱**: 풀 툴바, 페이지 네비게이션 패널

## 파일 구조

```
src/
├── components/pdf-editor/
│   ├── PdfEditorModal.tsx      # 메인 모달
│   ├── EditorToolbar.tsx       # 편집 도구 툴바
│   ├── PdfCanvas.tsx           # PDF 렌더링
│   ├── AnnotationCanvas.tsx    # 주석 오버레이
│   └── PageNavigation.tsx      # 페이지/줌 컨트롤
├── hooks/
│   ├── usePdfDocument.ts       # PDF 문서 관리
│   ├── useAnnotations.ts       # 주석 상태 관리
│   └── useDrawing.ts           # 드로잉 이벤트 처리
├── lib/
│   └── pdfExport.ts            # PDF 내보내기
├── types/
│   └── annotation.ts           # 주석 타입 정의
└── app/api/annotations/[pdfId]/
    └── route.ts                # 주석 저장/로드 API

data/
└── annotations/                # 사용자 주석 저장 디렉토리
```

## 사용 방법

### 1. 워크북에서 PDF 열기
```typescript
import { PdfEditorModal } from "@/components/pdf-editor/PdfEditorModal";

<PdfEditorModal
  isOpen={isOpen}
  onClose={onClose}
  pdfPath="/pdf/01_workbook_ori_부분1.pdf"
  title="워크북 1-1"
  pdfId="wb_01_01"
/>
```

### 2. 편집하기
1. 툴바에서 도구 선택 (펜, 형광펜, 텍스트, 도형 등)
2. 색상과 굵기 조절
3. PDF 위에 직접 드로잉/텍스트 입력
4. 실행취소/다시실행으로 편집 조정

### 3. 저장하기
- **저장 버튼**: 서버에 주석 데이터 저장 (다음 열람 시 복원)
- **다운로드 버튼**: 주석이 포함된 PDF 파일로 다운로드

## 기술 스택

- **PDF.js**: Mozilla의 PDF 렌더링 엔진
- **jspdf**: 주석 합성 PDF 생성
- **Canvas API**: 드로잉 및 주석 렌더링
- **Next.js App Router**: API 라우트 및 서버 저장

## 터치 이벤트 지원

- **PointerEvent API**: 마우스, 터치, 스타일러스 통합 처리
- **터치 제스처**: 드로잉, 핀치 줌 지원
- **모바일 최적화**: `touchAction: none`으로 브라우저 기본 제스처 방지

## 주의사항

### 서버 저장
- `data/annotations/` 디렉토리가 자동으로 생성됩니다
- 프로덕션 환경에서는 데이터베이스 사용 권장

### 성능
- PDF.js는 클라이언트에서만 동적 import로 로드됩니다
- 대용량 PDF의 경우 페이지별 렌더링으로 최적화

### 브라우저 호환성
- 모던 브라우저 (Chrome, Safari, Firefox, Edge) 지원
- Canvas API 및 PointerEvent 필요

## 향후 개선 사항

- [ ] 텍스트 주석 입력 UI 개선
- [ ] 멀티페이지 썸네일 네비게이션
- [ ] 클라우드 스토리지 연동
- [ ] 협업 편집 기능
- [ ] 오프라인 모드 지원 (IndexedDB)

## 라이선스

이 프로젝트는 기존 ystart 프로젝트의 라이선스를 따릅니다.
