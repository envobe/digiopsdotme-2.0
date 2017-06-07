import React from 'react';
import Axios from 'axios';
import Helmet from 'react-helmet';
import {Link, Redirect} from 'react-router-dom';
import TimeAgo from 'react-timeago';
import '../css/article.css';


const Close = () => {
	return (
		<div className="close">
		<Link to="/blog">X</Link>
		</div>
	);
}


class Article extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			loaded: false,
			article: null,
			error: false
		}
	}

	componentDidMount(){
		const a_id = this.props.match.params.id;
		this.fetchArticle(a_id);
	}

	fetchArticle(id){
		const endpoint = "http://digiops.me/blog/api/article/" + id;
		Axios.get(endpoint)
			.then((response) => {
				const arty = response.data;
				this.setState({
					loaded: true,
					article: arty
				})
			})
			.catch((err) => {
				this.setState({
					error: err
				})
			});
	}

	render() {
		let body = (<center><br />Loading...</center>);
		
		if (this.state.loaded){
			const article = this.state.article;
			const html = {__html: article.content}
			const d = new Date(article.posted_time);
			body = (
				<div>
				<Helmet>
				<title>{article.title} - digi0ps</title>
				<meta name="description" content={article.short} />
				<meta name="theme-color" content="#ffffff" />
				</Helmet>
				<h1 className="article-header center">{article.title}</h1>
				<div className="article-details">
				<small className="time">
				<TimeAgo date={d}></TimeAgo>
				</small>
				<small className="views">{article.views} Views</small>
				</div>
				<div className="article-body"
				dangerouslySetInnerHTML={html} />
				</div>
			);
		}
		else if (this.state.error){
			// If the article isn't found, redirect to 404 page
			body = <Redirect to="/article-not-found" push={false}/>
		}

		// Bug: While loading an article, .article doesn't fill the page.
		// Fix: If state isn't loaded, set .article height to page's height. If it gets loaded set it to auto.
		const style = {
			height: this.state.loaded?"auto":window.outerHeight
		}
		
		return(
			<div className="article" style={style}>
			<Close />
			{body}
			</div>
		);
	}
}

export default Article;
