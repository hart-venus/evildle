import {type FunctionComponent} from 'preact';

type KeyboardProps = {
	letterValues: number[][];
};

const Keyboard: FunctionComponent<KeyboardProps> = () => {
	const keyPress = () => {
		const event = new KeyboardEvent('keydown', {
			key: 'a',
			code: 'KeyA',
			which: 65,
			shiftKey: false,
			ctrlKey: false,
			metaKey: false,
		});
		window.dispatchEvent(event);
		console.log('keyPress');
	};

	return (
		<>
			<button onClick={keyPress}>A</button>
		</>
	);
};

export default Keyboard;
