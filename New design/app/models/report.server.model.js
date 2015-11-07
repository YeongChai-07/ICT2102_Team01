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
		required: 'Please fill in the venue of your traffic report.',
		trim: true
	},
	category:{
		type: String,
		default:'',
		required: 'Please fill in category of congestion',
		trim: true
	},
	congestion:{
		type: String,
		default:'',
		required: 'Please fill in the level of congestion',
		trim: true
	},
	time:{
		type: String,
		default:'',
		required: 'Please fill in the estimated congestion time.',
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
