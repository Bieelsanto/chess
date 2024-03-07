//Create the Piece classes

type piece = Pawn | Knight | Bishop | Rook | King | Queen;
type specialMove = 'enPassant' | 'longCastle' | 'shortCastle' | 'twoSquares'

var pieceId: number = 0;

class Piece {
    positionX: number;
    positionY: number;
    color: 'white' | 'black';
    value: number;
    name: string;
    aparence: string;
    pieceId: number;

    constructor(
        position: [number, number],
        color: 'white' | 'black',
        value: number,
        name: string,
        aparence: { "white": string, "black": string }
    ) {
        this.positionX = position[0];
        this.positionY = position[1];
        this.value = value;
        this.name = name;
        this.color = color;
        this.aparence = this.setAparence(aparence);
        this.SetAndincrementId()
    }

    setAparence(aparence: { "white": string, "black": string }) {
        return aparence.black;
    }

    SetAndincrementId(){
        pieceId += 1
        this.pieceId = pieceId
    }
}

class Pawn extends Piece {
    neverMoved: true | false = true;

    constructor(position: [number, number], color: 'white' | 'black') {
        super(position, color, 1, "Peão", { white: "♟", black: "♙" });
    }

    takeSet(): [number, number][] {
        const takeSet: [number, number][] = [];
        let move: [number, number] | false;
        //Move set to take moves

        const relativeY: number = (this.color == 'black') ? this.positionY-1 : this.positionY + 1

        //Take to left
        move = verifyIfPositionsExists([this.positionX - 1, relativeY]);
        if (move) takeSet.push(move);
        
        //Take to right
        move = verifyIfPositionsExists([this.positionX + 1, relativeY]);
        if (move) takeSet.push(move);

        return takeSet;
    }

    moveSet(): [number, number][] {
        const moveSet: [number, number][] = [];
        this.moveSetFront(moveSet);
        return moveSet;
    }

    specialMoveSet(): specialMove[]{
        const specialMoveSet: specialMove[] = []
        let move: [number, number];

        //specialMoveSet to enPassant
        this.moveSetEnPassant(specialMoveSet)

        //Move set to the second square move
        const relativeY: number = (this.color == 'black') ? this.positionY - 2 : this.positionY + 2

        move = [this.positionX, relativeY];
        if (this.neverMoved && !foundPieceBySquare(move)) specialMoveSet.push("twoSquares");

        return specialMoveSet
    }

    moveSetEnPassant(specialMoveSet: specialMove[]):void {
        if (!currentEnPassant) return
        if (currentEnPassant.color == this.color) return
        if (currentEnPassant.positionY != this.positionY) return
        if (currentEnPassant.positionX == this.positionX - 1) specialMoveSet.push("enPassant")
        if (currentEnPassant.positionX == this.positionX + 1) specialMoveSet.push("enPassant")
    }

    moveSetFront(moveSet: [number, number][]): void{
        let move: [number, number];
        let piece: piece | false;
        const relativeY: number = (this.color == 'black') ? this.positionY - 1 : this.positionY + 1

        //Move set to one square move
        move = [this.positionX, relativeY]
        if (!foundPieceBySquare(move) && verifyIfPositionsExists(move)){
            moveSet.push(move);
        } 
        
        //Move set to take moves
        move = [this.positionX-1, relativeY];
        piece = foundPieceBySquare(move);
        if (piece && piece.color != this.color) moveSet.push(move);
        
        move = [this.positionX+1, relativeY];
        piece = foundPieceBySquare(move);
        if (piece && piece.color != this.color) moveSet.push(move);
    }

}

class Rook extends Piece {
    neverMoved: true | false = true;

    constructor(position: [number, number], color: 'white' | 'black') {
        super(position, color, 5, "Torre", { white: "♜", black: "♖" });
    }

    takeSet(): [number, number][] {
        return this.moveSet('take');
    }

    moveSet(take?: 'take'): [number, number][] {
        const moveSet: [number, number][] = [];
        this.moveSetTopBottom(moveSet, take);
        this.moveSetRightLeft(moveSet, take);
        return moveSet;
    }

    validateMove(moveSet: [number, number][], move: [number, number], take?:'take'): boolean {

        if (!verifyIfPositionsExists(move)) {
            return false;
        }

        const piece: Piece | false = foundPieceBySquare(move);
    
        if (!piece) {
            moveSet.push(move);
            return true;
        }
        
        if (piece.color !== this.color || take) {
            moveSet.push(move);
            return false;
        }

        return false;
    }

    moveSetTopBottom(moveSet: [number, number][], take?: 'take'): void {
        let move: [number, number];
        let piece: piece | false;

        for (let i = this.positionY + 1 ; i <= 8 ; i++){
            if (!this.validateMove(moveSet, [this.positionX, i], take)) break;
        }

        for (let i = this.positionY-1 ; i >= 1 ; i--){
            if (!this.validateMove(moveSet, [this.positionX, i], take)) break;
        }
    }
    
    moveSetRightLeft(moveSet: [number, number][], take?: 'take'): void {
        let move: [number, number];
        let piece: piece | false;

        for (let i = this.positionX + 1 ; i <= 8 ; i++){
            if (!this.validateMove(moveSet, [i, this.positionY], take)) break;
        }

        for (let i = this.positionX - 1 ; i >= 1 ; i--){
            if (!this.validateMove(moveSet, [i, this.positionY], take)) break;
        }
    }

}

class Knight extends Piece {
    constructor(position: [number, number], color: 'white' | 'black') {
        super(position, color, 3, "Cavalo", { white: "♞", black: "♘" });
    }

    takeSet(): [number, number][] {
        return this.moveSet('take');
    }

    moveSet(take?: 'take'): [number, number][] {
        var moveSet: [number, number][] = [];
        let move: [number, number] | false;

        move = this.validateMove([this.positionX-2, this.positionY+1], take);
        if (move) moveSet.push(move);

        move = this.validateMove([this.positionX-2, this.positionY-1], take);
        if (move) moveSet.push(move);

        move = this.validateMove([this.positionX+1, this.positionY+2], take);
        if (move) moveSet.push(move);

        move = this.validateMove([this.positionX-1, this.positionY+2], take);
        if (move) moveSet.push(move);

        move = this.validateMove([this.positionX+2, this.positionY+1], take);
        if (move) moveSet.push(move);

        move = this.validateMove([this.positionX+2, this.positionY-1], take);
        if (move) moveSet.push(move);

        move = this.validateMove([this.positionX+1, this.positionY-2], take);
        if (move) moveSet.push(move);

        move = this.validateMove([this.positionX-1, this.positionY-2], take);
        if (move) moveSet.push(move);

        return moveSet;
    }

    validateMove(move: [number, number], take?:'take'): [number, number] | false {

        if (!verifyIfPositionsExists(move)) return false;

        const piece: Piece | false = foundPieceBySquare(move);
    
        if (!piece) return move;
        
        if (piece.color !== this.color || take) return move;

        return false;
    }

}

class Bishop extends Piece {
    constructor(position: [number, number], color: 'white' | 'black') {
        super(position, color, 3, "Bispo", { white: "♝", black: "♗" });
    }

    takeSet(): [number, number][] {
        return this.moveSet('take');
    }

    moveSet(take?: 'take'): [number, number][] {
        const moveSet: [number, number][] = [];
        this.moveSetTopLeft(moveSet, take);
        this.moveSetTopRight(moveSet, take);
        this.moveSetBottomLeft(moveSet, take);
        this.moveSetBottomRight(moveSet), take;
        return moveSet;
    }

    validateMove(moveSet: [number, number][], move: [number, number], take?:'take'): boolean {
        if (!verifyIfPositionsExists(move)) {
            return false;
        }

        const piece: Piece | false = foundPieceBySquare(move);
    
        if (!piece) {
            moveSet.push(move);
            return true;
        }
        
        if (piece.color !== this.color || take) {
            moveSet.push(move);
            return false;
        }

        return false;
    }

    moveSetTopLeft(moveSet: [number, number][], take?:'take'): void {
        let x: number = this.positionX - 1;
        let y: number = this.positionY + 1;
        while(true){
            if (!this.validateMove(moveSet, [x, y], take)) break;
            x -= 1;
            y += 1;
        }
    }
    
    moveSetTopRight(moveSet: [number, number][], take?:'take'): void {
        let x: number = this.positionX + 1;
        let y: number = this.positionY + 1;
        while(true){
            if (!this.validateMove(moveSet, [x, y], take)) break;
            x += 1;
            y += 1;
        }

    }

    moveSetBottomLeft(moveSet: [number, number][], take?:'take'): void {
        let x: number = this.positionX - 1;
        let y: number = this.positionY - 1;
        while(true){
            if (!this.validateMove(moveSet, [x, y], take)) break;
            x -= 1;
            y -= 1;
        }
    }

    moveSetBottomRight(moveSet: [number, number][], take?:'take'): void {
        let x: number = this.positionX + 1;
        let y: number = this.positionY - 1;
        while(true){
            if (!this.validateMove(moveSet, [x, y], take)) break;
            x += 1;
            y -= 1;
        }
    }

}

class Queen extends Piece {
    constructor(position: [number, number], color: 'white' | 'black') {
        super(position, color, 9, "Rainha", { white: "♛", black: "♕" });
    }

    takeSet(): [number, number][] {
        return this.moveSet('take');
    }

    moveSet(take?: 'take'): [number, number][] {
        var moveSet: [number, number][] = [];
        this.moveSetTopLeft(moveSet, take);
        this.moveSetTopRight(moveSet, take);
        this.moveSetBottomLeft(moveSet, take);
        this.moveSetBottomRight(moveSet, take);
        this.moveSetTopBottom(moveSet, take);
        this.moveSetRightLeft(moveSet, take);
        return moveSet;
    }

    validateMovestraight(moveSet: [number, number][], move: [number, number], take?: 'take'): boolean {
        if (!verifyIfPositionsExists(move)) {
            return false;
        }

        const piece: Piece | false = foundPieceBySquare(move);
    
        if (!piece) {
            moveSet.push(move);
            return true;
        }
        
        if (piece.color !== this.color || take) {
            moveSet.push(move);
            return false;
        }

        return false;
    }

    moveSetTopBottom(moveSet: [number, number][], take?: 'take'): void {

        for (let i = this.positionY + 1 ; i <= 8 ; i++){
            if (!this.validateMovestraight(moveSet, [this.positionX, i], take)) break;
        }

        for (let i = this.positionY-1 ; i >= 1 ; i--){
            if (!this.validateMovestraight(moveSet, [this.positionX, i], take)) break;
        }
    }
    
    moveSetRightLeft(moveSet: [number, number][], take?: 'take'): void {

        for (let i = this.positionX + 1 ; i <= 8 ; i++){
            if (!this.validateMovestraight(moveSet, [i, this.positionY], take)) break;
        }

        for (let i = this.positionX - 1 ; i >= 1 ; i--){
            if (!this.validateMovestraight(moveSet, [i, this.positionY], take)) break;
        }
    }

    validateMoveDiagonal(moveSet: [number, number][], move: [number, number], take?: 'take'): boolean {
        if (!verifyIfPositionsExists(move)) {
            return false;
        }

        const piece: Piece | false = foundPieceBySquare(move);
    
        if (!piece) {
            moveSet.push(move);
            return true;
        }
        
        if (piece.color !== this.color || take) {
            moveSet.push(move);
            return false;
        }
        return false;
    }

    moveSetTopLeft(moveSet: [number, number][], take?: 'take'): void {
        let x: number = this.positionX - 1;
        let y: number = this.positionY + 1;
        while(true){
            if (!this.validateMoveDiagonal(moveSet, [x, y], take)) break;
            x -= 1;
            y += 1;
        }
    }
    
    moveSetTopRight(moveSet: [number, number][], take?: 'take'): void {
        let x: number = this.positionX + 1;
        let y: number = this.positionY + 1;
        while(true){
            if (!this.validateMoveDiagonal(moveSet, [x, y], take)) break;
            x += 1;
            y += 1;
        }
    }

    moveSetBottomLeft(moveSet: [number, number][], take?: 'take'): void {
        let x: number = this.positionX - 1;
        let y: number = this.positionY - 1;
        while(true){
            if (!this.validateMoveDiagonal(moveSet, [x, y], take)) break;
            x -= 1;
            y -= 1;
        }
    }

    moveSetBottomRight(moveSet: [number, number][], take?: 'take'): void {
        let x: number = this.positionX + 1;
        let y: number = this.positionY - 1;
        while(true){
            if (!this.validateMoveDiagonal(moveSet, [x, y], take)) break;
            x += 1;
            y -= 1;
        }
    }
}

class King extends Piece {
    neverMoved: true | false = true;

    constructor(position: [number, number], color: 'white' | 'black') {
        super(position, color, 0, "Rei", { white: "♚", black: "♔" });
    }

    takeSet(): [number, number][] {
        return this.moveSet('take')
    }

    moveSet(take?:'take'): [number, number][] {
        const moveSet: [number, number][] = [];

        const moveleft = this.validateMove([this.positionX-1, this.positionY], take);
        if (moveleft) moveSet.push(moveleft);

        const moveleftTop = this.validateMove([this.positionX-1, this.positionY+1], take);
        if (moveleftTop) moveSet.push(moveleftTop);

        const movetop = this.validateMove([this.positionX, this.positionY+1], take);
        if (movetop) moveSet.push(movetop);

        const moveTopRight = this.validateMove([this.positionX+1, this.positionY+1], take);
        if (moveTopRight) moveSet.push(moveTopRight);

        const moveRight = this.validateMove([this.positionX+1, this.positionY], take);
        if (moveRight) moveSet.push(moveRight);

        const moveRightBottom = this.validateMove([this.positionX+1, this.positionY-1], take);
        if (moveRightBottom) moveSet.push(moveRightBottom);

        const moveBottom = this.validateMove([this.positionX, this.positionY-1], take);
        if (moveBottom) moveSet.push(moveBottom);

        const moveBottomLeft = this.validateMove([this.positionX-1, this.positionY-1], take);
        if (moveBottomLeft) moveSet.push(moveBottomLeft);

        return moveSet;
    }

    specialMoveSet(): specialMove[]{
        const specialMoveSet: specialMove[] = [];

        //Move set to the long castle
        this.moveSetShortCastle(specialMoveSet);

        //Move set to the short castle
        this.moveSetLongCastle(specialMoveSet);
        
        return specialMoveSet;
    }

    moveSetShortCastle(specialMoveSet: specialMove[]): void{
        const rook = foundPieceBySquare([8, this.positionY])
        if (!rook) return //if theres no piece on initial rook square, return
        if (!(rook instanceof Rook)) return //if the piece on the rook square isnt a rook, return
        if (!(this.neverMoved)) return //if the king already moved, return
        if (!(rook.neverMoved)) return //if the rook already moved, return
        if ((verifyIfSquareUnderAttack([this.positionX, this.positionY]))) return // if under attack, return
        if ((foundPieceBySquare([7, this.positionY]))) return //if theres a piece on the way, return
        if ((verifyIfSquareUnderAttack([7, this.positionY]))) return // if way under attack, return
        if ((foundPieceBySquare([6, this.positionY]))) return //if theres a piece on the way, return
        if ((verifyIfSquareUnderAttack([6, this.positionY]))) return // if way under attack, return
        specialMoveSet.push('shortCastle') //Return shortCastle to caller
        return 
    }
    
    moveSetLongCastle(specialMoveSet: specialMove[]): void{
        const rook = foundPieceBySquare([1, this.positionY])
        if (!rook) return //if theres no piece on initial rook square, return
        if (!(rook instanceof Rook)) return //if the piece on the rook square isnt a rook, return
        if (!(this.neverMoved)) return //if the king already moved, return
        if (!(rook.neverMoved)) return //if the rook already moved, return
        if ((verifyIfSquareUnderAttack([this.positionX, this.positionY]))) return // if under attack, return
        if ((foundPieceBySquare([3, this.positionY]))) return //if theres a piece on the way, return
        if ((verifyIfSquareUnderAttack([3, this.positionY]))) return // if way under attack, return
        if ((foundPieceBySquare([4, this.positionY]))) return //if theres a piece on the way, return
        if ((verifyIfSquareUnderAttack([4, this.positionY]))) return // if way under attack, return
        specialMoveSet.push('longCastle') //Return longCastle to caller
        return 
    }

    validateMove(move: [number, number], take?:'take'): [number, number] | false {
        
        if (!verifyIfPositionsExists(move)) return false; //If the square doesnt exists, return false

        if (take) return move; //If its a takeSet, return move

        const piece: Piece | false = foundPieceBySquare(move); //Get the piece from the square
    
        if (!piece) return move; //return move if theres none piece on the square 
        
        if (piece.color !== this.color) return move; //return move if its the opponent piece

        return false; //return false else (its a friendly piece)
    };

};

//validate if DOM reference points to a valid element

function validateDOM(DOM: HTMLElement | null, resume: string): HTMLElement {
    if (DOM !== null) {
        return DOM;
    }
    throw new Error(`Erro tentando acessar o elemento "${resume}"`);
};

//Parameters to configure

const parameters: {
    board: {
        value: string;
        description: string;
        size: string;
    },
    initialPosition: piece[]
} = {
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
        new Pawn([8, 2], "white")
    ]
};

//Store DOM references and initial configurations to use on runtime

var turn: "black" | "white" = 'white';
var selectedPiece: piece;
var currentEnPassant: piece;
const pieces: piece[] = parameters.initialPosition;
const board: HTMLElement = validateDOM(document.getElementById(parameters.board.value), parameters.board.description);

//Run main function

main();

function main(): void {
    initialize();
};

//Initialize settings to start 

function initialize(): void{
    setSizeBoard(parameters.board.size);
    popBoard();
    window.onresize = popBoard;
};

//Board size settings set

function setSizeBoard(size: string): void {
    board.style.width = size;
    board.style.height = size;
};

//Pop up the divs on the board

function popBoard(): void {

    //Calcule the size of the squares

    board.innerHTML = ''
    board.appendChild
    const boardSize = board.offsetWidth;
    const squareSize = boardSize / 8 - 0.1;
    const html = new DocumentFragment();

    let div = document.createElement("div")
    div.setAttribute("id", "div-message")

    let divContent = document.createElement("div")
    divContent.setAttribute("id", "title-message")
    div.append(divContent)
    
    divContent = document.createElement("div")
    divContent.setAttribute("id", "message")
    div.append(divContent)
    html.append(div)

    //Create and put on the board all the squares created

    for (let y = 8; y >= 1; y--) {
        for (let x = 1; x <= 8; x++) {
            const div: HTMLElement = document.createElement("div");
            div.style.width = `${ squareSize }px`;
            div.style.height = `${ squareSize }px`;
            ((x + y - 1) % 2)?div.classList.add("square-white"):div.classList.add("square-black");
            div.classList.add("square");
            div.style.fontSize = `${squareSize-10}px`;
            div.setAttribute("id", `${ x }-${ y }`);         
            const piece: piece | false = foundPieceBySquare([x, y]);
            if (piece){
                placePiece(piece, div);
                if (piece.color == turn){
                    div.addEventListener("click", function() {
                        handleClickSquareEvent(this);
                    });
                }
            }
            html.append(div);
        }
    }
    board.append(html);
    if (verifyIfKingUnderAttack(turn)) popKingCheck();
};

//Place the piece in the square reference

function placePiece(piece: piece, squareReference: HTMLElement): void {
    squareReference.innerHTML = piece.aparence;
    if (piece.color == 'black'){
        squareReference.style.color = '#000';
        squareReference.style.textShadow = '2px 0 #fff, -2px 0 #fff, 0 2px #fff, 0 -2px #fff, 1px 1px #fff, -1px -1px #fff, 1px -1px #fff, -1px 1px #fff';
    } else {
        squareReference.style.textShadow = '4px 0 #000, -4px 0 #000, 0 4px #000, 0 -4px #000,2px 2px #000, -2px -2px #000, 2px -2px #000, -2px 2px #000';
    }
}

//If a piece exists on the square, return the piece. otherwise, return false.

function foundPieceBySquare(squareReference: [number, number] | HTMLElement): piece | false {
    if (squareReference instanceof(HTMLElement)) squareReference = getPositionsFromSquare(squareReference);
    for (let i = 0 ; i < pieces.length ; i++){
        if (pieces[i].positionX == squareReference[0]){
            if (pieces[i].positionY == squareReference[1]) {
                return pieces[i];
            }
        }
    }
    return false;
}

//Get the square DOM reference from the position[x, y]

function getSquareFromPositions(position: [number, number]): HTMLElement {
    const id: string = `${position[0]}-${position[1]}`;
    const square: HTMLElement | null = document.getElementById(id);
    return validateDOM(square, `casa [${id}] não encontrada`);
}

//Get the position [x, y] from the square DOM reference

function getPositionsFromSquare(squareReference: HTMLElement): [number, number] {
    const id: string = squareReference.id;
    const positionX: number = parseInt(id[0]);
    const positionY: number = parseInt(id[2]);
    return [positionX, positionY];
}

//Process the clicked square

function handleClickSquareEvent(squareReference: HTMLElement): void{
    popBoard();
    console.log(`Clicou em ${getPositionsFromSquare(squareReference)}`);
    const piece: piece | false = foundPieceBySquare(squareReference);
    if (piece){
        selectedPiece = piece;
        placeValidMoves(piece);
        placeValidSpecialMoves(piece);
    } 
}

//Place all valid moves of a piece

function placeValidMoves(piece: piece): void {
    const moves: [number, number][] = returnMoveSetThatNotCheckOwnKing(piece.moveSet(), piece);

    moves.forEach(([x, y]) => {
        const squareReference = getSquareFromPositions([x, y]);
        const pieceTarget = foundPieceBySquare(squareReference);
        
        if (pieceTarget) {
            // Se houver uma peça no quadrado, marca como possível captura
            squareReference.classList.add("square-take");
            squareReference.addEventListener("click", () => {
                handleClickTakeEvent(piece, pieceTarget);
            });
        } else {
            // Se não houver peça no quadrado, marca como possível movimento
            squareReference.classList.add("square-move");
            squareReference.addEventListener("click", () => {
                handleClickMoveEvent(piece, squareReference);
            });
        }
    });
}

function placeValidSpecialMoves(piece: piece): void {
    if (!("specialMoveSet" in piece)) return
    const moves: specialMove[] = piece.specialMoveSet();
    moves.forEach(move => {
        let squareReference: HTMLElement;
        switch (move) {
            case 'enPassant':
                const direction1: number = currentEnPassant.color == 'black'? 1 : -1;
                const moveY1 = currentEnPassant.positionY + direction1;

                if (returnSpecialMoveSetThatNotCheckOwnKing([move], piece).length == 0) break;
                
                squareReference = getSquareFromPositions([currentEnPassant.positionX, moveY1])
                squareReference.classList.add("square-take");
                squareReference.addEventListener("click", () => {
                    handleClickEnPassantEvent(piece, squareReference);
                });
                break;
            case 'twoSquares':
                const direction2: number = selectedPiece.color == 'black'? -2 : 2;
                const moveY2 = selectedPiece.positionY + direction2;

                if (returnSpecialMoveSetThatNotCheckOwnKing([move], piece).length == 0) break;
                
                squareReference = getSquareFromPositions([selectedPiece.positionX, moveY2]);
                squareReference.classList.add("square-move");
                squareReference.addEventListener("click", () => {
                    handleClickTwoSquaresEvent(piece, squareReference);
                });
                break;
            case 'longCastle':
                if (returnSpecialMoveSetThatNotCheckOwnKing([move], piece).length == 0) break;
                squareReference = getSquareFromPositions([3, selectedPiece.positionY]);
                squareReference.classList.add("square-move");
                squareReference.addEventListener("click", () => {
                    handleClickLongCastleEvent(piece, squareReference);
                });
                break;
            case 'shortCastle':
                if (returnSpecialMoveSetThatNotCheckOwnKing([move], piece).length == 0) break;
                squareReference = getSquareFromPositions([7, selectedPiece.positionY]);
                squareReference.classList.add("square-move");
                squareReference.addEventListener("click", () => {
                    handleClickShortCastleEvent(piece, squareReference);
                });
                break;
        
            default:
                break;
        }
    })
}

//Process the piece to be taked

function handleClickTakeEvent(piece: piece, pieceTarget: piece): void{
    movePiece(piece, [pieceTarget.positionX, pieceTarget.positionY]);
    takePiece(pieceTarget);
    processTransitionToNextTurn();
}

//Process the squared to be moved to

function handleClickMoveEvent(piece: piece, squareReference: HTMLElement | [number, number]): void{
    if (squareReference instanceof HTMLElement) squareReference = getPositionsFromSquare(squareReference)
    movePiece(piece, squareReference);
    processTransitionToNextTurn();
}

//Process the special move en passant

function handleClickEnPassantEvent(piece: piece, squareReference: HTMLElement | [number, number]): void{
    if (squareReference instanceof HTMLElement) squareReference = getPositionsFromSquare(squareReference);
    movePiece(piece, squareReference);
    takePiece(currentEnPassant);
    processTransitionToNextTurn();
}

//Process the pawn two square move

function handleClickTwoSquaresEvent(piece: piece, squareReference: HTMLElement | [number, number]): void{
    if (squareReference instanceof HTMLElement) squareReference = getPositionsFromSquare(squareReference);
    movePiece(piece, squareReference);
    currentEnPassant = selectedPiece;
    processTransitionToNextTurn('passant');
}

//Process the short castle

function handleClickShortCastleEvent(piece: piece, squareReference: HTMLElement | [number, number]): void{
    if (squareReference instanceof HTMLElement) squareReference = getPositionsFromSquare(squareReference);
    movePiece(piece, squareReference);
    const rook: piece | false = foundPieceBySquare([8, selectedPiece.positionY]);
    if (rook) rook.positionX = 6
    processTransitionToNextTurn();
}

//Process the long castle

function handleClickLongCastleEvent(piece: piece, squareReference: HTMLElement | [number, number]): void{
    if (squareReference instanceof HTMLElement) squareReference = getPositionsFromSquare(squareReference);
    movePiece(piece, squareReference);
    const rook: piece | false = foundPieceBySquare([1, selectedPiece.positionY]);
    if (rook) rook.positionX = 4
    processTransitionToNextTurn();
}

//Process the common processes of the transition turn

function processTransitionToNextTurn(nullCurrentPassant?: 'passant'){
    if (!nullCurrentPassant) currentEnPassant = null;
    switchFlagNeverMovedIfHave(selectedPiece);
    switchTurn();
    popBoard();
    const check = verifyIfKingUnderAttack(turn);
    const noMoves: boolean = verifyIfNoMovesToDo();
    if (check) popKingCheck();
    if (noMoves){
        if (check) setFinalMessage("Vitória", `${turn == 'black'? 'Brancas':'Pretas'} vencem`)
        else setFinalMessage("Empate", "Afogamento")
    }
}

//verify if the position is in the board range

function verifyIfPositionsExists(squareReference: [number, number]): false | [number, number]{
    if (squareReference[0] >= 1 && squareReference[0] <= 8){
        if (squareReference[1] >= 1 && squareReference[1] <= 8){
            return squareReference;
        }
    }
    return false;
}

//Take the piece

function takePiece(piece: piece){
    pieces.splice(pieces.map(i => i.pieceId).indexOf(piece.pieceId), 1);
    if (piece.name == 'King' ) console.log("Renan venceu")
}

//Move the piece to the target square

function movePiece(piece: piece, squareReference: HTMLElement | [number, number]): void{
    if (squareReference instanceof(HTMLElement)) squareReference = getPositionsFromSquare(squareReference);
    piece.positionX = squareReference[0]
    piece.positionY = squareReference[1]
}

//Switch the turn to the opponent 

function switchTurn(): void{
    if (turn == 'black'){
        turn = 'white'
    }else{
        turn = 'black'
    }
}

function returnKingReference(color: 'black' | 'white'): piece | false{
    for (let i = 0 ; i< pieces.length ; i++){
        if (pieces[i].color == color && pieces[i] instanceof King){
            return pieces[i];
        }
    }
    return false;
}

function verifyIfKingUnderAttack(color: 'black' | 'white'): boolean{
    const king: piece | false = returnKingReference(color);
    if (king ) if(verifyIfSquareUnderAttack([king.positionX, king.positionY])) return true;
    return false;
}


//Search if the square is attacked

function verifyIfSquareUnderAttack(squareReference: HTMLElement | [number, number]): boolean{
    if (squareReference instanceof(HTMLElement)) squareReference = getPositionsFromSquare(squareReference);

    //Get a array with only oponnent pieces
    const oponnentPieces: piece[] = pieces.filter(x => x.color != turn);
    for (let i = 0 ; i < oponnentPieces.length ; i++){

        //Get the 
        const piece: piece = oponnentPieces[i];
        const takeSet: [number, number][] = piece.takeSet();
        for (let j = 0 ; j < takeSet.length ; j++){
            if (takeSet[j][0] == squareReference[0] && takeSet[j][1] == squareReference[1]) return true;
        }
    }
    return false;
}

//Switch tue flag "neverMoved" to false if the piece have it

function switchFlagNeverMovedIfHave(piece: piece): void{
    if ("neverMoved" in piece) piece.neverMoved = false;
}

//Verify if a certain move set will check the player himself

function returnMoveSetThatNotCheckOwnKing(moveSet: [number, number][], piece: piece): [number, number][]{
    const newMoveSet: [number, number][] = [];

    //Store original position of the piece
    const positionX = piece.positionX;
    const positionY = piece.positionY;

    //Verify move by move if this leaves own king vulnerable
    for (let i = 0 ; i < moveSet.length ; i++){
        const targetPiece: piece | false = foundPieceBySquare([moveSet[i][0], moveSet[i][1]]);
        if (targetPiece) takePiece(targetPiece);
        piece.positionX = moveSet[i][0];
        piece.positionY = moveSet[i][1];
        if (!verifyIfKingUnderAttack(turn)) newMoveSet.push(moveSet[i]);
        if (targetPiece) pieces.push(targetPiece);
    }

    //Return the piece to it original position
    piece.positionX = positionX;
    piece.positionY = positionY;

    return newMoveSet;
}

//Verify if a certain special move set will check the player himself

function returnSpecialMoveSetThatNotCheckOwnKing(specialMoveSet: specialMove[], piece: piece): specialMove[]{
    const newSpecialMoveSet: specialMove[] = [];
    specialMoveSet.forEach(specialMoveSet => {
        switch (specialMoveSet) {
            case 'enPassant':
                //for each vulnerable en passant piece color, set the piece thats will take it to stay 1 square in front of them
                const direction1: number = currentEnPassant.color == 'black'? 1 : -1;

                //Set the position of the taker move
                const moveY1 = currentEnPassant.positionY + direction1;

                //If theres none target piece, something wents wrong.
                const pieceTarget = currentEnPassant;
                if (!pieceTarget) throw console.error('Falha ao determinar alvo do en passant.');

                //Take off the board the target piece to simulate the move and see if its put/keep the king on danger
                takePiece(pieceTarget);
                if (returnMoveSetThatNotCheckOwnKing([[currentEnPassant.positionX, moveY1]], piece).length == 0){
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
                const direction2: number = piece.color == 'black'? -2 : 2;

                //Set the move
                const moveY2 = piece.positionY + direction2;   
                
                //Simulate the move and see if its put/keep the king on danger
                if (returnMoveSetThatNotCheckOwnKing([[piece.positionX, moveY2]], piece).length == 0) break;

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
    })
    return newSpecialMoveSet
}

//Verify if theres no moves to do

function verifyIfNoMovesToDo(): boolean{
    //Get the own king reference
    const king: false | piece = returnKingReference(turn)
    
    //If theres no king on the board, thats unexpected. Throws a error
    if (!king) throw console.error('O rei não foi encontrado!');

    //Get the moveset of the king
    const moves: [number, number][] = returnMoveSetThatNotCheckOwnKing(king.moveSet(), king);

    //If the king can move and avoid check, theres at least one move left.
    if (moves.length > 0){
        console.log(1, moves)
        return false
    } 

    //Get a array with only oponnent pieces
    const allyPieces: piece[] = pieces.filter(x => x.color == turn);
    for (let i = 0 ; i < allyPieces.length ; i++){
        const piece: piece = allyPieces[i];

        //Get the piece move set to know if its left the king safe
        const moveSet: [number, number][] = piece.moveSet();
        if (returnMoveSetThatNotCheckOwnKing(moveSet, piece).length != 0) {
            console.log(2, returnMoveSetThatNotCheckOwnKing(moveSet, piece), piece)
            return false
        }
        
        //Get the piece special move set (if it have) to know if its left the king safe
        const specialMoveSet: [number, number][] = piece.moveSet();
        if ("specialMoveSet" in piece)
        if (returnSpecialMoveSetThatNotCheckOwnKing(piece.specialMoveSet(), piece).length != 0){
            console.log(3, returnSpecialMoveSetThatNotCheckOwnKing(piece.specialMoveSet(), piece), piece)
            return false
        } 
    }
    //If nothing of this happens, then there are no more moves left
    return true;
}

//Set a final message to end the game

function setFinalMessage(title: string, message: string){
    const DOMdivMessage = validateDOM(document.getElementById("div-message"), 'Div mensagem não encontrada')
    const DOMtitleMessage = validateDOM(document.getElementById("title-message"), 'Título da mensagem não encontrada')
    const DOMmessage = validateDOM(document.getElementById("message"), 'mensagem não encontrada')

    if (!(DOMdivMessage || DOMtitleMessage || DOMmessage)) return
    DOMdivMessage.style.display = 'block'
    DOMtitleMessage.innerHTML = title
    DOMmessage.innerHTML = message
}

function popKingCheck(){
    const king: piece | false = returnKingReference(turn)
    if (!king) return
    const squareReference: HTMLElement = getSquareFromPositions([king.positionX, king.positionY])
/*     squareReference.style.textShadow = '2px 0 #f00, -2px 0 #f00, 0 2px #f00, 0 -2px #f00, 1px 1px #f00, -1px -1px #f00, 1px -1px #f00, -1px 1px #f00'; */
    squareReference.style.background = '#f00';
}