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
	const [allowInput, setAllowInput] = useState(true);
	const [lettersState, setLettersState] = useState<number[][]>(
		Array.from({length: 26}, (_, __) => [-1]),
	); // Letters have not been set yet

	const [possibleSolutions, setPossibleSolutions] =
		useState<string[]>(validWords);

	const addMessage = (message: string) => {
		const newId = Math.random();
		setMessages(prevMessages => [
			...prevMessages,
			{message, id: newId, removeSelf: removeMessage},
		]);
	};

	function tryToBeat(input: string) {
		// Set input to lowercase
		input = input.toLowerCase();
		// Get current list of possible solutions
		let solutions = [...possibleSolutions];
		// Get current letters state
		const state = [...lettersState];
		console.log('state', state);
		// Iterate over each letter in input
		for (let i = 0; i < input.length; i++) {
			// Letter index of input[i] in alphabet
			const letterIndex = input.charCodeAt(i) - 97;
			console.log('Letter index: ' + letterIndex);
			// If letter is not in the board, remove all words containing that letter
			if (state[letterIndex][0] === -1) {
				let solutionsFiltered = solutions.filter(
					word => !word.includes(input[i]),
				);
				if (solutionsFiltered.length === 0) {
					// We cannot remove the letter from the solution
					// can we remove it from the i index?
					solutionsFiltered = solutions.filter(
						word => !(word[i] === input[i]), // Remove all words where the i index is the letter
					);
					if (solutionsFiltered.length === 0) {
						// We cannot remove the letter from the i index
						continue;
					}
				}

				if (solutionsFiltered.length === 1) {
					const solution = solutionsFiltered[0];
					// We have reached only one solution
					setPossibleSolutions(solutionsFiltered);
					solutions = solutionsFiltered;
					// Get all appearances of the letter in the word
					const appearances = solution
						.split('') // Split into array
						.map((letter, index) => (letter === input[i] ? index + 1 : -1))
						.filter(index => index !== -1);
					if (appearances.length === 0) {
						// Letter does not appear in word
						appearances.push(0);
					}

					state[letterIndex] = appearances;
					console.log('solution index in word', state[letterIndex]);
					setLettersState(state);
					continue;
				}

				console.log(
					'Removing words containing ' +
						input[i] +
						': ' +
						solutionsFiltered.length,
				);
				setPossibleSolutions(solutionsFiltered);
				solutions = solutionsFiltered;
				state[letterIndex][0] = 0; // 0 = does not appear in word
				setLettersState(state);
			}

			console.log(solutions);
		}
	}

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

		// SetAllowInput(false);
		tryToBeat(rowProps[currentRow].input);
	}

	const [currentRow, setCurrentRow] = useState(0);
	function handleKeyPress(event: KeyboardEvent) {
		let {key} = event;

		if (
			allowInput &&
			((key >= 'a' && key <= 'z') ||
				(key >= 'A' && key <= 'Z' && key.length === 1) ||
				key === 'Backspace' ||
				key === 'Enter')
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
	}, [allowInput, currentRow, lettersState, possibleSolutions, rowProps]);
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
