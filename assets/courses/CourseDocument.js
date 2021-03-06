const React = require('react');
const Tag = require('./Tag.js');
import Cookies from 'js-cookie'

import {markdown} from 'markdown';
import moment from 'moment'
import PropTypes from 'prop-types';

import {UpvoteButton, DownvoteButton} from './Vote.js';

class CourseDocument extends React.Component{
    constructor(props) {
        super(props)
        this.vote_callback = this.vote_callback.bind(this)
    }

    state = {
        upvote_active: this.props.user_vote==1 || false,
        downvote_active: this.props.user_vote==-1 || false,
        upvotes: this.props.votes.upvotes || 0,
        downvotes: this.props.votes.downvotes || 0,
    }

    ready = () => this.props.is_ready
    editable = () => this.props.has_perm
    date = () => moment(this.props.date).format("D MMMM YYYY")
    edit_url = () => window.Urls.document_edit(this.props.id)
    reupload_url = () => window.Urls.document_reupload(this.props.id)
    url = () => window.Urls.document_show(this.props.id)
    icon = () => {
        if (this.ready()){
            return (<a href={this.url()} className="radius label tiny secondary">
                <i className="fi-page-copy round-icon big"></i>
            </a>);
        } else if (this.props.is_processing) {
            return <i className="fi-loop round-icon big"></i>;
        } else {
            return <i className="fi-save round-icon big"></i>;
        }
    }
    download_icon() {
        if (this.ready()){
            var url = window.Urls['document-pdf'](this.props.id)
        } else {
            var url = window.Urls['document-original'](this.props.id)
        }
        return (
            <a href={url} title="Télécharger" className="radius label tiny secondary">
                <i className="fi-download dark-grey"></i> Télécharger
            </a>
        )
    }
    edit_icon() {
        if (this.ready() && this.editable()){
            return (<a href={this.edit_url()} title="Éditer" className="radius label tiny secondary">
                <i className="fi-pencil dark-grey"></i> Editer
            </a>);
        }
    }
    reupload_icon() {
        if (this.ready() && this.editable()){
            return (<a href={this.reupload_url()} className="radius label tiny secondary">
                <i className="fi-page-add dark-grey" title="Ré-uploader"></i> Ré-uploader
            </a>);
        }
    }
    upvote_icon() {
        return (<UpvoteButton
                doc_id={this.props.id}
                num={this.state.upvotes}
                isActive={this.state.upvote_active}
                vote_callback={this.vote_callback}
            />);

    }
    downvote_icon() {
        return (<DownvoteButton
            doc_id={this.props.id}
            num={this.state.downvotes}
            isActive={this.state.downvote_active}
            vote_callback={this.vote_callback}
        />);
    }
    vote_callback() {
        $.get(window.Urls.document_detail(this.props.id), function (data) {
            this.setState({upvote_active: data.user_vote==1,
                            downvote_active: data.user_vote==-1,
                            upvotes: data.votes.upvotes,
                            downvotes: data.votes.downvotes});
        }.bind(this))
    }
    description() {
        var text = markdown.toHTML(this.props.description);
        if (text != ''){
            var wrap = {__html: text};
            return <p dangerouslySetInnerHTML={wrap} className="document-description"/>;
        }
        return '';
    }
    title() {
        if (this.ready()){
            return <a href={this.url()}>{this.props.name}</a>;
        }
        return this.props.name;
    }
    pages() {
        if (! this.ready()){
            return "En cours de traitement";
        }
        else if (this.props.pages == 1){
            return "1 page";
        }
        else if (this.props.is_unconvertible){
            return "";
        }
        return this.props.pages + " pages";
    }
    tags() {
        return this.props.tags.map(function(tag){
            return <Tag key={"tag"+tag.id} {...tag}/>
        });
    }
    render() {
        var tags = (
            <span><i className="fi-pricetag-multiple"></i> {this.tags()}</span>
        )
        return (<div className="row course-document">
            <div className="large-12 columns">
                <div className="panel">
                    <div className="right">
                        {this.download_icon()} {this.edit_icon()} {this.reupload_icon()}
                    </div>
                    <h5>
                        {this.title()}
                        <small> par {this.props.user.name}</small><br/>
                    </h5>
                    {this.description()}

                    <div className="right">
                            <i className="fi-star vote-color"></i> Votez :
                        &nbsp;
                        {this.upvote_icon()} {this.downvote_icon()}
                    </div>

                    <div className="course-content-last-line">
                        <i className="fi-page-filled"></i> {this.pages()}&nbsp;
                        <i className="fi-clock"></i> Uploadé le {this.date()}&nbsp;
                        {this.props.tags.length > 0 ? tags : ''}
                    </div>
                </div>
            </div>
        </div>);
    }
};

export default CourseDocument;
