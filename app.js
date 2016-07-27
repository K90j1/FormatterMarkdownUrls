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
			table: "Formatter Markdown Urls\nhttp://pi.local/Community/ConvertMdUrl/",
			result: "[Formatter Markdown Urls](http://pi.local/Community/ConvertMdUrl/)",
			flag: "\\n"
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
				, "\\t"]
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
		if (label == "flag") {
			this.setState({flag: event.target.value});
			delimiter = event.target.value;
			text = this.state.table.replace(/\r\n|\r/g, "\n");
		} else {
			this.setState({table: event.target.value});
			text = event.target.value.replace(/\r\n|\r/g, "\n");
		}
		var dataArray = splitByLine(text, delimiter);
		for (var i = 0; i < dataArray.length; i++) {
			if (dataArray[i].match(/^http/)) {
				dataArray[i] = "(" + dataArray[i] + ")";
			} else {
				dataArray[i] = "[" + dataArray[i] + "]";
			}
			dataArray[i] = excpectionFormat(dataArray[i]);
		}
		this.setState({result: combineByLine(dataArray)});
		highlightBlock();
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
				<h2> 2. Set Text Fields</h2>
				<div class="form-group">
						<textarea class="form-control" rows="6" type="text" value={table}
											onChange={this.handleInputChange.bind(null,'table')}/>
				</div>
				<div>
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

function excpectionFormat(text) {
	text.replace(/^\[\[/g, "[");
	text.replace(/]]$/g, "]");
	text.replace(/^\(\(/g, "(");
	text.replace(/\)\)$/g, ")");
	return text;
}