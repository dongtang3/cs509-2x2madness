//app.js
import React from 'react';
import './App.css';
import Model from './model/Model.js'
import redrawCanvas from './boundary/Boundary.js';
import processClick from './controller/Controller.js';

import resetHandler from './controller/ResetController.js';
import { config_4x4, config_5x5, config_6x6 } from "./configs"
function App() {
  const [selectedConfig, setSelectedConfig] = React.useState(config_4x4); // 默认选择4x4配置

  const [model, setModel] = React.useState(new Model(selectedConfig))
  const [redraw, forceRedraw] = React.useState(0);
  const [showCongrats, setShowCongrats] = React.useState(false);
  const appRef = React.useRef(null);      // to be able to access "top level" app object
  const canvasRef = React.useRef(null);   // need to be able to refer to Canvas

  // identify WHAT STATE you monitor
  React.useEffect(() => {
    redrawCanvas(model, canvasRef.current, appRef.current)
  }, [model, redraw])

  React.useEffect(() => {
    // 当 model.board.victory 变化时，这个 useEffect 钩子将被触发
    if (model.board.victory) {
      forceRedraw(prev => prev + 1);
    }
  }, [model.board.victory]);

  React.useEffect(() => {
    console.log("Model moves updated:", model.board.moves);

    redrawCanvas(model, canvasRef.current, appRef.current);
  }, [model, model.board.moves, redraw]);


  const handleConfigChange = (config) => {
    setSelectedConfig(config);
    setModel(new Model(config));
  };

  const squareSize = 400 / model.board.size; // 假设画布大小为 400x400

  const handleClick = (e) => {
    console.log(e)
    const canvasRect = canvasRef.current.getBoundingClientRect();

    // normalizing RAW point into localized canvas coordinates.
    let x = e.clientX - canvasRect.left;
    let y = e.clientY - canvasRect.top;

    // 计算点击的行和列
    let clickedRow = Math.floor(y / squareSize);
    let clickedCol = Math.floor(x / squareSize);

    // 计算2x2组的左上角的行和列
    let groupRow = clickedRow >= 1 ? clickedRow - 1 : clickedRow;
    let groupCol = clickedCol >= 1 ? clickedCol - 1 : clickedCol;

    processClick(model, canvasRef.current, groupRow, groupCol, forceRedraw);

    forceRedraw(prev => prev + 1);
  }


  const rotateClockwise = (e) => {
    console.log(e)
    model.board.rotateGroup(true);

    // // 强制重新渲染
    console.log("Force Redraw Called");

    forceRedraw(prev => prev + 1);

  };

  const rotateCounterClockwise = (e) => {
    console.log(e)
    model.board.rotateGroup(false);

    // // 强制重新渲染
    console.log("Force Redraw Called");

    forceRedraw(prev => prev + 1);

  };
  return (
    <div className="App">
    <canvas
      data-testid="canvas"
      tabIndex="1"
      className="App-canvas"
      ref={canvasRef}
      width="400"
      height="400"
      onClick={handleClick}
    />
  
    <div className="controls">
      <button className="button config_4x4" onClick={() => handleConfigChange(config_4x4)}>Select 4x4</button>
      <button className="button config_5x5" onClick={() => handleConfigChange(config_5x5)}>Select 5x5</button>
      <button className="button config_6x6" onClick={() => handleConfigChange(config_6x6)}>Select 6x6</button>
  
      <button className="button rotateClockwise_button" onClick={rotateClockwise}>Rotate Clockwise</button>
      <button className="button rotateCounterClockwise_button" onClick={rotateCounterClockwise}>Rotate Counter-Clockwise</button>
  
      <label className="label move_count">Moves: {model.board.moves}</label>
      <label className="label game_status">Game Status: {model.board.victory ? 'Victory!' : 'Keep Going'}</label>
  
      <button className="button reset_button" onClick={(e) => resetHandler(model, canvasRef.current, forceRedraw)}>Reset</button>
    </div>
  </div>
  
  );
}

export default App;
