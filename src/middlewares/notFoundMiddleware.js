const notFoundHandler = (req, res, next) => {
  res.status(404).json({
    message: "Resource not found",
  });
};

export default notFoundHandler;
