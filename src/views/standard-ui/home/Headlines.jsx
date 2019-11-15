import React, { Component } from 'react';
import moment from 'moment';
import PerfectScrollbar from 'react-perfect-scrollbar';
import 'react-perfect-scrollbar/dist/css/styles.css';
import NewsArticle from './headlines/NewsArticle';

class Headlines extends Component {
  state = {
    articles: [],
    loadingArticles: false
  }

  async componentDidMount() {
    this.setState({ loadingArticles: true })
    try {
      // TODO: Use our service once it's implemented
      // ALSO TODO: make language configurable, like "lang=${this.props.currentLanguage}" or "lang=${this.props.config.lang.default}" or whatnot
      const res = await fetch('https://min-api.cryptocompare.com/data/v2/news/?lang=EN');
      const jsonRes = await res.json();
      if (jsonRes.Message = 'News list successfully returned') {
        this.setState({ articles: jsonRes.Data });
      }
    } catch (error) {
      console.log(error);
    } finally {
      this.setState({ loadingArticles: false })
    }
  }

  renderArticles = () => {
    const { articles } = this.state;
    
    return articles.map((article, index) => <NewsArticle article={article} key={index} />)
  }

  render() {
    return (
      <div className='headlines component'>
        <div className='component-header'>
          <h1>{_t('Headlines', 'HEADLINES.TITLE')}</h1>
        </div>
        <div className='component-content'>
          {this.state.loadingArticles ?
            <div className='loading-spinner'>
              <i className='fal fa-spinner fa-spin' />
              <p>{_t('Loading Headlines', 'HEADLINES.LOADING')}</p>
            </div>
          :
            <PerfectScrollbar className='articles-list'>
              {this.renderArticles()}
            </PerfectScrollbar>
          }
        </div>
      </div>
    )
  }
}

export default Headlines;