import { getLocalStorage, setLocalStorage } from './utils.mjs';

function convertToJson(res) {
  if (res.ok) {
    return res.json();
  } else {
    throw new Error('Bad Response');
  }
}

async function getProductById(id) {
  const path = `../json/tents.json`; // Ruta del archivo JSON
  try {
    const response = await fetch(path);
    const data = await convertToJson(response);
    const product = data.find(item => item.Id === id);
    if (!product) {
      throw new Error('Product not found');
    }
    return product;
  } catch (error) {
    console.error('Error fetching product data:', error);
    throw error;
  }
}

function addProductToCart(product) {
  let cartItems = getLocalStorage('so-cart');
  if (!Array.isArray(cartItems)) {
    cartItems = [];
  }
  cartItems.push(product);
  setLocalStorage('so-cart', cartItems);
}

async function addToCartHandler(e) {
  const productId = e.target.dataset.id;
  try {
    const product = await getProductById(productId);
    addProductToCart(product);
  } catch (error) {
    console.error('Error adding product to cart:', error);
  }
}

document.getElementById('addToCart').addEventListener('click', addToCartHandler);
