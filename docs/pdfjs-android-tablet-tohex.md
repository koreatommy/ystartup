# PDF 뷰어: Android 태블릿 `a.toHex is not a function` 참조

## 증상

- 워크북 썸네일(`WorkbookItemThumbnail`)에서 PDF 편집 모달(`PdfEditorModal`)을 연 뒤, **특정 Android 태블릿**에서만 `a.toHex is not a function` 오류가 발생할 수 있음.
- Mac, iPhone, 많은 Android 폰에서는 정상 동작.

## 원인 요약

- 오류는 **앱 소스가 아니라 `pdfjs-dist` 5.x의 PDF 워커** 내부에서 발생하는 것으로 추정됨.
- 워커가 문서 **fingerprint**를 계산할 때 `Uint8Array` 인스턴스에 대해 **`.toHex()`** 를 호출함.
- `Uint8Array.prototype.toHex`는 비교적 최근 JS 엔진에 추가된 API(TC39 ArrayBuffer/base64·hex 관련)이며, **구형 Chromium / Android System WebView**에는 없을 수 있음.
- minify된 번들에서는 호출 대상이 변수 `a`로 보여 스택/메시지가 `a.toHex is not a function` 형태로 나올 수 있음.

## 코드베이스에서의 연결

| 위치 | 내용 |
|------|------|
| `src/hooks/usePdfDocument.ts` | `GlobalWorkerOptions.workerSrc` → `pdfjs-dist/build/pdf.worker.min.mjs` (표준 빌드) |
| `src/lib/pdfExport.ts` | 동일하게 `pdf.worker.min.mjs` 사용 시 같은 제약 적용 가능 |
| `node_modules/pdfjs-dist/build/pdf.worker.mjs` | `get fingerprints` 등에서 `hashOriginal.toHex()` 호출 |
| `node_modules/pdfjs-dist/legacy/build/pdf.worker.mjs` | `Uint8Array.prototype.toHex` polyfill 포함 |

## 수정 시 참고 방향 (미적용 메모)

1. **Legacy 워커 사용**  
   워커 경로를 `pdfjs-dist/legacy/build/pdf.worker.min.mjs` 등 **legacy 빌드**로 바꿔, 구형 환경에서도 `toHex`가 정의되도록 함.  
   - 메인 스레드에서 쓰는 `pdf.mjs`와 워커 조합은 [PDF.js 문서](https://github.com/mozilla/pdf.js)의 legacy 권장 방식을 확인할 것.

2. **Polyfill**  
   워커/앱 로드 순서상 **`Uint8Array.prototype.toHex`** 를 먼저 정의하는 방식(표준 동작과 동일한 hex 문자열 규약 유지).

3. **검증**  
   문제 재현 기기의 **Chrome/WebView 버전**과 User-Agent를 기록해 두면 회귀 테스트에 유용함.

## 관련 의존성

- `package.json`: `pdfjs-dist` ^5.4.624 (버전 업 시에도 동일 이슈 여부는 릴리스 노트 확인)

## 작성 배경

- 2026년 디버깅에서: 표준 워커는 polyfill 없음, legacy 워커는 `Uint8Array.prototype.toHex` 보강 코드 포함함을 `node_modules` 소스로 확인.
