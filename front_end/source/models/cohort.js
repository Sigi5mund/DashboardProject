const Request = require('../services/request');


const Cohort = function(name, start_date, teachers, xmas){
  this.name = name;
  this.start_date = start_date;
  this.teachers = teachers;
  this.syllabus= "";
  this.week = 1;
  this.break = xmas;
  this.setNoOfWeeks();
}

Cohort.prototype.setNoOfWeeks = function(){
  var oneWeek = 7*24*60*60*1000;
  var startDate = this.start_date;
  var currentDate = new Date();
  var diffWeeks = Math.round(Math.abs((startDate.getTime() - currentDate.getTime())/(oneWeek)));
  if (this.break === true && currentDate.getMonth() < 4) {
    this.week += diffWeeks-2;
  }else
  {this.week += diffWeeks};

}

module.exports = Cohort;
