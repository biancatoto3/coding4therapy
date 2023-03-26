import { javascriptGenerator }  from "blockly/javascript";

export const generator = Object.create(null);
generator['move_forward'] = function(block) {
    const moveForward = javascriptGenerator.provideFunction_(
        'moveForward',
        ['function ' + javascriptGenerator.FUNCTION_NAME_PLACEHOLDER_ +
            '(dist) {',
        '  // Move the sprite forward.',
        '  current_state[\'x\'] += dist;',
        '}']);
    // Generate the function call for this block.
    const code = `${moveForward}(1);\n`;
    return code;
};
