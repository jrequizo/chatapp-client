import React, { useEffect } from "react";
import { useParams } from "react-router";
import { useMutation } from "react-query";

import { getUid, storeProfile } from "@/utils/credentialManager";
import { API } from "@/utils/trpc/trpc";
import { uploadProfilePicture } from "@/core/profile/uploadProfilePicture";

import ProfileComponent from "./ProfileComponent";
import UserProfileComponent from "./components/UserProfileComponent";
import Navbar from "@/components/Navbar/Navbar";
import FriendsList from "./components/FriendsList";
import ProfileBar from "./components/ProfileBar";
import OtherProfileComponent from "./components/OtherProfileComponent";
import UserAbout from "./components/UserAbout";

function Profile() {
	/**
	 * Retrieve the uid from the query param
	 */
	const { id: _uid } = useParams();

	// Stops Typescript from thinking uid may be undefined
	const uid = _uid === undefined ? "" : _uid

	const tempProfileData = {
		uid: uid,
		username: "Loading...",
		pfp_url: "https://storage.googleapis.com/chatapp-profile/pfp/default",
		about: ""
	};

	/**
	 * Retrieve profile data from the API.
	 */
	const { data: profileData, status } = API.useQuery(
		[
			"profile.profileData",
			{
				uid: uid,
			}
		]
	)

	useEffect(() => {
		
	}, [status])

	const isCurrentUser = uid === getUid()

	const data = profileData ?? tempProfileData

	return (
		<main className="bg-gray-300">
			<Navbar />
			{/* Username */}
			<ProfileBar username={data.username} />
			{/* Profile section */}
			<section className="grid grid-cols-1 md:grid-cols-2 bg-white mx-auto overflow-y-scroll md:w-8/12 w-screen">
				{/* Left area */}
				{
					isCurrentUser ?
						<UserProfileComponent
							uid={uid}
							pfpUrl={data.pfp_url}
						/> :
						<OtherProfileComponent
							pfpUrl={data.pfp_url}
						/>
				}

				{/* Right area */}
				
				<UserAbout
					about={data.about}
				/>

				<FriendsList />
			</section>
		</main>
	)
}

export default Profile
