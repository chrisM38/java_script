import {Mongo} from 'meteor/mongo';
import {Meteor} from "meteor/meteor";

export const Tasks = new Mongo.Collection('tasks');

Meteor.methods({
    'task.insert'(text, priority, days, month, year) {

        Meteor.call('check', priority !== "", "You have no selected priority");
        Meteor.call('check', days.length !== 0, "You have no selected days");

        for (let day of days) {
            Tasks.insert({
                text, day, month, year, priority, checked: false,
            });
        }
    },
    'task.remove'(taskId) {
        Tasks.remove(taskId);
    },
    'task.update.checked'(taskId, checked){

        Tasks.update(taskId, {
            $set: {checked: checked}
        });
    },
    'task.update.text'(taskId, text){

        Tasks.update(taskId, {
            $set: {text: text}
        });
    },
    'check'(toCheck, msg){
        if (!toCheck){
            throw new Meteor.Error("wrong-argument", msg);
        }
    }
});
