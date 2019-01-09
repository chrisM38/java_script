import _ from 'lodash';
import './style.css';
import Icon from './icon.png';

function component() {

    let image = document.createElement('div');

    // Add the image to our existing div.
    var myIcon = new Image();
    myIcon.src = Icon;
    image.appendChild(myIcon);
    image.classList.add('image');
    image.innerHTML += 'test';

    let element = document.createElement('div');

    // Lodash, now imported by this script
    element.innerHTML = _.join(['Hello', 'webpack'], ' ')
    element.classList.add('hello');

    return element, image;
}

document.body.appendChild(component());

var LIBRARY = [{
    key: "ISBN:9781449316853",
    authors: ["David Flanagan"],
    title: "JavaScript pocket reference",
    publish_date: "2012",
    star: 1
}, {
    key: "ISBN:9780321508928",
    authors: ["Michel Goossens"],
    title: "The LaTeX Graphics companion",
    publish_date: "2008",
    star: 2
}];

function Library() {

    let list = document.createElement("ul");
    for (let boock of LIBRARY) {
        let listItem = document.createElement("li");
        listItem.innerHTML = boock.title;
        list.appendChild(listItem);
    }
    return list;
}

document.getElementById("list").appendChild(Library());