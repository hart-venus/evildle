import {type LucideIcon} from 'lucide-preact';
import {type FunctionComponent} from 'preact';
import './ToolBar.css';

export type Tool = {
	icon: LucideIcon;
	onClick: () => void;
};

export type ToolBarProps = {
	tools: Tool[];
};

const ToolBar: FunctionComponent<ToolBarProps> = ({tools}) => (
	<>
		<div className='toolbar'>
			{tools.map(({icon: Icon, onClick}, index) => (
				<div className='toolbar-item' onClick={onClick} key={index}>
					<Icon className='toolbar-icon' />
				</div>
			))}
		</div>
	</>
);

export default ToolBar;
