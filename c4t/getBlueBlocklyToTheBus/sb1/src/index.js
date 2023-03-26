//create a blockly game that uses the move forward custom block I defined in blocks.js to move a custom sprite image forward two spaces to a custom goal image on the goal state. Use a grid to display. Execute the users code to see if it works. If it does, then the user has won the game. If not, then the user has lost the game. The user can try again.
// Create a 5x5 grid
import * as Blockly from 'blockly/core';
import {blocks} from './blocks.js';
import {generator} from './blocks_generator.js';
import {toolbox} from './toolbox.js';
import './index.css';

// Register the blocks and generator with Blockly
Blockly.common.defineBlocks(blocks);
Object.assign(javascriptGenerator, generator);


const ROWS = 5;
const COLS = 5;
const CELL_SIZE = 50;
//const canvas = document.getElementById('canvas');
//const ctx = canvas.getContext('2d');
//canvas.width = COLS * CELL_SIZE;
//canvas.height = ROWS * CELL_SIZE;
//const codeDiv = document.getElementById('generatedCode').firstChild;
//const outputDiv = document.getElementById('output');
var svgMaze = document.getElementById('svgMaze');
const blocklyDiv = document.getElementById('blocklyDiv');
const ws = Blockly.inject(blocklyDiv, {toolbox});

/*function drawGrid() {
  for (let i = 0; i <= canvas.width; i += CELL_SIZE) {
    ctx.moveTo(i, 0);
    ctx.lineTo(i, canvas.height);
  }
  for (let i = 0; i <= canvas.height; i += CELL_SIZE) {
    ctx.moveTo(0, i);
    ctx.lineTo(canvas.width, i);
  }
  ctx.strokeStyle = 'lightgray';
  ctx.stroke();
}*/
function drawMap(){
  svgMaze.setAttribute("width", COLS * CELL_SIZE);
  svgMaze.setAttribute("height", ROWS * CELL_SIZE);
  for (let i = 0; i <= svgMaze.height; i += CELL_SIZE) {
    for (let j = 0; j <= svgMaze.width; j += CELL_SIZE) {
      var rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
      rect.setAttribute("x", j);
      rect.setAttribute("y", i);
      rect.setAttribute("width", CELL_SIZE);
      rect.setAttribute("height", CELL_SIZE);
      rect.setAttribute("fill", "lightgray");
      svgMaze.appendChild(rect);
      if (i==0 || j==0 || i==4 || j==4){
        rect.setAttribute("fill", "black");
      }else if (i==1 && j==1){
        var image = document.createElementNS("http://www.w3.org/2000/svg", "image");
        image.setAttribute("x", j);
        image.setAttribute("y", i);
        image.setAttribute("width", CELL_SIZE);
        image.setAttribute("height", CELL_SIZE);
        image.setAttribute("href", "coding4therpy/c4t/images/blue.png");

      }else if (i==1 && j==3){
        var image = document.createElementNS("http://www.w3.org/2000/svg", "image");
        image.setAttribute("x", j);
        image.setAttribute("y", i);
        image.setAttribute("width", CELL_SIZE);
        image.setAttribute("height", CELL_SIZE);
        image.setAttribute("href", "coding4therpy/c4t/images/bus.png");
      }
    }
  } 
}

// Load sprite and goal image on the grid
/*const spriteImage = new Image();
spriteImage.src = 'coding4therpy/c4t/images/blue.png';
const goalImage = new Image();
goalImage.src = 'coding4therpy/c4t/images/bus.png';

function loadImage(image, x, y) {
  image.onload = function() {
    ctx.drawImage(image, x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
  }
}*/

// Set start and goal states
const START_STATE = { x: 1, y: 1 };
const GOAL_STATE = { x: 3, y: 1 };
var current_state = START_STATE;

// Draw grid and load sprite and goal image
/*drawGrid();
loadImage(spriteImage, START_STATE.x, START_STATE.y);
loadImage(goalImage, GOAL_STATE.x, GOAL_STATE.y);*/
drawMap();

//create a tool box with the move forward block in it
// https://developers.google.com/blockly/guides/create-custom-blocks/toolbox
// https://developers.google.com/blockly/guides/create-custom-blocks/toolbox#blockly_toolbox_definition


//create a workspace with the tool box in it
// https://developers.google.com/blockly/guides/create-custom-blocks/toolbox#blockly_toolbox_definition


// log and execute the users code. if the users code moves the sprite to the goal state, then the user has won the game. if not, then the user has lost the game. the user can try again.

// https://developers.google.com/blockly/guides/create-custom-blocks/generator
// https://developers.google.com/blockly/guides/create-custom-blocks/generator#blockly_generator_definition
const codeGenerator = new JavaScriptGenerator();
const runButton = document.getElementById('runButton');
runButton.addEventListener('click', () => {


    const code = codeGenerator.workspaceToCode(ws);
    codeDiv.innerText = code;

    outputDiv.innerHTML = '';

    eval(code);
});



