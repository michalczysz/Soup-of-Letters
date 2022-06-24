import React from 'react'
import "./timer.css"
const TimerUP = ({secTimer, setSecTimer, hoursMinSecs, words }) => {

    const { hours = 0, minutes = 0, seconds = 0 } = hoursMinSecs;
    const [[hrs, mins, secs], setTime] = React.useState([hours, minutes, seconds]);
    let run = true
    let counter = 0;
    words.forEach(word => {
        if (word.status === true) counter++
    });

    if (counter++ === words.length) { run = false; }//setRunTimer(false)}

    const tick = () => {
        setSecTimer(secTimer + 1)
        if (run === true) {
            if (hrs === 1 && mins === 59 && secs === 60)
                reset()
            else if (mins === 60 && secs === 60) {
                setTime([hrs + 1, 0, 0]);
            } else if (secs === 60) {
                setTime([hrs, mins + 1, 0]);
            } else {
                setTime([hrs, mins, secs + 1]);
            }
        }
    };


    const reset = () => setTime([parseInt(hours), parseInt(minutes), parseInt(seconds)]);

    React.useEffect(() => {
        const timerId = setInterval(() => tick(), 1000);
        return () => clearInterval(timerId);
    });


    return (
        <div className="Timer">
            {`${hrs.toString().padStart(2, '0')}:${mins
                .toString()
                .padStart(2, '0')}:${secs.toString().padStart(2, '0')}`}
        </div>
    );
}

export default TimerUP;