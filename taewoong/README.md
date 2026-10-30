# 태웅로직스 재무현황 대시보드
2조 김승범 · 202311055 · 통계컨설팅의 이해

## 실행
외부 패키지가 없는 정적 HTML/JavaScript 앱입니다. dist/index.html을 브라우저에서 열거나 `python -m http.server 8000 --directory dist`로 실행합니다.
검증: `node verify.mjs`

## 기능
연간/상반기와 기준기간 선택, 손익 표 및 CSV, 영업이익 변화 분해, 채권·현금흐름, 출처 및 계산 검증, 보고서/분석자료 다운로드.
개요의 기간 선택은 개요 KPI·그래프·표·CSV에 함께 적용됩니다. 다른 화면의 고정 기간은 각 제목에 표시합니다.

## 범위와 한계
2023–2025년 연간 및 2025·2026년 상반기 연결 공시자료의 고정 스냅샷입니다. 자동 갱신되지 않습니다. 일부 주석 세부값은 기존 보고서 전사이며 (확인필요) 표시를 유지합니다. 인과 추정이나 미래예측을 수행하지 않습니다. 동료 피드백은 포함하지 않았습니다.

## 수정과 갱신
1. 원 공시에서 기간·연결범위·단위를 대조합니다.
2. dist/data.js와 다운로드 CSV를 함께 갱신합니다. 채권·현금흐름 세부값은 dist/app.js에 있습니다.
3. verify.mjs와 화면의 검증을 실행하고 기대값 변경은 공시 근거와 함께 기록합니다.
4. 기간별 화면과 다운로드를 확인한 후 배포합니다. 실패하면 이전 정상 버전으로 복구합니다.
사이트 접근권한과 GitHub 저장소 공개 여부는 별개입니다. 교수자 제출 전 접근 가능 여부를 확인해야 합니다.

## 파일
- dist/index.html: 화면·출처
- dist/style.css: 반응형 디자인
- dist/data.js: 원 단위 연결 손익
- dist/app.js: 계산·차트·필터
- dist/downloads: 보고서 및 분석자료
- VERIFICATION.md: 검증 범위

## GitHub와 배포
저장소: https://github.com/ryan-54/statistics-dashboard (main, taewoong 폴더)
앱: https://taewoong-financial-review-2026.tinyangel20.chatgpt.site
두 곳의 접근 설정은 비공개이며 서로 별개입니다. 현재 자동 배포 연동은 없으며 GitHub에 소스를 보관하고 Sites에서 실행합니다. 자세한 기준은 PRD.md, DATA_DICTIONARY.md, HANDOVER.md, VERIFICATION.md를 참고하세요.
