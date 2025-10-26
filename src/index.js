// import "./assets/styles/main.scss";

// 🚀 Инициализация после загрузки страницы
document.addEventListener("DOMContentLoaded", () => {
  const isCartPage = document.body.classList.contains("cart-page");
  const isMainPage = document.querySelector("#book-list");
  const isBrandPage = window.location.pathname.includes("brand");

  // 🧭 Лениво подгружаем нужные модули
  if (isMainPage) {
    import("./modules/slider.js").then(({ initSlider }) => initSlider());
    import("./modules/books.js").then(({ loadBooks }) => loadBooks());
  } else if (isCartPage) {
    import("./modules/cart.js").then(({ loadCartPage }) => loadCartPage());
  } else if (isBrandPage) {
    import("./modules/brand.js").then(() =>
      console.log("💫 Brand Kit loaded lazily")
    );
  }

  // 🍔 Бургер-меню
  const burger = document.querySelector(".burger");
  const nav = document.querySelector(".nav");
  const overlay = document.createElement("div");
  overlay.classList.add("overlay");
  document.body.appendChild(overlay);

  if (burger && nav) {
    burger.addEventListener("click", () => {
      const isActive = burger.classList.toggle("active");
      nav.classList.toggle("open", isActive);
      overlay.classList.toggle("show", isActive);
      document.body.style.overflow = isActive ? "hidden" : "";
    });

    overlay.addEventListener("click", () => {
      burger.classList.remove("active");
      nav.classList.remove("open");
      overlay.classList.remove("show");
      document.body.style.overflow = "";
    });
  }
});
