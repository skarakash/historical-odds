const { Router } = require("express");
const router = Router();
const bcrypt = require("bcryptjs");
const { check, validationResult } = require("express-validator");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const config = require("../config/default.json");

router.post(
    "/register",
    [
        check("email", "Email is not valid").isEmail(),
        check("password", "Min password lenght is 6").isLength({ min: 6 }),
    ],
    async (req, res) => {
        console.log(req.body);
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty) {
                return res.status(400).json({
                    errors: errors.array(),
                    message: "Not valid data",
                });
            }

            const { email, password } = req.body;

            const candidate = await User.findOne({ email });

            if (candidate) {
                return res.status(400).json({ message: "User already exists" });
            }

            const hashedPassword = await bcrypt.hash(password, 12);

            const user = new User({ email, password: hashedPassword });

            await user.save();
            res.status(201).json({ message: "User created" });
        } catch (error) {
            res.status(500).json({
                message: error.message,
            });
        }
    }
);

router.post(
    "/login",
    [
        check("email", "Email is not valid").isEmail(),
        check("password", "Combination of such password and email is not found")
            .exists(),
    ],
    async (req, res) => {

        try {
            const errors = validationResult(req);

            if (!errors.isEmpty) {
                return res.status(400).json({
                    errors: errors.array(),
                    message: "Not valid data",
                });
            }

            const { email, password } = req.body;

            const user = await User.findOne({ email });

            if (!user) {
                return res.status(400).json({ message: "User is not found" });
            }

            const isMatching = await bcrypt.compare(password, user.password);

            if (!isMatching) {
                return res.status(400).json({
                    message:
                        "Combination of such password and email is not found",
                });
            }

            const token = jwt.sign(
                { userId: user.id },
                config.jwtSecret,
                { expiresIn: "1h" }
            );

            res.json({ token, userId: user.id });
        } catch (error) {
            res.status(500).json({
                message: error.message,
            });
        }
    }
);

module.exports = router;
