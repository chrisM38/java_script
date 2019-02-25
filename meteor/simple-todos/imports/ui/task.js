import { Template } from 'meteor/templating';
import {ReactiveDict} from "meteor/reactive-dict";

import './task.html';
import {Meteor} from "meteor/meteor";

Template.task.onCreated(function bodyOnCreated() {
    this.noReadonly = new ReactiveDict();
});

Template.task.helpers({
    readonly(){
        const instance = Template.instance();
        if (!instance.noReadonly.get('readonly')) {
            return "readonly";
        }else{return "";}
    }
});


Template.task.events({
    'click .toggle-checked'() {
        Meteor.call('task.update.checked',this._id,! this.checked);
    },
    'click .delete'() {
        Meteor.call('task.remove',this._id);
    },
    'click .edit'(event,instance) {
        instance.noReadonly.set('readonly', true);

    },
    'submit .textForm'(event, instance) {
        event.preventDefault();

        const target = event.target;
        const text = target.text.value;

        Meteor.call('task.update.text',this._id,text);

        instance.noReadonly.set('readonly', false);
        alert("Your element has been changed");
    }
});