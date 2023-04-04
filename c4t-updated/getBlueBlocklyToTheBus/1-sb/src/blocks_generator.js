import { javascriptGenerator } from "blockly/javascript";

export const generator = Object.create(null);

generator["move_right"] = function (block) {
    return `moveRight();\nwaitForSeconds(1);\n`;
};
