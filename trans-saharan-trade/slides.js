/* Original MapProjectP5(1).pdf pages. Navigation always follows PDF page order.
   Location clicks can open a related page without pretending the thematic
   deck order is chronological. The static PDF has no audio or animations. */
(() => {
  const slides=[
    ['Trans-Saharan Trade','Follow goods, travelers and ideas across Africa, 1200–1450 CE.','Map of Africa: Mali, rivers, Ibn Battuta and trade routes.',null],
    ['Transportation','Camels carried loads between water stops. Saddles, guides and organized caravans made desert crossings possible.','Camels and camel saddles, illustrated with caravan photographs.',[0,25]],
    ['Commercial Practices','Gold and other exchange media connected markets. Credit and trusted partners could reduce the need to carry valuables. The credit-card image is a modern illustration.','Currency and credit, illustrated with salt, gold, cowrie shells and a modern credit card.',locations.sijilmasa],
    ['Empires','Ghana’s earlier power waned; Mali rose in the 1200s. Songhai’s greatest imperial expansion came after 1450.','Mali, Ghana and Songhai, with Mansa Musa and a schematic empire shape.',[-3,16]],
    ['Leo Africanus · Timbuktu','Later evidence: his account was completed in 1526. Books, imported salt and scholarly life connect trade with learning.','Timbuktu: houses, mosque, palace, wealth, expensive salt, imported horses, scholars and fire. A modern map locates the city.',locations.timbuktu],
    ['Leo Africanus · Gao','Later evidence: early 1500s. Imported goods and royal justice feature in his account; judgments about rural people reflect his bias.','Gao: imported merchandise, slavery, royal dispute resolution and the author’s unfavorable judgments of rural people. Map: the later Songhai Empire.',locations.gao],
    ['Goods Exchanged','For trans-Saharan trade, gold came chiefly from West African fields such as Bambuk and Bure. Enslaved people were forcibly displaced, not natural resources.','Salt, gold, enslaved people, silk, crops, metal and pearls. Read the South Africa gold label with the West African goldfield correction below.',[-5,17]],
    ['Cultural Diffusion','Merchants and pilgrims carried books, languages and beliefs. Islamic practices blended with enduring local traditions.','Islamic law and education, Arabic writing, caravan knowledge, textiles and syncretism.',locations.timbuktu],
    ['Diasporic Communities','Swahili cities had African roots. Merchant settlement and family ties shaped coastal communities; forced migration through slavery was a different experience.','Arabian and Persian settlement, monsoon stays, intermarriage, Kiswahili, migrant communities in Mali and forced diaspora.',locations.mombasa],
    ['Spread of Crops + Other','Food and textiles linked growing regions with markets. Dates sustained desert travelers; Niger communities also supplied rice, millet and other regional foods.','Gold trade, wheat, cotton and dates. Historical crop movements were complex; these connections are examples rather than exclusive origins.',locations.jenne],
    ['Spread of Disease','Evidence check: plague is dated in North Africa; other outbreak routes are uncertain. Malaria needs mosquitoes and sleeping sickness needs tsetse flies—neither simply arrived from Asia.','Plague, smallpox, measles, leprosy, malaria and sleeping sickness. The original slide includes uncertain outbreak and geographic claims; see the context note.',locations.cairo]
  ];
  const sim=document.querySelector('#simulation'),viewport=document.querySelector('#mapViewport'),info=document.querySelector('.map-popup');
  const bar=document.createElement('div');bar.className='slide-tour-bar';
  bar.innerHTML='<button id="startSlideTour">▶ Our slides · start at 1</button><button id="resumeSlides">Next slide · 1 / 11</button><label><input id="relatedSlides" type="checkbox" checked> Show slides for map topics</label><span id="slideStatus" aria-live="polite">11 original slides · your presentation order</span>';
  sim.insertBefore(bar,viewport);
  const card=document.createElement('section');card.className='slide-card';card.hidden=true;card.setAttribute('role','dialog');card.setAttribute('aria-modal','false');card.setAttribute('aria-labelledby','slideTitle');
  card.innerHTML='<header><span class="slide-number" id="slideNumber"></span><h2 id="slideTitle"></h2><button class="slide-close" aria-label="Close slide and continue simulation">×</button></header><div class="slide-image-frame"><img id="slideImage" alt="" decoding="async"></div><p class="slide-caption" id="slideCaption"></p><details><summary>Slide description</summary><p id="slideDescription"></p></details><p class="original-note">Your original slide · brief context added below the image</p><footer><button id="previousSlide">← Previous</button><button id="nextSlide">Next slide →</button><button id="fullscreenSlide" aria-pressed="false">⛶ Fullscreen slide</button><button id="slideMapDetails">Map details</button><button class="slide-resume" id="continueSimulation">Continue simulation →</button></footer>';
  viewport.append(card);
  const enabled=bar.querySelector('#relatedSlides'),status=bar.querySelector('#slideStatus');
  let index=0,next=0,opener=null,hasDetails=false;
  const beforePlay=setPlaying,beforeRender=renderYear;
  function resetExpansion(){card.classList.remove('slide-expanded');card.querySelector('#fullscreenSlide').textContent='⛶ Fullscreen slide';card.querySelector('#fullscreenSlide').setAttribute('aria-pressed','false');}
  function showSlide(i,related=false){
    if(i<0||i>=slides.length)return;
    if(card.hidden)opener=document.activeElement;
    index=i;hasDetails=related;beforePlay(false);info.hidden=true;info.classList.remove('popup-expanded');
    const [title,note,alt,point]=slides[i];
    sim.dispatchEvent(new CustomEvent('atlas:set-view',{detail:{point}}));
    card.querySelector('#slideNumber').textContent=(i+1)+' / 11';card.querySelector('#slideTitle').textContent=title;
    const img=card.querySelector('#slideImage');img.src='slides/slide-'+String(i+1).padStart(2,'0')+'.jpg';img.alt=alt;
    card.querySelector('#slideCaption').innerHTML='<strong>'+(i===10||i===6?'Context: ':'In brief: ')+'</strong>'+note;
    card.querySelector('#slideDescription').textContent=alt;card.querySelector('details').open=false;
    card.querySelector('#previousSlide').disabled=i===0;card.querySelector('#nextSlide').disabled=i===10;card.querySelector('#slideMapDetails').hidden=!hasDetails;
    card.hidden=false;card.scrollTop=0;card.querySelector('.slide-close').focus({preventScroll:true});
    status.textContent='Slide '+(i+1)+' / 11 · '+(related?'related to this location':'original presentation order');
    next=i===10?0:i+1;bar.querySelector('#resumeSlides').textContent=(i===10?'Replay slides':'Next slide')+' · '+(next+1)+' / 11';
    // Warm only the following page; retain original full-resolution slide assets.
    if(i<10){const preload=new Image();preload.src='slides/slide-'+String(i+2).padStart(2,'0')+'.jpg';}
  }
  function closeSlide(){card.hidden=true;resetExpansion();if(opener?.isConnected)opener.focus({preventScroll:true});}
  function resumeMap(){
    closeSlide();info.hidden=true;info.classList.remove('popup-expanded');
    window.atlasSlidesQuietUntil=performance.now()+5000;
    if(Number(slider.value)>=1450){slider.value=1200;beforeRender(1200);}
    beforePlay(true);status.textContent='Map playing · next slide available above';
  }
  card.querySelector('.slide-close').onclick=resumeMap;card.querySelector('#continueSimulation').onclick=resumeMap;
  card.querySelector('#previousSlide').onclick=()=>showSlide(index-1);card.querySelector('#nextSlide').onclick=()=>showSlide(index+1);
  card.querySelector('#fullscreenSlide').onclick=()=>{const on=card.classList.toggle('slide-expanded');card.querySelector('#fullscreenSlide').textContent=on?'⤡ Exit slide fullscreen':'⛶ Fullscreen slide';card.querySelector('#fullscreenSlide').setAttribute('aria-pressed',String(on));};
  card.querySelector('#slideMapDetails').onclick=()=>{closeSlide();info.hidden=false;addPopupControls();info.querySelector('.popup-close').focus();};
  bar.querySelector('#startSlideTour').onclick=()=>showSlide(0);bar.querySelector('#resumeSlides').onclick=()=>showSlide(next);
  setPlaying=function(value){if(value&&!card.hidden){resumeMap();return;}beforePlay(value);};
  renderYear=function(value){const running=playing;beforeRender(value);if(window.atlasSlidesQuietUntil>performance.now()&&running&&!playing)beforePlay(true);};
  function topicSlide(title){
    if(/Timbuktu/i.test(title))return 4;if(/Gao/i.test(title))return 5;
    if(/Ghana|Mali Empire|Songhai|rise of Mali|regional power|Koumbi/i.test(title))return 3;
    if(/Communit|diaspora|Swahili|Kilwa|Mombasa|Mogadishu/i.test(title))return 8;
    if(/Musa|Books|faith|language|learning/i.test(title))return 7;
    if(/crops|food|Nile valley|Jenne/i.test(title))return 9;
    if(/salt|gold|copper|capture zones|Taghaza|Takedda/i.test(title))return 6;
    if(/Death|plague|Smallpox|Measles|Leprosy|Malaria|Trypanosomiasis/i.test(title))return 10;
    if(/Sijilmasa/i.test(title))return 2;
    if(/Sahara|caravan|crossing/i.test(title))return 1;
    return null;
  }
  sim.addEventListener('atlas:info',e=>{const i=topicSlide(e.detail.title);if(enabled.checked&&i!==null)showSlide(i,true);else {closeSlide();addPopupControls();}});
  function addPopupControls(){
    if(info.querySelector('.popup-utilities'))return;
    const row=document.createElement('div');row.className='popup-utilities';
    row.innerHTML='<button class="expand-info" aria-pressed="false">⛶ Fullscreen popup</button><button class="resume-info">Continue simulation →</button>';
    info.append(row);
    row.querySelector('.expand-info').onclick=e=>{const on=info.classList.toggle('popup-expanded');e.currentTarget.textContent=on?'⤡ Exit popup fullscreen':'⛶ Fullscreen popup';e.currentTarget.setAttribute('aria-pressed',String(on));};
    row.querySelector('.resume-info').onclick=resumeMap;
  }
  info.querySelector('.popup-close').addEventListener('click',()=>info.classList.remove('popup-expanded'));
  window.addEventListener('keydown',e=>{if(card.hidden)return;if(e.key==='Escape'){e.preventDefault();e.stopImmediatePropagation();if(card.classList.contains('slide-expanded'))resetExpansion();else resumeMap();}},true);
  addPopupControls();
})();
