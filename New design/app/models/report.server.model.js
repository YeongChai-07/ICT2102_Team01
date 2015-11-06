'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Report Schema
 */
var ReportSchema = new Schema({
	roadname: {
		type: String,
		default: '',
		required: 'Please fill Road name',
		trim: true
	},
	category:{
		type: String,
		default:'',
		required: 'Please fill Category',
		trim: true
	},
	congestion:{
		type: String,
		default:'',
		required: 'Please fill Congestion',
		trim: true
	},
	time:{
		type: String,
		default:'',
		required: 'Please fill Time',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Report', ReportSchema);
