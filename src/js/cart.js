import { getLocalStorage, setLocalStorage, updateCartCount } from './utils.mjs';

const totalCart = document.getElementById('totalCart');
const cartTotalP = document.getElementById('cartTotalP');
const cartList = document.getElementById('cartList');

function renderCartContents() {
  // Get cart items from local storage
  const cartItems = getLocalStorage('so-cart');
  updateCartCount();
  // Check if there are items in the cart
  if (!cartItems || cartItems.length === 0) {
    // If no items, display a message or perform another appropriate action
    cartList.innerHTML = '<li>No products in the cart</li>';
    return;
  }

  // Convert cart data to an array if it's not already one
  const cartArray = Array.isArray(cartItems) ? cartItems : [cartItems];

  // Map cart items to HTML elements
  const htmlItems = cartArray.map((item) => cartItemTemplate(item));

  // Calculate total cart price
  const totalCartPrice = cartArray.reduce(
    (total, item) => total + item.Price,
    0,
  );

  // Update total cart HTML element
  totalCart.innerText = `$ ${totalCartPrice.toFixed(2)}`;

    // Show total cart if total is not zero
    if (totalCartPrice !== 0) {
      totalCart.classList.remove('hide')
      cartTotalP.classList.remove('hide')
    } else {
      totalCart.classList.add('hide')
      cartTotalP.classList.add('hide')
    }

  // Display items in the product list
  document.querySelector('.product-list').innerHTML = htmlItems.join('');

  // Add event listeners to the remove buttons
  const removeButtons = document.querySelectorAll('.remove-item');
  removeButtons.forEach((button) => {
    button.addEventListener('click', removeItemFromCart);
  });
}

function cartItemTemplate(item) {
  const specialStyle = 'position:relative;width:100%;';

  // Create HTML template for a cart item
  const newItem = `
    <li class="cart-card divider" style="${specialStyle}">
      <button class="remove-item" data-product-id="${item.Id}">X</button>

      <a href="#" class="cart-card__image">
        <img src="${item.Image}" alt="${item.Name}" />
      </a>
      <a href="#">
        <h2 class="card__name">${item.Name}</h2>
      </a>
      <p class="cart-card__color">${item.Color}</p>
      <p class="cart-card__quantity">qty: 1</p>
      <p class="cart-card__price">$${item.Price}</p>
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
  const index = cartItems.findIndex((item) => item.Id === productId);

  // If the product is found, remove it from the array
  if (index !== -1) {
    cartItems.splice(index, 1);

    // Save the updated cart items back to localStorage
    setLocalStorage('so-cart', cartItems);
    // Calculate total cart price
    const totalCartPrice = cartItems.reduce(
      (total, item) => total + item.Price,
      0,
    );

    // Update total cart HTML element
    totalCart.innerText = `$ ${totalCartPrice.toFixed(2)}`;

      // Show total cart if total is not zero
  if (totalCartPrice !== 0) {
    totalCart.classList.remove('hide');
    cartTotalP.classList.remove('hide')

  } else {
    totalCart.classList.add('hide');
    cartTotalP.classList.add('hide')
  }

    // Re-render the cart contents
    renderCartContents();
  }
}

// Call the function to render cart contents when the page loads
renderCartContents();