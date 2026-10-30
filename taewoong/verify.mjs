import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const c={window:{}};vm.runInNewContext(fs.readFileSync('dist/data.js','utf8'),c);
const rows=c.window.FINANCIALS;
assert.equal(rows.length,5);assert.equal(new Set(rows.map(r=>r.period)).size,5);
for(const r of rows){assert.equal(r.revenue-r.cost,r.gross_profit);assert.equal(r.gross_profit-r.sga,r.operating_profit);assert.equal(r.scope,'consolidated');assert.equal(r.unit,'KRW');}
const [a,b,h,j]=['2024','2025','2025H1','2026H1'].map(p=>rows.find(r=>r.period===p));
const round=n=>+n.toFixed(2);
assert.equal(round((b.revenue/a.revenue-1)*100),7.04);
assert.equal(round(b.operating_profit/b.revenue*100),0.20);
assert.equal(round((j.operating_profit/h.operating_profit-1)*100),-55.31);
for(const [x,y] of [[a,b],[h,j]])assert.equal(y.operating_profit-x.operating_profit,(y.gross_profit-x.gross_profit)-(y.sga-x.sga));
const html=fs.readFileSync('dist/index.html','utf8');
for(const m of html.matchAll(/(?:src|href)="([^"#]+)"/g)){if(!m[1].startsWith('http'))assert.ok(fs.existsSync('dist/'+m[1]),m[1]);}
console.log('PASS: 5 periods, accounting identities, growth/margins, profit bridges, local asset links');
