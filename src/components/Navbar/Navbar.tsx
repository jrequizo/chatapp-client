import React from "react";
import { useNavigate } from 'react-router'
import { UserCirclePlus, ChatCenteredDots, BellSimple, UserCircle } from "phosphor-react";

import { getProfile } from "@/utils/credentialManager";

/**
 * Navbar component that appears at the top of the application (except in the login).
 * @returns 
 */
const Navbar: React.FC = () => {
	/**
	 * Use navigate instead of <a href=""> tags as this prevents the page from replacing.
	 */
	const navigate = useNavigate();

	const path = window.location.pathname;

	const userId = getProfile()?.uid;

	return (
		<nav className="p-2 gap-4 text-white font-bold flex bg-theme-darkgreen justify-between items-stretch">
			<button className="flex items-center mx-2" onClick={() => navigate(`/`)}>
				<img
					className="aspect-square w-12"
					src={`${process.env.PUBLIC_URL}/images/chatbox-navbar.svg`}
					alt="Logo"
				></img>
				<span className="pl-1.5 text-3xl">ChatBox</span>
			</button>
			<ul
				className="flex items-center"
			>
				<li>
					<button className="flex items-center mx-2" onClick={() => { }}>
						<UserCirclePlus
							size={32}
							weight={path.startsWith('/user-search') ? 'fill' : 'thin'}
						/>
					</button>
				</li>
				<li>
					<button className="flex items-center mx-2" onClick={() => navigate(`/`)}>
						<ChatCenteredDots
							size={32}
							weight={path === '/' ? 'fill' : 'thin'}
						/>
					</button>
				</li>
				<li>
					<button className="flex items-center mx-2" onClick={() => { }}>
						<BellSimple
							size={32}
							weight={path.startsWith('/notifications') ? 'fill' : 'thin'}
						/>
					</button>
				</li>
				<li>
					<button className="flex items-center ml-2 mr-4" onClick={() => navigate(`/profile/${userId}`)}>
						<UserCircle
							size={44}
							weight={path.startsWith(`/profile/${userId}`) ? 'fill' : 'thin'} // TODO: profile ignore query string
						/>
					</button>
				</li>
			</ul>
		</nav>
	);
}

export default Navbar;