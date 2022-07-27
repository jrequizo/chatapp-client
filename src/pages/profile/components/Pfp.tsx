import React from "react";


import AddFriendComponent from "./AddFriend";

interface PfpProps {
	pfpUrl: string
}

const Pfp: React.FC<PfpProps> = ({
	pfpUrl,
}) => {
	/**
	 * Retrieve the `large` version of the pfp if we are using CDN-uploaded pfp's.
	 * If the User is uploading their own picture, then the URL will point to a File.
	 */
	let _pfpUrl = pfpUrl === "" ? "https://storage.googleapis.com/chatapp-profile/pfp/default" : pfpUrl;
	if (_pfpUrl.startsWith("https://storage.googleapis.com/")) {
		_pfpUrl += `-large.png?time=${Date.now()}`;
	}

	/**
	 * Retrieves the action button to display under the User's profile picture.
	 * If the profile being viewed is the User's, then show the `Change Picture` button.
	 * If the profile being viewed is another User's, then show the `Add Friends` button.
	 * @returns JSX.Element corresponding to the correct action to display.
	 */

	return (
		<div className="grid content-center mx-auto py-4 px-3">
			<div className="grid content-center mx-auto py-4 px-3">
				<img
					className="rounded-3xl w-64 mx-auto aspect-square w-64 object-cover"
					src={_pfpUrl}
					alt="Profile"
				></img>
				<AddFriendComponent
					onClick={() => { }}
				/>
			</div>
		</div>
	)
}

export default Pfp
