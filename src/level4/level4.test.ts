import { readFileSync } from 'fs';

interface Board {
    id: number;
    values: Array<number[]>;
    matches: Array<boolean[]>;
}

const readBoards = (inputPath: string): Board[] => {
    const fileContent = readFileSync(inputPath, 'utf8');
    const boardsStringRaw = fileContent.split(/^\n/gm);
    const boardsValues = boardsStringRaw.map(boardString =>
        boardString.split(/\n/)
            .filter(v => v != '')
            .map(row =>
                row.split(/\s/)
                    .filter(v => v != '')
                    .map(v => parseInt(v))));

    return boardsValues.map((values, index) => ({
        id: index,
        values,
        matches: generateMatchBoard(values)
    }))
};

const generateMatchBoard = (board: Array<number[]>): Array<boolean[]> => {
    return board.map(row => row.map(r => false));
};

const markBoardNumber = (board: Board, bingoNumber: number) => {
    for (let row = 0; row <= board.values.length - 1; row++) {
        for (let column = 0; column <= board.values[0].length - 1; column++) {
            const cellValue = board.values[row][column];
            if (cellValue === bingoNumber) {
                board.matches[row][column] = true;
            }
        }
    }
};

const checkForBingo = (board: Board): boolean => {
    for (let i = 0; i <= board.values.length - 1; i++) {
        if (!board.matches[i].includes(false) || !board.matches.map(row => row[i]).includes(false)) {
            return true;
        }
    }
    return false;
};

const getAllUnmarkedNumbers = (board: Board) => {
    const unmarkedNumbers: number[] = [];
    for (let row = 0; row <= board.values.length - 1; row++) {
        for (let column = 0; column <= board.values[0].length - 1; column++) {
            if (!board.matches[row][column]) {
                const cellValue = board.values[row][column];
                unmarkedNumbers.push(cellValue);
            }
        }
    }
    return unmarkedNumbers.reduce((prev, curr) => prev + curr, 0);
};

const solveLevel4Part1 = (bingoNumbers: number[], boards: Board[]) => {
    let bingoBoard: Board | undefined;
    let finalNumber: number | undefined;

    for (const bingoNumber of bingoNumbers) {
        if (bingoBoard) {
            break;
        }
        for (let board of boards) {
            markBoardNumber(board, bingoNumber);
            if (checkForBingo(board)) {
                bingoBoard = board;
                finalNumber = bingoNumber;
                break;
            }
        }
    }

    if (!bingoBoard || !finalNumber) {
        throw new Error();
    }

    return finalNumber * getAllUnmarkedNumbers(bingoBoard);
};

const solveLevel4Part2 = (bingoNumbers: number[], boards: Board[]) => {
    let finalNumber: number | undefined;
    let lastWinner: Board | undefined;

    for (const bingoNumber of bingoNumbers) {
        for (let board of boards) {
            markBoardNumber(board, bingoNumber);
            if (checkForBingo(board)) {
                boards = boards.filter(b => b.id != board.id);
                lastWinner = board;
                finalNumber = bingoNumber;
            }
        }
    }

    if (!finalNumber || !lastWinner) {
        throw new Error();
    }

    return finalNumber * getAllUnmarkedNumbers(lastWinner);
};

describe('Level 4', () => {
    describe('Part 1', () => {
        it('Solve example input', () => {
            const bingoNumbers = [7, 4, 9, 5, 11, 17, 23, 2, 0, 14, 21, 24, 10, 16, 13, 6, 15, 25, 12, 22, 18, 20, 8, 19, 3, 26, 1];
            const boards: Board[] = readBoards('./src/level4/exampleinput');
            const result = solveLevel4Part1(bingoNumbers, boards);
            expect(result).toBe(4512);
        });

        it('Solve input', () => {
            const bingoNumbers = [6, 69, 28, 50, 36, 84, 49, 13, 48, 90, 1, 33, 71, 0, 94, 59, 53, 58, 60, 96, 30, 34, 29, 91, 11, 41, 77, 95, 17, 80, 85, 93, 7, 9, 74, 89, 18, 25, 26, 8, 87, 38, 68, 5, 12, 43, 27, 46, 62, 73, 16, 55, 22, 4, 65, 76, 54, 52, 83, 10, 21, 67, 15, 47, 45, 40, 35, 66, 79, 51, 75, 39, 64, 24, 37, 72, 3, 44, 82, 32, 78, 63, 57, 2, 86, 31, 19, 92, 14, 97, 20, 56, 88, 81, 70, 61, 42, 99, 23, 98];
            const boards: Board[] = readBoards('./src/level4/input');
            const result = solveLevel4Part1(bingoNumbers, boards);
            expect(result).toBe(71708);
        });
    });

    describe('Part 2', () => {
        it('Solve example input', () => {
            const bingoNumbers = [7, 4, 9, 5, 11, 17, 23, 2, 0, 14, 21, 24, 10, 16, 13, 6, 15, 25, 12, 22, 18, 20, 8, 19, 3, 26, 1];
            const boards: Board[] = readBoards('./src/level4/exampleinput');
            const result = solveLevel4Part2(bingoNumbers, boards);
            expect(result).toBe(1924);
        });

        it('Solve input', () => {
            const bingoNumbers = [6, 69, 28, 50, 36, 84, 49, 13, 48, 90, 1, 33, 71, 0, 94, 59, 53, 58, 60, 96, 30, 34, 29, 91, 11, 41, 77, 95, 17, 80, 85, 93, 7, 9, 74, 89, 18, 25, 26, 8, 87, 38, 68, 5, 12, 43, 27, 46, 62, 73, 16, 55, 22, 4, 65, 76, 54, 52, 83, 10, 21, 67, 15, 47, 45, 40, 35, 66, 79, 51, 75, 39, 64, 24, 37, 72, 3, 44, 82, 32, 78, 63, 57, 2, 86, 31, 19, 92, 14, 97, 20, 56, 88, 81, 70, 61, 42, 99, 23, 98];
            const boards: Board[] = readBoards('./src/level4/input');
            const result = solveLevel4Part2(bingoNumbers, boards);
            expect(result).toBe(1);
        });
    });
});