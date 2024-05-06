import { getLocalStorage, setLocalStorage } from './utils.mjs';

function renderCartContents() {
  // Get cart items from local storage
  const cartItems = getLocalStorage('so-cart');
  
  // Check if there are items in the cart
  if (!cartItems || cartItems.length === 0) {
    // If no items, display a message or perform another appropriate action
    document.querySelector('.product-list').innerHTML = '<li>No products in the cart</li>';
    
    // Update the cart count to 0
    updateCartCount(0);
    
    return;
  }

  // Convert cart data to an array if it's not already one
  const cartArray = Array.isArray(cartItems) ? cartItems : [cartItems];

  // Map cart items to HTML elements
  const htmlItems = cartArray.map((item) => cartItemTemplate(item));
  
  // Display items in the product list
  document.querySelector('.product-list').innerHTML = htmlItems.join('');

  // Update the cart count
  updateCartCount(cartArray.length);

  // Add event listeners to the remove buttons
  const removeButtons = document.querySelectorAll('.remove-item');
  removeButtons.forEach(button => {
    button.addEventListener('click', removeItemFromCart);
  });
}

function cartItemTemplate(item) {
  // Determine the image source based on the host
  const imageSource = window.location.hostname === 'localhost' ? item.Image : item.ImageProduction;

  const specialStyle = 'position:relative;width:100%;';

  // Create HTML template for a cart item
  const newItem = `
    <li class="cart-card divider" style="${specialStyle}">
      <button class="remove-item" data-product-id="${item.Id}">X</button>

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

function removeItemFromCart(event) {
  // Get the ID of the product to be removed
  const productId = event.target.dataset.productId;

  // Retrieve cart items from localStorage
  let cartItems = getLocalStorage('so-cart');

  // If cartItems is null or undefined, initialize it as an empty array
  if (!Array.isArray(cartItems)) {
    cartItems = [];
  }

  // Find the index of the first occurrence of the item with the specified productId
  const index = cartItems.findIndex(item => item.Id === productId);

  // If the product is found, remove it from the array
  if (index !== -1) {
    cartItems.splice(index, 1);

    // Save the updated cart items back to localStorage
    setLocalStorage('so-cart', cartItems);

    // Re-render the cart contents
    renderCartContents();
  }
}

function updateCartCount(count) {
  // Get the span element for the cart count
  const cartCountSpan = document.querySelector('.cart-count');
  
  // Update the text content of the span element to the cart count
  cartCountSpan.textContent = count;
}

// Call the function to render cart contents when the page loads
renderCartContents();


export function getCartCount() {
  // Get the cart count from the DOM
  const cartCountSpan = document.querySelector('.cart-count');
  return parseInt(cartCountSpan.textContent);
}