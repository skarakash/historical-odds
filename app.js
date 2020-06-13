const express = require("express");
const config = require("config");
const mongoose = require("mongoose");

const PORT = config.get("port") || 8080;
const app = express();

app.use(express.json({ extended: true }));
app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/match", require("./routes/match.routes"));
app.use("/api/leagues", require("./routes/league.routes"));

async function start() {
    try {
        await mongoose.connect(config.get("mongoURI"), {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
        });
        app.listen(8080, () => console.log(`running on ${PORT}...`));
    } catch (error) {
        console.log("Error", error.message);
        process.exit(1);
    }
}

start();