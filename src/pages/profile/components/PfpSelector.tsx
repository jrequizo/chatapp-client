import React, { useState } from "react";

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
			const isImageSaved = await onSaveButtonPressed(selectedImage);
			if (isImageSaved) {
				setSelectedImage(null);
			}
		}
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
				<button
					className="flex-1 mb-4 px-1 py-1 sm:mt-3 bg-theme-darkgreen rounded-lg text-white hover:bg-theme-lightgreen"
					onClick={_onSaveButtonPressed}
				>Save</button>

				{/** Cancel Button */}
				<button
					className="flex-1 mb-4 px-1 py-1 sm:mt-3 bg-red-700 rounded-lg text-white hover:bg-red-500"
					onClick={onCancelButtonPressed}
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
				<input type="file" accept=".jpg,.jpeg,.png" className="hidden" onChange={onInputChanged}/>
			</label>
		)
	}
}

export default PfpSelectorComponent
