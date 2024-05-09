// ProductList.mjs RKippins

// Import ProductData class from ProductData.mjs
import ProductData from './ProductData.mjs';

// Define the ProductList class
export default class ProductList {
  constructor(category) {
    this.category = category;
    this.productData = new ProductData(category);
    this.productListElement = document.getElementById('productsList'); // Updated this line
  }

  async init() {
    try {
      // Fetch product data
      const productList = await this.productData.getData();

      // Render product list
      this.renderProductList(productList);
    } catch (error) {
      console.error('Error fetching product data:', error);
    }
  }

  renderProductList(products) {
    const productCardsHTML = products.map(product => this.getProductCardHTML(product)).join('');
    this.productListElement.innerHTML = productCardsHTML;
  }

  getProductCardHTML(product) {
    // Determine the image source based on the host
    const imageSource = window.location.hostname === 'localhost' ? product.Image : product.ImageProduction;
    return `
      <li class="product-card" id="${product.Id}">
        <a href="product_pages/index.html?Id=${product.Id}">
          <img src="${imageSource}" alt="${product.Name}">
          <h3 class="card__brand">${product.Brand.Name}</h3>
          <h2 class="card__name">${product.Name}</h2>
          <p class="product-card__price">$${product.ListPrice}</p>
        </a>
      </li>
    `;
  }
}
