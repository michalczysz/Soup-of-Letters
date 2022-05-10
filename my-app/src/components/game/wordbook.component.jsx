import React from 'react'
import './wordbook.component.css'

function WordBook({ can_ref, words }) {
    const ref = React.createRef(null)

    React.useEffect(() => {
        // console.log(ref)
        document.documentElement.style.setProperty('--cv', can_ref.current.clientHeight + ref.current.clientWidth)
    })

    // console.log(words)

    return (<div className="WordBook" ref={ref}>
        {words.map(word => {
            return <li key={word.word}><span>{word.word}</span></li>
        })}
    </div>
    )
}

export default WordBook