import React from 'react'
import './wordbook.component.css'

function WordBook({ can_ref }) {
    const ref = React.createRef(null)

    React.useEffect(() => {
        // console.log(ref)
        document.documentElement.style.setProperty('--cv', can_ref.current.clientHeight + ref.current.clientWidth)
    })

    return (<div className="WordBook" ref={ref}>
        <li><span>word 1</span></li>
        <li><span>word 2</span></li>
        <li><span>word 3</span></li>
    </div>
    )
}

export default WordBook