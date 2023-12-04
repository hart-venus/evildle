import {type FunctionComponent} from 'preact';
import './Keyboard.css';

type KeyboardProps = {
	letterValues: number[][];
};

const Keyboard: FunctionComponent<KeyboardProps> = () => {
	const rows = ['QWERTYUIOP', 'ASDFGHJKL', 'ZXCVBNM'];
	const keyPress = (key: string) => {
		const event = new KeyboardEvent('keydown', {
			key: key.toLowerCase(),
		});
		window.dispatchEvent(event);
	};

	function getKeyClass(key: string) {
		return 'key';
	}

	return (
		<div className='keyboard'>
			{rows.map((row, index) => (
				<div className='row' key={index}>
					{row.split('').map(letter => (
						<div
							className={getKeyClass(letter)}
							key={letter}
							onClick={() => {
								keyPress(letter);
							}}
						>
							{letter}
						</div>
					))}
				</div>
			))}
		</div>
	);
};

export default Keyboard;
