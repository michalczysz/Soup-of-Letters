// import './undo.css'

function ResetButton() {
    const handleOnClick = () => {
        window.location.reload()
        //page should refresh
    }
    return (
        <button className="reset_button undo_button" type="button" onClick={handleOnClick}>Reset</button>
    )
}

export default ResetButton