import React, { useState } from "react";
import { useHttp } from "../hooks/http.hook";

import * as leagues from "../constants"

import "bootstrap/dist/css/bootstrap.min.css";
import "../css/StatsPage.css"


export const StatsPage = () => {

    const { request, error } = useHttp();
    const [form, setForm] = useState({
        day: null
    });

    const [res, setRes] = useState(null);
    const [dates, setDates] = useState([])
    const [eventsView, setEventsView] = useState([])

    const handleFormChange = (event) => {
        event.preventDefault();
        setForm({ ...form, [event.target.name]: Number(event.target.value) });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = await request("api/match/ended", "POST", {
                ...form,
                league_id: leagues.PRIMEIRALIGA
            });

            setRes(data)
            setDates(dates => [...dates, ...data])
        } catch (error) { }
    }

    const handleGetEventsViews = async () => {
        dates.map(async (date) => {
            try {
                await fetch(`/api/match/eventview?event_id=${date}`)
                setDates(dates => dates.filter(d => d !== date))
            } catch (error) {
                console.log(error);
            }

        })
    }

    return (
        <div className="formWrapper">
            <form className="oddsForm">
                <p className="formControl">
                    <input
                        placeholder="dates"
                        name="day"
                        autoComplete="off"
                        type="text"
                        noValidate
                        onChange={handleFormChange}
                    />
                </p>


                <button onClick={handleSubmit}>
                    Submit
                </button>
            </form>

            <div>
                {dates.length > 0 && dates.map(el => {
                    return <span key={el}>{`${el}, `}</span>
                })}
            </div>

            <div className="getEventsViews">
                <button onClick={handleGetEventsViews}>Get eventsView</button>
            </div>
            <div>
                <button onClick={() => setDates(dates => [])}>Clear Dates</button>
            </div>
        </div>
    );
};
