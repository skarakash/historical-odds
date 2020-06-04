const idx = require("idx");

const getFilteredEventView = (match) => {
    let filteredMatch = {};

    const getRes = (obj) => {
        const a = obj["ft_score"].home;
        const b = obj["ft_score"].away;
        if (a > b) {
            return "home win";
        } else if (a < b) {
            return "away win";
        } else {
            return "draw";
        }
    };

    match.map((m) => {
        const fh_home = Number(idx(m, (_) => _.scores["1"].home));
        const fh_away = Number(idx(m, (_) => _.scores["1"].away));
        const ft_home = Number(idx(m, (_) => _.scores["2"].home));
        const ft_away = Number(idx(m, (_) => _.scores["2"].away));

        filteredMatch["match_id"] = m.id;
        filteredMatch["league"] = m.league.name;
        filteredMatch["round"] = m.extra.round;
        filteredMatch["home"] = m.home.name;
        filteredMatch["away"] = m.away.name;
        filteredMatch["ht_score"] = { home: fh_home, away: fh_away };
        filteredMatch["ft_score"] = { home: ft_home, away: ft_away };
        filteredMatch["over"] = ft_home + ft_away > 2.5 ? "over" : "under";
        filteredMatch["btts"] = ft_home > 0 && ft_away > 0 ? "yes" : "no";
        filteredMatch["fhg"] = fh_home > 0 || fh_away > 0 ? "yes" : "no";
        filteredMatch["first_corner"] = m.events
            ? getFirstCorner(m.events)
            : NaN;
    });

    filteredMatch.outcome = getRes(filteredMatch);
    return filteredMatch;
};

const getFirstCorner = (arr) => {
    arr =
        arr.length > 0 &&
        arr.map((e) => e.text).filter((i) => i && i.includes("1st Corner"));
    return arr.length > 0 ? Number(arr[0].split("'")[0]) : NaN;
};

const getLatestOdd = (arr) => {
    const latest = Math.max.apply(
        Math,
        arr.map((o) => o && o["add_time"])
    );
    let latestOddsArray = arr.filter(
        (odd) => odd && odd["add_time"] === latest
    );

    return latestOddsArray;
};

const getOldestOdd = (arr) => {
    const oldest = Math.min.apply(
        Math,
        arr.map((o) => o && o["add_time"])
    );
    let oldestOddsArray = arr.filter(
        (odd) => odd && odd["add_time"] === oldest
    );

    return oldestOddsArray;
};

const getFilteredEventOdds = (odds) => {
    const mergedOdds = Object.create({});

    if (!odds || odds.length === 0) {
        return null;
    }

    let preGameOddsArray = odds.filter((odd) => !odd["ss"] && !odd["time_str"]);

    if (preGameOddsArray.length < 1) {
        return null;
    }

    if (preGameOddsArray.length === 1) {
        mergedOdds.diff = {};
    }

    preGameOddsArray = preGameOddsArray.map((el) => {
        let numberOdds = {};
        for (odd in el) {
            numberOdds[odd] = Number(el[odd]);
        }

        return numberOdds;
    });

    const openingOdds = getLatestOdd(preGameOddsArray)[0];
    const kickoffOdds = getOldestOdd(preGameOddsArray)[0];

    const diff = {
        home_od: openingOdds.home_od - kickoffOdds.home_od,
        draw_od: openingOdds.draw_od - kickoffOdds.draw_od,
        away_od: openingOdds.away_od - kickoffOdds.away_od,
    };

    mergedOdds.kickoffOdds = kickoffOdds;
    mergedOdds.openingOdds = openingOdds;
    mergedOdds.diff = diff;
    return mergedOdds;
};

module.exports = { getFilteredEventView, getFilteredEventOdds };
