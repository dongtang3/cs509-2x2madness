//model.js
import { config_4x4, config_5x5, config_6x6 } from "../configs"


export class Group {
    constructor(x, y) {
        this.x = x
        this.y = y;
    }
}

export class Square {
    constructor(r, c, color) {
        this.row = r
        this.column = c
        this.color = color
    }
}

export class Board {
    constructor(config) {
        this.moves = 0;
        this.victory = false;
        this.selected = null; // 0代表没有group，1代表选中一个group
        this.squares = []
        this.size = parseInt(config.numColumns)
        this.grid = this.initializeBoard(config.baseSquares);
        this.board = this.grid;
        for (let csq of config.baseSquares) {
            //  { "color" : "green", "row": "0", "column" : "0" },
            let sq = new Square(parseInt(csq.row), parseInt(csq.column), csq.color)
            this.squares.push(sq)
        }
    }
    calculateSelectedCenter() {



        if (this.selected) {
            let totalRow = 0;
            let totalColumn = 0;

            this.selected.forEach(square => {
                totalRow += square.row;
                totalColumn += square.column;
            });

            const averageRow = totalRow / this.selected.length;
            const averageColumn = totalColumn / this.selected.length;
            console.log("Center X:", Math.floor(averageColumn));
            console.log("Center Y:", Math.floor(averageRow));
            return {
                row: Math.floor(averageRow),
                column: Math.floor(averageColumn)
            };
        }

        return null;
    }
    //empty
    initializeBoard(baseSquares) {
        let grid = Array.from(Array(this.size), () => new Array(this.size).fill(null)); // Initialize with null values
        baseSquares.forEach(square => {
            let row = parseInt(square.row);
            let col = parseInt(square.column);
            let color = square.color || 'empty'; // Use a default color if color is not specified
            if (!isNaN(row) && !isNaN(col) && color !== null && color !== undefined && row >= 0 && row < this.size && col >= 0 && col < this.size) {
                grid[row][col] = new Square(row, col, color); // Use Square object only if it's within the grid bounds and has a valid color
            }
        });
        return grid;
    }



    isAllSame(group) {
        const colors = new Set(group.map(square => square.color));
        return colors.size === 1;
    }
    isEmpty(group) {
        return group.every(square => square.color === 'empty');
    }


    isSolved() {
        for (let r = 0; r < this.size; r++) {
            for (let c = 0; c < this.size; c++) {
                if (this.grid[r][c] && this.grid[r][c].color !== 'empty') {
                    return false;
                }
            }
        }
        this.victory = true;
        return true;
    }



    clearSelection() {
        for (let r = 0; r < this.size; r++) {
            for (let c = 0; c < this.size; c++) {
                if (this.grid[r][c] && this.grid[r][c].selected) {
                    delete this.grid[r][c].selected;
                }
            }
        }
        this.selected = null;
    }

    selectGroup(row, col) {

        let group = [];

        // 保证不超过网格的边界
        const maxRow = Math.min(row + 1, this.size - 1);
        const maxCol = Math.min(col + 1, this.size - 1);


        for (let r = row; r <= maxRow; r++) {
            for (let c = col; c <= maxCol; c++) {
                if (this.grid[r][c]) {
                    group.push(this.grid[r][c]);
                } else {
                    // 如果方块不存在，则创建一个新的空方块
                    this.grid[r][c] = new Square(r, c, 'empty');
                    group.push(this.grid[r][c]);
                }
            }
        }

        if (!this.isEmpty(group)) {

            // Update selected property
            this.selected = group; // 选中一个group
            if (this.isAllSame(group)) {
                this.removeGroup(row, col);
            }
        } else {
            // Update selected property
            this.selected = null; // 没有选中group
        }

        console.log("Selected Group: ", this.selected);

        return {
            group: this.selected

        };
    }

    rotateGroup(clockwise) {
        if (this.selected) {
            const group = this.selected;
            const row = group[0].row;
            const col = group[0].column;

            // 初始化一个2x2矩阵，使用存在的方块的颜色填充
            const groupMatrix = [
                [this.grid[row][col] ? this.grid[row][col].color : 'empty',
                this.grid[row][col + 1] ? this.grid[row][col + 1].color : 'empty'],
                [this.grid[row + 1][col] ? this.grid[row + 1][col].color : 'empty',
                this.grid[row + 1][col + 1] ? this.grid[row + 1][col + 1].color : 'empty']
            ];

            let rotatedGroupMatrix;
            if (clockwise) {
                rotatedGroupMatrix = rotateClockwise(groupMatrix);
            } else {
                rotatedGroupMatrix = rotateCounterClockwise(groupMatrix);
            }

            // 创建一个新的方块对象，如果方块不存在
            this.grid[row][col] = this.grid[row][col] || new Square(row, col, 'empty');
            this.grid[row][col + 1] = this.grid[row][col + 1] || new Square(row, col + 1, 'empty');
            this.grid[row + 1][col] = this.grid[row + 1][col] || new Square(row + 1, col, 'empty');
            this.grid[row + 1][col + 1] = this.grid[row + 1][col + 1] || new Square(row + 1, col + 1, 'empty');

            // 更新旋转后的颜色值
            this.grid[row][col].color = rotatedGroupMatrix[0][0];
            this.grid[row][col + 1].color = rotatedGroupMatrix[0][1];
            this.grid[row + 1][col].color = rotatedGroupMatrix[1][0];
            this.grid[row + 1][col + 1].color = rotatedGroupMatrix[1][1];

            this.moves++;
        }
    }

    removeGroup() {
        if (this.selected) {
            const group = this.selected;
            const firstColor = group[0].color;
            if (group.every(square => square.color === firstColor)) {
                const row = group[0].row;
                const col = group[0].column;
                for (let r = row; r < row + 2; r++) {
                    for (let c = col; c < col + 2; c++) {
                        this.grid[r][c].color = 'empty'; // 或者使用合适的空色值替代 'empty'
                    }
                }
                this.selected = null;
                this.moves++;

            }
            this.isSolved();
        }
    }



}

function rotateClockwise(matrix) {
    const N = matrix.length - 1;
    const result = matrix.map((row, i) =>
        row.map((val, j) => matrix[N - j][i])
    );
    return result;
}
function rotateCounterClockwise(matrix) {
    const N = matrix.length - 1;
    const result = matrix.map((row, i) =>
        row.map((val, j) => matrix[j][N - i])
    );
    return result;
}
export default class Model {
    constructor(config) {
        this.configs = [config_4x4, config_5x5, config_6x6];
        this.currentConfig = config;
        this.board = new Board(config);
    }


    reset() {
        // 重置游戏板
        this.board = new Board(this.currentConfig);

        // 取消选中的组
        this.board.clearSelection();

        // 重置移动次数
        this.board.moves = 0;

        // 将胜利状态重置为 false（如果需要的话）
        this.board.victory = false;
    }
}