import React from 'react'

function SettingsPopUP({ pop_state, set_pop_state }) {
    const [level, setLevel] = React.useState(5);
    const [words, setWords] = React.useState(JSON.parse(localStorage.getItem('wordbook')));

    const handleClick = () => {
        set_pop_state(!pop_state)
        window.location.reload()
    };

    const saveSettings = (e) => {
        localStorage.setItem('level', JSON.stringify(level));
        localStorage.setItem('wordbook', JSON.stringify(words));
        set_pop_state(!pop_state)
        window.location.reload()
    }

    const handleChange = (e) => { 
        setWords(e.target.value)
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
                        <textarea defaultValue={JSON.parse(localStorage.getItem('wordbook'))} onChange={handleChange} />
                    </label>
                    <br /><br />
                    <label>
                        Difficult level: <br />
                        <select id="levels" onChange={e => {
                            setLevel(e.target.value);
                        }}>
                            <option value="5">easy 5x5</option>
                            <option value="10">medium 10x10</option>
                            <option value="15">hard 15x15</option>
                        </select>

                    </label>
                    <br /><br />
                    <button className="save_settings_button" type="button" onClick={saveSettings}>Save</button>
                </form>
            </div>
        </div>
    );
}

export default SettingsPopUP