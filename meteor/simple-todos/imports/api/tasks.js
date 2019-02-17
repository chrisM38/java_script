import {Mongo} from 'meteor/mongo';
import {Meteor} from "meteor/meteor";

export const Tasks = new Mongo.Collection('tasks');

Meteor.methods({
    'task.insert'(text, priority, day, month, year) {

        Meteor.call('check', priority !== "", "You have no selected priority");
        Meteor.call('check', day.length !== 0, "You have no selected days");

        Tasks.insert({
            text, day, month, year, priority, checked : false,
        })
    },
    'check'(toCheck, msg){
        if (!toCheck){
            alert(msg);
        }
    }
});
