/**
 * @jsx React.DOM
 * Scaffold Command Line Generator
 *
 * Copyright (c) 2015 routeflags.inc
 * This file is licensed under the MIT License
 * http://opensource.org/licenses/MIT
 */

var Rows = React.createClass({
    /**
     * Get select option values
     *
     * @this {Rows}
     * @param column {string}
     * @param lineNumber {int}
     * @return {string}
     */
    createItem: function (column, lineNumber) {
        var columnPair = column.split(',');
        return <li>
            <label>
            カラム名
                <small> - Column Name </small>
            :&nbsp;
                <input type="text" value={columnPair[0]} onChange={this.props.handleInputChange.bind(null, lineNumber + ',column')} />
            </label>
        &nbsp;/&nbsp;
            <label>
            カラムタイプ<small> - Column Type </small>:&nbsp;
                <select value={columnPair[1]} onChange={this.props.handleInputChange.bind(null, lineNumber + ',columnType')}>
                {
                    (this.props.columnTypeOptions || []).map(function (value) {
                        return (
                            <option value={value}>{value}</option>
                        );
                    })
                }
                </select></label>
            &nbsp;
        <label><small> Index </small>:&nbsp;
                <select id="indexOptions" value={columnPair[2]} onChange={this.props.handleInputChange.bind(null, lineNumber + ',indexType')}>
                    {
                        (this.props.indexTypeOptions || []).map(function (value) {
                            var data = ":" + value;
                            if(value.length < 1)
                                data = "";
                            return (
                                <option value={data}>{value}</option>
                            );
                        })
                    }
                </select></label>&nbsp;
        <a href="#" onClick={this.props.handleDelete.bind(null, column)}>
            <button className="btn btn-default btn-sm">delete</button>
        </a>
        </li>;
    },
    render: function () {
        return <ul>{this.props.rows.map(this.createItem)}</ul>;
    }
});

/**
 * Generator class
 */
var Generator = React.createClass({
    getInitialState: function () {
        return {rows: ["NAME,string,"], table: "M_TABLE", column: "NAME", columnType: "string", indexType: ""
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
            columnTypeOptions: ["string"
                , "text"
                , "integer"
                , "float"
                , "decimal"
                , "datetime"
                , "timestamp"
                , "time"
                , "date"
                , "binary"
                , "boolean"
                , "references"
                , "primary_key"],
            indexTypeOptions: [""
                , "index"
                , "uniq"]
        };
    },

    /**
     * Get button event
     *
     * @this {Generator}
     * @return void
     * @param itemToDelete {object}
     */
    handleDelete: function (itemToDelete) {
        var newItems = _.reject(this.state.rows, function (item) {
            return item == itemToDelete
        });
        this.setState({rows: newItems});
    },

    /**
     * Get submit event
     *
     * @this {Generator}
     * @return void
     * @param event {object}
     */
    handleSubmit: function (event) {
        event.preventDefault();
        var nextItems = this.state.rows.concat([this.state.column + "," + this.state.columnType + "," + this.state.indexType]);
        this.setState({rows: nextItems});
        highlightBlock();
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
        if(label == "table"){
            this.setState({table: event.target.value});
        }else{
            var lineLabel = label.split(',');
            var row = this.state.rows[lineLabel[0]].split(',');
            if (lineLabel[1] == "column") {
                row[0] = event.target.value;
            } else if(lineLabel[1] == "columnType") {
                row[1] = event.target.value;
            } else {
                row[2] = event.target.value;
            }
            this.state.rows[lineLabel[0]] = row[0] + "," + row[1] + "," + row[2];
            this.setState({rows: this.state.rows});
        }
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
        var rows = this.state.rows;
        return (
            <div>
                <pre>
                    <code className="ruby">rails generate scaffold {table}&nbsp;
                    {this.handleInputChange.bind(null, 'rows')}
                    {
                        (rows || []).map(function (values) {
                            var pair = values.split(',');
                            return (
                                pair[0] + ":" + pair[1] + pair[2] + " "
                                );
                        })
                    }
                    </code>
                </pre>
                <p>
                    <label>
                    テーブル名
                        <small> - Table Name </small>
                    :&nbsp;
                        <input type="text" value={table} onChange={this.handleInputChange.bind(null, 'table')} />
                    </label>
                </p>
                <Rows rows={this.state.rows}
                handleDelete={this.handleDelete}
                columnTypeOptions={this.props.columnTypeOptions}
                indexTypeOptions={this.props.indexTypeOptions}
                handleInputChange={this.handleInputChange}/>
                <div className="row">
                    <div className="col-md-9"></div>
                    <form onSubmit={this.handleSubmit}>
                        <button className="btn btn-primary btn-lg">{'Add #' + (this.state.rows.length + 1)}</button>
                    </form>
                </div>
            </div>
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