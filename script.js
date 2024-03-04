//Create the Piece classes
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var Piece = /** @class */ (function () {
    function Piece(position, color, value, name, aparence) {
        this.positionX = position[0];
        this.positionY = position[1];
        this.value = value;
        this.name = name;
        this.color = color;
        this.aparence = this.setAparence(aparence);
    }
    Piece.prototype.setAparence = function (aparence) {
        return aparence.black;
    };
    return Piece;
}());
var Pawn = /** @class */ (function (_super) {
    __extends(Pawn, _super);
    function Pawn(position, color) {
        var _this = _super.call(this, position, color, 1, "Peão", { white: "♟", black: "♙" }) || this;
        _this.neverMoved = true;
        return _this;
    }
    Pawn.prototype.moveSet = function () {
        var moveSet = [];
        if (this.color == 'white')
            return this.moveSetWhite(moveSet);
        else
            return this.moveSetBlack(moveSet);
    };
    Pawn.prototype.moveSetBlack = function (moveSet) {
        var move;
        var piece;
        //Move set to one square move
        move = [this.positionX, this.positionY - 1];
        if (!foundPieceBySquare(move)) {
            moveSet.push(move);
            //Move set to the second square move
            move = [this.positionX, this.positionY - 2];
            if (this.neverMoved && !foundPieceBySquare(move))
                moveSet.push(move);
        }
        //Move set to take moves
        move = [this.positionX - 1, this.positionY - 1];
        piece = foundPieceBySquare(move);
        if (piece && piece.color != turn)
            moveSet.push(move);
        move = [this.positionX + 1, this.positionY - 1];
        piece = foundPieceBySquare(move);
        if (piece && piece.color != turn)
            moveSet.push(move);
        return moveSet;
    };
    Pawn.prototype.moveSetWhite = function (moveSet) {
        var move;
        var piece;
        //Move set to one square move
        move = [this.positionX, this.positionY + 1];
        if (!foundPieceBySquare(move)) {
            moveSet.push(move);
            //Move set to the second square move
            move = [this.positionX, this.positionY + 2];
            if (this.neverMoved && !foundPieceBySquare(move))
                moveSet.push(move);
        }
        //Move set to take moves
        move = [this.positionX - 1, this.positionY + 1];
        piece = foundPieceBySquare(move);
        if (piece && piece.color != turn)
            moveSet.push(move);
        move = [this.positionX + 1, this.positionY + 1];
        piece = foundPieceBySquare(move);
        if (piece && piece.color != turn)
            moveSet.push(move);
        return moveSet;
    };
    return Pawn;
}(Piece));
var Rook = /** @class */ (function (_super) {
    __extends(Rook, _super);
    function Rook(position, color) {
        return _super.call(this, position, color, 5, "Torre", { white: "♜", black: "♖" }) || this;
    }
    Rook.prototype.moveSet = function () {
        var moveSet = [];
        moveSet = this.moveSetTopBottom(moveSet);
        moveSet = this.moveSetRightLeft(moveSet);
        return moveSet;
    };
    Rook.prototype.moveSetTopBottom = function (moveSet) {
        var move;
        var piece;
        for (var i = this.positionY + 1; i <= 8; i++) {
            move = [this.positionX, i];
            piece = foundPieceBySquare(move);
            if (piece) {
                if (piece.color != turn) {
                    moveSet.push(move);
                }
                break;
            }
            moveSet.push([this.positionX, i]);
        }
        for (var i = this.positionY - 1; i >= 1; i--) {
            move = [this.positionX, i];
            piece = foundPieceBySquare(move);
            if (piece) {
                if (piece.color != turn) {
                    moveSet.push(move);
                }
                break;
            }
            moveSet.push([this.positionX, i]);
        }
        return moveSet;
    };
    Rook.prototype.moveSetRightLeft = function (moveSet) {
        var move;
        var piece;
        for (var i = this.positionX + 1; i <= 8; i++) {
            move = [i, this.positionY];
            piece = foundPieceBySquare(move);
            if (piece) {
                if (piece.color != turn) {
                    moveSet.push(move);
                }
                break;
            }
            moveSet.push([i, this.positionY]);
        }
        for (var i = this.positionX - 1; i >= 1; i--) {
            move = [i, this.positionY];
            piece = foundPieceBySquare(move);
            if (piece) {
                if (piece.color != turn) {
                    moveSet.push(move);
                }
                break;
            }
            moveSet.push([i, this.positionY]);
        }
        return moveSet;
    };
    return Rook;
}(Piece));
var Knight = /** @class */ (function (_super) {
    __extends(Knight, _super);
    function Knight(position, color) {
        return _super.call(this, position, color, 3, "Cavalo", { white: "♞", black: "♘" }) || this;
    }
    Knight.prototype.moveSet = function () {
        var moveSet = [];
        var moveLeftTop = checkIfPositionsExists([this.positionX - 2, this.positionY + 1]);
        if (moveLeftTop)
            moveSet.push(moveLeftTop);
        var moveLeftBottom = checkIfPositionsExists([this.positionX - 2, this.positionY - 1]);
        if (moveLeftBottom)
            moveSet.push(moveLeftBottom);
        var moveTopLeft = checkIfPositionsExists([this.positionX + 1, this.positionY + 2]);
        if (moveTopLeft)
            moveSet.push(moveTopLeft);
        var moveTopRight = checkIfPositionsExists([this.positionX - 1, this.positionY + 2]);
        if (moveTopRight)
            moveSet.push(moveTopRight);
        var moveRightTop = checkIfPositionsExists([this.positionX + 2, this.positionY + 1]);
        if (moveRightTop)
            moveSet.push(moveRightTop);
        var moveRightBottom = checkIfPositionsExists([this.positionX + 2, this.positionY - 1]);
        if (moveRightBottom)
            moveSet.push(moveRightBottom);
        var moveBottomRight = checkIfPositionsExists([this.positionX + 1, this.positionY - 2]);
        if (moveBottomRight)
            moveSet.push(moveBottomRight);
        var moveBottomLeft = checkIfPositionsExists([this.positionX - 1, this.positionY - 2]);
        if (moveBottomLeft)
            moveSet.push(moveBottomLeft);
        return moveSet;
    };
    return Knight;
}(Piece));
var Bishop = /** @class */ (function (_super) {
    __extends(Bishop, _super);
    function Bishop(position, color) {
        return _super.call(this, position, color, 3, "Bispo", { white: "♝", black: "♗" }) || this;
    }
    Bishop.prototype.moveSet = function () {
        var moveSet = [];
        moveSet = this.moveSetTopLeft(moveSet);
        moveSet = this.moveSetTopRight(moveSet);
        moveSet = this.moveSetBottomLeft(moveSet);
        moveSet = this.moveSetBottomRight(moveSet);
        return moveSet;
    };
    Bishop.prototype.moveSetTopLeft = function (moveSet) {
        var x = this.positionX;
        var y = this.positionY;
        while (true) {
            var position = checkIfPositionsExists([x, y]);
            if (position) {
                if (this.positionX != x || this.positionY != y)
                    moveSet.push(position);
                x -= 1;
                y += 1;
            }
            else {
                break;
            }
        }
        return moveSet;
    };
    Bishop.prototype.moveSetTopRight = function (moveSet) {
        var x = this.positionX;
        var y = this.positionY;
        while (true) {
            var position = checkIfPositionsExists([x, y]);
            if (position) {
                if (this.positionX != x || this.positionY != y)
                    moveSet.push(position);
                x += 1;
                y += 1;
            }
            else {
                break;
            }
        }
        return moveSet;
    };
    Bishop.prototype.moveSetBottomLeft = function (moveSet) {
        var x = this.positionX;
        var y = this.positionY;
        while (true) {
            var position = checkIfPositionsExists([x, y]);
            if (position) {
                if (this.positionX != x || this.positionY != y)
                    moveSet.push(position);
                x -= 1;
                y -= 1;
            }
            else {
                break;
            }
        }
        return moveSet;
    };
    Bishop.prototype.moveSetBottomRight = function (moveSet) {
        var x = this.positionX;
        var y = this.positionY;
        while (true) {
            var position = checkIfPositionsExists([x, y]);
            if (position) {
                if (this.positionX != x || this.positionY != y)
                    moveSet.push(position);
                x += 1;
                y -= 1;
            }
            else {
                break;
            }
        }
        return moveSet;
    };
    return Bishop;
}(Piece));
var Queen = /** @class */ (function (_super) {
    __extends(Queen, _super);
    function Queen(position, color) {
        return _super.call(this, position, color, 9, "Rainha", { white: "♛", black: "♕" }) || this;
    }
    Queen.prototype.moveSet = function () {
        var moveSet = [];
        moveSet = this.moveSetTopLeft(moveSet);
        moveSet = this.moveSetTopRight(moveSet);
        moveSet = this.moveSetBottomLeft(moveSet);
        moveSet = this.moveSetBottomRight(moveSet);
        moveSet = this.moveSetTopBottom(moveSet);
        moveSet = this.moveSetRightLeft(moveSet);
        return moveSet;
    };
    Queen.prototype.moveSetTopLeft = function (moveSet) {
        var x = this.positionX;
        var y = this.positionY;
        while (true) {
            var position = checkIfPositionsExists([x, y]);
            if (position) {
                moveSet.push(position);
                x -= 1;
                y += 1;
            }
            else {
                break;
            }
        }
        return moveSet;
    };
    Queen.prototype.moveSetTopRight = function (moveSet) {
        var x = this.positionX;
        var y = this.positionY;
        while (true) {
            var position = checkIfPositionsExists([x, y]);
            if (position) {
                moveSet.push(position);
                x += 1;
                y += 1;
            }
            else {
                break;
            }
        }
        return moveSet;
    };
    Queen.prototype.moveSetBottomLeft = function (moveSet) {
        var x = this.positionX;
        var y = this.positionY;
        while (true) {
            var position = checkIfPositionsExists([x, y]);
            if (position) {
                moveSet.push(position);
                x -= 1;
                y -= 1;
            }
            else {
                break;
            }
        }
        return moveSet;
    };
    Queen.prototype.moveSetBottomRight = function (moveSet) {
        var x = this.positionX;
        var y = this.positionY;
        while (true) {
            var position = checkIfPositionsExists([x, y]);
            if (position) {
                moveSet.push(position);
                x += 1;
                y -= 1;
            }
            else {
                break;
            }
        }
        return moveSet;
    };
    Queen.prototype.moveSetTopBottom = function (moveSet) {
        for (var i = 1; i <= 8; i++) {
            if (this.positionY == i)
                continue;
            moveSet.push([this.positionX, i]);
        }
        return moveSet;
    };
    Queen.prototype.moveSetRightLeft = function (moveSet) {
        for (var i = 8; i >= 1; i--) {
            if (this.positionX == i)
                continue;
            moveSet.push([i, this.positionY]);
        }
        return moveSet;
    };
    return Queen;
}(Piece));
var King = /** @class */ (function (_super) {
    __extends(King, _super);
    function King(position, color) {
        return _super.call(this, position, color, 0, "Rei", { white: "♚", black: "♔" }) || this;
    }
    King.prototype.moveSet = function () {
        var moveSet = [];
        var moveleft = checkIfPositionsExists([this.positionX - 1, this.positionY]);
        if (moveleft)
            moveSet.push(moveleft);
        var moveleftTop = checkIfPositionsExists([this.positionX - 1, this.positionY + 1]);
        if (moveleftTop)
            moveSet.push(moveleftTop);
        var movetop = checkIfPositionsExists([this.positionX, this.positionY + 1]);
        if (movetop)
            moveSet.push(movetop);
        var moveTopRight = checkIfPositionsExists([this.positionX + 1, this.positionY + 1]);
        if (moveTopRight)
            moveSet.push(moveTopRight);
        var moveRight = checkIfPositionsExists([this.positionX + 1, this.positionY]);
        if (moveRight)
            moveSet.push(moveRight);
        var moveRightBottom = checkIfPositionsExists([this.positionX + 1, this.positionY - 1]);
        if (moveRightBottom)
            moveSet.push(moveRightBottom);
        var moveBottom = checkIfPositionsExists([this.positionX, this.positionY - 1]);
        if (moveBottom)
            moveSet.push(moveBottom);
        var moveBottomLeft = checkIfPositionsExists([this.positionX - 1, this.positionY - 1]);
        if (moveBottomLeft)
            moveSet.push(moveBottomLeft);
        return moveSet;
    };
    return King;
}(Piece));
//validate if DOM reference points to a valid element
function validateDOM(DOM, resume) {
    if (DOM !== null) {
        return DOM;
    }
    throw new Error("Erro tentando acessar o elemento \"".concat(resume, "\""));
}
;
//Parameters to configure
var parameters = {
    board: {
        value: "board",
        description: "Board",
        size: "70vmin"
    },
    initialPosition: [
        new Rook([1, 8], "black"),
        new Knight([2, 8], "black"),
        new Bishop([3, 8], "black"),
        new Queen([4, 8], "black"),
        new King([5, 8], "black"),
        new Bishop([6, 8], "black"),
        new Knight([7, 8], "black"),
        new Rook([8, 8], "black"),
        new Pawn([1, 7], "black"),
        new Pawn([2, 7], "black"),
        new Pawn([3, 7], "black"),
        new Pawn([4, 7], "black"),
        new Pawn([5, 7], "black"),
        new Pawn([6, 7], "black"),
        new Pawn([7, 7], "black"),
        new Pawn([8, 7], "black"),
        new Rook([1, 1], "white"),
        new Knight([2, 1], "white"),
        new Bishop([3, 1], "white"),
        new Queen([4, 1], "white"),
        new King([5, 1], "white"),
        new Bishop([6, 1], "white"),
        new Knight([7, 1], "white"),
        new Rook([8, 1], "white"),
        new Pawn([1, 2], "white"),
        new Pawn([2, 2], "white"),
        new Pawn([3, 2], "white"),
        new Pawn([4, 2], "white"),
        new Pawn([5, 2], "white"),
        new Pawn([6, 2], "white"),
        new Pawn([7, 2], "white"),
        new Pawn([8, 2], "white"),
        new Knight([3, 3], "white"),
        new Knight([5, 3], "black"),
        new Knight([4, 4], "white")
    ]
};
//Store DOM references and initial configurations to use on runtime
var turn = 'white';
var selectedPiece;
var pieces = parameters.initialPosition;
var board = validateDOM(document.getElementById(parameters.board.value), parameters.board.description);
//Run main function
main();
function main() {
    initialize();
}
;
//Initialize settings to start 
function initialize() {
    setSizeBoard(parameters.board.size);
    popBoard();
    window.onresize = popBoard;
}
;
//Board size settings set
function setSizeBoard(size) {
    board.style.width = size;
    board.style.height = size;
}
;
//Pop up the divs on the board
function popBoard() {
    //Calcule the size of the squares
    board.innerHTML = '';
    var boardSize = board.offsetWidth;
    var squareSize = boardSize / 8 - 0.1;
    var html = new DocumentFragment();
    //Create and put on the board all the squares created
    for (var y = 8; y >= 1; y--) {
        for (var x = 1; x <= 8; x++) {
            var div = document.createElement("div");
            div.style.width = "".concat(squareSize, "px");
            div.style.height = "".concat(squareSize, "px");
            ((x + y - 1) % 2) ? div.classList.add("square-white") : div.classList.add("square-black");
            div.classList.add("square");
            div.style.fontSize = "".concat(squareSize - 10, "px");
            div.setAttribute("id", "".concat(x, "-").concat(y));
            var piece = foundPieceBySquare([x, y]);
            if (piece) {
                placePiece(piece, div);
                if (piece.color == turn) {
                    div.addEventListener("click", function () {
                        handleClickSquareEvent(this);
                    });
                }
            }
            html.append(div);
        }
    }
    board.append(html);
}
;
//Place piece in the square reference
function placePiece(piece, squareReference) {
    squareReference.innerHTML = piece.aparence;
    if (piece.color == 'black') {
        squareReference.style.color = '#000';
        squareReference.style.textShadow = '2px 0 #fff, -2px 0 #fff, 0 2px #fff, 0 -2px #fff, 1px 1px #fff, -1px -1px #fff, 1px -1px #fff, -1px 1px #fff';
    }
    else {
        squareReference.style.textShadow = '4px 0 #000, -4px 0 #000, 0 4px #000, 0 -4px #000,2px 2px #000, -2px -2px #000, 2px -2px #000, -2px 2px #000';
    }
}
//If a piece exists on the square, return the piece. otherwise, return false.
function foundPieceBySquare(squareReference) {
    if (squareReference instanceof (HTMLElement))
        squareReference = getPositionsFromSquare(squareReference);
    for (var i = 0; i < pieces.length; i++) {
        if (pieces[i].positionX == squareReference[0]) {
            if (pieces[i].positionY == squareReference[1]) {
                return pieces[i];
            }
        }
    }
    return false;
}
//Get the square DOM reference from the position[x, y]
function getSquareFromPositions(position) {
    var id = "".concat(position[0], "-").concat(position[1]);
    var square = document.getElementById(id);
    return validateDOM(square, "casa [".concat(id, "] n\u00E3o encontrada"));
}
//Get the position [x, y] from the square DOM reference
function getPositionsFromSquare(squareReference) {
    var id = squareReference.id;
    var positionX = parseInt(id[0]);
    var positionY = parseInt(id[2]);
    return [positionX, positionY];
}
//Process the clicked square
function handleClickSquareEvent(squareReference) {
    popBoard();
    console.log("Clicou em ".concat(getPositionsFromSquare(squareReference)));
    var piece = foundPieceBySquare(squareReference);
    if (piece) {
        selectedPiece = piece;
        placeValidMoves(piece);
    }
}
//Place all valid moves of a piece
function placeValidMoves(piece) {
    var moves = piece.moveSet();
    for (var i = 0; i < moves.length; i++) {
        var squareReference = getSquareFromPositions([moves[i][0], moves[i][1]]);
        if (foundPieceBySquare(squareReference))
            squareReference.classList.add("square-take");
        else
            squareReference.classList.add("square-move");
    }
}
//Check if a position is in the board range
function checkIfPositionsExists(squareReference) {
    if (squareReference[0] >= 1 && squareReference[0] <= 8) {
        if (squareReference[1] >= 1 && squareReference[1] <= 8) {
            return squareReference;
        }
    }
    return false;
}
