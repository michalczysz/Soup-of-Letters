import React from 'react'
import './wordbook.component.css'

function WordBook({ can_ref, words }) {
    const ref = React.createRef(null)

    return (<div className="WordBook" ref={ref}>
        {words.map(word => {
            return <li key={word.word} style={{textDecoration: word.status === true ? 'line-through' : 'none'}}><span>{word.word}</span></li>
        })}
    </div>
    )
}

export default WordBook