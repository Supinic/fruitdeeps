import React, { Component } from "react";
// import Image from "next/image";
// import SearchFilter from "../lib/itemFinder.js";

import Spinner from "../public/assets/spinner.svg";

// state.inputtext can probably be class attribute

export class AutofillSearchInput extends Component {
	constructor (props) {
		super(props);

		this.state = {
			searchList: [],
			loading: false,
			isItemFocused: false,
			highlightIndex: 0,
			inputText: "",
			shouldScroll: false,
			data: {
				loading: true,
				initialLoad: false,
				list: []
			}
		};

		this.setFocus = this.setFocus.bind(this);
		this.setBlur = this.setBlur.bind(this);
		this.setItemFocus = this.setItemFocus.bind(this);
		this.setItemBlur = this.setItemBlur.bind(this);
		this.getList = this.getList.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.setHighlightIndex = this.setHighlightIndex.bind(this);
		this.keyaction = this.keyaction.bind(this);
		this.handleHover = this.handleHover.bind(this);
		this.highlightRef = React.createRef();
		this.upRef = React.createRef();
		this.downRef = React.createRef();
		this.inputRef = React.createRef();
	}

	componentDidMount () {
		globalThis.document.addEventListener("keydown", this.keyaction);
	}

	componentWillUnmount () {
		globalThis.document.removeEventListener("keydown", this.keyaction);
	}

	keyaction (e) {
		if (!this.state.isFocused && !this.state.isItemFocused) {
			return;
		}

		if (e.key === "ArrowDown") {
			e.preventDefault();
			this.downRef.current.focus();
		}
		else if (e.key === "ArrowUp") {
			e.preventDefault();
			this.upRef.current.focus();
		}
		else if (e.key === "Enter" && this.state.searchList.length > 0) {
			this.inputRef.current.focus();
			this.inputRef.current.select();
			this.selectItem(this.state.searchList[this.state.highlightIndex]);
		}
		else if (e.key === "Tab" && this.state.isFocused) {
			e.preventDefault();
			this.highlightRef.current.focus();
		}
		else if (e.key === "Escape" && this.state.isItemFocused) {
			e.preventDefault();
			this.inputRef.current.focus();
			this.inputRef.current.select();
		}
	}

	setHighlightIndex (e) {
		this.setState({ highlightIndex: e.target.value });
	}

	setFocus () {
		this.setState({ isFocused: true });
	}

	setBlur () {
		this.setState({ isFocused: false });
	}

	setItemFocus () {
		this.setState({ isItemFocused: true });
	}

	setItemBlur () {
		this.setState({ isItemFocused: false });
	}

	getList (searchText, callback) {
		const xhr = new XMLHttpRequest();
		xhr.onload = () => {
			if (xhr.status >= 200 && xhr.status < 300 && searchText === this.state.inputText) {
				callback(xhr.response);
			}
		};

		xhr.open("GET", `${this.url}?like=${searchText}`);
		xhr.send();
	}

	handleChange () {}

	handleHover (e) {
		const inputValue = e.target.value;
		this.inputRef.current.focus();
		this.setState({ highlightIndex: inputValue });
	}

	render () {
		const results = this.results();
		if (this.state.data.loading) {
			return (
				<div className="auto-complete-container">
					<input className="auto-complete-input" placeholder="Loading data..." disabled/>
					<span className="loading-spinner"><Spinner/></span>
				</div>
			);
		}

		let listElementClass = "auto-complete-results";
		if (this.state.searchList.length === 0 || (!this.state.isFocused && !this.state.isItemFocused)) {
			listElementClass += " input-hidden-hack";
		}

		let loadingSpinner;
		if (this.state.loading) {
			loadingSpinner = (
				<span className="loading-spinner">
					<img
						alt="Loading..."
						src="../public/assets/spinner.svg"
						style={{ height: "1em", width: "auto" }}/>
				</span>
			);
		}

		let escapeNotification;
		if (!this.state.loading && this.state.isItemFocused) {
			escapeNotification = <span className="escape-notif">esc</span>;
		}

		return (
			<div className="auto-complete-container">
				<input
					className="auto-complete-input"
					onChange={this.handleChange}
					onFocus={this.setFocus}
					placeholder={this.placeholder}
					onBlur={this.setBlur}
					ref={this.inputRef}
				/>
				<ol className={listElementClass}>{results}</ol>
				{loadingSpinner}
				{escapeNotification}
			</div>
		);
	}
}
