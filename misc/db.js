/**
 * Created by Moises on 3/25/14.
 */
var fs = require( 'fs' ), util = require('util');

var logic = {
	or         : 1,		//{or : [logic1, logic2, ...]} if not an array, popout singleton
	and        : 2,		//{or : [logic1, logic2, ...]} if not an array, popout singleton
	xor        : 3,		//{or : [logic1, logic2, ...]} if not an array, popout singleton
	not        : 0,		//can be array or singleton
	equal      : 4,	//can be array or singleton
	gt         : 5,		//can be array or singleton
	gte        : 6,		//can be array or singleton
	lt         : 7,		//can be array or singleton
	lte        : 8,		//can be array or singleton
	startsWith : 9,//can be array or singleton
	rx         : 10,		//can be array or singleton
	id         : 11		//can be array or singleton
};
function Query (conditions) {
	this.conditions = conditions || {};
	this.code = {};
	this.instance = Math.random();
}
Query.prototype.and = function Query_prototype_and () {
	var args = Array.prototype.slice.call( arguments );
	this.code = this.code.next = {and : args};
	return this;
};
Query.prototype.or = function Query_prototype_or () {
	var args = Array.prototype.slice.call( arguments );
	this.code = this.code.next = {or : args};
	return this;
};
Query.prototype.xor = function Query_prototype_xor () {
	var args = Array.prototype.slice.call( arguments );
	this.code = this.code.next = {xor : args};
	return this;
};
Query.prototype.not = function Query_prototype_not () {
	var args = Array.prototype.slice.call( arguments );
	this.code = this.code.next = {not : args};
	return this;
};
Query.prototype.equals = function Query_prototype_equals () {
	var args = Array.prototype.slice.call( arguments );
	this.code = this.code.next = {equals : args};
	return this;
};
Query.prototype.lt = function Query_prototype_lt () {
	var args = Array.prototype.slice.call( arguments );
	this.code = this.code.next = {lt : args};
	return this;
};
Query.prototype.lte = function Query_prototype_lte () {
	var args = Array.prototype.slice.call( arguments );
	this.code = this.code.next = {lte : args};
	return this;
};
Query.prototype.gt = function Query_prototype_gt () {
	var args = Array.prototype.slice.call( arguments );
	this.code = this.code.next = {gt : args};
	return this;
};
Query.prototype.gte = function Query_prototype_gte () {
	var args = Array.prototype.slice.call( arguments );
	this.code = this.code.next = {gte : args};
	return this;
};
Query.prototype.startsWith = function Query_prototype_startsWith () {
	var args = Array.prototype.slice.call( arguments );
	this.code = this.code.next = {startsWith : args};
	return this;
};
Query.prototype.rx = function Query_prototype_rx () {
	var args = Array.prototype.slice.call( arguments );
	this.code = this.code.next = {rx : args};
	return this;
};
Query.prototype.id = function Query_prototype_id () {
	var args = Array.prototype.slice.call( arguments );
	this.code = this.code.next = {id : args};
	return this;
};
Query.prototype.node = function Query_prototype_node (conditions) {
	this.code = this.code.next = {node : new Node( conditions )};
	return this;
	//conditions are AND
	//add more code nexts is OR
	//code.next should be an array
};
Query.prototype.rel = function Query_prototype_rel(conditions, goingOut){
	this.code = this.code.next = {rel : new Relationship( conditions, goingOut)};
	return this;
};


function Node (conditions) {
	this.conditions = conditions || {};
}
Node.prototype = new Query();
Node.prototype.constructor = Node;
/*
Node.prototype.rel = function Node_prototype_rel (conditions, goingOut) {
	new Relationship( conditions, goingOut );
};
Node.prototype.rel_in = function Node_prototype_rel_in (conditions) {
	this.rel( conditions, false );
};
Node.prototype.rel_out = function Node_prototype_rel_out (conditions) {
	this.rel( conditions, true );
};
*/
function Relationship (conditions, goingOut) {
	this.conditions = conditions || {};
	this.goIn = !goingOut;
	this.goOut = false !== goingOut;
	this.in = 1;
	this.out = 1;
}
Relationship.prototype = new Query();
Relationship.prototype.constructor = Relationship;
/*
Relationship.prototype.node = function Relationship_prototype_node (node) {
	this._node = node;
};
*/
var a = new Query().rel({equals:'has'}, true ).node().rel({equals:'owns'} ).node();
console.log(util.inspect(a));
/*
function q () {}

var a = q.Match( 'disease' );
var r = q.RelOut( 'has' );
q.add( a, r, a )
//	a.r.Node.RelOut('in',1,5 ).r.a;

q.Match( 'disease' ).rel( 'has' ).out().repeat( 5, 8 ).out( 'Arthritis' );

q.Match( 'me' ).rel( 'friend' ).out().rel( 'friend' ).out();
*/

var schemas = {};
schemas.nodes = {
	path    : 'node.tsv',
	columns : [
		{name : 'id', primaryKey : true, autogenerate : true},
		{name : 'desc', type : 'string'},
		{name : 'created', type : 'date', updateOnUpdate : false},
		{name : 'updated', type : 'date', updateOnUpdate : true}
		//{name : 'labels', type : 'Array'}
		//{name : 'rel_out', type : 'Array'}
		//{name : 'rel_in', type : 'Array'}
	]
};
schemas.rel_types = {
	path    : 'rel_type.tsv',
	columns : [
		{name : 'id', primaryKey : true, autogenerate : true},
		{name : 'desc', type : 'string'}
		//{name : 'instances', type : 'Array'}
	]
};
schemas.rels = {
	path    : 'rel.tsv',
	columns : [
		{name : 'id', primaryKey : true, autogenerate : true},
		{name : 'node_in', foreign : {table : 'nodes', column : 'id', counterpart : 'rels_out'}},
		{name : 'node_out', foreign : {table : 'nodes', column : 'id', counterpart : 'rels_in'}},
		{name : 'rel_type', foreign : {table : 'rel_types', column : 'id', counterpart : 'instances'}}
	]
};
schemas.labels = {
	path    : 'label.tsv',
	columns : [
		{name : 'id', primaryKey : true, autogenerate : true},
		{name : 'parent', foreign : {table : 'nodes', column : 'id', counterpart : 'labels'}},
		{name : 'child', foreign : {table : 'nodes', column : 'id'}}
	]
};
//function db_

function Database (schemas) {
	this.tables = {};
	this.schemas = schemas;
	this.load();
	this.connect();

}
Database.prototype.load = function () {
	var tableNames = Object.keys( this.schemas );
	var i;
	var numTables;
	for (i = 0, numTables = tableNames.length; i < numTables; i++) {
		var tableName = tableNames[i];
		var tableSchema = this.schemas[tableName];
		var tmpTable = [];
		var splitRows = fs.readFileSync( tableSchema.path, {encoding : 'utf8'} ).split( '\n' );
		var columnScheme = tableSchema.columns;
		var numCols = columnScheme.length;
		var numRows = splitRows.length;
		for (var k = 0; k < numRows; k++) {
			var splitCols = splitRows[k].split( '\t' );
			var tmpRow = {};
			for (var j = 0; j < numCols; j++) {
				tmpRow[columnScheme[j].name] = splitCols[j];
			}
			tmpTable[k] = tmpRow;
		}
		this.table[tableName] = tmpTable;
	}
};
Database.prototype.connect = function () {
	//connect
	var i, j, k, l,
		currentTable,
		foreignTable,
		foreignColumn,
		currentColumn,
		schemaColumns,
		currentItem,
		foreignItem,
		tableNames,
		numTables;
	tableNames = Object.keys( this.schemas );
	for (i = 0, numTables = tableNames.length; i < numTables; i++) {
		var tableName = tableNames[i];
		currentTable = this.tables[tableName];
		schemaColumns = this.schemas[tableName].columns;
		var numColumns;
		for (j = 0, numColumns = schemaColumns.length; j < numColumns; j++) {
			currentColumn = schemaColumns[j];
			if (currentColumn.foreign == undefined) {
				continue;
			}
			foreignTable = this.tables[currentColumn.foreign.table];
			foreignColumn = currentColumn.foreign.counterpart;
			for (k = 0, numRows = currentTable.length; k < numRows; k++) {
				currentItem = currentTable[k];
				if ((foreignItem = foreignTable[currentItem[currentColumn]]) !== undefined) {
					currentItem[currentColumn] = foreignItem;
					if (foreignColumn !== undefined) {
						(foreignItem[foreignColumn] || (foreignItem[foreignColumn] = [])).push( currentItem );
					}
				}
			}
		}
	}
};