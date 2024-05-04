function convertToJson(res) {
  if (res.ok) {
    return res.json();
  } else {
    throw new Error('Bad Response');
  }
}

export default class ProductData {
  constructor(category) {
    this.category = category;
    this.path = `https://raw.githubusercontent.com/EzequielTartaglia/WDD-330-BYU/main/src/json/${this.category}.json`;
  }

  getData() {
    return fetch(this.path)
      .then(convertToJson)
      .then((data) => data);
  }

  async findProductById(id) {
    const products = await this.getData();
    if (this.category !== 'tents') {
      return products.Result.find((item) => item.Id === id);
    } else {
      return products.find((item) => item.Id === id);
    }
  }
}
