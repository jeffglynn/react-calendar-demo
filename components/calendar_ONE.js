import { loadGetInitialProps } from "next/dist/shared/lib/utils";

import styles from '../styles/Home.module.css';
import { useState } from 'react';

function Day_box(props) {
    const [clicked, setClick] = useState(false);

    
    return(
        <>
        
        <button className={props.selected ? 'selected' : ''}  
                onClick={()=>props.onClick(props.day)} 
                style={props.style}
               
                >
            {props.day}
        </button>
        </>
    )

 
}

export default function Calendar(props){
    const [clicked, setClicked] = useState(false);
    const toggle = () => {
        setClicked(prevState => !prevState) 
      }
    const [first_date, setFirst] = useState(null);
    const [last_date, setLast] = useState(null);
    const set_cal_Dates =(new_date) => {
        setFirst(prevDate => prevDate === null || new_date < prevDate || new_date == last_date  ? new_date : prevDate);
        setLast(new_date);
        
    }
    

    const today = new Date();
    const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                   'July', 'August', 'September', 'October', 'November', 'December'];

    let mon = props.month - 1; // months in JS are 0..11, not 1..12

    
    const dayToBeginTheMonthFrom = firstDayOfMonth(props.month,props.year); // Get the first day of a given month. 
    

    var days = []
    
    for (var i = 1; i <= daysInMonth(props.month,props.year); i++) {
        
        days.push(i);
    }

  

    const cond_style ={gridColumnStart: dayToBeginTheMonthFrom + 1};
    
    return(
        <>
        <style>{`
            .selected {background-color:blue}
            `}
        </style>
       <div className={`${styles.month} ${clicked ? 'clicked' : ''}` }>
            <div className="month-header">
                <h2 style={{textAlign:'center'}}>{months[props.month]} {props.year}
                </h2>
                
            <div >
                {/* <div className="month-header">
                    {weekdays.map((weekday) => {
                        return <div className="weekday"><p>{weekday}</p></div>;
                    })}
                </div> */}
                <div className={styles.days_container}>
                  
                  { days.map((day) => 
                       
                        <Day_box toggle_cal_click={toggle}
                        onClick={set_cal_Dates }
                        key={day}
                        day={day}
                        selected={ (day >= first_date && day <=last_date)  ? true : false}
                        style={day === 1 ? cond_style : {}}
                         
                    
                        />
                       

                   )}
                    

                </div>
            </div>
        </div>
                    
        </div>
        </>
    )



      function daysInMonth(month,year) {
        const d = new Date(year, month + 1, 0); // Month in JavaScript is 0-indexed (January is 0, February is 1, etc), 
        // but by using 0 as the day it will give us the last day of the prior
        // month. So passing in 1 as the month number will return the last day
        // of January, not February
        return d.getDate();
      }

      function firstDayOfMonth(month, year) {
        const d = new Date(year, month, 1);
        return d.getDay();
      }
    

}

