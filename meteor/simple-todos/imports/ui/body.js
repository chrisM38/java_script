import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';


import { Tasks } from '../api/tasks.js';
import {checkedDate} from '../api/dates.js';
import {getMonth, getYear} from "./calendar";

import './calendar.js';
import './task.js';
import './body.html';


Template.body.onCreated(function bodyOnCreated() {
    this.state = new ReactiveDict();
});

Template.body.helpers({
    tasks() {
        const instance = Template.instance();
        if (instance.state.get('hideCompleted')) {
            return Tasks.find({ checked: { $ne: true } }, { sort: { day: 1 } });
        }
        return Tasks.find({month: getMonth(), year:getYear()}, {sort: {day: 1}}).fetch();
    },
    incompleteCount() {
        return Tasks.find({ checked: { $ne: true } }).count();
    },

});

Template.body.events({
    'submit .new-task'(event) {
        event.preventDefault();

        const target = event.target;
        const text = target.text.value;

        let month = getMonth();
        let year = getYear();

        for(let day of checkedDate) {
            Tasks.insert({
                text,
                day, month, year,
            });
        }
        target.text.value = '';
    },
    'change .hide-completed input'(event, instance) {
        instance.state.set('hideCompleted', event.target.checked);
    },
});

