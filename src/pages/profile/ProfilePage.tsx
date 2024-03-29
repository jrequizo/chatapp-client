import React from "react";
import { useParams } from "react-router";

import { getUid } from "@/utils/credentialManager";
import { API } from "@/utils/trpc/trpc";

import Navbar from "@/components/Navbar/Navbar";

import PfpSelector from "./components/user/PfpSelector";
import Pfp from "./components/Pfp";

import AboutEditor from "./components/user/AboutEditor";
import UserAbout from "./components/UserAbout";

import FriendsList from "./components/FriendsList";
import ProfileBar from "./components/ProfileBar";

/**
 * The Profile page, rendering depending if the profile is the User's or not.
 * @returns {JSX.Element} Component
 */
const ProfilePage: React.FC = () => {
	/**
	 * Retrieve the uid from the query param
	 */
	const { id: _uid } = useParams();

	// Stops Typescript from thinking uid may be undefined
	const uid = _uid === undefined ? "" : _uid

	// Temporary filler data while the query loads.
	const tempProfileData = {
		uid: uid,
		username: "",
		pfp_url: "",
		about: ""
	};

	/**
	 * Retrieve profile data from the API.
	 */
	const { data: profileData } = API.useQuery([
		"profile.profileData", {
			uid: uid,
		}
	])

	const isCurrentUser = uid === getUid()

	const data = profileData ?? tempProfileData

	return (
		<ProfileComponent
			uid={uid}
			username={data.username}
			pfpUrl={data.pfp_url}
			about={data.about}
			isCurrentUser={isCurrentUser}
		/>
	)
}

/**
 * Component wrapper for ProfilePage.
 */
interface ProfileComponentProps {
	uid: string
	username: string
	pfpUrl: string
	about: string
	isCurrentUser: boolean
}

const ProfileComponent: React.FC<ProfileComponentProps> = ({
	uid,
	username,
	pfpUrl,
	about,
	isCurrentUser
}) => {
	return (
		<main className="bg-gray-300">
			<Navbar />
			{/* Username */}
			<ProfileBar username={username} isCurrentUser={isCurrentUser} />
			{/* Profile section */}
			<section className="md:max-w-[768px] flex flex-col bg-white mx-auto overflow-y-scroll w-screen">
				<div className="sm:flex">
					{/* Left area */}
					{
						isCurrentUser ?
							<PfpSelector
								uid={uid}
								pfpUrl={pfpUrl}
							/> :
							<Pfp
								pfpUrl={pfpUrl}
							/>
					}

					{/* Right area */}
					{
						isCurrentUser ?
							<AboutEditor
								about={about}
							/> :
							<UserAbout
								about={about}
							/>
					}
				</div>
				<div className="flex h-0 border-b-2 my-4 mx-3">

				</div>
				<FriendsList />
			</section>
		</main>
	)
}

export default ProfilePage
