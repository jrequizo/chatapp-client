import React from "react";

import ProfileComponent from "./components/ProfileComponent";
import { API } from "@/utils/trpc/trpc";

function Profile() {
	const uid = window.location.pathname.split('/').pop()!

	/**
	 * Retrieve profile data from the API.
	 */
	const profileDataQuery = API.useQuery(["profile.profileData", {
		uid: uid
	}], {
		enabled: !!uid,
		placeholderData: {
			uid: uid,
			username: "Loading...",
			pfp_url: "https://t4.ftcdn.net/jpg/00/64/67/63/360_F_64676383_LdbmhiNM6Ypzb3FM4PPuFP9rHe7ri8Ju.jpg",
			about: ""
		},
	})

	return (
		<ProfileComponent
			profileData={profileDataQuery.data}
		/>
	)
}

export default Profile
