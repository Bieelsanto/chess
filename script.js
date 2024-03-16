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
var pieceId = 0;
var Piece = /** @class */ (function () {
    function Piece(position, color, value, name, aparence) {
        this.positionX = position[0];
        this.positionY = position[1];
        this.value = value;
        this.name = name;
        this.color = color;
        this.aparence = this.setAparence(aparence);
        this.SetAndincrementId();
    }
    Piece.prototype.setAparence = function (aparence) {
        return aparence.black;
    };
    Piece.prototype.SetAndincrementId = function () {
        pieceId += 1;
        this.pieceId = pieceId;
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
    Pawn.prototype.takeSet = function () {
        var takeSet = [];
        var move;
        //Move set to take moves
        var relativeY = (this.color == 'black') ? this.positionY - 1 : this.positionY + 1;
        //Take to left
        move = verifyIfPositionsExists([this.positionX - 1, relativeY]);
        if (move)
            takeSet.push(move);
        //Take to right
        move = verifyIfPositionsExists([this.positionX + 1, relativeY]);
        if (move)
            takeSet.push(move);
        return takeSet;
    };
    Pawn.prototype.moveSet = function () {
        var moveSet = [];
        this.moveSetFront(moveSet);
        return moveSet;
    };
    Pawn.prototype.specialMoveSet = function () {
        var specialMoveSet = [];
        var move;
        //specialMoveSet to enPassant
        this.moveSetEnPassant(specialMoveSet);
        //Move set to the second square move
        var relativeY = (this.color == 'black') ? this.positionY - 2 : this.positionY + 2;
        move = [this.positionX, relativeY];
        if (this.neverMoved && !foundPieceBySquare(move))
            specialMoveSet.push("twoSquares");
        return specialMoveSet;
    };
    Pawn.prototype.moveSetEnPassant = function (specialMoveSet) {
        if (!currentEnPassant)
            return;
        if (currentEnPassant.color == this.color)
            return;
        if (currentEnPassant.positionY != this.positionY)
            return;
        if (currentEnPassant.positionX == this.positionX - 1)
            specialMoveSet.push("enPassant");
        if (currentEnPassant.positionX == this.positionX + 1)
            specialMoveSet.push("enPassant");
    };
    Pawn.prototype.moveSetFront = function (moveSet) {
        var move;
        var piece;
        var relativeY = (this.color == 'black') ? this.positionY - 1 : this.positionY + 1;
        //Move set to one square move
        move = [this.positionX, relativeY];
        if (!foundPieceBySquare(move) && verifyIfPositionsExists(move)) {
            moveSet.push(move);
        }
        //Move set to take moves
        move = [this.positionX - 1, relativeY];
        piece = foundPieceBySquare(move);
        if (piece && piece.color != this.color)
            moveSet.push(move);
        move = [this.positionX + 1, relativeY];
        piece = foundPieceBySquare(move);
        if (piece && piece.color != this.color)
            moveSet.push(move);
    };
    return Pawn;
}(Piece));
var Rook = /** @class */ (function (_super) {
    __extends(Rook, _super);
    function Rook(position, color) {
        var _this = _super.call(this, position, color, 5, "Torre", { white: "♜", black: "♖" }) || this;
        _this.neverMoved = true;
        return _this;
    }
    Rook.prototype.takeSet = function () {
        return this.moveSet('take');
    };
    Rook.prototype.moveSet = function (take) {
        var moveSet = [];
        this.moveSetTopBottom(moveSet, take);
        this.moveSetRightLeft(moveSet, take);
        return moveSet;
    };
    Rook.prototype.validateMove = function (moveSet, move, take) {
        if (!verifyIfPositionsExists(move)) {
            return false;
        }
        var piece = foundPieceBySquare(move);
        if (!piece) {
            moveSet.push(move);
            return true;
        }
        if (piece.color !== this.color || take) {
            moveSet.push(move);
            return false;
        }
        return false;
    };
    Rook.prototype.moveSetTopBottom = function (moveSet, take) {
        var move;
        var piece;
        for (var i = this.positionY + 1; i <= 8; i++) {
            if (!this.validateMove(moveSet, [this.positionX, i], take))
                break;
        }
        for (var i = this.positionY - 1; i >= 1; i--) {
            if (!this.validateMove(moveSet, [this.positionX, i], take))
                break;
        }
    };
    Rook.prototype.moveSetRightLeft = function (moveSet, take) {
        var move;
        var piece;
        for (var i = this.positionX + 1; i <= 8; i++) {
            if (!this.validateMove(moveSet, [i, this.positionY], take))
                break;
        }
        for (var i = this.positionX - 1; i >= 1; i--) {
            if (!this.validateMove(moveSet, [i, this.positionY], take))
                break;
        }
    };
    return Rook;
}(Piece));
var Knight = /** @class */ (function (_super) {
    __extends(Knight, _super);
    function Knight(position, color) {
        return _super.call(this, position, color, 3, "Cavalo", { white: "♞", black: "♘" }) || this;
    }
    Knight.prototype.takeSet = function () {
        return this.moveSet('take');
    };
    Knight.prototype.moveSet = function (take) {
        var moveSet = [];
        var move;
        move = this.validateMove([this.positionX - 2, this.positionY + 1], take);
        if (move)
            moveSet.push(move);
        move = this.validateMove([this.positionX - 2, this.positionY - 1], take);
        if (move)
            moveSet.push(move);
        move = this.validateMove([this.positionX + 1, this.positionY + 2], take);
        if (move)
            moveSet.push(move);
        move = this.validateMove([this.positionX - 1, this.positionY + 2], take);
        if (move)
            moveSet.push(move);
        move = this.validateMove([this.positionX + 2, this.positionY + 1], take);
        if (move)
            moveSet.push(move);
        move = this.validateMove([this.positionX + 2, this.positionY - 1], take);
        if (move)
            moveSet.push(move);
        move = this.validateMove([this.positionX + 1, this.positionY - 2], take);
        if (move)
            moveSet.push(move);
        move = this.validateMove([this.positionX - 1, this.positionY - 2], take);
        if (move)
            moveSet.push(move);
        return moveSet;
    };
    Knight.prototype.validateMove = function (move, take) {
        if (!verifyIfPositionsExists(move))
            return false;
        var piece = foundPieceBySquare(move);
        if (!piece)
            return move;
        if (piece.color !== this.color || take)
            return move;
        return false;
    };
    return Knight;
}(Piece));
var Bishop = /** @class */ (function (_super) {
    __extends(Bishop, _super);
    function Bishop(position, color) {
        return _super.call(this, position, color, 3, "Bispo", { white: "♝", black: "♗" }) || this;
    }
    Bishop.prototype.takeSet = function () {
        return this.moveSet('take');
    };
    Bishop.prototype.moveSet = function (take) {
        var moveSet = [];
        this.moveSetTopLeft(moveSet, take);
        this.moveSetTopRight(moveSet, take);
        this.moveSetBottomLeft(moveSet, take);
        this.moveSetBottomRight(moveSet), take;
        return moveSet;
    };
    Bishop.prototype.validateMove = function (moveSet, move, take) {
        if (!verifyIfPositionsExists(move)) {
            return false;
        }
        var piece = foundPieceBySquare(move);
        if (!piece) {
            moveSet.push(move);
            return true;
        }
        if (piece.color !== this.color || take) {
            moveSet.push(move);
            return false;
        }
        return false;
    };
    Bishop.prototype.moveSetTopLeft = function (moveSet, take) {
        var x = this.positionX - 1;
        var y = this.positionY + 1;
        while (true) {
            if (!this.validateMove(moveSet, [x, y], take))
                break;
            x -= 1;
            y += 1;
        }
    };
    Bishop.prototype.moveSetTopRight = function (moveSet, take) {
        var x = this.positionX + 1;
        var y = this.positionY + 1;
        while (true) {
            if (!this.validateMove(moveSet, [x, y], take))
                break;
            x += 1;
            y += 1;
        }
    };
    Bishop.prototype.moveSetBottomLeft = function (moveSet, take) {
        var x = this.positionX - 1;
        var y = this.positionY - 1;
        while (true) {
            if (!this.validateMove(moveSet, [x, y], take))
                break;
            x -= 1;
            y -= 1;
        }
    };
    Bishop.prototype.moveSetBottomRight = function (moveSet, take) {
        var x = this.positionX + 1;
        var y = this.positionY - 1;
        while (true) {
            if (!this.validateMove(moveSet, [x, y], take))
                break;
            x += 1;
            y -= 1;
        }
    };
    return Bishop;
}(Piece));
var Queen = /** @class */ (function (_super) {
    __extends(Queen, _super);
    function Queen(position, color) {
        return _super.call(this, position, color, 9, "Rainha", { white: "♛", black: "♕" }) || this;
    }
    Queen.prototype.takeSet = function () {
        return this.moveSet('take');
    };
    Queen.prototype.moveSet = function (take) {
        var moveSet = [];
        this.moveSetTopLeft(moveSet, take);
        this.moveSetTopRight(moveSet, take);
        this.moveSetBottomLeft(moveSet, take);
        this.moveSetBottomRight(moveSet, take);
        this.moveSetTopBottom(moveSet, take);
        this.moveSetRightLeft(moveSet, take);
        return moveSet;
    };
    Queen.prototype.validateMovestraight = function (moveSet, move, take) {
        if (!verifyIfPositionsExists(move)) {
            return false;
        }
        var piece = foundPieceBySquare(move);
        if (!piece) {
            moveSet.push(move);
            return true;
        }
        if (piece.color !== this.color || take) {
            moveSet.push(move);
            return false;
        }
        return false;
    };
    Queen.prototype.moveSetTopBottom = function (moveSet, take) {
        for (var i = this.positionY + 1; i <= 8; i++) {
            if (!this.validateMovestraight(moveSet, [this.positionX, i], take))
                break;
        }
        for (var i = this.positionY - 1; i >= 1; i--) {
            if (!this.validateMovestraight(moveSet, [this.positionX, i], take))
                break;
        }
    };
    Queen.prototype.moveSetRightLeft = function (moveSet, take) {
        for (var i = this.positionX + 1; i <= 8; i++) {
            if (!this.validateMovestraight(moveSet, [i, this.positionY], take))
                break;
        }
        for (var i = this.positionX - 1; i >= 1; i--) {
            if (!this.validateMovestraight(moveSet, [i, this.positionY], take))
                break;
        }
    };
    Queen.prototype.validateMoveDiagonal = function (moveSet, move, take) {
        if (!verifyIfPositionsExists(move)) {
            return false;
        }
        var piece = foundPieceBySquare(move);
        if (!piece) {
            moveSet.push(move);
            return true;
        }
        if (piece.color !== this.color || take) {
            moveSet.push(move);
            return false;
        }
        return false;
    };
    Queen.prototype.moveSetTopLeft = function (moveSet, take) {
        var x = this.positionX - 1;
        var y = this.positionY + 1;
        while (true) {
            if (!this.validateMoveDiagonal(moveSet, [x, y], take))
                break;
            x -= 1;
            y += 1;
        }
    };
    Queen.prototype.moveSetTopRight = function (moveSet, take) {
        var x = this.positionX + 1;
        var y = this.positionY + 1;
        while (true) {
            if (!this.validateMoveDiagonal(moveSet, [x, y], take))
                break;
            x += 1;
            y += 1;
        }
    };
    Queen.prototype.moveSetBottomLeft = function (moveSet, take) {
        var x = this.positionX - 1;
        var y = this.positionY - 1;
        while (true) {
            if (!this.validateMoveDiagonal(moveSet, [x, y], take))
                break;
            x -= 1;
            y -= 1;
        }
    };
    Queen.prototype.moveSetBottomRight = function (moveSet, take) {
        var x = this.positionX + 1;
        var y = this.positionY - 1;
        while (true) {
            if (!this.validateMoveDiagonal(moveSet, [x, y], take))
                break;
            x += 1;
            y -= 1;
        }
    };
    return Queen;
}(Piece));
var King = /** @class */ (function (_super) {
    __extends(King, _super);
    function King(position, color) {
        var _this = _super.call(this, position, color, 0, "Rei", { white: "♚", black: "♔" }) || this;
        _this.neverMoved = true;
        return _this;
    }
    King.prototype.takeSet = function () {
        return this.moveSet('take');
    };
    King.prototype.moveSet = function (take) {
        var moveSet = [];
        var moveleft = this.validateMove([this.positionX - 1, this.positionY], take);
        if (moveleft)
            moveSet.push(moveleft);
        var moveleftTop = this.validateMove([this.positionX - 1, this.positionY + 1], take);
        if (moveleftTop)
            moveSet.push(moveleftTop);
        var movetop = this.validateMove([this.positionX, this.positionY + 1], take);
        if (movetop)
            moveSet.push(movetop);
        var moveTopRight = this.validateMove([this.positionX + 1, this.positionY + 1], take);
        if (moveTopRight)
            moveSet.push(moveTopRight);
        var moveRight = this.validateMove([this.positionX + 1, this.positionY], take);
        if (moveRight)
            moveSet.push(moveRight);
        var moveRightBottom = this.validateMove([this.positionX + 1, this.positionY - 1], take);
        if (moveRightBottom)
            moveSet.push(moveRightBottom);
        var moveBottom = this.validateMove([this.positionX, this.positionY - 1], take);
        if (moveBottom)
            moveSet.push(moveBottom);
        var moveBottomLeft = this.validateMove([this.positionX - 1, this.positionY - 1], take);
        if (moveBottomLeft)
            moveSet.push(moveBottomLeft);
        return moveSet;
    };
    King.prototype.specialMoveSet = function () {
        var specialMoveSet = [];
        //Move set to the long castle
        this.moveSetShortCastle(specialMoveSet);
        //Move set to the short castle
        this.moveSetLongCastle(specialMoveSet);
        return specialMoveSet;
    };
    King.prototype.moveSetShortCastle = function (specialMoveSet) {
        var rook = foundPieceBySquare([8, this.positionY]);
        if (!rook)
            return; //if theres no piece on initial rook square, return
        if (!(rook instanceof Rook))
            return; //if the piece on the rook square isnt a rook, return
        if (!(this.neverMoved))
            return; //if the king already moved, return
        if (!(rook.neverMoved))
            return; //if the rook already moved, return
        if ((verifyIfSquareUnderAttack([this.positionX, this.positionY])))
            return; // if under attack, return
        if ((foundPieceBySquare([7, this.positionY])))
            return; //if theres a piece on the way, return
        if ((verifyIfSquareUnderAttack([7, this.positionY])))
            return; // if way under attack, return
        if ((foundPieceBySquare([6, this.positionY])))
            return; //if theres a piece on the way, return
        if ((verifyIfSquareUnderAttack([6, this.positionY])))
            return; // if way under attack, return
        specialMoveSet.push('shortCastle'); //Return shortCastle to caller
        return;
    };
    King.prototype.moveSetLongCastle = function (specialMoveSet) {
        var rook = foundPieceBySquare([1, this.positionY]);
        if (!rook)
            return; //if theres no piece on initial rook square, return
        if (!(rook instanceof Rook))
            return; //if the piece on the rook square isnt a rook, return
        if (!(this.neverMoved))
            return; //if the king already moved, return
        if (!(rook.neverMoved))
            return; //if the rook already moved, return
        if ((verifyIfSquareUnderAttack([this.positionX, this.positionY])))
            return; // if under attack, return
        if ((foundPieceBySquare([3, this.positionY])))
            return; //if theres a piece on the way, return
        if ((verifyIfSquareUnderAttack([3, this.positionY])))
            return; // if way under attack, return
        if ((foundPieceBySquare([4, this.positionY])))
            return; //if theres a piece on the way, return
        if ((verifyIfSquareUnderAttack([4, this.positionY])))
            return; // if way under attack, return
        specialMoveSet.push('longCastle'); //Return longCastle to caller
        return;
    };
    King.prototype.validateMove = function (move, take) {
        if (!verifyIfPositionsExists(move))
            return false; //If the square doesnt exists, return false
        if (take)
            return move; //If its a takeSet, return move
        var piece = foundPieceBySquare(move); //Get the piece from the square
        if (!piece)
            return move; //return move if theres none piece on the square 
        if (piece.color !== this.color)
            return move; //return move if its the opponent piece
        return false; //return false else (its a friendly piece)
    };
    ;
    return King;
}(Piece));
;
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
        /*         new Rook([1, 8], "black"),
                new Knight([2, 8], "black"),
                new Bishop([3, 8], "black"),
                new Queen([4, 8], "black"), */
        new King([5, 8], "black"),
        /*         new Bishop([6, 8], "black"),
                new Knight([7, 8], "black"),
                new Rook([8, 8], "black"),
                new Pawn([1, 7], "black"),
                new Pawn([2, 7], "black"),
                new Pawn([3, 7], "black"),
                new Pawn([4, 7], "black"),
                new Pawn([5, 7], "black"),
                new Pawn([6, 7], "black"),
                new Pawn([7, 7], "black"),
                new Pawn([8, 7], "black"), */
        new Rook([1, 1], "white"),
        new Knight([2, 1], "white"),
        new Bishop([3, 1], "white"),
        new Queen([4, 1], "white"),
        new King([5, 1], "white"),
        new Bishop([6, 1], "white"),
        new Knight([7, 1], "white"),
        new Rook([8, 1], "white"),
        new Pawn([1, 6], "white"),
        new Pawn([2, 2], "white"),
        new Pawn([3, 2], "white"),
        new Pawn([4, 2], "white"),
        new Pawn([5, 2], "white"),
        new Pawn([6, 2], "white"),
        new Pawn([7, 2], "white"),
        new Pawn([8, 2], "white")
    ]
};
//Store DOM references and initial configurations to use on runtime
var turn = 'white';
var selectedPiece;
var currentEnPassant;
var pieces = parameters.initialPosition;
var board = validateDOM(document.getElementById(parameters.board.value), parameters.board.description);
var DivMessagePopUp = validateDOM(document.getElementById('div-message'), "Div da Mensagem");
var TitleMessagePopUp = validateDOM(document.getElementById('title-message'), "T\u00EDtulo da Mensagem");
var MessagePopUp = validateDOM(document.getElementById('message'), "Mensagem");
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
    window.onresize = resized;
}
;
//Board size settings set
function setSizeBoard(size) {
    board.style.width = size;
    board.style.height = size;
}
;
//Main function of resize event
function resized() {
    popBoard();
    handleKingState();
}
//Pop up the divs on the board
function popBoard() {
    //Calcule the size of the squares
    board.innerHTML = '';
    var boardSize = board.offsetWidth;
    var squareSize = boardSize / 8 - 0.1;
    var html = new DocumentFragment();
    //Build the message HTML
    var div = document.createElement("div");
    div.setAttribute("id", "div-message");
    var divContent = document.createElement("div");
    divContent.setAttribute("id", "title-message");
    div.append(divContent);
    divContent = document.createElement("div");
    divContent.setAttribute("id", "message");
    div.append(divContent);
    html.append(div);
    //Create and put on the board all the squares created
    for (var y = 8; y >= 1; y--) {
        for (var x = 1; x <= 8; x++) {
            var div_1 = document.createElement("div");
            div_1.style.width = "".concat(squareSize, "px");
            div_1.style.height = "".concat(squareSize, "px");
            ((x + y - 1) % 2) ? div_1.classList.add("square-white") : div_1.classList.add("square-black");
            div_1.classList.add("square");
            div_1.style.fontSize = "".concat(squareSize - 10, "px");
            div_1.setAttribute("id", "".concat(x, "-").concat(y));
            var piece = foundPieceBySquare([x, y]);
            if (piece) {
                placePiece(piece, div_1);
                if (piece.color == turn) {
                    div_1.addEventListener("click", function () {
                        handleClickSquareEvent(this);
                    });
                }
            }
            html.append(div_1);
        }
    }
    board.append(html);
}
;
//Place the piece in the square reference
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
        placeValidSpecialMoves(piece);
    }
}
//Place all valid moves of a piece
function placeValidMoves(piece) {
    var moves = returnMoveSetThatNotCheckOwnKing(piece.moveSet(), piece);
    if (checkPawnPromotion())
        return;
    moves.forEach(function (_a) {
        var x = _a[0], y = _a[1];
        var squareReference = getSquareFromPositions([x, y]);
        var pieceTarget = foundPieceBySquare(squareReference);
        if (pieceTarget) {
            // Se houver uma peça no quadrado, marca como possível captura
            squareReference.classList.add("square-take");
            squareReference.addEventListener("click", function () {
                handleClickTakeEvent(piece, pieceTarget);
            });
        }
        else {
            // Se não houver peça no quadrado, marca como possível movimento
            squareReference.classList.add("square-move");
            squareReference.addEventListener("click", function () {
                handleClickMoveEvent(piece, squareReference);
            });
        }
    });
}
function placeValidSpecialMoves(piece) {
    if (!("specialMoveSet" in piece))
        return;
    if (checkPawnPromotion())
        return;
    var moves = piece.specialMoveSet();
    moves.forEach(function (move) {
        var squareReference;
        switch (move) {
            case 'enPassant':
                var direction1 = currentEnPassant.color == 'black' ? 1 : -1;
                var moveY1 = currentEnPassant.positionY + direction1;
                if (returnSpecialMoveSetThatNotCheckOwnKing([move], piece).length == 0)
                    break;
                squareReference = getSquareFromPositions([currentEnPassant.positionX, moveY1]);
                squareReference.classList.add("square-take");
                squareReference.addEventListener("click", function () {
                    handleClickEnPassantEvent(piece, squareReference);
                });
                break;
            case 'twoSquares':
                var directionTwoSquare = selectedPiece.color == 'black' ? -2 : 2;
                var directionOneSquare = selectedPiece.color == 'black' ? -1 : 1;
                var moveY2 = selectedPiece.positionY + directionTwoSquare;
                var moveY3 = selectedPiece.positionY + directionOneSquare;
                if (foundPieceBySquare([selectedPiece.positionX, moveY3]))
                    break;
                if (returnSpecialMoveSetThatNotCheckOwnKing([move], piece).length == 0)
                    break;
                squareReference = getSquareFromPositions([selectedPiece.positionX, moveY2]);
                squareReference.classList.add("square-move");
                squareReference.addEventListener("click", function () {
                    handleClickTwoSquaresEvent(piece, squareReference);
                });
                break;
            case 'longCastle':
                if (returnSpecialMoveSetThatNotCheckOwnKing([move], piece).length == 0)
                    break;
                squareReference = getSquareFromPositions([3, selectedPiece.positionY]);
                squareReference.classList.add("square-move");
                squareReference.addEventListener("click", function () {
                    handleClickLongCastleEvent(piece, squareReference);
                });
                break;
            case 'shortCastle':
                if (returnSpecialMoveSetThatNotCheckOwnKing([move], piece).length == 0)
                    break;
                squareReference = getSquareFromPositions([7, selectedPiece.positionY]);
                squareReference.classList.add("square-move");
                squareReference.addEventListener("click", function () {
                    handleClickShortCastleEvent(piece, squareReference);
                });
                break;
            default:
                break;
        }
    });
}
//Process the piece to be taked
function handleClickTakeEvent(piece, pieceTarget) {
    movePiece(piece, [pieceTarget.positionX, pieceTarget.positionY]);
    takePiece(pieceTarget);
    processTransitionToNextTurn();
}
//Process the squared to be moved to
function handleClickMoveEvent(piece, squareReference) {
    if (squareReference instanceof HTMLElement)
        squareReference = getPositionsFromSquare(squareReference);
    movePiece(piece, squareReference);
    processTransitionToNextTurn();
}
//Process the special move en passant
function handleClickEnPassantEvent(piece, squareReference) {
    if (squareReference instanceof HTMLElement)
        squareReference = getPositionsFromSquare(squareReference);
    movePiece(piece, squareReference);
    takePiece(currentEnPassant);
    processTransitionToNextTurn();
}
//Process the pawn two square move
function handleClickTwoSquaresEvent(piece, squareReference) {
    if (squareReference instanceof HTMLElement)
        squareReference = getPositionsFromSquare(squareReference);
    movePiece(piece, squareReference);
    currentEnPassant = selectedPiece;
    processTransitionToNextTurn('passant');
}
//Process the short castle
function handleClickShortCastleEvent(piece, squareReference) {
    if (squareReference instanceof HTMLElement)
        squareReference = getPositionsFromSquare(squareReference);
    movePiece(piece, squareReference);
    var rook = foundPieceBySquare([8, selectedPiece.positionY]);
    if (rook)
        rook.positionX = 6;
    processTransitionToNextTurn();
}
//Process the long castle
function handleClickLongCastleEvent(piece, squareReference) {
    if (squareReference instanceof HTMLElement)
        squareReference = getPositionsFromSquare(squareReference);
    movePiece(piece, squareReference);
    var rook = foundPieceBySquare([1, selectedPiece.positionY]);
    if (rook)
        rook.positionX = 4;
    processTransitionToNextTurn();
}
//Process the common processes of the transition turn
function processTransitionToNextTurn(nullCurrentPassant) {
    if (!nullCurrentPassant)
        currentEnPassant = null;
    switchFlagNeverMovedIfHave(selectedPiece);
    handlePawnPromotion();
    switchTurn();
    popBoard();
    handleKingState();
}
//Handle the end game state if it on end
function handleKingState() {
    var check = verifyIfKingUnderAttack(turn);
    var noMoves = verifyIfNoMovesToDo();
    if (check)
        popKingCheck();
    if (noMoves) {
        if (check)
            setPopUp("Vitória", "".concat(turn == 'black' ? 'Brancas' : 'Pretas', " vencem"));
        else
            setPopUp("Empate", "Afogamento");
    }
}
function checkPawnPromotion() {
    for (var i = 1; i <= 8; i++) {
        var whitePawn = foundPieceBySquare([i, 8]);
        var blackPawn = foundPieceBySquare([i, 1]);
        if (whitePawn)
            if (whitePawn instanceof Pawn)
                return whitePawn;
        if (blackPawn)
            if (blackPawn instanceof Pawn)
                return blackPawn;
    }
    return false;
}
function handlePawnPromotion() {
    var pawn = checkPawnPromotion();
    if (!pawn)
        return;
    popBoard();
    var squareReference = getSquareFromPositions([pawn.positionX, pawn.positionY]);
    if (!squareReference)
        return;
    var html = new DocumentFragment();
    var boardSize = board.offsetWidth;
    var squareSize = boardSize / 8 - 0.1;
    console.log(squareSize);
    var promotionOptions = ['Queen', 'Knight', 'Bishop', 'Rook'];
    promotionOptions.forEach(function (option) {
        var piece = new window[option]([-10, -10], turn);
        var div = document.createElement("div");
        div.classList.add("square-black");
        div.style.width = "".concat(squareSize, "px");
        div.style.height = "".concat(squareSize, "px");
        div.style.fontSize = "".concat(squareSize - 10, "px");
        div.classList.add("square");
        div.innerHTML = piece.aparence;
        div.addEventListener("click", function () {
            piece.positionX = pawn.positionX;
            piece.positionY = pawn.positionY;
            takePiece(pawn);
            pieces.push(piece);
            cleanPopUp();
            popBoard();
            handleKingState();
        });
        html.append(div);
    });
    MessagePopUp.innerHTML = '';
    MessagePopUp.append(html);
    DivMessagePopUp.style.display = 'block';
    MessagePopUp.style.display = 'flex';
    TitleMessagePopUp.innerHTML = 'Escolha';
}
//Verify if the position is in the board range
function verifyIfPositionsExists(squareReference) {
    if (squareReference[0] >= 1 && squareReference[0] <= 8) {
        if (squareReference[1] >= 1 && squareReference[1] <= 8) {
            return squareReference;
        }
    }
    return false;
}
//Take the piece
function takePiece(piece) {
    pieces.splice(pieces.map(function (i) { return i.pieceId; }).indexOf(piece.pieceId), 1);
}
//Move the piece to the target square
function movePiece(piece, squareReference) {
    if (squareReference instanceof (HTMLElement))
        squareReference = getPositionsFromSquare(squareReference);
    piece.positionX = squareReference[0];
    piece.positionY = squareReference[1];
}
//Switch the turn to the opponent 
function switchTurn() {
    if (turn == 'black') {
        turn = 'white';
    }
    else {
        turn = 'black';
    }
}
function returnKingReference(color) {
    for (var i = 0; i < pieces.length; i++) {
        if (pieces[i].color == color && pieces[i] instanceof King) {
            return pieces[i];
        }
    }
    return false;
}
function verifyIfKingUnderAttack(color) {
    var king = returnKingReference(color);
    if (king)
        if (verifyIfSquareUnderAttack([king.positionX, king.positionY]))
            return true;
    return false;
}
//Search if the square is attacked
function verifyIfSquareUnderAttack(squareReference) {
    if (squareReference instanceof (HTMLElement))
        squareReference = getPositionsFromSquare(squareReference);
    //Get a array with only oponnent pieces
    var oponnentPieces = pieces.filter(function (x) { return x.color != turn; });
    for (var i = 0; i < oponnentPieces.length; i++) {
        //Get the 
        var piece = oponnentPieces[i];
        var takeSet = piece.takeSet();
        for (var j = 0; j < takeSet.length; j++) {
            if (takeSet[j][0] == squareReference[0] && takeSet[j][1] == squareReference[1])
                return true;
        }
    }
    return false;
}
//Switch tue flag "neverMoved" to false if the piece have it
function switchFlagNeverMovedIfHave(piece) {
    if ("neverMoved" in piece)
        piece.neverMoved = false;
}
//Verify if a certain move set will check the player himself
function returnMoveSetThatNotCheckOwnKing(moveSet, piece) {
    var newMoveSet = [];
    //Store original position of the piece
    var positionX = piece.positionX;
    var positionY = piece.positionY;
    //Verify move by move if this leaves own king vulnerable
    for (var i = 0; i < moveSet.length; i++) {
        var targetPiece = foundPieceBySquare([moveSet[i][0], moveSet[i][1]]);
        if (targetPiece)
            takePiece(targetPiece);
        piece.positionX = moveSet[i][0];
        piece.positionY = moveSet[i][1];
        if (!verifyIfKingUnderAttack(turn))
            newMoveSet.push(moveSet[i]);
        if (targetPiece)
            pieces.push(targetPiece);
    }
    //Return the piece to it original position
    piece.positionX = positionX;
    piece.positionY = positionY;
    return newMoveSet;
}
//Verify if a certain special move set will check the player himself
function returnSpecialMoveSetThatNotCheckOwnKing(specialMoveSet, piece) {
    var newSpecialMoveSet = [];
    specialMoveSet.forEach(function (specialMoveSet) {
        switch (specialMoveSet) {
            case 'enPassant':
                //for each vulnerable en passant piece color, set the piece thats will take it to stay 1 square in front of them
                var direction1 = currentEnPassant.color == 'black' ? 1 : -1;
                //Set the position of the taker move
                var moveY1 = currentEnPassant.positionY + direction1;
                //If theres none target piece, something wents wrong.
                var pieceTarget = currentEnPassant;
                if (!pieceTarget)
                    throw console.error('Falha ao determinar alvo do en passant.');
                //Take off the board the target piece to simulate the move and see if its put/keep the king on danger
                takePiece(pieceTarget);
                if (returnMoveSetThatNotCheckOwnKing([[currentEnPassant.positionX, moveY1]], piece).length == 0) {
                    pieces.push(pieceTarget);
                    break;
                }
                //Give the piece back to the board on it original position
                pieces.push(pieceTarget);
                //Put the move inside the return list
                newSpecialMoveSet.push(specialMoveSet);
                break;
            case 'twoSquares':
                //For each pawn color, set the direction of the move
                var direction2 = piece.color == 'black' ? -2 : 2;
                //Set the move
                var moveY2 = piece.positionY + direction2;
                //Simulate the move and see if its put/keep the king on danger
                if (returnMoveSetThatNotCheckOwnKing([[piece.positionX, moveY2]], piece).length == 0)
                    break;
                //If dont, put the move inside the return list
                newSpecialMoveSet.push(specialMoveSet);
                break;
            case 'longCastle':
                //The long castle move will never get there if its an invalid move, because it have its own check on the class
                newSpecialMoveSet.push(specialMoveSet);
                break;
            case 'shortCastle':
                //The short castle move will never get there if its an invalid move, because it have its own check on the class
                newSpecialMoveSet.push(specialMoveSet);
                break;
            default:
                break;
        }
    });
    return newSpecialMoveSet;
}
//Verify if theres no moves to do
function verifyIfNoMovesToDo() {
    //Get the own king reference
    var king = returnKingReference(turn);
    //If theres no king on the board, thats unexpected. Throws a error
    if (!king)
        throw console.error('O rei não foi encontrado!');
    //Get the moveset of the king
    var moves = returnMoveSetThatNotCheckOwnKing(king.moveSet(), king);
    //If the king can move and avoid check, theres at least one move left.
    if (moves.length > 0) {
        return false;
    }
    //Get a array with only oponnent pieces
    var allyPieces = pieces.filter(function (x) { return x.color == turn; });
    for (var i = 0; i < allyPieces.length; i++) {
        var piece = allyPieces[i];
        //Get the piece move set to know if its left the king safe
        var moveSet = piece.moveSet();
        if (returnMoveSetThatNotCheckOwnKing(moveSet, piece).length != 0) {
            return false;
        }
        //Get the piece special move set (if it have) to know if its left the king safe
        var specialMoveSet = piece.moveSet();
        if ("specialMoveSet" in piece)
            if (returnSpecialMoveSetThatNotCheckOwnKing(piece.specialMoveSet(), piece).length != 0) {
                return false;
            }
    }
    //If nothing of this happens, then there are no more moves left
    return true;
}
//Set a final message to end the game
function setPopUp(title, message) {
    DivMessagePopUp.style.display = 'block';
    TitleMessagePopUp.innerHTML = title;
    MessagePopUp.innerHTML = message;
}
function cleanPopUp() {
    DivMessagePopUp.style.display = 'none';
    TitleMessagePopUp.innerHTML = '';
    MessagePopUp.innerHTML = '';
    MessagePopUp.style.display = 'block';
}
//Pop a style in the king square to display check
function popKingCheck() {
    var king = returnKingReference(turn);
    if (!king)
        return;
    var squareReference = getSquareFromPositions([king.positionX, king.positionY]);
    squareReference.style.background = '#f00';
}
