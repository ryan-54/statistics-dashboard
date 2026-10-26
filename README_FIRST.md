# 2차수 개발 시작 자료

이 ZIP에는 완성 앱 코드가 없습니다. app.py가 없는 것이 정상입니다.

1. ZIP 전체를 압축 해제하고 이 폴더를 프로젝트로 엽니다.
2. rules.md를 확인하고 PRD_template.md를 수정해 PRD.md로 저장합니다.
3. AI에 규칙, PRD, requirements.txt와 data의 자료를 제공해 app.py를 개발하도록 요청합니다.
4. 생성 코드를 실제 app.py 파일로 저장합니다. 추가 모듈을 생성했다면 함께 저장합니다.
5. Python 3.12와 가상환경이 준비되면 아래 명령을 한 줄씩 실행합니다.

    .\.venv\Scripts\python.exe -m pip install -r requirements.txt
    .\.venv\Scripts\python.exe -m streamlit run app.py

가상환경 생성은 `py -3.12 -m venv .venv`입니다.
py가 없지만 python --version이 3.12.x라면 `python -m venv .venv`를 사용합니다.
이미 정상 환경이 있으면 다시 만들지 않습니다.

8행 기준: 고객8명, 이탈3명/8명=37.5%, 평균52.5 CU.
100행 기준: 고객100명, 이탈21명/100명=21.0%, 평균71.6 CU.

개발 시작 ZIP과 완성 참고 앱 ZIP은 역할이 다릅니다.
참고 앱은 자기 앱의 개발·검증 후 별도 폴더에서 비교·복구용으로 확인합니다.

슬라이드: https://datathinkinglab.github.io/kyonggi-courses-2026/consulting/slides/week-02.html
설치 안내: https://datathinkinglab.github.io/kyonggi-courses-2026/consulting/downloads/windows-python-guide.html
