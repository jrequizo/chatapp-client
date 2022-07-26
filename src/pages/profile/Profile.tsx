import React from "react";
import { useMutation } from "react-query";

import { getUid, storeProfile } from "@/utils/credentialManager";
import { API } from "@/utils/trpc/trpc";
import { uploadProfilePicture } from "@/core/profile/uploadProfilePicture";

import ProfileComponent from "./ProfileComponent";
import UserProfileComponent from "./UserProfileComponent";

function Profile() {
	const uid = window.location.pathname.split('/').pop()!
	const initialData = {
		uid: uid,
		username: "Loading...",
		pfp_url: "https://storage.googleapis.com/chatapp-profile/pfp/default.png",
		about: ""
	};

	const uploadPfpMutation = useMutation(uploadProfilePicture, {
		async onSuccess() {
			// TODO: invalidate and re-fetch profile data?
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
		],
		{
			enabled: !!uid,
			initialData: initialData,
		}
	)

	const isCurrentUser = (profileData?.uid || "") === getUid()

	async function _uploadProfilePicture(image: File) {
		uploadPfpMutation.mutate(image);
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
				profileData={profileData ?? initialData}
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
