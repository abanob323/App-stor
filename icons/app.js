'use strict';
const $=s=>document.querySelector(s),K='elbob_';
const load=(k,d)=>{try{const v=JSON.parse(localStorage.getItem(K+k));return v==null?d:v}catch(e){return d}};
const save=(k,v)=>localStorage.setItem(K+k,JSON.stringify(v));
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const uid=()=>Date.now()+Math.floor(Math.random()*999);
const S={
 st:load('st',{name:'صيانة سماعات El BOB',phone:'01023052470',wa:'201023052470',fb:'https://www.facebook.com/share/1JKPzbseuX/',map:'https://maps.app.goo.gl/pCmHzbxcLQMKkxiN9',pin:'1234',cur:'ج.م',ship:30,slots:'10:00,12:00,14:00,16:00,18:00',hours:'10 ص - 10 م'}),
 cats:load('cats',[{id:1,name:'سماعات',icon:'🎧'},{id:2,name:'جرابات',icon:'📱'},{id:3,name:'شواحن وكابلات',icon:'🔌'},{id:4,name:'باور بانك',icon:'🔋'},{id:5,name:'حماية شاشة',icon:'🛡️'},{id:6,name:'حوامل',icon:'📍'}]),
 prods:load('prods',[
  {id:1,name:'سماعة بلوتوث لاسلكية',cat:1,brand:'JBL',cost:350,price:550,disc:480,stock:12,min:3,desc:'صوت نقي وبطارية تدوم 20 ساعة',img:'',em:'🎧',on:1,sold:0},
  {id:2,name:'شاحن سريع 25 وات',cat:3,brand:'Samsung',cost:150,price:250,disc:0,stock:20,min:5,desc:'شحن سريع مع كابل Type-C',img:'',em:'🔌',on:1,sold:0},
  {id:3,name:'جراب سيليكون',cat:2,brand:'عام',cost:30,price:80,disc:0,stock:2,min:5,desc:'حماية كاملة بألوان متعددة',img:'',em:'📱',on:1,sold:0},
  {id:4,name:'باور بانك 10000',cat:4,brand:'Anker',cost:400,price:650,disc:590,stock:8,min:3,desc:'شاحن متنقل بمنفذين',img:'',em:'🔋',on:1,sold:0}]),
 users:load('users',[]),me:load('me',null),exp:load('exp',[]),orders:load('orders',[]),books:load('books',[]),cart:load('cart',[]),notes:load('notes',[]),revs:load('revs',[]),admin:false,q:'',cat:0,
};
const persist=()=>['st','cats','prods','orders','books','cart','notes','revs','users','me','exp'].forEach(k=>save(k,S[k]));
const $m=n=>Number(n||0).toLocaleString('ar-EG')+' '+S.st.cur;
const eff=p=>p.disc>0?p.disc:p.price;
const toast=m=>{const t=$('#toast');t.textContent=m;t.classList.add('on');setTimeout(()=>t.classList.remove('on'),2200)};
const prod=id=>S.prods.find(p=>p.id==id);
const catName=id=>(S.cats.find(c=>c.id==id)||{}).name||'أخرى';
const today=()=>new Date().toISOString().slice(0,10);
const OS=['جديد','قيد التجهيز','تم الشحن','تم التسليم','ملغي','مرتجع'];
const BS=['تم الاستلام','قيد الفحص','بانتظار موافقة العميل','قيد الإصلاح','جاهز للاستلام','تم التسليم','ملغي'];
const wa=t=>`https://wa.me/${S.st.wa}?text=${encodeURIComponent(t)}`;
const note=(t,b)=>{S.notes.unshift({t,b,d:new Date().toLocaleString('ar-EG'),r:0});persist()};
const stars=n=>'★'.repeat(Math.round(n))+'☆'.repeat(5-Math.round(n));
const avg=()=>S.revs.length?S.revs.reduce((a,r)=>a+r.s,0)/S.revs.length:0;
function img(p){return p.img?`<img src="${p.img}" alt="${esc(p.name)}" loading="lazy">`:esc(p.em||'🛍️')}
function card(p){return `<div class="pc"><div class="im">${img(p)}</div><div class="bd"><h3>${esc(p.name)}</h3><span class="mut">${esc(p.brand)}</span>
<div class="pr">${$m(eff(p))}${p.disc>0?`<span class="old">${$m(p.price)}</span>`:''}</div>
${p.stock>0?`<button onclick="add(${p.id})">أضف للسلة 🛒</button>`:'<span class="low">نفد المخزون</span>'}</div></div>`}
function contact(){const s=S.st;return `<div class="row"><a class="btn g" href="${wa('مرحبا')}" target="_blank" rel="noopener">واتساب</a><a class="btn" href="${esc(s.fb)}" target="_blank" rel="noopener">فيسبوك</a><a class="btn l" href="${esc(s.map)}" target="_blank" rel="noopener">📍 الموقع</a><a class="btn l" href="tel:${esc(s.phone)}">اتصال</a></div>`}
// ---------- customer views ----------
const V={};
V.home=()=>{const best=[...S.prods].filter(p=>p.on).sort((a,b)=>b.sold-a.sold).slice(0,4);
 return `<div class="hero"><h2 style="margin:0">أهلاً بك في ${esc(S.st.name)}</h2><p>اكسسوارات الهواتف وحجز الصيانة · ${esc(S.st.hours)}</p><br>${contact()}</div>
<div class="chips">${S.cats.map(c=>`<button onclick="S.cat=${c.id};go('products')">${esc(c.icon)} ${esc(c.name)}</button>`).join('')}</div>
<h2>الأكثر مبيعاً / وصل حديثاً</h2><div class="grid">${best.map(card).join('')}</div>
<h2>تقييمات العملاء ${S.revs.length?`<span class="star">${stars(avg())}</span>`:''}</h2>
${S.revs.slice(0,5).map(r=>`<div class="card"><b>${esc(r.n)}</b> <span class="star">${stars(r.s)}</span><p>${esc(r.t)}</p></div>`).join('')||'<p class="mut">كن أول من يقيّم</p>'}
<div class="card"><h3>أضف تقييمك</h3><label>الاسم</label><input id="rn"><label>التقييم</label><select id="rs"><option>5</option><option>4</option><option>3</option><option>2</option><option>1</option></select><label>رأيك</label><textarea id="rt"></textarea><button class="w" onclick="addRev()">إرسال</button></div>`};
V.products=()=>{const l=S.prods.filter(p=>p.on&&(!S.cat||p.cat==S.cat)&&(p.name+p.brand).toLowerCase().includes(S.q.toLowerCase()));
 return `<input id="q" type="search" placeholder="ابحث عن منتج..." value="${esc(S.q)}" oninput="S.q=this.value;list()"><div class="chips"><button class="${!S.cat?'on':''}" onclick="S.cat=0;render()">الكل</button>${S.cats.map(c=>`<button class="${S.cat==c.id?'on':''}" onclick="S.cat=${c.id};render()">${esc(c.name)}</button>`).join('')}</div><div id="pl" class="grid">${l.map(card).join('')||'<p class="mut">لا توجد نتائج</p>'}</div>`};
window.list=()=>{const l=S.prods.filter(p=>p.on&&(!S.cat||p.cat==S.cat)&&(p.name+p.brand).toLowerCase().includes(S.q.toLowerCase()));$('#pl').innerHTML=l.map(card).join('')||'<p class="mut">لا توجد نتائج</p>'};
V.cart=()=>{if(!S.cart.length)return '<h2>السلة</h2><p class="mut">السلة فارغة</p>';
 const sub=S.cart.reduce((a,i)=>a+eff(prod(i.id))*i.q,0);
 return `<h2>السلة</h2>${S.cart.map(i=>{const p=prod(i.id);return `<div class="card row"><div><b>${esc(p.name)}</b><br><span class="mut">${$m(eff(p))}</span></div><div class="row"><button class="l btn" onclick="qty(${i.id},-1)">−</button><b>${i.q}</b><button class="l btn" onclick="qty(${i.id},1)">+</button></div></div>`}).join('')}
<div class="card"><div class="row"><span>المجموع</span><b>${$m(sub)}</b></div><div class="row"><span>الشحن (للتوصيل)</span><b>${$m(S.st.ship)}</b></div></div>
<div class="card"><h3>إتمام الطلب (الدفع عند الاستلام)</h3><label>الاسم *</label><input id="on"><label>الهاتف *</label><input id="op" type="tel"><label>الاستلام</label><select id="om"><option value="d">توصيل للعنوان</option><option value="p">استلام من الفرع</option></select><label>العنوان</label><textarea id="oa"></textarea><button class="g w" onclick="order()">تأكيد الطلب</button></div>`};
V.repair=()=>`<h2>🔧 حجز صيانة</h2><div class="card"><label>الاسم *</label><input id="bn"><label>الهاتف *</label><input id="bp" type="tel"><label>الجهاز والماركة والموديل *</label><input id="bd" placeholder="مثال: سماعة JBL / موبايل Samsung A54">
<label>نوع العطل</label><select id="bi">${['شاشة','بطارية','شحن','برمجة','ماء','كاميرا','سماعة / صوت','أخرى'].map(x=>`<option>${x}</option>`).join('')}</select><label>وصف العطل</label><textarea id="bx"></textarea>
<label>اليوم *</label><input id="bt" type="date" min="${today()}"><label>الموعد</label><select id="bs">${S.st.slots.split(',').map(x=>`<option>${esc(x.trim())}</option>`).join('')}</select>
<label>الخدمة</label><select id="bv"><option>زيارة الفرع</option><option>استلام الجهاز من العميل</option></select><button class="g w" onclick="book()">تأكيد الحجز</button></div>`;
V.me=()=>{const mine=S.orders.slice(0,10),mb=S.books.slice(0,10);
 return `<h2>حسابي</h2><div class="card"><h3>تواصل معنا</h3><br>${contact()}</div><div id="inst"></div>
<h2>🔔 الإشعارات</h2>${S.notes.slice(0,6).map(n=>`<div class="card"><b>${esc(n.t)}</b><p>${esc(n.b)}</p><span class="mut">${esc(n.d)}</span></div>`).join('')||'<p class="mut">لا توجد إشعارات</p>'}
<h2>طلباتي</h2>${mine.map(o=>`<div class="card row"><span>#${o.no} · ${$m(o.total)}</span><span class="tag">${esc(o.status)}</span></div>`).join('')||'<p class="mut">لا توجد طلبات</p>'}
<h2>حجوزاتي</h2>${mb.map(b=>`<div class="card row"><span>#${b.no} · ${esc(b.date)} ${esc(b.slot)}</span><span class="tag">${esc(b.status)}</span></div>`).join('')||'<p class="mut">لا توجد حجوزات</p>'}
<p class="mut" style="margin-top:16px"><a href="#/privacy">سياسة الخصوصية</a></p>`};
V.privacy=()=>`<h2>الخصوصية والشروط</h2><div class="card"><p>نستخدم بياناتك (الاسم والهاتف والعنوان) فقط لتنفيذ طلبك أو حجزك والتواصل معك. لا نشارك بياناتك مع أي طرف آخر. الاسترجاع حسب سياسة المتجر، وللاستفسار تواصل معنا عبر واتساب.</p></div>`;
// ---------- customer actions ----------
window.add=id=>{const i=S.cart.find(x=>x.id==id);if(i)i.q++;else S.cart.push({id,q:1});persist();nav();toast('تمت الإضافة للسلة')};
window.qty=(id,d)=>{const i=S.cart.find(x=>x.id==id);i.q+=d;if(i.q<1)S.cart=S.cart.filter(x=>x.id!=id);persist();render()};
window.addRev=()=>{const n=$('#rn').value.trim(),t=$('#rt').value.trim();if(!n||!t)return toast('اكتب الاسم والرأي');S.revs.unshift({n,t,s:+$('#rs').value});persist();toast('شكراً لتقييمك');render()};
window.order=()=>{const n=$('#on').value.trim(),p=$('#op').value.trim();if(!n||!p)return toast('الاسم والهاتف مطلوبان');
 const del=$('#om').value=='d',ad=$('#oa').value.trim();if(del&&!ad)return toast('أدخل العنوان');
 const items=S.cart.map(i=>{const x=prod(i.id);return{id:x.id,name:x.name,q:i.q,cost:x.cost,sale:eff(x)}});
 const sub=items.reduce((a,i)=>a+i.sale*i.q,0),o={id:uid(),no:S.orders.length+1001,name:n,phone:p,addr:del?ad:'استلام من الفرع',items,ship:del?+S.st.ship:0,total:sub+(del?+S.st.ship:0),status:'جديد',date:new Date().toISOString(),note:''};
 items.forEach(i=>{const x=prod(i.id);x.stock=Math.max(0,x.stock-i.q);x.sold+=i.q});
 S.orders.unshift(o);S.cart=[];persist();nav();
 window.open(wa(`طلب جديد #${o.no}\nالاسم: ${n}\nالهاتف: ${p}\n${items.map(i=>`- ${i.name} × ${i.q}`).join('\n')}\nالإجمالي: ${o.total} ${S.st.cur}\nالعنوان: ${o.addr}`),'_blank');
 toast('تم تسجيل طلبك رقم '+o.no);go('me')};
window.book=()=>{const g=i=>$('#'+i).value.trim(),n=g('bn'),p=g('bp'),d=g('bd'),t=g('bt');if(!n||!p||!d||!t)return toast('أكمل الحقول المطلوبة');
 const b={id:uid(),no:S.books.length+501,name:n,phone:p,device:d,issue:g('bi'),desc:g('bx'),date:t,slot:g('bs'),svc:g('bv'),status:'تم الاستلام',price:0,parts:0};
 S.books.unshift(b);persist();window.open(wa(`حجز صيانة #${b.no}\nالاسم: ${n}\nالهاتف: ${p}\nالجهاز: ${d}\nالعطل: ${b.issue} ${b.desc}\nالموعد: ${t} ${b.slot}\nالخدمة: ${b.svc}`),'_blank');toast('تم الحجز رقم '+b.no);go('me')};
// ---------- admin ----------
const A={};
A.login=()=>`<h2>دخول المالك</h2><div class="card"><div class="warn">النسخة التجريبية: الرمز الافتراضي 1234 ويُحفظ على هذا الجهاز فقط.</div><label>الرمز السري</label><input id="pin" type="password" inputmode="numeric"><button class="w" onclick="if($('#pin').value==S.st.pin){S.admin=true;go('admin')}else toast('رمز خاطئ')">دخول</button></div>`;
A.dash=()=>{const ok=S.orders.filter(o=>!['ملغي','مرتجع'].includes(o.status)),td=ok.filter(o=>o.date.slice(0,10)==today());
 const profit=ok.reduce((a,o)=>a+o.items.reduce((s,i)=>s+(i.sale-i.cost)*i.q,0),0),rep=S.books.filter(b=>b.status=='تم التسليم').reduce((a,b)=>a+(+b.price-+b.parts),0),low=S.prods.filter(p=>p.stock<=p.min);
 return `${at()}<div class="stats"><div class="stat"><b>${$m(td.reduce((a,o)=>a+o.total,0))}</b>مبيعات اليوم</div><div class="stat"><b>${S.orders.filter(o=>o.status=='جديد').length}</b>طلبات جديدة</div><div class="stat"><b>${S.books.filter(b=>b.date==today()).length}</b>حجوزات اليوم</div><div class="stat"><b>${$m(ok.reduce((a,o)=>a+o.total,0))}</b>إجمالي المبيعات</div><div class="stat"><b>${$m(profit)}</b>ربح المنتجات</div><div class="stat"><b>${$m(rep)}</b>ربح الصيانة</div></div>
<h2>منتجات قاربت على النفاد</h2>${low.map(p=>`<div class="card row"><span>${esc(p.name)}</span><span class="low">${p.stock} متبقي</span></div>`).join('')||'<p class="mut">لا يوجد</p>'}
<h2>الأكثر مبيعاً</h2>${[...S.prods].sort((a,b)=>b.sold-a.sold).slice(0,5).map(p=>`<div class="card row"><span>${esc(p.name)}</span><b>${p.sold}</b></div>`).join('')}`};
function at(){const t=[['dash','الرئيسية'],['prods','المنتجات'],['orders','الطلبات'],['books','الصيانة'],['set','الإعدادات']];const c=(H.split('/')[1]||'dash');
 return `<div class="chips">${t.map(x=>`<button class="${c==x[0]?'on':''}" onclick="go('admin/${x[0]}')">${x[1]}</button>`).join('')}</div>`}
A.prods=()=>`${at()}<button class="w g" onclick="go('admin/edit/0')">+ إضافة منتج</button><br><br>${S.prods.map(p=>`<div class="card row"><span>${esc(p.em)} ${esc(p.name)}<br><span class="mut">${$m(eff(p))} · مخزون ${p.stock} ${p.on?'':'· مخفي'}</span></span><button class="l btn" onclick="go('admin/edit/${p.id}')">تعديل</button></div>`).join('')}`;
A.edit=id=>{const p=prod(id)||{name:'',cat:S.cats[0]?.id,brand:'',cost:0,price:0,disc:0,stock:0,min:3,desc:'',img:'',em:'🛍️',on:1};
 const f=(i,l,v,t='text')=>`<label>${l}</label><input id="${i}" type="${t}" value="${esc(v)}">`;
 return `<h2>${id?'تعديل':'إضافة'} منتج</h2><div class="card">${f('pn','الاسم',p.name)}<label>الوصف</label><textarea id="pd">${esc(p.desc)}</textarea>
<label>التصنيف</label><select id="pc">${S.cats.map(c=>`<option value="${c.id}" ${c.id==p.cat?'selected':''}>${esc(c.name)}</option>`).join('')}</select>${f('pb','الماركة',p.brand)}${f('pe','أيقونة (إيموجي)',p.em)}
${f('pco','سعر الشراء',p.cost,'number')}${f('pp','سعر البيع',p.price,'number')}${f('pdi','سعر الخصم (0 = بدون)',p.disc,'number')}${f('ps','الكمية',p.stock,'number')}${f('pm','حد التنبيه',p.min,'number')}
<label>صورة من المعرض</label><input type="file" accept="image/*" onchange="pick(this)"><div id="pv">${p.img?`<img src="${p.img}" width="80">`:''}</div>
<label><input type="checkbox" id="pa" ${p.on?'checked':''} style="width:auto;min-height:0"> ظاهر للعملاء</label><br><div class="row"><button class="g" onclick="saveP(${id})">حفظ</button>${id?`<button class="r" onclick="delP(${id})">حذف</button>`:''}<button class="l btn" onclick="go('admin/prods')">رجوع</button></div></div>`};
let IMG='';
window.pick=el=>{const f=el.files[0];if(!f)return;const r=new FileReader();r.onload=()=>{const i=new Image();i.onload=()=>{const c=document.createElement('canvas'),k=Math.min(1,500/i.width);c.width=i.width*k;c.height=i.height*k;c.getContext('2d').drawImage(i,0,0,c.width,c.height);IMG=c.toDataURL('image/jpeg',.75);$('#pv').innerHTML=`<img src="${IMG}" width="80">`};i.src=r.result};r.readAsDataURL(f)};
window.saveP=id=>{const g=i=>$('#'+i).value,n=g('pn').trim();if(!n)return toast('الاسم مطلوب');
 const d={name:n,desc:g('pd'),cat:+g('pc'),brand:g('pb'),em:g('pe'),cost:+g('pco'),price:+g('pp'),disc:+g('pdi'),stock:+g('ps'),min:+g('pm'),on:$('#pa').checked?1:0};
 if(id){const p=prod(id);Object.assign(p,d);if(IMG)p.img=IMG}else S.prods.unshift({id:uid(),img:IMG,sold:0,...d});IMG='';persist();toast('تم الحفظ');go('admin/prods')};
window.delP=id=>{if(confirm('حذف المنتج؟')){S.prods=S.prods.filter(p=>p.id!=id);persist();go('admin/prods')}};
A.orders=()=>`${at()}${S.orders.map(o=>`<div class="card"><div class="row"><b>#${o.no} · ${esc(o.name)}</b><b>${$m(o.total)}</b></div><p class="mut">${esc(o.phone)} · ${esc(o.addr)}<br>${o.items.map(i=>esc(i.name)+'×'+i.q).join('، ')}</p>
<select onchange="setO(${o.id},this.value)">${OS.map(s=>`<option ${s==o.status?'selected':''}>${s}</option>`).join('')}</select><a class="btn l" href="tel:${esc(o.phone)}">اتصال</a> <button class="l btn" onclick="window.print()">🖨️ فاتورة</button></div>`).join('')||'<p class="mut">لا توجد طلبات</p>'}`;
window.setO=(id,s)=>{const o=S.orders.find(x=>x.id==id);if((s=='ملغي'||s=='مرتجع')&&!['ملغي','مرتجع'].includes(o.status))o.items.forEach(i=>{const p=prod(i.id);if(p){p.stock+=i.q;p.sold-=i.q}});o.status=s;note('تحديث طلبك #'+o.no,'حالة الطلب الآن: '+s);persist();toast('تم التحديث')};
A.books=()=>`${at()}${S.books.map(b=>`<div class="card"><div class="row"><b>#${b.no} · ${esc(b.name)}</b><span class="tag">${esc(b.date)} ${esc(b.slot)}</span></div><p class="mut">${esc(b.phone)} · ${esc(b.device)}<br>${esc(b.issue)} ${esc(b.desc)} · ${esc(b.svc)}</p>
<select onchange="setB(${b.id},'status',this.value)">${BS.map(s=>`<option ${s==b.status?'selected':''}>${s}</option>`).join('')}</select><label>سعر الإصلاح</label><input type="number" value="${b.price}" onchange="setB(${b.id},'price',+this.value)"><label>تكلفة القطع</label><input type="number" value="${b.parts}" onchange="setB(${b.id},'parts',+this.value)"></div>`).join('')||'<p class="mut">لا توجد حجوزات</p>'}`;
window.setB=(id,k,v)=>{const b=S.books.find(x=>x.id==id);b[k]=v;if(k=='status')note('تحديث حجز الصيانة #'+b.no,'الحالة الآن: '+v);persist();toast('تم الحفظ')};
A.set=()=>{const s=S.st,f=(k,l,t='text')=>`<label>${l}</label><input id="s_${k}" type="${t}" value="${esc(s[k])}">`;
 return `${at()}<div class="card"><h3>بيانات المتجر</h3>${f('name','الاسم')}${f('phone','الهاتف')}${f('wa','واتساب (بصيغة دولية 20...)')}${f('fb','رابط فيسبوك')}${f('map','رابط الموقع')}${f('hours','ساعات العمل')}${f('ship','سعر الشحن','number')}${f('cur','العملة')}${f('slots','مواعيد الصيانة (مفصولة بفاصلة)')}${f('pin','الرمز السري للوحة')}<button class="w" onclick="saveS()">حفظ</button></div>
<div class="card"><h3>التصنيفات</h3>${S.cats.map(c=>`<div class="row"><span>${esc(c.icon)} ${esc(c.name)}</span><button class="r btn" onclick="delC(${c.id})">حذف</button></div>`).join('')}<label>تصنيف جديد</label><input id="cn" placeholder="الاسم"><input id="ci" placeholder="أيقونة إيموجي"><button class="g w" onclick="addC()">إضافة</button></div>
<div class="card"><h3>إشعار للعملاء</h3><input id="nt" placeholder="العنوان"><textarea id="nb" placeholder="النص"></textarea><button class="w" onclick="note($('#nt').value,$('#nb').value);toast('تم الإرسال')">إرسال</button><p class="mut">يظهر في مركز الإشعارات على هذا الجهاز فقط (الإشعارات الحقيقية تحتاج خادم).</p></div>
<div class="card"><h3>نسخ احتياطي</h3><button class="l btn w" onclick="bk()">تنزيل نسخة</button><br><br><input type="file" accept=".json" onchange="rs(this)"></div><button class="l btn w" onclick="S.admin=false;go('home')">خروج</button>`};
window.saveS=()=>{Object.keys(S.st).forEach(k=>{const e=$('#s_'+k);if(e)S.st[k]=e.type=='number'?+e.value:e.value});persist();toast('تم الحفظ');nav()};
window.addC=()=>{const n=$('#cn').value.trim();if(!n)return;S.cats.push({id:uid(),name:n,icon:$('#ci').value||'📦'});persist();render()};
window.delC=id=>{S.cats=S.cats.filter(c=>c.id!=id);persist();render()};
window.bk=()=>{const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([JSON.stringify(localStorage)],{type:'application/json'}));a.download='elbob-backup.json';a.click()};
window.rs=el=>{const r=new FileReader();r.onload=()=>{const d=JSON.parse(r.result);Object.keys(d).forEach(k=>localStorage.setItem(k,d[k]));location.reload()};r.readAsText(el.files[0])};
// ---------- router ----------
let H=location.search.includes('admin')?'admin':'home';window.go=h=>{H=h;render()};
function nav(){const h=H.split('/')[0],n=S.cart.reduce((a,i)=>a+i.q,0),un=S.notes.filter(x=>!x.r).length;
 if(h=='admin'){$('#nav').innerHTML='';$('#top').innerHTML=`<span>لوحة المالك</span><a href="#/home" style="color:#fff">المتجر</a>`;return}
 $('#top').innerHTML=`<span>${esc(S.st.name)}</span><span id="ib" style="display:none"><button onclick="inst()" style="background:#fff;color:#1D4ED8;min-height:34px;padding:4px 12px">تثبيت</button></span>`;
 if(window.DP)$('#ib').style.display='';
 $('#nav').innerHTML=[['home','🏠','الرئيسية'],['products','🛍️','المنتجات'],['cart','🛒','السلة',n],['repair','🔧','الصيانة'],['me','👤','حسابي',un]].map(x=>`<a href="#/${x[0]}" class="${h==x[0]?'on':''}"><b>${x[1]}</b>${x[2]}${x[3]?`<i>${x[3]}</i>`:''}</a>`).join('')}
function render(){const p=H.split('/');let html;
 if(p[0]=='admin')html=!S.admin?A.login():(A[p[1]=='edit'?'edit':p[1]||'dash']||A.dash)(p[2]);
 else html=(V[p[0]]||V.home)();
 $('#app').innerHTML=html;nav();if(p[0]=='me'){S.notes.forEach(n=>n.r=1);persist();setTimeout(nav,50);const e=$('#inst');if(e&&/iphone|ipad/i.test(navigator.userAgent)&&!navigator.standalone)e.innerHTML='<div class="warn">للتثبيت على آيفون: اضغط زر المشاركة ثم «إضافة إلى الشاشة الرئيسية».</div>'}
 scrollTo(0,0)}


// ======= v2: login, accounts, new design =======
const GR=['linear-gradient(135deg,#6366f1,#4338ca)','linear-gradient(135deg,#f472b6,#c026d3)','linear-gradient(135deg,#fbbf24,#ea580c)','linear-gradient(135deg,#34d399,#0f766e)','linear-gradient(135deg,#38bdf8,#2563eb)','linear-gradient(135deg,#a78bfa,#7e22ce)'];
const gr=id=>GR[Math.max(0,S.cats.findIndex(c=>c.id==id))%6];
const need=b=>{if(S.me)return 0;LG.back=b;go('login');toast('سجّل دخولك أولاً');return 1};
let LG={step:0,code:'',exp:0,name:'',phone:'',back:'me'};
card=function(p){const pc=p.disc>0?Math.round((p.price-p.disc)/p.price*100):0;return `<div class="pc"><div class="im" style="background:${gr(p.cat)}">${p.img?`<img src="${p.img}" alt="${esc(p.name)}" loading="lazy">`:esc(p.em)}${pc?`<span class="bdg">خصم ${pc}%</span>`:''}</div><div class="bd"><h3>${esc(p.name)}</h3><span class="mut">${esc(p.brand)}</span><div class="row"><div class="pr">${$m(eff(p))}${p.disc>0?`<br><span class="old">${$m(p.price)}</span>`:''}</div>${p.stock>0?`<button class="plus" onclick="add(${p.id})">+</button>`:'<span class="low">نفد</span>'}</div></div></div>`};
contact=function(){const s=S.st;return `<div class="row ct"><a class="btn g" href="${wa('مرحبا')}" target="_blank" rel="noopener">تواصل واتساب</a><a class="btn fb" href="${esc(s.fb)}" target="_blank" rel="noopener">صفحتنا فيسبوك</a><a class="btn l" href="${esc(s.map)}" target="_blank" rel="noopener">📍 موقعنا</a><a class="btn dk" href="tel:${esc(s.phone)}">اتصل بنا</a></div>`};
V.home=()=>{const best=[...S.prods].filter(p=>p.on).sort((a,b)=>b.sold-a.sold).slice(0,4),deals=S.prods.filter(p=>p.on&&p.disc>0).slice(0,3);
 return `<div class="hero2"><span class="tag2">صيانة سماعات وإكسسوارات الهواتف</span><h1>كل ما يحتاجه هاتفك في مكان واحد</h1><p>سماعات، شواحن، جرابات وحمايات شاشة، مع خدمة صيانة على يد فنيين متخصصين.</p><br><div class="row" style="justify-content:flex-start"><button class="wb" onclick="go('products')">تسوّق الآن ←</button><button class="dk" onclick="go('repair')">احجز صيانة 🔧</button></div></div>
<h2>تواصل مع ${esc(S.st.name)}</h2><p class="mut">${esc(S.st.hours)}</p>${contact()}
<h2>تسوّق بالتصنيف</h2><div class="chips cats">${S.cats.map(c=>`<a onclick="S.cat=${c.id};go('products')"><span style="background:${gr(c.id)}">${esc(c.icon)}</span>${esc(c.name)}</a>`).join('')}</div>
${deals.length?`<h2>عروض اليوم</h2><div class="grid">${deals.map(card).join('')}</div>`:''}<h2>الأكثر مبيعاً</h2><div class="grid">${best.map(card).join('')}</div>
<div class="banner"><h2>هاتفك تعبان؟ احجزه ونصلحه في نفس اليوم</h2><p>شاشة، بطارية، شحن، برمجة، وتابع حالة الجهاز خطوة بخطوة.</p><br><button class="wb" onclick="go('repair')">احجز موعد صيانة ←</button></div>
<h2>⭐ تقييمات العملاء ${S.revs.length?stars(avg()):''}</h2>${S.revs.slice(0,5).map(r=>`<div class="card"><b>${esc(r.n)}</b> <span class="star">${stars(r.s)}</span><p>${esc(r.t)}</p></div>`).join('')||'<p class="mut">كن أول من يقيّمنا</p>'}
<div class="card"><label>الاسم</label><input id="rn" value="${esc(S.me?S.me.name:'')}"><label>التقييم</label><select id="rs"><option>5</option><option>4</option><option>3</option><option>2</option><option>1</option></select><label>رأيك</label><textarea id="rt"></textarea><button class="w" onclick="addRev()">إرسال التقييم</button></div>`};
V.login=()=>LG.step==0?`<h2>تسجيل الدخول</h2><div class="card"><label>الاسم الحقيقي بالكامل *</label><input id="ln" value="${esc(LG.name)}" autocomplete="name"><label>رقم الهاتف (واتساب) *</label><input id="lp" type="tel" inputmode="numeric" placeholder="01xxxxxxxxx" value="${esc(LG.phone)}"><button class="w" onclick="sendCode()">إرسال كود الدخول على واتساب</button><p class="mut">سيتم استخدام اسمك ورقمك تلقائياً في طلباتك وحجوزاتك.</p></div>`
:`<h2>أدخل الكود</h2><div class="card"><div class="warn">نسخة تجريبية: الزر يفتح واتساب برسالة فيها الكود. التحقق الحقيقي من الرقم يحتاج ربط خادم (WhatsApp Business API).</div><a class="btn g w" target="_blank" rel="noopener" href="https://wa.me/2${LG.phone}?text=${encodeURIComponent('كود الدخول لـ '+S.st.name+': '+LG.code)}">فتح واتساب واستلام الكود</a><br><br><label>الكود (4 أرقام)</label><input id="lc" inputmode="numeric" maxlength="4"><button class="g w" onclick="checkCode()">تأكيد</button><br><br><button class="l btn w" onclick="LG.step=0;render()">تعديل الرقم</button></div>`;
window.sendCode=()=>{const n=$('#ln').value.trim().replace(/\s+/g,' '),p=$('#lp').value.trim().replace(/[٠-٩]/g,d=>d.charCodeAt(0)-1632);
 if(n.split(' ').length<2||n.length<6)return toast('اكتب الاسم الحقيقي (اسمين على الأقل)');
 if(!/^01[0125]\d{8}$/.test(p))return toast('رقم الهاتف غير صحيح');
 const u=S.users.find(x=>x.phone==p);if(u&&u.blocked)return toast('هذا الحساب موقوف');
 LG={...LG,step:1,name:n,phone:p,code:String(1000+Math.floor(Math.random()*9000)),exp:Date.now()+300000};render()};
window.checkCode=()=>{if(Date.now()>LG.exp)return toast('انتهت صلاحية الكود');if($('#lc').value.trim()!=LG.code)return toast('الكود غير صحيح');
 let u=S.users.find(x=>x.phone==LG.phone);if(!u){u={id:uid(),phone:LG.phone,joined:new Date().toISOString(),blocked:0};S.users.push(u)}u.name=LG.name;S.me={id:u.id,name:u.name,phone:u.phone};persist();toast('أهلاً '+u.name);const b=LG.back;LG.step=0;go(b)};
V.cart=()=>{if(!S.cart.length)return '<h2>السلة</h2><p class="mut">السلة فارغة</p>';const sub=S.cart.reduce((a,i)=>a+eff(prod(i.id))*i.q,0);
 return `<h2>السلة</h2>${S.cart.map(i=>{const p=prod(i.id);return `<div class="card row"><div><b>${esc(p.name)}</b><br><span class="mut">${$m(eff(p))}</span></div><div class="row"><button class="l btn" onclick="qty(${i.id},-1)">−</button><b>${i.q}</b><button class="l btn" onclick="qty(${i.id},1)">+</button></div></div>`}).join('')}
<div class="card"><div class="row"><span>المجموع</span><b>${$m(sub)}</b></div><div class="row"><span>الشحن (للتوصيل)</span><b>${$m(S.st.ship)}</b></div></div>
<div class="card"><h3>إتمام الطلب (الدفع عند الاستلام)</h3>${S.me?`<p>الطلب باسم <b>${esc(S.me.name)}</b> · ${esc(S.me.phone)}</p>`:'<div class="warn">سجّل دخولك لإتمام الطلب</div>'}<label>الاستلام</label><select id="om"><option value="d">توصيل للعنوان</option><option value="p">استلام من الفرع</option></select><label>العنوان</label><textarea id="oa"></textarea><button class="g w" onclick="order()">تأكيد الطلب</button></div>`};
window.order=()=>{if(need('cart'))return;const del=$('#om').value=='d',ad=$('#oa').value.trim();if(del&&!ad)return toast('أدخل العنوان');
 const items=S.cart.map(i=>{const x=prod(i.id);return{id:x.id,name:x.name,q:i.q,cost:x.cost,sale:eff(x)}}),sub=items.reduce((a,i)=>a+i.sale*i.q,0),sh=del?+S.st.ship:0;
 const o={id:uid(),no:S.orders.length+1001,uid:S.me.id,name:S.me.name,phone:S.me.phone,addr:del?ad:'استلام من الفرع',items,ship:sh,total:sub+sh,status:'جديد',date:new Date().toISOString(),note:''};
 items.forEach(i=>{const x=prod(i.id);x.stock=Math.max(0,x.stock-i.q);x.sold+=i.q});S.orders.unshift(o);S.cart=[];persist();note('تم استلام طلبك #'+o.no,'الإجمالي '+o.total+' '+S.st.cur);
 window.open(wa(`طلب جديد #${o.no}\nالاسم: ${o.name}\nالهاتف: ${o.phone}\n${items.map(i=>`- ${i.name} × ${i.q}`).join('\n')}\nالإجمالي: ${o.total} ${S.st.cur}\nالعنوان: ${o.addr}`),'_blank');toast('تم تسجيل طلبك رقم '+o.no);go('me')};
const R={dt:'موبايل',is:'شاشة مكسورة',sl:'',sv:'زيارة الفرع',im:[]};
const ISS=[['شاشة مكسورة','📱'],['بطارية','🔋'],['مشكلة شحن','⚡'],['برمجة / سوفت وير','💾'],['كاميرا','📷'],['تلف بسبب الماء','💧'],['عطل آخر','🔧']];
window.pk=(el,k,v)=>{R[k]=v;[...el.parentNode.children].forEach(c=>c.classList.remove('on'));el.classList.add('on')};
const ch=(k,v)=>`<button type="button" class="cp ${R[k]==v?'on':''}" onclick="pk(this,'${k}','${v}')">${v}</button>`;
const shrink=(f,cb)=>{const r=new FileReader();r.onload=()=>{const i=new Image();i.onload=()=>{const c=document.createElement('canvas'),k=Math.min(1,500/i.width);c.width=i.width*k;c.height=i.height*k;c.getContext('2d').drawImage(i,0,0,c.width,c.height);cb(c.toDataURL('image/jpeg',.7))};i.src=r.result};r.readAsDataURL(f)};
window.bph=el=>{R.im=[];$('#bpv').innerHTML='';[...el.files].slice(0,3).forEach(f=>shrink(f,d=>{R.im.push(d);$('#bpv').innerHTML+=`<img src="${d}" width="56">`}))};
V.repair=()=>{const sl=S.st.slots.split(',').map(x=>x.trim());if(!R.sl)R.sl=sl[0];
 return `<div class="row"><h2>حجز صيانة</h2><a class="mut" onclick="go('me')">حجوزاتي</a></div><p class="mut">املأ البيانات واحنا نتولى الباقي</p>
<div class="card"><h3>بياناتك</h3>${S.me?`<p>${esc(S.me.name)} · ${esc(S.me.phone)}</p>`:'<div class="warn">سجّل دخولك قبل تأكيد الحجز</div>'}</div>
<div class="card"><h3>بيانات الجهاز</h3><label>نوع الجهاز</label><div class="chips">${['موبايل','تابلت','ساعة ذكية','سماعة'].map(x=>ch('dt',x)).join('')}</div><label>الماركة</label><select id="bb">${['Apple','Samsung','Xiaomi','Oppo','Huawei','أخرى'].map(x=>`<option>${x}</option>`).join('')}</select><label>الموديل *</label><input id="bm" placeholder="مثال: iPhone 13 Pro"></div>
<div class="card"><h3>المشكلة</h3><div class="grid2">${ISS.map(i=>`<button type="button" class="it ${R.is==i[0]?'on':''}" onclick="pk(this,'is','${i[0]}')">${i[1]} ${i[0]}</button>`).join('')}</div><label>وصف المشكلة</label><textarea id="bx" placeholder="متى بدأت وما الذي جربته"></textarea><label>صور الجهاز (حتى 3)</label><input type="file" accept="image/*" multiple onchange="bph(this)"><div id="bpv"></div></div>
<div class="card"><h3>الموعد</h3><label>التاريخ</label><input id="bt" type="date" min="${today()}" value="${today()}"><label>الوقت</label><div class="chips">${sl.map(x=>ch('sl',x)).join('')}</div><label>طريقة التسليم</label><div class="chips">${['زيارة الفرع','استلام من العميل'].map(x=>ch('sv',x)).join('')}</div></div>
<button class="g w" onclick="book()">تأكيد حجز الصيانة ✓</button><p class="mut">التكلفة تُقدَّر بعد الفحص ولن يبدأ الإصلاح قبل موافقتك على السعر.</p>`};
window.book=()=>{if(need('repair'))return;const g=i=>$('#'+i).value.trim(),m=g('bm'),t=g('bt');if(!m||!t)return toast('اكتب الموديل واختر اليوم');
 const b={id:uid(),no:'REP-'+uid().toString(36).toUpperCase().slice(-6),uid:S.me.id,name:S.me.name,phone:S.me.phone,device:R.dt+' '+g('bb')+' '+m,issue:R.is,desc:g('bx'),date:t,slot:R.sl,svc:R.sv,status:'تم الاستلام',price:0,parts:0,imgs:R.im.slice(),d0:new Date().toISOString()};
 S.books.unshift(b);R.im=[];persist();note('تم استلام حجز الصيانة','حجزك '+b.no+' يوم '+t+' الساعة '+b.slot);
 window.open(wa(`حجز صيانة ${b.no}\nالاسم: ${b.name}\nالهاتف: ${b.phone}\nالجهاز: ${b.device}\nالعطل: ${b.issue} ${b.desc}\nالموعد: ${t} ${b.slot}\nالخدمة: ${b.svc}`),'_blank');toast('تم الحجز');go('bk/'+b.id)};
V.bk=id=>{const b=S.books.find(x=>x.id==id);if(!b)return V.me();const i=BS.indexOf(b.status);
 return `<div class="row"><a class="mut" onclick="go('me')">← رجوع</a><span class="tag">${esc(b.status)}</span></div><p class="mut">رقم الحجز</p><h2 style="margin:0">${esc(b.no)}</h2><br>
<div class="card stp">${BS.slice(0,6).map((s,k)=>`<div class="${k<=i?'dn':''}"><span>${k<i?'✓':k+1}</span><small>${s}</small></div>`).join('')}</div>
<div class="card"><h3>بيانات الجهاز</h3><p>${esc(b.device)}<br>العطل: ${esc(b.issue)} ${esc(b.desc)}<br>الموعد: ${esc(b.date)} ${esc(b.slot)} · ${esc(b.svc)}</p>${(b.imgs||[]).map(x=>`<img src="${x}" width="64">`).join(' ')}</div>
<div class="card"><h3>التكلفة النهائية</h3><b>${+b.price?$m(b.price):'تُحدَّد بعد الفحص'}</b></div>${i<1?`<button class="r w" onclick="cancelB(${b.id})">إلغاء الحجز ✕</button>`:''}`};
window.cancelB=id=>{if(confirm('إلغاء الحجز؟')){S.books.find(x=>x.id==id).status='ملغي';persist();render()}};
V.me=()=>{const mo=S.orders.filter(o=>o.uid==S.me.id),mb=S.books.filter(b=>b.uid==S.me.id);
 return `<h2>حسابي</h2><div class="card"><b>${esc(S.me.name)}</b><br><span class="mut">${esc(S.me.phone)}</span><br><br><button class="l btn" onclick="S.me=null;persist();go('home')">تسجيل خروج</button></div>
<div class="card"><h3>تواصل معنا</h3><br>${contact()}</div><div id="inst"></div>
<h2>طلباتي</h2>${mo.map(o=>`<div class="card row"><span>#${o.no} · ${$m(o.total)}</span><span class="tag">${esc(o.status)}</span></div>`).join('')||'<p class="mut">لا توجد طلبات</p>'}
<h2>حجوزاتي</h2>${mb.map(b=>`<div class="card row" onclick="go('bk/${b.id}')" style="cursor:pointer"><span>${esc(b.no)} · ${esc(b.date)} ${esc(b.slot)}</span><span class="tag">${esc(b.status)}</span></div>`).join('')||'<p class="mut">لا توجد حجوزات</p>'}<p class="mut"><a onclick="go('privacy')">سياسة الخصوصية</a></p>`};
V.notes=()=>`<h2>الإشعارات</h2>${S.notes.map(n=>`<div class="card"><b>${esc(n.t)}</b><p>${esc(n.b)}</p><span class="mut">${esc(n.d)}</span></div>`).join('')||'<p class="mut">لا توجد إشعارات</p>'}`;
at=function(){const t=[['dash','الرئيسية'],['prods','المنتجات'],['orders','الطلبات'],['books','الصيانة'],['users','العملاء'],['acct','الحسابات'],['set','الإعدادات']],c=H.split('/')[1]||'dash';return `<div class="chips">${t.map(x=>`<button class="${c==x[0]?'on':''}" onclick="go('admin/${x[0]}')">${x[1]}</button>`).join('')}</div>`};
A.users=()=>`${at()}<h2>العملاء (${S.users.length})</h2>${S.users.map(u=>{const os=S.orders.filter(o=>o.uid==u.id&&!['ملغي','مرتجع'].includes(o.status));return `<div class="card"><div class="row"><b>${esc(u.name)}</b>${u.blocked?'<span class="low">موقوف</span>':''}</div><p class="mut">${esc(u.phone)} · انضم ${new Date(u.joined).toLocaleDateString('ar-EG')}<br>${os.length} طلب · ${$m(os.reduce((a,o)=>a+o.total,0))} · ${S.books.filter(b=>b.uid==u.id).length} حجز صيانة</p><div class="row"><a class="btn g" target="_blank" rel="noopener" href="https://wa.me/2${esc(u.phone)}">واتساب</a><button class="${u.blocked?'g':'r'} btn" onclick="blk(${u.id})">${u.blocked?'تفعيل':'حظر'}</button></div></div>`}).join('')||'<p class="mut">لا يوجد عملاء بعد</p>'}`;
window.blk=id=>{const u=S.users.find(x=>x.id==id);u.blocked=u.blocked?0:1;if(u.blocked&&S.me&&S.me.id==id)S.me=null;persist();render()};
A.acct=()=>{const ok=S.orders.filter(o=>!['ملغي','مرتجع'].includes(o.status)),it=ok.flatMap(o=>o.items),rev=it.reduce((a,i)=>a+i.sale*i.q,0),cogs=it.reduce((a,i)=>a+i.cost*i.q,0),rep=S.books.filter(b=>b.status=='تم التسليم'),rr=rep.reduce((a,b)=>a+ +b.price,0),rp=rep.reduce((a,b)=>a+ +b.parts,0),ex=S.exp.filter(e=>e.type=='مصروف').reduce((a,e)=>a+e.amt,0),pu=S.exp.filter(e=>e.type=='مشتريات').reduce((a,e)=>a+e.amt,0),net=rev-cogs+rr-rp-ex;
 const s=(l,v)=>`<div class="stat"><b>${$m(v)}</b>${l}</div>`;
 return `${at()}<div class="stats">${s('مبيعات المنتجات',rev)}${s('تكلفة البضاعة المباعة',cogs)}${s('ربح المنتجات',rev-cogs)}${s('إيراد الصيانة',rr)}${s('تكلفة قطع الغيار',rp)}${s('المصروفات',ex)}${s('مشتريات من الموردين',pu)}${s('صافي الربح',net)}</div>
<h2>تسجيل مصروف / مشتريات</h2><div class="card"><select id="ek"><option>مصروف</option><option>مشتريات</option></select><input id="et" placeholder="البيان (إيجار، شحن، فاتورة مورد...)"><input id="ea" type="number" placeholder="المبلغ"><button class="w" onclick="addE()">إضافة</button></div>
${S.exp.map(e=>`<div class="card row"><span>${esc(e.type)} · ${esc(e.title)}<br><span class="mut">${esc(e.date)}</span></span><span><b>${$m(e.amt)}</b> <button class="r btn" onclick="delE(${e.id})">✕</button></span></div>`).join('')}<p class="mut">صافي الربح = ربح المنتجات + ربح الصيانة − المصروفات. المشتريات للمعلومية لأن تكلفة البضاعة محسوبة عند البيع.</p>`};
window.addE=()=>{const t=$('#et').value.trim(),a=+$('#ea').value;if(!t||!(a>0))return toast('اكتب البيان والمبلغ');S.exp.unshift({id:uid(),type:$('#ek').value,title:t,amt:a,date:today()});persist();render()};
window.delE=id=>{S.exp=S.exp.filter(e=>e.id!=id);persist();render()};
nav=function(){const h=H.split('/')[0],n=S.cart.reduce((a,i)=>a+i.q,0),un=S.notes.filter(x=>!x.r).length;document.body.className=h=='admin'?'adm':'';
 const f=$('#fab');if(f)f.href=wa('مرحبا');
 if(h=='admin'){$('#nav').innerHTML='';$('#top').innerHTML=`<span>لوحة المالك</span><a onclick="go('home')" style="color:#fff">المتجر</a>`;return}
 $('#top').innerHTML=`<span>${esc(S.st.name)}</span><span>${S.admin||window.PREVIEW?`<button onclick="go('admin')" style="min-height:34px;padding:4px 10px;background:#0F172A">🔑 المالك</button> `:''}${window.DP?`<button onclick="inst()" style="background:#fff;color:#1D4ED8;min-height:34px;padding:4px 12px">تثبيت</button>`:''}</span>`;
 $('#nav').innerHTML=`<div class="brand"><b>${esc(S.st.name)}</b><br><small class="mut">صيانة سماعات وإكسسوارات الهواتف</small></div>`+[['home','🏠','الرئيسية'],['products','🛍️','المنتجات'],['cart','🛒','السلة',n],['repair','🔧','الصيانة'],['me','👤','حسابي'],['notes','🔔','الإشعارات',un]].map(x=>`<a onclick="go('${x[0]}')" class="${h==x[0]?'on':''}"><b>${x[1]}</b>${x[2]}${x[3]?`<i>${x[3]}</i>`:''}</a>`).join('')+((S.admin||window.PREVIEW)?`<a class="adm2" onclick="go('admin')"><b>▦</b>لوحة التحكم</a>`:'')};
render=function(){const p=H.split('/');let html;
 if(p[0]=='admin')html=!S.admin?A.login():(A[p[1]=='edit'?'edit':p[1]||'dash']||A.dash)(p[2]);
 else if(p[0]=='me'&&!S.me){LG.back='me';html=V.login()}else html=(V[p[0]]||V.home)(p[1]);
 $('#app').innerHTML=html;if(p[0]=='notes'){S.notes.forEach(n=>n.r=1);persist()}nav();
 const e=$('#inst');if(e&&!matchMedia('(display-mode: standalone)').matches&&!navigator.standalone){const ios=/iphone|ipad/i.test(navigator.userAgent);e.innerHTML=`<div class="card"><h3>📲 تثبيت التطبيق على موبايلك</h3>${window.DP?'<br><button class="g w" onclick="inst()">تثبيت الآن</button>':`<p>${ios?'اضغط زر المشاركة ثم «إضافة إلى الشاشة الرئيسية».':'من قائمة المتصفح ⋮ اختر «تثبيت التطبيق» أو «إضافة إلى الشاشة الرئيسية».'}</p>`}</div>`}scrollTo(0,0)};
document.body.insertAdjacentHTML('beforeend','<a class="fab" id="fab" target="_blank" rel="noopener">💬</a>');
addEventListener('beforeinstallprompt',e=>{e.preventDefault();window.DP=e;nav()});
window.inst=()=>{if(window.DP){DP.prompt();DP.userChoice.then(()=>{window.DP=null;render()})}};
render();
if('serviceWorker' in navigator)addEventListener('load',()=>navigator.serviceWorker.register('sw.js'));
