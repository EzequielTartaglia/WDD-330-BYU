// wrapper for querySelector...returns matching element
export function qs(selector, parent = document) {
  return parent.querySelector(selector);
}
// or a more concise version if you are into that sort of thing:
// export const qs = (selector, parent = document) => parent.querySelector(selector);

// retrieve data from localstorage
export function getLocalStorage(key) {
  return JSON.parse(localStorage.getItem(key));
}
// save data to local storage
export function setLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}
// set a listener for both touchend and click
export function setClick(selector, callback) {
  qs(selector).addEventListener('touchend', (event) => {
    event.preventDefault();
    callback();
  });
  qs(selector).addEventListener('click', callback);
}


//week3 update making dinamic header and footer


// function to take an optional object and a template and insert the objects as HTML into the DOM
export function renderWithTemplate(template, parentElement, data, callback) {
  const content = template.content.cloneNode(true); // Clone the content of the template
  parentElement.appendChild(content); // Append the cloned content to the parent element

  //if there is a callback...call it and pass data
  if (callback) {
    callback(data);
  }
}



export async function loadTemplate(path) {
  const html = await fetch(path).then(convertToText);
  const template = document.createElement('template');
  template.innerHTML = html;
  return template;
}



// this code ensure that the covert to text is well done
export async function convertToText(response) {
  return response.text();
}



 // function to dynamically load the header and footer into a page and  catch error

export async function loadHeaderFooter() {
  try {
    const headerTemplate = await loadTemplate("../public/partials/header.html");
    const headerElement = document.querySelector("#main-header");
    const footerTemplate = await loadTemplate("../public/partials/footer.html");
    const footerElement = document.querySelector("#main-footer");

    renderWithTemplate(headerTemplate, headerElement);
    renderWithTemplate(footerTemplate, footerElement);
  } catch (error) {
    console.error("Error loading header/footer:", error);
  }
}