import React, { Component } from "react";
import * as leagues from "../constants"

import "bootstrap/dist/css/bootstrap.min.css";
import "../css/StatsPage.css"


export class StatsPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dates: [],
            ids: []
        }
    }

    handleFormChange = (event) => {
        event.preventDefault();
        let dates = event.target.value;
        dates = dates.split(',')
        this.setState({
            dates
        })
    };

    handleSubmit = async (e) => {
        e.preventDefault();
        let { dates } = this.state;

        dates.forEach(async (day) => {
            try {
                let newIds = await fetch(`api/match/ended?day=${day}&league_id=880`);
                newIds = await newIds.json()

                newIds.forEach(async (id) => {
                    try {
                        await fetch(`/api/match/eventview?event_id=${id}`)
                    } catch (error) {
                        console.log(error);
                    }
                })
            } catch (error) { }
        })


    }

    render() {
        return (
            <div className="formWrapper">
                <form className="oddsForm">
                    <p className="formControl">
                        <textarea
                            placeholder="dates"
                            name="dates"
                            autoComplete="off"
                            type="text"
                            noValidate
                            onChange={this.handleFormChange}
                        />
                    </p>


                    <button onClick={this.handleSubmit}>
                        Submit
                    </button>
                </form>
            </div>
        );
    }

};

export default StatsPage;