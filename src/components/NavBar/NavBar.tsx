import {type FunctionComponent} from 'react';
import './NavBar.css';

const NavBar: FunctionComponent = () => (
	<>
		<nav className='NavBar'>
			<a href='/'>Home</a>
			<a href='/about'>About</a>
			<a href='/contact'>Contact</a>
		</nav>
	</>
);

export default NavBar;
