import { Template } from 'meteor/templating';

import { Tasks } from '../api/tasks.js';

import './task.html';

Template.task.helpers({
    readonly(){
        return {
            readonly: false
        };
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
    'click .edit'() {
        document.getElementsByClassName("text")[0];
    },
    'submit .text'(event) {
        event.preventDefault();

        const target = event.target;
        const text = target.text.value;
        console.log(text);

        Tasks.update(this._id, {
            $set: {text: text}
        });

        target.text.value = '';
    }
});