import { Spinner } from "phosphor-react";
import React from "react";

interface ProfileBarProps {
	username: string
}

const ProfileBar: React.FC<ProfileBarProps> = ({
	username
}) => {

	return (
		<div className="grid bg-white shadow-md md:w-7/12 w-screen mx-auto">
			<h2 className="text-center font-bold px-4 py-3 z-10 text-2xl border-b-2">{
				username === ""
					? <Spinner size={32} weight="light" className="animate-spin w-full" />
					: username
			}</h2>
		</div>
	)
}

export default ProfileBar
