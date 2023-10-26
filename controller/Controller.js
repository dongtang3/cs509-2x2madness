

function processClick(model, canvas, row, col,forceRedraw) {

    if (model.board.isSolved()) {
        // 如果游戏已经解决，强制重新渲染
        forceRedraw(prev => prev + 1);
    }

    console.log(`Row: ${row}, Col: ${col}`);
 
    // 检查是否在有效位置
    if (isValidPosition(row, col, model.board.size) && isValidGroupPosition(row, col, model.board.size)) {
        // 设置选中的组
        model.board.selectGroup(row, col);
     
    } else {
        console.log("Invalid position or group selection.");
    }
}

function isValidPosition(row, col, size) {
    return row >= 0 && row < size && col >= 0 && col < size;
}

function isValidGroupPosition(row, col, size) {
    // 检查2x2组是否在有效位置
    return isValidPosition(row, col, size) &&
        isValidPosition(row + 1, col, size) &&
        isValidPosition(row, col + 1, size) &&
        isValidPosition(row + 1, col + 1, size);
}

export default processClick;

