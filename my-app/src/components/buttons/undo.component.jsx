import './undo.css'
import { redrawStoredLines } from '../game/grid_cell.component'

function UndoButton({ can_ref, xy, storedLines, setStroredLines }) {
    const handleOnClick = () => {
        if (storedLines.length > 0) {
            let temp_storedlines = storedLines
            temp_storedlines.pop()
            setStroredLines(temp_storedlines)
            redrawStoredLines(xy.ctx, can_ref.current, storedLines)
        }
    }

    return (
        <button className="undo_button" type="button" onClick={handleOnClick}>Undo</button>
    )
}

export default UndoButton