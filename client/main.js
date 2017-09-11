import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Posts } from '../imports/api/posts.js';

// register events
Template.register.events({
    'submit form': function(event){
        event.preventDefault();
        var email = $('[name=email]').val();
        var password = $('[name=password]').val();
        Accounts.createUser({
            email: email,
            password: password
        });
        Router.go('/forum');
    }
});

//login events
Template.login.events({
    'submit form': function(event){
        event.preventDefault();
        var email = $('[name=email]').val();
        var password = $('[name=password]').val();
        Meteor.loginWithPassword(email, password);
        Router.go('/forum');
    }
});

//forum config
Template.forum.events({
    'click .logout': function(event){
        event.preventDefault();
        Meteor.logout();
        Router.go('login');
    }
});

Template.forum.onCreated(function bodyOnCreated() {
	Meteor.subscribe('posts');
})

Template.forum.helpers({
	posts() {
		return Posts.find({}, { sort: { createdAt: -1 } });
	},
	whoOwner() {
		return Meteor.user().emails[0].address;
	}
});

Template.forum.events({
	'submit .new-post'(event) {
		event.preventDefault();
		const target = event.target;
		const text = target.text.value;

		Meteor.call('posts.insert', text);
		target.text.value = '';
	},
})


//post config
Template.post.helpers({
  isOwner() {
    return this.owner === Meteor.userId();
  },
});

Template.post.events({
	'click .delete'() {
		Meteor.call('posts.remove', this._id);
	},
});

//routes

Router.route('/register');

Router.route('/login');

Router.route('/forum');

Router.configure({
  layoutTemplate: 'main'
});

Router.route('/', function () {
  this.redirect('/login');
});
