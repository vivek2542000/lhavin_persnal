const ITEMS_PER_PAGE = 4;

exports.getIndex = (req, res, next) => {
  // start constants
  const page = +req.query.page || 1; // pagination
  let totalItems; // pagination
  // end constants

  Hotel.find()
    .countDocuments()
    .then((numberOfProducts) => {
      totalItems = numberOfProducts;
      return Hotel.find()
        .skip((page - 1) * ITEMS_PER_PAGE)
        .limit(ITEMS_PER_PAGE);
    })
    .then((hotels) => {
      res.render("pages/hotel", {
        hotels: hotels,
        currentPage: page,
        hasNextPage: ITEMS_PER_PAGE * page < totalItems,
        hasPreviousPage: page > 1,
        nextPage: page + 1,
        previousPage: page - 1,
        lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE),
      });
    })
    .catch((err) => {
      console.log(err);
    });
};
