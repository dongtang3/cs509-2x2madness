import Model from './model/Model.js';
import { Board, Square, Group} from './model/Model.js'; 

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';
import { isValidPosition } from './controller/Controller.js';
import redrawCanvas from './boundary/Boundary.js';
import { config_4x4, config_5x5, config_6x6 } from "./configs";

const mockCtx = {
  clearRect: jest.fn(),
  fillRect: jest.fn(),
  strokeRect: jest.fn(),
  beginPath: jest.fn(),
  arc: jest.fn(),
  fill: jest.fn(),
  stroke: jest.fn(),
};


const mockModel = {
  board: {
    size: 4,
    grid: Array(4).fill(Array(4).fill({ color: 'red' })), 
    selected: null,

  },

};

describe('Boundary - redrawCanvas', () => {
  let canvasObj;

  beforeEach(() => {
    // Create a real canvas object
    canvasObj = document.createElement('canvas');
    canvasObj.width = 400;
    canvasObj.height = 400;
    // Mock the getContext method to return our mock context
    canvasObj.getContext = jest.fn().mockReturnValue(mockCtx);
  });

  test('should clear the canvas', () => {
    redrawCanvas(mockModel, canvasObj);
    expect(mockCtx.clearRect).toHaveBeenCalledWith(0, 0, canvasObj.width, canvasObj.height);
  });

  test('should draw squares', () => {
    redrawCanvas(mockModel, canvasObj);
    expect(mockCtx.fillRect).toHaveBeenCalled();
  });
});




describe('Model and Board functionalities', () => {
  let model;
  let board;

  beforeEach(() => {
    jest.clearAllMocks();

    model = new Model(config_4x4);
    board = model.board;
  });

  test('Model initialization', () => {
    expect(model).toBeDefined();
    expect(model.board).toBeInstanceOf(Board);
    expect(model.configs).toEqual([config_4x4, config_5x5, config_6x6]);  // Assume config_5x5 and config_6x6 are imported
  });

  test('Board initialization', () => {
    expect(board.size).toBe(4);
    expect(board.moves).toBe(0);
    expect(board.victory).toBeFalsy();
    expect(board.grid).toHaveLength(4);
    expect(board.grid[0][0]).toBeInstanceOf(Square);

  });


  test('Board - calculateSelectedCenter', () => {
    board.selectGroup(0, 0);
    const center = board.calculateSelectedCenter();
    expect(center).toEqual({ row: 0, column: 0 });

  });

  test('Board - isSolved', () => {
    // Mock a solved board
    board.grid = board.grid.map(row => row.map(cell => ({ ...cell, color: 'empty' })));
    expect(board.isSolved()).toBeTruthy();
  });

  test('should identify if all squares in a group are empty', () => {
    const group = [
      new Square(0, 0, 'empty'),
      new Square(0, 1, 'empty'),
      new Square(1, 0, 'empty'),
      new Square(1, 1, 'empty'),
    ];
    expect(board.isEmpty(group)).toBe(true);

    group[0].color = 'blue';
    expect(board.isEmpty(group)).toBe(false);
  });

  describe('Square class', () => {
    test('should initialize with the provided values', () => {
      const square = new Square(1, 2, 'red');
      expect(square.row).toBe(1);
      expect(square.column).toBe(2);
      expect(square.color).toBe('red');
    });
  });

  describe('Group class', () => {
    test('should initialize with the provided values', () => {
      const group = new Group(1, 2);
      expect(group.x).toBe(1);
      expect(group.y).toBe(2);
    });
  });

  test('should correctly identify a solved board', () => {
    board.grid = Array.from(Array(board.size), () => Array(board.size).fill(new Square(0, 0, 'empty')));
    expect(board.isSolved()).toBe(true);

    board.grid[0][0].color = 'red';
    expect(board.isSolved()).toBe(false);
  });

  test('should clear selection', () => {
    board.selected = [new Square(0, 0, 'red'), new Square(0, 1, 'blue')];
    board.clearSelection();
    expect(board.selected).toBeNull();
  });

  test('should select a group', () => {
    const selection = board.selectGroup(0, 0);
    expect(selection.group).toBeDefined();
    expect(selection.group.length).toBeGreaterThan(0);

  });

  test('should rotate a group', () => {
    board.selectGroup(0, 0);
    const initialColor = board.grid[0][1].color;
    board.rotateGroup(true);
    expect(board.grid[0][1].color).not.toBe(initialColor);  
  });


});



test('changes 4x4configuration when config buttons are clicked', () => {
  const { getByText } = render(<App />);
  fireEvent.click(getByText('Select 4x4'));
  const moveCountElement = getByText(/Moves: 0/i);
  expect(moveCountElement).toBeInTheDocument();
});

test('changes 5x5configuration when config buttons are clicked', () => {
  const { getByText } = render(<App />);
  fireEvent.click(getByText('Select 5x5'));
  const moveCountElement = getByText(/Moves: 0/i);
  expect(moveCountElement).toBeInTheDocument();
});

test('changes 6x6configuration when config buttons are clicked', () => {
  const { getByText } = render(<App />);
  fireEvent.click(getByText('Select 6x6'));
  const moveCountElement = getByText(/Moves: 0/i);
  expect(moveCountElement).toBeInTheDocument();
});


test('renders learn react link', () => {
  const { getByText } = render(<App />);
  const moveCountElement = getByText(/Moves: \d+/i);
  expect(moveCountElement).toBeInTheDocument();

  // must call 'npm install canvas'
  const canvasElement = screen.getByTestId('canvas');
  fireEvent.click(canvasElement, { clientX: 70, clientY: 69, screenX: 1637, screenY: 269 })
});

test('rotates group when rotate clockwise buttons are clicked', () => {
  const { getByText } = render(<App />);
  const canvasElement = screen.getByTestId('canvas');
  fireEvent.click(canvasElement, { clientX: 504, clientY: 197, screenX: 2211, screenY: 306 });
  fireEvent.click(getByText('Rotate Clockwise'));

  const moveCountElement = getByText(/Moves: 0/i);
  expect(moveCountElement).toBeInTheDocument();
});

test('rotates group when Counter-Clockwise buttons are clicked', () => {
  const { getByText } = render(<App />);
  const canvasElement = screen.getByTestId('canvas');
  fireEvent.click(canvasElement, { clientX: 463, clientY: 314, screenX: 2170, screenY: 323 });
  fireEvent.click(getByText('Rotate Counter-Clockwise'));

  const moveCountElement = getByText(/Moves: 0/i);
  expect(moveCountElement).toBeInTheDocument();
});
test('displays victory message when game is won', () => {
  const { getByText } = render(<App />);
  const victoryMessageElement = getByText('Game Status: Keep Going');
  expect(victoryMessageElement).toBeInTheDocument();
});

test("renders App component", () => {
  render(<App />);
});


test("handle Reset button", () => {
  const { getByText } = render(<App />);
  fireEvent.click(getByText("Reset"));
  expect(getByText('Moves: 0')).toBeInTheDocument();
});
