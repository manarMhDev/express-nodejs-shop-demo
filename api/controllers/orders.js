const Order = require("../models/order");

exports.orders_get_all = (req, res, next) => {
  Order.find()
    .select("product quantity _id")
    .populate("product")
    .exec()
    .then((docs) => {
      const response = {
        count: docs.length,
        data: docs.map((doc) => {
          return {
            product: doc.product,
            quantity: doc.quantity,
            _id: doc._id,
            request: {
              type: "GET",
              url: "http://localhost:3000/products/" + doc._id,
            },
          };
        }),
      };
      res.status(200).json(response);
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
};
exports.orders_add_order = (req, res, next) => {
  const order = new Order({
    _id: new mongoose.Types.ObjectId(),
    product: req.body.product,
    quantity: req.body.quantity,
  });
  order
    .save()
    .then((result) => {
      console.log(result);
      res.status(201).json({
        data: {
          product: result.product,
          quantity: result.quantity,
          _id: result._id,
          request: {
            type: "GET",
            url: "http://localhost:3000/products/" + result._id,
          },
        },
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
};
exports.orders_get_order = (req, res, next) => {
  const id = req.params.orderId;
  Order.findById(id)
    .select("product quantity _id")
    .populate("product", "_id")
    .exec()
    .then((doc) => {
      if (doc)
        res.status(200).json({
          data: doc,
          request: {
            type: "GET",
            description: "to get all products",
            url: "http://localhost:3000/products",
          },
        });
      else
        res
          .status(404)
          .json({ message: "No valid entry found for provided ID" });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ message: err });
    });
};
exports.orders_delete_order = (req, res, next) => {
  const id = req.params.orderId;
  Order.deleteOne({ _id: id })
    .exec()
    .then((result) => {
      res.status(200).json({ data: result.acknowledged });
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
};
