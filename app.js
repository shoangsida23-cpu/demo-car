document.addEventListener("DOMContentLoaded", () => {
  fetch("cars.json")
    .then((res) => res.json())
    .then((cars) => {
      const container = document.getElementById("cars-container");
      cars.forEach((car) => {
        const card = document.createElement("div");
        card.className = "car-card";

        // link trực tiếp sang trang chi tiết
        card.innerHTML = `
          <a href="cars/${car.id}.html" target="_blank">
            <img src="${car.image}" alt="${car.name}" style="max-width:100%;border-radius:8px;cursor:pointer;">
          </a>
          <h2>${car.name}</h2>
          <p>Giá: €${car.price.toLocaleString()}<br>
             ~ ₫${car.price_vnd.toLocaleString("vi-VN")}</p>
          <a href="cars/${car.id}.html" target="_blank">
            <button>Chi tiết</button>
          </a>
        `;
        container.appendChild(card);
      });
    });
});
