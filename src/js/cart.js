import { getLocalStorage, setLocalStorage, updateCartCount } from './utils.mjs';

const totalCart = document.getElementById('totalCart');
const cartTotalP = document.getElementById('cartTotalP');
const cartList = document.getElementById('cartList');
const checkoutLink = document.getElementById('checkoutLink');

function renderCartContents() {
  const cartItems = getLocalStorage('so-cart');
  updateCartCount();

  if (!cartList) {
    return;
  }
  if (!cartItems || cartItems.length === 0) {
    if (cartList) {
      cartList.innerHTML = '<li>No products in the cart</li>';
      hideCartTotal();
    }
    return;
  }

  const cartItemsObject = {};
  cartItems.forEach((item) => {
    if (cartItemsObject[item.Id]) {
      cartItemsObject[item.Id].quantity++;
    } else {
      cartItemsObject[item.Id] = { ...item, quantity: 1 };
    }
  });

  const cartArray = Object.values(cartItemsObject);
  const htmlItems = cartArray.map((item) => cartItemTemplate(item));
  const totalCartPrice = cartArray.reduce((total, item) => total + item.FinalPrice * item.quantity, 0);
  totalCart.innerText = `$ ${totalCartPrice.toFixed(2)}`;
  if (totalCartPrice !== 0) {
    showCartTotal();
  } else {
    hideCartTotal();
  }

  cartList.innerHTML = htmlItems.join('');
  const removeButtons = document.querySelectorAll('.remove-item');
  removeButtons.forEach((button) => {
    button.addEventListener('click', removeItemFromCart);
  });

  const increaseQuantityButton = document.querySelectorAll('.increase-quantity');
  increaseQuantityButton.forEach((button) => {
    button.addEventListener('click', increaseItemQuantity)
  });

  const decreaseQuantityButton = document.querySelectorAll('.decrease-quantity');
  decreaseQuantityButton.forEach((button) => {
    button.addEventListener('click', decreaseItemQuantity)
  });

  const moveToWishlistButtons = document.querySelectorAll('.move-to-wishlist');
  moveToWishlistButtons.forEach((button) => {
    button.addEventListener('click', moveToWishlist)
  });
}

function cartItemTemplate(item) {
  const specialStyle = 'position:relative;width:100%;';

  return `
    <li class="cart-card divider" style="${specialStyle}">
      <button class="remove-item" data-product-id="${item.Id}">Delete</button>
      <button class="move-to-wishlist" data-product-id="${item.Id}">Move to Wishlist</button>
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
}

function removeItemFromCart(event) {
  const productId = event.target.dataset.productId;
  let cartItems = getLocalStorage('so-cart');
  if (!Array.isArray(cartItems)) {
    cartItems = [];
  }
  cartItems = cartItems.filter((item) => item.Id !== productId);
  setLocalStorage('so-cart', cartItems);
  renderCartContents();
}

function increaseItemQuantity(event) {
  const productId = event.target.dataset.productId;
  let cartItems = getLocalStorage('so-cart') || [];
  for (let i = 0; i < cartItems.length; i++) {
    if (cartItems[i].Id === productId) {
      cartItems.push(cartItems[i])
      setLocalStorage('so-cart', cartItems);
      renderCartContents();
      return;
    }
  }
}

function decreaseItemQuantity(event) {
  const productId = event.target.dataset.productId;
  let cartItems = getLocalStorage('so-cart');
  if (!Array.isArray(cartItems)) {
    cartItems = [];
  }
  for (let i = 0; i < cartItems.length; i++) {
    if (cartItems[i].Id === productId) {
      if (cartItems[i].quantity == 1) {
        cartItems.splice(i, 1);
      } else {
        cartItems.pop(cartItems[i])
      }
      setLocalStorage('so-cart', cartItems);
      renderCartContents();
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

function moveToWishlist(event) {
  const productId = event.target.dataset.productId;
  let cartItems = getLocalStorage('so-cart');
  let wishlistItems = getLocalStorage('so-wishlist') || [];
  if (!Array.isArray(cartItems)) {
    cartItems = [];
  }
  for (let i = 0; i < cartItems.length; i++) {
    if (cartItems[i].Id === productId) {
      wishlistItems.push(cartItems[i]);
      cartItems.splice(i, 1);
      setLocalStorage('so-cart', cartItems);
      setLocalStorage('so-wishlist', wishlistItems);
      renderCartContents();
      renderWishlistContents();
      return;
    }
  }
}

function renderWishlistContents() {
  const wishlistItems = getLocalStorage('so-wishlist') || [];
  const wishlistList = document.getElementById('wishlistList');
  if (!wishlistList) {
    return;
  }
  if (wishlistItems.length === 0) {
    wishlistList.innerHTML = '<li>No products in the wishlist</li>';
    return;
  }
  const wishlistItemsObject = {};
  wishlistItems.forEach((item) => {
    if (wishlistItemsObject[item.Id]) {
      wishlistItemsObject[item.Id].quantity++;
    } else {
      wishlistItemsObject[item.Id] = { ...item, quantity: 1 };
    }
  });
  const wishlistArray = Object.values(wishlistItemsObject);
  const htmlItems = wishlistArray.map((item) => wishlistItemTemplate(item));
  wishlistList.innerHTML = htmlItems.join('');
  const moveToCartButtons = document.querySelectorAll('.move-to-cart');
  moveToCartButtons.forEach((button) => {
    button.addEventListener('click', moveToCart)
  });
}

function wishlistItemTemplate(item) {
  return `
    <li class="wishlist-card divider">
      <button class="move-to-cart" data-product-id="${item.Id}">Move to Cart</button>
      <a href="#" class="wishlist-card__image">
        <img src="${item.Image}" alt="${item.Name}" />
      </a>
      <a href="#">
        <h2 class="card__name">${item.Name}</h2>
      </a>
      <p class="wishlist-card__color">${item.Color}</p>
      <p class="wishlist-card__price">$${item.FinalPrice}</p>
    </li>
  `;
}

function moveToCart(event) {
  const productId = event.target.dataset.productId;
  let wishlistItems = getLocalStorage('so-wishlist');
  let cartItems = getLocalStorage('so-cart') || [];
  if (!Array.isArray(wishlistItems)) {
    wishlistItems = [];
  }
  for (let i = 0; i < wishlistItems.length; i++) {
    if (wishlistItems[i].Id === productId) {
      cartItems.push(wishlistItems[i]);
      wishlistItems.splice(i, 1);
      setLocalStorage('so-wishlist', wishlistItems);
      setLocalStorage('so-cart', cartItems);
      renderCartContents();
      renderWishlistContents();
      return;
    }
  }
}

// Call the function to render cart contents when the page loads
renderCartContents();
renderWishlistContents();