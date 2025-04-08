const { faker, simpleFaker } = require("@faker-js/faker");
const fs = require("fs");
// or, if desiring a different locale
// import { fakerDE as faker } from '@faker-js/faker';

const randomCategoryList = (n) => {
  if (n <= 0) return [];
  const categories = [];
  // loop and push category
  for (let i = 0; i < n; i++) {
    const category = {
      id: simpleFaker.string.uuid(),
      name: faker.commerce.department(),
      createdAt: Date.now().valueOf(),
      updatedAt: Date.now().valueOf(),
    };
    categories.push(category);
  }
  return categories;
};

const randomProductList = (categoryList, numberOfProducts) => {
  if (numberOfProducts <= 0) return [];
  const productList = [];
  // Random data
  for (const category of categoryList) {
    for (let i = 0; i < numberOfProducts; i++) {
      const product = {
        categoryId: category.id,
        id: simpleFaker.string.uuid(),
        name: faker.commerce.productName(),
        color: faker.color.human(),
        price: faker.commerce.price(),
        description: faker.commerce.productDescription(),
        createdAt: Date.now().valueOf(),
        updatedAt: Date.now().valueOf(),
        thumbnail: faker.image.url(400, 400),
      };
      productList.push(product);
    }
  }
  return productList;
};

// IIFE
(() => {
  // random data
  const categories = randomCategoryList(5);
  const products = randomProductList(categories, 5);
  const db = {
    categories: categories,
    products: products,
    profile: {
      name: "Po",
    },
  };


  fs.writeFileSync("db.json", JSON.stringify(db, null, 2));
})();
