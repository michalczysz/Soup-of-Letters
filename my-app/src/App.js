import './App.css';
import React, { useRef } from "react"
import Header from "./components/header/header.component";
import Game from './components/game/game.component';
import GridCell from './components/game/grid_cell.component';
import SelectingBox from './components/slectingbox/selectingbox.component';
import UndoButton from './components/buttons/undo.component';

function App() {
  /* 
  dim is temporary variable with diemension of letter grid
  it tells the rest of program to make 5x5 grid
  */
  let dim = 5

  /* Canvas is like area on which we can draw different shapes. 
  In this project we use it to draw line for selected letters

  Next, we use React Hooks to store data between renders.
  Render is like refreshing page when you update some value in DOM object.
  On every Render of DOM object, function genereting that object run once again
    an possibly might change state/value of object. for example, when we generate random number
    on next render it will generate it again and change our orginal value
  */

  const canvas = useRef(null) //this is React hook, to send Canvas pointer(?) to another function
  const grid_ref = useRef(null)

  const [xy, setXY] = React.useState({ x: 0, y: 0, ctx: null }) //another hooks for handling different datas between renders
  const [prevXY, setPrevXY] = React.useState({ x: 0, y: 0 })
  const [storedLines, setStroredLines] = React.useState([])
  const [grid] = React.useState(Game(dim)) //In Game() we generate grid
  const [dragend, setDragend] = React.useState({first_cell: '', last_cell: '', status: false})

  React.useEffect(() => {
    if (dragend.status === true) {
      grid[1].forEach(element => {
        if(element[0] === dragend.first_cell && element[1] === dragend.last_cell) console.log(grid[1].indexOf(element))
      });
      setDragend({first_cell: '', last_cell: '', status: false})
    } //here is the function that check if uswer found the rigth word and print its position in solution array
  });

  document.body.style = 'background: #FFF6A7;';

  return (
    <div id="container" >
      <Header />
      <main className="main-content">
        <div id="editor-section">
          <div className="grid-container" ref={grid_ref}>
            <SelectingBox ref={canvas} />
            {grid[0].map(xd => {
              return <GridCell
                key={xd[0]}
                index={xd[0]}
                letter={xd[1]}
                rand={xd[2]}
                dim={dim}
                can_ref={canvas}
                grid_ref={grid_ref}
                xy={xy}
                setXY={setXY}
                prevXY={prevXY}
                setPrevXY={setPrevXY}
                storedLines={storedLines}
                setStroredLines={setStroredLines}
                dragend={dragend}
                setDragend={setDragend} />
            })}
          </div>
          <UndoButton can_ref={canvas} xy={xy} storedLines={storedLines} setStroredLines={setStroredLines} />
        </div>
      </main>
    </div >
  );
}

export default App;