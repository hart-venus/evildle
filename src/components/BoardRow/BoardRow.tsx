import {type FunctionComponent} from 'preact';

import './BoardRow.css';
import {BoardCellState} from '../BoardCell/BoardCell';
import BoardCell from '../BoardCell/BoardCell';
type BoardRowProps = {
	input: string;
	isShaking: boolean;
};

const BoardRow: FunctionComponent<BoardRowProps> = ({input, isShaking}) => (
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

export default BoardRow;
