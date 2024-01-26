const Users = require('../db/user-model');
const validator = require('validator');
const bcrypt = require('bcrypt');
const express = require('express')
const { createToken } = require('../utils/authentication');
const router = express.Router();

router.post('/', async (req, res) => {
    try {
        if (!req.body.firstName) {
            res.status(400).send("FirstName must exist");
            return;
        }
        if (!req.body.lastName) {
            res.status(400).send("LastName must exist");
            return;
        }
        if (!req.body.email) {
            res.status(400).send("Email must exist");
            return;
        }
        if (!validator.isEmail(req.body.email)) {
            res.status(400).send("Email is not an valid email format");
            return;
        }
        if (!req.body.password) {
            res.status(400).send("Password must exist");
            return;
        }

        const userToCreate = {
            first_name: req.body.firstName,
            last_name: req.body.lastName,
            email: req.body.email,
            password: req.body.password 
        };

        const createdUser = await Users.create(userToCreate);

        createdUser.password = undefined;

        res.status(201).send(createdUser);
    } catch (error) {
        
        console.log(error);
        res.status(500).send(`Internal Server Error ${error}`);
    }
})

router.post('/login', async (req, res) => {
    try {
        if (!req.body.username) {
            res.status(400).send("Username must exist");
            return;
        }
        if (!req.body.password) {
            res.status(400).send("Password must exist");
            return;
        }

        const userFromDb = await Users.findOne({
            where: {
                email: req.body.username
            }
        })
        
        let dbPassword = userFromDb?.password;
        if (!dbPassword) {
            dbPassword = "";
        }

        const validPassword = await bcrypt.compare(req.body.password, dbPassword);
        if (!validPassword) {
            res.status(400).send("Invalid Credentials");
            return;
        }
        
        const token = createToken(userFromDb);

        res.send(token);
        
    } catch (error) {

        console.log(error);
        res.status(500).send(`Internal Server Error ${error}`);
    }
})

module.exports = router;