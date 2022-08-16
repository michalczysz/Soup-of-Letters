import React from "react"

function Completed({ words, secTimer }) {
    const [nick, setNick] = React.useState('');

    const handleOnClick = () => {
        let scores = JSON.parse(localStorage.getItem('scores')) || [];
        let level = JSON.parse(localStorage.getItem('level')) || 5;
        let score = 250 - secTimer + (words.length * 10) + level*10
        scores.push({nick: nick, score: score, level: level + "x" + level})
        scores.sort((a, b) => parseFloat(b.score) - parseFloat(a.score));
        localStorage.setItem('scores', JSON.stringify(scores));
        window.location.reload()
    }

    let counter = 0;
    let run = true
    words.forEach(word => {
        if (word.status === true) counter++
    });

    if (counter++ === words.length) { run = false }

    if (run === false) {
        return (
            <div>
                <h3 className='SideTitle'>COMPLETED!</h3>
                <label>nick:</label><br />
                <input type="text" onChange={e => {
                    setNick(e.target.value);
                }}></input><br />
                <button type="button" onClick={handleOnClick}>Save score</button>
            </div>
        )
    }
}

export default Completed