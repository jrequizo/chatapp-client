import React from "react";

import Navbar from "@components/Navbar/Navbar";
import ProfileData from "@/types/ProfileData";
import { getUid, storeProfile } from "@/utils/credentialManager";

interface ProfileComponentProps {
	profileData?: ProfileData
}

const ProfileComponent: React.FC<ProfileComponentProps> = ({
	profileData
}) => {
	const isCurrentUser = profileData?.uid === getUid()

	//  Re-cache any new data
	if (isCurrentUser) {
		storeProfile(profileData)
	}

	return (
		<main className="bg-gray-300">
			<Navbar />
			{/* Username */}
			<div className="grid bg-white shadow-md md:w-8/12 w-screen mx-auto">
				<h2 className="text-center font-bold px-4 py-3 z-10 text-2xl border-b-2">{profileData?.username}</h2>
			</div>
			{/* Profile section */}
			<section className="grid grid-cols-1 md:grid-cols-2 bg-white mx-auto overflow-y-scroll md:w-8/12 w-screen">
				{/* Left area */}
				<div className="grid content-center mx-auto py-4 px-3">
				<img className="rounded-3xl w-64 mx-auto aspect-square w-64" src={profileData?.pfp_url} alt="Profile"></img>
						{/*TODO Put buttons in own div to make responsive on mobile */}
						{
							/**
							 * Show either an `Add Friend` or `Change Picture` button, depending if we are viewing our own profile
							 * or another User's profile.
							*/
							isCurrentUser 
							? <button className="mb-4 px-1 py-1 sm:mt-3 bg-blue-600 rounded-lg text-white ">Change picture</button>
							: <button className="mb-4 px-1 py-1 sm:mt-3 bg-theme-darkgreen rounded-lg text-white hover:bg-theme-lightgreen">Add Friend</button>
						}
				</div>
				{/* Right area */}
				<div className="py-4 px-3 sm:border-t-2 md:border-t-0 md:border-l-2">
					<div className="flex flex-row">
						<h3 className="pb-1 w-full font-bold border-b border-gray-300">About Me</h3>
						{isCurrentUser && <button className="text-theme-darkgreen">Edit</button>}
					</div>
					<p className="h-full pt-2">
						{
							profileData?.about || ""
						}
					</p>
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

export default ProfileComponent
