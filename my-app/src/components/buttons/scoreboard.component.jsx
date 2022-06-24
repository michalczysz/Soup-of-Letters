import './undo.css'

function ScoreButton({pop_state, set_pop_state}){
    const handleOnClick = () => {
        // console.log(pop_state)
        set_pop_state(!pop_state)
    }

    return(
        <button className="score_button undo_button" type="button" onClick={handleOnClick}>Scoreboard</button>
    )
}

export default ScoreButton