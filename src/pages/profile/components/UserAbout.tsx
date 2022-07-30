import React from "react";


interface UserAboutProps {
	about: string
}

const UserAbout: React.FC<UserAboutProps> = ({
	about
}) => {
	return (
		<div className="flex flex-1 flex-col py-4 px-3 sm:border-t-2 md:border-t-0 md:border-l-2">
			<div className="flex flex-row border-b border-gray-300">
				<h3 className="pb-1 w-full font-bold">About Me</h3>
			</div>
			<form className="h-full">
				<p className="h-full pt-2 whitespace-pre">{about}</p>
			</form>
		</div>
	)
}



export default UserAbout;