import {type FunctionComponent} from 'preact';
import {useState, useEffect} from 'preact/hooks';

import BoardRow from '../BoardRow/BoardRow';
import './Board.css';
const Board: FunctionComponent = () => {
	const nRows = 6;
	const [rowProps, setRowProps] = useState(
		Array.from({length: nRows}, (_, __) => ({
			input: '',
			isShaking: false,
		})),
	);
	function handleNextRow() {
		if (rowProps[currentRow].input.length < 5) {
			if (!rowProps[currentRow].isShaking) {
				let newRowProps = [...rowProps];
				newRowProps[currentRow].isShaking = true;
				setRowProps(newRowProps);
				setTimeout(() => {
					newRowProps = [...rowProps];
					newRowProps[currentRow].isShaking = false;
					setRowProps(newRowProps);
				}, 250);
			}

			return;
		}

		setCurrentRow(prevCurrentRow => {
			if (prevCurrentRow === nRows - 1) {
				return prevCurrentRow;
			}

			return prevCurrentRow + 1;
		});
	}

	const [currentRow, setCurrentRow] = useState(0);
	function handleKeyPress(event: KeyboardEvent) {
		let {key} = event;

		if (
			(key >= 'a' && key <= 'z') ||
			(key >= 'A' && key <= 'Z' && key.length === 1) ||
			key === 'Backspace' ||
			key === 'Enter'
		) {
			// Set key to uppercase
			key = key.toUpperCase();
			setRowProps(prevRowProps => {
				const prevInput = prevRowProps[currentRow].input;
				const newRowProps = [...prevRowProps];
				if (key === 'BACKSPACE') {
					newRowProps[currentRow].input = prevInput.slice(0, -1);
					return newRowProps;
				}

				if (key === 'ENTER') {
					handleNextRow();
					return newRowProps;
				}

				if (prevInput.length >= 5) {
					return prevRowProps;
				}

				newRowProps[currentRow].input = prevInput + key;
				return newRowProps;
			});
		}
	}

	useEffect(() => {
		window.addEventListener('keydown', handleKeyPress);

		return () => {
			window.removeEventListener('keydown', handleKeyPress);
		};
	}, [handleKeyPress]);
	return (
		<>
			<div className='Board'>
				{rowProps.map(({input, isShaking}, i) => (
					<BoardRow key={i} input={input} isShaking={isShaking} />
				))}
			</div>
		</>
	);
};

export default Board;