import { getLocalStorage } from "./utils.mjs";

function renderCartContents() {
  // Get cart items from local storage
  const cartItems = getLocalStorage("so-cart");

  // Check if there are items in the cart
  if (!cartItems || cartItems.length === 0) {
    // If no items, display a message or perform another appropriate action
    document.querySelector(".product-list").innerHTML =
      "<li>No products in the cart</li>";
    return;
  }

  // Convert cart data to an array if it's not already one
  const cartArray = Array.isArray(cartItems) ? cartItems : [cartItems];

  // Map cart items to HTML elements
  const htmlItems = cartArray.map((item) => cartItemTemplate(item));

  // Display items in the product list
  document.querySelector(".product-list").innerHTML = htmlItems.join("");
}

function cartItemTemplate(item) {
  // Determine the image source based on the host
  const imageSource =
    window.location.hostname === "localhost"
      ? item.Image
      : item.ImageProduction;

  // Create HTML template for a cart item
  const newItem = `
    <li class="cart-card divider">
      <a href="#" class="cart-card__image">
        <img src="${imageSource}" alt="${item.Name}" />
      </a>
      <a href="#">
        <h2 class="card__name">${item.Name}</h2>
      </a>
      <p class="cart-card__color">${item.Colors[0].ColorName}</p>
      <p class="cart-card__quantity">qty: 1</p>
      <p class="cart-card__price">$${item.FinalPrice}</p>
    </li>
  `;
  return newItem;
}

// Call the function to render cart contents when the page loads
renderCartContents();
