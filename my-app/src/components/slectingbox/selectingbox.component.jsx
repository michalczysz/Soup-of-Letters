import React from "react"
import "./selectingbox.component.css"

const SelectingBox = React.forwardRef((props, ref) => {
    return (
         <canvas
        className="canvases"
        ref={ref}
      ></canvas>       
    )
})

export default SelectingBox