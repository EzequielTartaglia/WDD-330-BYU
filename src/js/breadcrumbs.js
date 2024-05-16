//need to have slightly different breadcrumb functions for the details and listing pages

export function displayProductListingBreadcrumbs(category, numProducts) {
    // create element to the breadcrumbs
    const breadcrumbs = document.createElement('div');
    // add a class to style the breadcrumbs
    breadcrumbs.classList.add('breadcrumbs');
  
    breadcrumbs.innerHTML = `<a href="../index.html">Home</a> &#8594; ${category} &#8594; (${numProducts} items)`;
  
    // add the breadcrumbs to the top of main, below the header
    const main = document.querySelector('main');
    main.prepend(breadcrumbs);
  }
  
  export function displayProductPageBreadcrumbs(product) {
    // create element to the breadcrumbs
    const breadcrumbs = document.createElement('div');
    // add a class to style the breadcrumbs
    breadcrumbs.classList.add('breadcrumbs');
  
    breadcrumbs.innerHTML = `<a href="../index.html">Home</a> &#8594; <a href="../product-listing/product.html?category=${product.Category}">${product.Category}</a> &#8594; ${product.Name}`;
  
    // add the breadcrumbs to the top of main, below the header
    const main = document.querySelector('main');
    main.prepend(breadcrumbs);
  }