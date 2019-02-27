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
    active(){
        const instance = Template.instance();
        if (instance.state.get('hideCompleted')) {
            return "active";
        }else{return "";}
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

        Meteor.call('task.insert',text,priority,days,month,year, function(error){
            if (error && error.error === "wrong-argument") {
                alert(error);
            }else {
                target.text.value = '';
            }
        });
    },

    'click #hide-completed'(event, instance) {
        if (instance.state.get('hideCompleted')) {
            instance.state.set('hideCompleted', false);
        } else {
            instance.state.set('hideCompleted', true);
        }
    },
    'click #refresh'(event, instance) {
        if (instance.state.get('hideCompleted')) {
            instance.state.set('hideCompleted', false);
            instance.state.set('hideCompleted', true);
        } else {
            instance.state.set('hideCompleted', true);
            instance.state.set('hideCompleted', false);
        }
    },

    'click #delete-completed' () {

        for(let task of Tasks.find({checked: {$ne: false}, month: getMonth() + 1, year: getYear()})){
            Tasks.remove(task._id);
        }
    },

    'click #check-all' () {

        for(let task of Tasks.find({checked: {$ne: true}, month: getMonth() + 1, year: getYear()})){
            Tasks.update(task._id, {
                $set: { checked: ! task.checked }
            });
        }
    },

    'click #uncheck-all' () {

        for(let task of Tasks.find({checked: {$ne: false}, month: getMonth() + 1, year: getYear()})){
            Tasks.update(task._id, {
                $set: { checked: ! task.checked }
            });
        }
    }
});