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

module.exports = async function({ minPrice, maxPrice, catalog }) {
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

  const answer = await processObject(catalog);
  return answer;
};
