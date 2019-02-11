import {Meteor} from 'meteor/meteor';
import {Template} from 'meteor/templating';
import {ReactiveDict} from 'meteor/reactive-dict';


import {Tasks} from '../api/tasks.js';
import {getMonth, getSelectedDays, getYear} from "./calendar";

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
            return Tasks.find({checked: {$ne: true}, month: getMonth() + 1, year: getYear()}, {sort: {day: 1}}).fetch();
        }
        return Tasks.find({month: getMonth() + 1, year: getYear()}, {sort: {day: 1}}).fetch();
    },
    incompleteCount() {
        return Tasks.find({checked: {$ne: true}}).count();
    },

});

Template.body.events({
    'submit .new-task'(event) {
        event.preventDefault();

        const target = event.target;

        const priority = target.priority.value;
        const text = target.text.value;

        let month = getMonth() + 1;
        let year = getYear();
        let days = getSelectedDays();

        Meteor.call('check',priority !== "", "You have no selected priority");
        Meteor.call('check',days.length !== 0, "You have no selected days");

        for (let day of days) {
            Tasks.insert({
                text,
                day, month, year, priority
            })
        }
        target.text.value = '';
    },

    'change .hide-completed input'(event, instance) {
        instance.state.set('hideCompleted', event.target.checked);
    },
    'click #refresh'(event, instance) {
        if (instance.state.get('hideCompleted')) {
            instance.state.set('hideCompleted', false);
            instance.state.set('hideCompleted', true);
        } else {
            instance.state.set('hideCompleted', true);
            instance.state.set('hideCompleted', false);
        }
    }
});

Meteor.methods({
    'check'(toCheck, msg){
        if (!toCheck){
            alert(msg);
        }
    }
});


