import { Template } from 'meteor/templating';
import {ReactiveDict} from "meteor/reactive-dict";
import { Tasks } from '../api/tasks.js';

import './task.html';
import {months} from "../api/dates";
import {getMonth} from "./calendar";

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
        // Set the checked property to the opposite of its current value
        Tasks.update(this._id, {
            $set: { checked: ! this.checked }
        });
    },
    'click .delete'() {
        Tasks.remove(this._id);
    },
    'click .edit'(event,instance) {
        instance.noReadonly.set('readonly', true);

    },
    'submit .textForm'(event, instance) {
        event.preventDefault();

        const target = event.target;
        const text = target.text.value;

        Tasks.update(this._id, {
            $set: {text: text}
        });

        instance.noReadonly.set('readonly', false);
        alert("Your element has been changed");
    }
});