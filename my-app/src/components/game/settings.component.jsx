import React from 'react'



function SettingsPopUP({ pop_state, set_pop_state }) {
    const [level, setLevel] = React.useState(0);
    const handleClick = () => {
        let settings = JSON.parse(localStorage.getItem('settings'));
        console.log(settings)
        set_pop_state(!pop_state)
    };

    const saveSettings = (e) => {
        // localStorage.setItem('settings', JSON.stringify({level: e.target.value}));
        console.log(level)
    }

    return (
        <div className="modal">
            <div className="modal_content">
                <span className="close" onClick={handleClick}>
                    &times;
                </span>
                <form>
                    <h3>Settings</h3>
                    <label>
                        Wordbook: <br />
                        <textarea />
                    </label>
                    <br /><br />
                    <label>
                        Difficult level: <br />
                        <select id="levels" onChange={e => {
                            // localStorage.setItem('settings', JSON.stringify({level: e.target.value}));
                            // console.log(e.target.value)
                            setLevel(e.target.value);
                        }}>
                            <option value="0">easy 5x5</option>
                            <option value="1">medium 10x10</option>
                            <option value="2">hard 15x15</option>
                        </select>

                    </label>
                    <br /><br />
                    <button className="save_settings_button" type="button" onClick={saveSettings}>Save</button>
                    {/* <button className="save_settings_button" type="button" onClick={saveSettings}>Save</button> */}
                </form>
            </div>
        </div>
    );
}

export default SettingsPopUP