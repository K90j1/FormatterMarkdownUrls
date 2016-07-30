/**
 * @jsx React.DOM
 * Scaffold Command Line Generator
 *
 * Copyright (c) 2015 routeflags.inc
 * This file is licensed under the MIT License
 * http://opensource.org/licenses/MIT
 */

/**
 * Generator class
 */
var Generator = React.createClass({
	getInitialState: function () {
		return {
			table: "Formatter Markdown Urls\nhttps://k90j1.github.io/FormatterMarkdownUrls/",
			result: "* [Formatter Markdown Urls](https://k90j1.github.io/FormatterMarkdownUrls/)",
			flag: "\\n",
			is_list: "true"
		};
	},

	/**
	 * Get select option values
	 *
	 * @this {Generator}
	 * @return {columnTypeOptions: Array, indexTypeOptions: Array, }
	 */
	getDefaultProps: function () {
		return {
			indexTypeOptions: [
				"\\n"
				, "\\t"],
			listOptions: [
				"true"
				, "false"]
		};
	},

	/**
	 * Get onChange event
	 *
	 * @this {Generator}
	 * @return void
	 * @param event {object} input filed
	 * @param label {string}
	 */
	handleInputChange: function (label, event) {
		var text = "";
		var delimiter = this.state.flag;
		var is_list = this.state.is_list;
		if (label == "flag") {
			this.setState({flag: event.target.value});
			delimiter = event.target.value;
			text = exceptionFormat(this.state.table);
		} else if(label == "is_list"){
			this.setState({is_list: event.target.value});
			is_list = event.target.value;
			text = exceptionFormat(this.state.table);
		} else {
			this.setState({table: event.target.value});
			text = exceptionFormat(event.target.value);
		}
		var dataArray = splitByLine(text, delimiter);
		for (var i = 0; i < dataArray.length; i++) {
			if (dataArray[i].match(/^http/)) {
				dataArray[i] = "(" + dataArray[i] + ")";
			} else {
				if(is_list == "true"){
					dataArray[i] = "* [" + dataArray[i] + "]";
				}else{
					dataArray[i] = "[" + dataArray[i] + "]";
				}
			}
			dataArray[i] = dataArray[i];
		}
		this.setState({result: combineByLine(dataArray)});
		if(label == "table"){
			highlightBlock();
		}
	},

	/**
	 * Rendering input forms and add button
	 *
	 * @this {Generator}
	 * @return {string}
	 */
	render: function () {
		var table = this.state.table;
		var result = this.state.result;
		var flag = this.state.flag;
		var is_list = this.state.is_list;
		return (
			<form class="form-horizontal">
				<h2> 1. Set Delimiter</h2>
				<div class="form-group">
					<select class="form-control" id="indexOptions" value={flag}
									onChange={this.handleInputChange.bind(null,  'flag')}>
						{
							(this.props.indexTypeOptions || []).map(function (value) {
								return (
									<option value={value}>{value}</option>
								);
							})
						}
					</select>
				</div>
				<h2> 2. Set Fields</h2>
				<div class="form-group">
						<textarea class="form-control" rows="6" type="text" value={table}
											onChange={this.handleInputChange.bind(null,'table')}/>
				</div>
				<div>
					<h2> 3. Add List Prefix</h2>
					<select class="form-control" id="listOptions" value={is_list}
									onChange={this.handleInputChange.bind(null,  'is_list')}>
						{
							(this.props.listOptions || []).map(function (value) {
								return (
									<option value={value}>{value}</option>
								);
							})
						}
					</select>
				</div>
				<div>
					<h2> 4. Copy Result</h2>
					<pre>
						<code className="markdown">{result}</code>
					</pre>
				</div>
			</form>
		);
	}
});

/**
 * Rendering
 *
 * @return void
 */
React.render(
	<Generator />
	, document.getElementById('container'));

/**
 * Delayed exec highlightBlock()
 *
 * @return void
 */
function highlightBlock() {
	var aCodes = document.getElementsByTagName('pre');
	for (var i = 0; i < aCodes.length; i++) {
		hljs.highlightBlock(aCodes[i]);
	}
}

function splitByLine(text, flag) {
	var lines = [];
	if (flag == "\\n") {
		lines = text.split("\n");
	} else {
		lines = text.split("\t");
	}
	var outArray = [];
	for (var i = 0; i < lines.length; i++) {
		if (lines[i] == '') {
			continue;
		}
		outArray.push(lines[i]);
	}
	return outArray;
}

function combineByLine(array) {
	var text = "";
	for (var i = 0; i < array.length; i++) {
		if (array[i].match(/\)$/)) {
			text += array[i] + "\n";
		} else {
			text += array[i]
		}
	}
	return text;
}

function exceptionFormat(text) {
	text = text.replace(/\r\n|\r/g, "\n");
	text = text.replace(/\[/g, "");
	text = text.replace(/]/g, "");
	text = text.replace(/\(/g, "");
	text = text.replace(/\)/g, "");
	return text;
}