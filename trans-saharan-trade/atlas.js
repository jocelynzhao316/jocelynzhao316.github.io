// Coordinates are longitude/latitude. Historical routes join documented stops,
// not surveyed medieval roads. Approximate positions are explicitly marked.
const projectPoint = ([lon,lat]) => [130+(lon+20)*9,35+(38-lat)*9];
const svgNS = 'http://www.w3.org/2000/svg';
function svgElement(tag, attrs, parent, label) {
  const el=document.createElementNS(svgNS,tag);
  Object.entries(attrs).forEach(([k,v])=>el.setAttribute(k,v));
  if(label) el.textContent=label;
  parent.appendChild(el); return el;
}
function linePath(points) { return points.map((p,i)=>(i?'L':'M')+projectPoint(p).join(',')).join(' '); }
const locations={
 tangier:[-5.81,35.76],tlemcen:[-1.31,34.88],miliana:[2.23,36.3],algiers:[3.06,36.75],bejaia:[5.07,36.75],constantine:[6.61,36.36],annaba:[7.77,36.9],
 tunis:[10.18,36.8],sousse:[10.64,35.83],sfax:[10.76,34.74],gabes:[10.10,33.88],tripoli:[13.19,32.89],alexandria:[29.92,31.2],
 damanhur:[30.47,31.04],fuwwah:[30.55,31.2],ibyar:[30.86,30.84],mahalla:[31.16,30.97],damietta:[31.81,31.42],faraskur:[31.72,31.33],samannoud:[31.24,30.96],
 cairo:[31.24,30.04],biba:[30.98,28.92],bahnasa:[30.65,28.53],minya:[30.75,28.11],mallawi:[30.84,27.73],manfalut:[30.97,27.31],asyut:[31.18,27.18],akhmim:[31.74,26.56],hu:[32.29,26.02],qena:[32.73,26.16],qus:[32.76,25.91],luxor:[32.64,25.69],esna:[32.56,25.29],edfu:[32.87,24.98],aydhab:[36.49,22.32],
 bilbeis:[31.56,30.42],zeila:[43.47,11.35],mogadishu:[45.34,2.05],mombasa:[39.67,-4.05],kilwa:[39.52,-8.96],
 tenes:[1.3,36.51],taza:[-4.01,34.21],fez:[-5,34.03],ceuta:[-5.32,35.89],asilah:[-6.04,35.46],sale:[-6.8,34.05],marrakesh:[-7.98,31.63],meknes:[-5.56,33.89],
 sijilmasa:[-4.27,31.28],taghaza:[-5,23.6],walata:[-7.03,17.3],mali:[-8,12.5],timbuktu:[-3.01,16.77],gao:[-.05,16.27],takedda:[6.2,17.7],tuat:[-.3,27.87],
 jenne:[-4.55,13.91],koumbi:[-7.97,15.67]
};
// The Mali court's exact location is debated; this point is a regional locator.
const legs=[
 {year:1325,end:1326,title:'North Africa: departure for the pilgrimage',color:'#9be9da',stops:'tangier tlemcen miliana algiers bejaia constantine annaba tunis sousse sfax gabes tripoli alexandria',text:'He leaves Tangier in 1325 and travels through the Maghreb to Egypt in 1326.'},
 {year:1326,end:1327,title:'Egypt: the Nile and the blocked Red Sea crossing',color:'#b0defa',stops:'alexandria damanhur fuwwah ibyar mahalla damietta faraskur samannoud cairo biba bahnasa minya mallawi manfalut asyut akhmim hu qena qus luxor esna edfu aydhab edfu cairo bilbeis',text:'He explores the Nile valley and reaches Aydhab. Unable to cross there, he returns to Cairo and continues through Sinai toward Syria.'},
 {year:1331,end:1332,title:'East Africa: Red Sea and Swahili ports',color:'#f9a4db',stops:'zeila mogadishu mombasa kilwa',text:'From Aden he sails to Zeila, Mogadishu, Mombasa and Kilwa, then back toward Arabia. Often dated c.1331; some reconstructed chronologies place this leg in 1328–1330.',sea:true},
 {year:1348,end:1349,title:'Egypt again: plague and another pilgrimage',color:'#bfa9ff',stops:'bilbeis cairo asyut edfu aydhab',text:'Returning from Asia during the Black Death, he passes through Egypt and travels toward the Red Sea for another pilgrimage.'},
 {year:1349,end:1350,title:'Return to the Maghreb',color:'#ffda91',stops:'alexandria tunis tenes tlemcen taza fez tangier ceuta',text:'He sails west from Egypt and eventually returns to Morocco. A Sardinian excursion interrupts the sea journey; this Africa-only map omits that non-African detour.',sea:true},
 {year:1350,end:1352,title:'Morocco after al-Andalus',color:'#e3f395',stops:'ceuta asilah sale marrakesh fez meknes fez sijilmasa',text:'After his Spanish trip, he visits Moroccan towns, returns to Fez and prepares for the Sahara crossing at Sijilmasa in late 1351.'},
 {year:1352,end:1353,title:'Across the Sahara to Mali',color:'#ffb260',stops:'sijilmasa taghaza walata mali',text:'A winter caravan carries him through Taghaza’s salt mines and Walata to Mansa Sulayman’s court. The court marker indicates a region, not an established capital location.'},
 {year:1353,end:1354,title:'The Niger and the return crossing',color:'#ff8989',stops:'mali timbuktu gao takedda tuat sijilmasa fez',text:'He visits Timbuktu, Gao and Takedda, then crosses the Sahara back to Morocco, arriving in Fez in early 1354. Takedda is plotted approximately.'}
];
const geographicWorld=document.querySelector('#mapWorld');
// Preserve the existing accessible market markers and their event handlers.
const marketLayer=document.querySelector('.city-layer');
marketLayer.remove();
geographicWorld.replaceChildren();
document.querySelector('#africaClip path').setAttribute('d',africaGeographicPath);
svgElement('path',{d:africaGeographicPath,fill:'url(#land)'},geographicWorld);
const terrain=svgElement('g',{'clip-path':'url(#africaClip)'},geographicWorld);
svgElement('rect',{x:100,y:95,width:750,height:160,fill:'url(#sahara)'},terrain);
svgElement('rect',{x:100,y:95,width:750,height:160,fill:'url(#dunes)'},terrain);
svgElement('rect',{x:100,y:255,width:750,height:65,fill:'#aaa45b',opacity:'.3'},terrain);
svgElement('rect',{x:100,y:320,width:750,height:150,fill:'#3d7758',opacity:'.28'},terrain);
const rivers=svgElement('g',{'class':'rivers'},geographicWorld);
svgElement('path',{d:linePath([[-10,10],[-8,12],[-6,13],[-4,16],[-3,17],[-.05,16.27],[2,13],[4,10],[6,7],[6,4.5]])},rivers);
svgElement('path',{d:linePath([[31,31.4],[31.24,30],[31,27],[33,24],[31,20],[32.5,15.6],[31.5,9],[32,3],[33,0]])},rivers);
const labels=svgElement('g',{'class':'geo-labels'},geographicWorld);
for(const [title,point] of [['SAHARA',[9,24]],['SAHEL',[8,13]],['ATLANTIC OCEAN',[-13,-12]],['INDIAN OCEAN',[49,-10]],['MADAGASCAR',[47,-27]],['NORTH ↑',[-17,37]]]){
 const [x,y]=projectPoint(point);svgElement('text',{x,y},labels,title);
}
const tradeRoutes=[
 ['routeWest','sijilmasa taghaza timbuktu jenne'],
 ['routeCentral','tripoli tuat takedda gao'],
 ['routeEast','tunis tuat gao'],
 ['routeWest2','sijilmasa taghaza walata koumbi'],
 ['riverRoute','jenne timbuktu gao']
];
const routeGroup=svgElement('g',{'class':'routes'},geographicWorld);
tradeRoutes.forEach(([id,keys],i)=>{
 const d=linePath(keys.split(' ').map(k=>locations[k]));
 svgElement('path',{id,d},routeGroup);
 if(i<3)document.querySelector(['#camelPathWest','#camelPathCentral','#camelPathEast'][i]).setAttribute('d',d);
});
// Animate merchant symbols on the same georeferenced routes.
const caravans=svgElement('g',{'class':'caravans'},geographicWorld);
for(let i=0;i<3;i++){
 const traveler=svgElement('g',{},caravans);
 svgElement('use',{href:'#camel',width:19,height:13,x:-9,y:-6},traveler);
 const motion=svgElement('animateMotion',{dur:(16+i*3)+'s',begin:(-i*5)+'s',repeatCount:'indefinite',rotate:'auto'},traveler);
 svgElement('mpath',{href:['#camelPathWest','#camelPathCentral','#camelPathEast'][i]},motion);
}
geographicWorld.appendChild(marketLayer);
marketLayer.querySelectorAll('.market').forEach((el,i)=>{
 const [x,y]=projectPoint(locations[el.dataset.market]);el.setAttribute('transform','translate('+x+' '+y+')');
 el.querySelector('text').setAttribute('y',i%2?-12:20);
 el.querySelector('text').setAttribute('x',0);
 el.querySelectorAll('circle').forEach((c,j)=>c.setAttribute('r',j?3:7));
});
const journeyGroup=svgElement('g',{'class':'ibn-routes'},geographicWorld);
legs.forEach((leg,i)=>{
 const points=leg.stops.split(' ').map(k=>locations[k]);
 // Coastal sailing waypoints avoid drawing the East African sea route across the Horn.
 let routePoints=points;
 if(i===2) routePoints=[points[0],[45,12.5],[49,12.4],[51.8,10.5],[51,8],[48,4],points[1],[43,0],[41,-2],points[2],[40.5,-6],points[3]];
 if(i===4) routePoints=[points[0],[28,34],[20,35],[14,37],points[1],[10,38],[5,38],...points.slice(2)];
 const p=svgElement('path',{d:linePath(routePoints),stroke:leg.color,'data-leg':i,fill:'none','stroke-width':2.5,'stroke-dasharray':leg.sea?'7 5':'none'},journeyGroup);
 svgElement('title',{},p,leg.title);
 points.forEach((point,n)=>{
  const [x,y]=projectPoint(point);const dot=svgElement('circle',{cx:x,cy:y,r:2.3,fill:leg.color,'data-leg':i},journeyGroup);
  svgElement('title',{},dot,leg.stops.split(' ')[n]+' · '+leg.year+'–'+leg.end);
 });
});
document.querySelector('#tradeMap').setAttribute('viewBox','80 0 800 760');
document.querySelector('#mapDesc').textContent='Geographic map of the entire African mainland and Madagascar, with accurately positioned markets and reconstructed historical journeys.';
const panel=document.createElement('section');panel.className='history-panel';panel.setAttribute('aria-live','polite');
panel.innerHTML='<p class="eyebrow" id="eraDate"></p><h3 id="eraTitle"></h3><p id="eraText"></p><button id="continueEra" type="button">Continue journey →</button>';
document.querySelector('.atlas-shell').appendChild(panel);
const journeyPanel=document.createElement('section');journeyPanel.className='journey-panel';
journeyPanel.innerHTML='<h2>Ibn Battuta’s African journeys</h2><p>Explore all major African legs, including return visits. Colored lines connect reported stops; they are not exact roads. Dashed lines represent sea travel. No journey to southern Africa or Madagascar is claimed.</p><label><input type="checkbox" id="showAllJourneys" checked> Show all journeys, regardless of timeline year</label><div class="journey-buttons"></div><p class="journey-detail" id="journeyDetail">Select a journey below to highlight its route and jump to its time period.</p><p class="route-stops" id="routeStops"></p>';
document.querySelector('.atlas-shell').appendChild(journeyPanel);
legs.forEach((leg,i)=>{
 const b=document.createElement('button');b.type='button';b.style.borderLeft='4px solid '+leg.color;b.textContent=leg.year+'–'+leg.end+' · '+leg.title;
 b.onclick=()=>{setPlaying(false);slider.value=leg.year;renderYear(leg.year);journeyGroup.querySelectorAll('[data-leg]').forEach(p=>{p.style.opacity=Number(p.dataset.leg)===i?'1':'.09';});
 document.querySelector('#journeyDetail').textContent=leg.text;
 document.querySelector('#routeStops').textContent=leg.stops.split(' ').map(k=>k==='mali'?'Mali court (location uncertain)':k==='takedda'?'Takedda (approx.)':k[0].toUpperCase()+k.slice(1)).join(' → ');
 journeyPanel.querySelectorAll('button').forEach(btn=>btn.setAttribute('aria-pressed',String(btn===b)));
 };journeyPanel.querySelector('.journey-buttons').appendChild(b);
});
const eras=[
 [1200,'Long-established connections','Caravans already connect the Sahara’s salt-producing regions with West African gold and regional markets. Ghana’s earlier power is waning; exchange continues.'],
 [1235,'The rise of Mali','Around 1235, Sundiata establishes Mali’s power. Control of trade and gold-producing regions helps rulers build wealth and protect merchants.'],
 [1300,'Markets and learning flourish','Mali’s trading cities connect desert caravans, Niger River transport and local producers. Merchants also carry religious ideas and support scholarly communities.'],
 [1324,'Mansa Musa’s pilgrimage','Mansa Musa travels through Cairo toward Mecca in 1324–1325. His expenditure of gold makes Mali’s wealth known far beyond West Africa.'],
 [1325,'Ibn Battuta leaves Tangier','In June 1325 a young Moroccan traveler sets out for the pilgrimage. His African journey begins across the Maghreb toward Egypt.'],
 [1326,'Egypt and an altered route','Ibn Battuta visits Alexandria, Cairo and the Nile valley. Trouble at Aydhab prevents his planned Red Sea crossing, so he returns north.'],
 [1331,'Ibn Battuta on the Swahili coast','Around 1331 he visits Zeila, Mogadishu, Mombasa and Kilwa. These are Indian Ocean connections, shown separately from trans-Saharan caravan trade; the dating is debated.'],
 [1348,'Plague reaches connected cities','The Black Death affects Egypt and North Africa during Ibn Battuta’s return era. This is not a claim that every West African market suffered a documented outbreak.'],
 [1349,'Return to Morocco','After years abroad, Ibn Battuta reaches the Maghreb again. He subsequently travels to al-Andalus and through Morocco.'],
 [1351,'Preparing to cross the Sahara','Ibn Battuta reaches Sijilmasa in late 1351 and waits for a caravan. Camels, supplies and experienced guides are vital for the crossing.'],
 [1352,'Salt mines and Mali’s court','He crosses through Taghaza and Walata to Mali, where he visits Mansa Sulayman’s court. His descriptions reveal both local life and his own cultural prejudices.'],
 [1353,'Niger markets and the journey home','Timbuktu, Gao and Takedda are stops on his return. He reaches Fez in early 1354 after another Sahara crossing.'],
 [1400,'Shifting regional power','Mali’s influence weakens unevenly while Gao becomes increasingly important. Songhai’s great imperial expansion under Sunni Ali comes later, after this timeline.'],
 [1450,'The network continues','Caravan routes and Niger markets still connect gold, salt, food, textiles and learning. The timeline ends before Sunni Ali’s reign begins in 1464.']
];
let lastEra=-1;
const oldRenderYear=renderYear;
renderYear=function(value){
 oldRenderYear(value);
 const year=Number(value);let idx=eras.findLastIndex(e=>year>=e[0]);
 if(idx!==lastEra){
  document.querySelector('#eraDate').textContent=eras[idx][0]+' CE';
  document.querySelector('#eraTitle').textContent=eras[idx][1];
  document.querySelector('#eraText').textContent=eras[idx][2];
  if(lastEra!==-1 && playing)setPlaying(false);
  lastEra=idx;
 }
 journeyGroup.querySelectorAll('[data-leg]').forEach(el=>{const leg=legs[Number(el.dataset.leg)];el.style.opacity=document.querySelector('#showAllJourneys').checked?'0.8':year>=leg.year?'0.9':'0';});
};
document.querySelector('#continueEra').onclick=()=>setPlaying(true);
document.querySelector('#showAllJourneys').onchange=()=>renderYear(slider.value);
// Give each year time to be noticed; historical cards automatically pause playback.
const originalSetPlaying=setPlaying;
setPlaying=function(next){
 originalSetPlaying(next);
 clearInterval(timer);
 if(next)timer=setInterval(()=>{
  const y=Number(slider.value);
  if(y>=1450){setPlaying(false);return;}
  slider.value=y+1;renderYear(y+1);
 },250);
};
dialog.addEventListener('close',()=>mapViewport.classList.remove('market-zoom'));
document.querySelector('.map-legend').innerHTML='<span><i class="legend-line"></i>Caravan trade</span><span><i class="legend-river"></i>Rivers (simplified)</span><span>Colored routes: Ibn Battuta</span>';
document.querySelector('.source-caution').innerHTML='Geography: <a href="https://www.naturalearthdata.com/about/terms-of-use/">Natural Earth</a>, public-domain 1:110m geographic data; entire mainland and Madagascar shown without modern borders. Minor islands below this map scale are omitted. Rivers and historical route connections are simplified. Artificial empire shapes have been removed; dated cards explain changes in power. Journeys: <a href="https://sourcebooks.web.fordham.edu/source/1354-ibnbattuta.asp">Ibn Battuta’s translated account</a>, <a href="https://sourcebooks.web.fordham.edu/source/ibnbattuta-africa14C.asp">East African account</a>, and <a href="https://orias.berkeley.edu/resources-teachers/travels-ibn-battuta">UC Berkeley ORIAS</a>. Sources disagree on some dates, notably East Africa. Only documented major legs and identifiable stops are plotted, not every overnight halt. The group’s Moroccan diplomat source is Leo Africanus, writing after 1450; it is later comparative evidence, not Ibn Battuta’s account.';
renderYear(slider.value);
