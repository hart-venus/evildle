import {type FunctionComponent} from 'preact';

import './BoardRow.css';
import {useEffect} from 'preact/hooks';

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
	useEffect(() => {
		if (revealResults) {
			console.log('Game State from BoardRow:', gameState);
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
			</div>
		</>
	);
};

export default BoardRow;
