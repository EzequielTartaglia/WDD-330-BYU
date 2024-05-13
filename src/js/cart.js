import { getLocalStorage, setLocalStorage, updateCartCount } from './utils.mjs';

const totalCart = document.getElementById('totalCart');
const cartTotalP = document.getElementById('cartTotalP');
const cartList = document.getElementById('cartList');
const checkoutLink = document.getElementById('checkoutLink');

function renderCartContents() {
  // Get cart items from local storage
  const cartItems = getLocalStorage('so-cart');
  updateCartCount();

  // Check if there are items in the cart
  if (!cartItems || cartItems.length === 0) {
    // If no items, display a message or perform another appropriate action
    cartList.innerHTML = '<li>No products in the cart</li>';
    hideCartTotal();
    return;
  }

  // Create an object to store the cart items with their quantities
  const cartItemsObject = {};

  // Loop through the cart items and group duplicates
  cartItems.forEach((item) => {
    if (cartItemsObject[item.Id]) {
      // If the item is already in the object, increment its quantity
      cartItemsObject[item.Id].quantity++;
    } else {
      // If the item is not in the object, add it with a quantity of 1
      cartItemsObject[item.Id] = { ...item, quantity: 1 };
    }
  });

  // Convert the object to an array of cart items with quantities
  const cartArray = Object.values(cartItemsObject);

  // Map cart items to HTML elements
  const htmlItems = cartArray.map((item) => cartItemTemplate(item));

  // Calculate total cart price
  const totalCartPrice = cartArray.reduce((total, item) => total + item.FinalPrice * item.quantity, 0);

  // Update total cart HTML element
  totalCart.innerText = `$ ${totalCartPrice.toFixed(2)}`;

  // Show total cart if total is not zero
  if (totalCartPrice !== 0) {
    showCartTotal();
  } else {
    hideCartTotal();
  }

  // Display items in the product list
  cartList.innerHTML = htmlItems.join('');

  // Add event listeners to the remove buttons
  const removeButtons = document.querySelectorAll('.remove-item');
  removeButtons.forEach((button) => {
    button.addEventListener('click', removeItemFromCart);
  });

  // Add event listeners to the quantity increase buttons
  const increaseQuantityButton = document.querySelectorAll('.increase-quantity');
  increaseQuantityButton.forEach((button) => {
    button.addEventListener('click', increaseItemQuantity)
  });

  // Add event listeners to the quantity decrease buttons
  const decreaseQuantityButton = document.querySelectorAll('.decrease-quantity');
  decreaseQuantityButton.forEach((button) => {
    button.addEventListener('click', decreaseItemQuantity)
  });

}

function cartItemTemplate(item) {
  const specialStyle = 'position:relative;width:100%;';

  // Create HTML template for a cart item
  const newItem = `
    <li class="cart-card divider" style="${specialStyle}">
      <button class="remove-item" data-product-id="${item.Id}">Delete</button>

      <a href="#" class="cart-card__image">
        <img src="${item.Image}" alt="${item.Name}" />
      </a>
      <a href="#">
        <h2 class="card__name">${item.Name}</h2>
      </a>
      <p class="cart-card__color">${item.Color}</p>
      <div class="cart-card__quantity-controls">
        <button class="quantity-control increase-quantity" data-product-id="${item.Id}">+</button>
        <p class="cart-card__quantity">Qty: ${item.quantity}</p>
        <button class="quantity-control decrease-quantity" data-product-id="${item.Id}">-</button>
      </div>
      <p class="cart-card__price">$${item.FinalPrice}</p>
    </li>
  `;

  // Return the HTML template for the cart item
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

  // Filter out all items with the specified productId
  cartItems = cartItems.filter((item) => item.Id !== productId);

  // Save the updated cart items back to localStorage
  setLocalStorage('so-cart', cartItems);

  // Re-render the cart contents
  renderCartContents();
}

// Function to increase quantity of an item in the cart
function increaseItemQuantity(event) {
  const productId = event.target.dataset.productId;
  
  // Retrieve cart items from localStorage
  let cartItems = getLocalStorage('so-cart') || [];

  // Iterate through the cart items
  for (let i = 0; i < cartItems.length; i++) {
    if (cartItems[i].Id === productId) {
      cartItems.push(cartItems[i])
      // Save the updated cart items back to localStorage
      setLocalStorage('so-cart', cartItems);
      // Re-render the cart contents
      renderCartContents();
      // Exit the loop since we found the item
      return;
    }
  }
}

// Function to decrease quantity of an item in the cart
function decreaseItemQuantity(event) {
  const productId = event.target.dataset.productId;
  // Retrieve cart items from localStorage
  let cartItems = getLocalStorage('so-cart');
  // If cartItems is null or undefined, initialize it as an empty array
  if (!Array.isArray(cartItems)) {
    cartItems = [];
  }
  // Iterate through the cart items
  for (let i = 0; i < cartItems.length; i++) {
    if (cartItems[i].Id === productId) {
      if (cartItems[i].quantity == 1) {
        cartItems.splice(i, 1);
      } else {
        cartItems.pop(cartItems[i])
      }
      // Save the updated cart items back to localStorage
      setLocalStorage('so-cart', cartItems);
      // Re-render the cart contents
      renderCartContents();
      // Exit the loop since we found the item
      return;
    }
  }
}

function showCartTotal() {
  checkoutLink.classList.remove('hide');
  totalCart.classList.remove('hide');
  cartTotalP.classList.remove('hide');
}

function hideCartTotal() {
  checkoutLink.classList.add('hide');
  totalCart.classList.add('hide');
  cartTotalP.classList.add('hide');
}

// Call the function to render cart contents when the page loads
renderCartContents();