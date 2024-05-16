import ProductData from './ProductData.mjs';
import { getLocalStorage, setLocalStorage, updateCartCount, alertMessage } from './utils.mjs';

// Get the search term from the URL
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const searchTerm = urlParams.get('search'); // Get the value of the 'search' parameter
const sortingSelector = document.getElementById('sortingSelector')

// Función para agregar un producto al carrito
function addProductToCart(product) {
  // Obtiene los elementos del carrito del localStorage
  let cartItems = getLocalStorage('so-cart');

  // Inicializa el carrito como un array vacío si no hay elementos
  if (!Array.isArray(cartItems)) {
    cartItems = [];
  }

  // Agrega el nuevo producto al carrito
  const cartProduct = {
    Id: product.Id,
    Name: product.Name,
    Image: product.Images.PrimaryLarge,
    FinalPrice: parseFloat(product.FinalPrice),
    Color: product.Colors[0].ColorName,
    // Agrega más campos si es necesario
  };

  cartItems.push(cartProduct);
  alertMessage(`${product.NameWithoutBrand} added to cart!`);

  // Guarda los elementos actualizados del carrito en el localStorage
  setLocalStorage('so-cart', cartItems);
  updateCartCount();

  // Agrega la clase "added" al icono del carrito
  const cartIcon = document.querySelector('.cart-icon svg');
  cartIcon.classList.add('added');

  // Quita la clase "added" después de un corto tiempo
  setTimeout(() => {
    cartIcon.classList.remove('added');
  }, 500);
}

// Función que maneja el evento de hacer clic en "Add to Cart"
async function addToCartHandler(productId) {
  const dataSource = new ProductData(); // No necesitamos el término de búsqueda aquí
  const product = await dataSource.findProductById(productId);
  addProductToCart(product);
}

// Manejador de eventos para el clic en "Add to Cart"
function handleAddToCartClick(event) {
  const productId = event.target.dataset.productId;
  addToCartHandler(productId);
}

// Obtén todos los botones "Add to Cart" y agrega el manejador de eventos a cada uno
const addToCartButtons = document.querySelectorAll('.product-card button');
addToCartButtons.forEach(button => {
  button.addEventListener('click', handleAddToCartClick);
});

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
                <button id="addToCart" data-product-id="${product.Id}">Add to Cart</button>
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
              <button id="addToCart" data-product-id="${product.Id}">Add to Cart</button>
          </a>
      </li>
  `;
}
