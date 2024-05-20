import ProductData from './ProductData.mjs';
import { calculateDiscount } from './utils.mjs';

document.addEventListener('DOMContentLoaded', function() {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const searchTerm = urlParams.get('search'); // Get the value of the 'search' parameter
  const sortingSelector = document.getElementById('sortingSelector');
  const productList = document.getElementById('productsList');
  const categoryName = document.getElementById('categoryName');

  if (searchTerm) {
    categoryName.innerText = searchTerm.charAt(0).toUpperCase() + searchTerm.slice(1).toLowerCase();
    sortingSelector.classList.remove('hide');

    const productsData = new ProductData(searchTerm);

    productsData.getData().then((data) => {
      let products;
      switch (searchTerm) {
        case 'tents':
          products = data;
          break;
        case 'backpacks':
        case 'sleeping-bags':
        case 'hammocks':
          products = data.Result;
          break;
        default:
          products = data;
          break;
      }

      const sortByPrice = (ascending) => {
        products.sort((a, b) => ascending ? a.ListPrice - b.ListPrice : b.ListPrice - a.ListPrice);
      };

      const sortByName = (ascending) => {
        products.sort((a, b) => {
          const nameA = a.Name.toUpperCase();
          const nameB = b.Name.toUpperCase();
          if (nameA < nameB) return ascending ? -1 : 1;
          if (nameA > nameB) return ascending ? 1 : -1;
          return 0;
        });
      };

      const renderProductCards = () => {
        productList.innerHTML = products.map(createProductCardHTML).join('');
      };

      sortByName(true);
      renderProductCards();

      document.getElementById('sortingOptions').addEventListener('change', (event) => {
        switch (event.target.value) {
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
        }
        renderProductCards();
      });

      function createProductCardHTML(product) {
        const discountInfo = calculateDiscount(product.ListPrice, product.FinalPrice);
        const imageSource = (window.location.hostname === 'localhost') ? 
                            (searchTerm !== 'tents' ? product.Images.PrimaryMedium : product.Image) :
                            (searchTerm !== 'tents' ? product.Images.PrimaryMedium : product.ImageProduction);

        return `
          <li class="product-card" id="${product.Id}">
              <a href="product_pages/index.html?category=${searchTerm}&Id=${product.Id}">
                  <img src="${imageSource}" alt="${product.Name}">
                  <h3 class="card__brand">${product.Brand.Name}</h3>
                  <h2 class="card__name">${product.Name}</h2>
                  <p class="product-card__price">$${product.ListPrice}</p>
                  ${discountInfo ? `<p class="product-discount">${discountInfo}</p>` : ''}
              </a>
              <button class="add-to-cart">Add to Cart</button>
              <button class="quick-view" data-product-id="${product.Id}">Quick View</button>
          </li>
        `;
      }

      // Event delegation for Quick View buttons
      productList.addEventListener('click', (event) => {
        if (event.target.classList.contains('quick-view')) {
          const productId = event.target.getAttribute('data-product-id');
          const product = products.find(p => p.Id === productId);
          if (product) {
            showModal(product);
          }
        }
      });

      function showModal(product) {
        const modal = document.getElementById('quickViewModal');
        const modalContent = document.getElementById('modalContent');

        const imageSource = (window.location.hostname === 'localhost') ? 
                            (searchTerm !== 'tents' ? product.Images.PrimaryMedium : product.Image) :
                            (searchTerm !== 'tents' ? product.Images.PrimaryMedium : product.ImageProduction);

        modalContent.innerHTML = `
          <span class="close" id="closeModal">&times;</span>
          <img src="${imageSource}" alt="${product.Name}">
          <h2>${product.Name}</h2>
          <h3>Brand: ${product.Brand.Name}</h3>
          <p>Price: $${product.ListPrice}</p>
          ${calculateDiscount(product.ListPrice, product.FinalPrice) ? `<p>Discount: ${calculateDiscount(product.ListPrice, product.FinalPrice)}</p>` : ''}
          <p>Description: ${product.Description || 'No description available'}</p>
        `;

        modal.style.display = 'block';

        document.getElementById('closeModal').addEventListener('click', () => {
          modal.style.display = 'none';
        });
      }

      window.addEventListener('click', (event) => {
        const modal = document.getElementById('quickViewModal');
        if (event.target === modal) {
          modal.style.display = 'none';
        }
      });
    }).catch((error) => {
      console.error('Error fetching product data:', error);
    });
  }

  document.getElementById('newsletterForm').addEventListener('submit', function(event) {
    event.preventDefault();
    document.getElementById('newsletterMsg').innerText = 'Thank you for subscribing!';
  });

  if (!getCookie('visited')) {
    document.getElementById('welcomeBanner').style.display = 'block';
    setCookie('visited', 'yes', 30);
  }

  document.getElementById('registerButton').addEventListener('click', showRegistrationForm);
  document.getElementById('closeButton').addEventListener('click', closeRegistrationForm);
  document.getElementById('regForm').addEventListener('submit', handleFormSubmit);
});

function showRegistrationForm() {
  document.getElementById('welcomeBanner').classList.add('hidden');
  setTimeout(() => {
    document.getElementById('welcomeBanner').style.display = 'none';
    document.getElementById('registrationForm').style.display = 'block';
  }, 500);
}

function closeRegistrationForm() {
  document.getElementById('registrationForm').style.display = 'none';
}

function handleFormSubmit(event) {
  event.preventDefault();
  document.getElementById('registrationForm').style.display = 'none';
  document.getElementById('thankYouMessage').style.display = 'block';
}

function setCookie(name, value, days) {
  let expires = '';
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    expires = `; expires=${date.toUTCString()}`;
  }
  document.cookie = `${name}=${value || ''}${expires}; path=/`;
}

function getCookie(name) {
  const nameEQ = `${name}=`;
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}