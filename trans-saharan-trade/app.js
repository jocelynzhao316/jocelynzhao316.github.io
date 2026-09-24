const markets = {
  sijilmasa: {
    name: 'Sijilmasa', region: 'Northern gateway · Morocco', years: 'North African terminus',
    lede: 'At the desert’s northern edge, caravans regrouped before or after the long Saharan crossing.',
    goods: [['🧂','Salt'],['🐎','Horses'],['🧵','Cloth'],['⚒','Manufactured goods']],
    why: 'Northern markets connected the routes to Mediterranean demand. Horses, cloth, and manufactured goods moved south while West African gold moved north.',
    idea: 'Credit arrangements reduced the need to carry all wealth physically across dangerous distances.'
  },
  taghaza: {
    name: 'Taghaza', region: 'Saharan exchange point', years: 'Desert crossing',
    lede: 'Salt made an isolated desert settlement central to exchange.',
    goods: [['🧂','Salt slabs'],['🥇','Gold'],['🌴','Dates'],['🐪','Caravan supplies']],
    why: 'Salt was essential in West Africa and valuable enough to carry across the Sahara. Oases and trading posts gave merchants places to rest and resupply.',
    idea: 'The camel saddle spread weight more evenly, allowing caravans to carry heavier loads through heat and scarce water.'
  },
  timbuktu: {
    name: 'Timbuktu', region: 'Mali · Niger River', years: 'Major market & learning center',
    lede: 'Gold and salt changed hands beside books, scholarship, and religious ideas.',
    goods: [['🥇','Gold'],['🧂','Salt'],['📚','Books'],['🧵','Textiles'],['🐎','Horses'],['⛓','Enslaved people']],
    why: 'Its location near the Niger River made Timbuktu a bridge between Saharan caravans and river trade. Wealth supported large mosques, schools, and scholars.',
    idea: 'Muslim merchants and teachers helped spread Islam and scholarship; local practices continued alongside new religious traditions.',
    quote: '“It is a wonder to see the quality of merchandise that is daily brought here…” — from the group’s analysis of a Moroccan diplomat’s account'
  },
  gao: {
    name: 'Gao', region: 'Niger River Valley · Songhai', years: 'River market & imperial capital',
    lede: 'A river city where regional products met the long-distance caravan trade.',
    goods: [['🥇','Gold'],['🧂','Salt'],['🔶','Copper'],['⚒','Ironware'],['🧶','Cotton textiles'],['🌾','Grain']],
    why: 'Gao grew wealthy by taxing exchange. It later became the capital of Songhai, which expanded after Mali’s decline and protected routes with a large army.',
    idea: 'Markets concentrated wealth and political power in cities while linking rural producers to distant consumers.'
  },
  jenne: {
    name: 'Jenne', region: 'Inland Niger Delta', years: 'Regional production market',
    lede: 'Food, livestock, and iron products fed a network reaching beyond the desert.',
    goods: [['⚒','Iron products'],['🍚','Rice'],['🐟','Fish'],['🐄','Cattle'],['🐑','Sheep'],['🐐','Goats']],
    why: 'Jenne connected the savanna and forest zones to Niger River and trans-Saharan routes. Under Mali, it became a prosperous market center.',
    idea: 'The network joined ecological zones: desert salt, savanna grain and livestock, and forest products could circulate between regions.'
  },
  koumbi: {
    name: 'Koumbi-Saleh', region: 'Ghana · Western Sahel', years: 'Capital & principal trading site',
    lede: 'Taxes on trade financed a wealthy capital, scholars, judges, and military power.',
    goods: [['🥇','Gold'],['🦴','Ivory'],['🧂','Salt'],['🐎','Horses'],['🧵','Cloth'],['⛓','Enslaved people']],
    why: 'Ghana controlled areas near rich gold deposits and taxed exchange. The group’s research notes that trade wealth supported qadis, Muslim scholars, and a large protective army.',
    idea: 'Muslim merchants formed communities and strengthened commercial ties, while conversion was not uniformly imposed.'
  },
  cairo: {
    name: 'Cairo', region: 'Egypt · Mediterranean world', years: 'Northeastern connection',
    lede: 'A major destination linking African exchange to Mediterranean and Islamic commercial worlds.',
    goods: [['🥇','West African gold'],['🧵','Egyptian linen'],['👳','Turbans'],['🌹','Rose-water']],
    why: 'North African markets connected Saharan exchange to wider Mediterranean networks. The group’s notes identify Egyptian textiles and luxury goods among items moving through connected African markets.',
    idea: 'Pilgrimage and trade moved people as well as goods. Mansa Musa’s journey to Mecca displayed Mali’s wealth and brought teachers and ideas back to the empire.'
  }
};

const timelineEvents = [
  [1200, "Ghana's influence continues as regional trade networks deepen."],
  [1235, "Mali rises and gains control over gold-producing regions and trade."],
  [1300, "Market cities prosper under Mali's protection and taxation."],
  [1324, "Mansa Musa's pilgrimage broadcasts Mali's wealth across the Islamic world."],
  [1331, "Ibn Battuta's era records scholars and mobile merchant communities."],
  [1360, "Trade continues amid environmental and disease risks along connected routes."],
  [1400, "Songhai's influence grows around Gao as Mali's power begins to shift."],
  [1450, "Gold, salt, scholarship, and people still bind desert and river markets."]
];

const slider = document.querySelector('#yearSlider');
const yearDisplay = document.querySelector('#yearDisplay');
const playButton = document.querySelector('#playButton');
const eventLine = document.querySelector('#eventLine');
const statusText = document.querySelector('#statusText');
const dialog = document.querySelector('#marketDialog');
const tradeMap = document.querySelector('#tradeMap');
const mapWorld = document.querySelector('#mapWorld');
const mapViewport = document.querySelector('#mapViewport');
let playing = false;
let timer;

function renderYear(value) {
  const year = Number(value);
  yearDisplay.textContent = year;
  const event = [...timelineEvents].reverse().find(([eventYear]) => eventYear <= year);
  eventLine.textContent = event[1];
  document.querySelectorAll('.empire').forEach(empire => {
    const active = year >= Number(empire.dataset.start) && year <= Number(empire.dataset.end);
    empire.style.opacity = active ? '1' : '.06';
  });
  document.querySelectorAll('.routes path').forEach((route, index) => {
    route.classList.toggle('active-route', year >= 1235 + index * 25);
  });
}

function setPlaying(next) {
  playing = next;
  playButton.classList.toggle('playing', playing);
  playButton.setAttribute('aria-label', playing ? 'Pause timeline' : 'Play timeline');
  statusText.textContent = playing ? 'Caravans are moving through time' : 'Timeline paused — choose a market';
  clearInterval(timer);
  if (typeof tradeMap.pauseAnimations === 'function') {
    if (playing) tradeMap.unpauseAnimations();
    else tradeMap.pauseAnimations();
  }
  if (playing) {
    timer = setInterval(() => {
      const nextYear = Number(slider.value) >= 1450 ? 1200 : Number(slider.value) + 1;
      slider.value = nextYear;
      renderYear(nextYear);
    }, 90);
  }
}

function openMarket(key, marker) {
  const market = markets[key];
  if (!market) return;
  setPlaying(false);
  document.querySelector('#marketName').textContent = market.name;
  document.querySelector('#marketRegion').textContent = market.region;
  document.querySelector('#marketYears').textContent = market.years;
  document.querySelector('#marketLede').textContent = market.lede;
  document.querySelector('#marketWhy').textContent = market.why;
  document.querySelector('#marketIdea').textContent = market.idea;
  document.querySelector('#goodsGrid').innerHTML = market.goods.map(([icon, label]) => `<div class="good"><i aria-hidden="true">${icon}</i><span>${label}</span></div>`).join('');
  const quote = document.querySelector('#marketQuote');
  quote.textContent = market.quote || '';
  quote.hidden = !market.quote;
  const matrix = marker?.transform?.baseVal?.consolidate()?.matrix;
  if (matrix && !document.body.classList.contains('reduced-motion')) {
    mapWorld.style.transformOrigin = `${matrix.e}px ${matrix.f}px`;
    mapViewport.classList.add('market-zoom');
    window.setTimeout(() => dialog.showModal(), 430);
  } else {
    dialog.showModal();
  }
}

slider.addEventListener('input', event => { setPlaying(false); renderYear(event.target.value); });
playButton.addEventListener('click', () => setPlaying(!playing));
document.querySelector('#startJourney').addEventListener('click', () => {
  document.querySelector('#atlasShell').scrollIntoView({ behavior: 'smooth', block: 'center' });
  setPlaying(true);
});
function closeMarket() {
  dialog.close();
  mapViewport.classList.remove('market-zoom');
}
document.querySelector('#dialogClose').addEventListener('click', closeMarket);
dialog.addEventListener('click', event => { if (event.target === dialog) closeMarket(); });
document.querySelectorAll('.market').forEach(marker => {
  marker.addEventListener('click', () => openMarket(marker.dataset.market, marker));
  marker.addEventListener('keydown', event => {
    if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); openMarket(marker.dataset.market, marker); }
  });
});
document.querySelector('#motionToggle').addEventListener('click', event => {
  const reduced = document.body.classList.toggle('reduced-motion');
  event.currentTarget.setAttribute('aria-pressed', String(reduced));
  event.currentTarget.textContent = reduced ? 'Enable motion' : 'Reduce motion';
  if (reduced) setPlaying(false);
});
window.addEventListener('keydown', event => {
  if (event.code === 'Space' && !dialog.open && !event.target.closest('button,input,select,a,[role="button"],[role="dialog"]')) { event.preventDefault(); setPlaying(!playing); }
  if (event.key === 'Escape' && dialog.open) closeMarket();
});

renderYear(slider.value);
requestAnimationFrame(() => {
  if (typeof tradeMap.pauseAnimations === 'function') tradeMap.pauseAnimations();
});
