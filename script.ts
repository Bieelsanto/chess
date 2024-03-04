//Create the Piece classes

type piece = Pawn | Knight | Bishop | Rook | King | Queen;

var pieceId: number = 1

class Piece {
    positionX: number;
    positionY: number;
    color: 'white' | 'black';
    value: number;
    name: string;
    aparence: string;
    pieceId: number

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
        this.pieceId = pieceId
        pieceId += 1
    }

    setAparence(aparence: { "white": string, "black": string }) {
        return aparence.black;
    }
}

class Pawn extends Piece {
    neverMoved: true | false = true;

    constructor(position: [number, number], color: 'white' | 'black') {
        super(position, color, 1, "Peão", { white: "♟", black: "♙" });
    }

    moveSet(): [number, number][] {
        const moveSet: [number, number][] = [];
        if (this.color == 'white') return this.moveSetWhite(moveSet);
        else return this.moveSetBlack(moveSet);
    }

    moveSetBlack(moveSet: [number, number][]): [number, number][] {
        let move: [number, number];
        let piece: piece | false;

        //Move set to one square move
        move = [this.positionX, this.positionY-1]
        if (!foundPieceBySquare(move)){
            moveSet.push(move);

            //Move set to the second square move
            move = [this.positionX, this.positionY-2];
            if (this.neverMoved && !foundPieceBySquare(move)) moveSet.push(move);

        } 
        
        //Move set to take moves
        move = [this.positionX-1, this.positionY-1];
        piece = foundPieceBySquare(move);
        if (piece && piece.color != this.color) moveSet.push(move);
        
        move = [this.positionX+1, this.positionY-1];
        piece = foundPieceBySquare(move);
        if (piece && piece.color != this.color) moveSet.push(move);

        return moveSet;
    }
    
    moveSetWhite(moveSet: [number, number][]): [number, number][] {
        let move: [number, number];
        let piece: piece | false;

        //Move set to one square move
        move = [this.positionX, this.positionY+1]
        if (!foundPieceBySquare(move)){
            moveSet.push(move);
            
            //Move set to the second square move
            move = [this.positionX, this.positionY+2]
            if (this.neverMoved && !foundPieceBySquare(move)) moveSet.push(move);
        } 


        //Move set to take moves
        move = [this.positionX-1, this.positionY+1];
        piece = foundPieceBySquare(move);
        if (piece && piece.color != this.color) moveSet.push(move);
        
        move = [this.positionX+1, this.positionY+1];
        piece = foundPieceBySquare(move);
        if (piece && piece.color != this.color) moveSet.push(move);

        return moveSet;
    }

}

class Rook extends Piece {
    neverMoved: true | false = true;

    constructor(position: [number, number], color: 'white' | 'black') {
        super(position, color, 5, "Torre", { white: "♜", black: "♖" });
    }

    moveSet(): [number, number][] {
        var moveSet: [number, number][] = [];
        this.moveSetTopBottom(moveSet);
        this.moveSetRightLeft(moveSet);
        return moveSet;
    }

    validateMove(moveSet: [number, number][], move: [number, number]): boolean {
        if (!checkIfPositionsExists(move)) {
            return false;
        }

        const piece: Piece | false = foundPieceBySquare(move);
    
        if (!piece) {
            moveSet.push(move);
            return true;
        }
        
        if (piece.color !== this.color) {
            moveSet.push(move);
            return false;
        }

        return false;
    }

    moveSetTopBottom(moveSet: [number, number][]): void {
        let move: [number, number];
        let piece: piece | false;

        for (let i = this.positionY + 1 ; i <= 8 ; i++){
            if (!this.validateMove(moveSet, [this.positionX, i])) break;
        }

        for (let i = this.positionY-1 ; i >= 1 ; i--){
            if (!this.validateMove(moveSet, [this.positionX, i])) break;
        }
    }
    
    moveSetRightLeft(moveSet: [number, number][]): void {
        let move: [number, number];
        let piece: piece | false;

        for (let i = this.positionX + 1 ; i <= 8 ; i++){
            if (!this.validateMove(moveSet, [i, this.positionY])) break;
        }

        for (let i = this.positionX - 1 ; i >= 1 ; i--){
            if (!this.validateMove(moveSet, [i, this.positionY])) break;
        }
    }

}

class Knight extends Piece {
    constructor(position: [number, number], color: 'white' | 'black') {
        super(position, color, 3, "Cavalo", { white: "♞", black: "♘" });
    }

    moveSet(): [number, number][] {
        var moveSet: [number, number][] = [];
        let move: [number, number] | false;

        move = this.validateMove([this.positionX-2, this.positionY+1]);
        if (move) moveSet.push(move);

        move = this.validateMove([this.positionX-2, this.positionY-1]);
        if (move) moveSet.push(move);

        move = this.validateMove([this.positionX+1, this.positionY+2]);
        if (move) moveSet.push(move);

        move = this.validateMove([this.positionX-1, this.positionY+2]);
        if (move) moveSet.push(move);

        move = this.validateMove([this.positionX+2, this.positionY+1]);
        if (move) moveSet.push(move);

        move = this.validateMove([this.positionX+2, this.positionY-1]);
        if (move) moveSet.push(move);

        move = this.validateMove([this.positionX+1, this.positionY-2]);
        if (move) moveSet.push(move);

        move = this.validateMove([this.positionX-1, this.positionY-2]);
        if (move) moveSet.push(move);

        return moveSet;
    }

    validateMove(move: [number, number]): [number, number] | false {

        if (!checkIfPositionsExists(move)) return false;

        const piece: Piece | false = foundPieceBySquare(move);
    
        if (!piece) return move;
        
        if (piece.color !== this.color) return move;

        return false;
    }

}

class Bishop extends Piece {
    constructor(position: [number, number], color: 'white' | 'black') {
        super(position, color, 3, "Bispo", { white: "♝", black: "♗" });
    }

    moveSet(): [number, number][] {
        const moveSet: [number, number][] = [];
        this.moveSetTopLeft(moveSet);
        this.moveSetTopRight(moveSet);
        this.moveSetBottomLeft(moveSet);
        this.moveSetBottomRight(moveSet);
        return moveSet;
    }

    validateMove(moveSet: [number, number][], move: [number, number]): boolean {
        if (!checkIfPositionsExists(move)) {
            return false;
        }

        const piece: Piece | false = foundPieceBySquare(move);
    
        if (!piece) {
            moveSet.push(move);
            return true;
        }
        
        if (piece.color !== this.color) {
            moveSet.push(move);
            return false;
        }

        return false;
    }

    moveSetTopLeft(moveSet: [number, number][]): void {
        let x: number = this.positionX - 1;
        let y: number = this.positionY + 1;
        while(true){
            if (!this.validateMove(moveSet, [x, y])) break;
            x -= 1;
            y += 1;
        }
    }
    
    moveSetTopRight(moveSet: [number, number][]): void {
        let x: number = this.positionX + 1;
        let y: number = this.positionY + 1;
        while(true){
            if (!this.validateMove(moveSet, [x, y])) break;
            x += 1;
            y += 1;
        }

    }

    moveSetBottomLeft(moveSet: [number, number][]): void {
        let x: number = this.positionX - 1;
        let y: number = this.positionY - 1;
        while(true){
            if (!this.validateMove(moveSet, [x, y])) break;
            x -= 1;
            y -= 1;
        }
    }

    moveSetBottomRight(moveSet: [number, number][]): void {
        let x: number = this.positionX + 1;
        let y: number = this.positionY - 1;
        while(true){
            if (!this.validateMove(moveSet, [x, y])) break;
            x += 1;
            y -= 1;
        }
    }

}

class Queen extends Piece {
    constructor(position: [number, number], color: 'white' | 'black') {
        super(position, color, 9, "Rainha", { white: "♛", black: "♕" });
    }

    moveSet(): [number, number][] {
        var moveSet: [number, number][] = [];
        this.moveSetTopLeft(moveSet);
        this.moveSetTopRight(moveSet);
        this.moveSetBottomLeft(moveSet);
        this.moveSetBottomRight(moveSet);
        this.moveSetTopBottom(moveSet);
        this.moveSetRightLeft(moveSet);
        return moveSet;
    }

    validateMovestraight(moveSet: [number, number][], move: [number, number]): boolean {
        if (!checkIfPositionsExists(move)) {
            return false;
        }

        const piece: Piece | false = foundPieceBySquare(move);
    
        if (!piece) {
            moveSet.push(move);
            return true;
        }
        
        if (piece.color !== this.color) {
            moveSet.push(move);
            return false;
        }

        return false;
    }

    moveSetTopBottom(moveSet: [number, number][]): void {
        let move: [number, number];
        let piece: piece | false;

        for (let i = this.positionY + 1 ; i <= 8 ; i++){
            if (!this.validateMovestraight(moveSet, [this.positionX, i])) break;
        }

        for (let i = this.positionY-1 ; i >= 1 ; i--){
            if (!this.validateMovestraight(moveSet, [this.positionX, i])) break;
        }
    }
    
    moveSetRightLeft(moveSet: [number, number][]): void {
        let move: [number, number];
        let piece: piece | false;

        for (let i = this.positionX + 1 ; i <= 8 ; i++){
            if (!this.validateMovestraight(moveSet, [i, this.positionY])) break;
        }

        for (let i = this.positionX - 1 ; i >= 1 ; i--){
            if (!this.validateMovestraight(moveSet, [i, this.positionY])) break;
        }
    }

    validateMoveDiagonal(moveSet: [number, number][], move: [number, number]): boolean {
        if (!checkIfPositionsExists(move)) {
            return false;
        }

        const piece: Piece | false = foundPieceBySquare(move);
    
        if (!piece) {
            moveSet.push(move);
            return true;
        }
        
        if (piece.color !== this.color) {
            moveSet.push(move);
            return false;
        }

        return false;
    }

    moveSetTopLeft(moveSet: [number, number][]): void {
        let x: number = this.positionX - 1;
        let y: number = this.positionY + 1;
        while(true){
            if (!this.validateMoveDiagonal(moveSet, [x, y])) break;
            x -= 1;
            y += 1;
        }
    }
    
    moveSetTopRight(moveSet: [number, number][]): void {
        let x: number = this.positionX + 1;
        let y: number = this.positionY + 1;
        while(true){
            if (!this.validateMoveDiagonal(moveSet, [x, y])) break;
            x += 1;
            y += 1;
        }

    }

    moveSetBottomLeft(moveSet: [number, number][]): void {
        let x: number = this.positionX - 1;
        let y: number = this.positionY - 1;
        while(true){
            if (!this.validateMoveDiagonal(moveSet, [x, y])) break;
            x -= 1;
            y -= 1;
        }
    }

    moveSetBottomRight(moveSet: [number, number][]): void {
        let x: number = this.positionX + 1;
        let y: number = this.positionY - 1;
        while(true){
            if (!this.validateMoveDiagonal(moveSet, [x, y])) break;
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

    moveSet(): [number, number][] {
        var moveSet: [number, number][] = [];

        const moveleft = this.validateMove([this.positionX-1, this.positionY]);
        if (moveleft) moveSet.push(moveleft);

        const moveleftTop = this.validateMove([this.positionX-1, this.positionY+1]);
        if (moveleftTop) moveSet.push(moveleftTop);

        const movetop = this.validateMove([this.positionX, this.positionY+1]);
        if (movetop) moveSet.push(movetop);

        const moveTopRight = this.validateMove([this.positionX+1, this.positionY+1]);
        if (moveTopRight) moveSet.push(moveTopRight);

        const moveRight = this.validateMove([this.positionX+1, this.positionY]);
        if (moveRight) moveSet.push(moveRight);

        const moveRightBottom = this.validateMove([this.positionX+1, this.positionY-1]);
        if (moveRightBottom) moveSet.push(moveRightBottom);

        const moveBottom = this.validateMove([this.positionX, this.positionY-1]);
        if (moveBottom) moveSet.push(moveBottom);

        const moveBottomLeft = this.validateMove([this.positionX-1, this.positionY-1]);
        if (moveBottomLeft) moveSet.push(moveBottomLeft);

        return moveSet;
    }

    validateMove(move: [number, number]): [number, number] | false {

        if (!checkIfPositionsExists(move)) return false;

        const piece: Piece | false = foundPieceBySquare(move);
    
        if (!piece) return move;
        
        if (piece.color !== this.color) return move;

        return false;
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

    board.innerHTML = '';
    const boardSize = board.offsetWidth;
    const squareSize = boardSize / 8 - 0.1;
    const html = new DocumentFragment();

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
};

//Place piece in the square reference

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
    } 
}

//Place all valid moves of a piece

function placeValidMoves(piece: piece): void {
    const moves: [number, number][] = piece.moveSet();
    for (let i = 0 ; i < moves.length ; i++){
        const squareReference = getSquareFromPositions([moves[i][0], moves[i][1]]);
        const pieceTarget = foundPieceBySquare(squareReference)
        if (pieceTarget){
            squareReference.classList.add("square-take");
            squareReference.addEventListener("click", function() {
                handleClickTakeEvent(piece, pieceTarget);
            });
        } else {
            squareReference.classList.add("square-move");
            squareReference.addEventListener("click", function() {
                handleClickMoveEvent(piece, squareReference);
            });
        } 
            
    }
}

//Process the piece to be taked

function handleClickTakeEvent(piece: piece, pieceTarget: piece): void{
    switchFlagNeverMovedIfHave(piece)
    movePiece(piece, [pieceTarget.positionX, pieceTarget.positionY]);
    takePiece(pieceTarget);
    switchTurn();
    popBoard();
}

//Process the squared to be moved to

function handleClickMoveEvent(piece: piece, squareReference: HTMLElement): void{
    switchFlagNeverMovedIfHave(piece)
    movePiece(piece, squareReference);
    switchTurn();
    popBoard();
}

//Check if the position is in the board range

function checkIfPositionsExists(squareReference: [number, number]): false | [number, number]{
    if (squareReference[0] >= 1 && squareReference[0] <= 8){
        if (squareReference[1] >= 1 && squareReference[1] <= 8){
            return squareReference;
        }
    }
    return false;
}

//Take the piece

function takePiece(piece: piece){
    pieces.splice(pieces.findIndex(e => e.pieceId == piece.pieceId), 1);
}

//Move the piece to the target square

function movePiece(piece: piece, squareReference: HTMLElement | [number, number]): void{
    if (squareReference instanceof(HTMLElement)) squareReference = getPositionsFromSquare(squareReference);
    piece.positionX = squareReference[0]
    piece.positionY = squareReference[1]
}

function switchTurn(): void{
    if (turn == 'black'){
        turn = 'white'
    }else{
        turn = 'black'
    }
}

function switchFlagNeverMovedIfHave(piece: piece): void{
    if (piece instanceof Pawn) piece.neverMoved = false;
    if (piece instanceof King) piece.neverMoved = false;
    if (piece instanceof Rook) piece.neverMoved = false;
}