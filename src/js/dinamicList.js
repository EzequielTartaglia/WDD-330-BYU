import ProductData from './ProductData.mjs';

// Get the parent element where you want to add the product cards
const productList = document.getElementById('productsList');

// Create an instance of ProductData and fetch the products
const productsData = new ProductData('tents');

productsData.getData().then(data => {
    const products = data; // Assign the result of the promise to the variable products

    // Create an HTML string representing all the product cards
    const productCardsHTML = products.map(product => {
        // Determine the image source based on the host
        const imageSource = window.location.hostname === 'localhost' ? product.Image : product.ImageProduction;

        return `
            <li class="product-card" id="${product.Id}">
                <a href="product_pages/product.html?Id=${product.Id}">
                    <img src="${imageSource}" alt="${product.Name}">
                    <h3 class="card__brand">${product.Brand.Name}</h3>
                    <h2 class="card__name">${product.Name}</h2>
                    <p class="product-card__price">$${product.ListPrice}</p>
                </a>
            </li>
        `;
    }).join('');

    // Add the generated HTML to the container element
    productList.innerHTML = productCardsHTML;
}).catch(error => {
    //console.error('Error fetching product data:', error);
});

