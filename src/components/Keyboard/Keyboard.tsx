import {Delete} from 'lucide-preact';
import {type FunctionComponent} from 'preact';

import './Keyboard.css';
import {KeyStates} from '../Board/Board';

type KeyboardProps = {
	letterValues: KeyStates[];
};

const Keyboard: FunctionComponent<KeyboardProps> = ({letterValues}) => {
	const rows = ['QWERTYUIOP', 'ASDFGHJKL', 'ZXCVBNM'];
	const keyPress = (key: string) => {
		const event = new KeyboardEvent('keydown', {
			key: key.toLowerCase(),
		});
		window.dispatchEvent(event);
	};

	function getKeyClass(key: string) {
		// Get index of key (key is always uppercase)
		const index = key.charCodeAt(0) - 65;

		switch (letterValues[index]) {
			case KeyStates.none:
				return 'key';
			case KeyStates.inword:
				return 'key inWord';
			case KeyStates.correct:
				return 'key correct';
			case KeyStates.notinword:
				return 'key notInWord';
			default:
				return 'key';
		}
	}

	function getJsxForRow(row: string, index: number) {
		if (index === 2) {
			return (
				<div className='row' key={index}>
					<div
						className='other-key enter'
						onClick={() => {
							keyPress('Enter');
						}}
					>
						ENTER
					</div>
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
					<div
						className='other-key delete'
						onClick={() => {
							keyPress('Backspace');
						}}
					>
						<Delete />
					</div>
				</div>
			);
		}

		return (
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
		);
	}

	return (
		<div className='keyboard'>
			{rows.map((row, index) => getJsxForRow(row, index))}
		</div>
	);
};

export default Keyboard;
