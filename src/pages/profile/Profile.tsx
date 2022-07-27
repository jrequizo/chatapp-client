import React from "react";
import { useParams } from "react-router";
import { useMutation } from "react-query";

import { getUid, storeProfile } from "@/utils/credentialManager";
import { API } from "@/utils/trpc/trpc";
import { uploadProfilePicture } from "@/core/profile/uploadProfilePicture";

import ProfileComponent from "./ProfileComponent";
import UserProfileComponent from "./UserProfileComponent";

function Profile() {
	//
	const utils = API.useContext()

	//
	const { id } = useParams();

	// Stops Typescript from thinking uid may be undefined
	const uid = id === undefined ? "" : id

	const initialData = {
		uid: uid,
		username: "Loading...",
		pfp_url: "https://storage.googleapis.com/chatapp-profile/pfp/default",
		about: ""
	};

	const uploadPfpMutation = useMutation(uploadProfilePicture, {
		async onSuccess() {
			utils.invalidateQueries(["profile.profileData", {uid: uid}]);
		},
	})
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

	const isCurrentUser = uid === getUid()

	async function _uploadProfilePicture(image: File) {
		const response = await uploadPfpMutation.mutateAsync(image)
		
		return response.status === 201;
	}

	//  Re-cache any new data
	if (status === 'loading') {
		return (
			<ProfileComponent
				profileData={profileData ?? initialData}
			/>
		)
	}

	if (profileData && isCurrentUser) {
		storeProfile(profileData)

		return (
			<UserProfileComponent
				onUploadImageButtonPressed={_uploadProfilePicture}
				username={profileData.username}
				about={profileData.about}
				pfpUrl={profileData.pfp_url}
			/>
		)
	} else {
		return (
			<ProfileComponent
				profileData={profileData ?? initialData}
			/>
		)
	}
}

export default Profile
