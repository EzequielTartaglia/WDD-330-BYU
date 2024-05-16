import ProductData from './src/js/ProductData.mjs';


// Get the search term from the URL
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const searchTerm = urlParams.get('search'); // Get the value of the 'search' parameter
const sortingSelector = document.getElementById('sortingSelector')

// Get the parent element where you want to add the product cards
const productList = document.getElementById('productsList');
const categoryName = document.getElementById('categoryName');
categoryName.innerText =  searchTerm.charAt(0).toUpperCase() + searchTerm.slice(1).toLowerCase();

//Show sortingSelector when a category is displayed
categoryName.innerText !==  '' && sortingSelector.classList.remove('hide')

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

    // Function to sort products by price
    const sortByPrice = (ascending) => {
      products.sort((a, b) => {
        if (ascending) {
          return a.ListPrice - b.ListPrice;
        } else {
          return b.ListPrice - a.ListPrice;
        }
      });
    };

    // Function to sort products by name
    const sortByName = (ascending) => {
      products.sort((a, b) => {
        const nameA = a.Name.toUpperCase();
        const nameB = b.Name.toUpperCase();
        if (ascending) {
          if (nameA < nameB) return -1;
          if (nameA > nameB) return 1;
          return 0;
        } else {
          if (nameA > nameB) return -1;
          if (nameA < nameB) return 1;
          return 0;
        }
      });
    };

    // Initial sorting by name (ascending)
    sortByName(true);

    // Change event
    document
      .getElementById('sortingOptions')
      .addEventListener('change', (event) => {
        const selectedOption = event.target.value;

        // Switch the sorting
        switch (selectedOption) {
          case 'priceAsc':
            sortByPrice(true);
            break;
          case 'priceDesc':
            sortByPrice(false);
            break;
          case 'nameAsc':
            sortByName(true);
            break;
          case 'nameDesc':
            sortByName(false);
            break;
          default:
            break;
        }

        // Render the sorted list
        const sortedProductCardsHTML = products
          .map((product) => createProductCardHTML(product))
          .join('');
        productList.innerHTML = sortedProductCardsHTML;
      });
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

    // Add event listeners for sorting options
    document.getElementById('sortByPriceAsc').addEventListener('click', () => {
      sortByPrice(true);
      const sortedProductCardsHTML = products
        .map((product) => createProductCardHTML(product))
        .join('');
      productList.innerHTML = sortedProductCardsHTML;
    });

    document.getElementById('sortByPriceDesc').addEventListener('click', () => {
      sortByPrice(false);
      const sortedProductCardsHTML = products
        .map((product) => createProductCardHTML(product))
        .join('');
      productList.innerHTML = sortedProductCardsHTML;
    });

    document.getElementById('sortByNameAsc').addEventListener('click', () => {
      sortByName(true);
      const sortedProductCardsHTML = products
        .map((product) => createProductCardHTML(product))
        .join('');
      productList.innerHTML = sortedProductCardsHTML;
    });

    document.getElementById('sortByNameDesc').addEventListener('click', () => {
      sortByName(false);
      const sortedProductCardsHTML = products
        .map((product) => createProductCardHTML(product))
        .join('');
      productList.innerHTML = sortedProductCardsHTML;
    });
  })
  .catch((error) => {
    //console.error('Error fetching product data:', error);
  });

// Function to create product card HTML
function createProductCardHTML(product) {
  // Determine the image source based on the host and search term
  let imageSource;
  if (window.location.hostname === 'localhost') {
    imageSource =
      searchTerm !== 'tents' ? product.Images.PrimaryMedium : product.Image;
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
}