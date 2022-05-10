import React from "react"
import "./selectingbox.component.css"

const SelectingBox = React.forwardRef((props, ref) => {
    return (
         <canvas
        className="canvases"
        ref={ref} //setting the ref that was made former made in App.js
      ></canvas>       
    )
})

export default SelectingBox