const express = require('express')
const app = express();
const bodyParser = require('body-parser');
const sequelize = require('./db/data-connection');
const productRoutes = require('./routes/product-routes');
const orderRoutes = require('./routes/order-routes');
const userRoutes = require('./routes/user-routes');
const Users = require('./db/user-model');

//Middleware
app.use(bodyParser.json())
app.use("/products", productRoutes);
app.use("/orders", orderRoutes);
app.use("/users", userRoutes);

sequelize.sync({ force: false })

sequelize.authenticate()
    .then(() => app.listen(3000, () => console.log('Server running on port 3000')))
    .catch((er) => console.log(er));