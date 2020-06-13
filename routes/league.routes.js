const { Router } = require("express");
const router = Router();
const config = require("config");
const request = require("request");
const token = config.get("token");
const League = require("../models/league");

router.get("/leagues", (req, res) => {
    const url = `https://api.betsapi.com/v1/league?token=${token}&sport_id=1&page=${req.query.page}`;

    request(url, async (error, response, body) => {
        if (error || response.statusCode !== 200) {
            res.json(error);
        }
        let data = JSON.parse(body);

        if (data.success === 0) {
            res.status(500).json({
                message: data.error,
            });
            return;
        }

        data.results.map(async item => {
            let league = new League({
                id: item.id,
                name: item.name,
                cc: item.cc,
            })

            const candidate = await League.findOne({
                id: league.id
            });

            if (candidate) {
                return res.status(409).json({ message: "League already exists" });
            }

            await league.save();

        })

        res.json(data);
    });
});


module.exports = router;