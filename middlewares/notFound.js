const notFound = (req, res, next) => {
  const err = new Error(`Route ${req.originalUrl} Not Found`);
  next(err);
};

module.exports = notFound;
