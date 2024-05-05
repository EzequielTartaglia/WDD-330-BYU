import ProductData from "./ProductData.mjs";
import ProductList from "./ProductList.mjs";
import { getCartCount } from "./cart.js";

// Define the category
const category = "Tents";

// Create a new ProductData instance with the category
const dataSource = new ProductData(category);

// Get the element where the product list will be rendered
const productListElement = document.getElementById("productsList");

// Instantiate ProductList with the category and product data source
const productList = new ProductList(category);

// Initialize the product list
productList.init();
