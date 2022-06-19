function SettingsButton({pop_state, set_pop_state}){
    const handleOnClick = () => {
        // console.log(pop_state)
        set_pop_state(!pop_state)
    }
    return (
        <button className="settings_button undo_button" type="button" onClick={handleOnClick}>Settings</button>
    )
}

export default SettingsButton