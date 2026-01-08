import { useEffect, useState } from "react";

type Board = {
    board: string[],
    index: number
}

const WORD_TARGET = "FARDO";

const BOARD_LENGTH = 6;
const WORD_LENGTH = 5;

export default function App(){
    const [board, setBoard] = useState<Board>({
        board: Array(BOARD_LENGTH).fill(""),
        index: 0
    })

    const [gameOver, setGameOver] = useState<boolean>(false);
    const [guess, setGuess] = useState("");

    const handlerClick = (event: React.FormEvent<HTMLDivElement>) => {
        event.preventDefault();

        const validation = /^[a-zA-Z]{5}$/;
        if(!validation.test(guess) || gameOver) return;

        const newBoard = [...board.board];
        newBoard[board.index] = guess.toUpperCase();

        setBoard(prev => ({
            board: newBoard,
            index: prev.index + 1
        }))

        setGuess("");
    }

    useEffect(() => {
        if(board.index > 5 || board.board[board.index - 1] === WORD_TARGET){
            setGameOver(true);

            alert((board.index > 5) ? `VOCE PERDEU, PALAVRA DESEJADA: ${WORD_TARGET}!` : `VOCE GANHOU!`);
        }
    },[board])

    return (
       <div className="container" onSubmit={handlerClick}>
            <form className="form">
                <input 
                    type="text" 
                    value={guess} 
                    onChange={(e) => (!gameOver) && setGuess(e.target.value)} 
                    maxLength={5} 
                    minLength={5} />

                <button type="submit">Enviar</button>
            </form>

            {
                board.board.map((word, index) => (
                    <Line word={word} key={index} />
                ))
            }
       </div>
    )
}


const setColor = ({word} : {word: string}) => {
    const colors = Array(WORD_LENGTH).fill("white");
    if(word.length !== WORD_LENGTH) return colors;

    const newWord= WORD_TARGET.split("");

    for(let i = 0; i < WORD_LENGTH; i++){
        if(word[i] === newWord[i]){
            colors[i] = "green";
            newWord[i] = "";
        }
    }

    for(let i = 0; i < WORD_LENGTH; i++){
        if(newWord[i] && newWord.includes(word[i]))
            colors[i] = "orange"
    }

    return colors;
}

function Line({word} : {word: string}){
    const line =  [];   
    const colors: string[] = setColor({word});

    for(let i = 0; i < WORD_LENGTH; i++){
        line.push(
            <div 
                className="letter" 
                key={i}
                style={{backgroundColor: colors[i]}}>

                {word[i] ?? ""}
            </div>
        );
    }
    
    return (
        <div className="line">
            {line}
        </div>
    )
}