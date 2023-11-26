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
	const [revealedIndex, setRevealedIndex] = useState<number>(-1);
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
		}
	}, [revealResults]);
	return (
		<>
			<div className={isShaking ? 'BoardRow shake' : 'BoardRow'}>
				{Array.from({length: 5}, (_, i) =>
					i <= input.length - 1 ? (
						<BoardCell
							key={i}
							letter={input[i]}
							state={BoardCellState.unsubmitted}
						/>
					) : (
						<BoardCell key={i} letter='' state={BoardCellState.empty} />
					),
				)}
				<div>{revealedIndex}</div>
			</div>
		</>
	);
};

export default BoardRow;
