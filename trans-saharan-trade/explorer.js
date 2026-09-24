/* Group-research expansion. Positions are regional locators, not excavated sites
   or surveyed roads. Dates and uncertainty travel with every interpretive layer. */
(() => {
  const shell=document.querySelector('.atlas-shell');
  const sim=document.createElement('section'); sim.className='simulation'; sim.id='simulation';
  sim.setAttribute('aria-label','Interactive African trade map');
  shell.prepend(sim);
  const toolbar=document.querySelector('.map-toolbar'); sim.append(toolbar);
  const actions=document.createElement('div');actions.className='sim-actions';
  actions.innerHTML='<button id="zoomIn" aria-label="Zoom in">＋</button><button id="zoomOut" aria-label="Zoom out">−</button><button id="fitAfrica">All Africa</button><button id="showEra">Time card</button><button id="fullscreenMap" aria-pressed="false">⛶ Full screen</button>';
  toolbar.append(actions);
  const controls=document.querySelector('.map-controls');
  const layers=document.createElement('div');layers.className='layer-tools';
  layers.innerHTML='<strong>Explore</strong><label><input type="checkbox" data-layer="empires" checked> Empires</label><label><input type="checkbox" data-layer="goods" checked> Goods</label><label><input type="checkbox" data-layer="culture"> Culture & diaspora</label><label><input type="checkbox" data-layer="musa"> Musa’s pilgrimage</label><label><input type="checkbox" id="ibnLayer" checked> Ibn Battuta</label><label for="diseaseLayer">Disease</label><select id="diseaseLayer"><option value="none">Off</option><option value="plague">Black Death · dated</option><option value="smallpox">Smallpox · illustrative</option><option value="measles">Measles · illustrative</option><option value="leprosy">Leprosy · illustrative</option><option value="malaria">Malaria · ecology</option><option value="trypanosomiasis">Trypanosomiasis · ecology</option></select><button id="leoTimbuktu">Leo: Timbuktu</button><button id="leoGao">Leo: Gao</button>';
  sim.append(layers,mapViewport,controls);
  const note=document.createElement('p');note.className='sim-note';
  note.textContent='Click a city or symbol to explore • Drag to pan • + / − to zoom • Empire shading = approximate core regions, not borders • Symbols are regional locators';sim.append(note);
  const popup=document.createElement('aside');popup.className='map-popup';popup.hidden=true;
  popup.setAttribute('role','dialog');popup.setAttribute('aria-modal','false');popup.setAttribute('aria-labelledby','popupTitle');
  popup.innerHTML='<button class="popup-close" aria-label="Close information">×</button><div id="popupBody"></div>';
  mapViewport.append(popup);
  const body=popup.querySelector('#popupBody');let focusBefore=null;
  function closeInfo(){popup.hidden=true;if(focusBefore?.isConnected)focusBefore.focus();}
  popup.querySelector('button').onclick=closeInfo;
  window.addEventListener('keydown',e=>{if(e.key==='Escape'&&!popup.hidden){closeInfo();e.stopPropagation();}});
  function showInfo(title,eyebrow,html,focus=true){
    if(window.atlasSlidesQuietUntil>performance.now())return;
    setPlaying(false);if(popup.hidden)focusBefore=document.activeElement;
    body.innerHTML='<p class="eyebrow">'+eyebrow+'</p><h2 id="popupTitle">'+title+'</h2>'+html;
    popup.hidden=false;popup.scrollTop=0;
    if(focus)popup.querySelector('button').focus({preventScroll:true});
    queueMicrotask(()=>sim.dispatchEvent(new CustomEvent('atlas:info',{detail:{title,eyebrow}})));
  }
  const source=(url,label)=>'<p class="source-link">Source: <a href="'+url+'" target="_blank" rel="noopener">'+label+'</a></p>';
  const leoURL='https://sourcebooks.web.fordham.edu/med/leo_afri.asp';
  const ibnURL='https://sourcebooks.web.fordham.edu/source/1354-ibnbattuta.asp';
  const swahiliURL='https://www.nature.com/articles/s41586-023-05754-w';
  const goldURL='https://www.metmuseum.org/essays/the-trans-saharan-gold-trade-7th-14th-century';
  const leo={
    timbuktu:'<h3>Leo Africanus in Timbuktu</h3><p><strong>Later evidence: early 1500s; account completed in 1526.</strong> These observations are outside the 1200–1450 simulation.</p><ul><li>He describes a profitable book trade, learned judges and teachers supported by the ruler.</li><li>Salt brought from Taghaza is expensive; cotton cloth, imported textiles and North African horses connect the city to distant markets.</li><li>He describes wealthy immigrant merchants, earthen houses, a prominent mosque and palace, and a destructive fire.</li><li>His account also records enslavement and rulers selling war captives, revealing the coercion behind some urban wealth.</li></ul><p><strong>Read critically:</strong> al-Hasan al-Wazzan, known as Leo Africanus, was a Moroccan diplomat writing for European readers after captivity and baptism in Rome. His education, religious judgments and elite perspective shape his descriptions; striking numbers and claims require comparison with other evidence.</p>'+source(leoURL,'Leo Africanus, Description of Timbuktu (1526)'),
    gao:'<h3>Leo Africanus in the Kingdom of Gao</h3><p><strong>Later evidence: early 1500s; account completed in 1526.</strong> Gao belongs to the powerful Songhai state of his era, after this timeline ends.</p><ul><li>The group’s Gao excerpt emphasizes abundant merchandise and the high cost of imported cloth, salt and horses.</li><li>He describes a ruler personally hearing disputes, linking the market city to royal authority and justice.</li><li>Enslaved people appear in his description of exchange: this commerce involved forced movement and loss of freedom.</li><li>His unfavorable descriptions of rural residents and comparisons with Mediterranean foods reflect cultural and social prejudice, not neutral judgments about local people.</li></ul><p><strong>Source reading:</strong> use his account to discuss wealth, long-distance imports and state power, while distinguishing his judgments from what he reports seeing. The group’s quotation about costly merchandise belongs with Gao, rather than Timbuktu.</p><p>Source: your group’s “A Moroccan Diplomat in West Africa” / Gao analysis, from Leo Africanus’s <em>Description of Africa</em>.</p>'
  };
  // Real SVG viewBox zoom keeps geographic coordinates and every layer aligned.
  let view=[80,0,800,760];
  function setView(v){view=v;tradeMap.setAttribute('viewBox',v.join(' '));}
  function zoom(f){const w=Math.max(150,Math.min(1200,view[2]*f)),h=w*760/800;setView([view[0]+(view[2]-w)/2,view[1]+(view[3]-h)/2,w,h]);}
  function focusPoint(point){const [x,y]=projectPoint(point);setView([x-130,y-190,620,589]);}
  sim.addEventListener('atlas:set-view',e=>{if(e.detail.point)focusPoint(e.detail.point);else setView([80,0,800,760]);});
  document.querySelector('#zoomIn').onclick=()=>zoom(.72);
  document.querySelector('#zoomOut').onclick=()=>zoom(1/.72);
  document.querySelector('#fitAfrica').onclick=()=>setView([80,0,800,760]);
  let drag=null,moved=false;
  tradeMap.addEventListener('pointerdown',e=>{if(e.target.closest('[role="button"]'))return;drag={x:e.clientX,y:e.clientY,view:[...view]};moved=false;tradeMap.setPointerCapture(e.pointerId);});
  tradeMap.addEventListener('pointermove',e=>{if(!drag)return;const rect=tradeMap.getBoundingClientRect(),scale=Math.min(rect.width/view[2],rect.height/view[3]);if(Math.hypot(e.clientX-drag.x,e.clientY-drag.y)>3)moved=true;setView([drag.view[0]-(e.clientX-drag.x)/scale,drag.view[1]-(e.clientY-drag.y)/scale,view[2],view[3]]);});
  tradeMap.addEventListener('pointerup',()=>drag=null);tradeMap.addEventListener('pointercancel',()=>drag=null);
  const full=document.querySelector('#fullscreenMap');
  function fullState(){const on=document.fullscreenElement===sim||sim.classList.contains('expanded');full.textContent=on?'⤡ Exit full screen':'⛶ Full screen';full.setAttribute('aria-pressed',String(on));}
  full.onclick=async()=>{if(document.fullscreenElement===sim){await document.exitFullscreen();}else if(sim.classList.contains('expanded')){sim.classList.remove('expanded');}else {try{if(!sim.requestFullscreen)throw Error('unavailable');await sim.requestFullscreen();}catch{sim.classList.add('expanded');}}fullState();};
  document.addEventListener('fullscreenchange',fullState);
  window.addEventListener('keydown',e=>{if(e.key==='Escape'&&sim.classList.contains('expanded')){sim.classList.remove('expanded');fullState();}});
  function marketScene(goods){return '<div class="market-illustration" aria-label="Illustrative market stalls"><svg viewBox="0 0 320 110" aria-hidden="true"><path d="M0 87Q85 66 170 85T320 82V110H0Z" fill="#c8ac73"/>'+[22,123,224].map((x,i)=>'<path d="M'+x+' 44h74v44h-74z" fill="#9b7450"/><path d="M'+(x-8)+' 44l17-28h56l17 28z" fill="'+['#af623d','#467e73','#b18b37'][i]+'"/><path d="M'+x+' 45h74v12h-74z" fill="#e6cf95"/><text x="'+(x+20)+'" y="83" font-size="25">'+(goods[i]?.[0]||'📚')+'</text>').join('')+'</svg></div>';}
  openMarket=function(key){
    const m=markets[key];if(!m)return;focusPoint(locations[key]);
    showInfo(m.name,m.region, (leo[key]?'<div class="later-account">'+leo[key]+'</div>':'')+marketScene(m.goods)+'<p>'+m.lede+'</p><div class="market-goods">'+m.goods.map(([i,t])=>'<span>'+i+' '+t+'</span>').join('')+'<h3>Market connections · 1200–1450</h3><p>'+m.why+'</p><h3>Cultural exchange</h3><p>'+m.idea+'</p>');
  };
  delete markets.timbuktu.quote;
  document.querySelector('#leoTimbuktu').onclick=()=>openMarket('timbuktu');
  document.querySelector('#leoGao').onclick=()=>openMarket('gao');
  // Underlays sit above the terrain and below city markers.
  const groups={};
  ['empires','goods','culture','musa','disease'].forEach(k=>{groups[k]=svgElement('g',{'data-explorer-layer':k},geographicWorld);});
  geographicWorld.insertBefore(groups.empires,routeGroup);
  geographicWorld.append(marketLayer); // Markets stay accessible above route overlays.
  function feature(parent,point,label,icon,color,html,eyebrow='Regional locator · 1200–1450',labelY=24){
    const [x,y]=projectPoint(point),g=svgElement('g',{transform:'translate('+x+' '+y+')',class:'atlas-feature',role:'button',tabindex:'0','aria-label':label},parent);
    svgElement('circle',{r:11,fill:'#123b36',stroke:color,'stroke-width':1.5,class:'feature-ring'},g);
    svgElement('text',{x:0,y:5,'text-anchor':'middle','font-size':15},g,icon);
    if(label)svgElement('text',{x:0,y:labelY,'text-anchor':'middle',class:'map-layer-label'},g,label);
    function activate(){showInfo(label,eyebrow,html);}
    g.onclick=activate;g.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();e.stopPropagation();activate();}};
    return g;
  }
  const empireData=[
    {name:'Ghana / Wagadu',point:[-11,19],points:[[-12,18],[-6,19],[-5,15],[-8,13],[-12,15]],color:'#d99a6c',text:'Ghana’s earlier heartland lay in today’s southeastern Mauritania and western Mali, not in the modern country of Ghana. Its power was already declining around 1200. Koumbi Saleh is traditionally associated with its capital, although the archaeological identification and extent of royal control remain debated.'},
    {name:'Mali Empire',point:[-9,9],points:[[-15,14],[-11,17],[-5,18],[0,16],[-4,12],[-8,10],[-12,11]],color:'#eec45f',text:'From the thirteenth century, Mali linked the upper Niger and western Sahel to Saharan exchange. Gold-producing regions and trade taxation supported its rulers. The shaded zone is an approximate core and trade sphere, not a maximal empire boundary. Influence changed over time and did not mean uniform control.'},
    {name:'Songhai / Gao',point:[4,19],points:[[-1,18],[3,18],[4,15],[1,13],[-1,15]],color:'#9ba5ed',text:'Gao was the center of a long-established Songhai polity, at times under Mali’s influence. It became more independent as Mali weakened. The vast Songhai Empire associated with Sunni Ali (from 1464) and Askia Muhammad lies after 1450; this map shows its earlier Gao-centered core, not that later empire.'}
  ];
  const empireLabelPoints=[[-11,21],[-14,4],[6,23]];
  const empireNames=['Ghana Empire · legacy','Mali Empire','Songhai · Gao core'];
  empireData.forEach((d,i)=>{const p=svgElement('path',{d:linePath(d.points)+' Z',fill:d.color,'fill-opacity':'.19',stroke:d.color,'stroke-width':1.5,'stroke-dasharray':'4 4','data-core':i,'pointer-events':'none'},groups.empires);svgElement('title',{},p,d.name+' · approximate core');
    svgElement('path',{d:linePath([empireLabelPoints[i],d.point]),stroke:d.color,'stroke-width':1,'stroke-dasharray':'2 3','pointer-events':'none'},groups.empires);
    const badge=feature(groups.empires,empireLabelPoints[i],empireNames[i],'',d.color,'<p>'+d.text+'</p><p><strong>Map key:</strong> dashed shading locates a historical heartland; muted shading indicates an earlier or emerging state. Songhai’s later imperial expansion begins after this timeline.</p>'+source(goldURL,'The Met · trans-Saharan gold trade'),'Approximate heartland · changing political influence',4);
    badge.querySelector('circle').remove();const background=svgElement('rect',{x:-66,y:-10,width:132,height:20,rx:5,fill:'#173b35',stroke:d.color,'stroke-width':1},badge);badge.prepend(background);
  });
  // Production areas are examples, never claims to identify individual mine shafts.
  const goods=[
    [[-5,23.6],'Taghaza · salt','🧂','Salt slabs were mined in the Sahara and carried south. Ibn Battuta describes enslaved workers extracting salt at Taghaza. The site depended on imported food.'],
    [[12.9,18.7],'Bilma · salt','🧂','The Kawar oases were salt-producing centers connected with central Saharan exchange. This locates an oasis region, not a reconstructed medieval mine boundary.'],
    [[-11.5,13.5],'Bambuk · gold','🟨','Goldfields between the Senegal and Falémé rivers supplied regional trade. Producers exchanged gold through intermediaries; desert caravans carried it north.'],
    [[-9.5,10.7],'Bure · gold','🟨','Gold-producing country near the upper Niger became important to Mali-era exchange. This is a regional goldfield locator, not a precisely dated mining shaft.'],
    [[6.2,17.7],'Takedda · copper','⚒','Ibn Battuta describes copper production and trade at Takedda in 1353. Copper circulated as rods and in regional exchange. The medieval site is located approximately.'],
    [[-4.7,12.7],'Niger delta · food / iron','🌾','The inland Niger Delta supplied rice, fish and livestock; towns such as Jenne exchanged iron products, grain and local manufactures. Ironworking was dispersed across West Africa, not confined to a single mine.'],
    [[31.4,26],'Nile valley · crops','🌾','Irrigated Nile agriculture supplied grain and flax for linen. Agricultural production sustained cities and travelers; this marker identifies a producing region.'],
    [[-12,7.7],'Forced capture zones','↗','Enslaved people were not a natural commodity. Warfare, raiding and other coercive practices uprooted people from multiple regions south of the Sahara and elsewhere. This regional marker shows a broad connection, not a single origin or the boundaries of any people. Enable Culture & diaspora to follow representative forced-migration corridors.']
  ];
  goods.forEach(([p,l,i,t])=>{const g=feature(groups.goods,p,l,i,'#f0c978','<p>'+t+'</p>'+source(l.includes('Takedda')||l.includes('Taghaza')?ibnURL:goldURL,l.includes('Takedda')||l.includes('Taghaza')?'Ibn Battuta · West Africa':'Trade context · The Met'));if(l.startsWith('Taghaza')){const [x,y]=projectPoint(p);g.setAttribute('transform','translate('+(x+33)+' '+y+')');svgElement('path',{d:'M-33 0H-12',stroke:'#f0c978','pointer-events':'none'},g);}if(i==='🟨'){g.querySelector('text').textContent='';svgElement('path',{d:'M-8 5L-5-4 5-5 9 4 2 8Z',fill:'#efbe36',stroke:'#fff0a6','stroke-width':1},g);}});
  function flow(parent,points,color){return svgElement('path',{d:linePath(points),stroke:color,class:'flow-line'},parent);}
  const cultureText='<p>Swahili city-states grew from African coastal societies. Kiswahili is a Bantu language; Indian Ocean commerce and Islam connected these communities with Arabia, Persia and India.</p><p>Merchants settled, formed families and supported mosques. Local people shaped the resulting language, architecture and religious life. This was a gradual process already under way before 1200, not the founding of African cities by outsiders.</p><p>Ancient DNA from sampled coastal burials supports Persian-related ancestry mixing with African ancestry from around 1000. It does not represent every resident; Arabian-related ancestry becomes more prominent after 1500. Arab connections and settlement existed earlier, too.</p>'+source(swahiliURL,'Brielle et al., Nature (2023)');
  flow(groups.culture,[[54,26],[56,18],[53,9],[48,3],locations.mogadishu,locations.mombasa,locations.kilwa],'#6fe1cd');
  feature(groups.culture,[53,25],'Persia / Arabia →','↘','#6fe1cd','<p>Sea connections brought travelers from Persian Gulf and Arabian ports to East Africa. This line is a schematic corridor; it does not trace an individual voyage.</p>'+cultureText,'Diaspora · roots before 1200');
  ['mogadishu','mombasa','kilwa'].forEach(k=>{const g=feature(groups.culture,locations[k],k[0].toUpperCase()+k.slice(1)+' · communities','⌂','#6fe1cd',cultureText,'Swahili coast · communities already present by 1200');const c=svgElement('circle',{r:18,fill:'none',stroke:'#6fe1cd','stroke-dasharray':'2 3','pointer-events':'none','class':'community-ring'},g);g.prepend(c);});
  flow(groups.culture,[locations.fez,locations.sijilmasa,locations.timbuktu,locations.jenne],'#7be0b1');
  feature(groups.culture,[-1,11],'Books, faith & language','📚','#7be0b1','<p>Muslim merchants, jurists and teachers moved between northern and western Africa. Market neighborhoods, lodging and scholarly networks supported diasporic communities.</p><p>Books and Arabic learning circulated alongside goods. Conversion was uneven, and local languages, beliefs and institutions continued. Cultural exchange was reciprocal rather than a single replacement of one culture by another.</p><p>Source: the group’s cultural-diffusion and merchant-community research.</p>');
  flow(groups.culture,[[-9,9],locations.walata,locations.sijilmasa,locations.fez],'#f08e9a');
  flow(groups.culture,[[16,10],[15,20],locations.tripoli],'#f08e9a');
  flow(groups.culture,[[35,-12],locations.kilwa,[43,-6],[53,12]],'#f08e9a');
  feature(groups.culture,[15,21],'Forced diaspora','↗','#f08e9a','<p>Enslaved Africans were forced across the Sahara toward North Africa and the Mediterranean, and through East African ports into Indian Ocean networks. Origins and destinations varied; these are representative corridors, not measured traffic volumes.</p><p>Capture and sale separated families and removed people from their homes. Survivors carried languages, skills and memories into new communities under coercive conditions. Forced diaspora must be distinguished from voluntary merchant settlement.</p><p>East African connections were part of Indian Ocean exchange, not trans-Saharan routes.</p><p>Source: the group’s slave-trade and diaspora research; Ibn Battuta’s account describes enslaved workers and people being transported.</p>'+source(ibnURL,'Ibn Battuta · West Africa'));
  const musaPoints=[locations.mali,[0,21],[14,26],locations.cairo,[34,29],[38,24],[39.83,21.42]];
  const musaPath=flow(groups.musa,musaPoints,'#ffe083');musaPath.setAttribute('stroke-width','3');
  const musaText='<p><strong>1324–1325:</strong> Mansa Musa travels from Mali through Cairo to Mecca for the hajj. The gold he spends and gives away makes Mali’s wealth widely known; historical accounts associate his Cairo visit with a fall in gold’s value.</p><p><strong>Cultural diffusion:</strong> pilgrimage strengthens ties with the wider Muslim world. Musa’s patronage and contacts encourage scholarship, mosque-building and the movement of learned people to Mali. These contacts join established West African traditions of learning and architecture.</p><p>The line connects Mali, Cairo and Mecca schematically. Desert waypoints and the court’s starting location are uncertain; Mecca is in Arabia, outside Africa.</p>'+source(goldURL,'The Met · Mansa Musa and gold trade');
  feature(groups.musa,[39.83,21.42],'Mecca · hajj','✦','#ffe083',musaText,'1324–1325 · pilgrimage and cultural exchange');
  feature(groups.musa,[16,27],'Mansa Musa →','✦','#ffe083',musaText,'1324–1325 · schematic route');
  const traveler=svgElement('circle',{r:5,fill:'#ffe083',stroke:'#5c401c','stroke-width':2},groups.musa);
  const diseases={
    plague:{name:'Black Death',text:'Plague reached Egypt in 1347 and spread through North African networks in 1348–1349. Dated rings mark broad recorded arrival periods in Alexandria, Cairo, Tunis and Morocco. They are not case counts or proof of a single chain of transmission. Evidence south of the Sahara is debated; this map does not invent dated West African outbreaks.',url:'https://online.ucpress.edu/jmw/article/2/3-4/115/116072/The-Black-Death-in-the-MaghrebA-Call-to-Action'},
    smallpox:{name:'Smallpox',text:'Smallpox could travel with infected people through close contact and contaminated materials. The highlighted trading connections illustrate a possible mechanism of spread. There is no sufficiently complete outbreak chronology here to claim which of these cities was infected in a particular year.',url:'https://www.cdc.gov/smallpox/about/index.html'},
    measles:{name:'Measles',text:'Measles spreads through the air between people. Dense settlements and travel can link outbreaks. Dashed lines illustrate connections, not documented medieval infection paths, outbreak dates or case totals.',url:'https://www.who.int/news-room/fact-sheets/detail/measles'},
    leprosy:{name:'Leprosy',text:'Leprosy generally requires prolonged close contact with an untreated person; it is not easily passed through a brief market encounter. Connections illustrate population mobility, not a rapid epidemic wave. Medieval diagnostic labels and dates are uncertain.',url:'https://www.who.int/news-room/fact-sheets/detail/leprosy'},
    malaria:{name:'Malaria',text:'Malaria depends on parasites and Anopheles mosquitoes. Local water, temperature and mosquito habitats affect transmission. Shading is a broad ecological illustration in tropical Africa, not a medieval prevalence map. Trade did not simply bring malaria to Africa from Asia.',url:'https://www.who.int/news-room/fact-sheets/detail/malaria'},
    trypanosomiasis:{name:'Trypanosomiasis',text:'African trypanosomiasis is transmitted by infected tsetse flies. Human and animal infections affected life in suitable tsetse habitats; livestock disease could limit transport. The shaded tropical zone is illustrative, not a reconstructed medieval range. Retrospective claims about an individual medieval ruler’s diagnosis remain uncertain.',url:'https://www.who.int/health-topics/human-african-trypanosomiasis'}
  };
  const diseaseSelect=document.querySelector('#diseaseLayer');
  function drawDisease(){
    const key=diseaseSelect.value,g=groups.disease;g.replaceChildren();if(key==='none')return;
    const d=diseases[key],html='<p>'+d.text+'</p>'+source(d.url,key==='plague'?'Research · Black Death in the Maghreb':'Transmission reference · not a medieval outbreak dataset');
    if(key==='plague'){
      [['alexandria',1347],['cairo',1348],['tunis',1348],['fez',1349]].forEach(([k,date])=>{
        if(Number(slider.value)<date)return;
        const [x,y]=projectPoint(locations[k]);svgElement('circle',{cx:x,cy:y,r:18,fill:'#d07893','fill-opacity':'.22',stroke:'#ffa0b5','stroke-dasharray':'3 3','pointer-events':'none'},g);
        feature(g,locations[k],k[0].toUpperCase()+k.slice(1)+' · '+date,'✚','#ffa0b5',html,'Recorded plague period · approximate arrival');
      });
    }else if(key==='malaria'||key==='trypanosomiasis'){
      const poly=key==='malaria'?[[-17,14],[15,16],[40,8],[38,-20],[16,-24],[-10,-2]]:[[-15,11],[25,12],[37,2],[29,-16],[15,-18],[-8,1]];
      svgElement('path',{d:linePath(poly)+'Z',fill:'#bd9ccf','fill-opacity':'.25',stroke:'#d7aceb','stroke-dasharray':'3 5','clip-path':'url(#africaClip)','pointer-events':'none'},g);
    }else {flow(g,[locations.fez,locations.sijilmasa,locations.timbuktu,locations.gao],'#efa0bd');flow(g,[locations.alexandria,locations.cairo,locations.aydhab],'#efa0bd');}
    feature(g,[17,-7],d.name+' · info','✚','#f0adc8',html,key==='plague'?'1347–1349 · recorded spread':'Undated illustration · no outbreak dates inferred');
  }
  diseaseSelect.onchange=()=>{drawDisease();if(diseaseSelect.value!=='none'){const d=diseases[diseaseSelect.value];showInfo(d.name,diseaseSelect.value==='plague'?'Select 1347–1349 on the timeline':'Illustrative layer · not a dated epidemic','<p>'+d.text+'</p>'+source(d.url,'Evidence and transmission'));}};
  function updateLayers(){
    layers.querySelectorAll('[data-layer]').forEach(input=>groups[input.dataset.layer].style.display=input.checked?'':'none');
    const ibn=document.querySelector('#ibnLayer').checked;journeyGroup.style.display=ibn?'':'none';stopLabels.style.display=ibn?'':'none';
    const year=Number(slider.value);
    groups.empires.querySelectorAll('[data-core]').forEach(p=>{const i=Number(p.dataset.core);p.style.opacity=i===0?(year<1235?'1':'.4'):i===1?(year>=1235?'1':'.3'):(year>=1400?'1':'.45');});
    groups.musa.style.opacity=year>=1324?'1':'.5';
    const fraction=year<1324?0:year===1324?.5:year===1325?1:0;
    const pos=musaPath.getPointAtLength(musaPath.getTotalLength()*fraction);traveler.setAttribute('cx',pos.x);traveler.setAttribute('cy',pos.y);traveler.style.display=year===1324||year===1325?'':'none';
    drawDisease();
  }
  layers.querySelectorAll('input').forEach(input=>input.addEventListener('change',()=>{updateLayers();if(input.dataset.layer==='musa'&&input.checked)showInfo('Mansa Musa’s pilgrimage','1324–1325 · reference route visible at every year',musaText);if(input.dataset.layer==='culture'&&input.checked)showInfo('Communities across the ocean','Culture & diaspora · long-term processes',cultureText+'<p><strong>Map legend:</strong> mint lines = cultural and merchant connections; pink lines = forced migration. Dashed movement is illustrative, not a population count. Community rings mark established settlements; no invented founding dates are assigned.</p>');}));
  let currentEra=-1;
  function eraCard(){if(window.atlasSlidesQuietUntil>performance.now())return;const e=eras.findLast(e=>Number(slider.value)>=e[0]);showInfo(e[1],e[0]+' CE · timeline event','<p>'+e[2]+'</p><button class="popup-action" id="resumeMap">Continue timeline →</button>',false);document.querySelector('#resumeMap').onclick=()=>{closeInfo();setPlaying(true);};}
  document.querySelector('#showEra').onclick=eraCard;
  const renderPrevious=renderYear;renderYear=function(value){const wasPlaying=playing;renderPrevious(value);updateLayers();const idx=eras.findLastIndex(e=>Number(value)>=e[0]);if(currentEra!==-1&&idx!==currentEra){eraCard();if(!wasPlaying)setPlaying(false);}currentEra=idx;};
  const playPrevious=setPlaying;setPlaying=function(next){if(next)popup.hidden=true;playPrevious(next);sim.classList.toggle('sim-playing',next);};
  document.querySelector('.source-caution').insertAdjacentHTML('beforeend',' <strong>New interpretive layers:</strong> dashed empire cores and resource markers are approximate. Community and forced-migration corridors are schematic; they do not quantify populations. Disease layers distinguish dated plague evidence from undated transmission and ecological illustrations. Leo Africanus’s 1526 account appears as later evidence in Timbuktu and Gao. Swahili interpretation: <a href="'+swahiliURL+'">Brielle et al. (2023)</a>. Gold and Mali: <a href="'+goldURL+'">The Met</a>. Additional disease references appear in each map panel.');
  // Replace a now-obsolete source note from the previous revision.
  document.querySelector('.source-caution').innerHTML=document.querySelector('.source-caution').innerHTML.replace('Artificial empire shapes have been removed; dated cards explain changes in power.','Empire layers identify approximate heartlands rather than precise political boundaries.');
  renderYear(slider.value);
})();
