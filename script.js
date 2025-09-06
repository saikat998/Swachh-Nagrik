// --- Simple App Logic for index.html structure ---

// Splash screen: show for 4 seconds, then go to login
window.addEventListener("load", () => {
  setTimeout(() => {
    goToPage("login");
    document.getElementById("splash").classList.remove("active");
    document.getElementById("login").classList.add("active");
    updatePoints(0); // Ensure points display is updated on load
  }, 4000);
});

// Simple navigation for .page sections
function goToPage(pageId) {
  document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
  document.getElementById(pageId).classList.add("active");
  if (pageId === "dashboard") {
    updatePoints(0);
  }
  if (pageId === "calendar") {
    renderCalendarSimple();
  }
}

// OTP Verification
function verifyOTP() {
  const otp = document.getElementById("otpInput").value;
  if (otp === "1234") {
    goToPage("profile");
  } else {
    alert("Invalid OTP. Try 1234.");
  }
}

// Points System
let points = parseInt(localStorage.getItem("points")) || 0;
function updatePoints(val) {
  points += val;
  localStorage.setItem("points", points);
  const pointsElem = document.getElementById("points");
  if (pointsElem) pointsElem.innerText = points;
}

// Report Issue
function submitIssue() {
  const issue = document.getElementById("issueText").value;
  if (issue.trim() === "") {
    alert("Please describe the issue.");
    return;
  }
  alert("Issue submitted successfully!");
  updatePoints(10);
  document.getElementById("issueText").value = "";
  goToPage("dashboard");
}

// Tabs for Fines & Rewards
function showTab(tabId) {
  document.querySelectorAll(".tab").forEach(t => t.classList.add("hidden"));
  document.getElementById(tabId).classList.remove("hidden");
}

function payFine() {
  alert("Fine Paid Successfully!");
}

function redeemReward() {
  if (points >= 10) {
    updatePoints(-10);
    alert("You redeemed 10 points!");
  } else {
    alert("Not enough points.");
  }
}

// Quiz
function submitQuiz(correct) {
  if (correct) {
    alert("Correct! You earned a certificate.");
    updatePoints(20);
    const certDiv = document.getElementById("certificates");
    const cert = document.createElement("p");
    cert.innerText = "Certificate: Clean India Champion";
    certDiv.appendChild(cert);
  } else {
    alert("Wrong answer. Try again.");
  }
  goToPage("achievements");
}

// Absence & Calendar
function markAbsence() {
  const today = new Date().getDate();
  let absences = JSON.parse(localStorage.getItem("absences")) || [];
  if (!absences.includes(today)) {
    absences.push(today);
    localStorage.setItem("absences", JSON.stringify(absences));
    alert("Absence marked for today.");
    renderCalendarSimple();
  } else {
    alert("Absence already marked for today.");
  }
}

function renderCalendarSimple() {
  const calDiv = document.getElementById("calendarDates");
  if (!calDiv) return;
  calDiv.innerHTML = "";
  const days = 30;
  let absences = JSON.parse(localStorage.getItem("absences")) || [];
  for (let i = 1; i <= days; i++) {
    const day = document.createElement("div");
    day.innerText = i;
    if (absences.includes(i)) {
      day.classList.add("absent");
    }
    calDiv.appendChild(day);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  renderCalendarSimple();
  updatePoints(0);
});
/* STATE & STORAGE */
const S = {
  profile: JSON.parse(localStorage.getItem('profile')||'null'),
  points: +localStorage.getItem('points')||0,
  reports: JSON.parse(localStorage.getItem('reports')||'[]'),
  activity: JSON.parse(localStorage.getItem('activity')||'[]'),
  fines: JSON.parse(localStorage.getItem('fines')||'[]'),
  market: [
    {id:1,name:'Recycled Tote Bag',cost:50},
    {id:2,name:'Steel Bottle',cost:70},
    {id:3,name:'Mini Compost Bin',cost:120},
    {id:4,name:'Cloth Grocery Bag',cost:30}
  ],
  trainings:[
    {id:1,title:'Waste Segregation 101',desc:'Learn dry vs wet waste'},
    {id:2,title:'Say No To Plastic',desc:'Reduce single-use plastic'}
  ],
  quiz:{
    title:'Segregation Basics',
    questions:[
      {q:'Which is wet waste?',opts:['Glass','Vegetable peels','Metal'],a:1},
      {q:'Which color bin for dry waste (typical)?',opts:['Green','Blue','Red'],a:1},
      {q:'Plastic bottles should be…',opts:['Burned','Recycled','Dumped'],a:1}
    ]
  },
  facilities1:[
    {name:'Public Dustbin - Block A',dist:'200 m',addr:'Park Road'},
    {name:'Public Toilet - Market',dist:'350 m',addr:'Central Market'}
  ],
  facilities2:[
    {name:'Recycling Center',dist:'1.2 km',addr:'Sector 9'},
    {name:'Waste Pickup Point',dist:'800 m',addr:'Community Hall'}
  ],
  certificates: JSON.parse(localStorage.getItem('certs')||'[]'),
  absences: JSON.parse(localStorage.getItem('absences')||'[]'),
  calMonth: new Date()
};

function saveState(){
  localStorage.setItem('profile', JSON.stringify(S.profile));
  localStorage.setItem('points', S.points);
  localStorage.setItem('reports', JSON.stringify(S.reports));
  localStorage.setItem('activity', JSON.stringify(S.activity));
  localStorage.setItem('fines', JSON.stringify(S.fines));
  localStorage.setItem('certs', JSON.stringify(S.certificates));
  localStorage.setItem('absences', JSON.stringify(S.absences));
}

/* NAVIGATION */
const screens = ['splash','login','otp','profile','dashboard','report','facilities1','facilities2','rewards','market','training','video','quiz','achievements','absence','calendar'];
function nav(id){
  screens.forEach(s=>document.getElementById(s).classList.remove('active'));
  document.getElementById(id).classList.add('active');
  window.scrollTo(0,0);
  const hideNav = ['splash','login','otp','profile','video','quiz'];
  document.getElementById('bottomNav').style.display = hideNav.includes(id)?'none':'flex';
  ['navHome','navReport','navRewards','navProfile'].forEach(el=>document.getElementById(el).classList?.remove('active'));
  if(id==='dashboard') document.getElementById('navHome').classList.add('active');
  if(id==='report') document.getElementById('navReport').classList.add('active');
  if(id==='rewards') document.getElementById('navRewards').classList.add('active');
  if(id==='profile') document.getElementById('navProfile').classList.add('active');

  if(id==='dashboard') renderDashboard();
  if(id==='report') renderReports();
  if(id==='facilities1') renderFacilities('fac1List', S.facilities1);
  if(id==='facilities2') renderFacilities('fac2List', S.facilities2);
  if(id==='rewards') renderRewardsFines();
  if(id==='market') renderMarket();
  if(id==='training') renderTraining();
  if(id==='achievements') renderCertificates();
  if(id==='calendar') renderCalendar();
}

/* SPLASH -> LOGIN */
setTimeout(()=>{ nav('login'); }, 2200);

/* AUTH FLOWS */
function sendOTP(){
  const phone = document.getElementById('phone').value.trim();
  if(/^\d{10}$/.test(phone)){
    sessionStorage.setItem('phone', phone);
    nav('otp');
  } else alert('Enter a valid 10-digit phone number.');
}
document.querySelectorAll('#otp .otp').forEach((inp,idx,arr)=>{
  inp.addEventListener('input',()=>{ if(inp.value && idx<3) arr[idx+1].focus(); });
  inp.addEventListener('keydown',(e)=>{ if(e.key==='Backspace' && !inp.value && idx>0) arr[idx-1].focus(); });
});
function verifyOTP(){
  const digits=[...document.querySelectorAll('#otp .otp')].map(i=>i.value).join('');
  if(digits==='1234') nav('profile'); else alert('Invalid OTP. Hint: 1234');
}
function saveProfile(){
  const name=document.getElementById('p_name').value.trim();
  const email=document.getElementById('p_email').value.trim();
  const address=document.getElementById('p_address').value.trim();
  const role=document.getElementById('p_role').value;
  if(!name||!email||!address){ alert('Please fill all fields.'); return; }
  S.profile={name,email,address,role,phone:sessionStorage.getItem('phone')||''};
  saveState();
  nav('dashboard');
}

/* DASHBOARD */
function renderDashboard(){
  document.getElementById('hello').textContent = S.profile?`Welcome, ${S.profile.name}!`:'Welcome!';
  document.getElementById('pointsStat').textContent = S.points;
  document.getElementById('reportCount').textContent = S.reports.length;
}

/* REPORTS */
function submitIssue(){
  const type=document.getElementById('issue_type').value;
  const desc=document.getElementById('issue_desc').value.trim();
  const loc=document.getElementById('issue_loc').value.trim();
  if(!desc||!loc){ alert('Please add description and location'); return; }
  const item={id:Date.now(),type,desc,loc,date:new Date().toLocaleString()};
  S.reports.unshift(item);
  S.points += 10;
  S.activity.unshift(`+10 points for reporting: ${type}`);
  saveState();
  renderReports();
  alert('Issue submitted successfully! +10 points');
}
function renderReports(){
  const list=document.getElementById('reportList'); list.innerHTML='';
  if(S.reports.length===0){ list.innerHTML='<div class="muted">No reports yet.</div>'; return; }
  S.reports.slice(0,6).forEach(r=>{
    const el=document.createElement('div'); el.className='card';
    el.innerHTML=`<div style="font-weight:700">${r.type}</div><div class="small muted">${r.loc} • ${r.date}</div><div class="small" style="margin-top:6px">${r.desc}</div>`;
    list.appendChild(el);
  });
}

/* FACILITIES */
function renderFacilities(target, arr){
  const wrap=document.getElementById(target); wrap.innerHTML='';
  arr.forEach(f=>{
    const el=document.createElement('div'); el.className='card';
    el.innerHTML=`<div style="font-weight:700">${f.name}</div><div class="small muted">${f.addr}</div><div class="badge" style="margin-top:8px">${f.dist} away</div>`;
    wrap.appendChild(el);
  });
}

/* FINES & REWARDS */
if(S.fines.length===0){
  S.fines=[
    {id:1,title:'Littering in public',amount:100,status:'Pending'},
    {id:2,title:'Not segregating waste',amount:50,status:'Paid'},
    {id:3,title:'Illegal dumping',amount:200,status:'Pending'}
  ];
  saveState();
}
function switchFR(which){
  document.getElementById('rewardsTab').classList.add('hidden');
  document.getElementById('finesTab').classList.add('hidden');
  document.getElementById(which).classList.remove('hidden');
  document.getElementById('tabRewardsBtn').classList.toggle('active', which==='rewardsTab');
  document.getElementById('tabFinesBtn').classList.toggle('active', which==='finesTab');
}
function renderRewardsFines(){
  document.getElementById('pointsTotal').textContent = S.points;
  document.getElementById('youPts').textContent = S.points;
  const ul=document.getElementById('activityList'); ul.innerHTML='';
  (S.activity.slice(0,6).length?S.activity.slice(0,6):['No recent activity']).forEach(a=>{ const li=document.createElement('li'); li.textContent=a; ul.appendChild(li); });
  const list=document.getElementById('finesList'); list.innerHTML=''; let balance=0;
  S.fines.forEach(f=>{ if(f.status!=='Paid') balance+=f.amount; });
  document.getElementById('fineBalance').textContent = '₹'+balance;
  S.fines.forEach(f=>{
    const el=document.createElement('div'); el.className='card';
    el.innerHTML=`<div style="font-weight:700">${f.title}</div><div class="small muted">Amount: ₹${f.amount} • Status: ${f.status}</div>${f.status==='Pending'?`<button class="btn right" onclick="payFine(${f.id})">Pay Fine</button>`:''}`;
    list.appendChild(el);
  });
}
function payFine(id){ const f=S.fines.find(x=>x.id===id); if(!f) return; f.status='Paid'; saveState(); alert('Fine Paid Successfully!'); renderRewardsFines(); }

/* MARKETPLACE */
function renderMarket(){
  const grid=document.getElementById('marketGrid'); grid.innerHTML='';
  S.market.forEach(m=>{
    const el=document.createElement('div'); el.className='card';
    el.innerHTML=`<div style="font-weight:700">${m.name}</div><div class="small muted">Cost: ${m.cost} pts</div><button class="btn" style="margin-top:8px" onclick="redeem(${m.id})">Redeem</button>`;
    grid.appendChild(el);
  });
}
function redeem(id){ const item=S.market.find(x=>x.id===id); if(!item) return; if(S.points<item.cost){ alert('Not enough points'); return; } S.points-=item.cost; S.activity.unshift(`Redeemed ${item.name} (-${item.cost} pts)`); saveState(); alert('Item Redeemed!'); renderRewardsFines(); renderDashboard(); }

/* TRAINING */
function renderTraining(){
  const list=document.getElementById('trainingList'); list.innerHTML='';
  S.trainings.forEach(t=>{
    const el=document.createElement('div'); el.className='card';
    el.innerHTML=`<div style="font-weight:700">${t.title}</div><div class="small muted">${t.desc}</div><div class="inline" style="margin-top:8px"><button class="btn" onclick="openVideo(${t.id})">Watch Video</button><button class="btn secondary" onclick="openQuiz(${t.id})">Take Quiz</button></div>`;
    list.appendChild(el);
  });
}
function openVideo(id){ document.getElementById('vid').src=''; nav('video'); }
function markVideoDone(){ S.activity.unshift('Completed training video (+5 pts)'); S.points += 5; saveState(); alert('Marked as completed! +5 points'); nav('training'); }

/* QUIZ */
function openQuiz(id){
  const form=document.getElementById('quizForm'); form.innerHTML='';
  S.quiz.questions.forEach((q,i)=>{
    const card=document.createElement('div'); card.className='card';
    const opts=q.opts.map((o,idx)=>`<label style="display:block;margin:8px 0"><input type="radio" name="q${i}" value="${idx}"> ${o}</label>`).join('');
    card.innerHTML=`<div style="font-weight:700">Q${i+1}. ${q.q}</div>${opts}`;
    form.appendChild(card);
  });
  nav('quiz');
}
function submitQuiz(e){ e.preventDefault();
  let score=0;
  S.quiz.questions.forEach((q,i)=>{
    const val=document.querySelector(`input[name=q${i}]:checked`);
    if(val && +val.value===q.a) score++;
  });
  const passed = score>=Math.ceil(S.quiz.questions.length*0.6);
  alert(`Score: ${score}/${S.quiz.questions.length} — ${passed?'Pass ✅':'Try again ❌'}`);
  if(passed){
    S.points += 10; S.activity.unshift('Quiz passed (+10 pts)');
    const cert={id:Date.now(),title:S.quiz.title,date:new Date().toLocaleDateString(),name:S.profile?.name||'You'}; S.certificates.unshift(cert); saveState();
  }
  nav('training');
}

/* CERTIFICATES */
function renderCertificates(){
  const list=document.getElementById('certList'); list.innerHTML='';
  if(S.certificates.length===0){ list.innerHTML='<div class="muted">No certificates yet.</div>'; return; }
  S.certificates.forEach(c=>{
    const el=document.createElement('div'); el.className='card';
    el.innerHTML=`<div style="font-weight:800">Certificate: ${c.title}</div><div class="small muted">Awarded to ${c.name} on ${c.date}</div><button class="btn" style="margin-top:8px" onclick="alert('Certificate Downloaded!')">Download</button>`;
    list.appendChild(el);
  });
}

/* ABSENCE */
function dateRange(start,end){
  const a=[]; const d=new Date(start); const e=new Date(end);
  if(isNaN(d)||isNaN(e)||d>e) return a;
  while(d<=e){ a.push(new Date(d).toISOString().slice(0,10)); d.setDate(d.getDate()+1); }
  return a;
}
function saveAbsence(){
  const reason=document.getElementById('abs_reason').value.trim();
  const s=document.getElementById('abs_start').value; const e=document.getElementById('abs_end').value;
  const days=dateRange(s,e); if(days.length===0){ alert('Select a valid date range'); return; }
  days.forEach(dt=> S.absences.push({date:dt,reason})); saveState(); alert('Absence Recorded');
}

/* CALENDAR */
function renderCalendar(){
  const m=S.calMonth; const year=m.getFullYear(); const month=m.getMonth();
  document.getElementById('calLabel').textContent = m.toLocaleString(undefined,{month:'long', year:'numeric'});
  const grid=document.getElementById('calGrid'); grid.innerHTML='';
  const first=new Date(year,month,1); const last=new Date(year,month+1,0);
  const startDay=first.getDay(); const prevLast=new Date(year,month,0).getDate();
  for(let i=startDay-1;i>=0;i--){ const cell=document.createElement('div'); cell.className='cal-cell muted'; cell.textContent=prevLast-i; grid.appendChild(cell); }
  for(let d=1; d<=last.getDate(); d++){
    const cell=document.createElement('div'); cell.className='cal-cell'; cell.textContent=d;
    const iso=`${year}-${String(month+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
    if(S.absences.some(a=>a.date===iso)) cell.classList.add('absent');
    grid.appendChild(cell);
  }
  const total=grid.children.length; const pad = total%7===0?0:7-total%7;
  for(let i=1;i<=pad;i++){ const cell=document.createElement('div'); cell.className='cal-cell muted'; cell.textContent=i; grid.appendChild(cell); }
}
function prevMonth(){ S.calMonth = new Date(S.calMonth.getFullYear(), S.calMonth.getMonth()-1, 1); renderCalendar(); }
function nextMonth(){ S.calMonth = new Date(S.calMonth.getFullYear(), S.calMonth.getMonth()+1, 1); renderCalendar(); }

/* INITIALS */
if(!localStorage.getItem('points')) localStorage.setItem('points', S.points);
renderDashboard();