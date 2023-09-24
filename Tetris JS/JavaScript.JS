<!DOCTYPE html>
<html>
<head>
    <title>Tetris</title>
    <style>
        canvas {
            border: 2px solid black;
            display: block;
            margin: 0 auto;
        }
    </style>
</head>
<body>
    <canvas id="tetris" width="300" height="600"></canvas>
    <script>
        const canvas = document.getElementById("tetris");
        const context = canvas.getContext("2d");
        const ROWS = 20;
        const COLUMNS = 10;
        const BLOCK_SIZE = 30;
        const EMPTY = "white";

        const board = Array.from({ length: ROWS }, () => Array(COLUMNS).fill(EMPTY));

        function drawBlock(x, y, color) {
            context.fillStyle = color;
            context.fillRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
            context.strokeStyle = "black";
            context.strokeRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
        }

        function drawBoard() {
            for (let row = 0; row < ROWS; row++) {
                for (let col = 0; col < COLUMNS; col++) {
                    drawBlock(col, row, board[row][col]);
                }
            }
        }

        const currentPiece = {
            x: 0,
            y: 0,
            shape: [[1, 1, 1, 1]],
            color: "cyan",
        };

        function drawCurrentPiece() {
            const { x, y, shape, color } = currentPiece;
            shape.forEach((row, i) => {
                row.forEach((value, j) => {
                    if (value) {
                        drawBlock(x + j, y + i, color);
                    }
                });
            });
        }

        function collide() {
            const { x, y, shape } = currentPiece;
            for (let i = 0; i < shape.length; i++) {
                for (let j = 0; j < shape[i].length; j++) {
                    if (shape[i][j] && (board[y + i] && board[y + i][x + j]) !== EMPTY) {
                        return true;
                    }
                }
            }
            return false;
        }

        function fixPiece() {
            const { x, y, shape, color } = currentPiece;
            shape.forEach((row, i) => {
                row.forEach((value, j) => {
                    if (value) {
                        if (board[y + i]) {
                            board[y + i][x + j] = color;
                        }
                    }
                });
            });
        }

        function moveDown() {
            currentPiece.y++;
            if (collide()) {
                currentPiece.y--;
                fixPiece();
                spawnPiece();
                if (collide()) {
                    alert("Game Over");
                    location.reload();
                }
            }
        }

        function moveLeft() {
            currentPiece.x--;
            if (collide()) {
                currentPiece.x++;
            }
        }

        function moveRight() {
            currentPiece.x++;
            if (collide()) {
                currentPiece.x--;
            }
        }

        function rotatePiece() {
            const originalShape = currentPiece.shape;
            const rotatedShape = [];
            const newWidth = originalShape.length;
            const newHeight = originalShape[0].length;

            for (let i = 0; i < newHeight; i++) {
                rotatedShape.push(new Array(newWidth).fill(0));
            }

            for (let i = 0; i < originalShape.length; i++) {
                for (let j = 0; j < originalShape[i].length; j++) {
                    rotatedShape[j][newHeight - i - 1] = originalShape[i][j];
                }
            }

            const originalX = currentPiece.x;
            const originalY = currentPiece.y;
            currentPiece.shape = rotatedShape;
            if (collide()) {
                currentPiece.x = originalX;
                currentPiece.y = originalY;
                currentPiece.shape = originalShape;
            }
        }

        function spawnPiece() {
            const pieces = [
                { shape: [[1, 1, 1, 1]], color: "cyan" },
                { shape: [[1, 1], [1, 1]], color: "yellow" },
                { shape: [[1, 1, 1], [0, 0, 1]], color: "purple" },
                { shape: [[1, 1, 1], [0, 1, 0]], color: "green" },
                { shape: [[1, 1, 1], [1, 0, 0]], color: "red" },
                { shape: [[1, 1, 1], [0, 0, 1]], color: "blue" },
                { shape: [[1, 1, 1], [0, 1, 1]], color: "orange" },
            ];

            const randomPiece = pieces[Math.floor(Math.random() * pieces.length)];
            currentPiece.shape = randomPiece.shape;
            currentPiece.color = randomPiece.color;
            currentPiece.x = Math.floor(COLUMNS / 2) - Math.floor(currentPiece.shape[0].length / 2);
            currentPiece.y = 0;
        }

        function gameLoop() {
            drawBoard();
            drawCurrentPiece();
            moveDown();
            setTimeout(gameLoop, 500);
        }

        spawnPiece();
        gameLoop();

        window.addEventListener("keydown", (event) => {
            switch (event.key) {
                case "ArrowLeft":
                    moveLeft();
                    break;
                case "ArrowRight":
                    moveRight();
                    break;
                case "ArrowDown":
                    moveDown();
                    break;
                case "ArrowUp":
                    rotatePiece();
                    break;
            }
        });
    </script>
</body>
</html>
