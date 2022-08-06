import React from "react";
import { useNavigate } from "react-router";
import { SignOut, Spinner } from "phosphor-react";

import { signOut } from "@/utils/credentialManager";


interface ProfileBarProps {
	username: string
	isCurrentUser: boolean
}

const ProfileBar: React.FC<ProfileBarProps> = ({
	username,
	isCurrentUser
}) => {
	const navigate = useNavigate();

	return (
		<div className="bg-white shadow-md md:max-w-[768px] w-screen mx-auto flex flex-row">
			{
				isCurrentUser && 
				<button className="p-4 absolute" onClick={() => {
					// TODO: check if we can revoke the current jwt
					signOut()
					navigate('/')
				}}>
					<SignOut size={32} weight="light" />
				</button>
			}
			<h2 className="text-center font-bold px-4 py-3 z-10 text-2xl border-b-2 mx-auto">{
				username === ""
					? <Spinner size={32} weight="light" className="animate-spin w-full" />
					: username
			}</h2>
		</div>
	)
}

export default ProfileBar
