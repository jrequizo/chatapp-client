import React from "react";

interface FriendsListProps {
}

const FriendsList: React.FC<FriendsListProps> = () => {

	return (
		<div className='py-4 px-3'>
			<h3 className="font-bold">Friends list</h3>
			<ul>
				<li>Friend 1</li>
				<li>Friend 2</li>
				<li>Friend 3</li>
			</ul>
		</div>
	)
}

export default FriendsList
