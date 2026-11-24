'use strict';
const $=s=>document.querySelector(s), K='elbob_';
const load=(k,d)=>{try{const v=JSON.parse(localStorage.getItem(K+k));return v==null?d:v}catch(e){return d}};
const save=(k,v)=>localStorage.setItem(K+k,JSON.stringify(v));
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const uid=()=>Date.now()+Math.floor(Math.random()*999);

// ---------- State Management ----------
const OWNER='abanobjo323@gmail.com';
const S={
 st:load('st',{name:'صيانة سماعات El BOB',phone:'01023052470',wa:'201023052470',fb:'https://www.facebook.com/share/1JKPzbseuX/',map:'https://maps.app.goo.gl/pCmHzbxcLQMKkxiN9',pin:'3425',pinSet:1,cur:'ج.م',ship:30,slots:'10:00,12:00,14:00,16:00,18:00',hours:'10 ص - 10 م',owner:OWNER,desc:'متجر اكسسوارات وصيانة هواتف',waMsg:'مرحباً، أريد الاستفسار',delivery:'التوصيل لكل المحافظات',returns:'يمكن الاسترجاع خلال 14 يوماً بشرط سلامة المنتج',freeShip:0,rev:'1'}),
 cats:load('cats',['سماعات','جرابات وحافظات','شواحن وكابلات','باور بانك','حماية شاشة','حوامل'].map((n,i)=>({id:i+1,name:n,icon:'',img:''}))),
 prods:load('prods',[['كابل USB-C مضفر 1 متر',3,'Anker',129,0,4.6],['حامل هاتف للسيارة مغناطيسي',6,'Baseus',249,0,4.5],['جراب سيليكون شفاف',2,'Generic',149,0,4.5],['شاحن سريع 20 واط',3,'Anker',299,0,4.8],['حافظة بطاقات للجوال',2,'Generic',199,0,4.3],['جراب ماغسيف شفاف',2,'Baseus',349,299,4.7],['سماعة رياضية رقبة',1,'Baseus',499,0,4.4],['سماعة رأس جيمنج RGB',1,'RedDragon',1299,1099,4.6],['سماعات بلوتوث لاسلكية Pro',1,'SoundCore',899,749,4.8],['حماية شاشة زجاج 9H',5,'Generic',99,79,4.5],['باور بانك 5000 مغناطيسي',4,'Baseus',449,0,4.4],['باور بانك 20000 ملي أمبير',4,'Anker',799,699,4.7],['شاحن لاسلكي 15 واط',3,'Baseus',599,499,4.3],['ستاند مكتب قابل للطي',6,'Generic',179,0,4.2]].map((a,i)=>({id:i+1,name:a[0],cat:a[1],brand:a[2],cost:Math.round(a[3]*.6),price:a[3],disc:a[4],stock:15,min:3,desc:'',img:'',imgs:[],on:1,sold:14-i,rate:a[5]}))),
 site:load('site',{}),
 svc:load('svc',[{id:1,name:'تغيير شاشة',price:350},{id:2,name:'تغيير بطارية',price:200},{id:3,name:'صيانة شحن',price:150},{id:4,name:'برمجة / سوفت وير',price:100},{id:5,name:'صيانة سماعة',price:120}]),
 ed:0, users:load('users',[]), me:load('me',null), exp:load('exp',[]), orders:load('orders',[]), books:load('books',[]), cart:load('cart',[]), notes:load('notes',[]), revs:load('revs',[]), admin:load('adm',0), q:'', cat:0
};

S.st.owner=OWNER;
if(!S.st.pinSet){S.st.pin='3425';S.st.pinSet=1}
S.revs.forEach(r=>{if(!r.id)r.id=uid()});

const persist=()=>['st','cats','prods','orders','books','cart','notes','revs','users','me','exp','site','svc'].forEach(k=>save(k,S[k]));
const $m=n=>S.st.cur+' '+Number(n||0).toLocaleString('en-US');
const eff=p=>p.disc>0?p.disc:p.price;
const toast=m=>{const t=$('#toast');if(!t)return;t.textContent=m;t.classList.add('on');setTimeout(()=>t.classList.remove('on'),2200)};
const prod=id=>S.prods.find(p=>p.id==id);
const catName=id=>(S.cats.find(c=>c.id==id)||{}).name||'أخرى';
const today=()=>new Date().toISOString().slice(0,10);
const OS=['جديد','قيد التجهيز','تم الشحن','تم التسليم','ملغي','مرتجع'];
const BS=['تم الاستلام','قيد الفحص','بانتظار موافقة العميل','قيد الإصلاح','جاهز للاستلام','تم التسليم','ملغي'];
const wa=t=>`https://wa.me/${S.st.wa}?text=${encodeURIComponent(t)}`;
const note=(t,b)=>{S.notes.unshift({t,b,d:new Date().toLocaleString('ar-EG'),r:0});persist()};
const stars=n=>'★'.repeat(Math.round(n))+'☆'.repeat(5-Math.round(n));
const avg=()=>S.revs.length?S.revs.reduce((a,r)=>a+r.s,0)/S.revs.length:0;
const GR=['linear-gradient(135deg,#6366f1,#4338ca)','linear-gradient(135deg,#f472b6,#c026d3)','linear-gradient(135deg,#fbbf24,#ea580c)','linear-gradient(135deg,#34d399,#0f766e)','linear-gradient(135deg,#38bdf8,#2563eb)','linear-gradient(135deg,#a78bfa,#7e22ce)'];
const gr=id=>GR[Math.max(0,S.cats.findIndex(c=>c.id==id))%6];
const PH='<svg viewBox="0 0 24 24" width="44%" fill="none" stroke="rgba(255,255,255,.9)" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M21 8l-9-5-9 5v8l9 5 9-5V8z"/><path d="M3 8l9 5 9-5M12 13v8"/></svg>';
const imgsOf=p=>p.imgs&&p.imgs.length?p.imgs:(p.img?[p.img]:[]);
const pimg=p=>{const a=imgsOf(p);return a.length?`<img src="${a[0]}" alt="${esc(p.name)}" loading="lazy">`:PH};
const ctile=(c,s=76)=>c.img?`<img src="${c.img}" width="${s}" height="${s}" style="border-radius:${s/4}px;object-fit:cover">`:`<span style="width:${s}px;height:${s}px;border-radius:${s/4}px;background:${gr(c.id)}">${PH}</span>`;
const NL=(k,d)=>(S.site.nl||{})[k]||d;

const ic=d=>`<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${d}</svg>`;
const I={
  home:ic('<path d="M3 11l9-8 9 8v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>'),
  bag:ic('<path d="M6 2L3 7v13a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V7l-3-5z"/><path d="M3 7h18M16 11a4 4 0 0 1-8 0"/>'),
  cart:ic('<circle cx="9" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2 3h3l3 12h11l2-8H6"/>'),
  wr:ic('<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.8-3.8a6 6 0 0 1-7.9 7.9l-6.9 6.9a2.1 2.1 0 0 1-3-3l6.9-6.9a6 6 0 0 1 7.9-7.9z"/>'),
  user:ic('<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>'),
  star:ic('<path d="M12 2l3 7 7 .6-5.3 4.7 1.6 7.2L12 17.8 5.7 21.5l1.6-7.2L2 9.6 9 9z"/>'),
  bell:ic('<path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.7 21a2 2 0 0 1-3.4 0"/>')
};

function card(p){
  const pc=p.disc>0?Math.round((p.price-p.disc)/p.price*100):0;
  return `<div class="pc"><div class="im" style="background:${gr(p.cat)}" onclick="GI=0;go('p/${p.id}')">${pimg(p)}${pc?`<span class="bdg">خصم ${pc}%</span>`:''}</div><div class="bd"><h3 onclick="GI=0;go('p/${p.id}')">${esc(p.name)}</h3><span class="mut">${esc(p.brand)}${p.rate?` · ${p.rate} <span class="star">★</span>`:''}</span><div class="row"><div class="pr">${$m(eff(p))}${p.disc>0?`<br><span class="old">${$m(p.price)}</span>`:''}</div>${p.stock>0?`<button class="plus" onclick="add(${p.id})">+</button>`:'<span class="low">نفد</span>'}</div></div></div>`;
}

function contact(){
  const s=S.st;
  return `<div class="row ct"><a class="btn g" href="${wa(S.st.waMsg||'مرحبا')}" target="_blank" rel="noopener">تواصل واتساب</a><a class="btn fb" href="${esc(s.fb)}" target="_blank" rel="noopener">صفحتنا فيسبوك</a><a class="btn l" href="${esc(s.map)}" target="_blank" rel="noopener">📍 موقعنا</a><a class="btn dk" href="tel:${esc(s.phone)}">اتصل بنا</a></div>`;
}

const T=(k,d)=>`<span data-k="${k}" ${S.ed?'contenteditable="true" class="ed"':''}>${esc(S.site[k]||d)}</span>`;
const need=b=>{if(S.me)return 0;LG.back=b;go('login');toast('سجّل دخولك أولاً');return 1};
const svcCard=()=>S.svc.length?`<div class="card"><h3>💰 أسعار الصيانة (تبدأ من)</h3>${S.svc.map(s=>`<div class="row"><span>${esc(s.name)}</span><b>${$m(s.price)}</b></div>`).join('')}</div>`:'';

// ---------- Image Handling ----------
const shrink=(f,cb,w=500)=>{const r=new FileReader();r.onload=()=>{const i=new Image();i.onload=()=>{const c=document.createElement('canvas'),k=Math.min(1,w/i.width);c.width=i.width*k;c.height=i.height*k;c.getContext('2d').drawImage(i,0,0,c.width,c.height);cb(c.toDataURL('image/jpeg',.7))};i.src=r.result};r.readAsDataURL(f)};
window.pickImg=(cb,w=500)=>{const i=document.createElement('input');i.type='file';i.accept='image/*';i.onchange=()=>i.files[0]&&shrink(i.files[0],cb,w);i.click()};

// ---------- Customer Views ----------
const V={};

V.home=()=>{
  const best=[...S.prods].filter(p=>p.on).sort((a,b)=>b.sold-a.sold).slice(0,4);
  const deals=S.prods.filter(p=>p.on&&p.disc>0).slice(0,3);
  const vr=S.revs.filter(r=>!r.hide).slice(0,3);
  const hs=S.site.himg?`background:linear-gradient(rgba(0,0,0,.45),rgba(0,0,0,.45)),url('${S.site.himg}') center/cover`:'';
  return `<div class="hero2" style="${hs}"><span class="tag2">${T('tag','صيانة سماعات وإكسسوارات الهواتف')}</span><h1>${T('h1','كل ما يحتاجه هاتفك في مكان واحد')}</h1><p>${T('hp','سماعات، شواحن، جرابات وحمايات شاشة، مع خدمة صيانة على يد فنيين متخصصين.')}</p><br><div class="row" style="justify-content:flex-start"><button class="wb" onclick="go('products')">تسوّق الآن ←</button><button class="dk" onclick="go('repair')">احجز صيانة 🔧</button></div></div>
<h2>تواصل مع ${esc(S.st.name)}</h2><p class="mut">${esc(S.st.hours)}</p>${contact()}
<h2>تسوّق بالتصنيف</h2><div class="chips cats">${S.cats.map(c=>`<a onclick="${S.ed?`editCat(${c.id})`:`S.cat=${c.id};go('products')`}">${ctile(c)}${esc(c.name)}</a>`).join('')}</div>
${deals.length?`<h2>عروض اليوم</h2><div class="grid">${deals.map(card).join('')}</div>`:''}<h2>الأكثر مبيعاً</h2><div class="grid">${best.map(card).join('')}</div>
<div class="banner"><h2>${T('bt','هاتفك تعبان؟ احجزه ونصلحه في نفس اليوم')}</h2><p>${T('bp','شاشة، بطارية، شحن، برمجة، وتابع حالة الجهاز خطوة بخطوة.')}</p><br><button class="wb" onclick="go('repair')">احجز موعد صيانة ←</button></div>
${svcCard()}<div class="row"><h2>⭐ آراء العملاء</h2><a class="mut" onclick="go('reviews')">عرض الكل ←</a></div>${vr.map(r=>`<div class="card"><b>${esc(r.n)}</b> <span class="star">${stars(r.s)}</span><p>${esc(r.t)}</p></div>`).join('')||'<p class="mut">كن أول من يقيّمنا</p>'}`;
};

V.products=()=>{
  const l=S.prods.filter(p=>p.on&&(!S.cat||p.cat==S.cat)&&(p.name+p.brand).toLowerCase().includes(S.q.toLowerCase()));
  return `<input id="q" type="search" placeholder="ابحث عن منتج..." value="${esc(S.q)}" oninput="S.q=this.value;list()"><div class="chips"><button class="${!S.cat?'on':''}" onclick="S.cat=0;render()">الكل</button>${S.cats.map(c=>`<button class="${S.cat==c.id?'on':''}" onclick="S.cat=${c.id};render()">${esc(c.name)}</button>`).join('')}</div><div id="pl" class="grid">${l.map(card).join('')||'<p class="mut">لا توجد نتائج</p>'}</div>`;
};
window.list=()=>{const l=S.prods.filter(p=>p.on&&(!S.cat||p.cat==S.cat)&&(p.name+p.brand).toLowerCase().includes(S.q.toLowerCase()));$('#pl').innerHTML=l.map(card).join('')||'<p class="mut">لا توجد نتائج</p>'};

let GI=0; window.gi=i=>{GI=i;render()};
V.p=id=>{
  const p=prod(id);if(!p)return V.products();
  const a=imgsOf(p);GI=Math.min(GI,Math.max(0,a.length-1));
  return `<a class="mut" onclick="go('products')">← رجوع للمنتجات</a><div class="pc" style="margin-top:8px"><div class="im" style="background:${gr(p.cat)}">${a.length?`<img src="${a[GI]}" alt="${esc(p.name)}">`:PH}</div></div>${a.length>1?`<div class="chips">${a.map((x,i)=>`<img class="tn ${i==GI?'on':''}" src="${x}" onclick="gi(${i})">`).join('')}</div>`:''}
<h2>${esc(p.name)}</h2><p class="mut">${esc(p.brand)} · ${esc(catName(p.cat))}${p.rate?` · ${p.rate} <span class="star">★</span>`:''}</p><div class="pr" style="font-size:1.3rem">${$m(eff(p))}${p.disc>0?`<span class="old">${$m(p.price)}</span>`:''}</div>${p.desc?`<p>${esc(p.desc)}</p>`:''}<p class="${p.stock>0?'mut':'low'}">${p.stock>0?'متوفر ('+p.stock+')':'نفد المخزون'}</p>${p.stock>0?`<button class="w g" onclick="add(${p.id})">أضف للسلة</button>`:''}`;
};

V.cart=()=>{
  if(!S.cart.length)return '<h2>السلة</h2><p class="mut">السلة فارغة</p>';
  const sub=S.cart.reduce((a,i)=>a+eff(prod(i.id))*i.q,0);
  return `<h2>السلة</h2>${S.cart.map(i=>{const p=prod(i.id);return `<div class="card row"><div><b>${esc(p.name)}</b><br><span class="mut">${$m(eff(p))}</span></div><div class="row"><button class="l btn" onclick="qty(${i.id},-1)">−</button><b>${i.q}</b><button class="l btn" onclick="qty(${i.id},1)">+</button></div></div>`}).join('')}
<div class="card"><div class="row"><span>المجموع</span><b>${$m(sub)}</b></div><div class="row"><span>الشحن (للتوصيل)</span><b>${$m(S.st.ship)}</b></div></div>
<div class="card"><h3>إتمام الطلب (الدفع عند الاستلام)</h3>${S.me?`<p>الطلب باسم <b>${esc(S.me.name)}</b> · ${esc(S.me.phone)}</p>`:'<div class="warn">سجّل دخولك لإتمام الطلب</div>'}<label>الاستلام</label><select id="om"><option value="d">توصيل للعنوان</option><option value="p">استلام من الفرع</option></select><label>العنوان</label><textarea id="oa"></textarea><button class="g w" onclick="order()">تأكيد الطلب</button></div>`;
};

const R={dt:'موبايل',is:'شاشة مكسورة',sl:'',sv:'زيارة الفرع',im:[]};
const ISS=[['شاشة مكسورة','📱'],['بطارية','🔋'],['مشكلة شحن','⚡'],['برمجة / سوفت وير','💾'],['كاميرا','📷'],['تلف بسبب الماء','💧'],['عطل آخر','🔧']];
window.pk=(el,k,v)=>{R[k]=v;[...el.parentNode.children].forEach(c=>c.classList.remove('on'));el.classList.add('on')};
const ch=(k,v)=>`<button type="button" class="cp ${R[k]==v?'on':''}" onclick="pk(this,'${k}','${v}')">${v}</button>`;
window.bph=el=>{R.im=[];$('#bpv').innerHTML='';[...el.files].slice(0,3).forEach(f=>shrink(f,d=>{R.im.push(d);$('#bpv').innerHTML+=`<img src="${d}" width="56">`}))};

V.repair=()=>{
  const sl=S.st.slots.split(',').map(x=>x.trim());if(!R.sl)R.sl=sl[0];
  return `<div class="row"><h2>حجز صيانة</h2><a class="mut" onclick="go('me')">حجوزاتي</a></div><p class="mut">املأ البيانات واحنا نتولى الباقي</p>${svcCard()}
<div class="card"><h3>بياناتك</h3>${S.me?`<p>${esc(S.me.name)} · ${esc(S.me.phone)}</p>`:'<div class="warn">سجّل دخولك قبل تأكيد الحجز</div>'}</div>
<div class="card"><h3>بيانات الجهاز</h3><label>نوع الجهاز</label><div class="chips">${['موبايل','تابلت','ساعة ذكية','سماعة'].map(x=>ch('dt',x)).join('')}</div><label>الماركة</label><select id="bb">${['Apple','Samsung','Xiaomi','Oppo','Huawei','أخرى'].map(x=>`<option>${x}</option>`).join('')}</select><label>الموديل *</label><input id="bm" placeholder="مثال: iPhone 13 Pro"></div>
<div class="card"><h3>المشكلة</h3><div class="grid2">${ISS.map(i=>`<button type="button" class="it ${R.is==i[0]?'on':''}" onclick="pk(this,'is','${i[0]}')">${i[1]} ${i[0]}</button>`).join('')}</div><label>وصف المشكلة</label><textarea id="bx" placeholder="متى بدأت وما الذي جربته"></textarea><label>صور الجهاز (حتى 3)</label><input type="file" accept="image/*" multiple onchange="bph(this)"><div id="bpv"></div></div>
<div class="card"><h3>الموعد</h3><label>التاريخ</label><input id="bt" type="date" min="${today()}" value="${today()}"><label>الوقت</label><div class="chips">${sl.map(x=>ch('sl',x)).join('')}</div><label>طريقة التسليم</label><div class="chips">${['زيارة الفرع','استلام من العميل'].map(x=>ch('sv',x)).join('')}</div></div>
<button class="g w" onclick="book()">تأكيد حجز الصيانة ✓</button><p class="mut">التكلفة تُقدَّر بعد الفحص ولن يبدأ الإصلاح قبل موافقتك على السعر.</p>`;
};

V.bk=id=>{
  const b=S.books.find(x=>x.id==id);if(!b)return V.me();const i=BS.indexOf(b.status);
  return `<div class="row"><a class="mut" onclick="go('me')">← رجوع</a><span class="tag">${esc(b.status)}</span></div><p class="mut">رقم الحجز</p><h2 style="margin:0">${esc(b.no)}</h2><br>
<div class="card stp">${BS.slice(0,6).map((s,k)=>`<div class="${k<=i?'dn':''}"><span>${k<i?'✓':k+1}</span><small>${s}</small></div>`).join('')}</div>
<div class="card"><h3>بيانات الجهاز</h3><p>${esc(b.device)}<br>العطل: ${esc(b.issue)} ${esc(b.desc)}<br>الموعد: ${esc(b.date)} ${esc(b.slot)} · ${esc(b.svc)}</p>${(b.imgs||[]).map(x=>`<img src="${x}" width="64">`).join(' ')}</div>
<div class="card"><h3>التكلفة النهائية</h3><b>${+b.price?$m(b.price):'تُحدَّد بعد الفحص'}</b></div>${i<1?`<button class="r w" onclick="cancelB(${b.id})">إلغاء الحجز ✕</button>`:''}`;
};

let RS=5; window.rs5=n=>{RS=n;[...document.querySelectorAll('.stp5 chips button')].forEach((b,i)=>b.classList.toggle('on',i<n))};
V.reviews=()=>{
  const v=S.revs.filter(r=>!r.hide), a=v.length?v.reduce((x,r)=>x+r.s,0)/v.length:0;
  return `<h2>⭐ تقييمات العملاء</h2><div class="card"><div class="row"><div><b style="font-size:2rem">${a.toFixed(1)}</b> <span class="star">${stars(a)}</span><br><span class="mut">${v.length} تقييم</span></div><div style="flex:1;min-width:150px">${[5,4,3,2,1].map(n=>{const c=v.filter(r=>r.s==n).length;return `<div class="row" style="flex-wrap:nowrap"><small>${n}★</small><div class="bar"><i style="width:${v.length?c/v.length*100:0}%"></i></div><small>${c}</small></div>`}).join('')}</div></div></div>
<div class="card"><h3>أضف تقييمك</h3>${S.me?`<p>باسم <b>${esc(S.me.name)}</b></p>`:'<div class="warn">سجّل دخولك لإضافة تقييم</div>'}<div class="stp5 chips">${[1,2,3,4,5].map(n=>`<button class="cp ${n<=RS?'on':''}" onclick="rs5(${n})">${n}★</button>`).join('')}</div><textarea id="rt" placeholder="رأيك في الخدمة أو المنتجات"></textarea><button class="w" onclick="addRev()">إرسال</button></div>
${v.map(r=>`<div class="card"><div class="row"><b>${esc(r.n)}</b><span class="star">${stars(r.s)}</span></div><p>${esc(r.t)}</p>${r.reply?`<div class="warn">رد المتجر: ${esc(r.reply)}</div>`:''}<span class="mut">${esc(r.d||'')}</span></div>`).join('')||'<p class="mut">لا توجد تقييمات بعد</p>'}`;
};

V.me=()=>{
  if(!S.me){LG.back='me';return V.login()}
  const row=(r,t,s,x='')=>`<a class="card mrow ${x}" onclick="go('${r}')"><b>${t}</b><span class="mut">${s}</span></a>`;
  return `<h2>حسابي</h2><div class="card row"><div><b>${esc(S.me.name)}</b>${S.admin?' <span class="tag">المالك</span>':''}<br><span class="mut">${esc(S.me.email||'')} · ${esc(S.me.phone)}</span></div><button class="l btn" onclick="S.me=null;S.admin=false;save('adm',0);persist();go('home')">خروج</button></div>
${row('orders','طلباتي','تتبع طلباتك وحالتها')}${row('books','حجوزات الصيانة','متابعة أجهزتك')}${row('reviews','تقييمات العملاء','شاركنا رأيك')}${row('notes','الإشعارات','آخر التحديثات')}${S.admin?row('admin','لوحة التحكم','إدارة المتجر والحسابات','owner'):''}${row('about','بيانات المركز والتواصل','العنوان والمواعيد')}
<div class="card"><h3>تواصل معنا</h3><br>${contact()}</div><div id="inst"></div><div class="card"><h3>سياسات المتجر</h3><details><summary>الاسترجاع والاستبدال</summary><p>${esc(S.st.returns)}</p></details><details><summary>سياسة الخصوصية</summary><p>نستخدم بياناتك لتنفيذ طلباتك وحجوزاتك فقط ولا نشاركها مع أي طرف.</p></details></div>`;
};

V.about=()=>`<h2>بيانات المركز والتواصل</h2><div class="card"><h3>${esc(S.st.name)}</h3><p>${esc(S.st.desc)}</p><p class="mut">الهاتف: ${esc(S.st.phone)}<br>ساعات العمل: ${esc(S.st.hours)}<br>${esc(S.st.delivery)} · الشحن ${$m(S.st.ship)}${+S.st.freeShip?` · شحن مجاني فوق ${$m(S.st.freeShip)}`:''}</p>${contact()}</div>`;
V.notes=()=>`<h2>الإشعارات</h2>${S.notes.map(n=>`<div class="card"><b>${esc(n.t)}</b><p>${esc(n.b)}</p><span class="mut">${esc(n.d)}</span></div>`).join('')||'<p class="mut">لا توجد إشعارات</p>'}`;
V.orders=()=>{if(!S.me){LG.back='orders';return V.login()}const mo=S.orders.filter(o=>o.uid==S.me.id);return `<h2>طلباتي</h2>${mo.map(o=>`<div class="card"><div class="row"><b>طلب #${o.no}</b><span class="tag">${esc(o.status)}</span></div><p class="mut">${o.items.map(i=>esc(i.name)+' ×'+i.q).join('، ')}<br>${new Date(o.date).toLocaleDateString('ar-EG')}</p><b>${$m(o.total)}</b></div>`).join('')||'<p class="mut">لا توجد طلبات بعد</p>'}`};
V.books=()=>{if(!S.me){LG.back='books';return V.login()}const mb=S.books.filter(b=>b.uid==S.me.id);return `<h2>حجوزات الصيانة</h2>${mb.map(b=>`<a class="card mrow" onclick="go('bk/${b.id}')"><span><b>${esc(b.no)}</b><br><span class="mut">${esc(b.device)} · ${esc(b.date)} ${esc(b.slot)}</span></span><span class="tag">${esc(b.status)}</span></a>`).join('')||'<p class="mut">لا توجد حجوزات</p>'}<button class="w" onclick="go('repair')">حجز جديد</button>`};

// ---------- Auth & Login Logic ----------
let LG={step:0,code:'',exp:0,name:'',email:'',phone:'',back:'me',last:0,at:0};
const newCode=()=>String(1000+Math.floor(Math.random()*9000));

const FBON=()=>!!(window.firebase&&window.FB_CONFIG&&window.FB_CONFIG.apiKey);
const fbSend=()=>{
  try{
    if(!firebase.apps.length)firebase.initializeApp(FB_CONFIG);
    const a=firebase.auth();a.languageCode='ar';
    if(window.RV){try{RV.clear()}catch(e){}}
    $('#rcp').innerHTML='';window.RV=new firebase.auth.RecaptchaVerifier('rcp',{size:'invisible'});
    a.signInWithPhoneNumber('+2'+LG.phone,RV).then(r=>{LG.conf=r;LG.last=Date.now();render();toast('تم إرسال الكود برسالة SMS')}).catch(er=>{LG.step=0;render();toast('تعذر الإرسال: '+(er.code||er.message))});
  }catch(er){LG.step=0;render();toast('خطأ في إعداد Firebase')};
};

V.login=()=>{
  if(LG.step==1&&FBON()){
    return `<h2>أدخل كود التحقق</h2><div class="card"><p>أرسلنا كود التحقق برسالة SMS إلى <b>${esc(LG.phone)}</b>.</p><label>الكود</label><input id="lc" inputmode="numeric" maxlength="6" autocomplete="one-time-code"><button class="g w" onclick="checkCode()">تأكيد</button><br><br><div class="row"><button class="l btn" onclick="resendCode()">إعادة الإرسال</button><button class="l btn" onclick="LG.step=0;render()">تعديل الرقم</button></div></div>`;
  }
  if(LG.step==1){
    return `<h2>أدخل الكود</h2><div class="card"><div class="warn">نسخة تجريبية: الزر يفتح واتساب برسالة فيها الكود.</div><a class="btn g w" target="_blank" rel="noopener" href="https://wa.me/2${LG.phone}?text=${encodeURIComponent('كود التحقق لـ '+S.st.name+': '+LG.code)}">فتح واتساب واستلام الكود</a><br><br><label>الكود (4 أرقام)</label><input id="lc" inputmode="numeric" maxlength="4"><button class="g w" onclick="checkCode()">تأكيد</button><br><br><div class="row"><button class="l btn" onclick="resendCode()">إرسال كود جديد</button><button class="l btn" onclick="LG.step=0;render()">تعديل البيانات</button></div></div>`;
  }
  return `<h2>تسجيل الدخول</h2><div class="card"><label>الاسم الحقيقي بالكامل *</label><input id="ln" value="${esc(LG.name)}" autocomplete="name"><label>البريد الإلكتروني *</label><input id="le" type="email" value="${esc(LG.email||'')}" autocomplete="email"><label>رقم الهاتف (واتساب) *</label><input id="lp" type="tel" inputmode="numeric" placeholder="01xxxxxxxxx" value="${esc(LG.phone)}"><button class="w" onclick="sendCode()">إرسال كود التحقق</button></div>
<div class="card"><h3>دخول المالك</h3><label>بريد Gmail</label><input id="oe" type="email" autocomplete="username" value="${OWNER}"><label>كلمة المرور</label><input id="op" type="password" autocomplete="current-password"><button class="dk w" onclick="ownerLogin()">دخول المالك</button></div>`;
};

window.sendCode=()=>{
  const n=$('#ln').value.trim().replace(/\s+/g,' '), e=$('#le').value.trim().toLowerCase(), p=$('#lp').value.trim().replace(/[٠-٩]/g,d=>d.charCodeAt(0)-1632);
  if(n.split(' ').length<2||n.length<6)return toast('اكتب الاسم الحقيقي (اسمين على الأقل)');
  if(!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(e))return toast('البريد الإلكتروني غير صحيح');
  if(!/^01[0125]\d{8}$/.test(p))return toast('رقم الهاتف غير صحيح');
  const u=S.users.find(x=>x.phone==p);if(u&&u.blocked)return toast('هذا الحساب موقوف');
  LG={...LG,step:1,name:n,email:e,phone:p,code:newCode(),exp:Date.now()+300000,last:Date.now(),at:0};
  render();
  if(FBON())fbSend();
};

window.resendCode=()=>{
  if(Date.now()-LG.last<30000)return toast('انتظر 30 ثانية');
  if(FBON())return fbSend();
  LG={...LG,code:newCode(),exp:Date.now()+300000,last:Date.now(),at:0};render();toast('تم توليد كود جديد');
};

window.checkCode=()=>{
  if(FBON()){
    const v=$('#lc').value.trim();if(!LG.conf)return toast('أعد إرسال الكود');
    LG.conf.confirm(v).then(()=>{LG.code=v;LG.exp=Date.now()+1e5;LG.at=0;finishLogin()}).catch(()=>toast('الكود غير صحيح أو منتهي'));
    return;
  }
  if(Date.now()>LG.exp)return toast('انتهت صلاحية الكود');
  if(++LG.at>3){LG.step=0;render();return toast('محاولات كثيرة، ابدأ من جديد')}
  if($('#lc').value.trim()!=LG.code)return toast('الكود غير صحيح');
  finishLogin();
};

function finishLogin(){
  let u=S.users.find(x=>x.phone==LG.phone);
  if(!u){u={id:uid(),phone:LG.phone,joined:new Date().toISOString(),blocked:0};S.users.push(u)}
  u.name=LG.name;u.email=LG.email;
  S.me={id:u.id,name:u.name,phone:u.phone,email:u.email};
  if(u.email===OWNER){S.admin=true;save('adm',1)}
  persist();toast('أهلاً '+u.name);const b=LG.back;LG.step=0;go(b);
}

let OT=0, OL=0;
window.ownerLogin=()=>{
  if(Date.now()<OL)return toast('محاولات كثيرة، انتظر دقيقة');
  const e=$('#oe').value.trim().toLowerCase();
  if(e!==OWNER||$('#op').value!==String(S.st.pin)){
    if(++OT>=5){OT=0;OL=Date.now()+60000}
    return toast('بيانات المالك غير صحيحة');
  }
  OT=0;S.admin=true;save('adm',1);toast('تم دخول المالك');go('admin');
};

// ---------- Customer Actions ----------
window.add=id=>{const i=S.cart.find(x=>x.id==id);if(i)i.q++;else S.cart.push({id,q:1});persist();nav();toast('تمت الإضافة للسلة')};
window.qty=(id,d)=>{const i=S.cart.find(x=>x.id==id);i.q+=d;if(i.q<1)S.cart=S.cart.filter(x=>x.id!=id);persist();render()};
window.addRev=()=>{if(need('reviews'))return;const t=($('#rt').value||'').trim();if(!t)return toast('اكتب رأيك');S.revs.unshift({id:uid(),uid:S.me.id,n:S.me.name,s:RS,t,d:new Date().toLocaleDateString('ar-EG'),hide:0,reply:''});persist();toast('شكراً لتقييمك');render()};

window.order=()=>{
  if(need('cart'))return;const del=$('#om').value=='d',ad=$('#oa').value.trim();if(del&&!ad)return toast('أدخل العنوان');
  const items=S.cart.map(i=>{const x=prod(i.id);return{id:x.id,name:x.name,q:i.q,cost:x.cost,sale:eff(x)}});
  const sub=items.reduce((a,i)=>a+i.sale*i.q,0);
  const sh=del&&!(+S.st.freeShip&&sub>=+S.st.freeShip)?+S.st.ship:0;
  const o={id:uid(),no:S.orders.length+1001,uid:S.me.id,name:S.me.name,phone:S.me.phone,email:S.me.email,addr:del?ad:'استلام من الفرع',items,ship:sh,total:sub+sh,status:'جديد',date:new Date().toISOString(),note:''};
  items.forEach(i=>{const x=prod(i.id);x.stock=Math.max(0,x.stock-i.q);x.sold+=i.q});
  S.orders.unshift(o);S.cart=[];persist();note('تم استلام طلبك #'+o.no,'الإجمالي '+o.total+' '+S.st.cur);
  window.open(wa(`طلب جديد #${o.no}\nالاسم: ${o.name}\nالهاتف: ${o.phone}\n${items.map(i=>`- ${i.name} × ${i.q}`).join('\n')}\nالإجمالي: ${o.total} ${S.st.cur}\nالعنوان: ${o.addr}`),'_blank');
  toast('تم تسجيل طلبك رقم '+o.no);go('me');
};

window.book=()=>{
  if(need('repair'))return;const g=i=>$('#'+i).value.trim(),m=g('bm'),t=g('bt');if(!m||!t)return toast('اكتب الموديل واختر اليوم');
  const b={id:uid(),no:'REP-'+uid().toString(36).toUpperCase().slice(-6),uid:S.me.id,name:S.me.name,phone:S.me.phone,email:S.me.email,device:R.dt+' '+$('#bb').value+' '+m,issue:R.is,desc:g('bx'),date:t,slot:R.sl,svc:R.sv,status:'تم الاستلام',price:0,parts:0,imgs:R.im.slice(),d0:new Date().toISOString()};
  S.books.unshift(b);R.im=[];persist();note('تم استلام حجز الصيانة','حجزك '+b.no+' يوم '+t+' الساعة '+b.slot);
  window.open(wa(`حجز صيانة ${b.no}\nالاسم: ${b.name}\nالهاتف: ${b.phone}\nالجهاز: ${b.device}\nالعطل: ${b.issue} ${b.desc}\nالموعد: ${t} ${b.slot}\nالخدمة: ${b.svc}`),'_blank');
  toast('تم الحجز');go('bk/'+b.id);
};
window.cancelB=id=>{if(confirm('إلغاء الحجز؟')){S.books.find(x=>x.id==id).status='ملغي';persist();render()}};

// ---------- Admin Dashboard & Panel ----------
const A={};
const at=function(){
  const t=[['dash','لوحة التحكم'],['prods','المنتجات'],['cats','التصنيفات الأيقونات'],['prices','الأسعار'],['orders','الطلبات'],['books','الصيانة'],['users','العملاء'],['rev','التقييمات'],['acct','الحسابات'],['set','الإعدادات']],c=H.split('/')[1]||'dash';
  return `<div class="chips"><button class="l btn" onclick="go('home')">→ المتجر</button>${t.map(x=>`<button class="${c==x[0]?'on':''}" onclick="go('admin/${x[0]}')">${x[1]}</button>`).join('')}</div>`;
};

A.login=()=>V.login();

A.dash=()=>{
  const ok=S.orders.filter(o=>!['ملغي','مرتجع'].includes(o.status)),td=ok.filter(o=>o.date.slice(0,10)==today());
  const profit=ok.reduce((a,o)=>a+o.items.reduce((s,i)=>s+(i.sale-i.cost)*i.q,0),0),rep=S.books.filter(b=>b.status=='تم التسليم').reduce((a,b)=>a+(+b.price-+b.parts),0),low=S.prods.filter(p=>p.stock<=p.min);
  const days=[...Array(7)].map((_,i)=>{const d=new Date(Date.now()-(6-i)*864e5).toISOString().slice(0,10);return{d:d.slice(5),v:S.orders.filter(o=>!['ملغي','مرتجع'].includes(o.status)&&o.date.slice(0,10)==d).reduce((a,o)=>a+o.total,0)}}),m=Math.max(...days.map(x=>x.v),1);
  return `${at()}<div class="stats"><div class="stat"><b>${$m(td.reduce((a,o)=>a+o.total,0))}</b>مبيعات اليوم</div><div class="stat"><b>${S.orders.filter(o=>o.status=='جديد').length}</b>طلبات جديدة</div><div class="stat"><b>${S.books.filter(b=>b.date==today()).length}</b>حجوزات اليوم</div><div class="stat"><b>${$m(ok.reduce((a,o)=>a+o.total,0))}</b>إجمالي المبيعات</div><div class="stat"><b>${$m(profit)}</b>ربح المنتجات</div><div class="stat"><b>${$m(rep)}</b>ربح الصيانة</div></div>
<h2>مبيعات آخر 7 أيام</h2><div class="card chart">${days.map(x=>`<div><i style="height:${x.v/m*90}px"></i><small>${x.v}</small><small>${x.d}</small></div>`).join('')}</div>
<h2>منتجات قاربت على النفاد</h2>${low.map(p=>`<div class="card row"><span>${esc(p.name)}</span><span class="low">${p.stock} متبقي</span></div>`).join('')||'<p class="mut">لا يوجد</p>'}
<div class="card"><h3>إعلان لكل العملاء</h3><input id="nt" placeholder="العنوان"><textarea id="nb" placeholder="النص"></textarea><button class="w" onclick="note($('#nt').value,$('#nb').value);toast('تم إرسال الإعلان')">إرسال الإعلان</button></div>`;
};

A.prods=()=>`${at()}<button class="w g" onclick="go('admin/edit/0')">+ إضافة منتج</button><br><br>${S.prods.map(p=>`<div class="card row" style="flex-wrap:nowrap"><div class="th2" style="background:${gr(p.cat)}">${pimg(p)}</div><span style="flex:1">${esc(p.name)}<br><span class="mut">${$m(eff(p))} · مخزون ${p.stock}${p.on?'':' · مخفي'}</span></span><button class="l btn" onclick="go('admin/edit/${p.id}')">تعديل</button></div>`).join('')}`;

let PI=[]; const pvHtml=()=>PI.map((x,i)=>`<div class="th"><img src="${x}"><button class="r" onclick="PI.splice(${i},1);$('#pv').innerHTML=pvHtml()">×</button>${i==0?'<small>الغلاف</small>':`<button class="l mk" onclick="PI.unshift(PI.splice(${i},1)[0]);$('#pv').innerHTML=pvHtml()">غلاف</button>`}</div>`).join('')||'<p class="mut">لا توجد صور بعد</p>';
window.addImgs=el=>{const f=[...el.files].slice(0,5-PI.length);if(!f.length)return toast('الحد الأقصى 5 صور');f.forEach(x=>shrink(x,d=>{PI.push(d);$('#pv').innerHTML=pvHtml();toast('تمت إضافة الصورة')}));el.value=''};

A.edit=id=>{
  const p=prod(id)||{name:'',cat:S.cats[0]&&S.cats[0].id,brand:'',cost:0,price:0,disc:0,stock:0,min:3,desc:'',rate:0,on:1};PI=imgsOf(p).slice();
  const f=(i,l,v,t='text')=>`<label>${l}</label><input id="${i}" type="${t}" value="${esc(v)}">`;
  return `<h2>${+id?'تعديل':'إضافة'} منتج</h2><div class="card"><label>صور المنتج (حتى 5، الأولى هي الغلاف)</label><label class="upl"><input type="file" accept="image/*" multiple hidden onchange="addImgs(this)">+ إضافة صور من الاستوديو</label><div id="pv">${pvHtml()}</div>
${f('pn','الاسم',p.name)}<label>الوصف</label><textarea id="pd">${esc(p.desc)}</textarea><label>التصنيف</label><select id="pc">${S.cats.map(c=>`<option value="${c.id}" ${c.id==p.cat?'selected':''}>${esc(c.name)}</option>`).join('')}</select>${f('pb','الماركة',p.brand)}${f('pr','التقييم (من 5)',p.rate||0,'number')}
${f('pco','سعر الشراء',p.cost,'number')}${f('pp','سعر البيع',p.price,'number')}${f('pdi','سعر الخصم (0 = بدون)',p.disc,'number')}${f('ps','الكمية',p.stock,'number')}${f('pm','حد التنبيه',p.min,'number')}
<label><input type="checkbox" id="pa" ${p.on?'checked':''} style="width:auto;min-height:0"> ظاهر للعملاء</label><br><div class="row"><button class="g" onclick="saveP(${+id})">حفظ</button>${+id?`<button class="r" onclick="delP(${+id})">حذف</button>`:''}<button class="l btn" onclick="go('admin/prods')">رجوع</button></div></div>`;
};

window.saveP=id=>{
  const g=i=>$('#'+i).value,n=g('pn').trim();if(!n)return toast('الاسم مطلوب');
  const d={name:n,desc:g('pd'),cat:+g('pc'),brand:g('pb'),rate:+g('pr')||0,cost:+g('pco'),price:+g('pp'),disc:+g('pdi'),stock:+g('ps'),min:+g('pm'),on:$('#pa').checked?1:0,imgs:PI.slice(),img:PI[0]||''},p=id&&prod(id);
  if(p)Object.assign(p,d);else S.prods.unshift({id:uid(),sold:0,...d});persist();toast('تم الحفظ');go('admin/prods');
};
window.delP=id=>{if(confirm('حذف المنتج؟')){S.prods=S.prods.filter(p=>p.id!=id);persist();go('admin/prods')}};

let OF='الكل',BF='الكل',OQ='';
A.orders=()=>{
  const all=S.orders.filter(o=>(OF=='الكل'||o.status==OF)&&(!OQ||String(o.no+o.name+o.phone).includes(OQ)));
  return `${at()}<input placeholder="ابحث بالرقم أو الاسم أو الهاتف" value="${esc(OQ)}" onchange="OQ=this.value;render()"><div class="chips">${['الكل',...OS].map(s=>`<button class="${OF==s?'on':''}" onclick="OF='${s}';render()">${s}</button>`).join('')}</div>${all.map(o=>`<div class="card"><div class="row"><b>#${o.no} · ${esc(o.name)}</b><b>${$m(o.total)}</b></div><p class="mut">${esc(o.phone)} · ${esc(o.addr)}<br>${o.items.map(i=>esc(i.name)+'×'+i.q).join('، ')}</p>
<select onchange="setO(${o.id},this.value)">${OS.map(s=>`<option ${s==o.status?'selected':''}>${s}</option>`).join('')}</select><a class="btn l" href="tel:${esc(o.phone)}">اتصال</a></div>`).join('')||'<p class="mut">لا توجد طلبات</p>'}`;
};
window.setO=(id,s)=>{const o=S.orders.find(x=>x.id==id);if((s=='ملغي'||s=='مرتجع')&&!['ملغي','مرتجع'].includes(o.status))o.items.forEach(i=>{const p=prod(i.id);if(p){p.stock+=i.q;p.sold-=i.q}});o.status=s;note('تحديث طلبك #'+o.no,'حالة الطلب الآن: '+s);persist();toast('تم التحديث')};

A.books=()=>{
  const all=S.books.filter(b=>(BF=='الكل'||b.status==BF)&&(!OQ||String(b.no+b.name+b.phone).includes(OQ)));
  return `${at()}<input placeholder="ابحث بالرقم أو الاسم أو الهاتف" value="${esc(OQ)}" onchange="OQ=this.value;render()"><div class="chips">${['الكل',...BS].map(s=>`<button class="${BF==s?'on':''}" onclick="BF='${s}';render()">${s}</button>`).join('')}</div>${all.map(b=>`<div class="card"><div class="row"><b>#${b.no} · ${esc(b.name)}</b><span class="tag">${esc(b.date)} ${esc(b.slot)}</span></div><p class="mut">${esc(b.phone)} · ${esc(b.device)}<br>${esc(b.issue)} ${esc(b.desc)} · ${esc(b.svc)}</p>
<select onchange="setB(${b.id},'status',this.value)">${BS.map(s=>`<option ${s==b.status?'selected':''}>${s}</option>`).join('')}</select><label>سعر الإصلاح</label><input type="number" value="${b.price}" onchange="setB(${b.id},'price',+this.value)"><label>تكلفة القطع</label><input type="number" value="${b.parts}" onchange="setB(${b.id},'parts',+this.value)"></div>`).join('')||'<p class="mut">لا توجد حجوزات</p>'}`;
};
window.setB=(id,k,v)=>{const b=S.books.find(x=>x.id==id);b[k]=v;if(k=='status')note('تحديث حجز الصيانة #'+b.no,'الحالة الآن: '+v);persist();toast('تم الحفظ')};

A.cats=()=>`${at()}<h2>التصنيفات والأيقونات</h2>${S.cats.map((c,i)=>`<div class="card row" style="flex-wrap:nowrap"><span class="ci" style="flex:1">${ctile(c,44)}<input value="${esc(c.name)}" onchange="S.cats[${i}].name=this.value;persist();toast('تم ✓')"></span><span><button class="l btn" onclick="mvC(${i},-1)">↑</button><button class="l btn" onclick="mvC(${i},1)">↓</button><button class="l btn" onclick="editCat(${c.id})">أيقونة</button><button class="r btn" onclick="delC(${c.id})">✕</button></span></div>`).join('')}
<div class="card"><h3>تصنيف جديد</h3><input id="cn" placeholder="الاسم"><label class="upl"><input type="file" accept="image/*" hidden onchange="catIcon(this)">+ أيقونة من الاستوديو</label><div id="cpv"></div><button class="g w" onclick="addC()">إضافة</button></div>`;

let CI=''; window.catIcon=el=>{if(el.files[0])shrink(el.files[0],d=>{CI=d;$('#cpv').innerHTML=`<img src="${d}" width="48" style="border-radius:12px">`},200)};
window.addC=()=>{const n=$('#cn').value.trim();if(!n)return toast('اكتب اسم التصنيف');S.cats.push({id:uid(),name:n,icon:'',img:CI});CI='';persist();render()};
window.delC=id=>{S.cats=S.cats.filter(c=>c.id!=id);persist();render()};
window.mvC=(i,d)=>{const j=i+d;if(j<0||j>=S.cats.length)return;[S.cats[i],S.cats[j]]=[S.cats[j],S.cats[i]];persist();render()};
window.editCat=id=>pickImg(d=>{const c=S.cats.find(x=>x.id==id);c.img=d;persist();render();toast('تم تغيير الأيقونة')},200);

A.prices=()=>`${at()}<h2>أسعار المنتجات</h2>${S.prods.map(p=>`<div class="card"><b>${esc(p.name)}</b><div class="grid2"><div><label>سعر البيع</label><input type="number" value="${p.price}" onchange="setP(${p.id},'price',this.value)"></div><div><label>سعر الخصم</label><input type="number" value="${p.disc}" onchange="setP(${p.id},'disc',this.value)"></div></div></div>`).join('')}
<h2>أسعار الصيانة</h2>${S.svc.map(s=>`<div class="card row" style="flex-wrap:nowrap"><input style="flex:2" value="${esc(s.name)}" onchange="setS(${s.id},'name',this.value)"><input style="flex:1" type="number" value="${s.price}" onchange="setS(${s.id},'price',this.value)"><button class="r btn" onclick="delS(${s.id})">✕</button></div>`).join('')}<button class="g w" onclick="S.svc.push({id:uid(),name:'خدمة جديدة',price:0});persist();render()">+ إضافة خدمة</button>`;
window.setP=(id,k,v)=>{prod(id)[k]=+v;persist();toast('تم التحديث ✓')};
window.setS=(id,k,v)=>{const s=S.svc.find(x=>x.id==id);s[k]=k=='price'?+v:v;persist();toast('تم التحديث ✓')};
window.delS=id=>{S.svc=S.svc.filter(x=>x.id!=id);persist();render()};

A.users=()=>`${at()}<h2>العملاء (${S.users.length})</h2>${S.users.map(u=>{const os=S.orders.filter(o=>o.uid==u.id&&!['ملغي','مرتجع'].includes(o.status));return `<div class="card"><div class="row"><b>${esc(u.name)}</b>${u.blocked?'<span class="low">موقوف</span>':''}</div><p class="mut">${esc(u.phone)} · ${esc(u.email||'')} · انضم ${new Date(u.joined).toLocaleDateString('ar-EG')}<br>${os.length} طلب · ${$m(os.reduce((a,o)=>a+o.total,0))} · ${S.books.filter(b=>b.uid==u.id).length} حجز صيانة</p><div class="row"><a class="btn g" target="_blank" rel="noopener" href="https://wa.me/2${esc(u.phone)}">واتساب</a><button class="${u.blocked?'g':'r'} btn" onclick="blk(${u.id})">${u.blocked?'تفعيل':'حظر'}</button></div></div>`}).join('')||'<p class="mut">لا يوجد عملاء بعد</p>'}`;
window.blk=id=>{const u=S.users.find(x=>x.id==id);u.blocked=u.blocked?0:1;if(u.blocked&&S.me&&S.me.id==id)S.me=null;persist();render()};

A.rev=()=>`${at()}<h2>التقييمات (${S.revs.length})</h2>${S.revs.map(r=>`<div class="card"><div class="row"><b>${esc(r.n)}</b><span class="star">${stars(r.s)}</span></div><p>${esc(r.t)}</p><input placeholder="رد المتجر" value="${esc(r.reply||'')}" onchange="rv('${r.id}','reply',this.value)"><div class="row"><button class="l btn" onclick="rv('${r.id}','hide',${r.hide?0:1})">${r.hide?'إظهار':'إخفاء'}</button><button class="r btn" onclick="rv('${r.id}','del')">حذف</button></div></div>`).join('')||'<p class="mut">لا توجد تقييمات</p>'}`;
window.rv=(id,k,v)=>{const i=S.revs.findIndex(r=>r.id==id);if(i<0)return;if(k=='del'){if(!confirm('حذف التقييم؟'))return;S.revs.splice(i,1)}else S.revs[i][k]=v;persist();render()};

A.acct=()=>{
  const ok=S.orders.filter(o=>!['ملغي','مرتجع'].includes(o.status)), it=ok.flatMap(o=>o.items), rev=it.reduce((a,i)=>a+i.sale*i.q,0), cogs=it.reduce((a,i)=>a+i.cost*i.q,0);
  const rep=S.books.filter(b=>b.status=='تم التسليم'), rr=rep.reduce((a,b)=>a+ +b.price,0), rp=rep.reduce((a,b)=>a+ +b.parts,0);
  const ex=S.exp.filter(e=>e.type=='مصروف').reduce((a,e)=>a+e.amt,0), net=rev-cogs+rr-rp-ex;
  const s=(l,v)=>`<div class="stat"><b>${$m(v)}</b>${l}</div>`;
  return `${at()}<div class="stats">${s('مبيعات المنتجات',rev)}${s('تكلفة البضاعة المباعة',cogs)}${s('ربح المنتجات',rev-cogs)}${s('إيراد الصيانة',rr)}${s('تكلفة قطع الغيار',rp)}${s('المصروفات',ex)}${s('صافي الربح',net)}</div>
<h2>تسجيل مصروف</h2><div class="card"><select id="ek"><option>مصروف</option><option>مشتريات</option></select><input id="et" placeholder="البيان"><input id="ea" type="number" placeholder="المبلغ"><button class="w" onclick="addE()">إضافة</button></div>
${S.exp.map(e=>`<div class="card row"><span>${esc(e.type)} · ${esc(e.title)}<br><span class="mut">${esc(e.date)}</span></span><span><b>${$m(e.amt)}</b> <button class="r btn" onclick="delE(${e.id})">✕</button></span></div>`).join('')}`;
};
window.addE=()=>{const t=$('#et').value.trim(),a=+$('#ea').value;if(!t||!(a>0))return toast('اكتب البيان والمبلغ');S.exp.unshift({id:uid(),type:$('#ek').value,title:t,amt:a,date:today()});persist();render()};
window.delE=id=>{S.exp=S.exp.filter(e=>e.id!=id);persist();render()};

A.set=()=>{
  const s=S.st,f=(k,l,t='text')=>`<label>${l}</label><input id="s_${k}" type="${t}" value="${esc(s[k])}">`;
  return `${at()}<div class="card"><h3>بيانات المتجر</h3>${f('name','الاسم')}${f('phone','الهاتف')}${f('wa','واتساب (20...)')}${f('fb','رابط فيسبوك')}${f('map','رابط الموقع')}${f('hours','ساعات العمل')}${f('ship','سعر الشحن','number')}<button class="w" onclick="saveS()">حفظ البيانات</button></div>
<div class="card"><h3>تغيير كلمة مرور المالك</h3><label>كلمة المرور الحالية</label><input id="pw0" type="password"><label>الجديدة (4 أحرف على الأقل)</label><input id="pw1" type="password"><label>تأكيد الجديدة</label><input id="pw2" type="password"><button class="w" onclick="chgPw()">تغيير كلمة المرور</button></div>
<button class="l btn w" onclick="S.admin=false;save('adm',0);go('home')">خروج من لوحة التحكم</button>`;
};
window.saveS=()=>{Object.keys(S.st).forEach(k=>{const e=$('#s_'+k);if(e)S.st[k]=e.type=='number'?+e.value:e.value});persist();toast('تم الحفظ');nav()};
window.chgPw=()=>{const a=$('#pw0').value,b=$('#pw1').value,c=$('#pw2').value;if(a!==String(S.st.pin))return toast('كلمة المرور الحالية خطأ');if(b.length<4)return toast('الجديدة قصيرة (4 على الأقل)');if(b!==c)return toast('التأكيد غير مطابق');S.st.pin=b;S.st.pinSet=1;persist();toast('تم تغيير كلمة المرور ✓');render()};

// ---------- Router & Navigation ----------
let H=location.search.includes('admin')?'admin':'home';
window.go=h=>{H=h;render()};

function nav(){
  const h=H.split('/')[0],n=S.cart.reduce((a,i)=>a+i.q,0),un=S.notes.filter(x=>!x.r).length;
  document.body.className=h=='admin'?'adm':'';
  const fab=$('#fab');if(fab)fab.href=wa('مرحبا');
  if(h=='admin'){
    $('#nav').innerHTML='';
    $('#top').innerHTML=`<span>لوحة المالك</span><a onclick="go('home')" style="color:#fff">المتجر</a>`;
    return;
  }
  $('#top').innerHTML=`<span>${esc(S.st.name)}</span><span>${S.admin?`<button onclick="go('admin')" style="min-height:34px;padding:4px 10px;background:#0F172A">🔑 المالك</button> `:''}${window.DP?`<button onclick="inst()" style="background:#fff;color:#1D4ED8;min-height:34px;padding:4px 12px">تثبيت</button>`:''}</span>`;
  $('#nav').innerHTML=`<div class="brand"><b>${esc(S.st.name)}</b><br><small class="mut">صيانة سماعات وإكسسوارات الهواتف</small></div>`+
    [['home',I.home,NL('home','الرئيسية')],['products',I.bag,NL('products','المنتجات')],['cart',I.cart,NL('cart','السلة'),n],['repair',I.wr,NL('repair','الصيانة')],['me',I.user,NL('me','حسابي')],['reviews',I.star,NL('reviews','التقييمات')],['notes',I.bell,NL('notes','الإشعارات'),un]].map(x=>`<a onclick="go('${x[0]}')" class="${h==x[0]?'on':''}"><b>${x[1]}</b>${x[2]}${x[3]?`<i>${x[3]}</i>`:''}</a>`).join('')+
    (S.admin?`<a class="adm2" onclick="go('admin')"><b>▦</b>لوحة التحكم</a>`:'');
}

function render(){
  const p=H.split('/');let html;
  if(p[0]=='admin')html=!S.admin?A.login():(A[p[1]=='edit'?'edit':p[1]||'dash']||A.dash)(p[2]);
  else if(p[0]=='me'&&!S.me){LG.back='me';html=V.login()}
  else html=(V[p[0]]||V.home)(p[1]);
  
  $('#app').innerHTML=html;
  if(p[0]=='notes'){S.notes.forEach(n=>n.r=1);persist()}
  nav();
  
  const e=$('#inst');
  if(e&&!matchMedia('(display-mode: standalone)').matches&&!navigator.standalone){
    const ios=/iphone|ipad/i.test(navigator.userAgent);
    e.innerHTML=`<div class="card"><h3>📲 تثبيت التطبيق على موبايلك</h3>${window.DP?'<br><button class="g w" onclick="inst()">تثبيت الآن</button>':`<p>${ios?'اضغط زر المشاركة ثم «إضافة إلى الشاشة الرئيسية».':'من قائمة المتصفح ⋮ اختر «تثبيت التطبيق» أو «إضافة إلى الشاشة الرئيسية».'}</p>`}</div>`;
  }
  scrollTo(0,0);
}

// ---------- App Initialization ----------
if(!document.getElementById('fab')){
  document.body.insertAdjacentHTML('beforeend','<a class="fab" id="fab" target="_blank" rel="noopener">💬</a>');
}

addEventListener('beforeinstallprompt',e=>{e.preventDefault();window.DP=e;nav()});
window.inst=()=>{if(window.DP){DP.prompt();DP.userChoice.then(()=>{window.DP=null;render()})}};

render();
if('serviceWorker' in navigator)addEventListener('load',()=>navigator.serviceWorker.register('sw.js'));

