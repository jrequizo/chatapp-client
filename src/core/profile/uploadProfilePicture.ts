import { getJwt } from "@/utils/credentialManager";

// http://localhost:

const url = process.env.NODE_ENV === 'development' ? `http://${window.location.hostname}:3001/api/express` : `${process.env.PUBLIC_URL}/api/express`;

export async function uploadProfilePicture(image: File) {
	const jwt = getJwt()

	const formData = new FormData();

	formData.append('pfp', image);

	const response = await fetch(
		`${url}/profile/upload`,
		{
			method: "POST",
			headers: {
				"Authorization": `Bearer ${jwt}`,
                "Accept": "*/*"
			},
			body: formData,
		}
	);

	return response;
}