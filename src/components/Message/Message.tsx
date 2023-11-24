import {type FunctionComponent} from 'preact';
import {useEffect} from 'preact/hooks';

import './Message.css';

export type MessageProps = {
	message: string;
	id: number;
	removeSelf: (id: number) => void;
};

const Message: FunctionComponent<MessageProps> = ({
	message,
	id,
	removeSelf,
}) => {
	useEffect(() => {
		const timeout = setTimeout(() => {
			removeSelf(id);
		}, 1200);

		return () => {
			clearTimeout(timeout);
		};
	}, [id, removeSelf]);
	return (
		<>
			<div className='message'>{message}</div>
		</>
	);
};

export default Message;
