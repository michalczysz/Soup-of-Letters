import './App.css';
import React, { useRef } from "react"
import Header from "./components/header/header.component";
import Game from './components/game/game.component';
import GridCell from './components/game/grid_cell.component';
import SelectingBox from './components/slectingbox/selectingbox.component';
import UndoButton from './components/buttons/undo.component';
import ResetButton from './components/buttons/reset.component';
import SettingsButton from './components/buttons/settings.component';
import WordBook from './components/wordlist/wordbook.component';

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
  const [grid, setGrid] = React.useState(Game(dim)) //In Game() we generate grid
  const [dragend, setDragend] = React.useState({ first_cell: '', last_cell: '', status: false })

  React.useEffect(() => {
    if (dragend.status === true) { //check if player end dragging
      let result = null
      grid[1].forEach(element => {
        if (element.first_cell === dragend.first_cell && element.last_cell === dragend.last_cell) //check if start and end letter are correponding to some word
          {
            result = grid[1].indexOf(element) //the result is index of correct word in solution array
            return
          }
      });
      if (result !== null) {
        let temp_grid = grid
        let temp_element = grid[1][result]
        temp_element.status = true 
        temp_grid[1][result] = temp_element
        setGrid(temp_grid) //setting new grid with word set as found correct
      }
      if(dragend.first_cell === dragend.last_cell) {
        let temp_storedLines = storedLines
        temp_storedLines.pop()
        setStroredLines(temp_storedLines)
      }
      setDragend({ first_cell: '', last_cell: '', status: false })
    } //here is the function that check if player found the rigth word and print its position in solution array
  }, [grid, dragend, setDragend]);

  document.body.style = 'background: #FFF660;';

  return (
    <div id="container" >
      <Header />
      <main className="main-content">
        <div id="game-components">
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
          <div className='List'>
            <h3 className='ListTitle'>List of words</h3>
            <WordBook can_ref={canvas} words={grid[1]} />
          </div>
        </div>
        <div className='Button-container'>
          <UndoButton can_ref={canvas} xy={xy} storedLines={storedLines} setStroredLines={setStroredLines} />
          <ResetButton />
          <SettingsButton />
        </div>
      </main>
    </div >
  );
}

export default App;