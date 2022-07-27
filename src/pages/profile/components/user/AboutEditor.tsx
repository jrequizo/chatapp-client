import { API } from "@/utils/trpc/trpc";
import React, { useState, useRef, useEffect } from "react";


interface UserAboutProps {
	about: string
}

const UserAbout: React.FC<UserAboutProps> = ({
	about
}) => {
	//
	const utils = API.useContext()

	const saveAboutMutation = API.useMutation(["profile.about"])

	async function onSaveButtonPressed(about: string) {
		let _result = false;
		await saveAboutMutation.mutateAsync({
			about: about
		}, {
			onSuccess() {
				_result = true;
				utils.invalidateQueries("profile.profileData");
			}
		})
		return _result;
	}

	return (
		<UserAboutComponent
			about={about}
			onSaveButtonPressed={onSaveButtonPressed}
		/>
	)
}


interface UserAboutComponentProps {
	about: string

	onSaveButtonPressed: (about: string) => Promise<boolean>
}

const UserAboutComponent: React.FC<UserAboutComponentProps> = ({
	about,
	onSaveButtonPressed
}) => {

	const [isEditorVisible, setIsEditorVisible] = useState(false);

	const [aboutText, setAboutText] = useState(about);

	const textAreaRef = useRef<HTMLTextAreaElement>(null);

	useEffect(() => {
		if (isEditorVisible && textAreaRef) {
			textAreaRef.current?.focus();
		}
	}, [isEditorVisible])

	function onAboutChanged(event: React.ChangeEvent<HTMLTextAreaElement>) {
		const { value } = event.currentTarget;
		setAboutText(value);
	}

	function onCancelButtonPressed() {
		setIsEditorVisible(false);
		setAboutText(about)
	}

	async function _onSaveButtonPressed(event: React.MouseEvent<HTMLButtonElement>) {
		event.preventDefault()
		const success = await onSaveButtonPressed(aboutText)
		if (success) {
			setIsEditorVisible(false);
		}
	}

	return (
		<form className="h-full">
			{
				isEditorVisible ?
					<div className="h-full flex grow flex-col p-2">
						{/** content */}
						<div className="h-full">
							<textarea className="border-solid border h-full w-full resize-none" ref={textAreaRef} value={aboutText} onChange={onAboutChanged} />
						</div>
						{/** ui */}
						<div className="flex flex-row-reverse gap-x-2">

							<button
								className="mb-4 px-1 py-1 sm:mt-3 bg-red-700 rounded-lg text-white hover:bg-red-500"
								onClick={onCancelButtonPressed}
							>Cancel</button>

							<button
								className="mb-4 px-1 py-1 sm:mt-3 bg-theme-darkgreen rounded-lg text-white hover:bg-theme-lightgreen"
								onClick={_onSaveButtonPressed}
							>Save</button>
						</div>
					</div> :
					<p className="h-full pt-2">{about}</p>

			}
		</form>
	)
}

export default UserAbout;