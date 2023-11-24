import {type FunctionComponent} from 'preact';
import {useState, useEffect} from 'preact/hooks';

import validWords from '../../words.json';
import BoardRow from '../BoardRow/BoardRow';
import Message, {type MessageProps} from '../Message/Message';
import './Board.css';
const Board: FunctionComponent = () => {
	const nRows = 6;
	const [rowProps, setRowProps] = useState(
		Array.from({length: nRows}, (_, __) => ({
			input: '',
			isShaking: false,
		})),
	);
	const [messages, setMessages] = useState<MessageProps[]>([]);

	const addMessage = (message: string) => {
		const newId = Math.random();
		setMessages(prevMessages => [
			...prevMessages,
			{message, id: newId, removeSelf: removeMessage},
		]);
	};

	const removeMessage = (id: number) => {
		setMessages(prevMessages =>
			prevMessages.filter(message => message.id !== id),
		);
	};

	function shakeRow(row: number) {
		if (!rowProps[row].isShaking) {
			let newRowProps = [...rowProps];
			newRowProps[row].isShaking = true;
			setRowProps(newRowProps);
			setTimeout(() => {
				newRowProps = [...rowProps];
				newRowProps[row].isShaking = false;
				setRowProps(newRowProps);
			}, 250);
		}
	}

	function handleNextRow() {
		if (rowProps[currentRow].input.length < 5) {
			shakeRow(currentRow);
			addMessage('Not enough letters');
			return;
		}

		if (!validWords.includes(rowProps[currentRow].input.toLowerCase())) {
			shakeRow(currentRow);
			addMessage('Not in word list');
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
			<div className='messages'>
				{messages.map(({message, id, removeSelf}) => (
					<Message key={id} message={message} id={id} removeSelf={removeSelf} />
				))}
			</div>
			<div className='Board'>
				{rowProps.map(({input, isShaking}, i) => (
					<BoardRow key={i} input={input} isShaking={isShaking} />
				))}
			</div>
		</>
	);
};

export default Board;
