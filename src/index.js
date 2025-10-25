import "./assets/styles/main.scss";

// 🧩 Модули
import { initSlider } from "./modules/slider.js";
import { loadBooks } from "./modules/books.js";
import { loadCartPage } from "./modules/cart.js";

// 🚀 Инициализация после загрузки страницы
document.addEventListener("DOMContentLoaded", () => {
  const isCartPage = document.body.classList.contains("cart-page");
  const isMainPage = document.querySelector("#book-list");

  // 🧭 Загружаем нужный функционал
  if (isMainPage) {
    initSlider();
    loadBooks();
  } else if (isCartPage) {
    loadCartPage();
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
