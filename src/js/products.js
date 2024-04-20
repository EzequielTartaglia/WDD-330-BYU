const products = [
    {
      'brand': 'Marmots',
      'name': 'Ajax Tent - 3-Person, 3-Season',
      'price': '$199.99',
      'image': 'marmot-ajax-tent-3-person-3-season-in-pale-pumpkin-terracotta~p~880rr_01~320.jpg',
      'url': 'product_pages/marmot-ajax-3.html'
    },
    {
      'brand': 'The North Face',
      'name': 'Talus Tent - 4-Person, 3-Season',
      'price': '$199.99',
      'image': 'the-north-face-talus-tent-4-person-3-season-in-golden-oak-saffron-yellow~p~985rf_01~320.jpg',
      'url': 'product_pages/northface-talus-4.html'
    },
    {
      'brand': 'The North Face',
      'name': 'Alpine Guide Tent - 3-Person, 4-Season',
      'price': '$349.99',
      'image': 'the-north-face-alpine-guide-tent-3-person-4-season-in-canary-yellow-high-rise-grey~p~985pr_01~320.jpg',
      'url': 'product_pages/northface-alpine-3.html'
    },
    {
      'brand': 'Cedar Ridge',
      'name': 'Rimrock Tent - 2-Person, 3-Season',
      'price': '$69.99',
      'image': 'cedar-ridge-rimrock-tent-2-person-3-season-in-rust-clay~p~344yj_01~320.jpg',
      'url': 'product_pages/cedar-ridge-rimrock-2.html'
    }
  ]

  
  // Make the array inside the HTML
    const container = document.getElementById('product-container');
    let productListHTML = '';
  
    products.forEach(product => {
      productListHTML += `
        <li class="product-card" aria-label="${product.name} product">
          <a href="${product.url}" aria-label="Link to ${product.name} product">
            <img src="./images/tents/${product.image}" alt="${product.name}" aria-description="${product.description}">
            <h3 class="card__brand">${product.brand}</h3>
            <h2 class="card__name">${product.name}</h2>
            <p class="product-card__price">${product.price}</p>
          </a>
        </li>
      `;
    });
  
    container.innerHTML = productListHTML;
  

  