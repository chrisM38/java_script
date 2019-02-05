import {Template} from 'meteor/templating';

import './calendar.html';
import './body.html';

import {months, checkedDate, today} from '../api/dates.js';
import {getTasks} from "./body";
var currentMonth = today.getMonth();
var currentYear = today.getFullYear();


Template.calendar.helpers({
    setYear() {
        return currentYear;
    },
    setMonth() {
        console.log("test");
        return months[currentMonth];
    },
});

Template.calendar.events({
    'click .prev'() {
        currentYear = (currentMonth === 0) ? currentYear - 1 : currentYear;
        currentMonth = (currentMonth === 0) ? 11 : currentMonth - 1;
        document.getElementsByClassName("month")[0].innerHTML = months[getMonth()];
        document.getElementsByClassName("year")[0].innerHTML = getYear();
        checkedDate = [];
        //getTasks();
        showCalendar(currentMonth, currentYear);
    },
    'click .next'() {
        currentYear = (currentMonth === 11) ? currentYear + 1 : currentYear;
        currentMonth = (currentMonth + 1) % 12;
        document.getElementsByClassName("month")[0].innerHTML = months[getMonth()];
        document.getElementsByClassName("year")[0].innerHTML = getYear();
        checkedDate = [];
        //getTasks();
        showCalendar(currentMonth, currentYear);
    },
    'change .calendarSelect'(event) {
        let dayId = $(event.target).attr("id");
        if($(event.target).is(":checked")){
            $(event.target.parentNode).css('background-color', 'white');
            checkedDate.splice(checkedDate.indexOf(dayId),1);
        }else {
            $(event.target.parentNode).css('background-color', 'red');
            checkedDate.push(dayId);
        }
    },
});

Template.calendar.onRendered(function () {
    showCalendar(currentMonth, currentYear);

    }
);

function showCalendar(month, year) {
    let firstDay = (new Date(year, month)).getDay();
    let daysInMonth = 32 - new Date(year, month, 32).getDate();
    let tbl = document.getElementsByClassName("days");
    tbl[0].innerHTML = "";
    let date = 1;
    for (let i = 0; i < 6; i++) {
        let row = document.createElement("tr");
        for (let j = 0; j < 7; j++) {
            if (i === 0 && j < firstDay -1) {
                let cell = document.createElement("td");
                cell.appendChild(document.createTextNode(""));
                row.appendChild(cell);
            } else if (date > daysInMonth) {
                break;
            } else {
                let cell = document.createElement("td");
                let input = document.createElement("input");
                input.setAttribute("type", "checkbox");
                input.setAttribute("id", date);
                input.setAttribute("class", "calendarSelect");
                cell.appendChild(input);
                cell.appendChild(document.createTextNode(date));
                row.appendChild(cell);
                date++;
            }
        }
        tbl[0].appendChild(row);
    }
}

export const getMonth = function()
{
    return currentMonth;
};

export const getYear = function()
{
    return currentYear;
};

export const getSelectedDays = function()
{
    return checkedDate;
};

