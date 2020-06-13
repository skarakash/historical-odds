const { Schema, model } = require("mongoose");

const schema = new Schema({
    id: { type: String, required: true },
    name: { type: String },
    cc: { type: String },
});

module.exports = model("League", schema);