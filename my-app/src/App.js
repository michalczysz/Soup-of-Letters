import './App.css';
import React, { useRef } from "react"
import Header from "./components/header/header.component";
import Game from './components/game/game.component';
import GridCell from './components/game/grid_cell.component';
import SelectingBox from './components/slectingbox/selectingbox.component';
import UndoButton from './components/buttons/undo.component';

function App() {
  let dim = 5
  
  const canvas = useRef(null)
  const grid_ref = useRef(null)
  const [xy, setXY] = React.useState({ x: 0, y: 0, ctx: null })
  const [storedLines, setStroredLines] = React.useState([])
  const [grid] = React.useState(Game(dim))

  document.body.style = 'background: #FFF6A7;';

  // let grid = 

  // console.log(grid)

  return (
    <div id="container" >
      <Header />
      <main className="main-content">
        <div id="editor-section">
          <div className="grid-container" ref={grid_ref}>
            <SelectingBox ref={canvas} />
            {grid.map(xd => {
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
                storedLines={storedLines}
                setStroredLines={setStroredLines} />
            })}
          </div>
          <UndoButton can_ref={canvas} xy={xy} storedLines={storedLines} setStroredLines={setStroredLines} />
        </div>
      </main>
    </div >
  );
}

export default App;