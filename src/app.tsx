import {useEffect} from 'preact/hooks';

import './app.css';
import BoardRow from './components/BoardRow/BoardRow';
import NavBar from './components/NavBar/NavBar';

function handleKeyPress(event: KeyboardEvent) {
	const {key} = event;

	if ((key >= 'a' && key <= 'z') || key === 'Backspace' || key === 'Enter') {
		console.log(`Key pressed: ${key}`);
		// Add your logic here for what should happen when these keys are pressed
	}
}

export function App() {
	useEffect(() => {
		window.addEventListener('keydown', handleKeyPress);

		return () => {
			window.removeEventListener('keydown', handleKeyPress);
		};
	}, []);
	return (
		<>
			<NavBar />
			<BoardRow input='' isCurrentRow={true}></BoardRow>
		</>
	);
}
