import React from "react";

import Navbar from "@components/Navbar/Navbar";
import ProfileData from "@/types/ProfileData";

import ProfileBar from "./components/ProfileBar";
import FriendsList from "./components/FriendsList";

interface ProfileComponentProps {
	profileData: ProfileData
}

const ProfileComponent: React.FC<ProfileComponentProps> = ({
	profileData
}) => {
	const pfpUrl = profileData.pfp_url === "" ? "https://storage.googleapis.com/chatapp-profile/pfp/default-large.png" : `${profileData.pfp_url}-large.png?time=${Date.now()}`;

	return (
		<main className="bg-gray-300">
			<Navbar />
			{/* Username */}
			<ProfileBar username={profileData.username}/>
			{/* Profile section */}
			<section className="grid grid-cols-1 md:grid-cols-2 bg-white mx-auto overflow-y-scroll md:w-8/12 w-screen">
				{/* Left area */}
				<div className="grid content-center mx-auto py-4 px-3">
					<img className="rounded-3xl w-64 mx-auto aspect-square w-64 object-cover" src={pfpUrl} alt="Profile"></img>
					{/*TODO Put buttons in own div to make responsive on mobile */}
					<button className="mb-4 px-1 py-1 sm:mt-3 bg-theme-darkgreen rounded-lg text-white hover:bg-theme-lightgreen">Add Friend</button>
				</div>
				{/* Right area */}
				<div className="py-4 px-3 sm:border-t-2 md:border-t-0 md:border-l-2">
					<div className="flex flex-row border-b border-gray-300">
						<h3 className="pb-1 w-full font-bold">About Me</h3>
					</div>
					<p className="h-full pt-2">
						{
							profileData.about ?? ""
						}
					</p>
				</div>

				<FriendsList />
			</section>
		</main>
	)
}

export default ProfileComponent
