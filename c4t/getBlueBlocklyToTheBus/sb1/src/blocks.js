// create custom blockly move forward block and generator stub
// https://developers.google.com/blockly/guides/create-custom-blocks/define-blocks
// https://developers.google.com/blockly/guides/create-custom-blocks/define-blocks#blockly_block_definition
import * as Blockly from 'blockly/core';


// init = function() {
// Blockly.Blocks['move_forward'] = {
//     init: function() {
//       this.appendDummyInput()
//           .appendField("Move Forward");
//       this.setPreviousStatement(true, null);
//       this.setNextStatement(true, null);
//       this.setColour(230);
//       this.setTooltip("");
//       this.setHelpUrl("");
//     }
//   };

  
//   Blockly.JavaScript['move_forward'] = function(block) {
//     // Generate JavaScript code for moving character forward one space
//     var code = 'moveForward(1);\n';
//     return code;
//   };
// };
const moveForward = {
    'type': 'move_forward',
    'message0': 'Move Forward',
    'previousStatement': null,
    'nextStatement': null,
    'colour': 230,
    'tooltip': '',
    'helpUrl': ''
    };
export const blocks = Blockly.common.createBlockDefinitionsFromJsonArray(   [moveForward]);