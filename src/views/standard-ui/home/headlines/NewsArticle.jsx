import React, { Component } from 'react';
import moment from 'moment';

class NewsArticle extends Component {
  state = {
    showFullBody: false,
  }

  toggleFullBody = () => this.setState({ showFullBody: !this.state.showFullBody });

  render() {
    const { article } = this.props;
    const { showFullBody } = this.state;

    let fullBody = article.body;
    let renderedBody = '';
    if (fullBody.length > 100 && !showFullBody) {
      renderedBody = fullBody.split('').splice(0, 100).join('') + '…';
    } else {
      renderedBody = fullBody;
    }

    return (
      <article className='article'>
        <div className='image'>
          <img src={article.imageurl} />
        </div>
        <div className='title'>
          <h3>
            <a href={article.url} target='_blank'>
              {article.title}
            </a>
          </h3>
        </div>
        <div className='body'>
          <p dangerouslySetInnerHTML={{__html: renderedBody}} />
        </div>
        <div className='date'>
          <p>{moment(article.published_on * 1000).format('h:mma, MMMM D YYYY')}</p>
        </div>
      </article>
    )
  }
}

export default NewsArticle;