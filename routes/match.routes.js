const { Router } = require("express");
const router = Router();
const Match = require("../models/match");
const config = require("config");
const request = require('request');
const { getFilteredEventView, getFilteredEventOdds } = require("../utils/utils")


const token = config.get("token")



router.post('/ended', (req, res) => {
    const url = `https://api.betsapi.com/v2/events/ended?sport_id=1&token=${token}&day=${req.body.day}&league_id=${req.body.league_id}`

    request(url, (error, response, body) => {
        if (error || response.statusCode !== 200) {
            res.json(error)
        }
        let data = JSON.parse(body);

        if (data.success === 0) {
            res.status(500).json({
                message: data.error,
            });
            return
        }


        data = data.results.map(m => m.id)

        res.json(data);
    })
});


router.get('/eventview', (req, res) => {
    const eventView = new Promise((resolve, reject) => {
        const url = `https://api.betsapi.com/v1/event/view?token=${token}&event_id=${req.query.event_id}`;
        request(
            { url },
            (error, response, body) => {
                if (error || response.statusCode !== 200) {
                    res.json(reject(error))
                }
                resolve(JSON.parse(body));
            }
        )
    });

    const eventOdds = new Promise((resolve, reject) => {
        const url = `https://api.betsapi.com/v2/event/odds?token=${token}&event_id=${req.query.event_id}&source=bet365&odds_market=1`;
        request(
            { url },
            (error, response, body) => {
                if (error || response.statusCode !== 200) {
                    res.json(reject(error))
                }
                resolve(JSON.parse(body));
            }
        )
    });


    Promise.all([eventView, eventOdds]).then(async (values) => {
        let [eventView, eventOdds] = values;
        eventView = getFilteredEventView(eventView.results);


        eventOdds = getFilteredEventOdds(eventOdds.results.odds["1_1"]);

        if (!eventOdds) {
            res.status(400).json({ message: "Match has no odds information" });
            return
        }
        let eventData = { ...eventView, ...eventOdds }


        const match = new Match({
            match_id: eventData.match_id,
            league: eventData.league,
            round: eventData.round,
            home: eventData.home,
            away: eventData.away,
            ht_score: {
                home: eventData.ht_score.home,
                away: eventData.ht_score.away,
            },
            ft_score: {
                home: eventData.ft_score.home,
                away: eventData.ft_score.away,
            },
            over: eventData.over,
            btts: eventData.btts,
            fhg: eventData.fhg,
            outcome: eventData.outcome,
            opening: eventData.opening,
            kickoff: eventData.kickoff,
        });


        if (match.ft_score.home == undefined) {
            res.status(400).json({ message: "Match has no score information" });
            return
        }

        const candidate = await Match.findOne({
            match_id: eventData.match_id
        });

        if (candidate) {
            return res.status(409).json({ message: "Match already exists" });
        }

        // await match.save();

        res.json(eventData)
    })



});

module.exports = router;
