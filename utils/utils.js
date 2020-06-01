const idx = require('idx');

const getFilteredEventView = match => {

    let filteredMatch = {};

    const getRes = (obj) => {
        const a = obj["ft_score"].home;
        const b = obj["ft_score"].away;
        if (a > b) {
            return 'home win'
        } else if (a < b) {
            return 'away win'
        } else {
            return 'draw'
        }
    }

    match.map(m => {
        filteredMatch["match_id"] = m.id;
        filteredMatch["league"] = m.league.name;
        filteredMatch["round"] = m.extra.round;
        filteredMatch["home"] = m.home.name;
        filteredMatch["away"] = m.away.name;
        filteredMatch["ht_score"] = { home: Number(idx(m, _ => _.scores[1].home)), away: Number(idx(m, _ => _.scores[1].away)) };
        filteredMatch["ft_score"] = { home: Number(idx(m, _ => _.scores[2].home)), away: Number(idx(m, _ => _.scores[2].away)) };
        filteredMatch["over"] = Number(idx(m, _ => _.scores[2].home)) + Number(idx(m, _ => _.scores[2].away)) > 2.5 ? 'over' : 'under';
    });

    filteredMatch.outcome = getRes(filteredMatch);
    return filteredMatch;
}

const getLatestOdd = arr => {
    const oldest = Math.max.apply(Math, arr.map(o => o["add_time"]))
    return arr.filter(odd => odd["add_time"] === String(oldest))
}


const getOldestOdd = arr => {
    const oldest = Math.min.apply(Math, arr.map(o => o["add_time"]))
    return arr.filter(odd => odd["add_time"] === String(oldest))
}

const getFilteredEventOdds = odds => {
    if (!odds || odds.length === 0) {
        return null;
    }

    const preGameOddsArray = odds.filter(odd => !odd["ss"] && !odd["time_str"]);
    const htGamedOddsArray = odds.filter(odd => (odd["time_str"] === "46" || odd["time_str"] === "47" || odd["time_str"] === "45") && odd["home_od"] !== '-');

    const preGameOdds = getLatestOdd(preGameOddsArray)[0];
    const htGameOdds = getOldestOdd(htGamedOddsArray)[0];


    const mergedOdds = Object.create({})
    mergedOdds.preGame = preGameOdds;
    mergedOdds.ht = htGameOdds;

    return mergedOdds

}

module.exports = { getFilteredEventView, getFilteredEventOdds };