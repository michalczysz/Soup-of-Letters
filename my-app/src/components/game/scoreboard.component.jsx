import React from 'react'
import "./game.css"

function ScoreboardPopUP({ pop_state, set_pop_state }) {
    const handleClick = () => {
        set_pop_state(!pop_state)
    };

    let scores = JSON.parse(localStorage.getItem('scores')) || [];

    return (
        <div className="modal">
            <div className="modal_content">
                <span className="close" onClick={handleClick}>
                    &times;
                </span>
                <form>
                    <h3>Top Scores</h3>
                    <h4>nick - score - level</h4>
                    <div className='ScoresContainer'>
                        {scores.map(score => {
                            return <div className='Scores'><div>{score.nick}</div> <div>{score.score}</div> <div>{score.level}</div></div>
                        })}
                    </div>
                </form>
            </div>
        </div>
    );
}

export default ScoreboardPopUP