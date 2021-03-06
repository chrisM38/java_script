import {Template} from 'meteor/templating';

import './calendar.html';
import './body.html';

import {months, checkedDate, today} from '../api/dates.js';

var currentMonth = today.getMonth();
var currentYear = today.getFullYear();


Template.calendar.helpers({
    setYear() {
        return currentYear;
    },
    setMonth() {
        return months[currentMonth];
    },
});

Template.calendar.events({
    'click .prev'() {
        currentYear = (currentMonth === 0) ? currentYear - 1 : currentYear;
        currentMonth = (currentMonth === 0) ? 11 : currentMonth - 1;
        document.querySelector(".month").innerHTML = months[getMonth()];
        document.querySelector(".year").innerHTML = getYear();
        checkedDate = [];
        buildCalendar(currentMonth, currentYear);
    },
    'click .next'() {
        currentYear = (currentMonth === 11) ? currentYear + 1 : currentYear;
        currentMonth = (currentMonth + 1) % 12;
        document.querySelector(".month").innerHTML = months[getMonth()];
        document.querySelector(".year").innerHTML = getYear();
        checkedDate = [];
        buildCalendar(currentMonth, currentYear);
    },
    'change .calendarSelect'(event) {
        let dayId = $(event.target).attr("id");
        if ($(event.target).is(":checked")) {
            $(event.target.parentNode).css('background-color', 'red');
            checkedDate.push(dayId);
        } else {
            $(event.target.parentNode).css('background-color', '#eee');
            checkedDate.splice(checkedDate.indexOf(dayId), 1);
        }
    },
});

Template.calendar.onRendered(function () {
        buildCalendar(currentMonth, currentYear);
    }
);

function buildCalendar(month, year) {
    let firstDay = (new Date(year, month)).getDay();
    let daysInMonth = 32 - new Date(year, month, 32).getDate();
    let tbl = document.querySelector(".days");
    tbl.innerHTML = "";
    let date = 1;
    for (let i = 0; i < 5; i++) {
        let row = document.createElement("tr");
        for (let j = 0; j < 7; j++) {
            if (i === 0 && j < firstDay - 1) {
                let cell = document.createElement("td");
                cell.appendChild(document.createTextNode(""));
                row.appendChild(cell);
            } else if (date > daysInMonth) {
                let cell = document.createElement("td");
                cell.appendChild(document.createTextNode(""));
                row.appendChild(cell);
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
        tbl.appendChild(row);
    }
}

export const getMonth = function () {
    return currentMonth;
};

export const getYear = function () {
    return currentYear;
};

export const getSelectedDays = function () {
    return checkedDate;
};

