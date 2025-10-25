import { fetchBooks } from "./api.js";

// 🔔 Красивое всплывающее уведомление с иконкой и паузой при наведении
function showToast(message, type = "info") {
  const container = document.getElementById("toast-container");
  if (!container) return;

  const toast = document.createElement("div");
  toast.className = `toast toast--${type}`;

  // 💬 Определяем иконку по типу
  const icon = document.createElement("span");
  icon.className = "toast__icon";
  if (type === "success") icon.textContent = "✅";
  else if (type === "error") icon.textContent = "❌";
  else icon.textContent = "💬";

  // 📝 Текст уведомления
  const text = document.createElement("span");
  text.textContent = message;

  toast.appendChild(icon);
  toast.appendChild(text);
  container.appendChild(toast);

  // 🪄 Смещаем вверх старые уведомления
  const toasts = container.querySelectorAll(".toast");
  toasts.forEach((t, i) => {
    t.style.transform = `translateY(-${i * 10}px)`;
  });

  // ⏳ Удаление, но с паузой при наведении
  let hideTimeout = setTimeout(() => hideToast(), 2500);

  function hideToast() {
    toast.classList.add("hide");
    setTimeout(() => toast.remove(), 500);
  }

  toast.addEventListener("mouseenter", () => {
    clearTimeout(hideTimeout);
  });

  toast.addEventListener("mouseleave", () => {
    hideTimeout = setTimeout(() => hideToast(), 1200);
  });
}

// ⚙️ Глобальные переменные
let currentCategory = "fiction";
let startIndex = 0;
const maxResults = 6;
let cart = JSON.parse(localStorage.getItem("cart")) || [];
let loading = false;

// 📚 Загрузка книг
export async function loadBooks(category = currentCategory, append = false) {
  if (loading) return;
  loading = true;

  try {
    if (category !== currentCategory) {
      currentCategory = category;
      startIndex = 0;
      document.querySelector("#book-list").innerHTML = "";
    }

    const container = document.querySelector("#book-list");
    if (!container) return;

    if (!append) container.innerHTML = "";

    // 🌀 Лоадер
    const loader = document.createElement("p");
    loader.className = "loading";
    loader.textContent = "Loading books...";
    container.appendChild(loader);

    // 📡 Получаем книги
    const books = await fetchBooks(category, startIndex, maxResults);
    loader.remove();

    if (!books || books.length === 0) {
      container.innerHTML = "<p>No books found in this category.</p>";
      loading = false;
      return;
    }

    const html = books
      .map((b) => {
        const id = b.id;
        const info = b.volumeInfo || {};
        const sale = b.saleInfo || {};
        const inCart = cart.includes(id);

        const img =
          info.imageLinks?.thumbnail || "https://via.placeholder.com/128x195";
        const title = info.title || "Untitled";
        const authors = info.authors
          ? info.authors.join(", ")
          : "Unknown author";
        const rating = info.averageRating || 0;
        const reviews = info.ratingsCount || 0;
        const description = info.description
          ? info.description.slice(0, 150) + "…"
          : "";
        const price = sale?.retailPrice
          ? `${sale.retailPrice.amount} ${sale.retailPrice.currencyCode}`
          : "";

        return `
          <div class="book" data-id="${id}">
            <img src="${img}" alt="${title}" />
            <h3>${title}</h3>
            <p class="book__author">${authors}</p>

            ${
              rating
                ? `<div class="book__rating">
                    <span class="book__stars">
                      ${"★".repeat(Math.round(rating))}${"☆".repeat(
                    5 - Math.round(rating)
                  )}
                    </span>
                    <span class="book__reviews">(${reviews} reviews)</span>
                  </div>`
                : ""
            }

            <p class="book__desc">${description}</p>
            ${price ? `<p class="book__price">${price}</p>` : ""}

            <button class="book__btn ${inCart ? "added" : ""}">
              ${inCart ? "In cart" : "Buy now"}
            </button>
          </div>`;
      })
      .join("");

    container.insertAdjacentHTML("beforeend", html);
    startIndex += maxResults;

    attachBuyNowEvents();
  } catch (error) {
    console.error("❌ Error loading books:", error);
    document.querySelector("#book-list").innerHTML =
      "<p>⚠️ Failed to load books. Please try again later.</p>";
  } finally {
    loading = false;
  }
}

// 🛒 Добавление в корзину
function attachBuyNowEvents() {
  const buttons = document.querySelectorAll(".book__btn");
  buttons.forEach((btn) => {
    btn.onclick = () => {
      const bookId = btn.closest(".book").dataset.id;
      btn.disabled = true; // защита от двойного клика

      if (cart.includes(bookId)) {
        cart = cart.filter((id) => id !== bookId);
        btn.classList.remove("added");
        setTimeout(() => (btn.textContent = "Buy now"), 200);
        showToast("Removed from cart ❌", "error");
      } else {
        cart.push(bookId);
        btn.style.animation = "pulse 0.6s ease";
        setTimeout(() => {
          btn.classList.add("added");
          btn.textContent = "In cart";
          btn.style.animation = "";
        }, 300);
        showToast("Added to cart ✅", "success");
      }

      updateCartCount();
      localStorage.setItem("cart", JSON.stringify(cart));

      // Разблокировка после короткой задержки
      setTimeout(() => (btn.disabled = false), 500);
    };
  });
}

// 🧮 Обновление счётчика корзины
function updateCartCount() {
  const count = document.querySelector("#cart-count");
  if (count) count.textContent = cart.length;
}

// 📂 Инициализация категорий и кнопки загрузки
document.addEventListener("DOMContentLoaded", () => {
  const categories = document.querySelectorAll("#category-list li");
  categories.forEach((cat) => {
    cat.addEventListener("click", () => {
      categories.forEach((c) => c.classList.remove("active"));
      cat.classList.add("active");
      loadBooks(cat.dataset.cat);
    });
  });

  const loadMore = document.querySelector("#load-more");
  if (loadMore)
    loadMore.addEventListener("click", () => {
      loadBooks(currentCategory, true);
    });

  updateCartCount();
  loadBooks(currentCategory);
});
