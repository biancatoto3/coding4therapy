/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import * as Blockly from "blockly";
import { blocks } from "./blocks";
import { generator_down, generator_left, generator_right, generator_up } from "./blocks_generator";
import { javascriptGenerator } from "blockly/javascript";
import { toolbox } from "./toolbox";
import "./index.css";
import blueimg from "./images/blue.png";
import busimg from "./images/bus.jpeg";
import tvimg from "./images/tv.jpeg";
import catimg from "./images/cat.png";
import boneimg from "./images/bone.jpeg";
import Interpreter from "js-interpreter";

// Register the blocks and generator with Blockly
Blockly.common.defineBlocks(blocks);
Object.assign(javascriptGenerator, generator_right);
Object.assign(javascriptGenerator, generator_down);
Object.assign(javascriptGenerator, generator_left);
Object.assign(javascriptGenerator, generator_up);

const grid = document.querySelector(".grid");
const blocklyDiv = document.getElementById("blocklyDiv");
const bluedogImage = document.getElementById("bluedogImage");
const busImage = document.getElementById("busImage");
const tvImage = document.getElementById("tvImage");
const catImage = document.getElementById("catImage");
const boneImage = document.getElementById("boneImage");

const runButton = document.querySelector("#runButton");
const resetButton = document.querySelector("#resetButton");
const form = document.getElementById("form");




const ws = Blockly.inject(blocklyDiv, {
    toolbox: toolbox,
    scrollbars: false,
    horizontalLayout: true,
    toolboxPosition: "end",
    trashcan: true,
});

let myInterpreter = null;
let runnerPid = 0;

function initInterpreterWaitForSeconds(interpreter, globalObject) {
    // Ensure function name does not conflict with variable names.
    javascriptGenerator.addReservedWords("waitForSeconds");

    const wrapper = interpreter.createAsyncFunction(function (
        timeInSeconds,
        callback
    ) {
        // Delay the call to the callback.
        setTimeout(callback, timeInSeconds * 1000);
    });
    interpreter.setProperty(globalObject, "waitForSeconds", wrapper);
}

function initApi(interpreter, globalObject) {
    let wrapper;
    wrapper = function () {
        return moveRight();
    };
    wrap("moveRight");
    wrapper = function () {
        return moveLeft();
    };
    wrap("moveLeft");
    wrapper = function () {
        return moveUp();
    };
    wrap("moveUp");
    wrapper = function () {
        return moveDown();
    };
    wrap("moveDown");

    function wrap(name){
        interpreter.setProperty(globalObject, name,
            interpreter.createNativeFunction(wrapper));
    }
    

    const wrapperAlert = function alert(text) {
        text = arguments.length ? text : "";
        outputArea.value += "\n" + text;
    };
    interpreter.setProperty(
        globalObject,
        "alert",
        interpreter.createNativeFunction(wrapperAlert)
    );

    // Add an API for the wait block.  See wait_block.js
    initInterpreterWaitForSeconds(interpreter, globalObject);
}

function resetStepUi() {
    clearTimeout(runnerPid);
    runButton.disabled = "";

    myInterpreter = null;
}

function runCode() {
    resetState();
    if (!myInterpreter) {
        // First statement of this code.
        // Clear the program output.
        resetStepUi();
        const latestCode = javascriptGenerator.workspaceToCode(ws);
        runButton.disabled = "disabled";

        // And then show generated code in an alert.
        // In a timeout to allow the outputArea.value to reset first.
        setTimeout(function () {
            // Begin execution
            myInterpreter = new Interpreter(latestCode, initApi);
            function runner() {
                if (myInterpreter) {
                    const hasMore = myInterpreter.run();
                    if (hasMore) {
                        // Execution is currently blocked by some async call.
                        // Try again later.
                        runnerPid = setTimeout(runner, 10);
                    } else {
                        // Program is complete.
                        checkGoalReached();
                    }
                }
            }
            runner();
        }, 1);
        return;
    }
}


/*let START_STATE = { x: 0, y: 0 };
let GOAL_STATE = { x: 0, y: 0 };*/
var START_STATE = { x: 0, y: 0 };
var GOAL_STATE = { x: 0, y: 0 };
const TV_STATE = { x: 3, y: 2 };
const BONE_STATE={x:1,y:1};
const CAT_STATE= {x:1,y:3};
let current_state = { ...START_STATE };
/*var start = document.getElementById("start");
const START_STATE = { x: 0, y: 1 };
const GOAL_STATE = { x: 5, y: 5 };
const TV_STATE = { x: 5, y: 4 };
const BONE_STATE={x:2,y:4};
const CAT_STATE= {x:1,y:1};
let current_state = { ...START_STATE };*/
let inErrorState = false;

const ROWS = 4;
const COLS = 4;

function initImages() {
    bluedogImage.src = blueimg;
    busImage.src = busimg;
    tvImage.src = tvimg;
    catImage.src = catimg;
    boneImage.src = boneimg;
}

function initButtons() {
    runButton.addEventListener("click", runCode);
    resetButton.addEventListener("click", resetState);
    

}

function drawGrid() {
    for (var i = 0; i < ROWS; i++) {
        for (var j = 0; j < COLS; j++) {
            var cell = document.createElement("div");
            cell.id = "cell" + i + "_" + j;
            cell.className = "cell";
            cell.textContent= (i+1)+","+(j+1);

            grid.appendChild(cell);
        }
    }
    
}

function moveImage(state, imgElement) {
    const cell = document.getElementById("cell" + state.x + "_" + state.y);
    const cellRect = cell.getBoundingClientRect();
    const imageRect = imgElement.getBoundingClientRect();
    const x = cellRect.left + cellRect.width / 2 - imageRect.width / 2;
    const y = cellRect.top + cellRect.height / 2 - imageRect.height / 2;
    imgElement.style.transform = `translate(${x}px, ${y}px)`;
}

function resetState() {
    current_state = { ...START_STATE };
    moveImage(START_STATE, bluedogImage);
    moveImage(GOAL_STATE, busImage);
    moveImage(TV_STATE, tvImage);
    moveImage(CAT_STATE, catImage);
    moveImage(BONE_STATE, boneImage);
    
    resetStepUi();
    inErrorState = false;
    grid.classList.remove("error");
}

function moveRight() {
    if (inErrorState) return;

    if (current_state.y < COLS - 1) {
        current_state.y++;
        moveImage(current_state, bluedogImage);
        if ((current_state.x === TV_STATE.x && current_state.y === TV_STATE.y) || (current_state.x === CAT_STATE.x && current_state.y === CAT_STATE.y) || (current_state.x === BONE_STATE.x && current_state.y === BONE_STATE.y)) {
            inErrorState=true;
            grid.classList.add("error");
            alert("You got distracted! Please try again");
        }
    } else {
        inErrorState = true;
        grid.classList.add("error");
        alert("uh oh! You have gone too far! Please try again.");
    }
}
function moveLeft(){
    if (inErrorState) return;

    if (current_state.y > 0) {
        current_state.y--;
        moveImage(current_state, bluedogImage);
        if ((current_state.x === TV_STATE.x && current_state.y === TV_STATE.y) || (current_state.x === CAT_STATE.x && current_state.y === CAT_STATE.y) || (current_state.x === BONE_STATE.x && current_state.y === BONE_STATE.y)) {
            inErrorState=true;
            grid.classList.add("error");
            alert("You got distracted! Please try again");
        }
    } else {
        inErrorState = true;
        grid.classList.add("error");
        alert("uh oh! You have gone too far! Please try again.");
    }
}
function moveUp(){
    if (inErrorState) return;

    if (current_state.x > 0) {
        current_state.x--;
        moveImage(current_state, bluedogImage);
        if ((current_state.x === TV_STATE.x && current_state.y === TV_STATE.y) || (current_state.x === CAT_STATE.x && current_state.y === CAT_STATE.y) || (current_state.x === BONE_STATE.x && current_state.y === BONE_STATE.y)) {
            inErrorState=true;
            grid.classList.add("error");
            alert("You got distracted! Please try again");
        }
    } else {
        inErrorState = true;
        grid.classList.add("error");
        alert("uh oh! You have gone too far! Please try again.");
    }
}
function moveDown(){
    if (inErrorState) return;
    if (current_state.x < ROWS - 1) {
        current_state.x++;
        moveImage(current_state, bluedogImage);
        if ((current_state.x === TV_STATE.x && current_state.y === TV_STATE.y) || (current_state.x === CAT_STATE.x && current_state.y === CAT_STATE.y) || (current_state.x === BONE_STATE.x && current_state.y === BONE_STATE.y)) { 
            inErrorState=true;
            grid.classList.add("error");
            alert("You got distracted! Please try again");
        }
    } else {
        inErrorState = true;
        grid.classList.add("error");
        alert("uh oh! You have gone too far! Please try again.");
    }
}

function checkGoalReached() {
    if (inErrorState) return;

    if (current_state.x === GOAL_STATE.x && current_state.y === GOAL_STATE.y) {
        alert("You have reached the goal!");
    } else {
        alert("You have not reached the goal. Please try again.");
    }
}

initImages();
initButtons();

drawGrid();

resetState();
form.addEventListener('submit', function(event) {
    event.preventDefault();

    // Retrieve selected options
    const startOption = document.getElementById('start').value.split(',');
    const stopOption = document.getElementById('goal').value.split(',');

    // Create coordinate objects
    START_STATE.x = parseInt(startOption[0]);
    START_STATE.y = parseInt(startOption[1]);
    GOAL_STATE.x = parseInt(stopOption[0]);
    GOAL_STATE.y = parseInt(stopOption[1]);

   /* const new_START_STATE = {
        x: parseInt(startOption[0]),
        y: parseInt(startOption[1])
    };
    const new_GOAL_STATE = {
        x: parseInt(stopOption[0]),
        y: parseInt(stopOption[1])
    };*/
    
    /*current_state={...START_STATE};
    moveImage(START_STATE, bluedogImage);
    moveImage(GOAL_STATE, busImage);
*/
    
    resetState();
});



// Every time the workspace changes state, save the changes to storage.
ws.addChangeListener((e) => {
    // UI events are things like scrolling, zooming, etc.
    // No need to save after one of these.
    if (e.isUiEvent) return;
    //save(ws);
});

// Whenever the workspace changes meaningfully, run the code again.
ws.addChangeListener((e) => {
    // Don't run the code when the workspace finishes loading; we're
    // already running it once when the application starts.
    // Don't run the code during drags; we might have invalid state.
    if (
        e.isUiEvent ||
        e.type == Blockly.Events.FINISHED_LOADING ||
        ws.isDragging()
    ) {
        return;
    }
});
