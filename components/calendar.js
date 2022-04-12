import { loadGetInitialProps } from "next/dist/shared/lib/utils";

import styles from "../styles/Home.module.css";
import { useState, useEffect } from "react";

export default function Cal_Block(props) {
	var booked_dates = [];
	// Just hard coded dates for now.
	booked_dates[0] = {
		booked_first: new Date(2022, 6, 5),
		booked_last: new Date(2022, 6, 15),
	};
	booked_dates[1] = {
		booked_first: new Date(2022, 4, 15),
		booked_last: new Date(2022, 5, 17),
	};
	booked_dates[3] = {
		booked_first: new Date(2022, 12, 15),
		booked_last: new Date(2023, 1, 3),
	};

	// Set up states for keep track of user selected dates
	const [first_date, setFirst] = useState(null);
	const [last_date, setLast] = useState(null);

	//function to pass down through Calendar component to Day_box component to update the user selected dates
	const set_cal_Dates = (new_date) => {
		setFirst((prevDate) =>
			prevDate === null ||
			new_date < prevDate ||
			new_date.getDate() == last_date.getDate()
				? new_date
				: prevDate
		);
		setLast(new_date);
		// check for conflict with booked_dates
		if (!booked_dates.every(check_conflict)) setFirst(new_date); // if conflict, set first and last dates to the new date (which will be after the conflict)
		function check_conflict(booked_date) {
			if (first_date != null)
				return !(
					booked_date.booked_first >= first_date &&
					booked_date.booked_last <= new_date
				);
		}
	};

	function clear_dates() {
		setFirst(null);
		setLast(null);
	}

	const today = new Date();
	var month = today.getMonth();
	var year = today.getFullYear();
	var months_years = [];
	for (var i = 1; i <= 12; i++) {
		// build array of month integers to use to render the Calendar Components
		months_years.push({ month: month, year: year }); // push an object in
		month++;
		if (month > 11) {
			month = 0;
			year++;
		} // JS months start at 0
	}

	return (
		//
		<>
			<div className={styles.months_container}>
				{months_years.map((date, index) => (
					<Calendar
						passFunction={set_cal_Dates}
						month={date.month} //use object notation to get out
						year={date.year}
						key={date.toString()}
						first_date={first_date} //pass through Calendar, used when rendering Day component to set 'selected' class
						last_date={last_date} //pass through Calendar, used when rendering Day component to set 'selected' class
						booked_dates={booked_dates} //pass through Calendar, used when rendering Day component to set 'booked' class
					/>
				))}
			</div>
			<div style={{ margin: "100px auto", width: "600px" }}>
				Select a range of dates.
				<br /> Red days are already booked, you can not select over red days.
				<br />
				Double-click to select a new start date, or use the Clear Dates button
				below.
			</div>
			<div
				className="date_box"
				style={{ margin: "100px auto", width: "600px" }}
			>
				<label>Arrival</label>&nbsp;
				<input id="arrival" value={props.first_date} />
				&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<label>Departure</label>&nbsp;
				<input
					id="departure"
					value={props.first_date == props.last_date ? null : props.last_date}
				/>
			</div>
			<button
				style={{ margin: "100px auto", width: "100px", display: "block    " }}
				onClick={clear_dates}
			>
				Clear Dates
			</button>
		</>
	);
}

function Calendar(props) {
	// each month is a Calendar component

	//const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
	const months = [
		"January",
		"February",
		"March",
		"April",
		"May",
		"June",
		"July",
		"August",
		"September",
		"October",
		"November",
		"December",
	];

	const dayToBeginTheMonthFrom = firstDayOfMonth(props.month, props.year); // Get the first day of a given month.

	var days = [];

	//create array of date objects for each day in the month, used to render the Days
	for (var i = 1; i <= daysInMonth(props.month, props.year); i++) {
		var day_date = new Date(props.year, props.month, i);
		days.push(day_date);
	}

	const cond_style = { gridColumnStart: dayToBeginTheMonthFrom + 1 }; // style applied to the first day of month to start css grid at correct day of week

	return (
		<>
			<style>
				{`
            .day {background-color:#A9A9A9}
            .selected {background-color:blue}
            .booked {background-color:red}
            `}
			</style>
			<div className={styles.month}>
				<div className="month-header">
					<h2 style={{ textAlign: "center" }}>
						{months[props.month]} {props.year}
					</h2>

					<div>
						{/* <div className="month-header">
                    {weekdays.map((weekday) => {
                        return <div className="weekday"><p>{weekday}</p></div>;
                    })}
                </div> */}
						<div className={styles.days_container}>
							{days.map(
								(
									day // day is a date object
								) => (
									<Day_box
										onClick={props.passFunction} // setState function passed from Cal_block component
										booked={check_booked(props.booked_dates, day)} // true or false, used to assign booked class
										day={day}
										key={day.toString()}
										selected={
											day >= props.first_date && day <= props.last_date
												? true
												: false
										} // true or false, , used to assign selected class
										style={day.getDate() === 1 ? cond_style : {}} // used to assign grid start to first day of month
									/>
								)
							)}
						</div>
					</div>
				</div>
			</div>
		</>
	);

	function check_booked(booked_dates, day) {
		//check if that day is booked already
		if (day <= new Date()) return true;
		else return !booked_dates.every(check_match); //  array.every only returns true if all check true, so inverse both conditions, then function returns true if any are true
		function check_match(booked_date) {
			return !(
				booked_date.booked_first <= day && booked_date.booked_last >= day
			);
		}
	}

	function daysInMonth(month, year) {
		//helper function for building days in month array
		const d = new Date(year, month + 1, 0); // Month in JavaScript is 0-indexed (January is 0, February is 1, etc),
		// but by using 0 as the day it will give us the last day of the prior
		// month. So passing in 1 as the month number will return the last day
		// of January, not February
		return d.getDate();
	}

	function firstDayOfMonth(month, year) {
		//helper function to find day of week of first day of month
		const d = new Date(year, month, 1);
		return d.getDay();
	}
}

function Day_box(props) {
	// Component for each day
	return (
		<>
			<button
				className={`${props.selected ? "selected" : ""} ${
					props.booked ? "booked" : ""
				} day`}
				onClick={props.booked ? undefined : () => props.onClick(props.day)} // disable click function for days that are booked
				style={props.style} // just used to assign grid start to first day of month
			>
				{props.day.getDate()}
			</button>
		</>
	);
}
