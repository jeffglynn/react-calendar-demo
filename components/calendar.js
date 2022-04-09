import { loadGetInitialProps } from "next/dist/shared/lib/utils";

import styles from '../styles/Home.module.css';
import { useState, useEffect } from 'react';

function Day_box(props) {

    
    return(
        <>
        
        <button className={`${props.selected ? 'selected' : ''} ${props.booked ? 'booked' : ''}`}  
                onClick={props.booked ? undefined : ()=>props.onClick(props.day)}  // disable click function for days that are booked
                style={props.style}
               
                >
            {props.day.getDate()}
        </button>
        </>
    )

 
}

export default function Cal_Block(props){
    var booked_dates=[];
    booked_dates.push(new Date(2022, 6, 5));


    const [first_date, setFirst] = useState(null);
    const [last_date, setLast] = useState(null);
    const set_cal_Dates =(new_date) => {
        setFirst(prevDate => prevDate === null || new_date < prevDate || new_date.getDate() == last_date.getDate()   ? new_date : prevDate);
        setLast(new_date);
        
        if (booked_dates.every(check_conflict))  setFirst(new_date) ;  // if conflict, set first and last dates to the new date (which will be after the conflict)

        function check_conflict(booked_date) {
            return first_date !=null && booked_date>=first_date && booked_date<=new_date;
        }

       
    }

    useEffect(() => {
        if ((first_date !=null && last_date!=null)) {
            document.getElementById('arrival').value = first_date.toDateString();
            
            if (!(first_date.toDateString() == last_date.toDateString())) document.getElementById('departure').value = last_date.toDateString(); else document.getElementById('departure').value ='';
        }
    });
    

    


    const today = new Date();
    var month = today.getMonth();
    var year = today.getFullYear();
    var months_years = [];
    for (var i = 1; i <= 12; i++) {
        
        months_years.push({month:month,year:year});  // push an object in
        month++;
        if (month>11) {month=0;year++}  // JS months start at 0
    }
    //console.log( months );
    return (
        <>
        <div className={styles.months_container}>
                  
        { months_years.map( (date,index) => 
             
              <Calendar 
              passFunction={set_cal_Dates }
              
              month={date.month}  //use object notation to get out
              year={date.year}
              first_date ={first_date} 
              last_date ={last_date} 
              booked_dates ={booked_dates}
               
          
              />
             

         )}
          

      </div>
    <div class="date_box" style={{margin:'100px auto',width:'600px'}}><label>Arrival</label>&nbsp;<input id="arrival"></input>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<label>Departure</label>&nbsp;<input id="departure"></input></div>
    <button style={{margin:'100px auto',width:'100px',display:'block    '}} onClick={clear_dates}>Clear Dates</button>
    </>

    )

    function clear_dates(){
        setFirst(null);
        setLast(null);
        document.getElementById('arrival').value ='';
        document.getElementById('departure').value ='';
    }
    

}

 function Calendar(props){
    
    

   
    //const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                   'July', 'August', 'September', 'October', 'November', 'December'];

    

    
    const dayToBeginTheMonthFrom = firstDayOfMonth(props.month,props.year); // Get the first day of a given month. 
    

    var days = []
    
    for (var i = 1; i <= daysInMonth(props.month,props.year); i++) {
        var day_date = new Date( props.year, props.month, i )
        days.push(day_date);
    }

  
    
    const cond_style ={gridColumnStart: dayToBeginTheMonthFrom + 1};
    
    return(
        <>
        <style>{`
            .selected {background-color:blue}
            .booked {background-color:red}
            `}
        </style>
       <div className={styles.month}>
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
                  
                  { days.map((day) => // day is a date object
                       
                        <Day_box 
                        onClick={props.passFunction }
                        booked={check_booked(props.booked_dates,day)}
                        day={day}
                        selected={ (day >= props.first_date && day <=props.last_date)  ? true : false}
                        style={day.getDate() === 1 ? cond_style : {}}
                         
                    
                        />
                       

                   )}
                    

                </div>
            </div>
        </div>
                    
        </div>
        </>
    )

      function check_booked(booked_dates,day){

            return booked_dates.every(check_match);
            function check_match(booked_date) {
                return (day.getFullYear() == booked_date.getFullYear() && day.getMonth() == booked_date.getMonth() && day.getDate()==booked_date.getDate())
            }
      }

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