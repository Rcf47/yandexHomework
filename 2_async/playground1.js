'use strict';

((global) => {
  const addTimeout = (fn) => {
    return () => {
      setTimeout(() => {
        fn();
      }, 100 * Math.random());
    };
  };

  const addRandomError = (fn, result) => {
    return () => {
      const isError = Math.random() <= 0.2;

      if (isError) {
        fn(new Error('Something went wrong'), null);
      } else {
        fn(null, result);
      }
    }
  }

  const getModifiedCallback = (fn, result) => {
    return addTimeout(addRandomError(fn, result));
  }

  class Entity {
    constructor(name, isActive) {
      this.getName = (callback) => {
        getModifiedCallback(callback, name)();
      };

      this.checkIsActive = (callback) => {
        getModifiedCallback(callback, isActive)();
      };
    }
  }

  class Category extends Entity {
    constructor(name, status, children) {
      super(name, status);

      this.getChildren = (callback) => {
        getModifiedCallback(callback, children)();
      };
    }
  }

  class Product extends Entity {
    constructor(name, status, price) {
      super(name, status);

      this.getPrice = (callback) => {
        getModifiedCallback(callback, price)();
      };
    }
  }

  global.Product = Product;
  global.Category = Category;
})(typeof window === 'undefined' ? global : window);

// решение задачи
const retryPromise = (fn) => new Promise((resolve, reject) => {
  const tryFn = async () => {
    try {
      const result = await fn();
      resolve(result);
    } catch (err) {
      setTimeout(tryFn, 1000);
    }
  };
  tryFn();
});

const getName = (obj) => retryPromise(() => new Promise((resolve, reject) => obj.getName((err, name) => err ? reject(err) : resolve(name))));
const checkIsActive = (obj) => retryPromise(() => new Promise((resolve, reject) => obj.checkIsActive((err, isActive) => err ? reject(err) : resolve(isActive))));
const getChildren = (obj) => retryPromise(() => new Promise((resolve, reject) => obj.getChildren((err, children) => err ? reject(err) : resolve(children))));
const getPrice = (obj) => retryPromise(() => new Promise((resolve, reject) => obj.getPrice((err, price) => err ? reject(err) : resolve(price))));

async function solution({ minPrice, maxPrice, catalog }) {
  const processObject = async (obj) => {
    const [name, isActive] = await Promise.all([
      getName(obj),
      checkIsActive(obj)
    ]);
    if (!isActive) {
      return [];
    }
    if (obj instanceof Product) {
      const price = await getPrice(obj);
      if (price >= minPrice && price <= maxPrice) {
        return [{ name, price }];
      } else {
        return [];
      }
    } else {
      const children = await getChildren(obj);
      const childArrays = await Promise.all(children.map(processObject));
      const childProducts = childArrays.flat();
      const activeChildProducts = childProducts.filter(p => p.price >= minPrice && p.price <= maxPrice);
      const sortedChildProducts = activeChildProducts.sort((a, b) => {
        if (a.price !== b.price) {
          return a.price - b.price;
        } else {
          return a.name.localeCompare(b.name);
        }
      });
      return sortedChildProducts;
    }
  };

  const products = await processObject(catalog);
  return products;
};

module.exports = solution
// проверка решения
const input = {
  minPrice: 300,
  maxPrice: 1500,
  catalog: new Category("Catalog", true, [
    new Category("Electronics", true, [
      new Category("Smartphones", true, [
        new Product("Smartphone 1", true, 1000),
        new Product("Smartphone 2", true, 900),
        new Product("Smartphone 3", false, 900),
        new Product("Smartphone 4", true, 900),
        new Product("Smartphone 5", true, 900)
      ]),
      new Category("Laptops", true, [
        new Product("Laptop 1", false, 1200),
        new Product("Laptop 2", true, 900),
        new Product("Laptop 3", true, 1500),
        new Product("Laptop 4", true, 1600)
      ]),
    ]),
    new Category("Books", true, [
      new Category("Fiction", false, [
        new Product("Fiction book 1", true, 350),
        new Product("Fiction book 2", false, 400)
      ]),
      new Category("Non-Fiction", true, [
        new Product("Non-Fiction book 1", true, 250),
        new Product("Non-Fiction book 2", true, 300),
        new Product("Non-Fiction book 3", true, 400)
      ]),
    ]),
  ])
}

const answer = [
  { name: "Non-Fiction book 2", price: 300 },
  { name: "Non-Fiction book 3", price: 400 },
  { name: "Laptop 2", price: 900 },
  { name: "Smartphone 2", price: 900 },
  { name: "Smartphone 4", price: 900 },
  { name: "Smartphone 5", price: 900 },
  { name: "Smartphone 1", price: 1000 },
  { name: "Laptop 3", price: 1500 }
];

solution(input).then(result => {
  const isAnswerCorrect = JSON.stringify(answer) === JSON.stringify(result);

  if (isAnswerCorrect) {
    console.log('OK');
  } else {
    console.log('WRONG');
  }
});
