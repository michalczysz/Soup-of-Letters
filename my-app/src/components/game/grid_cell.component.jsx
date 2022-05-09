import React from "react";

function map_xy(x, in_min, in_max, out_min, out_max) {
    return (x - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}

function redrawStoredLines(ctx, canvas, storedLines) {
    // console.log(ctx)
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

function GridCell({ index, letter, rand, dim, can_ref, grid_ref, xy, setXY, prevXY, setPrevXY, storedLines, setStroredLines }) {
    const canvas = can_ref

    React.useEffect(() => {
        let ctx = canvas.current.getContext("2d");
        ctx.canvas.width = grid_ref.current.offsetHeight;
        ctx.canvas.height = grid_ref.current.offsetHeight;
    }, [canvas, grid_ref]);

    let abs_to_gridXY = (x) => {
        return Math.trunc(map_xy(x, 0, grid_ref.current.offsetHeight, 0, dim)) * (grid_ref.current.offsetHeight / dim) + 21
    }

    const handleDragStart = ev => {
        ev.dataTransfer.setData('text', 'test');
        let ctx = canvas.current.getContext("2d");
        ev.dataTransfer.setDragImage(new Image(), 0, 0);
        let _x = ev.pageX - can_ref.current.offsetLeft
        let _y = ev.pageY - can_ref.current.offsetTop

        setXY({
            x: abs_to_gridXY(_x),
            y: abs_to_gridXY(_y),
            ctx: ctx
        })
    }

    const handleDrag = (ev) => {
        ev.preventDefault();
        ev.stopPropagation();

        ev.dataTransfer.dropEffect = 'none';

        let _x = abs_to_gridXY(ev.pageX - can_ref.current.offsetLeft)
        let _y = abs_to_gridXY(ev.pageY - can_ref.current.offsetTop)

        if (prevXY.x !== _x || prevXY.y !== _y) {
            setPrevXY({ x: _x, y: _y })
            console.log(_x + " : " + _y)
            redrawStoredLines(xy.ctx, canvas.current, storedLines);

            if (_x > 0 && _y > 0 && _x < grid_ref.current.offsetHeight && _y < grid_ref.current.offsetHeight) {
                xy.ctx.beginPath();
                xy.ctx.moveTo(xy.x, xy.y);
                xy.ctx.lineTo(
                    abs_to_gridXY(_x),
                    abs_to_gridXY(_y));
                xy.ctx.stroke();
            }
        }
    }

    const handleDragEnd = ev => {
        if (prevXY.x > 0 && prevXY.y > 0 && prevXY.x < grid_ref.current.offsetHeight && prevXY.y < grid_ref.current.offsetHeight) {
            let temp_storedLines = storedLines
            temp_storedLines.push({
                x1: xy.x,
                y1: xy.y,
                x2: prevXY.x,
                y2: prevXY.y
            }
            )
            setStroredLines(temp_storedLines)
        }
        redrawStoredLines(xy.ctx, canvas.current, storedLines);
    }

    return (<div draggable className="grid-item" id={'gridCell' + index}
        onDragStart={handleDragStart}
        onDragOver={handleDrag} //onDrag doesnt work in Firefox browser, in chrome there is no problems
        onDragEnd={handleDragEnd}>
        {letter}
    </div>)
}

export default React.memo(GridCell)
export { redrawStoredLines }