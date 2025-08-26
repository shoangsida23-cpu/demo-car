/* App: renders car cards into #cards, supports search/filter/sort. Links to cars/<id>.html */
const carsDataUrl = 'cars.json';

async function loadCars(){
  try{
    const res = await fetch(carsDataUrl);
    const cars = await res.json();
    return cars;
  }catch(e){
    console.error('Failed to load cars.json', e);
    return [];
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  const cars = await loadCars();
  // UI refs
  const cardsEl = document.getElementById('cards');
  const countEl = document.getElementById('count');
  const typeChips = document.getElementById('type-chips');
  const priceRange = document.getElementById('price-range');
  const rangeVal = document.getElementById('range-val');
  const searchInput = document.getElementById('search-input');
  const onlyAvailable = document.getElementById('only-available');
  const showLimited = document.getElementById('show-limited');
  const sortBy = document.getElementById('sort-by');

  // initial state
  const state = {
    type: 'All',
    maxPrice: parseInt(priceRange.value,10),
    q: '',
    onlyAvailable: false,
    showLimited: true,
    sort: 'featured'
  };

  // events
  priceRange.addEventListener('input', () => {
    state.maxPrice = parseInt(priceRange.value,10);
    rangeVal.textContent = '€' + state.maxPrice.toLocaleString();
    render();
  });
  searchInput.addEventListener('input', (e)=>{ state.q = e.target.value.trim().toLowerCase(); render(); });
  onlyAvailable.addEventListener('change', ()=>{ state.onlyAvailable = onlyAvailable.checked; render(); });
  showLimited.addEventListener('change', ()=>{ state.showLimited = showLimited.checked; render(); });
  sortBy.addEventListener('change', ()=>{ state.sort = sortBy.value; render(); });

  typeChips.addEventListener('click', (e) => {
    const btn = e.target.closest('button');
    if(!btn) return;
    const t = btn.dataset.type;
    state.type = t;
    [...typeChips.querySelectorAll('.chip')].forEach(c=>c.classList.toggle('active', c.dataset.type===t));
    render();
  });

  document.getElementById('show-all').addEventListener('click', ()=>{
    state.type='All'; state.q=''; state.maxPrice=5000000; state.onlyAvailable=false; state.showLimited=true; state.sort='featured';
    priceRange.value = 5000000; rangeVal.textContent = '€5,000,000';
    [...typeChips.querySelectorAll('.chip')].forEach(c=>c.classList.toggle('active', c.dataset.type==='All'));
    render();
  });

  document.getElementById('download-json').addEventListener('click', ()=>{
    const blob = new Blob([JSON.stringify(cars,null,2)],{type:'application/json'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'prestige-motors-cars.json'; a.click(); URL.revokeObjectURL(url);
  });

  function render(){
    let list = cars.slice();
    if(state.type !== 'All') list = list.filter(c=>c.type===state.type);
    list = list.filter(c=>c.price <= state.maxPrice);
    if(state.onlyAvailable) list = list.filter(c=>c.available);
    if(!state.showLimited) list = list.filter(c=>!c.limited);
    if(state.q) list = list.filter(c=> (c.name + ' ' + c.brand + ' ' + c.type).toLowerCase().includes(state.q));

    if(state.sort==='price-asc') list.sort((a,b)=>a.price-b.price);
    else if(state.sort==='price-desc') list.sort((a,b)=>b.price-a.price);
    else if(state.sort==='hp-desc') list.sort((a,b)=>b.hp-a.hp);
    else list.sort((a,b)=> (b.limited?1:0) - (a.limited?1:0) );

    countEl.textContent = list.length;
    cardsEl.innerHTML = '';
    for(const car of list){
      const el = document.createElement('article'); el.className='card';
      el.innerHTML = `
        <div class="thumb"><a href="cars/${car.id}.html"><img alt="${car.brand} ${car.name}" src="${car.image}" /></a></div>
        <div class="card-body">
          <div class="meta"><div><strong>${car.brand} ${car.name}</strong><div style='font-size:13px;color:#bdbdbd'>${car.type}</div></div><div class="price">€${car.price.toLocaleString()}</div></div>
          <div class="specs"><div>HP: ${car.hp}</div><div>Top: ${car.topSpeed} km/h</div><div>${car.available? 'Available' : 'Sold'}</div></div>
          <div class="card-actions">
            <a class="btn" href="cars/${car.id}.html">Chi tiết</a>
            <button class="btn secondary" data-short="inquire-${car.id}">Liên hệ</button>
          </div>
        </div>
      `;
      cardsEl.appendChild(el);
    }
  }

  // initialize UI
  [...typeChips.querySelectorAll('.chip')].forEach(c=>c.classList.toggle('active', c.dataset.type==='All'));
  rangeVal.textContent = '€' + priceRange.value.toLocaleString();
  render();
});
