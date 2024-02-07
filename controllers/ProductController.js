const Brand = require("../models/Brand");
const Category = require("../models/Category");
const Product = require("../models/product");

const createProduct = async (req, res) => {
  const {
    name,
    description,
    brand,
    category,
    sizes,
    colors,
    user,
    price,
    totalQty,
  } = req.body;
  const productExists = await Product.findOne({ name });
  if (productExists) {
    throw new Error("Product already exists");
  }
  // find the Category
  const categoryFound = await Category.findOne({ name:category});
  if (!categoryFound) {
    throw new Error("Category not found, please create category first or check category name");
  }
  // find the Brand
  const brandFound = await Brand.findOne({ name:brand.toLowerCase() });
  if (!brandFound) {
    throw new Error("brand not found, please create brand first or check brand name");
  }
  // create Product
  const product = await Product.create({
    name,
    description,
    brand,
    category,
    sizes,
    colors,
    user: req.userAuthID,
    price,
    totalQty,
  });
  //Push Product into Category
  categoryFound.products.push(product._id);
  //Save Category
  await categoryFound.save();
 //Push Product into brand
  brandFound.products.push(product._id);
  //Save Brand
  await brandFound.save();
  // Send Response
  res.status(201).json({
    status: "success",
    msg: "Product created successfully",
    product,
  });
};

const getAllProducts = async (req, res) => {
  // query
  let productquery = Product.find();
  //Search By Name
  if (req.query.name) {
    productquery = productquery.find({
      name: { $regex: req.query.name, $options: "i" },
    });
  }
  // filter By Brand
  if (req.query.brand) {
    productquery = productquery.find({
      brand: { $regex: req.query.brand, $options: "i" },
    });
  }
  // filter By Category
  if (req.query.category) {
    productquery = productquery.find({
      category: { $regex: req.query.category, $options: "i" },
    });
  }
  // filter By Color
  if (req.query.color) {
    productquery = productquery.find({
      colors: { $regex: req.query.color, $options: "i" },
    });
  }
  // filter By Size
  if (req.query.size) {
    productquery = productquery.find({
      sizes: { $regex: req.query.size, $options: "i" },
    });
  }
  // filter By Price
  if (req.query.price) {
    const priceRange = req.query.price.split("-");
    const minPrice = parseInt(priceRange[0]);
    const maxPrice = parseInt(priceRange[1]);

    productquery = productquery.find({
      price: { $gte: minPrice, $lte: maxPrice },
    });
  }

  // pagination
  // page
  const page = parseInt(req.query.page) || 1;
  // limit
  const limit = parseInt(req.query.limit) || 10;
  // startIndex
  const startIndex = (page - 1) * limit;
  // endIndex
  const endIndex = page * limit;
  // total
  const total = await Product.countDocuments();

  productquery = productquery.skip(startIndex).limit(limit);

  // pagination result
  const pagination = {};
  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit,
    };
  }
  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit,
    };
  }
  //await The query
  const products = await productquery.populate('reviews');
  res.status(200).json({
    status: "success",
    total,
    results: products.length,
    pagination,
    msg: "Products fetched successfully",
    products,
  });
};

const getSingleProduct = async (req, res) => {
  const product = await Product.findById(req.params.id).populate('reviews');
  if (!product) {
    throw new Error("Product not found");
  }
  res.status(200).json({
    status: "success",
    msg: "Product fetched successfully",
    product,
  });
};

const updateProduct = async (req, res) => {
  const {
    name,
    description,
    brand,
    category,
    sizes,
    colors,
    user,
    price,
    totalQty,
  } = req.body;
  const product = await Product.findByIdAndUpdate(
    req.params.id,
    {
      name,
      description,
      brand,
      category,
      sizes,
      colors,
      user,
      price,
      totalQty,
    },
    {
      new: true,
      runValidators: true,
    }
  );
  if (!product) {
    throw new Error("Product not found");
  }
  res.status(200).json({
    status: "success",
    msg: "Product updated successfully",
    product,
  });
};

const deleteProduct = async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) {
    throw new Error("Product not found");
  }
  res.status(200).json({
    status: "success",
    msg: "Product deleted successfully",
  });
}

module.exports = {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct
};
