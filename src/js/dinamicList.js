import ProductData from './ProductData.mjs';

// Get the search term from the URL
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const searchTerm = urlParams.get('search'); // Get the value of the 'search' parameter

// Get the parent element where you want to add the product cards
const productList = document.getElementById('productsList');
const categoryName = document.getElementById('categoryName');
categoryName.innerText =
  searchTerm.charAt(0).toUpperCase() + searchTerm.slice(1).toLowerCase();

// Create an instance of ProductData and fetch products based on the search term
const productsData = new ProductData(searchTerm);

productsData
  .getData()
  .then((data) => {
    let products;

    switch (searchTerm) {
      case 'tents':
        products = data;
        break;

      case 'backpacks':
        products = data.Result;
        break;

      case 'sleeping-bags':
        products = data.Result;
        break;

      case 'hammocks':
        products = data.Result;
        break;

      default:
        products = data;
        break;
    }

    // Create an HTML string representing all the product cards
    const productCardsHTML = products
      .map((product) => {
        // Determine the image source based on the host and search term
        let imageSource;
        if (window.location.hostname === 'localhost') {
          imageSource =
            searchTerm !== 'tents'
              ? product.Images.PrimaryMedium
              : product.Image;
        } else {
          imageSource =
            searchTerm !== 'tents'
              ? product.Images.PrimaryMedium
              : product.ImageProduction;
        }

        return `
            <li class="product-card" id="${product.Id}">
                <a href="product_pages/index.html?category=${searchTerm}&Id=${product.Id}">
                    <img src="${imageSource}" alt="${product.Name}">
                    <h3 class="card__brand">${product.Brand.Name}</h3>
                    <h2 class="card__name">${product.Name}</h2>
                    <p class="product-card__price">$${product.ListPrice}</p>
                </a>
            </li>
        `;
      })
      .join('');

    // Add the generated HTML to the container element
    productList.innerHTML = productCardsHTML;
  })
  .catch((error) => {
    //console.error('Error fetching product data:', error);
  });
