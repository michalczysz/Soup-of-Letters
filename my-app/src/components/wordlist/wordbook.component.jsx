import React from 'react'
import './wordbook.component.css'

function WordBook({ can_ref, words, undoUpdate, setUndoUpdate }) {
    const ref = React.createRef(null)

    React.useEffect(() => {
       if (undoUpdate === true) setUndoUpdate(false) 
    })

    return (<div className="WordBook" ref={ref}>
        {words.map(word => {
            return <ul key={'ul' + word.word}>
                    <li key={word.word} style={{textDecoration: word.status === true ? 'line-through' : 'none'} }><span>{word.word}</span></li>
                </ul>
        })}
    </div>
    )
}

export default WordBook