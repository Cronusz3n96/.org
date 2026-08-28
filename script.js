
// Define CHUD logo
const CHUD_LOGO = "https://cdn.jsdelivr.net/gh/Cronusz3n96/hhbbhbh@main/logo.png";

// Background manager script (extracted from original)
(function() {
  var BG_LIST = [
    {id:'baja',      name:'Baja Blast',  img:'https://cdn.jsdelivr.net/gh/Cronusz3n96/hhbbhbh@main/baja-blast-bg.webp'},
    {id:'mountains', name:'Mountains',   img:'https://cdn.jsdelivr.net/gh/Cronusz3n96/hhbbhbh@main/Untitled%20(28).png'},
    {id:'medium',    name:'Sand Dunes',  img:'https://miro.medium.com/v2/resize:fit:1400/1*JZqfoowKvfQCEb97ut0y4Q.jpeg'},
    {id:'brotato',   name:'Brotato',     img:'https://raw.githubusercontent.com/Cronusz3n96/hhbbhbh/main/3952.jpg'},
    {id:'chudowl',   name:'Chudowl',     img:'https://raw.githubusercontent.com/Cronusz3n96/hhbbhbh/main/citrus_1775874950475_0.jpg'}
  ];

  // Tab
  var tab = document.createElement('button');
  tab.id = 'bgs-tab';
  tab.innerHTML = '<span>Backgrounds</span>';
  document.documentElement.appendChild(tab);

  // Panel
  var panel = document.createElement('div');
  panel.id = 'bgs-panel';
  panel.classList.add('bgs-closed');
  panel.innerHTML = '<div id="bgs-panel-title">Backgrounds</div>';

  BG_LIST.forEach(function(bg) {
    var btn = document.createElement('button');
    btn.className = 'bgs-btn';
    btn.dataset.id = bg.id;
    btn.innerHTML =
      '<div class="bgs-thumb" style="background-image:url(' + bg.img + ')"></div>' +
      '<div class="bgs-btn-label"><span>' + bg.name + '</span><span class="bgs-dot"></span></div>';

    btn.addEventListener('click', function() {
      localStorage.setItem('selectedBackground', bg.id);
      if (window.setBackgroundStyle) window.setBackgroundStyle(bg.id);
      syncActive();
    });
    btn.addEventListener('mouseenter', function() {
      if (window.setBackgroundStyle) window.setBackgroundStyle(bg.id);
    });
    btn.addEventListener('mouseleave', function() {
      var saved = localStorage.getItem('selectedBackground') || 'baja';
      if (window.setBackgroundStyle) window.setBackgroundStyle(saved);
    });
    panel.appendChild(btn);
  });

  document.documentElement.appendChild(panel);

  // Hide during boot — reveal once globe finishes
  tab.style.setProperty('visibility', 'hidden', 'important');
  panel.style.setProperty('visibility', 'hidden', 'important');
  function onBootDone() {
    tab.style.removeProperty('visibility');
    panel.style.removeProperty('visibility');
  }
  if (window._chudBootDone) {
    onBootDone();
  } else {
    document.addEventListener('chudBootDone', onBootDone, { once: true });
  }

  // Center both tab and panel vertically
  function centerBoth() {
    var h = panel.offsetHeight;
    var half = Math.round(h / 2);
    panel.style.setProperty('margin-top', '-' + half + 'px', 'important');
    tab.style.setProperty('margin-top', '-' + half + 'px', 'important');
  }

  var isOpen = false;

  function syncActive() {
    var cur = localStorage.getItem('selectedBackground') || 'baja';
    panel.querySelectorAll('.bgs-btn').forEach(function(btn) {
      btn.classList.toggle('bgs-active', btn.dataset.id === cur);
    });
  }

  function open() {
    panel.classList.remove('bgs-closed');
    isOpen = true;
    localStorage.setItem('bgSidebarOpen','1');
    setTimeout(function() {
      tab.style.setProperty('left', panel.offsetWidth + 'px', 'important');
    }, 10);
  }
  function close() {
    panel.classList.add('bgs-closed');
    tab.style.setProperty('left', '0px', 'important');
    isOpen = false;
    localStorage.setItem('bgSidebarOpen','0');
  }

  tab.addEventListener('click', function(e) {
    e.stopPropagation();
    isOpen ? close() : open();
  });
  document.addEventListener('click', function(e) {
    if (isOpen && !panel.contains(e.target) && e.target !== tab) close();
  });

  var _orig = window.setBackgroundStyle;
  window.setBackgroundStyle = function(s) { if (_orig) _orig(s); setTimeout(syncActive, 80); };

  function init() {
    syncActive();
    if (localStorage.getItem('bgSidebarOpen') === '1') open();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
  setInterval(syncActive, 1500);
})();

// === Script Block 0 ===

const CHUD_LOGO = "https://cdn.jsdelivr.net/gh/Cronusz3n96/hhbbhbh@main/logo.png";


// === Script Block 3 ===

(function () {
  const canvas = document.getElementById('chos-globe');
  const ctx    = canvas.getContext('2d');
  const DPR    = window.devicePixelRatio || 1;
  const SIZE   = 380;
  canvas.width  = SIZE * DPR;
  canvas.height = SIZE * DPR;
  ctx.scale(DPR, DPR);
  const cx = SIZE / 2, cy = SIZE / 2, R = 150;
  const TILT = 0.38;
  let globeAngle = 0;

  function project(lat, lon) {
    const phi   = lat * Math.PI / 180;
    const theta = lon * Math.PI / 180 + globeAngle;
    const x3 = Math.cos(phi) * Math.sin(theta);
    const y3 = Math.sin(phi);
    const z3 = Math.cos(phi) * Math.cos(theta);
    const cosT = Math.cos(TILT), sinT = Math.sin(TILT);
    const y3r  = y3 * cosT - z3 * sinT;
    const z3r  = y3 * sinT + z3 * cosT;
    return { x: cx + R * x3, y: cy - R * y3r, z: z3r };
  }

  function drawArc(latA, lonA, latB, lonB, steps) {
    const pts = [];
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      pts.push(project(latA + (latB - latA) * t, lonA + (lonB - lonA) * t));
    }
    ctx.beginPath();
    let started = false;
    for (const p of pts) {
      if (p.z < -0.05) { started = false; continue; }
      if (!started) { ctx.moveTo(p.x, p.y); started = true; }
      else ctx.lineTo(p.x, p.y);
    }
    ctx.stroke();
  }

  /* ── Text belt config ── */
  const BELT_TEXT = 'CHUD OS';
  const N         = BELT_TEXT.length;
  const BASE_SIZE = 54;
  const CHAR_ANG  = (BASE_SIZE * 0.60) / R; // radians per char based on arc length
  let   beltAngle = 0;
  const sinT = Math.sin(TILT), cosT = Math.cos(TILT);

  function drawBeltPass(pass) {
    /* pass = 'back' (drawn before globe) or 'front' (drawn after globe) */
    for (let i = 0; i < N; i++) {
      // center text at beltAngle
      const offset = (i - (N - 1) / 2) * CHAR_ANG;
      const theta  = beltAngle + offset;

      /* project equator point (lat=0) */
      const x3  = Math.sin(theta);
      const z3  = Math.cos(theta);
      const y3r = -z3 * sinT;
      const z3r =  z3 * cosT;

      const sx = cx + R * x3;
      const sy = cy - R * y3r;

      /* depth culling */
      if (pass === 'back'  && z3r >  0.04) continue;
      if (pass === 'front' && z3r <  0.04) continue;
      if (z3r < -0.08) continue;

      /* tangent in screen space */
      const tx   = Math.cos(theta);
      const ty   = -Math.sin(theta) * sinT;
      const tLen = Math.sqrt(tx * tx + ty * ty);
      const tAng = Math.atan2(ty, tx);

      const depth = (z3r + 0.08) / 1.08;
      const alpha = pass === 'back'
        ? 0.13
        : Math.min(1, Math.pow(depth, 0.45));

      ctx.save();
      ctx.globalAlpha = Math.max(0, alpha);
      ctx.translate(sx, sy);
      ctx.rotate(tAng);
      ctx.scale(tLen, 1);

      ctx.font = `900 ${BASE_SIZE}px Arial Black, Arial, sans-serif`;
      ctx.textAlign    = 'center';
      ctx.textBaseline = 'middle';

      if (pass === 'front') {
        ctx.fillStyle   = '#f0f0f0';
        ctx.shadowColor = 'rgba(200,205,255,0.85)';
        ctx.shadowBlur  = 12;
      } else {
        ctx.fillStyle = 'rgba(120,125,180,1)';
        ctx.shadowBlur = 0;
      }

      ctx.fillText(BELT_TEXT[i], 0, 0);
      ctx.restore();
    }
  }

  function drawGlobe(t) {
    ctx.clearRect(0, 0, SIZE, SIZE);


    /* globe fill */
    const grd = ctx.createRadialGradient(cx, cy, R * 0.3, cx, cy, R);
    grd.addColorStop(0, 'rgba(100,110,180,0.07)');
    grd.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = grd;
    ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.fill();

    /* back belt — drawn before grid so globe sits on top */
    drawBeltPass('back');

    /* grid */
    ctx.strokeStyle = 'rgba(160,165,210,0.22)';
    ctx.lineWidth   = 0.8;
    for (let lat = -75; lat <= 75; lat += 15) drawArc(lat, -180, lat, 180, 80);
    for (let lon = -180; lon < 180; lon += 20) drawArc(-90, lon, 90, lon, 40);
    ctx.strokeStyle = 'rgba(180,185,230,0.4)';
    ctx.lineWidth   = 1.2;
    drawArc(0, -180, 0, 180, 80);

    /* rim */
    const rim = ctx.createRadialGradient(cx, cy, R * 0.88, cx, cy, R * 1.02);
    rim.addColorStop(0, 'rgba(140,145,200,0)');
    rim.addColorStop(0.6, 'rgba(140,145,200,0.12)');
    rim.addColorStop(1, 'rgba(140,145,200,0)');
    ctx.fillStyle = rim;
    ctx.beginPath(); ctx.arc(cx, cy, R * 1.02, 0, Math.PI * 2); ctx.fill();

    /* front belt — drawn after globe so text appears in front */
    drawBeltPass('front');
  }

  /* hide the old overlay text */
  const textEl = document.getElementById('chos-text');
  const loader = document.getElementById('chud-loader');
  if (textEl) textEl.style.display = 'none';

  /* one full rotation = 2π / GLOBE_SPEED / 60fps * 1000 ms */
  const GLOBE_SPEED = 0.019;
  const BELT_SPEED  = 0.022;
  const DURATION    = Math.round((2 * Math.PI / GLOBE_SPEED / 60) * 1000); // ~5500ms

  /* ── Stars ── */
  const STARS = Array.from({ length: 160 }, () => ({
    x:  Math.random() * SIZE,
    y:  Math.random() * SIZE,
    r:  Math.random() * 1.2 + 0.2,
    base: Math.random() * 0.6 + 0.2,
    speed: Math.random() * 0.02 + 0.005,
    phase: Math.random() * Math.PI * 2,
  }));

  function drawStars(t) {
    for (const s of STARS) {
      const alpha = s.base + 0.25 * Math.sin(t * s.speed + s.phase);
      ctx.save();
      ctx.globalAlpha = Math.max(0, Math.min(1, alpha));
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  let globeFadeIn = 0;
  const START_T = performance.now();
  let loopRunning = true;

  function loop(now) {
    if (!loopRunning) return;
    const elapsed = now - START_T;
    globeAngle  += GLOBE_SPEED;
    beltAngle   += BELT_SPEED;
    globeFadeIn  = Math.min(1, elapsed / 800);
    canvas.style.opacity = globeFadeIn;
    drawGlobe(elapsed);
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);

  setTimeout(() => {
    loader.classList.add('fade-out');
    setTimeout(() => {
      loopRunning = false;
      loader.remove();
      window._chudBootDone = true;
      document.dispatchEvent(new CustomEvent('chudBootDone'));
      // Show FPS picker if not already chosen
      if (!localStorage.getItem('chud_fps')) {
        document.getElementById('fps-picker').classList.add('visible');
      }
    }, 850);
  }, DURATION);
})();

/* ── FPS Picker ── */
(function() {
  function applyFps(fps) {
    localStorage.setItem('chud_fps', fps);
    window._chudFPS = fps;

    if (fps === 30) {
      // Throttle rAF-based animations to 30fps via a global wrapper
      const _raf = window.requestAnimationFrame.bind(window);
      let _last = 0;
      window.requestAnimationFrame = function(cb) {
        return _raf(function(now) {
          if (now - _last >= 33.3) { _last = now; cb(now); }
          else window.requestAnimationFrame(cb);
        });
      };
    }
  }

  // Apply saved preference immediately on reload
  const saved = localStorage.getItem('chud_fps');
  if (saved) applyFps(parseInt(saved));

  document.addEventListener('DOMContentLoaded', function() {
    const picker = document.getElementById('fps-picker');
    if (!picker) return;

    document.getElementById('fps-btn-60').addEventListener('click', function() {
      applyFps(60);
      picker.classList.remove('visible');
      setTimeout(() => picker.remove(), 400);
    });

    document.getElementById('fps-btn-30').addEventListener('click', function() {
      applyFps(30);
      picker.classList.remove('visible');
      setTimeout(() => picker.remove(), 400);
    });
  });
})();


// === Script Block 5 ===
(function(){
  var HEROKU_PROXY = 'https://onelastlink.s3.us-east-1.amazonaws.com/index.html?route=%2Fsearch%3Fquery%3D';

  function showHome(){
    document.getElementById('chudoogle-home').style.display='flex';
    document.getElementById('proxy-browser-bar').style.display='none';
    var f=document.getElementById('proxy-blob-frame');
    f.style.cssText='display:none;'; f.src='';
    if(f.onload) f.onload=null;
    var ls=document.getElementById('proxy-loading-screen');
    if(ls){ ls.style.display='none'; if(ls._timer){clearTimeout(ls._timer);ls._timer=null;} }
  }

  function showBrowser(url){
    var target = /^https?:\/\//i.test(url) ? url : 'https://' + url;
    document.getElementById('chudoogle-home').style.display='none';
    document.getElementById('proxy-browser-bar').style.display='none';
    var f=document.getElementById('proxy-blob-frame');

    // ── Start loading iframe in background immediately ──
    f.style.cssText='display:block;width:100%;flex:1;border:none;visibility:hidden;position:absolute;z-index:-1;';
    f.src=HEROKU_PROXY+encodeURIComponent(btoa(target));

    // ── Terminal loading screen on top ──
    var ls=document.getElementById('proxy-loading-screen');
    var ll=document.getElementById('proxy-loading-lines');
    if(!ls||!ll) return;
    if(ls._timer){ clearTimeout(ls._timer); ls._timer=null; }
    ll.innerHTML='';
    ls.style.display='block';

    var lines=[
      '> initializing chud tunnel v6.9.0...',
      '> loading duckduckgo resolver........... OK',
      '> loading chud tunnel engine............ OK',
      '> loading stinky balls.................. OK',
      '> bypassing school firewall............. OK',
      '> telling securly to shut up............ OK',
      '> switching to wisp transport........... OK',
      '> encrypting your search history........ OK',
      '> tunneling through wisp server......... OK',
      '> deploying chud.exe.................... OK',
      '> wiping evidence....................... OK',
      '> connection established',
      '> navigating to: '+target,
    ];

    // 6 seconds total: 280ms per line (13 * 280 = 3640ms) + 2360ms final hold
    var LINE_DELAY = 280;
    var FINAL_HOLD = 2360;

    var _revealed = false;
    function revealBrowser(){
      if(_revealed) return;
      _revealed = true;
      if(ls._timer){ clearTimeout(ls._timer); ls._timer=null; }
      ls.style.display='none';
      ll.innerHTML='';
      document.getElementById('proxy-browser-bar').style.display='flex';
      f.style.cssText='display:block;width:100%;flex:1;border:none;visibility:visible;position:static;z-index:auto;';
      var inp=document.getElementById('proxy-url-input');
      if(inp) inp.value=target.replace(/^https?:\/\//,'');
    }

    // Reveal as soon as iframe loads (catches early loads)
    f.onload = function(){
      // Small delay so proxy page has time to paint before we reveal
      setTimeout(revealBrowser, 400);
    };

    var i=0;
    function nextLine(){
      if(i>=lines.length){
        ls._timer=setTimeout(revealBrowser, FINAL_HOLD);
        return;
      }
      var div=document.createElement('div');
      var txt=lines[i];
      if(/ OK$/.test(txt)){
        div.innerHTML=txt.replace(/ OK$/,' <span style="color:#00ff41;font-weight:bold;">OK</span>');
      } else {
        div.textContent=txt;
      }
      ll.appendChild(div);
      i++;
      ls._timer=setTimeout(nextLine, LINE_DELAY);
    }
    nextLine();
  }

  window.proxyGo = function(){
    var inp=document.getElementById('proxy-url-input');
    if(!inp||!inp.value.trim()) return;
    var raw=inp.value.trim();
    var url=/^https?:\/\//i.test(raw)?raw:'https://'+raw;
    showBrowser(url);
  };
  window.proxyNav = function(url){ showBrowser(url); };
  window.proxyReload = function(){
    var f=document.getElementById('proxy-blob-frame');
    if(f&&f.src) f.src=f.src;
  };
  window.proxyBack = function(){ showHome(); };
  window.proxyHome = function(){ showHome(); };
})();

// === Script Block 6 ===
 
	  (function(){
      const pond=document.getElementById('duck-pond');

	   const duck=document.getElementById('duck');
     const shadow=document.getElementById('duck-shadow');
	     const tray=document.getElementById('cracker-tray');
      const feedLbl=document.getElementById('feed-count');
        const stageLbl=document.getElementById('duck-stage-label');
      if(!pond||!duck) return;
	   const W=380,H=200;
      let x=152,y=58,fed=0;
	   let dragging=false,dragOffX=0,dragOffY=0;
      let behavior='idle',behaviorTimer=2000;
	   let targetX=x,targetY=y,facingLeft=false;
      const stages=[
	 {min:0, max:4, emoji:'🐣',label:'🐣 baby chick',  size:'1.8rem',sw:'24px',sh:'8px'},
    {min:5, max:11,emoji:'🐥',label:'🐥 growing chick',size:'2.2rem',sw:'28px',sh:'10px'},
	       {min:12,max:999,emoji:'🦆',label:'🦆 adult duck',  size:'2.6rem',sw:'34px',sh:'12px'},
   ];
	  function getStage(){return stages.find(s=>fed>=s.min&&fed<=s.max)||stages[0];}
      function updateAppearance(){
         const s=getStage();
         duck.textContent=s.emoji; duck.style.fontSize=s.size;
          stageLbl.textContent=s.label;
		 if(shadow){shadow.style.width=s.sw;shadow.style.height=s.sh;}
         }
       function clamp(v,a,b){return Math.max(a,Math.min(b,v));}
	  function inPond(px,py){
        const cx=W/2,cy=H/2,rx=W/2-22,ry=H/2-22;
        return ((px-cx)*(px-cx))/(rx*rx)+((py-cy)*(py-cy))/(ry*ry)<=1;
	   }
	  function randomPondPoint(){
           let px,py,t=0;
    do{px=Math.random()*(W-50)+15;py=Math.random()*(H-50)+15;t++;}
		  while(!inPond(px,py)&&t<40);
        return {x:px,y:py};
     }

      function pickBehavior(){   
	 const r=Math.random();
	      if(r<0.5){  
          const pt=randomPondPoint();
	        targetX=pt.x;targetY=pt.y;behavior='moving';
        } else if(r<0.75){
		   behavior='pecking';behaviorTimer=0;
          duck.style.animation='peck 0.4s ease-in-out 3';  
		    setTimeout(()=>{duck.style.animation='';behavior='idle';behaviorTimer=1000+Math.random()*1500;},1300);

		 } else {
	         behavior='looking';
		   duck.style.animation='wiggle 0.5s ease-in-out 2';
          setTimeout(()=>{duck.style.animation='';behavior='idle';behaviorTimer=800+Math.random()*1200;},1100);
		 }
      }
	    let last=null;
     function loop(ts){
		if(!last)last=ts;
           const dt=Math.min(ts-last,50);last=ts; 
	       if(!dragging){
          if(behavior==='moving'){
             const dx=targetX-x,dy=targetY-y,dist=Math.sqrt(dx*dx+dy*dy);
			 if(dist<4){behavior='idle';behaviorTimer=800+Math.random()*2000;}
			 else{
               const s=0.055;
                 const nx=x+dx*s*(dt/16),ny=y+dy*s*(dt/16);
			  if(inPond(nx+16,ny+16)){x=nx;y=ny;}else{pickBehavior();}
              const nf=dx<0;
	     if(nf!==facingLeft){facingLeft=nf;duck.style.transform=facingLeft?'scaleX(-1)':'scaleX(1)';}
			  }
	   } else {
             behaviorTimer-=dt;
	          if(behaviorTimer<=0)pickBehavior();

		    }
		  duck.style.left=x+'px';duck.style.top=y+'px';

		   if(shadow){shadow.style.left=(x+2)+'px';shadow.style.top=(y+26)+'px';}
           }  
	      requestAnimationFrame(loop);
	     }
	  requestAnimationFrame(loop);
	     pickBehavior();

    duck.addEventListener('mousedown',function(e){
      dragging=true;duck.style.animation='none';
    const r=pond.getBoundingClientRect();
		 dragOffX=e.clientX-r.left-x;dragOffY=e.clientY-r.top-y;
	       e.preventDefault(); 
      });

     document.addEventListener('mousemove',function(e){
		if(!dragging)return;

	 const r=pond.getBoundingClientRect();
		  x=clamp(e.clientX-r.left-dragOffX,5,W-44);
	 y=clamp(e.clientY-r.top-dragOffY,5,H-44);
	 duck.style.left=x+'px';duck.style.top=y+'px';
	  if(shadow){shadow.style.left=(x+2)+'px';shadow.style.top=(y+26)+'px';}
        });
	  document.addEventListener('mouseup',function(){
		if(dragging){dragging=false;duck.style.cursor='grab';pickBehavior();}
      });

         function makeCracker(){
	   const el=document.createElement('span');
		el.className='cracker-item';el.textContent='🍪';
		  el.title='Drag onto Alfredo!';
        el.style.animationDelay=(Math.random()*2)+'s';
             let cdragging=false; el.addEventListener('mousedown',function(e){
		  cdragging=true;
          el.style.cssText='position:fixed;z-index:99999;pointer-events:none;font-size:2rem;animation:none;';
          el.style.left=(e.clientX-16)+'px';el.style.top=(e.clientY-16)+'px';
          document.body.appendChild(el);
          e.preventDefault();
   });
 document.addEventListener('mousemove',function(e){
		  if(!cdragging)return;   
		  el.style.left=(e.clientX-16)+'px';el.style.top=(e.clientY-16)+'px';
		 });
      document.addEventListener('mouseup',function(e){
		      if(!cdragging)return;
          cdragging=false;
		    const dr=duck.getBoundingClientRect(); const dist=Math.sqrt((e.clientX-(dr.left+dr.width/2))**2+(e.clientY-(dr.top+dr.height/2))**2);
		  if(dist<55){
              fed++;feedLbl.textContent='fed: '+fed+' cracker'+(fed===1?'':'s');
	          updateAppearance();   

	           duck.style.animation='wiggle 0.3s ease-in-out 4';
              setTimeout(()=>duck.style.animation='',1300);
                 el.remove();
           setTimeout(()=>tray.appendChild(makeCracker()),800);
          } else {
            el.style.cssText='';
            el.style.animation='cracker-float 2s ease-in-out infinite';  
           el.style.animationDelay=(Math.random()*2)+'s';
            tray.appendChild(el);
	            }
        });
          return el;
	     }
      for(let i=0;i<5;i++)tray.appendChild(makeCracker());   
      updateAppearance(); 
	})();
    

// === Script Block 7 ===

    (function () {
     const BASE = 'https://cdn.jsdelivr.net/gh/Cronusz3n96/stolenstuff@main/';
      function resolve(u) {
        if (!u) return u;
        u = String(u).trim();
        if (/^https?:\/\//i.test(u)) return u;
        return BASE + u.replace(/^\//, '');
      }
      if (typeof games !== 'undefined' && Array.isArray(games)) {
        games.forEach(function (g) {
          if (g.url) g.url = resolve(g.url);
          if (g.image) g.image = resolve(g.image);
        });
      }
    })();
  

// === Script Block 9 ===

(function(){
  const LS_KEY = 'chudportal2_notepad_v1';
  const overlay = document.getElementById('notepad-overlay');
  const ta = document.getElementById('np-textarea');
  const wordsEl = document.getElementById('np-words');
  const charsEl = document.getElementById('np-chars');
  const linesEl = document.getElementById('np-lines');
  const savedEl = document.getElementById('np-saved-indicator');
  let saveTimer;

  const saved = localStorage.getItem(LS_KEY);
  if (saved) ta.value = saved;

  function updateStats() {
    const txt = ta.value;
    charsEl.textContent = txt.length;
    linesEl.textContent = txt === '' ? 1 : txt.split('\n').length;
    wordsEl.textContent = txt.trim() === '' ? 0 : txt.trim().split(/\s+/).length;
  }
  updateStats();

  ta.addEventListener('input', () => {
    updateStats();
    localStorage.setItem(LS_KEY, ta.value);
    savedEl.classList.remove('hidden');
    clearTimeout(saveTimer);
    saveTimer = setTimeout(() => savedEl.classList.add('hidden'), 1800);
  });

  // close on overlay background click
  overlay.addEventListener('mousedown', function(e) {
    if (e.target === overlay) closeNotepad();
  });

  // ESC to close
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && overlay.classList.contains('open')) closeNotepad();
  });

  window.openNotepad = function() {
    overlay.classList.add('open');
    setTimeout(() => ta.focus(), 60);
  };
  window.closeNotepad = function() {
    overlay.classList.remove('open');
  };
  window.npClear = function() {
    if (ta.value.trim() === '') return;
    if (!confirm('Clear all notes? Cannot be undone.')) return;
    ta.value = '';
    localStorage.removeItem(LS_KEY);
    updateStats();
  };
  window.npDownload = function() {
    const blob = new Blob([ta.value], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'chudportal_notes.txt';
    document.body.appendChild(a); a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 100);
  };
})();


// === Script Block 10 ===

       let fadeObserver = null;

    function initFadeObserver() {
   if (fadeObserver) {  
		fadeObserver.disconnect();
      fadeObserver = null; }

	   const cards = document.querySelectorAll('.lesson-card');

	    if (cards.length === 0) return;

	    fadeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
	     if (entry.isIntersecting) {
			  entry.target.classList.add('fade-in');
		  } else {
            entry.target.classList.remove('fade-in');
	     }
      });  
	  }, {
	         threshold: 0.1,
        rootMargin: '0px'
      });

      cards.forEach(card => fadeObserver.observe(card));

	  }

   document.addEventListener('DOMContentLoaded', () => {
      setTimeout(() => { 
        initFadeObserver();
        }, 100);
  });

	const originalApplySorting = window.applySorting;
	if (originalApplySorting) {
      window.applySorting = function () {
	  originalApplySorting(); setTimeout(() => {
          initFadeObserver();
		  }, 100);
          };
	   }

    const originalPerformSearch = window.performSearch;
   if (originalPerformSearch) {
      window.performSearch = function (searchTerm) {
		  originalPerformSearch(searchTerm);
		setTimeout(() => {
          initFadeObserver();
        }, 100);
	      };
	   }
    

// === Script Block 11 ===

      document.addEventListener('DOMContentLoaded', function () {
      const quotes = [
	        "Check out all these amazing lessons (none of these are actually lessons)",
		    "Join the chudportal or I will touch you...",
		 "Made by the chuds, for the chuds",
		"Chat, is this real?", "Yk people think you actually learn on here?",
	 "If anyone asks, this is a research project",
   "If the site crashes, it's actually a feature",
          "If you find a bug, just ignore it and keep playing",
       
		"big nate the number 1 lazy dev",
   "i hate fat hoes -logan",  
		"maurice is to good at geo vibes",
		
		"lil nate needs to start sharing his food",
		"isreal is after me", "chase looks like eptine",   

 "oakley is a lil thug",
		"im so gay i like dick up my ass",
		"when im sad i twerk",
        "Ouuuuuh you not my type a lil shitttt",
     "Ohhhh la laaaaa look at this new site design",
       "Whats cookin good lookin?",

		"Youuuuu are feeling VERYYYYY bored... and you want to play MOREEEE stuff",
            "Hey google show me this guys balls please",  
         "My name is anderdingus",
		  "Yo speed my reboot card expires in...",
		  "Yo yo yo its hump day, what ima need you to do is tag three big di-",
        "Wait what if jake is really black tho...?",
        "Hey Alexa how do you say purple in english?",  
	 "Put the yager black ice in my ass",
	      "If this site doesnt work out im making an only fans",
	      "I miss the old kanye",
          "Yo who can slide me their penjamin",
        "Fadded than a hoe fadded than a hoe fadded than a hoe", 
         "AHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH",
		 "You miss 95% of the shots you dont take",
        "95% of gamblers give up right before they win",
		  "You're in a simulation GET OUT GET OUT GET OUT GET OUT GET OUT GET OUT GET OUT GET OUT GET OUT",
          "We ALL going to tel aviv",  
		  "Yo grok show me this guy with his pants off",  

        "Hey google show me this guys balls please",
        "If your reading this crtl+shift+q+q ur homies chromie",
	      "a fawk u mama huevo",
            "japan is turning footseps into electricity",   
        "ts so crispy",

   "Do it jiggle doe?",
		  "Im bouta do a money spread",
		 "W speed ❤️",
		 "Hello im the little goblin thats chained up and writing these quotes",
          "Too much radio not enough head",
          "To be ballin you gotta b-all-in",
		 "lowkey im just better",
		 "Yall be complaining about ads when you can LITERALLY turn them off in settings",
           "Life is hard but im harder",
        "Hoes mad",
		  "jarvis, more alcohol",   
        "I AM the lion",
     "If one man can hold you down TWO can....",
		  "Alr bro ts was not the wind",
        "follow the best power lifter in new mexico @Señor_Cinco67",
        "follow the r6 chudstack member @sorrow_so_unfortunate",
        "follow the owner of chudportal @soh.jake",
    ];

      const typingElement = document.getElementById('typing-quote');
	    if (!typingElement) return;

	   let currentQuote = "";
	    let charIndex = 0;
	  let isDeleting = false;
        let isWaiting = false;

      function getRandomQuote() {
        return quotes[Math.floor(Math.random() * quotes.length)];
      }


    currentQuote = getRandomQuote();

      const bigTextEl = document.getElementById('typing-quote-big-text');
      function updateBig(txt){ if(bigTextEl) bigTextEl.textContent = txt; }

      function typeEffect() {
         if (isDeleting) {
          typingElement.textContent = currentQuote.substring(0, charIndex - 1);
            charIndex--;
	       } else {
		  typingElement.textContent = currentQuote.substring(0, charIndex + 1);
		  charIndex++;
        }
        updateBig(typingElement.textContent);

          if (!isDeleting && charIndex === currentQuote.length) {  
	        isWaiting = true; setTimeout(() => {  
	    isDeleting = true;
            isWaiting = false;
	  typeEffect();
         }, 2000);
		  return;
          } else if (isDeleting && charIndex === 0) {
        isDeleting = false;

		   let newQuote;
            do {
	  newQuote = getRandomQuote(); } while (newQuote === currentQuote && quotes.length > 1);

	         currentQuote = newQuote;
          setTimeout(typeEffect, 500);
	  return; }

		  const speed = isDeleting ? 50:100;
        setTimeout(typeEffect, speed); 
        }

      setTimeout(typeEffect, 1000);
	});
   

// === Script Block 12 ===

(function(){
  document.querySelectorAll('[data-logo-src]').forEach(function(el){
	  el.src = CHUD_LOGO;
	el.removeAttribute('data-logo-src');

  });
})();


// === Script Block 13 ===

	const TMDB_KEY = '3a73619bbb8fc6d47742d1b5b2b707b5';
    const TMDB_IMG = 'https://image.tmdb.org/t/p/w500';
    let _allMovies = [];   
	  let _movieFilter = 'all';
    let _showNSFW = false;

	     // One-time cache wipe to remove any old unfiltered TMDB results
(function() {
  try {
    if (!localStorage.getItem('tmdb_cache_v2')) {
      const keysToDelete = [];
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && k.startsWith('tmdb_')) keysToDelete.push(k);
      }
      keysToDelete.forEach(k => localStorage.removeItem(k));
      localStorage.setItem('tmdb_cache_v2', '1');
    }
  } catch(e) {}
})();

const CACHE_TTL = 24 * 60 * 60 * 1000; async function tmdbFetch(url) {
	    const key = 'tmdb_' + url;
	   try {
            const cached = localStorage.getItem(key);
		  if (cached) {
           const { ts, data } = JSON.parse(cached);
          if (Date.now() - ts < CACHE_TTL) return data;  
		  }
      } catch(e) {}
      const data = await fetch(url).then(r => r.json());
         try { localStorage.setItem(key, JSON.stringify({ ts: Date.now(), data })); } catch(e) {}
       return data;
   }

    // Netflix-style card for horizontal strips
    function makeMovieCard(m) {
      const img = m.poster_path ? TMDB_IMG + m.poster_path : '';
      const year = (m._date||'').slice(0,4);
      const rating = m.vote_average ? m.vote_average.toFixed(1) : '';
      const typeLabel = m._type === 'tv' ? 'TV' : 'FILM';
      return `<div class="nf-card" onclick="openMovieModal(${m.id},'${m._type}')">
        ${img ? `<img class="nf-card-img" src="${img}" alt="${m._label}" loading="lazy">` : '<div class="nf-card-img" style="background:#222;"></div>'}
        <div class="nf-card-hover">
          <div class="nf-card-hover-title">${m._label}</div>
          <div class="nf-card-hover-btns">
            <button class="nf-card-btn play-btn" onclick="event.stopPropagation();nfQuickPlay(${m.id},'${m._type}')">▶</button>
            <button class="nf-card-btn" onclick="event.stopPropagation();openMovieModal(${m.id},'${m._type}')">ⓘ</button>
          </div>
          <div class="nf-card-hover-meta">
            <span class="nf-card-hover-rating">${rating ? '★ '+rating : ''}</span>
            <span>${typeLabel}${year?' · '+year:''}</span>
          </div>
        </div>
      </div>`;
    }

 function norm(raw, type) { 
	  return raw
		 .filter(m => m.original_language === 'en')
		 .filter(m => _showNSFW || !m.adult)
        .map(m => ({...m, _type: type, _label: m.title||m.name||'', _date: m.release_date||m.first_air_date||''}));
   }

    const _movieFadeObserver = new IntersectionObserver((entries) => {  
        entries.forEach(entry => {
		if (entry.isIntersecting) {
		  entry.target.classList.add('fade-in');
		  } else {
		    entry.target.classList.remove('fade-in');
	       }
      });
	      }, { threshold: 0.08, rootMargin: '0px' });

	  function observeMovieCards(container) {
      if (!container) return;
      container.querySelectorAll('.movie-card:not(.fade-in)').forEach(card => {
	      _movieFadeObserver.observe(card);
	  });
    }

       const _rowState = {}; // { id:{ items, offset } }

  function fillRow(id, items) {
    const el = document.getElementById(id);
    if (!el) return;
    if (!items || !items.length) { el.innerHTML = '<div class="nf-loading">Nothing found</div>'; return; }
    _rowState[id] = { items, offset: 0 };
    el.innerHTML = '';
    _appendRowCards(id);
    _observeRowSentinel(id);
    // Set hero from first trending row
    if (id === 'movies-trending' && items.length && !window._heroSet) {
      window._heroSet = true;
      const pick = items[Math.floor(Math.random() * Math.min(5, items.length))];
      setNfHero(pick);
    }
  }

	  function _appendRowCards(id) {
	  const state = _rowState[id]; if (!state) return;
		     const el = document.getElementById(id);
	    if (!el) return;
	  const chunk = state.items.slice(state.offset, state.offset + 16);  
      if (!chunk.length) return;
        // Remove old sentinel if exists
      const oldSentinel = el.querySelector('.row-sentinel');
        if (oldSentinel) oldSentinel.remove(); chunk.forEach(m => {
        const div = document.createElement('div');
        div.innerHTML = makeMovieCard(m);  
         el.appendChild(div.firstChild);
      });
	    state.offset += chunk.length;
	   observeMovieCards(el);
       // Add sentinel if more items remain
	   if (state.offset < state.items.length) {
	       const sentinel = document.createElement('div');
 sentinel.className = 'row-sentinel';
            sentinel.dataset.rowId = id;
       sentinel.style.cssText = 'width:1px;height:1px;display:inline-block;';
		 el.appendChild(sentinel);
      }
   }

    const _rowObserver = new IntersectionObserver((entries) => {
	    entries.forEach(entry => {
	   if (entry.isIntersecting) {
		   const id = entry.target.dataset.rowId; _rowObserver.unobserve(entry.target);
            entry.target.remove();  
          _appendRowCards(id);
           _observeRowSentinel(id);
        }

      });
	  }, { rootMargin: '200px' });   

	function _observeRowSentinel(id) {
	    const el = document.getElementById(id);
       if (!el) return;  
	   const sentinel = el.querySelector('.row-sentinel');   
	  if (sentinel) _rowObserver.observe(sentinel);

    }

	 async function loadMovies() {
      try {
        const KEY = TMDB_KEY;   
       const BASE = 'https://api.themoviedb.org/3';

		const [
		    trendDay, trendW1, trendW2, trendW3, trendW4,
          movP1, movP2, movP3, movP4, movP5, movP6, movP7, movP8, movP9, movP10,
      tvP1, tvP2, tvP3, tvP4, tvP5, tvP6, tvP7, tvP8, tvP9, tvP10,
          actRes, animRes, horRes
	       ] = await Promise.all([
           tmdbFetch(`${BASE}/trending/all/day?api_key=${KEY}&with_original_language=en&include_adult=false`),
          tmdbFetch(`${BASE}/trending/all/week?api_key=${KEY}&page=1&with_original_language=en&include_adult=false`),
            tmdbFetch(`${BASE}/trending/all/week?api_key=${KEY}&page=2&with_original_language=en&include_adult=false`),
         tmdbFetch(`${BASE}/trending/all/week?api_key=${KEY}&page=3&with_original_language=en&include_adult=false`),
       tmdbFetch(`${BASE}/trending/all/week?api_key=${KEY}&page=4&with_original_language=en&include_adult=false`),
		   tmdbFetch(`${BASE}/movie/popular?api_key=${KEY}&page=1&with_original_language=en&include_adult=false`),
		   tmdbFetch(`${BASE}/movie/popular?api_key=${KEY}&page=2&with_original_language=en&include_adult=false`),
		   tmdbFetch(`${BASE}/movie/popular?api_key=${KEY}&page=3&with_original_language=en&include_adult=false`),
          tmdbFetch(`${BASE}/movie/popular?api_key=${KEY}&page=4&with_original_language=en&include_adult=false`),
         tmdbFetch(`${BASE}/movie/popular?api_key=${KEY}&page=5&with_original_language=en&include_adult=false`),
		    tmdbFetch(`${BASE}/movie/popular?api_key=${KEY}&page=6&with_original_language=en&include_adult=false`),
	         tmdbFetch(`${BASE}/movie/popular?api_key=${KEY}&page=7&with_original_language=en&include_adult=false`),
          tmdbFetch(`${BASE}/movie/popular?api_key=${KEY}&page=8&with_original_language=en&include_adult=false`),
		    tmdbFetch(`${BASE}/movie/popular?api_key=${KEY}&page=9&with_original_language=en&include_adult=false`),
		    tmdbFetch(`${BASE}/movie/popular?api_key=${KEY}&page=10&with_original_language=en&include_adult=false`),
          tmdbFetch(`${BASE}/tv/popular?api_key=${KEY}&page=1&with_original_language=en&include_adult=false`),
           tmdbFetch(`${BASE}/tv/popular?api_key=${KEY}&page=2&with_original_language=en&include_adult=false`),
	         tmdbFetch(`${BASE}/tv/popular?api_key=${KEY}&page=3&with_original_language=en&include_adult=false`),
           tmdbFetch(`${BASE}/tv/popular?api_key=${KEY}&page=4&with_original_language=en&include_adult=false`),
             tmdbFetch(`${BASE}/tv/popular?api_key=${KEY}&page=5&with_original_language=en&include_adult=false`),
          tmdbFetch(`${BASE}/tv/popular?api_key=${KEY}&page=6&with_original_language=en&include_adult=false`),
          tmdbFetch(`${BASE}/tv/popular?api_key=${KEY}&page=7&with_original_language=en&include_adult=false`),
          tmdbFetch(`${BASE}/tv/popular?api_key=${KEY}&page=8&with_original_language=en&include_adult=false`),  
         tmdbFetch(`${BASE}/tv/popular?api_key=${KEY}&page=9&with_original_language=en&include_adult=false`),
          tmdbFetch(`${BASE}/tv/popular?api_key=${KEY}&page=10&with_original_language=en&include_adult=false`),
          tmdbFetch(`${BASE}/discover/movie?api_key=${KEY}&with_genres=28&sort_by=popularity.desc&with_original_language=en&include_adult=false`),
		  tmdbFetch(`${BASE}/discover/movie?api_key=${KEY}&with_genres=16&sort_by=popularity.desc&with_original_language=en&include_adult=false`),
          tmdbFetch(`${BASE}/discover/movie?api_key=${KEY}&with_genres=27&sort_by=popularity.desc&with_original_language=en&include_adult=false`),
   ]);   

		  Promise.all([
      tmdbFetch(`${BASE}/movie/top_rated?api_key=${KEY}&page=1&with_original_language=en&include_adult=false`),
        tmdbFetch(`${BASE}/movie/top_rated?api_key=${KEY}&page=2&with_original_language=en&include_adult=false`),  
		    tmdbFetch(`${BASE}/movie/top_rated?api_key=${KEY}&page=3&with_original_language=en&include_adult=false`),
           tmdbFetch(`${BASE}/movie/top_rated?api_key=${KEY}&page=4&with_original_language=en&include_adult=false`),
	         tmdbFetch(`${BASE}/tv/top_rated?api_key=${KEY}&page=1&with_original_language=en&include_adult=false`),
          tmdbFetch(`${BASE}/tv/top_rated?api_key=${KEY}&page=2&with_original_language=en&include_adult=false`),  
       tmdbFetch(`${BASE}/tv/top_rated?api_key=${KEY}&page=3&with_original_language=en&include_adult=false`),
          tmdbFetch(`${BASE}/tv/top_rated?api_key=${KEY}&page=4&with_original_language=en&include_adult=false`),
	  tmdbFetch(`${BASE}/discover/movie?api_key=${KEY}&with_genres=35&sort_by=popularity.desc&with_original_language=en&include_adult=false`),
     tmdbFetch(`${BASE}/discover/movie?api_key=${KEY}&with_genres=878&sort_by=popularity.desc&with_original_language=en&include_adult=false`),
		   tmdbFetch(`${BASE}/discover/movie?api_key=${KEY}&with_genres=10749&sort_by=popularity.desc&with_original_language=en&include_adult=false`),

          tmdbFetch(`${BASE}/discover/movie?api_key=${KEY}&with_genres=80&sort_by=popularity.desc&with_original_language=en&include_adult=false`),
          tmdbFetch(`${BASE}/discover/movie?api_key=${KEY}&with_genres=12&sort_by=popularity.desc&with_original_language=en&include_adult=false`),
           tmdbFetch(`${BASE}/discover/tv?api_key=${KEY}&with_genres=16&sort_by=popularity.desc&with_original_language=en&include_adult=false`),
      ]).then(([tr1, tr2, tr3, tr4, tvr1, tvr2, tvr3, tvr4, comRes, scifiRes, romRes, crimeRes, advRes, animeRes]) => {
	  const topMovies = norm([ 
            ...(tr1.results||[]), ...(tr2.results||[]),
			...(tr3.results||[]), ...(tr4.results||[])
	         ], 'movie');
         const topTV = norm([ ...(tvr1.results||[]), ...(tvr2.results||[]),
       ...(tvr3.results||[]), ...(tvr4.results||[])
         ], 'tv');
            fillRow('movies-top-movies', topMovies); 
           fillRow('movies-top-tv',     topTV); 
            fillRow('movies-comedy',     norm(comRes.results||[],   'movie'));

	        fillRow('movies-scifi',      norm(scifiRes.results||[], 'movie'));
	         fillRow('movies-romance',    norm(romRes.results||[],   'movie'));
          fillRow('movies-crime',      norm(crimeRes.results||[], 'movie'));
          fillRow('movies-adventure',  norm(advRes.results||[],   'movie'));
	        fillRow('movies-anime',      norm(animeRes.results||[], 'tv'));
		    _allMovies = [..._allMovies, ...topMovies, ...topTV];
	         document.querySelectorAll('.movies-extra-row').forEach(r => r.style.display = '');

	         const _netMovieIds = [
              1265609,875828,1159559,687163,1290821,83533,1171145,1523145,840464,1084242,
			  1193501,680493,1327819,1316092,1236153,1582770,1381216,1634301,1311031,1088434,
			 104786,1121516,1227748,1854631,1223819,385857,798051,2089100,324786,379721,
			 155,27205,157336,238,278,680,769,603,13,24428,299534,634649,361743,19995,597, 
  329,11,98,862,8587,539,550,807,14,489,146233,68718,77338,693134,315162,
			299536,  // Avengers: Infinity War
			 284054,  // Black Panther  
			 475557,  // Joker 324857,  // Spider-Man: Into the Spider-Verse
            569094,  // Spider-Man: Across the Spider-Verse

             120,     // LOTR: Fellowship of the Ring
			  121,     // LOTR: The Two Towers
            122,     // LOTR: The Return of the King
           671,     // Harry Potter 1
            672,     // Harry Potter 2
            673,     // Harry Potter 3
            674,     // Harry Potter 4
	           675,     // Harry Potter 5  
            767,     // Harry Potter 6
           12444,   // Harry Potter 7 Part 1
	  12445,   // Harry Potter 7 Part 2   
	           335984,  // Blade Runner 2049
           78,      // Blade Runner
	  1124,    // The Prestige
			2501,    // The Truman Show
             36557,   // Casino Royale
           37724,   // Skyfall
    370172,  // No Time to Die
	           1726,    // Iron Man
            557,     // Spider-Man (2002)
           558,     // Spider-Man 2
               559,     // Spider-Man 3   
	           315635,  // Spider-Man:Homecoming
            429617,  // Spider-Man: Far From Home
			12,      // Finding Nemo
			  585,     // Monsters, Inc.
            863,     // Toy Story 2
			10193,   // Toy Story 3  
  301528,  // Toy Story 4
             9806,    // The Incredibles
            260513,  // Incredibles 2   
	  62177,   // Monsters University

			      127380,  // Finding Dory
	  82702,   // Brave
           285,     // Pirates: Curse of the Black Pearl
              58,      // Pirates: Dead Man's Chest
			      267,     // Pirates: At World's End
			348,     // Alien
			679,     // Aliens
  70160,   // The Hunger Games  
            101299,  // Catching Fire
     131634,  // Mockingjay Part 1
            131635,  // Mockingjay Part 2
			  198663,  // The Maze Runner
			  218778,  // Maze Runner: Scorch Trials
	           10191,   // How to Train Your Dragon
            338189,  // HTTYD: The Hidden World
			354912,  // Coco
	  109445,  // Frozen
            330459,  // Frozen 2 270946,  // Moana
            321612,  // Beauty and the Beast (2017) 1893,    // Star Wars: Episode I
	           1894,    // Star Wars: Episode II
          1895,    // Star Wars: Episode III 12180,   // The Empire Strikes Back
            1892,    // Return of the Jedi
            140607,  // The Force Awakens
			 181808,  // The Last Jedi
            181812,  // The Rise of Skywalker  
			  438695,  // Sing 2
            533535,  // Lightyear   
            508943,  // Turning Red
            760741,  // Elemental
			  459151,  // The Super Mario Bros. Movie
   940551,  // Migration
	           1022789, // Inside Out 2
            507089,  // Five Nights at Freddy's
       545611,  // Free Guy
			476669,  // The Adam Project
           1121864, // Trolls Band Together
            762509,  // Wish
  748783,  // Puss in Boots (2011)
			  675353,  // Sonic the Hedgehog 2
            454626,  // Sonic the Hedgehog
	  520758,  // Diary of a Wimpy Kid (2021)   
			  438799,  // The Jungle Book (2016)
			 263115,  // Maleficent
            259693,  // Maleficent: Mistress of Evil
    618353,  // Eternals
     524434,  // Eternals (same)... skip
			 395920,  // Doctor Strange
	          284052,  // Doctor Strange in the Multiverse of Madness  
			  99861,   // Avengers: Age of Ultron
            271110,  // Captain America: Civil War 

			271110,  // (dup skip)
	           100402,  // Captain America: The First Avenger
            1771,    // Captain America: The Winter Soldier... wait that's 76338   
	         76338,   // Captain America: The Winter Soldier
              10195,   // Thor
			 76600,   // Avatar: The Way of Water   
			346698,  // Barbie
			  787699,  // Wonka   
           718821,  // Twisters
			  533535,  // Lightyear (dup skip)
            558915,  // Uncharted
       581734,  // The Gray Man
           985939,  // Fall
             414906,  // The Batman 436270,  // Black Adam
			  616037,  // Thor: Love and Thunder
            566525,  // Shang-Chi
			  524434,  // Eternals (skip dup)
            497698,  // Black Widow  
			  566525,  // Shang-Chi (skip dup)
           399566,  // Godzilla vs. Kong
			  293167,  // Kong: Skull Island   
  373571,  // Godzilla: King of the Monsters
			259694,  // Godzilla (2014)
          315011,  // The Nun
            493922,  // Hereditary
  458156,  // IT
      459413,  // IT Chapter Two
           420818,  // Mulan (2020)
	           771891,  // Encanto
			  363676,  // Sully
          177572,  // Big Hero 6
	   167261,  // Wreck-It Ralph  
            223808,  // Ralph Breaks the Internet
            755566,  // Jungle Cruise
	  522938,  // Raya and the Last Dragon
            748754,  // Strange World

			 1010600, // The Little Mermaid (2023)
            447277,  // Strange World (dup skip)
            800227,  // Elemental (dup skip)
               762441,  // A Quiet Place: Day One
  482321,  // A Quiet Place
		        490132,  // Glass 
           312221,  // Split 
			 493401,  // Unbreakable
            49051,   // The Hobbit: An Unexpected Journey
            57158,   // The Hobbit:Desolation of Smaug
            122917,  // The Hobbit:Battle of the Five Armies 
			  2062,    // Ratatouille
			920,     // Cars
			 920,     // Cars (dup skip)
              49013,   // Cars 2  

       260514,  // Cars 3
			 8392,    // My Neighbor Totoro
      128,     // Spirited Away
	    129,     // Castle in the Sky
            4935,    // Howl's Moving Castle   
              149870,  // The Wind Rises... actually let me use confirmed IDs
	    4806,    // Princess Mononoke
		        149870,  // (skip uncertain)
            16869,   // Inglourious Basterds 637,     // The Usual Suspects
            539,     // Psycho (dup skip)
	              694,     // The Silence of the Lambs
           274,     // The Silence of the Lambs (dup skip — already 694)
            745,     // The Shining
              218,     // The Terminator
            87101,   // Terminator: Dark Fate
			530385,  // Midsommar
            419430,  // Get Out
			517182,  // Us (Jordan Peele) 297761,  // Suicide Squad (2016)
             436969,  // The Suicide Squad (2021)
			 336843,  // Fantastic Beasts
	  338952,  // Fantastic Beasts 2
            338953,  // Fantastic Beasts 3
	          375262,  // Downton Abbey movie
    429606,  // Rocketman
			475430,  // Elvis
	          661374,  // Glass Onion
			 385687,  // Fast X  
			      168259,  // Furious 7
            51497,   // Fast Five
			  82992,   // Fast & Furious 6 177677,  // Mission Impossible: Rogue Nation
            353081,  // Mission Impossible: Fallout
     522627,  // Mission Impossible: Dead Reckoning
            375366,  // John Wick Chapter 2
		        245891,  // John Wick
            393560,  // John Wick Chapter 3
	  762504,  // John Wick Chapter 4   
	  257211,  // The Equalizer
            384018,  // The Equalizer 2
            736687,  // The Equalizer 3
			 260346,  // Taken 3
            229297,  // Taken 2
	           8204,    // Taken
	  22803,   // The Bourne Identity
			2503,    // The Bourne Supremacy
             8363,    // The Bourne Ultimatum
			 57103,   // The Bourne Legacy
               408220,  // Jason Bourne
            420,     // Schindler's List
	  666277,  // Portrait of a Lady on Fire (skip — foreign)
            423108,  // The Greatest Showman
             420818,  // Mulan (dup skip)

			  496243,  // Parasite
            503919,  // Knives Out
           671039,  // Haunting of Hill House movie... skip
			634643,  // Uncharted (dup skip)
            399055   // The Shape of Water 
          ];
	         const _netTVIds = [
			1871,549,456,1622,2734,1416,4614,1911,112527,22980,
              79744,2224,1434,1431,19530,60574,2661,1408,59941,95557,
              387,2288,1405,4229,65946,1212,2251,889,
			  46316,40075,17554,15260,67706,17882,615,26891,43880,2742,
            2056,1396,1399,66732,2316,1668,1100,8592,48891,1400,
			1438,19885,42009,63351,69740,93405,119051,77169,76331,76479,
            84958,82856,246,44217,85602,60625,1402,73586,65494,71912,
           88329,83867,114461,130392,202555,37854,46261,
	  1418,    // The Big Bang Theory
			2994,    // Prison Break
    4607,    // Lost
            1437,    // House M.D.
            63174,   // Peaky Blinders

     57243,   // Doctor Who
            60735,   // The Flash
	  1873,    // 24  
            35980,   // Arrested Development
  44279,   // New Girl
		       1433,    // Grey's Anatomy
	             1420,    // It's Always Sunny in Philadelphia

       4812,    // Malcolm in the Middle
            63528,   // Better Call Saul
            95396,   // Severance
           71712,   // The Good Place
              46519,   // Elementary
           62560,   // Mr. Robot
            46648,   // Dark
	           60622,   // True Detective
             37680,   // Suits 67744,   // Westworld
            75006,   // The Expanse
               91239,   // Bridgerton
            94605,   // Outer Banks
	  80436,   // Daredevil
		        84720,   // WandaVision
            71678,   // Titans (DC)  
                 18165,   // The Good Doctor
            67195,   // Narcos: Mexico
			86831,   // Love Death + Robots
             90462,   // Hawkeye
	  88396,   // The Falcon and the Winter Soldier
            92749,   // Moon Knight
			  100088,  // The Last of Us
	             106379,  // The Bear
            126849,  // Abbott Elementary
            110492,  // Yellowjackets
            2710,    // Two and a Half Men
            58701,   // BoJack Horseman 
           15511,   // Bluey
			61222,   // Atlanta
	   52814,   // Fargo
			 36761,   // Community
            62017,   // The 100
			 62085,   // Arrow
            62688,   // Supergirl
	  69192,   // Gotham 79008,   // The Punisher (Marvel)
            95403,   // Emily in Paris
            71452,   // Chilling Adventures of Sabrina
	           87108,   // What We Do in the Shadows
	  81356,   // Altered Carbon
            62285,   // The Originals
            1434,    // Family Guy (dup skip — already in original)
             31910,   // Naruto
            57275,   // One Punch Man
			 46260,   // Attack on Titan
			72636,   // Demon Slayer
            85937,   // Jujutsu Kaisen
	          95479,   // Chainsaw Man
			 94664,   // Spy x Family   
             120089,  // Oshi no Ko
            84773,   // The Book of Boba Fett
			 92782,   // Ms. Marvel
			  92783,   // She-Hulk
			  92749,   // Moon Knight (dup skip)
            105971,  // Secret Invasion
         96610,   // Hawkeye (dup skip — 90462)
            131917,  // Loki Season 2
            203737,  // What If...?
            105971,  // Secret Invasion (dup skip)
            84720,   // WandaVision (dup skip)
	           1403,    // Agents of SHIELD
			62126,   // Daredevil (dup skip — 80436)
			71426,   // Stranger Things (dup skip)
            67915,   // Santa Clarita Diet 73723,   // The Boys (dup skip — 76479)
          70785,   // Vikings  
              71912,   // The Witcher (dup skip)
            70523,   // Outlander
               79242,   // Fleabag 53425,   // Inside No. 9
	           61818,   // BoJack Horseman (dup skip — 58701)
            68507,   // The Haunting of Hill House
			 79460,   // You (Netflix)   
	           74204,   // Sex Education
               95557,   // The White Lotus (dup check — 95557 is in original!)
            87917,   // Only Murders in the Building
            70785,   // Vikings (dup skip)
       76669,   // Superman & Lois

            88987,   // Ted Lasso 97108,   // Squid Game (dup — 93405)
			      107768,  // Reacher
            126263,  // The Diplomat
            134506,  // Queen Charlotte

			 136315,  // Wednesday (dup — 119051)
             151916,  // The Watcher 204677,  // Beef (dup — 202555)
            84773,   // Boba Fett (dup skip)
    84720,   // WandaVision (dup skip)
            69648,   // The Umbrella Academy
			 78191,   // Locke & Key

			90228,   // Dark Winds
			105702,  // The Sandman
			 136601,  // Agatha All Along
	          210796,  // Agatha All Along (dup skip)
              156902,  // The Penguin 240411,  // Daredevil: Born Again
			  85552,   // Euphoria (dup — 88329)
			      2261,    // Desperate Housewives
			  1421,    // Modern Family
	           44217,   // Gravity Falls (dup skip)
			 76331,   // Succession (dup skip)
      36038,   // Bluey? (already 15511)
            82856,   // Mandalorian (dup skip)
       4556,    // Dexter: Original Sin
		         63351,   // Narcos (dup skip)
       73737,   // 1883 (Yellowstone prequel)
              112823,  // 1923
			  61889,   // The Terror
			  75219,   // This Is Us 77169,   // Cobra Kai (dup skip)
            32726,   // Supernatural
            1434,    // Family Guy (dup skip)
             1413,    // American Dad (dup — 2056)
			 17579,   // Phineas and Ferb (dup — 17882)  
			  15260,   // Adventure Time (dup skip)
			34307,   // The Loud House 58726,   // Miraculous: Tales of Ladybug
	  36189,   // My Little Pony: Friendship is Magic
			 60735,   // The Flash (dup skip) 70327,   // Buffy the Vampire Slayer
			2132,    // Scrubs
		        1422,    // Monk
			1415,    // Six Feet Under 
   1430,    // Farscape  
             1393,    // Charmed 67897,   // Once Upon a Time
             1771,    // The Vampire Diaries
			  76479,   // The Boys (dup skip)
            44006,   // Penny Dreadful
            47640,   // Halt and Catch Fire
            100,     // Star Trek: The Original Series
  1422,    // Monk (dup skip) 
            56570,   // Black Lightning
	          105,     // Gilmore Girls
            1416,    // Grey's (dup skip) 
			      60028,   // The Handmaid's Tale
            73728,   // The Witcher: Blood Origin
            109168,  // Masters of the Air
			140607,  // Force Awakens (movies — skip)
  1247,    // Family Matters
            1790,    // Step by Step
             2733,    // That '70s Show
    2096,    // The Fresh Prince of Bel-Air
            2928,    // Will & Grace
       1600,    // Saved by the Bell
			  2734,    // Seinfeld (dup — 2734 is in original)
			      1800,    // Everybody Loves Raymond 1668,    // Friends (dup skip)
           1100,    // HIMYM (dup skip) 
           1418,    // Big Bang (dup skip)
  30983,   // Schitt's Creek 
			  70286,   // Schitt's Creek (same? use 30983)
	         1420,    // It's Always Sunny (dup skip)
            1412,    // Curb Your Enthusiasm 68004,   // Barry  
			 80771,   // Insecure
			 66788,   // Broad City
     61889,   // The Terror (dup skip)
     32726,   // Supernatural (dup skip)
              1416,    // dup skip
           60389,   // The Originals (dup — 62285)  
		           1396,    // Breaking Bad (dup skip)
            63528,   // BCS (dup skip)
	              1402,    // TWD (dup skip)
			62285,   // Originals (dup skip)
          46952,   // Fear the Walking Dead
             105971,  // Secret Invasion (dup skip)
  2424,    // SpongeBob (dup? — 387 is SpongeBob already)


			40484,   // Regular Show (dup — 17554) 
              26175,   // Clarence
	  58714,   // The Loud House (dup — 34307)

			49549,   // Uncle Grandpa
            39342,   // Wander Over Yonder
            62017,   // The 100 (dup skip)
             33533,   // Sym-Bionic Titan
			  72879,   // OK K.O.!

	          61252,   // We Bare Bears 85948,   // Craig of the Creek
           16356,   // Over the Garden Wall
      15261,   // Samurai Jack
            15990,   // Dexter's Laboratory
			 2345,    // The Powerpuff Girls
            1639,    // Johnny Bravo
			62574,   // Star vs. the Forces of Evil
            61175,   // Wander Over Yonder (dup skip)
          85534,   // Big Mouth
			  67955,   // Disenchantment (dup — 84669)
              2741,    // Rocko's Modern Life
            3587,    // Ren & Stimpy
			1678,    // Hey Arnold! 
	   2783,    // Rugrats
			  2077,    // Angry Beavers
             1699,    // Rocket Power
            1684,    // As Told by Ginger
			  2738,    // CatDog 17353,   // Star Wars: The Clone Wars
			  4283,    // Star Wars Rebels 105971,  // Secret Invasion (dup skip)
	  60554,   // Star Wars: Resistance
            114461,  // Arcane (dup skip)
           113988,  // Castlevania
			  90802,   // Invincible
	           86831,   // Love Death Robots (dup skip)
              84272,   // Solar Opposites
            117796,  // Halo (Paramount)
            109168,  // Masters of the Air (dup skip)
            111800,  // House of the Dragon
           136315,  // Wednesday (dup skip)
             209867,  // The Rings of Power
			130392,  // The Diplomat (dup skip)
            106379,  // The Bear (dup skip)
            121361,  // Andor (dup — 83867)
		          73140,   // Obi-Wan Kenobi
       156413,  // Ahsoka
              202555,  // Beef (dup skip)
            105971,  // Secret Invasion (dup skip)
     90802,   // Invincible (dup skip)  
	          96677,   // Outer Range   
	   92837,   // Apple TV Severance (dup — 95396)
  75219,   // This Is Us (dup skip) 107768,  // Reacher (dup skip)
              93842,   // Cobra Kai (dup — 77169)

	            1421,    // Modern Family (dup skip)
		       30983,   // Schitt's Creek (dup skip) 
			1412,    // Curb Your Enthusiasm (dup skip)
            68004,   // Barry (dup skip)
	           1403,    // Agents of SHIELD (dup skip)   
			      2261,    // Desperate Housewives (dup skip)
	           2096,    // Fresh Prince (dup skip)
			 2733,    // That '70s Show (dup skip)
			1800,    // Everybody Loves Raymond (dup skip)
            70786,   // That '90s Show
			  70327,   // Buffy (dup skip)
            32726,   // Supernatural (dup skip)
   105,     // Gilmore Girls (dup skip)
            60028,   // Handmaid's Tale (dup skip)
            111800,  // House of the Dragon (dup skip)
            209867,  // Rings of Power (dup skip)
               73140,   // Obi-Wan (dup skip)
            156413,  // Ahsoka (dup skip)
      69648,   // Umbrella Academy (dup skip)   
            46952,   // Fear TWD (dup skip)
            34307,   // Loud House (dup skip)
    58726,   // Miraculous Ladybug (dup skip)
			  85948,   // Craig of the Creek (dup skip)  
			 16356,   // Over the Garden Wall (dup skip)
       15261,   // Samurai Jack (dup skip)
	  2345,    // PPG (dup skip)
           17353,   // Clone Wars (dup skip)
			4283,    // Rebels (dup skip)
			 113988,  // Castlevania (dup skip)
			  90802,   // Invincible (dup skip)
            84272    // Solar Opposites (dup skip)
	     ];
             Promise.all([
	           ...[...new Set(_netMovieIds)].map(id => tmdbFetch(`${BASE}/movie/${id}?api_key=${KEY}&language=en-US&with_original_language=en&include_adult=false`).catch(()=>null)),
			...[...new Set(_netTVIds)].map(id    => tmdbFetch(`${BASE}/tv/${id}?api_key=${KEY}&language=en-US&with_original_language=en&include_adult=false`).catch(()=>null))
          ]).then(results => {
			 const uMovieIds = [...new Set(_netMovieIds)];
            const uTVIds    = [...new Set(_netTVIds)];
            const netMovies = results.slice(0, uMovieIds.length)
			    .filter(Boolean)
             .map(m => ({...m, _type:'movie', _label:m.title||'', _date:m.release_date||''}));
            const netTV = results.slice(uMovieIds.length)
	           .filter(Boolean)
			   .map(m => ({...m, _type:'tv', _label:m.name||'', _date:m.first_air_date||''}));
	  const combined = [...netMovies, ...netTV];
     if (combined.length) {
              fillRow('movies-network', combined);
              _allMovies = [..._allMovies, ...combined];
              document.getElementById('movies-network-row').style.display = '';
			      }
	         }).catch(()=>{});
        }).catch(()=>{});

	       const trendingDay  = norm(trendDay.results||[], 'mixed').map(m => ({...m, _type: m.media_type||'movie'}));
	 const trendingWeek = norm([
             ...(trendW1.results||[]), ...(trendW2.results||[]),  
          ...(trendW3.results||[]), ...(trendW4.results||[])
		], 'mixed').map(m => ({...m, _type:m.media_type||'movie'}));   

        const popularMovies = norm([
		      ...(movP1.results||[]), ...(movP2.results||[]),
		  ...(movP3.results||[]), ...(movP4.results||[]),   
		   ...(movP5.results||[]), ...(movP6.results||[]),
          ...(movP7.results||[]), ...(movP8.results||[]),
          ...(movP9.results||[]), ...(movP10.results||[])
    ], 'movie'); 
		const popularTV = norm([
           ...(tvP1.results||[]), ...(tvP2.results||[]),
               ...(tvP3.results||[]), ...(tvP4.results||[]),
		    ...(tvP5.results||[]), ...(tvP6.results||[]),  
          ...(tvP7.results||[]), ...(tvP8.results||[]),  
	    ...(tvP9.results||[]), ...(tvP10.results||[])
		], 'tv'); const action = norm(actRes.results||[], 'movie');
	       const anim   = norm(animRes.results||[], 'movie');
        const horror = norm(horRes.results||[], 'movie');

        _allMovies = [...popularMovies, ...popularTV, ...trendingWeek];

		fillRow('movies-trending',      trendingDay);
		       fillRow('movies-trending-week', trendingWeek);
        fillRow('movies-popular',       popularMovies);
   fillRow('movies-tv',            popularTV);
		 fillRow('movies-action',        action);
		 fillRow('movies-anim',          anim); 
 fillRow('movies-horror',        horror);

	   } catch(e) {
        console.error(e);
	      document.getElementById('movies-trending').innerHTML = '<div class="movies-loading">[ FAILED TO LOAD ]</div>';
      }
	}

  function renderMovies(list) {
    const nfSearch = document.getElementById('nf-search-results');
    const nfRows = document.getElementById('nf-rows');
    const nfTopbar = document.getElementById('nf-topbar');
    const nfHero = document.getElementById('nf-hero');
    if (!list || list.length === 0) {
      if (nfSearch) nfSearch.style.display = 'none';
      if (nfRows) nfRows.style.display = 'block';
      if (nfHero) nfHero.style.display = 'block';
      return;
    }
    if (nfRows) nfRows.style.display = 'none';
    if (nfHero) nfHero.style.display = 'none';
    if (nfSearch) {
      nfSearch.style.display = 'block';
      const grid = document.getElementById('nf-search-grid');
      const label = document.getElementById('nf-search-label');
      if (label) label.textContent = list.length + ' Results';
      if (grid) {
        grid.innerHTML = list.map(m => {
          const img = m.poster_path ? TMDB_IMG + m.poster_path : '';
          const year = (m._date||'').slice(0,4);
          return `<div class="nf-grid-card" onclick="openMovieModal(${m.id},'${m._type}')">
            ${img ? `<img src="${img}" alt="${m._label}" loading="lazy">` : '<div style="width:100%;aspect-ratio:2/3;background:#222;"></div>'}
            <div class="nf-grid-card-body">
              <div class="nf-grid-card-title">${m._label}</div>
              <div class="nf-grid-card-meta">${m._type==='tv'?'TV':'Film'}${year?' · '+year:''}</div>
            </div>
          </div>`;
        }).join('');
      }
    }
  }

	  let _searchDebounce = null;

	function filterMovies() {
	   const q = (document.getElementById('movies-search').value||'').trim();
  if (!q && _movieFilter === 'all') { renderMovies(null); return; }
	  if (!q) {
        let list = _allMovies.filter(m => m._type === _movieFilter).filter(m => _showNSFW || !m.adult);
     renderMovies(list);
	       return;
	   }
	    const sr = document.getElementById('movies-search-results');
      const wrapper = document.getElementById('movies-grid-wrapper');
    wrapper.querySelectorAll('.movies-category-row').forEach(r=>r.style.display='none');
	    sr.style.display = 'block';
      const nfSearch = document.getElementById('nf-search-results');
    const nfRows = document.getElementById('nf-rows');
    const nfHero = document.getElementById('nf-hero');
    if (nfRows) nfRows.style.display = 'none';
    if (nfHero) nfHero.style.display = 'none';
    if (nfSearch) { nfSearch.style.display = 'block'; }
    const grid = document.getElementById('nf-search-grid');
    const label = document.getElementById('nf-search-label');
    if (label) label.textContent = 'Searching...';
    if (grid) grid.innerHTML = '<div class="nf-loading">Searching...</div>';

    clearTimeout(_searchDebounce);
    _searchDebounce = setTimeout(async () => {
      try {
        const KEY = TMDB_KEY;
        const data = await tmdbFetch(`https://api.themoviedb.org/3/search/multi?api_key=${KEY}&language=en-US&with_original_language=en&query=${encodeURIComponent(q)}&page=1&include_adult=${_showNSFW}`);
        let results = (data.results || [])
          .filter(m => m.media_type === 'movie' || m.media_type === 'tv')
          .filter(m => _showNSFW || !m.adult)
          .map(m => ({...m, _type: m.media_type, _label: m.title||m.name||'', _date: m.release_date||m.first_air_date||''}));
        if (_movieFilter !== 'all') results = results.filter(m => m._type === _movieFilter);
        renderMovies(results.length ? results : null);
        if (!results.length && grid) grid.innerHTML = '<div class="nf-loading">No results found</div>';
      } catch(e) {
        if (grid) grid.innerHTML = '<div class="nf-loading">Search failed</div>';
      }
    }, 350);
  }

      function jumpToCategory(id) {
	  _movieFilter = 'all';
      document.querySelectorAll('.movies-filter-btn').forEach(b => b.classList.remove('active'));
      document.querySelector('.movies-filter-btn').classList.add('active');

      document.getElementById('movies-search').value = '';
      renderMovies(null);
	    const el = document.getElementById(id);

      if (el) {
		 const row = el.closest('.movies-category-row') || el;
		  row.style.display = '';
        setTimeout(() => row.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
       }  
  }

    function setMovieFilter(f, btn) {
      _movieFilter = f;
	  document.querySelectorAll('.movies-filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      filterMovies();
    }

    const CW_KEY = 'cw_list';
	 const CW_MAX = 10;

    function getCWList() {
       try { return JSON.parse(localStorage.getItem(CW_KEY)) || []; } catch(e) { return []; }
  }

     function saveToCW(movie) {
	   let list = getCWList().filter(m => !(m.id === movie.id && m._type === movie._type));
	  list.unshift({
		 id: movie.id, _type: movie._type,
       _label: movie.title || movie.name || '',
		 _date: (movie.release_date || movie.first_air_date || '').slice(0,4),
		  poster_path: movie.poster_path || '',
		vote_average: movie.vote_average || 0,
        ts: Date.now()  
	    });   
    list = list.slice(0, CW_MAX);
      try { localStorage.setItem(CW_KEY, JSON.stringify(list)); } catch(e) {}
    renderCW();
    }

	  function removeFromCW(id, type) {
      const list = getCWList().filter(m => !(m.id == id && m._type === type));
	  try { localStorage.setItem(CW_KEY, JSON.stringify(list)); } catch(e) {}
	   renderCW();
	  }   

 function clearContinueWatching() {
   try { localStorage.removeItem(CW_KEY); } catch(e) {}
	   renderCW();
	  }

  function renderCW() {
    const list = getCWList();
    const cwRow = document.getElementById('nf-cw-row');
    const grid = document.getElementById('cw-grid');
    if (!list.length) { if (cwRow) cwRow.style.display = 'none'; return; }
    if (cwRow) cwRow.style.display = 'block';
    if (!grid) return;
    grid.innerHTML = list.map(m => {
      const img = m.poster_path ? TMDB_IMG + m.poster_path : '';
      return `<div class="nf-card" onclick="openMovieModal(${m.id},'${m._type}')">
        ${img ? `<img class="nf-card-img" src="${img}" loading="lazy" alt="${m._label}">` : '<div class="nf-card-img" style="background:#222;"></div>'}
        <div class="nf-card-hover">
          <div class="nf-card-hover-title">${m._label}</div>
          <div class="nf-card-hover-btns">
            <button class="nf-card-btn play-btn" onclick="event.stopPropagation();nfQuickPlay(${m.id},'${m._type}')">▶</button>
            <button class="nf-card-btn" onclick="event.stopPropagation();removeFromCW(${m.id},'${m._type}')">✕</button>
          </div>
        </div>
      </div>`;
    }).join('');
  }

   let _currentMovie = null;

  async function openMovieModal(id, type) {
    const modal = document.getElementById('nf-modal');
    modal.classList.add('active');
    document.getElementById('nf-modal-title').textContent = 'Loading...';
    document.getElementById('nf-modal-overview').textContent = '';
    document.getElementById('nf-modal-tagline').textContent = '';
    document.getElementById('nf-modal-chips').innerHTML = '';
    document.getElementById('nf-modal-hero').src = '';
    const embedEl = document.getElementById('nf-modal-embed');
    embedEl.classList.remove('active');
    document.getElementById('nf-modal-iframe').src = '';

    try {
      const endpoint = type === 'tv' ? 'tv' : 'movie';
      const data = await tmdbFetch(`https://api.themoviedb.org/3/${endpoint}/${id}?api_key=${TMDB_KEY}&language=en-US&include_adult=false`);
      _currentMovie = {...data, _type: type};
      const label = data.title || data.name || '';
      const year = (data.release_date || data.first_air_date || '').slice(0,4);
      document.getElementById('nf-modal-title').textContent = label;
      document.getElementById('nf-modal-tagline').textContent = data.tagline || '';
      document.getElementById('nf-modal-overview').textContent = data.overview || '';
      // Use backdrop for hero image (widescreen), fallback to poster
      if (data.backdrop_path) {
        document.getElementById('nf-modal-hero').src = 'https://image.tmdb.org/t/p/w1280' + data.backdrop_path;
      } else if (data.poster_path) {
        document.getElementById('nf-modal-hero').src = TMDB_IMG + data.poster_path;
      }
      const chips = [];
      if (year) chips.push(year);
      if (data.vote_average) chips.push('★ ' + data.vote_average.toFixed(1));
      if (type === 'tv') chips.push('TV Series');
      (data.genres||[]).slice(0,3).forEach(g => chips.push(g.name));
      document.getElementById('nf-modal-chips').innerHTML = chips.map(c=>`<span class="nf-modal-chip">${c}</span>`).join('');
    } catch(e) {
      document.getElementById('nf-modal-title').textContent = 'Error Loading';
    }
  }

  // Provider tracking
  let _selectedProvider = 'vidsrc.cc';

  function selectProvider(btn) {
    document.querySelectorAll('.provider-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    _selectedProvider = btn.dataset.provider;
    // If embed is already open, switch the source live
    const embed = document.getElementById('mm-embed');
    if (embed.classList.contains('active') && _currentMovie) {
      const type = _currentMovie._type === 'tv' ? 'tv' : 'movie';
      document.getElementById('mm-iframe').src = getBlobSrc(type, _currentMovie.id);
    }
  }

  function getProviderUrl(type, id) {
    const tmdbId = id;
    switch (_selectedProvider) {
      case 'vidsrc.cc':
        return `https://vidsrc.cc/v2/embed/${type}/${tmdbId}`;
      case 'vidsrc.me':
        return `https://vidsrc.me/embed/${type}/${tmdbId}`;
      case '2embed':
        return type === 'tv'
          ? `https://www.2embed.cc/embedtv/${tmdbId}&s=1&e=1`
          : `https://www.2embed.cc/embed/${tmdbId}`;
      case 'superembed':
        return type === 'tv'
          ? `https://multiembed.mov/?video_id=${tmdbId}&tmdb=1&s=1&e=1`
          : `https://multiembed.mov/?video_id=${tmdbId}&tmdb=1`;
      case 'autoembed':
        return type === 'tv'
          ? `https://autoembed.co/tv/tmdb/${tmdbId}-1-1`
          : `https://autoembed.co/movie/tmdb/${tmdbId}`;
      case 'embedsu':
        return type === 'tv'
          ? `https://embed.su/embed/tv/${tmdbId}/1/1`
          : `https://embed.su/embed/movie/${tmdbId}`;
      case 'moviesapi':
        return type === 'tv'
          ? `https://moviesapi.club/tv/${tmdbId}-1-1`
          : `https://moviesapi.club/movie/${tmdbId}`;
      case 'multiembed':
        return type === 'tv'
          ? `https://multiembed.mov/directstream.php?video_id=${tmdbId}&tmdb=1&s=1&e=1`
          : `https://multiembed.mov/directstream.php?video_id=${tmdbId}&tmdb=1`;
      default:
        return `https://vidsrc.cc/v2/embed/${type}/${tmdbId}`;
    }
  }

	function getBlobSrc(type, id) {
	   const direct = getProviderUrl(type, id);
      const html = `<!DOCTYPE html><html><head><style>*{margin:0;padding:0;box-sizing:border-box}body,html{width:100%;height:100%;background:#000;overflow:hidden}iframe{width:100%;height:100%;border:none}</style></head><body><iframe src="${direct}" allowfullscreen allow="autoplay;fullscreen"></iframe>


</body></html>`;
	   const blob = new Blob([html], {type: 'text/html'});
  return URL.createObjectURL(blob);
   }

  function watchMovie() {
    if (!_currentMovie) return;
    const type = _currentMovie._type === 'tv' ? 'tv' : 'movie';
    const src = getBlobSrc(type, _currentMovie.id);
    const embed = document.getElementById('nf-modal-embed');
    document.getElementById('nf-modal-iframe').src = src;
    embed.classList.add('active');
    embed.scrollIntoView({behavior:'smooth', block:'nearest'});
    saveToCW(_currentMovie);
  }

  function nfQuickPlay(id, type) {
    openMovieModal(id, type).then(() => {
      setTimeout(watchMovie, 800);
    });
  }

  function watchInAboutBlank() {
    if (!_currentMovie) return;
    const type = _currentMovie._type === 'tv' ? 'tv' : 'movie';
    const src = getProviderUrl(type, _currentMovie.id);
    const w = window.open('about:blank','_blank');
    if (w) {
      w.document.open();
      w.document.write(`<!DOCTYPE html><html><head><title>Watch</title><style>*{margin:0;padding:0;box-sizing:border-box}body,html{width:100%;height:100%;background:#000;overflow:hidden}iframe{width:100%;height:100%;border:none}</style></head><body><iframe src="${src}" allowfullscreen allow="autoplay;fullscreen"></iframe></body></html>`);
      w.document.close();
    }
  }

  function closeMovieModal() {
    document.getElementById('nf-modal').classList.remove('active');
    document.getElementById('nf-modal-iframe').src = '';
    document.getElementById('nf-modal-embed').classList.remove('active');
    _currentMovie = null;
  }

  document.getElementById('nf-modal').addEventListener('click', function(e) {
    if (e.target === this) closeMovieModal();
  });

  // selectProvider updated for new btn class
  function selectProvider(btn) {
    document.querySelectorAll('.nf-provider-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    _selectedProvider = btn.dataset.provider;
    const embed = document.getElementById('nf-modal-embed');
    if (embed.classList.contains('active') && _currentMovie) {
      const type = _currentMovie._type === 'tv' ? 'tv' : 'movie';
      document.getElementById('nf-modal-iframe').src = getBlobSrc(type, _currentMovie.id);
    }
  }

  // Hero banner helpers
  let _heroMovie = null;
  function setNfHero(m) {
    _heroMovie = m;
    const heroBg = document.getElementById('nf-hero-bg');
    const heroTitle = document.getElementById('nf-hero-title');
    const heroOverview = document.getElementById('nf-hero-overview');
    if (!heroBg || !m) return;
    if (m.backdrop_path) {
      heroBg.style.backgroundImage = `url('https://image.tmdb.org/t/p/w1280${m.backdrop_path}')`;
    } else if (m.poster_path) {
      heroBg.style.backgroundImage = `url('${TMDB_IMG}${m.poster_path}')`;
    }
    if (heroTitle) heroTitle.textContent = m._label || m.title || m.name || '';
    if (heroOverview) heroOverview.textContent = m.overview || '';
    const ageBadge = document.getElementById('nf-hero-age-badge');
    if (ageBadge && m.vote_average) ageBadge.textContent = '★ ' + m.vote_average.toFixed(1);
  }

  function nfHeroWatch() {
    if (_heroMovie) openMovieModal(_heroMovie.id, _heroMovie._type).then(() => setTimeout(watchMovie, 800));
  }
  function nfHeroInfo() {
    if (_heroMovie) openMovieModal(_heroMovie.id, _heroMovie._type);
  }

// blob padger stuff
(function(){

	var blobHistory = []
	try{ blobHistory = JSON.parse(localStorage.getItem('blobpadger_history') || '[]') }catch(e){}

	const blobEscHtml=s=>s.replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;').replace(/>/g,'&gt;')

    function setBlobStatus(msg,type){
		const el=document.getElementById('blobStatus')
      if(!el)return
      el.textContent=msg
		el.style.color=type=='ok'?'#4ade80':type=='err'?'#f87171':'var(--gray-text)'
      if(type=='ok')setTimeout(()=>setBlobStatus('> awaiting next link...','idle'),3000)
    }

	function renderBlobHistory(){
        const panel=document.getElementById('blobHistoryPanel')
      const list=document.getElementById('blobHistoryList')
		if(!panel||!list)return
      if(!blobHistory.length){panel.style.display='none';return}
		panel.style.display=''
        list.innerHTML=''
      blobHistory.forEach(url=>{
			const d=document.createElement('div')
            d.style.cssText='display:flex;align-items:center;gap:10px;padding:7px 10px;background:rgba(0,0,0,0.3);border:1px solid rgba(var(--primary-orange-rgb),0.12);border-radius:3px;cursor:none!important;transition:all 0.2s ease;font-size:0.74rem;'
          d.innerHTML=`<span style="color:var(--gray-text);flex-shrink:0;">$</span><span style="flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:rgba(170,170,170,0.6);">${blobEscHtml(url)}</span><span class="hist-repadge" style="font-size:0.6rem;letter-spacing:0.15em;color:rgba(170,170,170,0.28);text-transform:uppercase;">re-padge</span>`

			d.addEventListener('mouseenter',()=>{
              d.style.background='rgba(var(--primary-orange-rgb),0.08)';d.style.borderColor='rgba(var(--primary-orange-rgb),0.3)'
				d.querySelector('.hist-repadge').style.color='var(--primary-orange)'
              const c=document.getElementById('custom-cursor');c&&c.classList.add('hovering')
          })
          d.addEventListener('mouseleave',()=>{
			  d.style.background='rgba(0,0,0,0.3)';d.style.borderColor='rgba(var(--primary-orange-rgb),0.12)'
                d.querySelector('.hist-repadge').style.color='rgba(170,170,170,0.28)'
			  const c=document.getElementById('custom-cursor');c&&c.classList.remove('hovering')
		  })
          d.onclick=()=>blobPadge(url)
			list.appendChild(d)
        })
    }

window.blobPadge=function(url){
		const input=document.getElementById('blobUrlInput')
      const raw=(url||(input&&input.value)||'').trim()
	  if(!raw){setBlobStatus('> [ERR] no link detected','err');return}
        let target=raw
      if(!/^https?:\/\//i.test(target))target='https://'+target
	try{
          const html=`<!DOCTYPE html><html><head><meta charset="UTF-8"><style>*{margin:0;padding:0;box-sizing:border-box}html,body,iframe{width:100%;height:100%;border:none;display:block;background:#000}</style></head><body><iframe src="${blobEscHtml(target)}" allowfullscreen sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals allow-top-navigation"></iframe></body></html>`
		window.open(URL.createObjectURL(new Blob([html],{type:'text/html'})),'_blank')
          setBlobStatus('> [OK] blob padge launched \u2713','ok')

          blobHistory=[target,...blobHistory.filter(u=>u!==target)].slice(0,10)
		try{localStorage.setItem('blobpadger_history',JSON.stringify(blobHistory))}catch(e){}
          renderBlobHistory()
          if(!url&&input)input.value=''
      }catch(e){setBlobStatus('> [ERR] '+e.message,'err')}
    }

	document.addEventListener('DOMContentLoaded',()=>{
      const input=document.getElementById('blobUrlInput')
		const btn=document.getElementById('blobPadgeBtn')
        if(input){
			input.addEventListener('paste',()=>setTimeout(()=>{if(input.value.trim())blobPadge()},20))
          input.addEventListener('keydown',e=>{if(e.key==='Enter')blobPadge()})
			input.addEventListener('focus',()=>input.style.borderColor='rgba(var(--primary-orange-rgb),0.6)')
            input.addEventListener('blur',()=>input.style.borderColor='rgba(var(--primary-orange-rgb),0.3)')
        }
      if(btn){
          btn.addEventListener('mouseenter',()=>{btn.style.background='rgba(var(--primary-orange-rgb),0.3)';btn.style.boxShadow='0 0 10px var(--primary-orange)'})
			btn.addEventListener('mouseleave',()=>{btn.style.background='rgba(var(--primary-orange-rgb),0.2)';btn.style.boxShadow=''})
        }
		renderBlobHistory()
    })
})()

	

// === Script Block 14 ===

// AI chat
(function(wMbPK$GmwUM_SGL,CqRwKWJZ){const QECGXyVDW_aeLeKZKHmxbwTgLm=VhoEhMerWiaQdIO$OElto$LlV,fUM$A_zcJyykQS=wMbPK$GmwUM_SGL();while(!![]){try{const DbkM_V=Math['floor'](parseFloat(QECGXyVDW_aeLeKZKHmxbwTgLm(0x1d0))/(Math.max(-0x1345,-0x1345)+parseInt(0x14f3)+-0x1ad))*Math['ceil'](parseFloat(QECGXyVDW_aeLeKZKHmxbwTgLm(0x205))/(Math.ceil(-0x3df)*Math.floor(parseInt(0x5))+-0x10d*parseInt(0x9)+-0x11*-parseInt(0x1b2)))+parseFloat(QECGXyVDW_aeLeKZKHmxbwTgLm(0x226))/(Math.trunc(-parseInt(0x2))*Number(-0x11)+Math.max(-0xd3f,-parseInt(0xd3f))+Math.ceil(0x10)*Math.max(0xd2,parseInt(0xd2)))+Math['floor'](parseFloat(QECGXyVDW_aeLeKZKHmxbwTgLm(0x21e))/(Math.ceil(parseInt(0x429))*parseInt(-parseInt(0x3))+-0x9*parseInt(-parseInt(0x1f))+parseInt(0xb68)))+parseFloat(QECGXyVDW_aeLeKZKHmxbwTgLm(0x1d2))/(0x20ff+0x33*parseInt(0x65)+-0x3519)+parseFloat(QECGXyVDW_aeLeKZKHmxbwTgLm(0x21b))/(Math.trunc(-parseInt(0x1))*Math.floor(0x13bb)+0x164c+parseFloat(-parseInt(0x28b)))*(parseFloat(QECGXyVDW_aeLeKZKHmxbwTgLm(0x232))/(0x2f3*Number(parseInt(0x3))+-parseInt(0xe7d)*0x1+0x5ab))+Math['ceil'](-parseFloat(QECGXyVDW_aeLeKZKHmxbwTgLm(0x1ca))/(0x772*parseInt(parseInt(0x1))+parseInt(0x1ec4)+parseInt(0x2)*Math.ceil(-0x1317)))*(parseFloat(QECGXyVDW_aeLeKZKHmxbwTgLm(0x229))/(Math.max(0x8,0x8)*Math.max(-parseInt(0x1f7),-parseInt(0x1f7))+-0x1518+parseInt(0x1)*parseInt(0x24d9)))+-parseFloat(QECGXyVDW_aeLeKZKHmxbwTgLm(0x1e6))/(-parseInt(0x11b0)+parseInt(0xd7)*-0x1a+parseInt(0x2)*0x13c8);if(DbkM_V===CqRwKWJZ)break;else fUM$A_zcJyykQS['push'](fUM$A_zcJyykQS['shift']());}catch(ZUy$nNuCdWncKcJAaTWZ$W){fUM$A_zcJyykQS['push'](fUM$A_zcJyykQS['shift']());}}}(kjBwC$NYTxxIQhhTd,parseInt(0xafc93)*parseInt(-parseInt(0x1))+0x3d5b1+-parseInt(0x35)*Math.max(-parseInt(0x3d25),-parseInt(0x3d25))));const _0x25518b=_0x3d07;(function(wxy_WdrzievudDQz$qSXHCaV,hdsyy$fSrYBuPGV){const su$Qfti$ynf=VhoEhMerWiaQdIO$OElto$LlV,WxYe__U=_0x3d07,UhcSMtgOLi=wxy_WdrzievudDQz$qSXHCaV();while(!![]){try{const BVbByBf$Cc$rze=-parseInt(WxYe__U(Math.max(-parseInt(0x26a0),-parseInt(0x26a0))+0x175f+0xfea))/(-(0x25ae+parseInt(0x156d)+-0x3b1a)*(parseFloat(-parseInt(0x15f4))+0x1256+Math.max(0x1699,0x1699))+-(Math.max(-parseInt(0x2ea),-parseInt(0x2ea))*parseInt(0xd)+-0xa*Math.trunc(-parseInt(0x200))+Number(parseInt(0xb))*parseInt(0x1a6))*(Math.ceil(-parseInt(0x251b))*-0x1+Math.ceil(parseInt(0xa3d))*parseFloat(parseInt(0x1))+parseInt(0x1)*-parseInt(0x2f2f))+(-0x5*0x779+parseInt(0x7cf)*-0x5+Math.max(0x4,parseInt(0x4))*parseInt(0x1a69)))*(-parseInt(WxYe__U(parseFloat(0x246a)+Number(0x28e)+parseInt(0x1)*-parseInt(0x2678)))/(-(parseInt(0x1f8c)+parseFloat(parseInt(0x7))*parseInt(-parseInt(0x47))+0x2*Number(-0xa55))*(parseFloat(-0x1b40)+-0x167d+0x31c0)+(parseFloat(0x7)*0xb3+parseInt(-parseInt(0xf45))+parseInt(0x306f))+-(Math.max(0x159,parseInt(0x159))*Math.floor(0x2)+-parseInt(0x2)*parseInt(0x4b)+0x91e)))+parseInt(WxYe__U(0x3*Math.trunc(0xc2)+0x17d1+parseFloat(-0x40)*0x65))/(-(Math.max(-parseInt(0x42),-0x42)+Math.floor(parseInt(0x314c))+-parseInt(0xab5))+-(-0x247a+0x756*parseInt(0x4)+-parseInt(0x1)*-0x1505)+(-parseInt(0x1)*parseInt(parseInt(0x2986))+-0x645c+-0x1f*-parseInt(0x643)))+-parseInt(WxYe__U(Math.trunc(parseInt(0x1395))+-parseInt(0x1ffd)+0xb*parseInt(0x12d)))/(-(-parseInt(0x16f)*-0x7+-parseInt(0x813)+-0x13*Number(0xb))+(-parseInt(0x248b)+-parseInt(0x2)*Number(-0x727)+-parseInt(0x4b)*-parseInt(0x6f))*-(-0xb*0x28b+-0x1b8d+parseInt(0x3787))+(Math.floor(-0x1e39)+-parseInt(0x898)*-parseInt(0x2)+parseInt(0x187a)))+-parseInt(WxYe__U(parseFloat(-parseInt(0xb26))+-0x22ca+Math.floor(parseInt(0x1e))*parseInt(0x18d)))/((parseInt(0x262e)+-0x1d03+parseInt(0xd4))*(parseInt(-parseInt(0x2b))*Number(parseInt(0x7a))+0xa09+parseFloat(-parseInt(0xce))*-parseInt(0xd))+-(0x173e+parseInt(0x1)*-0x14db+parseInt(0x2)*-parseInt(0x8b))*(Math.ceil(0x22)*Math.max(-parseInt(0x54),-0x54)+0x444+parseFloat(0x6ed))+(-0x26ea+-0x7e5*-0x3+Math.floor(parseInt(0x10f6))))*(parseInt(WxYe__U(Math.trunc(-parseInt(0x1))*-parseInt(0xe3b)+-parseInt(0xd12)+-0x5d*Math.max(parseInt(0x1),0x1)))/((-parseInt(0x239)*Math.max(parseInt(0xf),0xf)+0xf04+Math.floor(-parseInt(0x1))*parseInt(-parseInt(0x1279)))*-(0x11be+-0x8*Math.ceil(0x125)+Math.max(-parseInt(0x80e),-parseInt(0x80e)))+(0x152c+parseInt(0xd24)+parseInt(-0x1f57))*-(Math.floor(-0x219b)+-parseInt(0x1)*Math.trunc(0xda1)+parseFloat(-0x1)*-parseInt(0x2f3f))+-(-parseInt(0x12bd)+Math.floor(-0xcc5)+-0x2b*Number(-0x169))*-(parseInt(parseInt(0x270f))+-parseInt(0x410)+-parseInt(0x22fe))))+-parseInt(WxYe__U(Math.ceil(parseInt(0x1dd7))+parseFloat(-parseInt(0x1))*-parseInt(0x267b)+parseInt(0x2)*-parseInt(0x21e2)))/(-parseInt(0x24f3)+parseFloat(-parseInt(0x1ab8))+parseInt(0x5af0)+(Math.trunc(parseInt(0x3))*-0xcf3+0x1d8b*Math.max(-0x1,-parseInt(0x1))+-parseInt(0x1)*Number(-0x4549))*(-parseInt(0x1560)+parseInt(0x1089)+parseInt(0x4e1))+-(-0x171+parseInt(0x588)+-parseInt(0x413))*(-0xb0e+-0x12b*Math.trunc(-0x7)+Math.floor(parseInt(0xbed))))+-parseInt(WxYe__U(Math.ceil(0x13)*0x19c+-parseInt(0xb4e)+Math.floor(-0x4)*0x4a9))/(-(0x1db9+Math.ceil(0x1)*0x815+Math.ceil(-parseInt(0x2333)))*-(-0x1db4+-parseInt(0x989)*parseInt(0x1)+Math.trunc(0x2745))+-(-parseInt(0x146e)+parseInt(0x1e06)+-0x997)*-(parseInt(0x16d3)+-parseInt(0x239d)+0xcda)+-(Math.ceil(-parseInt(0x14b))+Math.floor(parseInt(0x3))*Math.ceil(-parseInt(0x3d0))+parseInt(0x219b)))*(-parseInt(WxYe__U(parseInt(-0xba7)+parseInt(0x25)*Math.max(0xae,parseInt(0xae))+Number(-parseInt(0x1))*0xc8f))/((0x1ff0+-0x2*Math.floor(0xcd)+-0x5*parseInt(0x611))*(Math.max(parseInt(0xf1b),0xf1b)*-parseInt(0x1)+-0x1f79+Math.max(parseInt(0x4b52),parseInt(0x4b52)))+-(0x2*Math.floor(-0x505)+Math.floor(-0x2bd)+Math.ceil(parseInt(0x332))*Math.trunc(parseInt(0x4)))*-(parseInt(parseInt(0x1af))+0xea2+-parseInt(0x28b))+-(0x270e+-parseInt(0x3)*0x1101+0x3670)))+parseInt(WxYe__U(-parseInt(0x1c57)+-0x681+Math.max(0x236c,parseInt(0x236c))*0x1))/((Math.floor(0x552)+parseInt(parseInt(0x1))*-parseInt(0xcc7)+Math.ceil(0x12da))*(-0x2b+Math.ceil(parseInt(0x1528))+-0x14fc)+(-0x1*Math.ceil(parseInt(0x1a35))+parseInt(-parseInt(0x2))*Math.trunc(0x10a5)+0x3ca4)+-(parseInt(0xdf)*-0x25+Number(0x1bb5)*parseInt(parseInt(0x1))+0x1106))*(parseInt(WxYe__U(parseInt(0x1c4d)+-parseInt(0x318)+parseFloat(-parseInt(0x2))*parseInt(0xc59)))/(-(-parseInt(0xcab)+Math.trunc(-0x358a)+parseFloat(parseInt(0x6867)))*-(-0x1*parseInt(-0x1e2b)+-0x6a*0x1e+0x2*Math.max(-parseInt(0x8df),-parseInt(0x8df)))+-(Math.trunc(parseInt(0xc72))+0x1978+-0x161*Number(0xe))+-(Math.trunc(0x1c70)+Math.ceil(-parseInt(0xc5))*-0x1e+parseInt(0x3)*Number(-parseInt(0xaa9)))));if(BVbByBf$Cc$rze===hdsyy$fSrYBuPGV)break;else UhcSMtgOLi[su$Qfti$ynf(0x1f9)](UhcSMtgOLi[su$Qfti$ynf(0x1e7)]());}catch(p_nhl$yRK){UhcSMtgOLi[su$Qfti$ynf(0x1f9)](UhcSMtgOLi[su$Qfti$ynf(0x1e7)]());}}}(_0x226d,-(parseInt(0x2540)+0x1*Math.ceil(-0x1dde)+Number(parseInt(0x4))*-parseInt(0x1d8))*(Math.floor(parseInt(0x1))*-parseInt(0xc27c)+0x12c44+parseInt(0x3c86))+-(parseInt(0x6)*Math.floor(-0x407)+parseInt(0x7)*Math.ceil(-parseInt(0xb3))+-0xc*-0x26c)*(parseFloat(-0x9ac97)+Number(parseInt(0xe5))*-parseInt(0x18cb)+parseInt(0x2cdf3b))+(parseInt(0x2823f2)+-0xa8503*-0x1+Math.ceil(-0xe00c3)*Math.max(parseInt(0x2),0x2))));const WS_URL=_0x25518b(parseFloat(-0x611)+parseInt(0x117c)+Math.floor(-0xae6))+_0x25518b(0x3e*parseInt(0x16)+-parseInt(0x2a5)+-0x29*0xd)+_0x25518b(parseFloat(-parseInt(0x773))*Math.ceil(0x2)+Math.ceil(-parseInt(0xffa))+parseFloat(0x3)*parseInt(0xa99)),chatEl=document[_0x25518b(-0x3*Math.floor(0x869)+parseFloat(0x308)*parseFloat(-0x1)+parseInt(-0x2)*-parseInt(0xe83))+_0x25518b(parseInt(0x1a0e)+0xe22+-0xc5*Number(parseInt(0x33)))](_0x25518b(0x6e7+Math.floor(0x132b)*Number(0x1)+-parseInt(0x1968))),statusEl=document[_0x25518b(parseInt(0xb7f)+Number(-parseInt(0x2f))*Number(parseInt(0x7d))+0xc37)+_0x25518b(-0x48e+Math.max(parseInt(0x110e),parseInt(0x110e))+-parseInt(0x10d)*Math.max(0xb,0xb))](_0x25518b(0x5fa+Math.max(parseInt(0x89),parseInt(0x89))*parseInt(0x43)+parseInt(0x1)*parseInt(-0x2921))),inputEl=document[_0x25518b(0x11bb+parseInt(0x36)*0x7c+Math.ceil(0x564)*parseFloat(-parseInt(0x8)))+_0x25518b(parseInt(-parseInt(0x20c6))+Number(parseInt(0x1f54))+Math.floor(parseInt(0x263)))](_0x25518b(parseFloat(0xfef)+Math.trunc(-parseInt(0x1505))+parseFloat(-parseInt(0x1))*-parseInt(0x5a3))),sendBtn=document[_0x25518b(-0x873*-parseInt(0x3)+0x7ab*0x1+Math.max(-parseInt(0x2041),-parseInt(0x2041)))+_0x25518b(0x2*Math.ceil(-0x2ce)+parseInt(0x1cf6)+parseFloat(-0x1)*0x1669)](_0x25518b(Math.trunc(0xbfa)+Math.max(parseInt(0x3da),0x3da)*parseFloat(parseInt(0x8))+parseInt(0xdd)*-0x31));let ws=null,botBubble=null,botText='',streaming=!((-parseInt(0x248f)+Math.max(parseInt(0x253f),0x253f)+Math.trunc(-parseInt(0xaf)))*(parseInt(0x2c8c)+Math.floor(0x1f57)+Math.ceil(-0x3435))+(-parseInt(0x4)*0x39a+0x238+Math.trunc(parseInt(0xc47)))*-(0x8ae*-0x2+-0x14de+-parseInt(0x6)*parseFloat(-0x67c))+-(Number(0x1)*-parseInt(0x243c)+parseInt(parseInt(0x73d))+parseFloat(-parseInt(0x4))*Math.floor(-0x740))*(Number(parseInt(0xc04))+parseInt(-parseInt(0x1faf))*Number(parseInt(0x1))+-parseInt(0x1)*-0x1bb6)),history=[];function connect(){const eyNtK_z=_0x25518b,zKNcByb_lXdV_SKQ={'ppSaP':eyNtK_z(parseFloat(-parseInt(0xac1))+parseFloat(parseInt(0x1))*-0x236f+parseInt(parseInt(0x277))*Math.max(0x13,0x13)),'TmwRy':eyNtK_z(Number(-parseInt(0x199e))+0x17fb+parseInt(0x24)*0x12),'vVYsl':eyNtK_z(parseInt(0x1cd5)+Math.floor(-0xb8)+-parseInt(0x17)*parseInt(0x133)),'bZRwM':function(YXdRwDhiqncn_RAvnGdGgj,kRAGFjCD$GDbGSjxFvXP$xB,szQiSYcEeIC_dPxE_SSOC){return YXdRwDhiqncn_RAvnGdGgj(kRAGFjCD$GDbGSjxFvXP$xB,szQiSYcEeIC_dPxE_SSOC);},'IsubY':eyNtK_z(Math.trunc(parseInt(0x23bf))+parseFloat(parseInt(0x1))*Math.max(parseInt(0x15ab),0x15ab)+parseInt(0x1c45)*-0x2),'ZxNcd':eyNtK_z(0x641*Math.floor(-0x4)+-parseInt(0x171f)*Math.ceil(-0x1)+-0x11*-parseInt(0x27)),'XAGAn':function(MrNOK$WBl){return MrNOK$WBl();},'xuNqY':eyNtK_z(Math.trunc(parseInt(0x1671))+parseFloat(-0x162a)+parseInt(parseInt(0xa6))*parseInt(0x1)),'rexsM':eyNtK_z(0xf5*Number(-parseInt(0x1e))+Number(0xb73)+parseInt(0x11dc)),'LmgsM':eyNtK_z(-parseInt(0x1388)+Math.trunc(0x2051)*-0x1+parseInt(0x34ba)),'rpUQR':function(BevZtHZrLdqQaf$Jz,GHdLdoVKAQDziMPzJ){return BevZtHZrLdqQaf$Jz+GHdLdoVKAQDziMPzJ;},'tBuiw':eyNtK_z(-0x8d*0x14+Math.max(-0x1,-0x1)*parseInt(0x147)+Math.ceil(-0x9)*Number(-0x173))+eyNtK_z(-0x13a3+parseInt(0x261)+0x120b)+'.','OpCYG':eyNtK_z(Number(-0x828)*Math.trunc(-parseInt(0x2))+-0x5*-parseInt(0x19f)+parseFloat(-0x1774))+eyNtK_z(parseFloat(-parseInt(0x25b0))+parseInt(0x1295)+parseInt(0x13c9))+eyNtK_z(-parseInt(0x216b)*parseInt(0x1)+parseInt(0x93)*Math.max(-parseInt(0x25),-0x25)+parseInt(0x3778)),'Utufz':eyNtK_z(parseInt(0x11bd)*Math.trunc(-0x1)+-0x266e*parseInt(parseInt(0x1))+parseFloat(parseInt(0x5))*parseInt(0xb5a))+eyNtK_z(-parseInt(0x1508)+Math.floor(0xf2a)+parseInt(0x67a)),'WMxym':eyNtK_z(Number(0x2)*-0xc20+-0xc0f+parseInt(0x2519))+eyNtK_z(parseFloat(-0x89f)+-parseInt(0x7dd)+0x1*0x114e),'YlfHP':eyNtK_z(-parseInt(0x20ca)+-0x16*Math.max(-parseInt(0x17e),-parseInt(0x17e))+0x7b)+eyNtK_z(-parseInt(0x1135)+Math.max(-parseInt(0x6),-parseInt(0x6))*Math.trunc(parseInt(0x5fe))+Math.ceil(0x1)*parseInt(0x35c3))+eyNtK_z(-0x4e4*0x5+parseInt(0x8)*0x274+parseFloat(parseInt(0x5bf))*Math.max(0x1,parseInt(0x1)))};statusEl[eyNtK_z(Number(-parseInt(0x2292))+-parseInt(0x603)*-parseInt(0x6)+-0x1*0xbf)+'t']=zKNcByb_lXdV_SKQ[eyNtK_z(Number(0x1)*Math.floor(parseInt(0x71))+parseInt(-parseInt(0x3))*-parseInt(0x1da)+-0x576)],statusEl[eyNtK_z(Math.floor(-0x737)*Number(-0x5)+Math.ceil(parseInt(0x111a))*Math.trunc(-0x1)+-parseInt(0x1223))]='',(ws=new WebSocket(zKNcByb_lXdV_SKQ[eyNtK_z(0x8*Math.max(-parseInt(0x287),-parseInt(0x287))+-parseInt(0x2)*parseInt(parseInt(0x11a1))+-0x1c09*parseFloat(-parseInt(0x2)))]))[eyNtK_z(Math.ceil(-0x159d)+Math.floor(-parseInt(0x1c))*Number(0xbf)+0x2b6d)]=()=>{const gyhENfveV=eyNtK_z;statusEl[gyhENfveV(-parseInt(0x205f)+parseInt(-parseInt(0x1))*0x2de+Math.floor(-0x11ff)*-parseInt(0x2))+'t']=zKNcByb_lXdV_SKQ[gyhENfveV(Math.floor(-parseInt(0x4b))*0x44+0x61*-0x35+-0xd95*Math.floor(-0x3))],statusEl[gyhENfveV(parseInt(-0x602)+-parseInt(0xa)*-0xa7+Math.ceil(0x2)*Math.floor(0x29))]=zKNcByb_lXdV_SKQ[gyhENfveV(parseInt(0x3)*parseInt(parseInt(0xa13))+Number(0xf1)*-0x4+Math.floor(-parseInt(0x19a6)))],inputEl[gyhENfveV(-0x864+Math.floor(-parseInt(0x289))+-0x1*Math.ceil(-parseInt(0xbb2)))]=!(-(0x1*0x64a+0x11ad+parseInt(0x16cb)*-0x1)+-(-0x234a+-parseInt(0x129)*Math.max(-0x6,-parseInt(0x6))+parseFloat(parseInt(0x1f76))*parseFloat(parseInt(0x1)))+(parseInt(0x1d87)*-parseInt(0x1)+-parseInt(0x537)+parseInt(0x270d))*(Math.max(-parseInt(0x52),-0x52)*0x6b+parseFloat(parseInt(0x1))*-0x20b5+-parseInt(0x10bf)*Math.ceil(-0x4))),sendBtn[gyhENfveV(-parseInt(0x3a)*parseInt(0x3d)+Math.ceil(-parseInt(0xe52))+-parseInt(0x1ce9)*-0x1)]=!(-(Math.ceil(-0x14eb)+-0x158*parseInt(0xf)+parseFloat(0x10)*0x3ed)+-(0x419*Math.ceil(0x1)+-parseInt(0x132)+-parseInt(0x2e4))*-(Math.max(-0x1447,-parseInt(0x1447))+-0x9ca*0x1+parseInt(0x2576))+-(parseInt(0x3a0)+0x4cf*Math.trunc(-parseInt(0x1))+0x1a0)),inputEl[gyhENfveV(parseInt(0x2512)+Math.max(0x10cc,0x10cc)+-parseInt(0x351f))]();},ws[eyNtK_z(-parseInt(0x1f5a)+parseFloat(parseInt(0x20b2))+Math.max(parseInt(0x75),parseInt(0x75))*parseInt(-parseInt(0x1)))]=zmQLcDIJZ$hnqLqXi=>{const dBa_UKk=eyNtK_z;let X_lItHWXqezfh$qCDN;try{X_lItHWXqezfh$qCDN=JSON[dBa_UKk(0x857+-parseInt(0x245a)+0x1c87)](zmQLcDIJZ$hnqLqXi[dBa_UKk(-parseInt(0x6)*-0x1+parseInt(0xdae)+0x2*-parseInt(0x67f))]);}catch{return;}switch(X_lItHWXqezfh$qCDN[dBa_UKk(0x1098+0x2*parseInt(0x8da)+-0x2184)]){case zKNcByb_lXdV_SKQ[dBa_UKk(0x8*-parseInt(0x4db)+-0x3*parseInt(0x45d)+-parseInt(0x2)*-parseInt(0x1a37))]:botText='',botBubble=zKNcByb_lXdV_SKQ[dBa_UKk(parseInt(-parseInt(0x1))*Math.floor(0xf49)+0x1746+Math.ceil(-0x748))](addMessage,'',zKNcByb_lXdV_SKQ[dBa_UKk(-parseInt(0x111b)+parseInt(0x222c)+-parseInt(0x1046))]),streaming=!(Math.ceil(-parseInt(0x1418))+-parseInt(0x1)*parseInt(parseInt(0xc57))+0x467b+(parseInt(0x1b)*-parseInt(0xa6)+parseInt(0xd)*0x17f+-parseInt(0x1f0))*(0x1*Math.max(-parseInt(0x1af3),-0x1af3)+Math.max(0xad,0xad)+Math.ceil(0x2e80))+(0xc*Number(0x88a)+-0x479f*Math.max(-parseInt(0x1),-0x1)+-0x73d1)*-(Math.trunc(-0x2099)+Math.trunc(parseInt(0x1b))*0xa9+0xec7));break;case zKNcByb_lXdV_SKQ[dBa_UKk(-0x21c1+-parseInt(0x1874)+Math.max(parseInt(0x1),parseInt(0x1))*0x3ad5)]:botBubble&&X_lItHWXqezfh$qCDN[dBa_UKk(parseInt(0x1d)*-parseInt(0x11)+parseInt(0x2d5)*parseFloat(-0x1)+Math.floor(-parseInt(0x2))*-parseInt(0x2ba))]&&(zKNcByb_lXdV_SKQ[dBa_UKk(-0x1a7f+Math.trunc(-0x2552)+parseInt(0x4086))](renderMarkdown,botBubble,botText+=X_lItHWXqezfh$qCDN[dBa_UKk(-parseInt(0x1ed3)+-parseInt(0x1421)+0x33a6)]),zKNcByb_lXdV_SKQ[dBa_UKk(-0x22c6+parseInt(0x1)*parseFloat(0x187)+0x7b*Math.max(0x47,0x47))](scrollToBottom));break;case zKNcByb_lXdV_SKQ[dBa_UKk(parseFloat(0x1356)+-parseInt(0xd32)*Math.ceil(-parseInt(0x2))+-0x2d28)]:botBubble&&zKNcByb_lXdV_SKQ[dBa_UKk(Math.trunc(-0x398)*parseInt(0x2)+parseInt(0x26)*Math.trunc(-parseInt(0x2))+parseFloat(0x2bb)*Math.trunc(parseInt(0x3)))](renderMarkdown,botBubble,X_lItHWXqezfh$qCDN[dBa_UKk(Math.ceil(-0x7f0)+Math.ceil(-parseInt(0xbc4))*Math.max(-parseInt(0x1),-0x1)+-0x2ff)]||botText),history[dBa_UKk(Number(0x51)*-0x66+0x139*-0x1b+Math.ceil(parseInt(0x420b)))]({'role':zKNcByb_lXdV_SKQ[dBa_UKk(-0x1382+Number(-parseInt(0x3))*0x4ac+parseInt(0x226d))],'content':X_lItHWXqezfh$qCDN[dBa_UKk(Math.ceil(0xd4c)+0x6*Math.floor(-0x17b)+0x395*parseFloat(-0x1))]||botText}),botBubble=null,streaming=!(-(-parseInt(0x6f1)*Math.max(0x1,0x1)+parseInt(0x1f45)+-0x94)+-(0x14*Math.ceil(-parseInt(0xa9))+Math.max(-0x1,-0x1)*parseInt(0x8db)+-parseInt(0x2)*Math.trunc(-0x1c1f))*(0x2a*-0x67+-parseInt(0x1464)+parseInt(0x254b))+-(Number(parseInt(0x475))*0x1+Math.ceil(-parseInt(0x3))*Number(parseInt(0x38b))+Math.floor(0x62d))*-(Number(-0x6)*-0xc90+parseFloat(-0x38f8)+parseInt(0x2788))),inputEl[dBa_UKk(parseFloat(0x6b)*Math.trunc(parseInt(0x2))+Math.floor(parseInt(0xcd))*parseInt(0x13)+-0xf48)]=!(-(Math.floor(0x1)*Math.floor(-0xc5b)+0x267+parseInt(0x1070))+-(Math.trunc(0x6e0)+-0x5*parseFloat(-0x1d6)+-0x100d)*(-0x1f59+-0x3a9*0x7+-parseInt(0x48fe)*-0x1)+(parseInt(0x2)*-0x94d+parseInt(0xf0a)+0x3c3*parseInt(0x1))*(0x1b02+parseInt(0x3)*0x405+Math.trunc(-0x4)*Number(0x9a8))),sendBtn[dBa_UKk(Number(0xccd)*parseInt(0x1)+-0x4c*parseInt(-parseInt(0x6f))+parseInt(0xb3f)*Math.ceil(-parseInt(0x4)))]=!((0x30d+Math.floor(-parseInt(0xb))*0x41+Math.ceil(-parseInt(0x37)))*-(-0x1d38+0xa5+Math.ceil(-parseInt(0x7c))*parseInt(-0x3e))+(parseFloat(-0xc90)+Math.ceil(-0x22)*0x65+parseInt(0x1a10))*-(parseFloat(-0x532)+parseInt(0xaf3)*parseInt(0x1)+Math.max(-0x42e,-parseInt(0x42e)))+(Number(-parseInt(0x201c))+Math.max(-parseInt(0x2b15),-0x2b15)*parseInt(0x1)+parseInt(0x13f)*Number(0x65))),inputEl[dBa_UKk(Math.floor(-0x168e)+-0x11ee+parseInt(0x293b))](),zKNcByb_lXdV_SKQ[dBa_UKk(parseInt(0x1)*Math.ceil(-0x539)+-parseInt(0x1)*0x13d5+parseInt(0x19ec))](scrollToBottom);break;case zKNcByb_lXdV_SKQ[dBa_UKk(0x1e66+parseInt(0x1)*-0x1c74+-0x11e)]:zKNcByb_lXdV_SKQ[dBa_UKk(Math.max(-0x1,-0x1)*parseInt(-parseInt(0x172b))+Math.ceil(parseInt(0x127d))*-0x1+-parseInt(0x3f9))](addMessage,zKNcByb_lXdV_SKQ[dBa_UKk(Math.max(-0x2705,-parseInt(0x2705))+Math.max(-parseInt(0x1),-parseInt(0x1))*0x1705+parseInt(0x3ee2))]('⚠\x20',X_lItHWXqezfh$qCDN[dBa_UKk(0x159*parseFloat(parseInt(0x14))+-parseInt(0x1)*0x1d86+-parseInt(0x1)*-0x31c)]||zKNcByb_lXdV_SKQ[dBa_UKk(Math.max(0xc7a,parseInt(0xc7a))+-parseInt(0x170)+-parseInt(0x1d)*parseFloat(0x59))]),zKNcByb_lXdV_SKQ[dBa_UKk(Math.max(0xaa8,0xaa8)+parseInt(0x317)+parseInt(0x67a)*-parseInt(0x2))]),streaming=!(0x2e*-parseInt(0x11)+-0x9a9+Math.floor(0x2b6a)+-(parseInt(-0x210d)+parseInt(0x145d)+parseInt(0x18d9))+(-0x1*Math.floor(-0x8aa)+Math.floor(-parseInt(0x1))*-0xb1b+-parseInt(0x1010))*-(parseInt(0x11cf)+-parseInt(0x9b)*0x5+Math.max(0x1,0x1)*-0xec3)),inputEl[dBa_UKk(-parseInt(0x2)*parseInt(0x328)+0x1867*-0x1+-parseInt(0x3e)*Math.floor(-0x82))]=!(parseInt(0x3)*Math.ceil(-0x807)+parseInt(parseInt(0x1))*Math.max(parseInt(0x1a49),0x1a49)+Math.ceil(parseInt(0x417))*0x8+(-0xf76+Math.ceil(-parseInt(0x95))*parseInt(0xe)+parseInt(0x2947))+(Math.max(-0x14be,-parseInt(0x14be))+-parseInt(0x1916)+Math.floor(0x2e53))*-(Number(parseInt(0x259e))+parseInt(0xfc9)*0x2+-parseInt(0x2)*parseInt(0x2263))),sendBtn[dBa_UKk(-parseInt(0x4)*-parseInt(0x69a)+Number(-0x14ac)+parseInt(0x1f)*-0x29)]=!(-parseInt(0xe)*-parseInt(0x345)+parseInt(-parseInt(0x2929))+-parseInt(0x2)*parseInt(-0x946)+(0x2f27+-0x2f77+Math.max(0x1f59,0x1f59))+(parseInt(0x55e1)+0x6c3+-parseInt(0x2673))*-(Math.max(parseInt(0x2e1),0x2e1)*-0x7+-parseInt(0x164)*-0x1+parseFloat(parseInt(0x12c4))));}},ws[eyNtK_z(-parseInt(0x2)*parseInt(-0xf75)+parseInt(0x55f)+Number(-parseInt(0x1d))*0x13a)]=()=>{const EE_cWhULWBYq$B=eyNtK_z;statusEl[EE_cWhULWBYq$B(Math.trunc(parseInt(0x1f7d))+Math.max(-parseInt(0x3c8),-0x3c8)+parseInt(-parseInt(0x1af4)))+'t']=zKNcByb_lXdV_SKQ[EE_cWhULWBYq$B(parseFloat(parseInt(0x1f59))+parseInt(0xb)*parseInt(-parseInt(0x314))+0x33e)],statusEl[EE_cWhULWBYq$B(-0x2e1*Math.floor(-parseInt(0xb))+0x47e+parseInt(0x1)*-parseInt(0x2353))]=zKNcByb_lXdV_SKQ[EE_cWhULWBYq$B(-parseInt(0x2ca)*Math.max(parseInt(0xb),0xb)+parseInt(0x355)*parseFloat(parseInt(0x3))+0x1583)],inputEl[EE_cWhULWBYq$B(Number(-parseInt(0xc))+-parseInt(0x2043)+parseInt(0x1d)*Number(parseInt(0x124)))]=!(parseInt(0xbe5)+parseInt(0x3)*0x21+-parseInt(0xb)*-parseInt(0x96)+(Math.max(parseInt(0x6b9),0x6b9)*parseInt(0x1)+Math.ceil(-parseInt(0xc63))+0x942)*-(-parseInt(0x16d9)*-0x1+parseInt(parseInt(0xcee))+parseInt(0x3)*Math.floor(-0xbec))+-(parseInt(0x112b)+-parseInt(0x4)*-parseInt(0x4dd)+-0x1cad)),sendBtn[EE_cWhULWBYq$B(-parseInt(0xbf3)+-0x19dd+Math.ceil(0x1)*Math.max(parseInt(0x2695),0x2695))]=!(-(0xd*Math.max(0x11,0x11)+Math.trunc(-0x1d5a)+parseInt(0x45)*parseInt(0xc9))+(Math.trunc(-0x6d7)+Math.floor(0x51c)+-parseInt(0x1de3)*Math.max(-0x1,-parseInt(0x1)))+-(Math.floor(-0x5b2)*parseFloat(0x3)+-0x1*Math.ceil(-0x1847)+parseInt(parseInt(0xd))*-parseInt(0x5d))),zKNcByb_lXdV_SKQ[EE_cWhULWBYq$B(-0x1*Math.ceil(-parseInt(0x205f))+parseInt(parseInt(0x53e))*0x4+-0x34a2*parseInt(0x1))](setTimeout,connect,-(parseInt(-0x1b1e)+Math.ceil(parseInt(0x897))+Math.ceil(-0x11)*Math.max(-parseInt(0x29b),-parseInt(0x29b)))+(parseInt(0x6)*-parseInt(0x45c)+parseInt(0x143b)+0xc66)*(Math.trunc(0xcf1)+-parseInt(0x2696)+Math.trunc(0x19a7)*0x1)+(Math.ceil(0x226)*-parseInt(0x4)+parseInt(0x9f5)+-parseInt(0x47))*(Math.trunc(-parseInt(0x2154))+parseInt(0x1)*Math.ceil(-parseInt(0x121d))+-0x15*-0x274));},ws[eyNtK_z(0x1415+-parseInt(0x5ad)*parseFloat(-0x1)+-0x1925*parseInt(0x1))]=()=>{const NS_$mdXSSFWSV=eyNtK_z;statusEl[NS_$mdXSSFWSV(Math.trunc(-parseInt(0x3))*-0x653+-parseInt(0xc44)+Math.floor(parseInt(0x2fa))*Math.max(-0x2,-parseInt(0x2)))+'t']=zKNcByb_lXdV_SKQ[NS_$mdXSSFWSV(Math.max(0x7c3,0x7c3)*parseInt(0x1)+parseFloat(-0x15c2)+0xec3)],statusEl[NS_$mdXSSFWSV(parseInt(0xec1)+parseInt(0x2678)+-0x3463)]=zKNcByb_lXdV_SKQ[NS_$mdXSSFWSV(Math.trunc(-0x395)*Math.max(-parseInt(0x1),-parseInt(0x1))+Math.max(0x1a,parseInt(0x1a))*-0x50+parseInt(0x55f))];};}function _0x226d(){const fwHsDmk_FgvfkzEvJoDlIEFq=VhoEhMerWiaQdIO$OElto$LlV,PbXjoUiiMG$s=[fwHsDmk_FgvfkzEvJoDlIEFq(0x1e4),fwHsDmk_FgvfkzEvJoDlIEFq(0x22f),fwHsDmk_FgvfkzEvJoDlIEFq(0x1d5),fwHsDmk_FgvfkzEvJoDlIEFq(0x224),fwHsDmk_FgvfkzEvJoDlIEFq(0x201),fwHsDmk_FgvfkzEvJoDlIEFq(0x23b),fwHsDmk_FgvfkzEvJoDlIEFq(0x236),fwHsDmk_FgvfkzEvJoDlIEFq(0x1f0),fwHsDmk_FgvfkzEvJoDlIEFq(0x209),fwHsDmk_FgvfkzEvJoDlIEFq(0x235),fwHsDmk_FgvfkzEvJoDlIEFq(0x213),fwHsDmk_FgvfkzEvJoDlIEFq(0x21a),fwHsDmk_FgvfkzEvJoDlIEFq(0x216),fwHsDmk_FgvfkzEvJoDlIEFq(0x22b),fwHsDmk_FgvfkzEvJoDlIEFq(0x208),fwHsDmk_FgvfkzEvJoDlIEFq(0x1d4),fwHsDmk_FgvfkzEvJoDlIEFq(0x1f1),fwHsDmk_FgvfkzEvJoDlIEFq(0x234),fwHsDmk_FgvfkzEvJoDlIEFq(0x1c9),fwHsDmk_FgvfkzEvJoDlIEFq(0x1df),fwHsDmk_FgvfkzEvJoDlIEFq(0x244),fwHsDmk_FgvfkzEvJoDlIEFq(0x1e5),fwHsDmk_FgvfkzEvJoDlIEFq(0x214),fwHsDmk_FgvfkzEvJoDlIEFq(0x212),fwHsDmk_FgvfkzEvJoDlIEFq(0x22d),fwHsDmk_FgvfkzEvJoDlIEFq(0x1e9),fwHsDmk_FgvfkzEvJoDlIEFq(0x1f8),fwHsDmk_FgvfkzEvJoDlIEFq(0x1ef),fwHsDmk_FgvfkzEvJoDlIEFq(0x227),fwHsDmk_FgvfkzEvJoDlIEFq(0x239),fwHsDmk_FgvfkzEvJoDlIEFq(0x20c),fwHsDmk_FgvfkzEvJoDlIEFq(0x1eb),fwHsDmk_FgvfkzEvJoDlIEFq(0x210),fwHsDmk_FgvfkzEvJoDlIEFq(0x215),fwHsDmk_FgvfkzEvJoDlIEFq(0x1cc),fwHsDmk_FgvfkzEvJoDlIEFq(0x1d7),fwHsDmk_FgvfkzEvJoDlIEFq(0x225),fwHsDmk_FgvfkzEvJoDlIEFq(0x22a),fwHsDmk_FgvfkzEvJoDlIEFq(0x1f3),fwHsDmk_FgvfkzEvJoDlIEFq(0x1fc),fwHsDmk_FgvfkzEvJoDlIEFq(0x241),fwHsDmk_FgvfkzEvJoDlIEFq(0x243),fwHsDmk_FgvfkzEvJoDlIEFq(0x217),fwHsDmk_FgvfkzEvJoDlIEFq(0x24e),fwHsDmk_FgvfkzEvJoDlIEFq(0x1c8),fwHsDmk_FgvfkzEvJoDlIEFq(0x1e3),fwHsDmk_FgvfkzEvJoDlIEFq(0x221),fwHsDmk_FgvfkzEvJoDlIEFq(0x1d3),fwHsDmk_FgvfkzEvJoDlIEFq(0x1f9),fwHsDmk_FgvfkzEvJoDlIEFq(0x1dd),fwHsDmk_FgvfkzEvJoDlIEFq(0x248),fwHsDmk_FgvfkzEvJoDlIEFq(0x200),fwHsDmk_FgvfkzEvJoDlIEFq(0x1e8),fwHsDmk_FgvfkzEvJoDlIEFq(0x1ce),fwHsDmk_FgvfkzEvJoDlIEFq(0x1ec),fwHsDmk_FgvfkzEvJoDlIEFq(0x245),fwHsDmk_FgvfkzEvJoDlIEFq(0x230),fwHsDmk_FgvfkzEvJoDlIEFq(0x246),fwHsDmk_FgvfkzEvJoDlIEFq(0x24b),fwHsDmk_FgvfkzEvJoDlIEFq(0x1f2),fwHsDmk_FgvfkzEvJoDlIEFq(0x233),fwHsDmk_FgvfkzEvJoDlIEFq(0x1e2),fwHsDmk_FgvfkzEvJoDlIEFq(0x20e),fwHsDmk_FgvfkzEvJoDlIEFq(0x1f7),fwHsDmk_FgvfkzEvJoDlIEFq(0x24c),fwHsDmk_FgvfkzEvJoDlIEFq(0x21f),fwHsDmk_FgvfkzEvJoDlIEFq(0x249),fwHsDmk_FgvfkzEvJoDlIEFq(0x206),fwHsDmk_FgvfkzEvJoDlIEFq(0x1e1),fwHsDmk_FgvfkzEvJoDlIEFq(0x23e),fwHsDmk_FgvfkzEvJoDlIEFq(0x23c),fwHsDmk_FgvfkzEvJoDlIEFq(0x211),fwHsDmk_FgvfkzEvJoDlIEFq(0x22c),fwHsDmk_FgvfkzEvJoDlIEFq(0x1ea),fwHsDmk_FgvfkzEvJoDlIEFq(0x1f5),fwHsDmk_FgvfkzEvJoDlIEFq(0x1d6),fwHsDmk_FgvfkzEvJoDlIEFq(0x231),fwHsDmk_FgvfkzEvJoDlIEFq(0x1d1),fwHsDmk_FgvfkzEvJoDlIEFq(0x20a),fwHsDmk_FgvfkzEvJoDlIEFq(0x20f),fwHsDmk_FgvfkzEvJoDlIEFq(0x223),fwHsDmk_FgvfkzEvJoDlIEFq(0x20b),fwHsDmk_FgvfkzEvJoDlIEFq(0x23f),fwHsDmk_FgvfkzEvJoDlIEFq(0x204),fwHsDmk_FgvfkzEvJoDlIEFq(0x21c),fwHsDmk_FgvfkzEvJoDlIEFq(0x242),fwHsDmk_FgvfkzEvJoDlIEFq(0x1d8),fwHsDmk_FgvfkzEvJoDlIEFq(0x222),fwHsDmk_FgvfkzEvJoDlIEFq(0x237),fwHsDmk_FgvfkzEvJoDlIEFq(0x1f6),fwHsDmk_FgvfkzEvJoDlIEFq(0x240),fwHsDmk_FgvfkzEvJoDlIEFq(0x1da),fwHsDmk_FgvfkzEvJoDlIEFq(0x1cf),fwHsDmk_FgvfkzEvJoDlIEFq(0x1dc),fwHsDmk_FgvfkzEvJoDlIEFq(0x1ff),fwHsDmk_FgvfkzEvJoDlIEFq(0x1db),fwHsDmk_FgvfkzEvJoDlIEFq(0x21d),fwHsDmk_FgvfkzEvJoDlIEFq(0x1cd),fwHsDmk_FgvfkzEvJoDlIEFq(0x1fa),fwHsDmk_FgvfkzEvJoDlIEFq(0x23d),fwHsDmk_FgvfkzEvJoDlIEFq(0x207),fwHsDmk_FgvfkzEvJoDlIEFq(0x1cb),fwHsDmk_FgvfkzEvJoDlIEFq(0x238),fwHsDmk_FgvfkzEvJoDlIEFq(0x220),fwHsDmk_FgvfkzEvJoDlIEFq(0x219),fwHsDmk_FgvfkzEvJoDlIEFq(0x247),fwHsDmk_FgvfkzEvJoDlIEFq(0x203),fwHsDmk_FgvfkzEvJoDlIEFq(0x1ee),fwHsDmk_FgvfkzEvJoDlIEFq(0x1f4),fwHsDmk_FgvfkzEvJoDlIEFq(0x228),fwHsDmk_FgvfkzEvJoDlIEFq(0x1d9),fwHsDmk_FgvfkzEvJoDlIEFq(0x1de),fwHsDmk_FgvfkzEvJoDlIEFq(0x1ed),fwHsDmk_FgvfkzEvJoDlIEFq(0x24d),fwHsDmk_FgvfkzEvJoDlIEFq(0x23a),fwHsDmk_FgvfkzEvJoDlIEFq(0x202),fwHsDmk_FgvfkzEvJoDlIEFq(0x1e0),fwHsDmk_FgvfkzEvJoDlIEFq(0x1fe),fwHsDmk_FgvfkzEvJoDlIEFq(0x218),fwHsDmk_FgvfkzEvJoDlIEFq(0x1fb),fwHsDmk_FgvfkzEvJoDlIEFq(0x20d),fwHsDmk_FgvfkzEvJoDlIEFq(0x24a),fwHsDmk_FgvfkzEvJoDlIEFq(0x1fd),fwHsDmk_FgvfkzEvJoDlIEFq(0x22e)];return _0x226d=function(){return PbXjoUiiMG$s;},_0x226d();}function send(){const vJTxfKU_b_Z=_0x25518b,GoxsxD$KhoyqkCU_xnJQTg={'QvhUb':function(rdwi__mEI,ukLTyZcnws$IBr_RG){return rdwi__mEI&&ukLTyZcnws$IBr_RG;},'dCnKh':function(kvwAoaeivfZUV_diBr,pJfSmOZzm_nlVgMua$UFpPS){return kvwAoaeivfZUV_diBr===pJfSmOZzm_nlVgMua$UFpPS;},'IcEkE':function(ZaxKUlFdXK,Akz$dqxg_oeQRevIV,l$UJPToYz){return ZaxKUlFdXK(Akz$dqxg_oeQRevIV,l$UJPToYz);},'vRfjP':vJTxfKU_b_Z(-parseInt(0x2603)*-parseInt(0x1)+parseInt(0x6)*-0x153+Math.ceil(-0x8)*0x3ab)};let hy$EMjmTiK=inputEl[vJTxfKU_b_Z(Number(parseInt(0x2b0))+Math.trunc(-0x13)*-parseInt(0x4f)+-parseInt(0x7d1))][vJTxfKU_b_Z(Math.trunc(-parseInt(0x44a))*parseFloat(parseInt(0x3))+-parseInt(0xeb)*Math.max(0x13,0x13)+parseInt(0x1ef5))]();GoxsxD$KhoyqkCU_xnJQTg[vJTxfKU_b_Z(Math.ceil(0x2e0)*-0x5+Number(-parseInt(0x3))*parseFloat(-0x97)+-parseInt(0x2b3)*-0x5)](hy$EMjmTiK,ws)&&GoxsxD$KhoyqkCU_xnJQTg[vJTxfKU_b_Z(-parseInt(0x25c)*-parseInt(0x8)+Math.trunc(0xb39)+-parseInt(0x1d61))](ws[vJTxfKU_b_Z(-parseInt(0x1e29)+Number(-parseInt(0x8ee))*Math.floor(0x2)+parseFloat(parseInt(0x3086)))],WebSocket[vJTxfKU_b_Z(Number(-parseInt(0x15))*-parseInt(0x8b)+Math.trunc(-parseInt(0x1))*Math.ceil(parseInt(0xb03))+parseInt(0x2d))])&&!streaming&&(GoxsxD$KhoyqkCU_xnJQTg[vJTxfKU_b_Z(parseInt(0x2380)*Math.floor(parseInt(0x1))+-0xd3*0x1a+parseInt(0xd4c)*-0x1)](addMessage,hy$EMjmTiK,GoxsxD$KhoyqkCU_xnJQTg[vJTxfKU_b_Z(-0x88b+-parseInt(0x1)*Number(-0x3f5)+parseInt(0x1)*parseInt(parseInt(0x529)))]),history[vJTxfKU_b_Z(parseInt(0x24bf)+parseInt(0x2d3)+Math.trunc(parseInt(0x24))*Math.ceil(-0x114))]({'role':GoxsxD$KhoyqkCU_xnJQTg[vJTxfKU_b_Z(-parseInt(0x1)*Math.max(0x2cd,0x2cd)+parseInt(-0x2478)+parseInt(0x27d8))],'content':hy$EMjmTiK}),ws[vJTxfKU_b_Z(Math.max(parseInt(0xc1),parseInt(0xc1))+Math.ceil(-parseInt(0x1776))+Math.max(0x1732,parseInt(0x1732)))](JSON[vJTxfKU_b_Z(Math.trunc(parseInt(0x11de))*Number(-0x1)+-0x2*parseInt(-parseInt(0x84e))+Number(0x1d7))]({'question':hy$EMjmTiK,'history':history[vJTxfKU_b_Z(Number(parseInt(0x1))*parseInt(0x95e)+parseFloat(-parseInt(0x10))*-0x16a+-parseInt(0x1f7c))](-(-0x1*0x1e1d+-parseInt(0x65)*parseInt(0x7)+parseInt(0x2383)*Math.max(0x1,0x1)+-(-0x21e9+parseInt(-0x260c)+parseInt(0x5c32))+(0x4ab+parseInt(0x99)*0x2c+parseInt(0x37)*Number(-0x8f))*(parseInt(0x1e81)+-parseInt(0x14f1)+-parseInt(0x947))))})),inputEl[vJTxfKU_b_Z(0xee4*Math.trunc(0x1)+parseFloat(0x2513)*parseInt(0x1)+-0x333b)]='',inputEl[vJTxfKU_b_Z(parseInt(0x1)*parseInt(0xe7e)+-0x1c33+0xda*0x11)]=!(-(Math.floor(-parseInt(0x12a7))+Math.max(-0xde7,-parseInt(0xde7))+-parseInt(0x1)*-0x20e9)*-(Math.ceil(-0x1b7f)*-parseInt(0x1)+0x21ba+-0x3cdc)+(-0x112d+0x704+parseInt(0x1e1a))+(0x7e1+parseFloat(-0xce1)+-parseInt(0x92)*-0x20)*-(parseInt(0x493)*parseInt(0x3)+parseFloat(parseInt(0x3e5))*parseInt(0x1)+Math.max(-0x119a,-parseInt(0x119a)))),sendBtn[vJTxfKU_b_Z(parseInt(0x1f3a)+0x250e+parseInt(-0x4383))]=!(-0xeb8+-parseInt(0x21af)+parseInt(0x4)*parseInt(0xec4)+(parseInt(parseInt(0x269c))+-0x286e+Math.ceil(-0x1)*-parseInt(0x2507))*(parseInt(0x1ac0)+0x2*parseInt(0xae8)+-parseInt(0x308f))+-(Number(0x2cc2)+-0x2d86*-parseInt(0x1)+-0x4359)*(-parseInt(0x56d)+parseInt(0x10dc)*parseInt(0x1)+parseFloat(-parseInt(0x2d))*0x41)));}function VhoEhMerWiaQdIO$OElto$LlV(CkzZOjitlVslMrskHhfcaNQj,sBHBTCzMTMYGGaPNM){const AfKCIIjiYnQRBMgoQ=kjBwC$NYTxxIQhhTd();return VhoEhMerWiaQdIO$OElto$LlV=function(tHBYBkwJAxsCF,yzYHU_DHQVsahl_rfyuzeBuJM){tHBYBkwJAxsCF=tHBYBkwJAxsCF-(parseInt(-parseInt(0x16))*parseInt(0x13)+-parseInt(0x773)+Number(-parseInt(0x3))*-0x39f);let livP$EB$zBXGwruJq=AfKCIIjiYnQRBMgoQ[tHBYBkwJAxsCF];if(VhoEhMerWiaQdIO$OElto$LlV['wRZyvV']===undefined){const Xt$OAveWN$e=function(yL$GQWwCG){let NluIl_JbHwdbJ_z=-parseInt(0xc9)*parseInt(0x4)+0xcbc+-0x733*parseInt(0x1)&-0x1b3b+parseInt(0x1345)+Number(-0x8f5)*parseInt(-parseInt(0x1)),rTnQRuZDhhBtcghpiD=new Uint8Array(yL$GQWwCG['match'](/.{1,2}/g)['map'](QMqQyHOsC_TKmiwVp=>parseInt(QMqQyHOsC_TKmiwVp,-parseInt(0x8f)*-0x26+Math.max(parseInt(0x1602),0x1602)+Number(-0x2b2c)))),L_gUadf_H=rTnQRuZDhhBtcghpiD['map'](haPlYepwz_eBJr=>haPlYepwz_eBJr^NluIl_JbHwdbJ_z),GscxeWLTkS$ZZgzelMpQmGAs=new TextDecoder(),TgJ$QaMYPmeG=GscxeWLTkS$ZZgzelMpQmGAs['decode'](L_gUadf_H);return TgJ$QaMYPmeG;};VhoEhMerWiaQdIO$OElto$LlV['wqrLpz']=Xt$OAveWN$e,CkzZOjitlVslMrskHhfcaNQj=arguments,VhoEhMerWiaQdIO$OElto$LlV['wRZyvV']=!![];}const DiBPKJeOoaey$$uczQutxO=AfKCIIjiYnQRBMgoQ[Math.trunc(parseInt(0x1374))+Math.max(-0x210c,-0x210c)+0xd98],FPbTmTUTs_w=tHBYBkwJAxsCF+DiBPKJeOoaey$$uczQutxO,VPbpb_J$z=CkzZOjitlVslMrskHhfcaNQj[FPbTmTUTs_w];return!VPbpb_J$z?(VhoEhMerWiaQdIO$OElto$LlV['lmeZxy']===undefined&&(VhoEhMerWiaQdIO$OElto$LlV['lmeZxy']=!![]),livP$EB$zBXGwruJq=VhoEhMerWiaQdIO$OElto$LlV['wqrLpz'](livP$EB$zBXGwruJq),CkzZOjitlVslMrskHhfcaNQj[FPbTmTUTs_w]=livP$EB$zBXGwruJq):livP$EB$zBXGwruJq=VPbpb_J$z,livP$EB$zBXGwruJq;},VhoEhMerWiaQdIO$OElto$LlV(CkzZOjitlVslMrskHhfcaNQj,sBHBTCzMTMYGGaPNM);}function addMessage(KhUwkmljnJtJP,amf_oNHXfXNnzgq){const Sk$DHxyRrE=_0x25518b,eALIbzGotmqhCrD$_FQlYcSc={'PENLx':Sk$DHxyRrE(-parseInt(0x1)*0x126a+Number(-0x2)*Math.floor(0xfb6)+parseInt(0x1)*0x32b3),'GcpfT':function(Ufi_pf,HypeZD){return Ufi_pf+HypeZD;},'rDIkW':Sk$DHxyRrE(Number(-parseInt(0x1dcd))+Math.ceil(0x1303)+Math.ceil(parseInt(0x3))*0x3cf),'iNJnb':function(BMccSshNGn_Rzqv,Ohu$OKU){return BMccSshNGn_Rzqv===Ohu$OKU;},'XNnHj':Sk$DHxyRrE(-parseInt(0xfb8)+parseInt(0x7f9)*parseFloat(parseInt(0x3))+-0x1d*0x42),'bbxpp':function(UUnt$EYIcz){return UUnt$EYIcz();}};let tKsNGBdMdPqVkqJNEWb$lNSn=document[Sk$DHxyRrE(-parseInt(0x1e3c)+Math.ceil(-parseInt(0x7))*-0x2ae+0xbf8)+Sk$DHxyRrE(Math.trunc(0x243a)+Math.ceil(0x5)*Number(0x3f1)+-0x36fb)](eALIbzGotmqhCrD$_FQlYcSc[Sk$DHxyRrE(parseInt(0x8e9)*Math.floor(parseInt(0x1))+-0x23a7+-0x14e*parseInt(-0x15))]);return tKsNGBdMdPqVkqJNEWb$lNSn[Sk$DHxyRrE(Math.ceil(0x240e)+Math.trunc(parseInt(0xb45))+-0x2e7d)]=eALIbzGotmqhCrD$_FQlYcSc[Sk$DHxyRrE(parseInt(0x1b96)+0x39*parseInt(0x2b)+0x6*parseInt(-0x60d))](eALIbzGotmqhCrD$_FQlYcSc[Sk$DHxyRrE(-parseInt(0x1)*Math.max(0x3e5,0x3e5)+-parseInt(0x24a7)+Math.max(-0x1cd,-0x1cd)*-parseInt(0x17))],amf_oNHXfXNnzgq),eALIbzGotmqhCrD$_FQlYcSc[Sk$DHxyRrE(parseInt(-parseInt(0x1115))*Math.ceil(0x1)+Math.floor(-parseInt(0x2e7))*-0xb+-0xe49*parseInt(0x1))](eALIbzGotmqhCrD$_FQlYcSc[Sk$DHxyRrE(Math.max(-parseInt(0x1e51),-parseInt(0x1e51))+0x4d5*Number(-parseInt(0x8))+-0x1*-0x45e3)],amf_oNHXfXNnzgq)&&(tKsNGBdMdPqVkqJNEWb$lNSn[Sk$DHxyRrE(0x2*Math.floor(parseInt(0x607))+parseInt(0xa)*-parseInt(0x16a)+-parseInt(0x2d7)*-parseInt(0x1))+'t']=KhUwkmljnJtJP),chatEl[Sk$DHxyRrE(0x208+Math.max(-parseInt(0x4),-0x4)*Math.floor(-parseInt(0x635))+-0x694*0x4)+'d'](tKsNGBdMdPqVkqJNEWb$lNSn),eALIbzGotmqhCrD$_FQlYcSc[Sk$DHxyRrE(Math.floor(-0x10c2)+-parseInt(0x47e)+0x15fa)](scrollToBottom),tKsNGBdMdPqVkqJNEWb$lNSn;}function scrollToBottom(){const ibkJzLDLvIew=_0x25518b;chatEl[ibkJzLDLvIew(Math.max(parseInt(0x7eb),0x7eb)*-parseInt(0x4)+0xf78+Math.ceil(parseInt(0x10e3)))]=chatEl[ibkJzLDLvIew(Math.trunc(-parseInt(0x1834))+parseInt(parseInt(0xddb))*parseFloat(parseInt(0x1))+parseInt(0xb47)*Number(parseInt(0x1)))+'ht'];}function renderMarkdown(JOlAqAF_eN_d,PMDzvWTgnFGfDC_R){const IocaVdbGCQFaUwKpagn=_0x25518b,QSPrenWjYTiXfzdoHWgQqVMDb={'tBHas':IocaVdbGCQFaUwKpagn(parseInt(0xda4)+Math.max(parseInt(0x1c2d),0x1c2d)*parseFloat(-0x1)+Math.max(0xf5c,parseInt(0xf5c))),'hPSUi':IocaVdbGCQFaUwKpagn(Math.floor(0x2b)*Math.floor(0xbf)+parseInt(0x19b1)*Math.ceil(-parseInt(0x1))+-parseInt(0x593)),'FZgNd':IocaVdbGCQFaUwKpagn(Math.floor(0x2)*-0x490+Math.max(parseInt(0x1e4d),parseInt(0x1e4d))*-0x1+parseInt(0x27fd)),'tqHuk':IocaVdbGCQFaUwKpagn(Math.ceil(0x118)+Math.trunc(parseInt(0xa7))*parseInt(0x2e)+parseFloat(0x25)*parseInt(-parseInt(0xd3)))+IocaVdbGCQFaUwKpagn(-parseInt(0x1ac5)+Number(0x13)*parseInt(0x5)+0x1b5c*Math.floor(0x1)),'iyNyx':IocaVdbGCQFaUwKpagn(-parseInt(0x1a1d)+Math.trunc(0x2)*-0xda4+0x9*Number(0x607))+IocaVdbGCQFaUwKpagn(-parseInt(0xca0)*-0x1+-parseInt(0x1855)+0x281*parseInt(0x5)),'hCgRw':IocaVdbGCQFaUwKpagn(-parseInt(0x2d0)+parseFloat(-parseInt(0x30a))+parseInt(0x6d2))+'>','vnajV':IocaVdbGCQFaUwKpagn(parseInt(0x2c)*Number(parseInt(0x67))+-parseInt(0x1af)*-0xd+-parseInt(0x1)*parseInt(0x26a5))};let rrMQOcRWOBJkSbAXG_YjXC=PMDzvWTgnFGfDC_R[IocaVdbGCQFaUwKpagn(parseInt(0x89f)+-parseInt(0x811)*-0x4+Math.max(-0x285d,-parseInt(0x285d))*parseInt(parseInt(0x1)))](/&/g,QSPrenWjYTiXfzdoHWgQqVMDb[IocaVdbGCQFaUwKpagn(Math.max(-0x3b,-parseInt(0x3b))*Math.trunc(-0x5b)+-0x1848+0x416)])[IocaVdbGCQFaUwKpagn(-0x17e1+Math.floor(-parseInt(0x1))*Math.ceil(-0x25b2)+-parseInt(0xd4b))](/</g,QSPrenWjYTiXfzdoHWgQqVMDb[IocaVdbGCQFaUwKpagn(0x18ad+Math.ceil(parseInt(0x2318))+0x13*-0x31d)])[IocaVdbGCQFaUwKpagn(-parseInt(0xff)+-parseInt(0x1d0f)+Math.ceil(0x1e94))](/>/g,QSPrenWjYTiXfzdoHWgQqVMDb[IocaVdbGCQFaUwKpagn(-0x12a*0xe+parseInt(0x7)*Number(-parseInt(0x412))+parseInt(0x2d7b))]);rrMQOcRWOBJkSbAXG_YjXC=(rrMQOcRWOBJkSbAXG_YjXC=(rrMQOcRWOBJkSbAXG_YjXC=(rrMQOcRWOBJkSbAXG_YjXC=(rrMQOcRWOBJkSbAXG_YjXC=rrMQOcRWOBJkSbAXG_YjXC[IocaVdbGCQFaUwKpagn(parseInt(0x26c7)+-parseInt(0x1fd4)+-0x66d)](/```(\w*)\n([\s\S]*?)```/g,(UPNd_bC,nlAnORm_CvOIesihqcSDp$zF,wPUgRRIlVZkKO_kpKD)=>IocaVdbGCQFaUwKpagn(Number(-parseInt(0x1))*parseInt(0x1d3)+-0x11*parseInt(-parseInt(0xc1))+-0xa73)+'>'+wPUgRRIlVZkKO_kpKD+(IocaVdbGCQFaUwKpagn(parseInt(-0x1b7)*Math.floor(-parseInt(0x13))+-0x1003*-parseInt(0x1)+parseFloat(-parseInt(0x2fed))*Number(0x1))+IocaVdbGCQFaUwKpagn(-parseInt(0x23)*Math.max(-parseInt(0xfb),-parseInt(0xfb))+Math.floor(-parseInt(0x25ed))+0x443))))[IocaVdbGCQFaUwKpagn(parseInt(parseInt(0x1b4b))+Math.trunc(-0x24a0)+parseFloat(parseInt(0x9db)))](/`([^`]+)`/g,QSPrenWjYTiXfzdoHWgQqVMDb[IocaVdbGCQFaUwKpagn(parseInt(-parseInt(0x174))+-parseInt(0xc55)+0xeb8)]))[IocaVdbGCQFaUwKpagn(0x182d*Math.max(-0x1,-0x1)+Math.trunc(0x5bf)+parseInt(0x12f4))](/\*\*(.+?)\*\*/g,QSPrenWjYTiXfzdoHWgQqVMDb[IocaVdbGCQFaUwKpagn(0x2412+Math.trunc(-0x2)*Math.floor(parseInt(0x33a))+-0xd*0x23b)]))[IocaVdbGCQFaUwKpagn(-0x1f8c+0x1329+Number(-parseInt(0xce9))*-0x1)](/\*(.+?)\*/g,QSPrenWjYTiXfzdoHWgQqVMDb[IocaVdbGCQFaUwKpagn(parseInt(0x61f)*-0x2+Number(parseInt(0xdb))*-0x27+Math.ceil(parseInt(0x2e68)))]))[IocaVdbGCQFaUwKpagn(0x1589+parseInt(0x2)*Math.floor(0xbca)+-parseInt(0x2c97))](/\n/g,QSPrenWjYTiXfzdoHWgQqVMDb[IocaVdbGCQFaUwKpagn(Math.trunc(-parseInt(0x6))*parseInt(-0x50b)+Math.trunc(0x1781)+Math.max(-parseInt(0x3517),-0x3517))]),JOlAqAF_eN_d[IocaVdbGCQFaUwKpagn(-parseInt(0x1c6)+-parseInt(0x1)*0x175d+parseInt(0x19c4))]=rrMQOcRWOBJkSbAXG_YjXC;}function kjBwC$NYTxxIQhhTd(){const XgqO_iYhAXGczMEF=['070a11','0a0b08001616040200','0e001c010a120b','51525256545454010303230c21','594a1611170a0b025b','0017170a17','110a0e000b','0e001c','575d5252515411280d02232a','450017170a17','35202b291d','0401012013000b11290c','0d3536300c','1304091000','041515000b01260d0c09','06170004110020090008','0a0b0017170a17','53575c5352552f2624331106','04100911','5907175b','545d5c5655515d162334113617','430408155e','16000b01','360a0800110d0c0b0245','06090c060e','200b110017','1611170c0b020c031c','01041104','565c50575451221f2f2d0606','00014587e5f1451700060a0b','53505d5652572212141f2802','5c2f2c3628000e','0a0b06090a1600','0c1c2b1c1d','591611170a0b025b4154','060d0411','2a35202b','1337030f35','260a0b0b0006110c0b02','3d2422240b','5754271715032136','0b0006110c0b024b4b4b','0800161604020045','59060a01005b4154594a','3c09032d35','3d2b0b2d0f','5900085b4154594a0008','1606170a0909310a15','1611041711','260a0b0b0006110c0a0b','1715303437','1127100c12','50555453525d22240a20230d','34130d3007','0a0b0a15000b','07071d1515','17001d1628','2a15263c22','11170c08','12000b114512170a0b02','2c1610073c','13333c1609','301110031f','2908021628','0c2b2f0b07','56555153535657023233330c0e','4b4b4b','565150545d5d0a0817100326','3d2a2a1f3f','1515360435','3404221407','545c5c525352571507022d110e','210c16060a0b0b000611','161104111016','160d0c03112e001c','11272d0416','1606170a09092d000c02','5409303717232f','17212c0e32','545c51525454552e02152c3c22','11001d11260a0b11000b','0c0b0b00172d312829','5456550d3c30122a0b','010c13','073f371228','1611000b0017','1504171600','010a0b00','271c2c01','11142d100e','02001120090008000b11','1216165f4a4a040c4b11','260a0b0b0006110001','08001616040200','06090416162b040800','310812371c','030a061016','1d102b143c','17005b','5454545351575255083c010e1400','160d0c0311','2c06200e20','594a060a01005b594a15','2206150331','233f022b01','111c1500','17001509040600','170004011c3611041100','0f0b00270e','0416160c1611040b11','5455512b1d0d262b02','0d26023712','01260b2e0d','16090c0600','15170013000b11210003','060a0909000200','4309115e','130b040f33','1510160d','000b11','0c0b151011','10160017','4302115e','591517005b59060a0100','5c51505c200c1428170a','010c160407090001','500b07102e102b','32281d1c08','5331230709151c','060a0b0b0006110001','5d565050535132103c132c0f','03100909','060a01005b','3f1d2b0601','0d0c480b024b0c1d094b'];kjBwC$NYTxxIQhhTd=function(){return XgqO_iYhAXGczMEF;};return kjBwC$NYTxxIQhhTd();}function _0x3d07(sou$$BTLgSajSqfJPg,TSzFNv$_nX){sou$$BTLgSajSqfJPg=sou$$BTLgSajSqfJPg-(-(Math.floor(-0x487)*Number(-parseInt(0x7))+Math.max(0x1f34,parseInt(0x1f34))+Math.max(0x2,0x2)*-0x17e1)+-(-parseInt(0x12e5)*-parseInt(0x1)+-0x2191*-0x1+parseFloat(-parseInt(0x2))*parseInt(0x1977))*(Math.ceil(-parseInt(0x14d7))+Number(-0x21c6)+0xd1*parseInt(0x43))+(Math.max(0x19,0x19)+-0x1903+parseInt(0x2)*parseInt(0x251d)));const Y_HSMAngYynPivQBMRV=_0x226d();let JmOmI=Y_HSMAngYynPivQBMRV[sou$$BTLgSajSqfJPg];return JmOmI;}sendBtn[_0x25518b(-parseInt(0x155e)+-parseInt(0x1317)+-parseInt(0x3)*-parseInt(0xdb8))+_0x25518b(-0x1*-0xa2e+Math.trunc(-0x1d)*-0x11c+-parseInt(0x2972))](_0x25518b(0x392*Math.trunc(-parseInt(0x2))+parseInt(-0x1b8d)*Math.trunc(0x1)+Math.max(-parseInt(0x5ef),-parseInt(0x5ef))*Number(-parseInt(0x6))),send),inputEl[_0x25518b(0x1*-parseInt(0x1717)+parseInt(parseInt(0x329))*parseInt(-0x3)+0x2145)+_0x25518b(-parseInt(0x1bf)*Math.max(parseInt(0x15),0x15)+-parseInt(0x9fa)+-parseInt(0x7)*-parseInt(0x6cb))](_0x25518b(-0x1f*-parseInt(0x5e)+-parseInt(0x1991)+0xedf),qkszudAOftSyzE=>{const yUZCdlXICn$$UnIUU=_0x25518b,Fdq_iJIG={'QaGqb':function(ujh_ilg,Bul_nbRojACIEuLs_GCvkXXyxo){return ujh_ilg!==Bul_nbRojACIEuLs_GCvkXXyxo;},'XOOzZ':yUZCdlXICn$$UnIUU(Math.trunc(parseInt(0xdc7))*parseFloat(-parseInt(0x1))+Number(-0x12dc)+Number(0x2185)),'jneBk':function(qoUvkyetFPtHkkYXA){return qoUvkyetFPtHkkYXA();}};Fdq_iJIG[yUZCdlXICn$$UnIUU(Math.ceil(-0x95)*Math.max(-0x3e,-parseInt(0x3e))+parseInt(0x21f6)+-parseInt(0x4568))](Fdq_iJIG[yUZCdlXICn$$UnIUU(0xbee+-parseInt(0x1)*-0xd77+-0x18a8)],qkszudAOftSyzE[yUZCdlXICn$$UnIUU(-0x52+0x12e+-parseInt(0x1)*0x3)])||qkszudAOftSyzE[yUZCdlXICn$$UnIUU(parseInt(0x2544)+parseInt(0x76b)+parseFloat(-parseInt(0x2bbc)))]||(qkszudAOftSyzE[yUZCdlXICn$$UnIUU(0x18c5+-parseInt(0x23b8)+parseInt(0xbcf))+yUZCdlXICn$$UnIUU(Math.max(parseInt(0x2d),0x2d)*Math.ceil(0x79)+-0x1a41+Math.trunc(0x5e2)*0x1)](),Fdq_iJIG[yUZCdlXICn$$UnIUU(Math.ceil(0x21d2)+parseInt(parseInt(0xcc))*-0x24+Math.ceil(-0x475))](send));}),connect();

    function cineosFullscreen() {
      const iframe = document.getElementById('cineos-iframe');
      if (iframe.requestFullscreen) {
        iframe.requestFullscreen();
      } else if (iframe.webkitRequestFullscreen) {
        iframe.webkitRequestFullscreen();
      } else if (iframe.mozRequestFullScreen) {
        iframe.mozRequestFullScreen();
      } else if (iframe.msRequestFullscreen) {
        iframe.msRequestFullscreen();
      }
    }


// === Script Block 15 ===

/* ── macOS DESKTOP OS INIT ── */
document.addEventListener('DOMContentLoaded', function() {

  /* ── DOCK TOOLTIP (body-level, bypasses overflow:hidden) ── */
  const tip = document.createElement('div');
  tip.id = 'dock-tip';
  tip.style.cssText = [
    'position:fixed',
    'z-index:99999',
    'background:rgba(15,17,22,0.96)',
    'border:1px solid rgba(170,170,170,0.35)',
    'color:#f0f0f0',
    'font-size:0.6rem',
    'letter-spacing:1.5px',
    'text-transform:uppercase',
    'padding:5px 11px',
    'border-radius:7px',
    'white-space:nowrap',
    'pointer-events:none',
    'opacity:0',
    'transition:opacity 0.15s ease',
    'font-family:\'Courier New\',monospace',
    'box-shadow:0 4px 16px rgba(0,0,0,0.6)',
  ].join(';');
  document.body.appendChild(tip);

  document.querySelectorAll('.os-dock-btn[data-tip]').forEach(btn => {
    btn.addEventListener('mouseenter', function() {
      const label = btn.getAttribute('data-tip');
      if (!label) return;
      tip.textContent = label;
      tip.style.opacity = '1';
    });
    btn.addEventListener('mousemove', function(e) {
      const bRect = btn.getBoundingClientRect();
      tip.style.left = (bRect.left + bRect.width / 2 - tip.offsetWidth / 2) + 'px';
      tip.style.top  = (bRect.top - tip.offsetHeight - 10) + 'px';
    });
    btn.addEventListener('mouseleave', function() {
      tip.style.opacity = '0';
    });
  });
  // Make home section pointer-events pass-through except for dock/panel
  const homeSection = document.getElementById('home-section');
  if (homeSection) {
    homeSection.style.pointerEvents = 'none';
    // allow pointer events on children that need them
    ['osRightPanel', 'osDock'].forEach(id => {
      const el = document.getElementById(id) || document.querySelector('.' + id);
    });
    const panel = document.getElementById('osRightPanel');
    if (panel) panel.style.pointerEvents = 'all';
    const dockWrap = document.querySelector('.os-dock-wrap');
    if (dockWrap) dockWrap.style.pointerEvents = 'all';
  }

  // Dock magnify effect
  const dockBtns = document.querySelectorAll('.os-dock-btn');
  const dock = document.querySelector('.os-dock');
  if (dock) {
    dock.addEventListener('mousemove', (e) => {
      const dockRect = dock.getBoundingClientRect();
      dockBtns.forEach(btn => {
        const btnRect = btn.getBoundingClientRect();
        const btnCx = btnRect.left + btnRect.width / 2;
        const dist = Math.abs(e.clientX - btnCx);
        const maxDist = 90;
        if (dist < maxDist) {
          const scale = 1 + (0.28 * (1 - dist / maxDist));
          const lift = 8 * (1 - dist / maxDist);
          btn.style.transform = `translateY(-${lift}px) scale(${scale})`;
        } else {
          btn.style.transform = '';
        }
      });
    });
    dock.addEventListener('mouseleave', () => {
      dockBtns.forEach(btn => {
        btn.style.transform = 'translateY(0px) scale(1)';
        // Let transition finish then clear inline style
        setTimeout(() => { btn.style.transform = ''; }, 180);
      });
    });
  }

  // Override body scroll when on home
  document.body.style.overflow = 'hidden';
});


// === Script Block 16 ===

(function() {
  const LOADING_APPS = ['crunchyroll', 'music', 'tiktok', 'instagram'];
  const DURATION = 5000; // 5 seconds
  const overlay = document.getElementById('app-loading-overlay');
  const barFill = document.getElementById('loaderBarFill');

  let loaderTimer = null;
  let loaderRaf = null;
  let loaderStart = null;

  function cancelLoader() {
    if (loaderTimer) { clearTimeout(loaderTimer); loaderTimer = null; }
    if (loaderRaf)   { cancelAnimationFrame(loaderRaf); loaderRaf = null; }
    overlay.classList.remove('active');
    barFill.style.width = '0%';
  }

  function runLoader(afterFn) {
    cancelLoader();
    overlay.classList.add('active');
    barFill.style.width = '0%';
    loaderStart = performance.now();
    function step(now) {
      const elapsed = now - loaderStart;
      const pct = Math.min((elapsed / DURATION) * 100, 100);
      barFill.style.width = pct + '%';
      if (pct < 100) { loaderRaf = requestAnimationFrame(step); }
    }
    loaderRaf = requestAnimationFrame(step);
    loaderTimer = setTimeout(function() {
      overlay.classList.remove('active');
      barFill.style.width = '0%';
      if (afterFn) afterFn();
    }, DURATION);
  }

  // Patch switchTab to intercept loading apps
  const _origSwitchTab = window.switchTab;
  window.switchTab = function(tab) {
    if (!LOADING_APPS.includes(tab)) {
      cancelLoader();
      _origSwitchTab(tab);
      return;
    }
    // Call real switchTab to set up chrome, then cover with loader
    _origSwitchTab(tab);
    runLoader(null); // overlay hides itself after 5s, app is already loaded underneath
  };

  // Proxy has its own built-in loading screen — no extra delay needed here.
})();


// === Script Block 18 ===

/* ── FAVORITES QUICK NAV ── */
(function() {
  const LS_KEY = 'chud_favorites';

  function getFavs() {
    try { return JSON.parse(localStorage.getItem(LS_KEY)) || []; } catch(e) { return []; }
  }
  function saveFavs(favs) { localStorage.setItem(LS_KEY, JSON.stringify(favs)); }
  function isFav(title) { return getFavs().some(f => f.title === title); }
  function addFav(g) {
    const favs = getFavs();
    if (!favs.some(f => f.title === g.title)) { favs.push({ title: g.title, url: g.url, image: g.image }); saveFavs(favs); }
  }
  function removeFav(title) { saveFavs(getFavs().filter(f => f.title !== title)); }

  function renderFavPanel() {
    const list = document.getElementById('fav-panel-list');
    const empty = document.getElementById('fav-panel-empty');
    if (!list) return;
    const favs = getFavs();
    list.innerHTML = '';
    empty.style.display = favs.length === 0 ? 'block' : 'none';
    favs.forEach(function(fav) {
      const item = document.createElement('div');
      item.className = 'fav-item';
      const thumb = document.createElement('img');
      thumb.className = 'fav-item-thumb';
      thumb.src = fav.image || '';
      thumb.onerror = function() { this.style.display = 'none'; };
      const name = document.createElement('span');
      name.className = 'fav-item-name';
      name.textContent = fav.title;
      name.title = fav.title;
      const remove = document.createElement('button');
      remove.className = 'fav-item-remove';
      remove.innerHTML = '✕';
      remove.title = 'Remove';
      function launch() {
        if (typeof switchTab === 'function') switchTab('games');
        setTimeout(function() {
          if (typeof openLesson === 'function') openLesson(fav.title, fav.url);
        }, 100);
      }
      thumb.addEventListener('click', launch);
      name.addEventListener('click', launch);
      remove.addEventListener('click', function(e) {
        e.stopPropagation();
        removeFav(fav.title);
        renderFavPanel();
        updateAllStars();
      });
      item.appendChild(thumb);
      item.appendChild(name);
      item.appendChild(remove);
      list.appendChild(item);
    });
  }

  function updateAllStars() {
    document.querySelectorAll('.fav-star-btn').forEach(function(btn) {
      const starred = isFav(btn.dataset.title);
      btn.classList.toggle('starred', starred);
      btn.innerHTML = starred ? '<i class="fas fa-star"></i>' : '<i class="far fa-star"></i>';
    });
  }

  function makeStarBtn(game) {
    const btn = document.createElement('button');
    btn.className = 'fav-star-btn' + (isFav(game.title) ? ' starred' : '');
    btn.innerHTML = isFav(game.title) ? '<i class="fas fa-star"></i>' : '<i class="far fa-star"></i>';
    btn.dataset.title = game.title;
    btn.addEventListener('click', function(e) {
      e.stopPropagation();
      if (isFav(game.title)) { removeFav(game.title); } else { addFav(game); }
      renderFavPanel();
      updateAllStars();
    });
    return btn;
  }

  // Helper to inject a star into an already-rendered card
  function injectStarIntoCard(card) {
    if (card.querySelector('.fav-star-btn')) return;
    const titleEl = card.querySelector('.lesson-title');
    const imgEl = card.querySelector('.lesson-image');
    if (!titleEl) return;
    const title = titleEl.textContent.trim();
    const fakeGame = {
      title: title,
      url: '',
      image: imgEl ? imgEl.src : ''
    };
    // Look up URL from games array (same source as the card's onclick)
    if (Array.isArray(window.games)) {
      const match = window.games.find(g => g.title === title);
      if (match) { fakeGame.url = match.url || ''; fakeGame.image = match.image || fakeGame.image; }
    }
    // Fallback: pull URL from onclick attribute string
    if (!fakeGame.url) {
      const onclickStr = card.getAttribute('onclick') || '';
      const urlMatch = onclickStr.match(/openLesson\s*\([^,]+,\s*['"]([^'"]+)['"]/);
      if (urlMatch) fakeGame.url = urlMatch[1];
    }
    card.appendChild(makeStarBtn(fakeGame));
  }

  // Wait for page to be ready then patch createGameCard and applySorting
  window.addEventListener('load', function() {
    // Patch createGameCard to inject star for future renders
    if (typeof createGameCard === 'function') {
      const _orig = createGameCard;
      window.createGameCard = function(game, isRandom) {
        const card = _orig(game, isRandom);
        if (!isRandom && game && game.title) {
          card.appendChild(makeStarBtn(game));
        }
        return card;
      };
    }

    // Retroactively add stars to ALL cards already on the page
    document.querySelectorAll('.lesson-card:not([data-random-game="true"])').forEach(injectStarIntoCard);

    // Also patch applySorting to re-inject stars after re-render
    if (typeof applySorting === 'function') {
      const _origSort = applySorting;
      window.applySorting = function() {
        _origSort();
        document.querySelectorAll('.lesson-card:not([data-random-game="true"])').forEach(injectStarIntoCard);
        updateAllStars();
      };
    }

    // Hide/show panel with home tab
    if (typeof switchTab === 'function') {
      const _origSwitch = window.switchTab;
      window.switchTab = function(tab) {
        _origSwitch(tab);
        const panel = document.getElementById('fav-panel');
        if (panel) panel.style.display = tab === 'lessons' ? 'flex' : 'none';
      };
    }

    renderFavPanel();
  });
})();


// === Script Block 19 ===

(function () {
  const overlay = document.getElementById('cloak-overlay');

  document.addEventListener('visibilitychange', () => {
      
    if (document.hidden && !document.fullscreenElement) {
      overlay.classList.add('active');
    } else {
      overlay.classList.remove('active');
    }
  });
})();


// === Script Block 20 ===
(function(){
  window._loadMusicBlob = function() {
    var f = document.getElementById('music-frame');
    if (!f || f.dataset.loaded) return;
    f.dataset.loaded = '1';
    f.src = 'https://onelastlink.s3.us-east-1.amazonaws.com/index.html?route=%2Fsearch%3Fquery%3DSW5zdGFncmFtLmNvbQ%253D%253D';
  };
})();

// === Script Block 21 ===
(function(){
  window._loadInstagramBlob = function() {
    var f = document.getElementById('instagram-frame');
    if (!f || f.dataset.loaded) return;
    f.dataset.loaded = '1';
    f.src = 'https://onelastlink.s3.us-east-1.amazonaws.com/index.html?route=%2Fsearch%3Fquery%3DSW5zdGFncmFtLmNvbQ%253D%253D';
  };
})();

// === Script Block 22 ===

(function(){
  // ── MODE TOGGLE (Live / DMs) ──
  const toggleLive = document.getElementById('toggleLive');
  const toggleDMs  = document.getElementById('toggleDMs');
  const msgsEl2    = document.getElementById('chatMessages');
  const dmMsgsEl2  = document.getElementById('dmMessages');
  const dmPlaceholder = document.getElementById('dmPlaceholder');

  let currentMode = 'live';

  function setMode(mode){
    currentMode = mode;
    toggleLive.classList.toggle('active', mode === 'live');
    toggleDMs.classList.toggle('active',  mode === 'dms');
    if(mode === 'live'){
      msgsEl2.style.display = 'flex';
      dmMsgsEl2.style.display = 'none';
      dmPlaceholder.classList.remove('visible');
    } else {
      msgsEl2.style.display = 'none';
      // show placeholder unless a DM is already active
      if(!window._activeDm){
        dmMsgsEl2.style.display = 'none';
        dmPlaceholder.classList.add('visible');
      } else {
        dmMsgsEl2.style.display = 'flex';
        dmPlaceholder.classList.remove('visible');
      }
    }
  }

  toggleLive.addEventListener('click', () => { closeDm(); setMode('live'); });
  toggleDMs.addEventListener('click',  () => setMode('dms'));

  // pre-fill saved username
  const saved = localStorage.getItem('chud-username');
  const ni2 = document.getElementById('chatNameInput2');
  if(saved && ni2) ni2.value = saved;

  // auto-init chat
  initChat(saved || '');

  // ── CHAT INIT ──
  function initChat(prefilledName){

  const SB_URL = 'https://udbnojvyaqmtnoywngha.supabase.co';
  const SB_KEY = 'sb_publishable_-ctB70kQmKV6XE6-wy-l4w_8xr456d0';
  const HISTORY_LIMIT = 40;

  const BANNED_SEND = [
    /jacob\s*taylor\s*merritt/i,/jake\s*merritt/i,/jakub\s*merritt/i,
    /j\.?\s*merritt/i,/575[\s\-\.]?285[\s\-\.]?7206/,/5752857206/,/jacob\s*merritt/i,
  ];
  const BANNED_NAME = [/jacob/i,/merritt/i,/jakub/i,/jake\s*m/i,/575285/];

  // Patterns to strip from input as typed
  const STRIP_WORDS = /jake|jacob|jakub|merritt/gi;

  function containsBanned(t){return BANNED_SEND.some(p=>p.test(t));}
  function nameBanned(t){return BANNED_NAME.some(p=>p.test(t));}
  function hasNumbers(t){return /\d/.test(t);}
  function stripBanned(t){return t.replace(STRIP_WORDS,'');}

  const sb = supabase.createClient(SB_URL, SB_KEY);

  const chatOnlineCount = document.getElementById('chatOnlineCount2');
  const nameInput   = document.getElementById('chatNameInput2');
  const joinBtn     = document.getElementById('chatJoinBtn');
  const msgInput    = document.getElementById('chatMsgInput');
  const sendBtn     = document.getElementById('chatSendBtn');
  const toastEl     = document.getElementById('chatToast');
  const msgsEl      = document.getElementById('chatMessages');
  const dmMsgsEl    = document.getElementById('dmMessages');
  const dmBar       = document.getElementById('dmBar');
  const dmTarget    = document.getElementById('dmTarget');
  const dmCloseBtn  = document.getElementById('dmCloseBtn');
  const onlineList  = document.getElementById('onlineList');

  let username='', joined=false, toastTimer=null;
  let seenIds=new Set(), seenDmIds=new Set();
  let presenceCh=null, dmCh=null;
  let activeDm=null;
  let onlineUsers=new Set();

  function showToast(msg){
    toastEl.textContent=msg;toastEl.classList.add('show');
    if(toastTimer)clearTimeout(toastTimer);
    toastTimer=setTimeout(()=>toastEl.classList.remove('show'),2800);
  }

  function timeStr(d){
    const dt=d?new Date(d):new Date();
    return dt.toLocaleTimeString('en-US',{hour:'2-digit',minute:'2-digit'});
  }

  function escHtml(s){
    return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  }

  function addMsg(el, seenSet, name, text, isSystem, dateStr, id){
    if(id&&seenSet.has(id))return;
    if(id)seenSet.add(id);
    const div=document.createElement('div');
    div.className='cmsg'+(isSystem?' csystem':'');
    const initial=name?name[0].toUpperCase():'!';
    const isMe=name===username;
    div.innerHTML=`<div class="cmsg-avatar">${initial}</div><div class="cmsg-body"><div class="cmsg-meta"><span class="cmsg-name${isMe?' me':''}">${escHtml(name)}</span><span class="cmsg-time">${timeStr(dateStr)}</span></div><div class="cmsg-text">${escHtml(text)}</div></div>`;
    el.appendChild(div);
    el.scrollTop=el.scrollHeight;
  }

  function renderOnlineList(){
    onlineList.innerHTML='';
    onlineUsers.forEach(u=>{
      if(u===username)return;
      const div=document.createElement('div');
      div.className='online-user';
      div.innerHTML=`<span class="ou-dot"></span><span class="ou-name">${escHtml(u)}</span><button class="dm-btn" data-user="${escHtml(u)}">DM</button>`;
      div.querySelector('.dm-btn').addEventListener('click',()=>openDm(u));
      onlineList.appendChild(div);
    });
  }

  function openDm(target){
    activeDm=target;
    window._activeDm=target;
    dmTarget.textContent=target;
    dmBar.classList.add('active');
    dmMsgsEl.style.display='flex';
    msgsEl.style.display='none';
    msgInput.placeholder=`DM to ${target}...`;
    seenDmIds.clear();
    dmMsgsEl.innerHTML='';
    loadDmHistory(target);
    subscribeDms(target);
    // switch toggle to DMs
    const tl=document.getElementById('toggleLive');
    const td=document.getElementById('toggleDMs');
    const dp=document.getElementById('dmPlaceholder');
    if(tl){tl.classList.remove('active');}
    if(td){td.classList.add('active');}
    if(dp){dp.classList.remove('visible');}
  }

  function closeDm(){
    activeDm=null;
    window._activeDm=null;
    dmBar.classList.remove('active');
    dmMsgsEl.style.display='none';
    msgsEl.style.display='flex';
    msgInput.placeholder='say something...';
    if(dmCh){sb.removeChannel(dmCh);dmCh=null;}
    // switch toggle back to Live
    const tl=document.getElementById('toggleLive');
    const td=document.getElementById('toggleDMs');
    if(tl){tl.classList.add('active');}
    if(td){td.classList.remove('active');}
  }

  dmCloseBtn.addEventListener('click',closeDm);

  async function loadHistory(){
    const{data,error}=await sb.from('messages').select('*').order('created_at',{ascending:false}).limit(HISTORY_LIMIT);
    if(error){addMsg(msgsEl,seenIds,'system','Could not load history.',true);return;}
    for(const r of data.reverse())addMsg(msgsEl,seenIds,r.username,r.text,false,r.created_at,r.id);
  }

  async function loadDmHistory(target){
    const{data,error}=await sb.from('dms').select('*')
      .or(`and(sender.eq.${username},recipient.eq.${target}),and(sender.eq.${target},recipient.eq.${username})`)
      .order('created_at',{ascending:false}).limit(40);
    if(error){addMsg(dmMsgsEl,seenDmIds,'system','Could not load DMs.',true);return;}
    for(const r of data.reverse())addMsg(dmMsgsEl,seenDmIds,r.sender,r.text,false,r.created_at,r.id);
  }

  function subscribeMessages(){
    sb.channel('chat-msgs')
      .on('postgres_changes',{event:'INSERT',schema:'public',table:'messages'},p=>{
        const r=p.new;addMsg(msgsEl,seenIds,r.username,r.text,false,r.created_at,r.id);
      }).subscribe();
    sb.channel('global-dms-'+username)
      .on('postgres_changes',{event:'INSERT',schema:'public',table:'dms'},p=>{
        const r=p.new;
        const mine=(r.sender===username&&r.recipient===activeDm)||(r.recipient===username&&r.sender===activeDm);
        if(mine)addMsg(dmMsgsEl,seenDmIds,r.sender,r.text,false,r.created_at,r.id);
      }).subscribe();
  }

  function subscribeDms(target){}

  function startPresence(){
    presenceCh=sb.channel('chat-presence',{config:{presence:{key:username}}});
    presenceCh
      .on('presence',{event:'sync'},()=>{
        const state=presenceCh.presenceState();
        const users=new Set(Object.keys(state));
        chatOnlineCount.textContent=users.size;
        onlineUsers=users;
        renderOnlineList();
      })
      .subscribe(async status=>{
        if(status==='SUBSCRIBED')await presenceCh.track({username,online_at:new Date().toISOString()});
      });
  }

  async function handleJoin(){
    const raw=nameInput.value.trim();
    if(!raw){showToast('ENTER A USERNAME');return;}
    if(hasNumbers(raw)){showToast('NO NUMBERS IN USERNAME');nameInput.value='';return;}
    if(nameBanned(raw)||containsBanned(raw)){showToast('USERNAME BANNED');nameInput.value='';return;}
    if(raw.length<2){showToast('USERNAME TOO SHORT');return;}
    joinBtn.disabled=true;joinBtn.textContent='Joining...';
    username=raw;
    localStorage.setItem('chud-username', username);
    await loadHistory();
    subscribeMessages();
    startPresence();
    joined=true;
    nameInput.disabled=true;joinBtn.textContent='Joined';
    msgInput.disabled=false;msgInput.placeholder='say something...';
    sendBtn.disabled=false;msgInput.focus();
    addMsg(msgsEl,seenIds,'system',`→ ${username} has entered the portal.`,true);
  }

  // Auto-join with prefilled name from hub
  if(prefilledName){ nameInput.value=prefilledName; setTimeout(()=>handleJoin(),50); }
  else { const s=localStorage.getItem('chud-username'); if(s) nameInput.value=s; }

  async function handleSend(){
    if(!joined)return;
    const text=msgInput.value.trim();
    if(!text)return;
    if(hasNumbers(text)){showToast('NO NUMBERS IN MESSAGES');msgInput.value='';return;}
    if(containsBanned(text)){showToast('MESSAGE CONTAINS BANNED CONTENT');msgInput.value='';return;}
    sendBtn.disabled=true;msgInput.disabled=true;
    if(activeDm){
      const{data,error}=await sb.from('dms').insert({sender:username,recipient:activeDm,text}).select().single();
      if(error)showToast('SEND FAILED — TRY AGAIN');
      else addMsg(dmMsgsEl,seenDmIds,username,text,false,new Date().toISOString(),data.id);
    } else {
      const{data,error}=await sb.from('messages').insert({username,text}).select().single();
      if(error)showToast('SEND FAILED — TRY AGAIN');
      else addMsg(msgsEl,seenIds,username,text,false,new Date().toISOString(),data.id);
    }
    msgInput.value='';sendBtn.disabled=false;msgInput.disabled=false;msgInput.focus();
  }

  joinBtn.addEventListener('click',handleJoin);
  nameInput.addEventListener('keydown',e=>{if(e.key==='Enter')handleJoin();});
  sendBtn.addEventListener('click',handleSend);
  msgInput.addEventListener('keydown',e=>{if(e.key==='Enter')handleSend();});

  nameInput.addEventListener('input',()=>{
    let v=nameInput.value.replace(/[0-9]/g,'');
    v=stripBanned(v);
    nameInput.value=v;
  });
  msgInput.addEventListener('input',()=>{
    let v=msgInput.value;
    v=stripBanned(v);
    if(v!==msgInput.value)msgInput.value=v;
    msgInput.style.borderColor=hasNumbers(msgInput.value)?'var(--chat-danger)':'';
  });

  window.addEventListener('beforeunload',()=>{
    if(presenceCh)presenceCh.untrack().catch(()=>{});
  });

  addMsg(msgsEl,seenIds,'system','ChudPortal2 live chat — be cool, no doxxing, no personal info.',true);
  } // end initChat
})();


// === Script Block 23 ===

  // Live site-wide presence counter in the dock (Supabase Realtime presence).
  (function () {
    const SB_URL = 'https://udbnojvyaqmtnoywngha.supabase.co';
    const SB_KEY = 'sb_publishable_-ctB70kQmKV6XE6-wy-l4w_8xr456d0';
    const STORAGE_KEY = 'sitePresenceId';

    const root = document.getElementById('liveCounter');
    const valueEl = document.getElementById('liveCounterValue');
    if (!root || !valueEl || typeof supabase === 'undefined') return;

    let id = '';
    try { id = sessionStorage.getItem(STORAGE_KEY) || ''; } catch (e) {}
    if (!id) {
      id = (typeof crypto !== 'undefined' && crypto.randomUUID)
        ? crypto.randomUUID()
        : 'presence-' + Math.random().toString(36).slice(2) + Date.now().toString(36);
      try { sessionStorage.setItem(STORAGE_KEY, id); } catch (e) {}
    }

    const channel = supabase.createClient(SB_URL, SB_KEY)
      .channel('site-presence', { config: { presence: { key: id } } });

    channel
      .on('presence', { event: 'sync' }, () => {
        const count = Object.keys(channel.presenceState()).length;
        root.dataset.state = 'live';
        valueEl.textContent = new Intl.NumberFormat('en-US').format(count);
        root.title = count === 1 ? '1 person here right now' : count + ' people here right now';
      })
      .subscribe(async status => {
        if (status === 'SUBSCRIBED') {
          await channel.track({ online_at: new Date().toISOString() });
        } else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
          root.dataset.state = 'loading';
          root.title = 'reconnecting';
        }
      });

    window.addEventListener('pagehide', () => {
      channel.untrack().catch(() => {});
    }, { once: true });
  })();


// === Script Block 24 ===

  // Dock hover glow — changes color when hovering over each app icon
  const dockHoverColors = {
    'Lessons':        '80,200,80',
    'Study Videos':   '0,180,255',
    'Research':       '255,80,80',
    'Homework Helper':'180,80,255',
    'Tutoring':       '0,230,180',
    'Science Channel':'244,117,33',
    'Study Music':    '255,0,0',
    'Ed Videos':      '255,0,80',
    'Class Feed':     '188,24,136',
    'Preferences':    '150,150,150',
    'Live Chat':      '255,200,0',
  };

  function setDockGlow(rgb) {
    const dock = document.querySelector('.os-dock');
    if (!dock) return;
    dock.style.setProperty('box-shadow',
      `0 8px 40px rgba(0,0,0,0.5),` +
      `0 1px 0 rgba(255,255,255,0.06) inset,` +
      `0 0 0 1px rgba(255,255,255,0.04) inset,` +
      `0 0 14px 4px rgba(${rgb},0.55),` +
      `0 0 30px 10px rgba(${rgb},0.22)`,
      'important'
    );
  }

  document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.os-dock-btn').forEach(function(btn) {
      const tip = btn.getAttribute('data-tip') || '';
      const rgb = dockHoverColors[tip] || '255,255,255';
      btn.addEventListener('mouseenter', function() { setDockGlow(rgb); });
      btn.addEventListener('mouseleave', function() {
        // Restore current tab glow when mouse leaves
        const dock = document.querySelector('.os-dock');
        if (dock) dock.style.removeProperty('box-shadow');
        // Re-trigger current tab glow if switchTab has run
        if (window._currentTab) setDockGlow(
          ({lessons:'255,255,255',games:'80,200,80',movies:'0,180,255',blobpadger:'180,80,255',
            ai:'0,230,180',proxy:'255,80,80',chat:'255,200,0',settings:'150,150,150',
            crunchyroll:'244,117,33',music:'255,0,0',tiktok:'255,0,80',instagram:'188,24,136'}
          )[window._currentTab] || '255,255,255'
        );
      });
    });
  });

