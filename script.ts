//Create the Piece classes

type piece = Pawn | Knight | Bishop | Rook | King | Queen;

class Piece {
    positionX: number;
    positionY: number;
    color: 'white' | 'black';
    value: number;
    name: string;
    aparence: string;

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
        if (piece && piece.color != turn) moveSet.push(move);
        
        move = [this.positionX+1, this.positionY-1];
        piece = foundPieceBySquare(move);
        if (piece && piece.color != turn) moveSet.push(move);

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
        if (piece && piece.color != turn) moveSet.push(move);
        
        move = [this.positionX+1, this.positionY+1];
        piece = foundPieceBySquare(move);
        if (piece && piece.color != turn) moveSet.push(move);

        return moveSet;
    }

}

class Rook extends Piece {
    constructor(position: [number, number], color: 'white' | 'black') {
        super(position, color, 5, "Torre", { white: "♜", black: "♖" });
    }

    moveSet(): [number, number][] {
        var moveSet: [number, number][] = [];
        moveSet = this.moveSetTopBottom(moveSet);
        moveSet = this.moveSetRightLeft(moveSet);
        return moveSet;
    }

    moveSetTopBottom(moveSet: [number, number][]): [number, number][] {
        let move: [number, number];
        let piece: piece | false;

        for (let i = this.positionY + 1 ; i <= 8 ; i++){
            move = [this.positionX, i];
            piece = foundPieceBySquare(move);
            if (piece){
                if (piece.color != turn){
                    moveSet.push(move);
                }
                break;
            } 
            moveSet.push([this.positionX, i]);
        }

        for (let i = this.positionY-1 ; i >= 1 ; i--){
            move = [this.positionX, i];
            piece = foundPieceBySquare(move);
            if (piece){
                if (piece.color != turn){
                    moveSet.push(move);
                }
                break;
            } 
            moveSet.push([this.positionX, i]);
        }

        return moveSet;
    }
    
    moveSetRightLeft(moveSet: [number, number][]): [number, number][] {
        let move: [number, number];
        let piece: piece | false;

        for (let i = this.positionX + 1 ; i <= 8 ; i++){
            move = [i, this.positionY];
            piece = foundPieceBySquare(move);
            if (piece){
                if (piece.color != turn){
                    moveSet.push(move);
                }
                break;
            } 
            moveSet.push([i, this.positionY]);
        }

        for (let i = this.positionX - 1 ; i >= 1 ; i--){
            move = [i, this.positionY];
            piece = foundPieceBySquare(move);
            if (piece){
                if (piece.color != turn){
                    moveSet.push(move);
                }
                break;
            } 
            moveSet.push([i, this.positionY]);
        }
        return moveSet;
    }

}

class Knight extends Piece {
    constructor(position: [number, number], color: 'white' | 'black') {
        super(position, color, 3, "Cavalo", { white: "♞", black: "♘" });
    }

    moveSet(): [number, number][] {
        var moveSet: [number, number][] = [];
        let move: [number, number] | false;
        let piece: piece | false;

        move = [this.positionX-2, this.positionY+1];
        if (checkIfPositionsExists(move)){
            piece = foundPieceBySquare(move)
            if (piece)
            moveSet.push(move);
        } 

        move = checkIfPositionsExists([this.positionX-2, this.positionY-1]);
        if (move) moveSet.push(move);

        move = checkIfPositionsExists([this.positionX+1, this.positionY+2]);
        if (move) moveSet.push(move);

        move = checkIfPositionsExists([this.positionX-1, this.positionY+2]);
        if (move) moveSet.push(move);

        move = checkIfPositionsExists([this.positionX+2, this.positionY+1]);
        if (move) moveSet.push(move);

        move = checkIfPositionsExists([this.positionX+2, this.positionY-1]);
        if (move) moveSet.push(move);

        move = checkIfPositionsExists([this.positionX+1, this.positionY-2]);
        if (move) moveSet.push(move);

        move = checkIfPositionsExists([this.positionX-1, this.positionY-2]);
        if (move) moveSet.push(move);

        return moveSet;
    }

}

class Bishop extends Piece {
    constructor(position: [number, number], color: 'white' | 'black') {
        super(position, color, 3, "Bispo", { white: "♝", black: "♗" });
    }

    moveSet(): [number, number][] {
        var moveSet: [number, number][] = [];
        moveSet = this.moveSetTopLeft(moveSet);
        moveSet = this.moveSetTopRight(moveSet);
        moveSet = this.moveSetBottomLeft(moveSet);
        moveSet = this.moveSetBottomRight(moveSet);
        return moveSet;
    }

    moveSetTopLeft(moveSet: [number, number][]): [number, number][] {
        let x: number = this.positionX;
        let y: number = this.positionY;
        while(true){
            const position: [number, number] | false = checkIfPositionsExists([x, y]);
            if (position){
                if(this.positionX != x || this.positionY != y) moveSet.push(position);
                x -= 1;
                y += 1;
            }else{
                break;
            }
        }
        return moveSet;
    }
    
    moveSetTopRight(moveSet: [number, number][]): [number, number][] {
        let x: number = this.positionX;
        let y: number = this.positionY;
        while(true){
            const position: [number, number] | false = checkIfPositionsExists([x, y]);
            if (position){
                if(this.positionX != x || this.positionY != y) moveSet.push(position);
                x += 1;
                y += 1;
            }else{
                break;
            }
        }
        return moveSet;
    }

    moveSetBottomLeft(moveSet: [number, number][]): [number, number][] {
        let x: number = this.positionX;
        let y: number = this.positionY;
        while(true){
            const position: [number, number] | false = checkIfPositionsExists([x, y]);
            if (position){
                if(this.positionX != x || this.positionY != y) moveSet.push(position);
                x -= 1;
                y -= 1;
            }else{
                break;
            }
        }
        return moveSet;
    }

    moveSetBottomRight(moveSet: [number, number][]): [number, number][] {
        let x: number = this.positionX;
        let y: number = this.positionY;
        while(true){
            const position: [number, number] | false = checkIfPositionsExists([x, y]);
            if (position){
                if(this.positionX != x || this.positionY != y) moveSet.push(position);
                x += 1;
                y -= 1;
            }else{
                break;
            }
        }
        return moveSet;
    }

}

class Queen extends Piece {
    constructor(position: [number, number], color: 'white' | 'black') {
        super(position, color, 9, "Rainha", { white: "♛", black: "♕" });
    }

    moveSet(): [number, number][] {
        var moveSet: [number, number][] = [];
        moveSet = this.moveSetTopLeft(moveSet);
        moveSet = this.moveSetTopRight(moveSet);
        moveSet = this.moveSetBottomLeft(moveSet);
        moveSet = this.moveSetBottomRight(moveSet);
        moveSet = this.moveSetTopBottom(moveSet);
        moveSet = this.moveSetRightLeft(moveSet);
        return moveSet;
    }

    moveSetTopLeft(moveSet: [number, number][]): [number, number][] {
        let x: number = this.positionX;
        let y: number = this.positionY;
        while(true){
            const position: [number, number] | false = checkIfPositionsExists([x, y]);
            if (position){
                moveSet.push(position);
                x -= 1;
                y += 1;
            }else{
                break;
            }
        }
        return moveSet;
    }
    
    moveSetTopRight(moveSet: [number, number][]): [number, number][] {
        let x: number = this.positionX;
        let y: number = this.positionY;
        while(true){
            const position: [number, number] | false = checkIfPositionsExists([x, y]);
            if (position){
                moveSet.push(position);
                x += 1;
                y += 1;
            }else{
                break;
            }
        }
        return moveSet;
    }

    moveSetBottomLeft(moveSet: [number, number][]): [number, number][] {
        let x: number = this.positionX;
        let y: number = this.positionY;
        while(true){
            const position: [number, number] | false = checkIfPositionsExists([x, y]);
            if (position){
                moveSet.push(position);
                x -= 1;
                y -= 1;
            }else{
                break;
            }
        }
        return moveSet;
    }

    moveSetBottomRight(moveSet: [number, number][]): [number, number][] {
        let x: number = this.positionX;
        let y: number = this.positionY;
        while(true){
            const position: [number, number] | false = checkIfPositionsExists([x, y]);
            if (position){
                moveSet.push(position);
                x += 1;
                y -= 1;
            }else{
                break;
            }
        }
        return moveSet;
    }

    moveSetTopBottom(moveSet: [number, number][]): [number, number][] {
        for (let i = 1 ; i <= 8 ; i++){
            if (this.positionY == i) continue;
            moveSet.push([this.positionX, i]);
        }
        return moveSet;
    }
    
    moveSetRightLeft(moveSet: [number, number][]): [number, number][] {
        for (let i = 8 ; i >= 1 ; i--){
            if (this.positionX == i) continue;
            moveSet.push([i, this.positionY]);
        }
        return moveSet;
    }

}

class King extends Piece {
    constructor(position: [number, number], color: 'white' | 'black') {
        super(position, color, 0, "Rei", { white: "♚", black: "♔" });
    }

    moveSet(): [number, number][] {
        var moveSet: [number, number][] = [];

        const moveleft = checkIfPositionsExists([this.positionX-1, this.positionY]);
        if (moveleft) moveSet.push(moveleft);

        const moveleftTop = checkIfPositionsExists([this.positionX-1, this.positionY+1]);
        if (moveleftTop) moveSet.push(moveleftTop);

        const movetop = checkIfPositionsExists([this.positionX, this.positionY+1]);
        if (movetop) moveSet.push(movetop);

        const moveTopRight = checkIfPositionsExists([this.positionX+1, this.positionY+1]);
        if (moveTopRight) moveSet.push(moveTopRight);

        const moveRight = checkIfPositionsExists([this.positionX+1, this.positionY]);
        if (moveRight) moveSet.push(moveRight);

        const moveRightBottom = checkIfPositionsExists([this.positionX+1, this.positionY-1]);
        if (moveRightBottom) moveSet.push(moveRightBottom);

        const moveBottom = checkIfPositionsExists([this.positionX, this.positionY-1]);
        if (moveBottom) moveSet.push(moveBottom);

        const moveBottomLeft = checkIfPositionsExists([this.positionX-1, this.positionY-1]);
        if (moveBottomLeft) moveSet.push(moveBottomLeft);

        return moveSet;
    }

}

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
        new Pawn([8, 2], "white"),
        
        new Knight([3, 3], "white"),
        new Knight([5, 3], "black"),
        new Knight([4, 4], "white")
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

function initialize() {
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

function placePiece(piece: piece, squareReference: HTMLElement) {
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
    const square: HTMLElement = document.getElementById(id);
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

function handleClickSquareEvent(squareReference: HTMLElement){
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
        if (foundPieceBySquare(squareReference))squareReference.classList.add("square-take");
        else squareReference.classList.add("square-move");
    }
}

//Check if a position is in the board range

function checkIfPositionsExists(squareReference: [number, number]): false | [number, number]{
    if (squareReference[0] >= 1 && squareReference[0] <= 8){
        if (squareReference[1] >= 1 && squareReference[1] <= 8){
            return squareReference;
        }
    }
    return false;
}