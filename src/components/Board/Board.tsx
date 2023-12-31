import {BarChartBig, Dices, HelpCircle, Lightbulb} from 'lucide-preact';
import {type FunctionComponent} from 'preact';
import {useState, useEffect} from 'preact/hooks';

import validWords from '../../words.json';
import BoardRow from '../BoardRow/BoardRow';
import Keyboard from '../Keyboard/Keyboard';
import Message, {type MessageProps} from '../Message/Message';
import './Board.css';
import ToolBar, {type ToolBarProps} from '../ToolBar/ToolBar';

export enum KeyStates { // For strict use in the Keyborard component
	none = 0,
	inword = 1,
	notinword = 2,
	correct = 3,
}

const Board: FunctionComponent = () => {
	const nRows = 6;
	const [rowProps, setRowProps] = useState(
		Array.from({length: nRows}, (_, __) => ({
			input: '',
			isShaking: false,
			revealResults: false,
		})),
	);
	const [keyStates, setKeyStates] = useState(
		Array.from({length: 26}, (_, __) => KeyStates.none),
	);

	const [messages, setMessages] = useState<MessageProps[]>([]);
	const [allowInput, setAllowInput] = useState(true);
	const [lettersState, setLettersState] = useState<number[][]>(
		Array.from({length: 26}, (_, __) => [0, 1, 2, 3, 4]),
	); // Letters have not been set yet

	const [possibleSolutions, setPossibleSolutions] = useState<string[]>([
		'shore',
	]);

	const tbprops: ToolBarProps = {
		tools: [
			{
				icon: Lightbulb,
				onClick() {
					// Add random possible solution to messages

					addMessage(possibleSolutions[0].toUpperCase());
				},
			},
			{
				icon: HelpCircle,
				onClick() {
					addMessage('TODO!');
				},
			},
			{
				icon: BarChartBig,
				onClick() {
					addMessage('TODO!');
				},
			},
			{
				icon: Dices,
				onClick() {
					addMessage('TODO!');
				},
			},
		],
	};

	const winningMessages = [
		'Genius',
		'Magnificent',
		'Impressive',
		'Splendid',
		'Great',
		'Phew',
	];
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
		// Get current keys state
		const keys = [...keyStates];
		// Iterate over each letter in input
		for (let i = 0; i < input.length; i++) {
			// Letter index of input[i] in alphabet
			const letterIndex = input.charCodeAt(i) - 97;

			// If letter is not in the state yet, remove all words containing that letter

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
					keys[letterIndex] = KeyStates.correct;
					continue;
				} else {
					let newLetterState = [...state][letterIndex];
					// Remove first occurrence of i from newLetterState
					newLetterState = newLetterState.filter(index => index !== i);
					state[letterIndex] = newLetterState;
					setPossibleSolutions(solutionsFiltered);
					solutions = solutionsFiltered;
					setLettersState(state);

					if (keys[letterIndex] !== KeyStates.correct) {
						// If we haven't already set the key to correct
						keys[letterIndex] = KeyStates.inword;
					}

					continue;
				}
			}

			console.log(
				'Removing words containing ' +
					input[i] +
					': ' +
					solutionsFiltered.length,
			);
			setPossibleSolutions(solutionsFiltered);
			solutions = solutionsFiltered;
			state[letterIndex] = []; // 0 = does not appear in word
			keys[letterIndex] = KeyStates.notinword;
			setLettersState(state);

			console.log(solutions);
		}

		setTimeout(() => {
			setKeyStates(keys);
		}, 1680);
		console.log(state);
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

		tryToBeat(rowProps[currentRow].input);
		setAllowInput(false);
		// Check for win
		if (
			possibleSolutions.length === 1 &&
			possibleSolutions[0] === rowProps[currentRow].input.toLowerCase()
		) {
			setTimeout(() => {
				addMessage(winningMessages[currentRow]);
			}, 1680);
		} else if (currentRow === nRows - 1) {
			setTimeout(() => {
				addMessage(possibleSolutions[0].toUpperCase());
			}, 1680);
		} else {
			setTimeout(() => {
				setAllowInput(true);
			}, 1680);
		}

		setRowProps(prevRowProps => {
			const newRowProps = [...prevRowProps];
			newRowProps[currentRow].revealResults = true;
			return newRowProps;
		});
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
				{rowProps.map(({input, isShaking, revealResults}, i) => (
					<BoardRow
						revealResults={revealResults}
						gameState={lettersState}
						key={i}
						input={input}
						isShaking={isShaking}
					/>
				))}
			</div>
			<ToolBar tools={tbprops.tools} />
			<Keyboard letterValues={keyStates} />
		</>
	);
};

export default Board;
