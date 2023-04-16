import React, { useState } from "react";
import PropTypes from "prop-types";

const ImageFallback = (props) => {
	const [errored, setErrored] = useState(false);
	return (errored)
		? <img alt="error" src={props.fallback} style={props.style} className={props.className}/>
		: <img
			alt="fallback image"
			src={props.src}
			style={props.style}
			className={props.className}
			onError={() => {
				setErrored(true);
			}}
		/>;
};

ImageFallback.propTypes = {
	style: PropTypes.any, // Unused
	className: PropTypes.string,
	fallback: PropTypes.string,
	src: PropTypes.string
};

export default ImageFallback;
