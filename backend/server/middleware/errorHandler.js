const notFound = (req, res, next) => {
  res.status(404);
  next(new Error(`Not found - ${req.originalUrl}`));
};

const errorHandler = (err, req, res, next) => {
  const status = err.status || (res.statusCode === 200 ? 500 : res.statusCode);
  res.status(status).json({
    message: err.message || 'Server error'
  });
};

module.exports = { errorHandler, notFound };
