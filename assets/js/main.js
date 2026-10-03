/* SKS World School GNW — site script */
/* Scroll reveal for text. Labels fade in, headings slide up, paragraphs and list items fade up.
   Each element animates once; elements entering together are staggered 100ms in page order. */
(()=>{
  if(!("IntersectionObserver" in window)||matchMedia("(prefers-reduced-motion: reduce)").matches)return;
  const SKIP=".vhero,.awards,.tcar,.ph,button,.btn,nav,form,template,.modal,.wing-tabs,.wing-panel,.track,header,footer";  // .track: slider cards already move sideways
  document.querySelectorAll("main, .cta-band").forEach(scope=>
    scope.querySelectorAll(".eyebrow,h1,h2,h3,h4,p,li").forEach(el=>{
      if(el.closest(SKIP)||!el.textContent.trim())return;
      if(el.matches("p,li")&&el.querySelector(".btn,button,img"))return;   // paragraphs that only hold a button or image
      if(el.parentElement.closest(".reveal"))return;                        // parent already animates
      el.classList.add("reveal",el.matches(".eyebrow")?"reveal-label":el.matches("h1,h2,h3,h4")?"reveal-head":"reveal-up");
    }));
  document.documentElement.classList.add("js");
  const io=new IntersectionObserver(entries=>{
    entries.filter(e=>e.isIntersecting).map(e=>e.target)
      .sort((a,b)=>a.compareDocumentPosition(b)&Node.DOCUMENT_POSITION_FOLLOWING?-1:1)
      .forEach((el,i)=>{
        el.style.transitionDelay=Math.min(i,8)*100+"ms";
        el.classList.add("in");io.unobserve(el);
        el.addEventListener("transitionend",()=>el.style.removeProperty("transition-delay"),{once:true});
      });
  },{threshold:.15});
  document.querySelectorAll(".reveal").forEach(el=>io.observe(el));
})();
const WINGS=[
 {k:"Pre-Primary",s:"Pre-Nursery, Nursery, KG",img:"Pre-primary flower drill",src:"assets/images/gallery/sports-day-flower-drill.webp",d:"“We play as we learn and we learn as we play.” A play- and activity-based foundational stage focused on socialisation, language, motor development and basic cognitive skills.",l:["Early literacy & phonics","Number readiness","Art, craft & music","Motor-skill & sensory play"],kv:[["Class size","25 per class"],["Admission","Registration, small written test, interaction with the Principal"]]},
 {k:"Primary",s:"Classes I–V",img:"Primary adventure activity",src:"assets/images/gallery/adventure-rope-walk.webp",d:"Strong foundations in language, mathematics and environmental studies through the NCERT-based CBSE curriculum, with plenty of hands-on and project work.",l:["English, Hindi & a third language","Mathematics with a fully equipped Math Lab","EVS / Science","Computer basics & robotics"],kv:[["Class size","30 in I–II, 35 from III"],["Admission","Registration, documents, interaction"]]},
 {k:"Middle",s:"Classes VI–VIII",img:"Middle school sports day",src:"assets/images/gallery/sports-day-hoop-race.webp",d:"Deeper subject knowledge with structured lab work in Science and Mathematics, alongside music, sport and educational visits.",l:["Science: Physics, Chemistry, Biology","Social Science","Computer Science & LEGO robotics","Inter-house sports & cultural events"],kv:[["Class size","Up to 35"],["Admission","Registration, written test, interaction"]]},
 {k:"Secondary & Sr. Secondary",s:"Classes IX–XII",img:"Senior students",src:"assets/images/gallery/annual-day-class-4.webp",d:"Classes IX–X prepare for the CBSE Class X board; all streams are available in XI–XII, leading to the Class XII board examination.",l:["All streams in Classes XI–XII","Board examination preparation","Career and stream guidance","Terminals, revision & pre-board tests"],kv:[["Results","100% CBSE board results"],["Admission","Written test; XI stream subject to Class X result"]]}
];
function buildWings(tabsId,panelId){
  const tabs=document.getElementById(tabsId),panel=document.getElementById(panelId);
  const show=i=>{
    [...tabs.children].forEach((b,j)=>b.setAttribute("aria-selected",j===i));
    const w=WINGS[i];
    panel.innerHTML=`<div class="ph">${w.src?`<img src="${w.src}" alt="${w.img} at SKS World School, Greater Noida West" loading="lazy">`:`<span>${w.img}</span>`}</div><div class="wing-body"><span class="eyebrow">${w.s}</span><h3>${w.k}</h3><p>${w.d}</p><ul>${w.l.map(x=>`<li>${x}</li>`).join("")}</ul><dl class="kv">${w.kv.map(([a,b])=>`<dt>${a}</dt><dd>${b}</dd>`).join("")}</dl><button class="btn btn-brand" data-enq style="justify-self:start">Enquire About ${w.k}</button></div>`;
  };
  WINGS.forEach((w,i)=>{const b=document.createElement("button");b.role="tab";b.innerHTML=`${w.k}<small>${w.s}</small>`;b.onclick=()=>show(i);tabs.appendChild(b)});
  show(0);
}
if(document.getElementById("wingTabs"))buildWings("wingTabs","wingPanel");if(document.getElementById("wingTabs2"))buildWings("wingTabs2","wingPanel2");

document.querySelectorAll("[data-slide]").forEach(b=>b.addEventListener("click",()=>{
  const t=document.getElementById(b.dataset.slide);t.scrollBy({left:(t.firstElementChild.offsetWidth+18)*+b.dataset.dir,behavior:"smooth"});
}));

/* Forms post to the Node.js backend (backend/ folder). Leave API_BASE empty when that server also serves
   this website; otherwise set it to the backend's address, e.g. "https://api.skswsgnw.ac.in". */
const API_BASE="";
const digits=v=>{let d=v.replace(/\D/g,"");if(d.length===12&&d.startsWith("91"))d=d.slice(2);if(d.length===11&&d.startsWith("0"))d=d.slice(1);return d;};
const RULES={
  parent:v=>v.trim().length<2?"Please enter the parent’s name.":"",
  name:v=>v.trim().length<2?"Please enter your name.":"",
  phone:v=>/^[6-9]\d{9}$/.test(digits(v))?"":"Please enter a valid 10-digit mobile number.",
  email:(v,el)=>!v.trim()?(el.required?"Please enter your email address.":""):el.checkValidity()&&/\.[^.@\s]{2,}$/.test(v.trim())?"":el.required?"Please enter a valid email address.":"Please enter a valid email address, or leave it blank.",
  grade:v=>v?"":"Please select your child’s grade.",
  subject:v=>v.trim().length<2?"Please enter a subject.":"",
  batch:v=>/^\d{4}$/.test(v.trim())&&+v>=1950&&+v<=new Date().getFullYear()?"":"Please enter a valid year of passing out, e.g. 2020.",
  message:(v,el)=>el.required&&v.trim().length<5?"Please enter your message.":"",
  position:v=>v?"":"Please select the post you are applying for.",
  resume:(v,el)=>{const f=el.files[0];return !f?"Please attach your resume (PDF, max 2 MB).":!/\.pdf$/i.test(f.name)?"Please upload your resume as a PDF file.":f.size>2*1024*1024?"Your resume must be 2 MB or smaller.":"";},
};
const setErr=(el,msg)=>{const s=el.closest("label")?.querySelector(".err");el.setAttribute("aria-invalid",msg?"true":"false");if(s){s.textContent=msg;s.hidden=!msg;}};
// Checks a field on leaving it (or on change for selects/files), once it has a value or is already marked wrong.
// A field marked wrong clears as soon as its value becomes valid while typing, so the layout does not shift
// on blur and swallow a click on the submit button.
function liveCheck(f){Object.keys(RULES).forEach(n=>{const el=f.elements[n];if(!el)return;
  el.addEventListener(el.tagName==="SELECT"||el.type==="file"?"change":"blur",()=>{if(el.value||el.getAttribute("aria-invalid")==="true")setErr(el,RULES[n](el.value,el));});
  el.addEventListener("input",()=>{if(el.getAttribute("aria-invalid")==="true"&&!RULES[n](el.value,el))setErr(el,"");});});}
function checkForm(f){let bad=null;
  Object.keys(RULES).forEach(n=>{const el=f.elements[n];if(!el)return;const m=RULES[n](el.value,el);setErr(el,m);if(m&&!bad)bad=el;});
  if(bad)bad.focus();return !bad;}
// Spam trap: a field people never see. Bots that fill every field get silently ignored by the server.
function addHoneypot(f){if(f.elements.website)return;const l=document.createElement("label");l.className="hp";l.setAttribute("aria-hidden","true");
  l.innerHTML='Leave this empty<input name="website" tabindex="-1" autocomplete="off">';f.prepend(l);}
function formMsg(f,msg){let p=f.querySelector(".form-msg");
  if(!p){p=document.createElement("p");p.className="err form-msg";p.setAttribute("role","alert");f.querySelector("[type=submit]").before(p);}
  p.textContent=msg;p.hidden=!msg;}
// Sends a form to /api/<path> (or to a full URL); returns true on success. On failure shows the server's message (and field errors) in the form.
async function sendForm(f,path,body,fieldMap={}){
  const btn=f.querySelector("[type=submit]"),label=btn.textContent,isFile=body instanceof FormData;
  btn.disabled=true;btn.textContent="Sending…";formMsg(f,"");
  let msg="",first=null;
  try{
    const r=await fetch(/^https?:/.test(path)?path:API_BASE+"/api/"+path,{method:"POST",body:isFile?body:JSON.stringify(body),headers:isFile?{}:{"Content-Type":"application/json"}});
    const d=await r.json().catch(()=>({}));
    if(r.ok&&d.ok)return true;
    Object.entries(d.errors||{}).forEach(([n,m])=>{const el=f.elements[fieldMap[n]||n];if(el){setErr(el,m);first=first||el;}});
    msg=d.message||"Sorry, your form could not be sent. Please try again.";
  }catch{msg="We could not reach the server. Please check your internet connection and try again, or call +91-98910 81270.";}
  finally{btn.disabled=false;btn.textContent=label;}
  formMsg(f,msg);(first||btn).focus();return false;
}
const done=(box,text)=>{const ok=document.createElement("div");ok.className="ok";ok.setAttribute("role","status");ok.tabIndex=-1;ok.textContent=text;box.replaceChildren(ok);ok.focus();};

const tpl=document.getElementById("formTpl");
document.querySelectorAll(".enq-slot").forEach(s=>{
  s.appendChild(tpl.content.cloneNode(true));
  const f=s.querySelector("form");addHoneypot(f);
  f.querySelectorAll("input,select").forEach(el=>el.id=el.name+"-"+Math.random().toString(36).slice(2,7));
  f.addEventListener("submit",async e=>{e.preventDefault();
    const v=n=>f.elements[n].value;
    if(await sendForm(f,"admission-enquiry",{parent:v("n"),phone:v("p"),grade:v("c"),website:v("website"),source:"contact-page"},{parent:"n",phone:"p",grade:"c"}))
      done(s,"Thank you. Our admission team will call you shortly.");
  });
});

/* Admissions popup: opens from any [data-enq] button (Apply Now, Enquire Now…) */
const modal=document.getElementById("modal"),popupBody=document.getElementById("popupBody"),popupFormHTML=popupBody.innerHTML;
let opener=null;
const focusables=()=>[...modal.querySelectorAll("button,input,select,textarea,a[href]")].filter(el=>!el.disabled&&el.offsetParent);
function openModal(btn){
  opener=btn;
  try{sessionStorage.setItem("sksPopupShown","1")}catch{}   // the homepage auto-open then skips this visit
  if(!document.getElementById("popupForm")){popupBody.innerHTML=popupFormHTML;bindPopupForm();}
  modal.hidden=false;document.body.style.overflow="hidden";
  modal.querySelector(".modal-card").scrollTop=0;
  (btn?modal.querySelector("input"):Object.assign(modal.querySelector(".modal-card"),{tabIndex:-1})).focus();   // auto-open: no keyboard pop-up on phones
}
function closeModal(){
  if(modal.hidden)return;
  modal.hidden=true;document.body.style.overflow="";
  if(opener)opener.focus();
}
document.addEventListener("click",e=>{const b=e.target.closest("[data-enq]");if(b){e.preventDefault();openModal(b);}});
document.getElementById("mx").onclick=closeModal;
modal.addEventListener("click",e=>{if(e.target===modal)closeModal()});
document.addEventListener("keydown",e=>{
  if(modal.hidden)return;
  if(e.key==="Escape")closeModal();
  if(e.key==="Tab"){const f=focusables(),first=f[0],last=f[f.length-1];
    if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}
    else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}}
});

const POPUP_API="https://newwebsitesks04.vercel.app/api/enquiry";   // admissions popup endpoint
function bindPopupForm(){
  const f=document.getElementById("popupForm");
  addHoneypot(f);liveCheck(f);
  f.addEventListener("submit",async e=>{
    e.preventDefault();
    if(!checkForm(f))return;
    const body=Object.fromEntries(new FormData(f));body.source="popup";
    if(!await sendForm(f,POPUP_API,body))return;
    // GA4 lead event fires if a tag is installed.
    if(window.dataLayer)window.dataLayer.push({event:"generate_lead",form:"admissions_popup",grade:f.elements.grade.value});
    done(popupBody,"Thank you! Our admissions team will call you shortly.");
  });
}
bindPopupForm();
// Homepage: open the popup by itself after 8 seconds, once per visit (browser tab session).
if(document.querySelector(".vhero")){
  const seen=()=>{try{return sessionStorage.getItem("sksPopupShown")==="1"}catch{return false}};
  if(!seen())setTimeout(()=>{if(modal.hidden&&!seen())openModal(null)},8000);
}

const hamb=document.getElementById("hamb"),nav=document.getElementById("nav");
hamb.onclick=()=>{const o=nav.classList.toggle("open");hamb.setAttribute("aria-expanded",o)};


/* Sister-site links: paste each website URL here and the buttons go live */
const SITES={hs01:"",ss137:"",hospital:"",college:""};
document.querySelectorAll("[data-site]").forEach(el=>{const u=SITES[el.dataset.site];
  el.innerHTML=u?`<a class="btn btn-brand" href="${u}" target="_blank" rel="noopener">Visit Website ↗</a>`:'<span class="status st-pend">Website link to be added</span>';});
const tcF=document.getElementById("tcForm");
if(tcF)tcF.addEventListener("submit",e=>{e.preventDefault();document.getElementById("tcOut").innerHTML='<div class="ok" style="margin-top:12px">Online verification goes live once this form is connected to the school ERP. Please contact the school office meanwhile.</div>';});
const cs=document.querySelector(".career-slot");
if(cs){cs.innerHTML='<form class="enq" id="careerForm" novalidate><label>Full name<input name="name" id="cr-n" required autocomplete="name"><small class="err" hidden></small></label><label>Mobile number<input name="phone" id="cr-p" type="tel" required inputmode="numeric" autocomplete="tel-national" maxlength="14"><small class="err" hidden></small></label><label>Email<input name="email" id="cr-e" type="email" required autocomplete="email"><small class="err" hidden></small></label><label>Post applied for<select name="position" id="cr-s" required><option value="">Select</option><option>PGT</option><option>TGT</option><option>PRT</option><option>Pre-Primary Teacher</option><option>Administrative Staff</option></select><small class="err" hidden></small></label><label><span>Resume <span class="opt">(PDF, max 2 MB)</span></span><input name="resume" id="cr-r" type="file" required accept=".pdf,application/pdf"><small class="err" hidden></small></label><button class="btn btn-gold" type="submit">Submit Application</button></form>';
const cf=document.getElementById("careerForm");addHoneypot(cf);liveCheck(cf);
cf.addEventListener("submit",async e=>{e.preventDefault();
  if(checkForm(cf)&&await sendForm(cf,"careers",new FormData(cf)))done(cs,"Thank you. HR will contact you if your profile matches an opening.");});}
const ctf=document.getElementById("contactForm");
if(ctf){addHoneypot(ctf);liveCheck(ctf);
  ctf.addEventListener("submit",async e=>{e.preventDefault();
    if(checkForm(ctf)&&await sendForm(ctf,"contact",Object.fromEntries(new FormData(ctf))))done(ctf.parentElement,"Thank you. We have received your message and will get back to you soon.");});}
const alf=document.getElementById("alumniForm");
if(alf){addHoneypot(alf);liveCheck(alf);
  alf.addEventListener("submit",async e=>{e.preventDefault();
    if(checkForm(alf)&&await sendForm(alf,"alumni",Object.fromEntries(new FormData(alf))))done(alf.parentElement,"Thank you for registering. We will keep you posted about alumni meets and school events.");});}
const here=location.pathname.split("/").pop()||"index.html";
document.querySelectorAll("nav.main a").forEach(a=>{if(a.getAttribute("href")===here)a.classList.add("on")});

/* Hero carousel: each slide shows for 6s, then crossfades (1s) into the next; loops through all slides.
   A slide's media comes from its data-src. An image path (.webp/.jpg/…) becomes an <img> with a slow zoom;
   a video path (.mp4/.webm) becomes a muted, looping, inline <video>, with data-src's poster in data-poster if given.
   Only the first slide loads up front; each other slide loads just before its turn.
   Progress bars fill with the timer; clicking one jumps to that slide. Pause/play stops the timer, zoom and video.
   Reduced motion: only the first slide and headline, no zoom (handled in CSS). */
(()=>{
  const hero=document.querySelector(".vhero");if(!hero)return;
  const mbar=document.querySelector(".mbar");   // fill the screen below the top bar + header, above the mobile action bar
  const setH=()=>hero.style.setProperty("--vh-off",hero.getBoundingClientRect().top+scrollY+(mbar?mbar.offsetHeight:0)+"px");
  setH();addEventListener("resize",setH);
  const slides=[...hero.querySelectorAll(".vh-slide")],lines=[...hero.querySelectorAll(".vh-line")],
        dots=[...hero.querySelectorAll(".vh-dot")],toggle=hero.querySelector(".vh-toggle"),live=hero.querySelector(".vh-lines");
  const media=i=>slides[i].firstElementChild;
  function build(i){
    const s=slides[i];if(media(i))return;
    const src=s.dataset.src,isVid=/\.(mp4|webm|ogv|mov)(\?|#|$)/i.test(src);let el;
    if(isVid){
      el=document.createElement("video");
      Object.assign(el,{muted:true,loop:true,playsInline:true,autoplay:i===cur,preload:"auto"});
      el.setAttribute("muted","");el.setAttribute("playsinline","");el.setAttribute("aria-hidden","true");
      if(s.dataset.poster)el.poster=s.dataset.poster;
    }else{
      el=document.createElement("img");el.alt=s.dataset.alt||"";el.decoding="async";
      if(i)el.loading="lazy";else el.fetchPriority="high";
    }
    el.src=src;s.appendChild(el);
  }
  const reduced=matchMedia("(prefers-reduced-motion: reduce)").matches;
  let cur=0;
  build(0);
  if(reduced){const v=media(0);if(v.tagName==="VIDEO"){v.autoplay=false;v.pause()}return}
  const DUR=6000,FADE=1000;
  let elapsed=0,last=0,userPaused=false,visible=true,raf=0;
  const running=()=>!userPaused&&visible;
  const playV=i=>{const v=media(i);if(v&&v.tagName==="VIDEO"){const p=v.play();if(p)p.catch(()=>{})}};   // autoplay may be blocked; the poster shows instead
  const pauseV=i=>{const v=media(i);if(v&&v.tagName==="VIDEO")v.pause()};
  function go(i){
    if(i===cur)return;
    const prev=cur;cur=i;elapsed=0;
    slides[prev].classList.replace("is-on","is-out");   // keeps zooming while it fades out
    setTimeout(()=>{if(prev!==cur){slides[prev].classList.remove("is-out");pauseV(prev)}},FADE);
    build(i);slides[i].classList.remove("is-out");slides[i].classList.add("is-on");
    const v=media(i);if(v.tagName==="VIDEO")v.currentTime=0;
    if(running())playV(i);
    lines.forEach((l,k)=>{l.classList.toggle("is-on",k===i);l.setAttribute("aria-hidden",k!==i)});
    const ln=lines[i];ln.classList.add("is-in");ln.offsetWidth;ln.classList.remove("is-in");   // start below, then slide up
    dots.forEach((d,k)=>{d.toggleAttribute("aria-current",k===i);d.firstElementChild.style.setProperty("--p",0)});
    build((i+1)%slides.length);
  }
  function tick(t){
    if(last)elapsed+=Math.min(t-last,100);last=t;
    dots[cur].firstElementChild.style.setProperty("--p",Math.min(elapsed/DUR,1));
    if(elapsed>=DUR)go((cur+1)%slides.length);
    raf=requestAnimationFrame(tick);
  }
  function sync(){
    cancelAnimationFrame(raf);last=0;
    hero.classList.toggle("is-halted",!running());hero.classList.toggle("is-paused",userPaused);
    if(running()){playV(cur);raf=requestAnimationFrame(tick)}else pauseV(cur);
  }
  dots.forEach((d,i)=>d.addEventListener("click",()=>{go(i);sync()}));
  toggle.addEventListener("click",()=>{
    userPaused=!userPaused;
    toggle.setAttribute("aria-label",userPaused?"Play slideshow":"Pause slideshow");
    live.setAttribute("aria-live",userPaused?"polite":"off");   // announce headline changes only when not auto-rotating
    sync();
  });
  if("IntersectionObserver" in window)new IntersectionObserver(([e])=>{visible=e.isIntersecting;sync()}).observe(hero);
  build(1);sync();
})();

/* Testimonials carousel: arrows, dots, swipe (native scroll-snap), auto-slide every 5s.
   Auto-slide pauses on hover, keyboard focus, an opened "Read more", when off screen, and with reduced motion.
   Long quotes are clamped to 5 lines with a "Read more" toggle. */
(()=>{
  const car=document.querySelector(".tcar");if(!car)return;
  const track=car.querySelector(".tcar-track"),cards=[...track.children],nav=car.querySelector(".tcar-nav"),
        dotsBox=car.querySelector(".tcar-dots"),arrows=car.querySelectorAll(".tcar-arrow");
  const reduced=matchMedia("(prefers-reduced-motion: reduce)").matches;
  let per=1,last=0,timer=0,hover=false,focus=false,visible=true;
  const perView=()=>Math.max(1,Math.round((track.clientWidth+parseFloat(getComputedStyle(car).getPropertyValue("--gap")))/(cards[0].offsetWidth+parseFloat(getComputedStyle(car).getPropertyValue("--gap")))));
  const current=()=>{let best=0,d=Infinity;cards.forEach((c,i)=>{const x=Math.abs(c.offsetLeft-cards[0].offsetLeft-track.scrollLeft);if(x<d){d=x;best=i}});return Math.min(best,last)};
  const go=i=>{i=(i+last+1)%(last+1);track.scrollTo({left:cards[i].offsetLeft-cards[0].offsetLeft,behavior:reduced?"auto":"smooth"})};
  function markDots(){const c=current();[...dotsBox.children].forEach((d,k)=>d.setAttribute("aria-current",k===c?"true":"false"))}
  function clampCheck(){cards.forEach(c=>{const p=c.querySelector("blockquote p"),b=c.querySelector(".tcard-more");if(c.classList.contains("open"))return;b.hidden=p.scrollHeight<=p.clientHeight+1})}
  function layout(){
    per=perView();last=Math.max(0,cards.length-per);
    nav.hidden=last===0;
    dotsBox.replaceChildren(...Array.from({length:last+1},(_,k)=>{const b=document.createElement("button");b.type="button";
      b.setAttribute("aria-label",`Show testimonial ${k+1}`);b.innerHTML="<span></span>";b.onclick=()=>{go(k);restart()};return b}));
    markDots();clampCheck();restart();
  }
  const running=()=>!reduced&&last>0&&!hover&&!focus&&visible&&!document.hidden&&!car.querySelector(".tcard.open");
  function restart(){clearInterval(timer);if(running())timer=setInterval(()=>go(current()+1),5000)}
  arrows.forEach(a=>a.addEventListener("click",()=>{go(current()+ +a.dataset.dir);restart()}));
  let st=0;track.addEventListener("scroll",()=>{clearTimeout(st);st=setTimeout(markDots,80)},{passive:true});
  car.addEventListener("mouseenter",()=>{hover=true;restart()});car.addEventListener("mouseleave",()=>{hover=false;restart()});
  car.addEventListener("focusin",()=>{focus=true;restart()});car.addEventListener("focusout",e=>{if(!car.contains(e.relatedTarget)){focus=false;restart()}});
  document.addEventListener("visibilitychange",restart);
  if("IntersectionObserver" in window)new IntersectionObserver(([e])=>{visible=e.isIntersecting;restart()}).observe(car);
  cards.forEach(c=>{const b=c.querySelector(".tcard-more");b.addEventListener("click",()=>{
    const open=c.classList.toggle("open");b.textContent=open?"Read less":"Read more";b.setAttribute("aria-expanded",open);restart();})});
  let rt=0;addEventListener("resize",()=>{clearTimeout(rt);rt=setTimeout(layout,150)});
  layout();
})();

