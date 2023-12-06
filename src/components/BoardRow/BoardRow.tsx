import {type FunctionComponent} from 'preact';
import './BoardRow.css';
import {useEffect, useState} from 'preact/hooks';

import {BoardCellState} from '../BoardCell/BoardCell';
import BoardCell from '../BoardCell/BoardCell';
type BoardRowProps = {
	input: string;
	isShaking: boolean;
	revealResults: boolean;
	gameState: number[][];
};

const BoardRow: FunctionComponent<BoardRowProps> = ({
	input,
	revealResults,
	gameState,
	isShaking,
}) => {
	function classFromState(
		gameState: number[][],
		letter: string,
		index: number,
	): BoardCellState {
		// Get index of letter in the alphabet (letter is uppercase)
		const letterIndex = letter.charCodeAt(0) - 65;
		// If gameState[letterIndex] is empty, letter is not in word
		if (gameState[letterIndex].length === 0) {
			return BoardCellState.notInWord;
		}

		// If gameState[letterIndex] does not contain index, letter is in word but
		// not in the correct position
		if (!gameState[letterIndex].includes(index)) {
			return BoardCellState.inWord;
		}

		return BoardCellState.correct;
	}

	const [revealedIndex, setRevealedIndex] = useState<number>(-1);
	const [winAnimationIndex, setWinAnimationIndex] = useState<number>(-1);
	useEffect(() => {
		const increaseRevealIndex = (times: number) => {
			if (times < 5) {
				setTimeout(() => {
					setRevealedIndex(times);
					increaseRevealIndex(times + 1);
				}, 280);
			}
		};

		if (revealResults) {
			console.log('Game State from BoardRow:', gameState);
			increaseRevealIndex(0);
			// If every state is correct, then win animation
			let win = true;
			for (let i = 0; i < input.length; i++) {
				if (classFromState(gameState, input[i], i) !== BoardCellState.correct) {
					win = false;
					break;
				}
			}

			if (win) {
				console.log('Win animation');
			}
		}
	}, [revealResults]);
	return (
		<>
			<div className={isShaking ? 'BoardRow shake' : 'BoardRow'}>
				{Array.from({length: 5}, (_, i) =>
					revealedIndex < i ? (
						i <= input.length - 1 ? (
							<BoardCell
								key={i}
								letter={input[i]}
								state={BoardCellState.unsubmitted}
							/>
						) : (
							<BoardCell key={i} letter='' state={BoardCellState.empty} />
						)
					) : (
						<BoardCell
							key={i}
							letter={input[i]}
							state={classFromState(gameState, input[i], i)}
						/>
					),
				)}
			</div>
		</>
	);
};

export default BoardRow;
