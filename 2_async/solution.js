module.exports = async function({ minPrice, maxPrice, catalog }) {
  const processObject = async (obj) => {
    const [name, isActive] = await Promise.all([
      new Promise((resolve, reject) => obj.getName((err, name) => err ? reject(err) : resolve(name))),
      new Promise((resolve, reject) => obj.checkIsActive((err, isActive) => err ? reject(err) : resolve(isActive)))
    ]);
    if (!isActive) {
      return [];
    }
    if (obj instanceof Product) {
      const price = await new Promise((resolve, reject) => obj.getPrice((err, price) => err ? reject(err) : resolve(price)));
      if (price >= minPrice && price <= maxPrice) {
        return [{ name, price }];
      } else {
        return [];
      }
    } else {
      const children = await new Promise((resolve, reject) => obj.getChildren((err, children) => err ? reject(err) : resolve(children)));
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
