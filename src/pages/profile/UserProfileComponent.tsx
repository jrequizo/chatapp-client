import React, { useState } from "react";

import Navbar from "@components/Navbar/Navbar";

import ProfileBar from "./components/ProfileBar";

interface UserProfileComponentProps {
	username: string
	about: string
	pfpUrl: string

	onUploadImageButtonPressed: (image: File) => Promise<boolean>
}

const UserProfileComponent: React.FC<UserProfileComponentProps> = ({
	username,
	about,
	pfpUrl,
	onUploadImageButtonPressed
}) => {

	/**
	 * 
	 */
	const [selectedImage, setSelectedImage] = useState<File | null>(null);

	/**
	 * 
	 */
	const [_displayedPfp, _setDisplayedPfp] = useState(pfpUrl);

	/**
	 * 
	 * @param event 
	 */
	async function onImageSelected(event: React.ChangeEvent<HTMLInputElement>) {
		const file = event.target.files?.item(0);

		if (file) {
			const url = URL.createObjectURL(file);
			_setDisplayedPfp(url);
			setSelectedImage(event.target.files?.item(0) ?? null)
		}
	}
	
	let _pfpUrl = _displayedPfp === "" ? "https://storage.googleapis.com/chatapp-profile/pfp/default" : _displayedPfp;
	if (_pfpUrl.startsWith("https://storage.googleapis.com/")) {
		_pfpUrl += `-large.png?time=${Date.now()}`;
	}

	/**
	 * 
	 */
	function resetSelectedFile() {
		_setDisplayedPfp(pfpUrl);
		setSelectedImage(null);
	}

	return (
		<main className="bg-gray-300">
			<Navbar />
			<ProfileBar username={username} />
			{/* Profile section */}
			<section className="grid grid-cols-1 md:grid-cols-2 bg-white mx-auto overflow-y-scroll md:w-8/12 w-screen">
				{/* Left area */}
				<div className="grid content-center mx-auto py-4 px-3">
					<img className="rounded-3xl w-64 mx-auto aspect-square w-64" src={_pfpUrl} alt="Profile"></img>
					{/*TODO Put buttons in own div to make responsive on mobile */}
					{
						(!selectedImage 
							?
							<label className="mb-4 px-1 py-1 sm:mt-3 bg-blue-600 hover:bg-blue-400 rounded-lg text-white text-center">
								Change Picture
								<input type="file" accept=".jpg,.jpeg,.png" className="hidden" onChange={onImageSelected} />
							</label>
							:
							<div className="flex gap-x-3">
								<button
									className="flex-1 mb-4 px-1 py-1 sm:mt-3 bg-theme-darkgreen rounded-lg text-white hover:bg-theme-lightgreen"
									onClick={async () => {
										const result = await onUploadImageButtonPressed(selectedImage)
										if (result) {
											// Resets the selected image file, returning the UI to 'Change Picture'
											resetSelectedFile()
										}
									}}
									// disabled={uploadPfpMutation.status === 'loading'}
								>Save</button>
								<button
									className="flex-1 mb-4 px-1 py-1 sm:mt-3 bg-red-700 rounded-lg text-white hover:bg-red-500"
									onClick={() => {resetSelectedFile()}}
								>Cancel</button>
							</div>
						)
					}


				</div>
				{/* Right area */}
				<div className="py-4 px-3 sm:border-t-2 md:border-t-0 md:border-l-2">
					<div className="flex flex-row">
						<h3 className="pb-1 w-full font-bold border-b border-gray-300">About Me</h3>
						<button className="text-theme-darkgreen">Edit</button>
					</div>
					<p className="h-full pt-2">{about}</p>
				</div>

				<div className='py-4 px-3'>
					<h3 className="font-bold">Friends list</h3>
					<ul>
						<li>Friend 1</li>
						<li>Friend 2</li>
						<li>Friend 3</li>
					</ul>
				</div>
			</section>
		</main>
	)
}

export default UserProfileComponent
