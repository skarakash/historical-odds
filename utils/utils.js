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
        filteredMatch["round"] = idx(m.extra, _ => _.round) || "~";
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
        (odd) => odd && odd["add_time"] === String(latest)
    );

    return latestOddsArray;
};

const getOldestOdd = (arr) => {
    const oldest = Math.min.apply(
        Math,
        arr.map((o) => o && o["add_time"])
    );
    let oldestOddsArray = arr.filter(
        (odd) => odd && odd["add_time"] === String(oldest)
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

    const openingOdds = getLatestOdd(preGameOddsArray)[0];
    const kickoffOdds = getOldestOdd(preGameOddsArray)[0];



    const diff = {
        home_od: (openingOdds.home_od - kickoffOdds.home_od).toFixed(3),
        draw_od: (openingOdds.draw_od - kickoffOdds.draw_od).toFixed(3),
        away_od: (openingOdds.away_od - kickoffOdds.away_od).toFixed(3),
    };

    mergedOdds.kickoffOdds = kickoffOdds;
    mergedOdds.openingOdds = openingOdds;
    mergedOdds.diff = diff;
    return mergedOdds;
};

const analyseData = data => {
    if (data.length === 0) {
        return "Nothing to analyse"
    }

    const total = data.length;
    const homeWins = data.filter(game => game.outcome.includes('home')).length
    const awayWins = data.filter(game => game.outcome.includes('away')).length
    const draws = data.filter(game => game.outcome.includes('draw')).length

    const btts = data.filter(game => game.btts.includes('yes')).length
    const over = data.filter(game => game.over.includes('over')).length
    const under = data.filter(game => game.over.includes('under')).length


    return {
        total,
        home: `${Math.round((homeWins / total) * 100)}%`,
        away: `${Math.round((awayWins / total) * 100)}%`,
        draw: `${Math.round((draws / total) * 100)}%`,
        btts: `${Math.round((btts / total) * 100)}%`,
        over: `${Math.round((over / total) * 100)}%`,
        under: `${Math.round((under / total) * 100)}%`,
    }
}

module.exports = { getFilteredEventView, getFilteredEventOdds, analyseData };


// let all = Array.from(document.getElementsByClassName('datet')).map(el => el.innerText).filter(el => !el.includes(':'));


// let all = Array.from(document.querySelectorAll('.dark.center'));
// let l = all.map(el => `${el.childNodes[0].childNodes[0].innerText} ${el.childNodes[0].childNodes[2].innerHTML}`);
// l;


// let all = Array.from(document.querySelectorAll('.dark.center'));
// let l = all.map(el => {
//     let x = {}
//     x.country = `${el.childNodes[0].childNodes[0].innerText}`.substring(2);
//     x.tournament = `${el.childNodes[0].childNodes[2].innerHTML}`


//     return x
// });
// l;