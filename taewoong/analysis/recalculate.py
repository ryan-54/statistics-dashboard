"""Python 3 표준 라이브러리만 사용. 실행: python recalculate.py"""
import csv
from pathlib import Path

ROOT = Path(__file__).resolve().parent
rows = list(csv.DictReader((ROOT / 'financials.csv').open(encoding='utf-8-sig')))
for row in rows:
    for k in ['revenue','cost','gross_profit','sga','operating_profit']:
        row[k] = int(row[k])
    assert row['revenue'] - row['cost'] == row['gross_profit'], row['period']
    assert row['gross_profit'] - row['sga'] == row['operating_profit'], row['period']
    for key, numerator in [('gross_margin','gross_profit'),('sga_ratio','sga'),('operating_margin','operating_profit')]:
        row[key] = row[numerator] / row['revenue'] * 100
    print(row['period'], '매출(억원)',f"{row['revenue']/1e8:,.2f}",
          '매출총이익률/판관비율/영업이익률(%)',
          *[f'{row[k]:.2f}' for k in ['gross_margin','sga_ratio','operating_margin']])
for a,b in [(0,1),(1,2),(3,4)]:
    before,after=rows[a],rows[b]
    print(before['period'],'->',after['period'])
    for key in ['revenue','operating_profit']:
        print(key, '증감률(%)',f"{(after[key]/before[key]-1)*100:.2f}")
    dg=after['gross_profit']-before['gross_profit']
    ds=after['sga']-before['sga']
    do=after['operating_profit']-before['operating_profit']
    assert dg-ds==do
    print('영업이익 증감 = 매출총이익 증감 - 판관비 증감 (원)',do,dg,ds)
    print('영업이익률 차이(%p)',f"{after['operating_margin']-before['operating_margin']:.2f}")
print('2025년 물동량 증가율(%)',f'{(370280/344144-1)*100:.2f}')
print('2025년 CCFI 공시평균 증감률(%)',f'{(1197.6/1552.4-1)*100:.2f}')
print('2025년 SCFI 공시평균 증감률(%)',f'{(1581.3/2506.3-1)*100:.2f}')
for name, vals in [('2025H1_CCFI',[1542.9,1342.9,1165.6,1110.8,1111.5,1277.5]),('2026H1_CCFI',[1197.3,1085.0,1096.5,1209.8,1302.6,1550.3]),('2025H1_SCFI',[2243.0,1691.5,1351.3,1376.5,1564.9,2014.9]),('2026H1_SCFI',[1499.0,1283.7,1683.2,1876.9,2159.2,3018.3])]:
    print(name,'월별 공시값 단순평균',f'{sum(vals)/len(vals):.2f}')
print('검증 완료: 5개 기간 회계등식 및 3개 비교기간 증감분해 모두 일치.')

extra=list(csv.DictReader((ROOT/'draft_tables.csv').open(encoding='utf-8-sig')))
def value(category,indicator,period):
    return float(next(x['value'] for x in extra if x['category']==category and x['indicator']==indicator and x['period']==period))
print('기존 작성안 부록 수치 재계산:')
print('대손상각비 증가 기여율(%)',f"{value('verification','대손상각비 증가액','2025')/((rows[2]['sga']-rows[1]['sga'])/1000)*100:.2f}")
print('2025년 손실충당금 비율(%)',f"{value('verification','매출채권 손실충당금','2025-12')/value('verification','총매출채권','2025-12')*100:.2f}")
for period in ['2024','2025','2026H1']:
    print(period,'부채비율(%)',f"{value('balance','부채총계',period)/value('balance','자본총계',period)*100:.2f}")
print('상반기 영업현금흐름 증감(억원)',f"{(value('cashflow','영업활동현금흐름','2026H1')-value('cashflow','영업활동현금흐름','2025H1'))/1e8:.2f}")
