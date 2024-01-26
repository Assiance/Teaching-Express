const Products = require('../db/product-model');
const express = require('express')
const { validateToken } = require('../utils/authentication');
const router = express.Router();
// Get all products
router.get('/', validateToken, async (req, res) => {
    try {
        const products = await Products.findAll();
        res.send(products);
    } catch (error) {
        console.log(error);
        res.status(500).send(`Internal Server Error ${error}`)
    }
})

router.get('/:productId', validateToken, async (req, res) => {
    try {
        const productToFind = await Products.findByPk(req.params.productId);
        if (!productToFind) {
            res.status(404).send(`product not found.`);
            return;
        }

        res.send(productToFind);
    } catch (error) {
        console.log(error);
        res.status(500).send(`Internal Server Error ${error}`)
    }
});

router.post('/', validateToken, async (req, res) => {
    try {
        if (!req.body.name) {
            res.status(400).send("name must have a value.");
            return;
        }

        if (!req.body.price) {
            res.status(400).send("price must have a value");
            return;
        }

        if (req.body.price < 1) {
            res.status(400).send("price must be $1 or greater");
            return;
        }

        let createdProduct = await Products.create({
            name: req.body.name,
            description: req.body.description,
            price: req.body.price
        });

        res.status(201).send(createdProduct);

    } catch (error) {
        if (error.name == 'SequelizeUniqueConstraintError') {
            res.status(400).send(`name: ${req.body.name} already exists`);
            return;
        }

        res.status(500).send(`Internal Server Error ${error}`)
    }
});

router.post('/batch', validateToken, async (req, res) => {
    try {
        let products = req.body;
        
        let createdProducts = [];
        let failedProducts = [];
        for(let i = 0; i < products.length; i++) {
            if (!products[i].name) {
                failedProducts.push({ 
                    name: "NO-NAME-PROVIDED",
                    statusCode: 400,
                    reason: "name must have a value."
                });
                continue;
            }
    
            if (!products[i].price) {
                failedProducts.push({ 
                    name: products[i].name,
                    statusCode: 400,
                    reason: "price must have a value"
                });
                continue;
            }
    
            if (products[i].price < 1) {
                failedProducts.push({ 
                    name: products[i].name,
                    statusCode: 400,
                    reason: "price must be $1 or greater"
                });
                continue;
            }
            
            try {
                let createdProduct = await Products.create({
                    name: products[i].name,
                    description: products[i].description,
                    price: products[i].price
                });

                createdProducts.push(createdProduct);
            } catch (error) {
                if (error.name == 'SequelizeUniqueConstraintError') {
                    failedProducts.push({ 
                        name: products[i].name,
                        statusCode: 400,
                        reason: `name: ${products[i].name} already exists`
                    });
                }
                else {
                    throw error;
                }
            }
        }

        res.status(201).send({
            createdProducts: createdProducts,
            failedProducts: failedProducts
        });

    } catch (error) {
        res.status(500).send(`Internal Server Error ${error}`)
    }
});

router.put('/:productId', validateToken, async (req, res) => {
    try {
        if (!req.body.name) {
            res.status(400).send("name must have a value.");
            return;
        }

        if (!req.body.price) {
            res.status(400).send("price must have a value");
            return;
        }

        if (req.body.price < 1) {
            res.status(400).send("price must be $1 or greater");
            return;
        }

        const productToFind = await Products.findByPk(req.params.productId);

        if (!productToFind) {
            res.status(404).send("product not found.");
            return;
        }

        productToFind.name = req.body.name;

        await productToFind.save();

        res.send();
    } catch (error) {
        console.log(error);
        res.status(500).send(`Internal Server Error ${error}`)
    }
});

router.delete('/:productId', validateToken, async (req, res) => {
    try {
        const productToDelete = await Products.findByPk(req.params.productId);

        if (productToDelete) {
            await productToDelete.destroy();
        }

        res.send();
    } catch (error) {
        console.log(error);
        res.status(500).send(`Internal Server Error ${error}`)
    }
})

module.exports = router;