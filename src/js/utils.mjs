// wrapper for querySelector...returns matching element
export function qs(selector, parent = document) {
  return parent.querySelector(selector);
}
// or a more concise version if you are into that sort of thing:
// export const qs = (selector, parent = document) => parent.querySelector(selector);

// retrieve data from localstorage
export function getLocalStorage(key) {
  return JSON.parse(localStorage.getItem(key));
}
// save data to local storage
export function setLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}
// set a listener for both touchend and click
export function setClick(selector, callback) {
  qs(selector).addEventListener('touchend', (event) => {
    event.preventDefault();
    callback();
  });
  qs(selector).addEventListener('click', callback);
}

// Function to update the cart counter
export function updateCartCount(cartKey = 'so-cart') {
  const cartCountSpan = document.querySelector('.cart-count');
  const cartItems = JSON.parse(localStorage.getItem(cartKey));
  if (!cartItems || cartItems.length === 0) {
    cartCountSpan.textContent = 0;
    return; // Agregar un return para salir de la función si no hay elementos en el carrito
  }
  const totalItems = cartItems.length;
  cartCountSpan.textContent = totalItems;
}

export function alertMessage(message, background = 'blue', color = 'black', permanent = false , scroll = true, duration = 3000) {
  const alert = document.createElement('div');
  alert.classList.add('alert');
  alert.innerHTML = `<div style="background-color:${background}; color:${color}; padding:15px 10px; margin-top:10px; position:relative;">${message} <button style="position:absolute; top:0; right:0; background:none; border:none; cursor:pointer; color:${color}">X</button></div>`;

  alert.addEventListener('click', function (e) {
    if (e.target.tagName == 'BUTTON') {
      main.removeChild(this);
    }
  });
  const main = document.querySelector('main');
  main.prepend(alert);

  if (scroll) window.scrollTo(0, 0);

  if (!permanent) {
    setTimeout(function () {
      main.removeChild(alert);
    }, duration);
  }
}


export function removeAllAlerts() {
  const alerts = document.querySelectorAll('.alert');
  alerts.forEach((alert) => document.querySelector('main').removeChild(alert));
}

export function calculateDiscount(listPrice, finalPrice) {
  if (listPrice > finalPrice) {
    let discount = listPrice - finalPrice;
    let discountPercentage = ((discount / listPrice) * 100).toFixed(0);
    return 'Save' + discountPercentage +'%';
  }
  return 'Save 0%';
}