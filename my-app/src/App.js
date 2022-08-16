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
import SettingsPopUP from './components/game/settings.component';
import TimerUP from './components/timer/timer.component';
import ScoreButton from './components/buttons/scoreboard.component';
import ScoreboardPopUP from './components/game/scoreboard.component';
import Completed from './components/game/completed.component';


function App() {
  /* 
  dim is temporary variable with diemension of letter grid
  it tells the rest of program to make 5x5 grid
  */
  let level = JSON.parse(localStorage.getItem('level')) || 5;
  let dim = Number(level)

  /* Canvas is like area on which we can draw different shapes. 
  In this project we use it to draw line for selected letters

  Next, we use React Hooks to store data between renders.
  Render is like refreshing page when you update some value in DOM object.
  On every Render of DOM object, function genereting that object run once again
    an possibly might change state/value of object. for example, when we generate random number
    on next render it will generate it again and change our orginal value
  */

  const canvas = useRef(null) //this is React hook, to send Canvas reference/pointer(?) to another function
  const grid_ref = useRef(null)

  const [xy, setXY] = React.useState({ x: 0, y: 0, ctx: null }) //another hooks for handling different datas between renders
  const [prevXY, setPrevXY] = React.useState({ x: 0, y: 0 })
  const [storedLines, setStroredLines] = React.useState([])
  const [grid, setGrid] = React.useState(Game(dim)) //In Game() we generate grid
  const [dragend, setDragend] = React.useState([{ first_cell: '', last_cell: '', status: false }])
  const [undoUpdate, setUndoUpdate] = React.useState(false)
  const [settingsPop, setSettingsPop] = React.useState(false)
  const [scorePop, setScorePop] = React.useState(false)
  const [secTimer, setSecTimer] = React.useState(0)

  const hoursMinSecs = { hours: 0, minutes: 0, seconds: 0 }

  React.useEffect(() => {
    if (dragend.status === true) { //check if player end dragging
      let result = null
      grid[1].forEach(element => {
        if (element.first_cell === dragend.first_cell && element.last_cell === dragend.last_cell) //check if start and end letter are correponding to some word
        {
          result = grid[1].indexOf(element) //the result is index of correct word in solution array
          let temp_storedLines = storedLines
          temp_storedLines[temp_storedLines.length - 1].word = grid[1][result].word
          setStroredLines(temp_storedLines)
          return
        }
      });
      if (result !== null) {
        let temp_grid = grid
        let temp_element = grid[1][result]
        temp_element.status = true
        temp_grid[1][result] = temp_element
        setGrid(temp_grid) //setting new grid with word set as found and correct
      }
      if (dragend.first_cell === dragend.last_cell) {
        let temp_storedLines = storedLines
        temp_storedLines.pop()
        setStroredLines(temp_storedLines)
      }
      setDragend({ first_cell: '', last_cell: '', status: false })
    } //here is the function that check if player found the rigth word and print its position in solution array
  }, [grid, dragend, storedLines, setDragend, setStroredLines]);

  document.body.style = 'background: #FFF6A7;';

  return (
    <div id="container" >
      <Header />
      <main className="main-content">
        <div id="game-components">
          <div className='ScoreBoard'>
            <h3 className='SideTitle'>Time</h3>
            <TimerUP secTimer={secTimer} setSecTimer={setSecTimer} hoursMinSecs={hoursMinSecs} words={grid[1]} />
            <Completed words={grid[1]} secTimer={secTimer}/>
          </div>
          <div className="grid-container" ref={grid_ref}>
            <SelectingBox ref={canvas} />
            {grid[0].map(cell => {
              return <GridCell
                key={cell[0]} index={cell[0]} letter={cell[1]} rand={cell[2]}
                dim={dim} can_ref={canvas} grid_ref={grid_ref}
                xy={xy} setXY={setXY} prevXY={prevXY} setPrevXY={setPrevXY}
                storedLines={storedLines} setStroredLines={setStroredLines}
                dragend={dragend} setDragend={setDragend} />
            })}
          </div>
          <div className='List'>
            <h3 className='SideTitle'>List of words</h3>
            <WordBook words={grid[1]} undoUpdate={undoUpdate} setUndoUpdate={setUndoUpdate}/>
          </div>
        </div>
        <div className='Button-container'>
          <UndoButton can_ref={canvas} xy={xy} storedLines={storedLines} setStroredLines={setStroredLines} solutions={grid} setGrid={setGrid} setUndoUpdate={setUndoUpdate} />
          <ResetButton />
          <SettingsButton pop_state={settingsPop} set_pop_state={setSettingsPop} />
          <ScoreButton pop_state={scorePop} set_pop_state={setScorePop} />
          {settingsPop ? <SettingsPopUP pop_state={settingsPop} set_pop_state={setSettingsPop} /> : null}
          {scorePop ? <ScoreboardPopUP pop_state={scorePop} set_pop_state={setScorePop} /> : null}
        </div>
      </main>
    </div >
  );
}

export default App;