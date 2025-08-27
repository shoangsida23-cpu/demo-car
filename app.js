const products = [
  {id:"pm-001", name:"Lamborghini Aventador", price:1500000, img:"https://www.lamborghini.com/sites/it-en/files/DAM/lamborghini/share%20img/aventador.png"},
  {id:"pm-002", name:"Ferrari SF90", price:1700000, img:"https://www.ferrari.com/images/auto/SF90-Stradale.jpg"},
  {id:"pm-003", name:"Bugatti Chiron", price:3000000, img:"https://www.bugatti.com/fileadmin/_processed_/sei/p56/se-image-2f4a34c3ef17a15a5f3b3c9ddcd8f18b.jpg"},
  {id:"pm-004", name:"McLaren P1", price:1400000, img:"https://cars.mclaren.com/content/dam/mclaren-automotive/P1/hero.jpg"},
  {id:"pm-005", name:"Rolls-Royce Phantom", price:450000, img:"https://www.rolls-roycemotorcars.com/content/dam/rrmc/rollsroyce/cars/phantom/phantom.jpg"},
];

function renderProducts(list) {
  const container = document.getElementById('productList');
  if (!container) return;
  container.innerHTML = '';
  list.forEach(p => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <img src="${p.img}" alt="${p.name}">
      <h3>${p.name}</h3>
      <p>Giá: ${(p.price*24000).toLocaleString()} VND</p>
      <a href="cars/${p.id}.html"><button>Chi tiết</button></a>
    `;
    container.appendChild(card);
  });
}
document.addEventListener('DOMContentLoaded', ()=>{
  renderProducts(products);
});
