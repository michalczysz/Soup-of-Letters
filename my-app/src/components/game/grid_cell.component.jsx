import React from "react";

/*
map function to help understand dataflow, here it helps to change
mouse position on page to grid XY cell number
*/
function map_xy(x, in_min, in_max, out_min, out_max) {
    return (x - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}

function redrawStoredLines(ctx, canvas, storedLines) {
    // clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (storedLines.length === 0) {
        return;
    }
    // redraw each stored line
    for (var i = 0; i < storedLines.length; i++) {
        ctx.beginPath();
        ctx.moveTo(storedLines[i].x1, storedLines[i].y1);
        ctx.lineTo(storedLines[i].x2, storedLines[i].y2);
        ctx.stroke();
    }
}

function GridCell({ index, letter, rand, dim, can_ref, grid_ref, xy, setXY, prevXY, setPrevXY, storedLines, setStroredLines, dragend, setDragend}) {

    /*
    useEffect hook fires only once after first render.
    Here it sets canvas size to match generated grid 
    */
    React.useEffect(() => {
        let ctx = can_ref.current.getContext("2d");
        document.documentElement.style.setProperty('--cv', grid_ref.current.offsetHeight)
        ctx.canvas.width = grid_ref.current.offsetHeight;
        ctx.canvas.height = grid_ref.current.offsetHeight;
    }, [can_ref, grid_ref]);

    //another function for better following data flow
    let abs_to_gridXY = (x) => {
        return Math.trunc(map_xy(x, 0, grid_ref.current.offsetHeight, 0, dim)) * (grid_ref.current.offsetHeight / dim) + 21
    }

    const handleDragStart = ev => {
        let ctx = can_ref.current.getContext("2d");
        ev.dataTransfer.setDragImage(new Image(), 0, 0); //trick to hide "ghost" of element while Dragging
        let _x = ev.pageX - can_ref.current.offsetLeft   //calculating current XY position on canvas
        let _y = ev.pageY - can_ref.current.offsetTop

        setDragend({first_cell: index})

        setXY({                     //putting new value to XY hook
            x: abs_to_gridXY(_x),   //XY canvas position to XY grid position
            y: abs_to_gridXY(_y),
            ctx: ctx
        })
        setDragend({first_cell: index, status: false})
    }

    const handleDrag = (ev) => {
        ev.preventDefault();
        ev.stopPropagation();

        ev.dataTransfer.dropEffect = 'none'; //trick to disable default drop effect

        let _x = abs_to_gridXY(ev.pageX - can_ref.current.offsetLeft)
        let _y = abs_to_gridXY(ev.pageY - can_ref.current.offsetTop)

        if (prevXY.x !== _x || prevXY.y !== _y) {
            setPrevXY({ x: _x, y: _y })
            redrawStoredLines(xy.ctx, can_ref.current, storedLines);

            if (_x > 0 && _y > 0 && _x < grid_ref.current.offsetHeight && _y < grid_ref.current.offsetHeight) {
                //canvas function for drawing
                xy.ctx.beginPath();
                xy.ctx.moveTo(xy.x, xy.y);
                xy.ctx.lineTo(
                    abs_to_gridXY(_x),
                    abs_to_gridXY(_y));
                xy.ctx.stroke();
            }
        }
        let firstcelltemp = dragend.first_cell
        setDragend({first_cell: firstcelltemp, last_cell: index, status: false})
    }

    const handleDragEnd = ev => {
        if (prevXY.x > 0 && prevXY.y > 0 && prevXY.x < grid_ref.current.offsetHeight && prevXY.y < grid_ref.current.offsetHeight) {
            let temp_storedLines = storedLines
            temp_storedLines.push({
                x1: xy.x,
                y1: xy.y,
                x2: prevXY.x,
                y2: prevXY.y,
            }
            )
            setStroredLines(temp_storedLines)
            let firstcelltemp = dragend.first_cell, lastcelltemp = dragend.last_cell
            setDragend({first_cell: firstcelltemp, last_cell: lastcelltemp, status: true})
        }
        redrawStoredLines(xy.ctx, can_ref.current, storedLines);
    }

    return (<div draggable className="grid-item" id={'gridCell' + index}
        onDragStart={handleDragStart}// function that fire when we start dragging element
        onDragOver={handleDrag} //onDrag doesnt work in Firefox browser, in chrome there is no problems
        onDragEnd={handleDragEnd}>
        {letter}
    </div>)
}

export default GridCell
export { redrawStoredLines }