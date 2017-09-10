import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';


export const Posts = new Mongo.Collection('posts');

if(Meteor.isServer) {
	Meteor.publish('posts', function postsPublication(){
		return Posts.find();
	})
}

Meteor.methods({
	'posts.insert'(text) {
		check(text, String);
		if(!Meteor.userId()) {
			throw new Meteor.Error('not-authorized');
		}
		Posts.insert({
			text,
			createdAt: new Date(),
			owner: Meteor.userId(),
			username: Meteor.user().emails[0].address,
		});
	},
	'posts.remove'(postId) {
		check(postId, String);
		const post = Posts.findOne(postId);
		if(post.owner !== Meteor.userId()) {
			throw new Meteor.Error('not-authorized');
		}
		Posts.remove(postId);
	},
})