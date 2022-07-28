import React, { useEffect, useState } from "react";
import { useMutation } from "react-query";

import { API } from "@/utils/trpc/trpc";
import { uploadProfilePicture } from "@/core/profile/uploadProfilePicture";
import { Spinner } from "phosphor-react";
import ActionButton from "@/components/ActionButton";

/**
 * React Element state handler.
 */
interface PfpSelectorProps {
	uid: string
	pfpUrl: string
}

const PfpSelector: React.FC<PfpSelectorProps> = ({
	uid,
	pfpUrl
}) => {

	const [selectedPfp, setSelectedPfp] = useState(pfpUrl);

	/**
	 * Retrieve the client context so we can invalidate queries.
	 */
	const utils = API.useContext()

	/**
	 * Hook to re-render when the pfpUrl prop is regenerated.
	 */
	useEffect(() => {
		setSelectedPfp(pfpUrl)
	}, [pfpUrl]);

	/**
	 * The mutation that calls the API to upload a new pfp.
	 */
	const uploadPfpMutation = useMutation(uploadProfilePicture, {
		async onSuccess() {
			utils.invalidateQueries(["profile.profileData", { uid: uid }]);
		},
	})

	async function onImageSelected(imageUrl: string) {
		setSelectedPfp(imageUrl);
	}

	/**
	 * Calls the mutation to upload selected pfp.
	 * @param image The image to upload.
	 * @returns 
	 */
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
	let displayedPfp = selectedPfp === "" ? "https://storage.googleapis.com/chatapp-profile/pfp/default" : selectedPfp;
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

/**
 * HTML Element state handler.
 */
interface PfpSelectorComponentProps {
	onImageSelected: (imageUrl: string) => void
	onSaveButtonPressed: (image: File) => Promise<boolean>
	onCancelButtonPressed: React.MouseEventHandler<HTMLButtonElement>
}

const PfpSelectorComponent: React.FC<PfpSelectorComponentProps> = ({
	onImageSelected,
	onSaveButtonPressed,
	onCancelButtonPressed
}) => {
	/**
	 * File input state handler.
	 */
	const [selectedImage, setSelectedImage] = useState<File | null>(null);
	const [isImageSaved, setIsImageSaved] = useState(true);

	/**
	 * File input event handler.
	 */
	function onInputChanged(event: React.ChangeEvent<HTMLInputElement>) {
		const file = event.currentTarget.files?.item(0) ?? null;
		if (file) {
			// If we selected a file, call the callback function and pass the URL to the image to the parent component.
			onImageSelected(URL.createObjectURL(file))
		}
		setSelectedImage(file)
	}

	async function _onSaveButtonPressed(event: React.MouseEvent<HTMLButtonElement>) {
		event.preventDefault();
		/**
		 * Call handler for `Save` button.
		 * If the image is successfully saved, we reset the HTMLInputElement's state.
		 */
		if (selectedImage) {
			setIsImageSaved(false);
			const isImageSaved = await onSaveButtonPressed(selectedImage);
			if (isImageSaved) {
				setIsImageSaved(true);
				setSelectedImage(null);
			}
		}
	}

	async function _onCancelButtonPressed(event: React.MouseEvent<HTMLButtonElement>) {
		setSelectedImage(null);
		onCancelButtonPressed(event);
	}

	/**
	 * HTML Elements
	 */
	if (selectedImage) {
		/**
		 * Display the `Save` and `Cancel` buttons
		 */
		return (
			<div className="flex gap-x-3">

				{/** Save Button */}
				<ActionButton
					success={isImageSaved}
					onActionButtonPressed={_onSaveButtonPressed}
					className="flex-1 mb-4 px-1 py-1 sm:mt-3 bg-theme-green hover:bg-green-500 rounded-lg text-white"
				/>

				{/** Cancel Button */}
				<button
					className="flex-1 mb-4 px-1 py-1 sm:mt-3 bg-red-700 rounded-lg text-white hover:bg-red-500"
					onClick={_onCancelButtonPressed}
				>Cancel</button>
			</div>
		)
	} else {
		/**
		 * Default (no image selected for upload).
		 * Display the `Change Picture` button.
		 */
		return (
			<label className="mb-4 px-1 py-1 sm:mt-3 bg-blue-600 hover:bg-blue-400 rounded-lg text-white text-center">
				Change Picture
				<input type="file" accept=".jpg,.jpeg,.png" className="hidden" onChange={onInputChanged} />
			</label>
		)
	}
}

export default PfpSelector
