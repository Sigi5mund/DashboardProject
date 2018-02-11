const Request = require('../services/request');


const Cohort = function(name, start_date, teachers){
  this.name = name;
  this.start_date = start_date;
  this.teachers = teachers;
  this.syllabus= "";
  this.week = 0;
}

Cohort.prototype.setNoOfWeeks = function(){
  var oneWeek = 7*24*60*60*1000; // hours*minutes*seconds*milliseconds
  var startDate = this.start_date;
  var currentDate = new Date(); // can you use todays date here?
  var diffWeeks = Math.round(Math.abs((startDate.getTime() - currentDate.getTime())/(oneWeek)));
  this.week += diffWeeks-1;
}

module.exports = Cohort;
