import {type FunctionComponent} from 'react';
import './BoardCell.css';

export enum BoardCellState {
	empty = 'empty',
	unsubmitted = 'unsubmitted',
	notInWord = 'notInWord',
	inWord = 'inWord',
	correct = 'correct',
}

type BoardCellProps = {
	letter: string;
	state: BoardCellState;
};

const BoardCell: FunctionComponent<BoardCellProps> = ({letter, state}) => (
	<>
		<div className={`BoardCell ${state}`}>
			<h1 className='letter'>{letter}</h1>
		</div>
	</>
);

export default BoardCell;
