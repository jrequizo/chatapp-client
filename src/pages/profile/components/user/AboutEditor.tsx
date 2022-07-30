import React, { useState, useRef, useEffect, useCallback } from "react";

import { API } from "@/utils/trpc/trpc";
import ActionButton from "@/components/ActionButton";

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


/**
 * Component wrapper for UserAbout.
 * @param {string} about The `About Me` text of the User. 
 * @param {onSaveButtonPressed} onSaveButtonPressed The callback that is executed when the `Save` button is pressed.
 * @returns 
 */
const UserAboutComponent: React.FC<UserAboutComponentProps> = ({
	about,
	onSaveButtonPressed
}) => {
	const [isEditorVisible, setIsEditorVisible] = useState(false);

	const [aboutText, setAboutText] = useState(about);
	const [isAboutUpdated, setIsAboutUpdated] = useState(true);

	/**
	 * Ref of the textarea so we move focus to this element.
	 */
	const textAreaRef = useRef<HTMLTextAreaElement>(null);

	const focusTextArea = useCallback(() => {
		if (textAreaRef) {
			textAreaRef.current?.focus();
			textAreaRef.current?.setSelectionRange(aboutText.length, aboutText.length);
		}
	}, [textAreaRef, aboutText.length]);

	/**
	 * Passes focus to the textarea when the `Edit` text button is pressed.
	 * We only want this to trigger when isEditorVisible is first set to true.
	 */
	useEffect(() => {
		if (isEditorVisible) {
			focusTextArea();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isEditorVisible])

	/**
	 * Updates the state when the `about` prop is regenerated.
	 */
	useEffect(() => {
		setAboutText(about)
	}, [about, setAboutText])

	function onAboutChanged(event: React.ChangeEvent<HTMLTextAreaElement>) {
		const { value } = event.currentTarget;
		setAboutText(value);
	}

	function onCancelButtonPressed() {
		setIsEditorVisible(false);
		setAboutText(about)
	}

	/**
	 * Call the `Save` mutation and reset the editor if successful.
	 */
	async function _onSaveButtonPressed(event: React.MouseEvent<HTMLButtonElement>) {
		event.preventDefault();
		setIsAboutUpdated(false);
		const success = await onSaveButtonPressed(aboutText)
		if (success) {
			setIsEditorVisible(false);
			setIsAboutUpdated(true);
		}
	}

	return ( //"flex flex-col-reverse grow basis-0
		<div className="flex flex-1 flex-col py-4 px-3 sm:border-t-2 md:border-t-0 md:border-l-2 min-w-0">
			<div className="flex flex-row border-b border-gray-300">
				<h3 className="pb-1 w-full font-bold">About Me</h3>
				{!isEditorVisible && <button className="text-theme-darkgreen hover:text-green-500" onClick={() => {
					setIsEditorVisible(true);
				}}>Edit</button>}
			</div>
			{
				isEditorVisible ?
					<form className="h-full bg-green-200">
						<div className="h-full flex grow flex-col p-2 ">
							{/** content */}
							<div className="h-full">
								<textarea className="border-solid border h-full w-full resize-none focus:outline-none p-2" ref={textAreaRef} value={aboutText} onChange={onAboutChanged} />
							</div>
							{/** ui */}
							<div className="flex flex-row-reverse gap-x-2">
								<button
									className="mb-4 px-1 py-1 sm:mt-3 bg-red-700 rounded-lg text-white hover:bg-red-500"
									onClick={onCancelButtonPressed}
								>Cancel</button>


								<ActionButton
									success={isAboutUpdated}
									onActionButtonPressed={_onSaveButtonPressed}
									className="mb-4 px-1 py-1 sm:mt-3 bg-theme-green hover:bg-green-500 rounded-lg text-white disabled:bg-gray-400"
								/>
							</div>
						</div>
					</form> :
					<div className="h-full pt-2 whitespace-pre break-all overflow-hidden">{about}</div>

			}
		</div>

	)
}

export default UserAbout;