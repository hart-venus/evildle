import {type FunctionComponent} from 'preact';

import logo from '../../assets/headerLogo.svg';
import './NavBar.css';

const NavBar: FunctionComponent = () => (
	<>
		<nav className='NavBar'>
			<img src={logo} className='logo' alt='logo' />
			<h1 className='header'>Evildle</h1>
		</nav>
	</>
);

export default NavBar;
