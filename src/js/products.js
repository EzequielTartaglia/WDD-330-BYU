// Función para cargar el JSON desde un archivo externo
async function loadProducts() {
    try {
        // Hacer la solicitud para obtener el archivo products.json
        const response = await fetch('./json/products.json');

        // Verificar si la solicitud fue exitosa (código de estado 200)
        if (!response.ok) {
            throw new Error('Failed to load products');
        }

        // Parsear el JSON del cuerpo de la respuesta
        const products = await response.json();

        // Llamar a la función para generar la lista de productos con el array cargado
        generateProductList(products);
    } catch (error) {
        throw new Error('Error loading products:', error.message);
    }
}

// Función para generar el HTML de la lista de productos
function generateProductList(products) {
    const container = document.getElementById('product-container');
    let productListHTML = '';

    products.forEach(product => {
        productListHTML += `
        <li class="product-card">
                <a href="${product.url}">
                    <img src="${product.image}" alt="${product.name}">
                    <h3 class="card__brand">${product.brand}</h3>
                    <h2 class="card__name">${product.name}</h2>
                    <p class="product-card__price">${product.price}</p>
                </a>
        </li>
        `;
    });

    container.innerHTML = productListHTML;
}

// Llama a la función para cargar el JSON y generar la lista de productos al cargar la página
loadProducts();
