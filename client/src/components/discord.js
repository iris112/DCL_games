import React, { Component } from "react";
import Discordpng from './Images/discord-512.png';
import { Image } from "semantic-ui-react";

class Discord extends Component {

	render() {
		return (
			<div>
				<Image src={Discordpng} 
					className="discord-chat"
					href="/discord/"
					style={{
						width: '48px',
						position: 'fixed',
						bottom: '21px',
						right: '21px',
						zIndex: '10'
					}}
				/>
			</div>
		);
	}
}

export default Discord
