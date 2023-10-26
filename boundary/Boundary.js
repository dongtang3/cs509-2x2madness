export default function redrawCanvas(model, canvasObj) {
    // 检查 canvasObj 是不是 null 或 undefined
    if (!canvasObj) {
        return;
    }

    const ctx = canvasObj.getContext('2d');

    // 检查 ctx 是不是 null
    if (!ctx) {
        return;
    }
    console.log('About to call clearRect');
    ctx.clearRect(0, 0, canvasObj.width, canvasObj.height);
    console.log('Called clearRect');

    const gridSize = model.board.size;
    const squareSize = canvasObj.width / gridSize;
    const intersectionRadius = 10;

    // 计算内部四个方块交点的位置
    const intersectionPoints = [];
    for (let row = 1; row < gridSize; row++) {
        for (let col = 1; col < gridSize; col++) {
            intersectionPoints.push({
                x: col * squareSize,
                y: row * squareSize
            });
        }
    }

    for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
            const square = model.board.grid[row][col];

            // 默认填充颜色为白色
            ctx.fillStyle = 'white';
            
            if (square !== null) {
                ctx.fillStyle = square.color === 'empty' ? 'white' : square.color;
                ctx.fillRect(col * squareSize, row * squareSize, squareSize, squareSize);
            }
            
            // 绘制未选中时的黑色边框
            ctx.strokeStyle = 'black';
            ctx.lineWidth = 4;
            ctx.strokeRect(col * squareSize, row * squareSize, squareSize, squareSize);
        }
    }

    if (model.board.selected != null) {
        console.log(model.board.selected);  // Add this line for debugging
        model.board.selected.forEach(selectedSquare => {
            const { row: selectedRow, column: selectedColumn } = selectedSquare;
            ctx.strokeStyle = 'red';
            ctx.lineWidth = 4;
            ctx.strokeRect(selectedColumn * squareSize, selectedRow * squareSize, squareSize, squareSize);
        });
    }


    let selectedCenter;
    if (model.board.selected != null) {
        const selectedRows = model.board.selected.map(square => square.row);
        const selectedCols = model.board.selected.map(square => square.column);
        const centerRow = (Math.min(...selectedRows) + Math.max(...selectedRows)) / 2;
        const centerCol = (Math.min(...selectedCols) + Math.max(...selectedCols)) / 2;
        selectedCenter = { x: (centerCol + 0.5) * squareSize, y: (centerRow + 0.5) * squareSize };
    }

    // 绘制内部交点为白色圆圈
    intersectionPoints.forEach(point => {
        ctx.beginPath();
        ctx.arc(point.x, point.y, intersectionRadius, 0, 2 * Math.PI);

        // 检查该交点是否是选中组的中心点
        const isSelected = selectedCenter && point.x === selectedCenter.x && point.y === selectedCenter.y;
        ctx.fillStyle = isSelected ? 'red' : 'white';

        ctx.fill();

        // 绘制白色圆圈的边框
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 1;
        ctx.stroke();
    });
}
