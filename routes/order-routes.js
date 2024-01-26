const Orders = require('../db/order-model');
const express = require('express')
const { validateToken } = require('../utils/authentication');
const router = express.Router();

router.post('/', validateToken, async (req, res) => {
    try {
        if (!req.body.productId) {
            res.status(400).send("productId must have a value.");
            return;
        }

        if (!req.body.quantity) {
            res.status(400).send("quantity must have a value.");
            return;
        }

        if (req.body.quantity <= 0) {
            res.status(400).send("quantity must be 1 or more");
            return;
        }

        let orderCreated = await Orders.create({
            productId: req.body.productId,
            quantity: req.body.quantity
        });

        res.status(201).send(orderCreated);
    } catch (error) {
        if (error.name == 'SequelizeForeignKeyConstraintError') {
            res.status(400).send(`productId: ${req.body.productId} does not exist`);
            return;
        }

        console.log(error);
        res.status(500).send(`Internal Server Error ${error}`)
    }
})

module.exports = router;