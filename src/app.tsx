import {useEffect, useState} from 'preact/hooks';

import './app.css';
import BoardRow from './components/BoardRow/BoardRow';
import NavBar from './components/NavBar/NavBar';

export function App() {
	const [input, setInput] = useState('');

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
			setInput(prevInput => {
				if (key === 'BACKSPACE') {
					return prevInput.slice(0, -1);
				}

				if (key === 'ENTER') {
					return '';
				}

				if (prevInput.length >= 5) {
					return prevInput;
				}

				return prevInput + key;
			});
		}
	}

	useEffect(() => {
		window.addEventListener('keydown', handleKeyPress);

		return () => {
			window.removeEventListener('keydown', handleKeyPress);
		};
	}, []);
	return (
		<>
			<NavBar />
			<BoardRow input={input} isCurrentRow={true}></BoardRow>
		</>
	);
}
