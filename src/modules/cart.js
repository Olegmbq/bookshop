export function loadCartPage() {
  const container = document.getElementById("cart-items");
  const cart = JSON.parse(localStorage.getItem("cartData")) || [];

  if (cart.length === 0) {
    container.innerHTML = "<p>No items in your cart yet 😔</p>";
    return;
  }

  container.innerHTML = cart
    .map(
      (book) => `
    <div class="cart-item" data-id="${book.id}">
      <img src="${book.image}" alt="${book.title}" />
      <div class="cart-item__info">
        <h3>${book.title}</h3>
        <p>${book.authors}</p>
        <p class="cart-item__price">${book.price}</p>
        <button class="remove-btn">Remove</button>
      </div>
    </div>`
    )
    .join("");

  // 🗑️ Удаление книги
  container.querySelectorAll(".remove-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.closest(".cart-item").dataset.id;
      const updatedCart = cart.filter((b) => b.id !== id);
      localStorage.setItem("cartData", JSON.stringify(updatedCart));
      loadCartPage();
      updateCartCount();
    });
  });
}

// 🔢 Счётчик корзины в шапке
function updateCartCount() {
  const count = document.querySelector("#cart-count");
  const data = JSON.parse(localStorage.getItem("cartData")) || [];
  if (count) count.textContent = data.length;
}

// 🧹 Очистка корзины
document.addEventListener("DOMContentLoaded", () => {
  const clearBtn = document.getElementById("clear-cart");
  if (clearBtn) {
    clearBtn.addEventListener("click", () => {
      localStorage.removeItem("cartData");
      loadCartPage();
      updateCartCount();
    });
  }

  const checkout = document.getElementById("checkout");
  if (checkout) {
    checkout.addEventListener("click", () => {
      alert("🛍️ Checkout process coming soon!");
    });
  }

  updateCartCount();
  loadCartPage();
});
