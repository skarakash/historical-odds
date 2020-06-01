import React from 'react'

export const TempStats = ({ data }) => {
    if (!data) {
        return null
    }

    let numberOfRecords = data.length;
    let numberOfHomeWins = 0;
    let numberOfAwayWins = 0;
    let numberOfDraws = 0;
    let over2_5 = 0;
    let under2_5 = 0
    let over2 = 0;
    let under2 = 0

    data.map(match => {
        if (match.homeScore > match.awayScore) {
            numberOfHomeWins++
        } else if (match.homeScore < match.awayScore) {
            numberOfAwayWins++
        } else {
            numberOfDraws++
        }
    });

    data.map(match => {
        if (match.totalGoals > 2.5) {
            over2_5++
        } else {
            under2_5++
        }
    })

    data.map(match => {
        if (match.totalGoals >= 2) {
            over2++
        } else {
            under2++
        }
    })

    return (
        <>
            {data && <div><p>{`total: ${numberOfRecords}`}</p>
                <p>{`Home Wins:  ${numberOfHomeWins}`}</p>
                <p>{`Away Wins ${numberOfAwayWins}`}</p>
                <p>{`Draws ${numberOfDraws}`}</p>
                <p>{`Over 2.5: ${over2_5}`}</p>
                <p>{`Under 2.5: ${under2_5}`}</p>
                <p>{`Over 2: ${over2}`}</p>
                <p>{`Under 2: ${under2}`}</p>
            </div>}
        </>
    )
}