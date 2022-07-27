import React, { useState } from "react";
import { useMutation } from "react-query";

import { API } from "@/utils/trpc/trpc";
import { uploadProfilePicture } from "@/core/profile/uploadProfilePicture";

import PfpSelectorComponent from "./PfpSelector";

interface UserProfileComponentProps {
	uid: string
	pfpUrl: string
}

const UserProfileComponent: React.FC<UserProfileComponentProps> = ({
	uid,
	pfpUrl
}) => {
	//
	const utils = API.useContext()

	/**
	 * 
	 */
	const uploadPfpMutation = useMutation(uploadProfilePicture, {
		async onSuccess() {
			utils.invalidateQueries(["profile.profileData", { uid: uid }]);
		},
	})

	/**
	 * 
	 */
	const [selectedPfp, setSelectedPfp] = useState(pfpUrl);

	/**
	 * 
	 * @param 
	 */
	async function onImageSelected(imageUrl: string) {
		setSelectedPfp(imageUrl);
	}

	async function saveButtonPressed(image: File) {
		const response = await uploadPfpMutation.mutateAsync(image)
		
		return response.status === 201;
	}

	/**
	 * Reset the selected pfp to the current pfp.
	 */
	function cancelButtonPressed() {
		setSelectedPfp(pfpUrl);
	}


	/**
	 * Retrieve the `large` version of the pfp if we are using CDN-uploaded pfp's.
	 * If the User is uploading their own picture, then the URL will point to a File.
	 */
	let displayedPfp = selectedPfp;
	if (displayedPfp.startsWith("https://storage.googleapis.com/")) {
		displayedPfp += `-large.png?time=${Date.now()}`;
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
					src={displayedPfp}
					alt="Profile"
				></img>
				<PfpSelectorComponent
					onImageSelected={onImageSelected}
					onSaveButtonPressed={saveButtonPressed}
					onCancelButtonPressed={cancelButtonPressed}
				/>
			</div>
		</div>
	)
}

export default UserProfileComponent
