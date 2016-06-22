"use strict";

var React = require('react');
var Router = require('react-router');
var AuthorForm = require('./authorForm');
var AuthorActions = require('../../actions/authorActions');
var AuthorStore = require('../../stores/authorStore');
var Toastr = require('toastr');

var ManageAuthorPage = React.createClass({
    mixins: [
        Router.Navigation
    ],
    statics: {
        willTransitionFrom: function(transition, component) {
            if(component.state.dirty && !confirm('Are you sure you want to leave?')) {
                transition.abort();
            }
        }
    },
    getInitialState: function() {
        return {
            author: {id: '', firstName: '', lastName: ''},
            errors: {},
            dirty: false
        };
    },
    componentWillMount: function() {
        var authorId = this.props.params.id;

        if(authorId) {
            this.setState({author: AuthorStore.getAuthorById(authorId)});
        }
    },
    authorFormIsValid: function() {
        var formIsValid = true;
        this.state.errors = {};

        if(this.state.author.firstName.length < 3) {
            this.state.errors.firstName = 'First Name field must be at least 3 characters';
            formIsValid = false;
        }

        if(this.state.author.lastName.length < 3) {
            this.state.errors.lastName = 'Last Name field must be at least 3 characters';
            formIsValid = false;
        }

        this.setState({errors: this.state.errors});
        return formIsValid;
    },
    setAuthorState: function(event) {
        this.setState({dirty: true});
        var field = event.target.name;
        var value = event.target.value;
        this.state.author[field] = value;
        return this.setState({author: this.state.author});
    },
    saveAuthor: function(event) {
        event.preventDefault();

        if (!this.authorFormIsValid()) {
            return;
        }

        //Might be better to have a saveAuthor method that will handle new and updated authors instead of this approach
        if(this.state.author.id) {
            AuthorActions.updateAuthor(this.state.author);
        }
        else {
            AuthorActions.createAuthor(this.state.author);
        }



        //Need to pass callback function as second parameter here in order for 'dirty' to have the lastest value when transitioning
        this.setState({dirty: false}, function() {
            Toastr.success(this.state.author.firstName + ' ' + this.state.author.lastName + ' added.');
            this.transitionTo('authors');
        });

    },
    render: function() {
        return (
            <AuthorForm author={this.state.author} onChange={this.setAuthorState} onSave={this.saveAuthor} errors={this.state.errors} />
        );
    }
});

module.exports = ManageAuthorPage;