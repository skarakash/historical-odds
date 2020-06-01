const { Schema, model } = require("mongoose");

const schema = new Schema({
    match_id: { type: String, required: true, unique: true },
    league: { type: String },
    round: { type: String },
    home: { type: String },
    away: { type: String },
    ht_score: {
        home: { type: Number },
        away: { type: Number },
    },
    ft_score: {
        home: { type: Number },
        away: { type: Number },
    },
    over: { type: String },
    btts: { type: String },
    outcome: { type: String },
    preGame: { type: Object },
    ht: { type: Object },
});

module.exports = model("Match", schema);
