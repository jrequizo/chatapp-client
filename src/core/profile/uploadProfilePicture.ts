import { getJwt, getUid } from "@/utils/credentialManager";

const apiUrl = process.env.REACT_APP_API_URL ?? "http://localhost:3001"

export async function uploadProfilePicture(image: File) {
	const jwt = getJwt()
	const uid = getUid()

	const formData = new FormData();

	formData.append('pfp', image);

	console.log(image)

	const response = await fetch(
		apiUrl + `/api/profile/${uid}/upload`,
		{
			method: "POST",
			headers: {
				"Authorization": `Bearer ${jwt}`,
                "Accept": "*/*"
			},
			body: formData,
		}
	);

	// const result = await response.json();

	// console.log(result)

	return response;
}