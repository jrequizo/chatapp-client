import React from "react";

interface AddFriendComponentProps {
	onClick?: React.MouseEventHandler<HTMLButtonElement>
}

const AddFriendComponent: React.FC<AddFriendComponentProps> = ({
	onClick
}) => {

	return (
		<button
			className="mb-4 px-1 py-1 sm:mt-3 bg-theme-darkgreen rounded-lg text-white hover:bg-theme-lightgreen"
			onClick={onClick}
		>Add Friend</button>
	)
}

export default AddFriendComponent
