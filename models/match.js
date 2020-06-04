const { Schema, model } = require("mongoose");

const schema = new Schema({
    match_id: { type: String, required: true, unique: true },
    league: { type: String, required: true },
    round: { type: String, required: true },
    home: { type: String, required: true },
    away: { type: String, required: true },
    ht_score: { type: Object },
    ft_score: { type: Object },
    over: { type: String },
    btts: { type: String },
    fhg: { type: String },
    outcome: { type: String },
    start: { type: Object },
    close: { type: Object },
    diff: { type: Object },
});

module.exports = model("Match", schema);
