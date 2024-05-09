import { getLocalStorage, setLocalStorage } from './utils.mjs';
import ProductData from './ProductData.mjs';
import Alert from './ALert.mjs';

// Get the current URL
const currentUrl = new URL(window.location.href);
// Get the 'Id' parameter from the URL
const productId = currentUrl.searchParams.get('Id');
// Get the search term from the URL
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const searchTerm = urlParams.get('category'); // Get the value of the 'search' parameter

const dataSource = new ProductData(searchTerm);

function addProductToCart(product) {
  // Get the existing cart items from localStorage
  let cartItems = getLocalStorage('so-cart');

  // If cartItems is null or undefined, initialize it as an empty array
  if (!Array.isArray(cartItems)) {
    cartItems = [];
  }

  // Add the new product to the cart items array
  const cartProduct = {
    Id: product.Id,
    Name: product.Name,
    Image:
      searchTerm === 'tents'
        ? window.location.hostname === 'localhost'
          ? product.Image
          : product.ImageProduction
        : product.Images.PrimaryLarge,
    Price: product.ListPrice,
    Color: product.Colors[0].ColorName, // Assuming you want to include the color as well
    // Add more fields as needed
  };

  cartItems.push(cartProduct);

  // Save the updated cart items back to localStorage
  setLocalStorage('so-cart', cartItems);
}

// add to cart button event handler
async function addToCartHandler() {
  const product = await dataSource.findProductById(productId);
  addProductToCart(product);
}

// Function to generate and insert the inner HTML for the product
async function renderProductHTML() {
  // Find the current product by its ID
  const currentProduct = await dataSource.findProductById(productId);

  // Get the parent element where the product HTML will be inserted
  const productContainer = document.getElementById('productDetail');

  let imageSource;
  if (window.location.hostname === 'localhost') {
    imageSource =
      searchTerm !== 'tents'
        ? currentProduct.Images.PrimaryLarge
        : currentProduct.Image;
  } else {
    imageSource =
      searchTerm !== 'tents'
        ? currentProduct.Images.PrimaryLarge
        : currentProduct.ImageProduction;
  }

  // Create the HTML for the product
  const productHTML = `
    <h3>${currentProduct.Brand.Name}</h3>
    <h2 class="divider">${currentProduct.Name}</h2>
    <img class="divider" src="${imageSource}" alt="${currentProduct.Name}">
    <p class="product-card__price">$${currentProduct.ListPrice}</p>
    <p class="product__color">${currentProduct.Colors[0].ColorName}</p>
    <p class="product__description">${currentProduct.DescriptionHtmlSimple}</p>
  `;

  // Insert the product HTML into the parent element
  productContainer.innerHTML = productHTML;
}

// Call the function to generate and insert the product HTML
renderProductHTML();

document
  .getElementById('addToCart')
  .addEventListener('click', addToCartHandler);

  
// this code instaciat the alert modules and run it
const alertManager = new Alert();
alertManager.displayAlerts();
