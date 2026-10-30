'use strict';
const DATA=window.FINANCIALS;
const $=id=>document.getElementById(id);
const fmt=(n,d=2)=>Number(n).toLocaleString('ko-KR',{minimumFractionDigits:d,maximumFractionDigits:d});
const signed=(n,d=2)=>(n>0?'+':n<0?'−':'')+fmt(Math.abs(n),d);
const ratio=(a,b)=>Number.isFinite(a)&&Number.isFinite(b)&&b!==0?a/b*100:null;
const growth=(a,b)=>b>0?(a/b-1)*100:null;
const label=r=>r.period.includes('H1')?r.period.slice(0,4)+' 상반기':r.period+'년';
const get=p=>DATA.find(r=>r.period===p);
const colors={teal:'#317d7e',muted:'#b8d0ce',coral:'#c7826b',navy:'#284e60',grid:'#e7edef',text:'#6e8590'};
let mode='annual';
function svg(content,w=480,h=235){return `<svg viewBox="0 0 ${w} ${h}" role="img" xmlns="http://www.w3.org/2000/svg">${content}</svg>`;}
function text(x,y,s,opts=''){return `<text x="${x}" y="${y}" fill="${colors.text}" font-size="10" ${opts}>${s}</text>`;}
function bars(target,labels,values,{color=colors.teal,selected=-1,percent=false}={}){
 const w=480,h=235,left=45,right=18,top=30,bottom=38,pw=w-left-right,ph=h-top-bottom;
 const max=Math.max(...values,0),min=Math.min(...values,0);
 let upper=max>0?max*1.18:1,lower=min<0?min*1.2:0;
 const y=v=>top+(upper-v)/(upper-lower)*ph,zero=y(0);let content='<title>'+labels.map((x,i)=>x+': '+fmt(values[i])+(percent?'%':'억원')).join(', ')+'</title>';
 for(let i=0;i<5;i++){const v=lower+(upper-lower)*i/4,yy=y(v);content+=`<line x1="${left}" x2="${w-right}" y1="${yy}" y2="${yy}" stroke="${colors.grid}"/>`+text(left-9,yy+3,fmt(v,percent?1:0),'text-anchor="end"');}
 const step=pw/labels.length,bw=Math.min(60,step*.42);
 labels.forEach((l,i)=>{const x=left+step*(i+.5),v=values[i],yy=y(v),c=v<0?colors.coral:(selected<0||i===selected?color:colors.muted);content+=`<g class="chart-item" tabindex="0" aria-label="${l}: ${fmt(v)}${percent?'%':'억원'}"><title>${l}: ${fmt(v)}${percent?'%':'억원'}</title><rect x="${x-bw/2}" y="${Math.min(yy,zero)}" width="${bw}" height="${Math.max(Math.abs(zero-yy),1)}" rx="3" fill="${c}"/>${text(x,v>=0?yy-9:yy+16,fmt(v)+(percent?'%':''),'text-anchor="middle" style="fill:#34596a;font-size:12px"')}${text(x,h-13,l,'text-anchor="middle"')}</g>`;});
 content+=`<line x1="${left}" x2="${w-right}" y1="${zero}" y2="${zero}" stroke="#bdcdd3"/>`;
 $(target).innerHTML=svg(content,w,h);
}
function line(target,labels,values,{color=colors.coral,percent=true}={}){
 const w=480,h=235,left=42,right=22,top=32,bottom=37,pw=w-left-right,ph=h-top-bottom,max=Math.max(...values)*1.18||1;
 const y=v=>top+(max-v)/max*ph,x=i=>labels.length===1?left+pw/2:left+pw*i/(labels.length-1);let c='<title>'+labels.map((l,i)=>l+': '+fmt(values[i])+'%').join(', ')+'</title>';
 for(let i=0;i<5;i++){const v=max*i/4,yy=y(v);c+=`<line x1="${left}" x2="${w-right}" y1="${yy}" y2="${yy}" stroke="${colors.grid}"/>`+text(left-8,yy+3,fmt(v,1),'text-anchor="end"');}
 const pts=values.map((v,i)=>`${x(i)},${y(v)}`).join(' ');
 if(values.length>1)c+=`<polygon points="${x(0)},${y(0)} ${pts} ${x(values.length-1)},${y(0)}" fill="${color}" opacity=".07"/><polyline points="${pts}" stroke="${color}" fill="none" stroke-width="2.5"/>`;
 values.forEach((v,i)=>{c+=`<g tabindex="0" aria-label="${labels[i]}: ${fmt(v)}%"><title>${labels[i]}: ${fmt(v)}%</title><circle cx="${x(i)}" cy="${y(v)}" r="5" fill="white" stroke="${color}" stroke-width="2.5"/>${text(x(i),y(v)-13,fmt(v)+'%','text-anchor="middle" style="fill:#9f6754;font-size:13px"')}${text(x(i),h-13,labels[i],'text-anchor="middle"')}</g>`;});$(target).innerHTML=svg(c,w,h);
}
function makeTable(headers,rows,highlight=-1){return `<table><thead><tr>${headers.map((x,i)=>`<th scope="col" class="${i===highlight?'selected-col':''}">${x}</th>`).join('')}</tr></thead><tbody>${rows.map(row=>`<tr>${row.map((v,i)=>i===0?`<td>${v}</td>`:`<td class="${i===highlight?'selected-col':''}">${v}</td>`).join('')}</tr>`).join('')}</tbody></table>`;}
function kpi(name,value,unit,delta,detail,period){const type=delta===null?'neutral':delta>=0?'up':'down';return `<article class="kpi"><div class="kpi-name">${name}<span>${period}</span></div><div class="kpi-value">${fmt(value)}<small>${unit}</small></div><div class="delta ${type}">${delta===null?'비교기간 자료 없음':signed(delta)+(unit==='%'?'%p':'%')+' · '+(mode==='annual'?'전년 대비':'전년 동기 대비')}</div><div class="kpi-detail">${detail}</div></article>`;}
function selectedRows(){const p=$('period').value;return DATA.filter(r=>(mode==='annual'?!r.period.includes('H1'):r.period.includes('H1'))&&r.period<=p);}
function renderOverview(){
 const current=get($('period').value),year=Number(current.period.slice(0,4)),previous=get(String(year-1)+(mode==='half'?'H1':''));const rows=selectedRows();
 const margin=ratio(current.operating_profit,current.revenue),gp=ratio(current.gross_profit,current.revenue);
 $('comparison').textContent=`연결 기준 · ${mode==='annual'?'1–12월 결산':'1–6월 누적'} · ${previous?label(previous)+' 대비':'전기 자료 미확보'}`;
 $('kpis').innerHTML=kpi('매출액',current.revenue/1e8,'억원',previous?growth(current.revenue,previous.revenue):null,'수익(매출액) · 원 단위 공시',label(current))+kpi('영업이익',current.operating_profit/1e8,'억원',previous?growth(current.operating_profit,previous.operating_profit):null,'매출총이익 − 판매비와관리비',label(current))+kpi('영업이익률',margin,'%',previous?margin-ratio(previous.operating_profit,previous.revenue):null,'분모: 동일 기간 매출액',label(current))+kpi('매출총이익률',gp,'%',previous?gp-ratio(previous.gross_profit,previous.revenue):null,'분모: 동일 기간 매출액',label(current));
 $('revenue-subtitle').textContent=mode==='annual'?'2023년부터 선택 연도까지 · 연결 기준':'2025년부터 선택 반기까지 · 1–6월 누적';
 bars('revenue-chart',rows.map(label),rows.map(x=>x.revenue/1e8),{selected:rows.length-1});line('margin-chart',rows.map(label),rows.map(x=>ratio(x.operating_profit,x.revenue)));
 let finding='';
 if(!previous)finding=`${label(current)} 매출은 ${fmt(current.revenue/1e8)}억원, 영업이익률은 ${fmt(margin)}%입니다. 비교기간이 없어 증감률을 계산하지 않습니다.`;
 else finding=`${label(current)} 매출은 ${signed(growth(current.revenue,previous.revenue))}% 변했고, 영업이익은 ${signed(growth(current.operating_profit,previous.operating_profit))}% 변했습니다. <strong>영업이익률은 ${fmt(ratio(previous.operating_profit,previous.revenue))}%에서 ${fmt(margin)}%로 ${signed(margin-ratio(previous.operating_profit,previous.revenue))}%p 변화</strong>했습니다.`;
 $('finding').innerHTML=`<span class="label">핵심 관찰</span><p>${finding}</p>`;
 const metrics=[['매출액','revenue'],['매출원가','cost'],['매출총이익','gross_profit'],['판매비와관리비','sga'],['영업이익','operating_profit']];
 const tableRows=metrics.map(([l,k])=>[l,...rows.map(r=>fmt(r[k]/1e8))]);tableRows.push(['영업이익률 (%)',...rows.map(r=>fmt(ratio(r.operating_profit,r.revenue))+'%')]);
 $('financial-table').innerHTML=makeTable(['지표',...rows.map(label)],tableRows,rows.length);
 $('table-description').textContent=`${mode==='annual'?'연간 실적':'상반기 누적 실적'} · ${rows.length}개 기간 · 금액 단위: 억원`;
 $('overview-source').textContent=`출처 ${mode==='annual'?'[1] 2025년 사업보고서, 연결 포괄손익계산서 발췌 1쪽.':'[2] 2026년 반기보고서, 연결 포괄손익계산서 인쇄 35–36쪽 (PDF 39–40쪽), 누적 열.'} 원 단위로 계산 후 소수 둘째 자리 표시. 미확보값은 0으로 채우지 않습니다.`;
}
function renderBridge(){const half=$('cost-period').value==='half',a=get(half?'2025H1':'2024'),b=get(half?'2026H1':'2025');const start=a.operating_profit/1e8,end=b.operating_profit/1e8,dg=(b.gross_profit-a.gross_profit)/1e8,ds=-(b.sga-a.sga)/1e8;
 const w=920,h=260,left=60,right=25,top=32,ph=185,max=Math.max(start,start+dg,end)*1.2,y=v=>top+(max-v)/max*ph,x=i=>left+110+i*205;let c=`<title>${label(a)} 영업이익 ${fmt(start)}억원에서 ${label(b)} ${fmt(end)}억원으로 변화</title>`;
 for(let i=0;i<5;i++){const v=max*i/4;c+=`<line x1="${left}" x2="${w-right}" y1="${y(v)}" y2="${y(v)}" stroke="${colors.grid}"/>`+text(left-10,y(v)+3,fmt(v,0),'text-anchor="end"');}
 const blocks=[[0,start,label(a),start],[start,start+dg,'매출총이익 변화',dg],[start+dg,end,'판관비 증가 영향',ds],[0,end,label(b),end]];
 blocks.forEach(([from,to,l,v],i)=>{c+=`<rect x="${x(i)-40}" y="${y(Math.max(from,to))}" width="80" height="${Math.max(1,Math.abs(y(from)-y(to)))}" fill="${i===0||i===3?colors.teal:colors.coral}" rx="2"/><title>${l}: ${fmt(v)}억원</title>`+text(x(i),y(Math.max(from,to))-10,(i===1||i===2?signed(v):fmt(v)),'text-anchor="middle" style="font-size:14px;fill:#315566"')+text(x(i),247,l,'text-anchor="middle" style="font-size:11px"');if(i<3)c+=`<line x1="${x(i)+40}" x2="${x(i+1)-40}" y1="${y(to)}" y2="${y(to)}" stroke="#adbdc5" stroke-dasharray="4 4"/>`;});
 $('waterfall').innerHTML=svg(c,w,h);$('bridge-note').innerHTML=`<p>영업이익 변화 <strong>${signed(end-start)}억원</strong> = 매출총이익 변화 ${signed(dg)}억원 − 판관비 증가 ${fmt(-ds)}억원</p>`;
 const cr=r=>ratio(r.cost,r.revenue),sr=r=>ratio(r.sga,r.revenue),op=r=>ratio(r.operating_profit,r.revenue);
 $('ratio-table').innerHTML=makeTable(['지표',label(a),label(b),'차이'],[['매출원가율',fmt(cr(a)),fmt(cr(b)),signed(cr(b)-cr(a))+'%p'],['판관비율',fmt(sr(a)),fmt(sr(b)),signed(sr(b)-sr(a))+'%p'],['영업이익률',fmt(op(a)),fmt(op(b)),signed(op(b)-op(a))+'%p']]);
 $('cost-reading').innerHTML=`<div class="reading"><span class="label">확인된 사실</span><p>${half?'상반기에는 판관비율이 낮아졌지만, 매출총이익률 하락 폭이 더 커 영업이익률이 하락했습니다.':'매출원가율과 판관비율이 모두 상승해 영업이익률이 낮아졌습니다.'}</p></div><div class="reading"><span class="label">원인 가설 · 확인필요</span><p>운임 반영 시차, 사업 구성, 일회성 비용 등이 관련됐을 수 있습니다. 계약 조건과 비용 세부내역을 추가 확인해야 합니다.</p></div>`;
}
function horizontal(target,items,max){$(target).innerHTML=items.map(([label,value])=>`<div class="hbar-row"><span>${label}</span><div class="hbar-track"><div class="hbar-fill" style="width:${Math.abs(value)/max*100}%;${value<0?'background:#c7826b':''}"></div></div><span class="hbar-value">${signed(value)} <small>억</small></span></div>`).join('');}
function staticPanels(){
 horizontal('sgna-bars',[['대손상각비',114.92],['급여',81.46],['감가상각비',22.17],['복리후생비',8.31],['퇴직급여',4.80]],125);
 bars('credit-chart',['2024.12','2025.12','2026.06'],[1.62,10.05,8.63],{color:colors.coral,percent:true});
 $('credit-table').innerHTML=makeTable(['기말','총매출채권','손실충당금','비율'],[['2024.12','1,428.70','23.13','1.62%'],['2025.12','1,466.80','147.39','10.05%'],['2026.06','1,973.78','170.34','8.63%']]);
 const c25=21387125508/1e8,c26=-29753848734/1e8;
 $('cash-kpis').innerHTML=`<article class="kpi"><div class="kpi-name">2025 상반기 영업현금흐름</div><div class="kpi-value">+${fmt(c25)}<small>억원</small></div><span class="delta up">영업활동 현금 유입</span></article><article class="kpi"><div class="kpi-name">2026 상반기 영업현금흐름</div><div class="kpi-value">${signed(c26)}<small>억원</small></div><span class="delta down">영업활동 현금 유출</span></article><article class="kpi"><div class="kpi-name">전년 동기 대비 변화</div><div class="kpi-value">${signed(c26-c25)}<small>억원</small></div><span class="delta down">금액 변화 · 유입에서 유출로 전환</span></article>`;
 bars('cash-chart',['25H1 이익','25H1 현금','26H1 이익','26H1 현금'],[get('2025H1').operating_profit/1e8,c25,get('2026H1').operating_profit/1e8,c26]);
 line('leverage-chart',['2024.12','2025.12','2026.06'],[ratio(280791177854,254411368031),ratio(306987513537,255206681780),ratio(394257762429,259476694258)],{color:colors.teal});
 horizontal('working-capital',[['매출채권',-410.14],['계약자산',-286.10],['매입채무',202.22],['계약부채',188.56]],430);
 $('definitions').innerHTML=makeTable(['지표','산식 / 해석'],[['매출 증가율','(당기 매출 ÷ 비교기간 매출 − 1) × 100'],['영업이익률','같은 기간 영업이익 ÷ 매출액 × 100'],['판관비율','같은 기간 판매비와관리비 ÷ 매출액 × 100'],['이익률 차이','두 비율의 차이. %가 아닌 %p로 표시'],['연간·반기','연간은 연간끼리, 반기는 전년 동기끼리 비교'],['단위·결측','원 단위 계산 후 억원 표시. 미확보값은 0으로 대체하지 않음']]);
}
function checks(){const a=get('2024'),b=get('2025'),h1=get('2025H1'),h2=get('2026H1');const tests=[['2025년 매출 증가율',growth(b.revenue,a.revenue),7.04,'%'],['2025년 영업이익률',ratio(b.operating_profit,b.revenue),.20,'%'],['2026 상반기 영업이익 증감률',growth(h2.operating_profit,h1.operating_profit),-55.31,'%'],['대손상각비 증가 기여율 · 작성안 검증값',11492156/((b.sga-a.sga)/1000)*100,46.69,'%'],['2025년 매출채권 충당금 비율 · 작성안 검증값',14738735/146679560*100,10.05,'%']];let ok=true;
 $('checks').innerHTML=tests.map(([name,actual,expected,unit])=>{const pass=Number(actual.toFixed(2))===expected;ok=ok&&pass;return `<div class="check-row"><span>${name}</span><b>${fmt(actual)}${unit}</b><span class="status ${pass?'':'amber'}">${pass?'계산 일치':'불일치'}</span></div>`;}).join('');
 const equations=DATA.every(r=>r.revenue-r.cost===r.gross_profit&&r.gross_profit-r.sga===r.operating_profit);ok=ok&&equations;
 $('checks').innerHTML+=`<div class="check-row"><span>5개 기간 회계등식 검증</span><span class="status ${equations?'':'amber'}">${equations?'모두 일치':'불일치'}</span></div><p class="check-time">${ok?'검산 완료':'검산 불일치'} · 이 브라우저에서 재계산 · ${new Date().toLocaleTimeString('ko-KR')}</p>`;return ok;
}
function navigate(tab){if(!['overview','cost','credit','cash','sources'].includes(tab))tab='overview';document.querySelectorAll('.panel').forEach(p=>{p.hidden=p.id!==tab;p.classList.toggle('active',p.id===tab);});document.querySelectorAll('[data-tab]').forEach(b=>{b.classList.toggle('active',b.dataset.tab===tab);b.setAttribute('aria-current',b.dataset.tab===tab?'page':'false');});history.replaceState(null,'','#'+tab);window.scrollTo({top:0,behavior:'instant'});}
function setMode(m){mode=m;document.querySelectorAll('[data-mode]').forEach(b=>{b.classList.toggle('selected',b.dataset.mode===m);b.setAttribute('aria-pressed',String(b.dataset.mode===m));});$('period').innerHTML=(m==='annual'?['2025','2024','2023']:['2026H1','2025H1']).map(p=>`<option value="${p}">${label(get(p))}</option>`).join('');renderOverview();}
function downloadCurrent(){const rows=selectedRows();const csv='\ufeffperiod,revenue_krw,cost_krw,gross_profit_krw,sga_krw,operating_profit_krw,operating_margin_percent,scope\n'+rows.map(r=>[r.period,r.revenue,r.cost,r.gross_profit,r.sga,r.operating_profit,ratio(r.operating_profit,r.revenue),'consolidated'].join(',')).join('\n');const url=URL.createObjectURL(new Blob([csv],{type:'text/csv;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download='taewoong_'+mode+'_'+$('period').value+'.csv';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
document.querySelectorAll('[data-tab]').forEach(b=>b.addEventListener('click',()=>navigate(b.dataset.tab)));document.querySelectorAll('[data-go]').forEach(b=>b.addEventListener('click',()=>navigate(b.dataset.go)));document.querySelectorAll('[data-mode]').forEach(b=>b.addEventListener('click',()=>setMode(b.dataset.mode)));$('period').addEventListener('change',renderOverview);$('cost-period').addEventListener('change',renderBridge);$('reset').addEventListener('click',()=>setMode('annual'));$('download-csv').addEventListener('click',downloadCurrent);$('run-checks').addEventListener('click',checks);window.addEventListener('hashchange',()=>navigate(location.hash.slice(1)));
renderOverview();renderBridge();staticPanels();checks();navigate(location.hash.slice(1)||'overview');
