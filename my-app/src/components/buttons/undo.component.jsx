import './undo.css'
import { redrawStoredLines } from '../game/grid_cell.component'
import React from 'react'

function UndoButton({ can_ref, xy, storedLines, setStroredLines, solutions, setGrid, setUndoUpdate }) {
    const handleOnClick = () => {
        if (storedLines.length > 0) {
            let temp_storedlines = storedLines
            let last_line = temp_storedlines.pop()

            if (last_line.word !== undefined) {
                solutions[1].forEach(solution => {
                    if (solution.word === last_line.word) {
                        let index = solutions[1].indexOf(solution)
                        let temp_solutions = solutions
                        temp_solutions[1][index].status = false
                        setGrid(temp_solutions)
                        return
                    }
                });                
            }
            setStroredLines(temp_storedlines)
            redrawStoredLines(xy.ctx, can_ref.current, storedLines)
        }
        setUndoUpdate(true)
    }

    return (
        <button className="undo_button" type="button" onClick={handleOnClick}>Undo</button>
    )
}

export default UndoButton