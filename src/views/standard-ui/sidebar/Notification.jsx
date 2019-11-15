import React, { Component } from 'react';
import moment from 'moment';

class Notification extends Component {
  state = {
    showFullBody: false,
  }

  toggleFullBody = () => this.setState({ showFullBody: !this.state.showFullBody });

  render() {
    const { notification } = this.props;
    const { showFullBody } = this.state;

    let fullBody = notification.body;
    let truncatedBody = null;
    if (fullBody.length > 150) {
      truncatedBody = fullBody.split('').splice(0, 150).join('') + '…';
    }

    return (
      <div className='notification block'>
        <div className='notification-header'>
          <h2>{notification.title}</h2>
        </div>
        <div className='notification-body'>
          {truncatedBody && !showFullBody ? 
            <p>{truncatedBody}</p>
          :
            <p>{fullBody}</p>
          }
        </div>
        {truncatedBody &&
          <div className='show-more-link'>
            {showFullBody ?
              <h3 onClick={this.toggleFullBody}>{_t('Show Less', 'GENERIC.SHOW_LESS')}</h3>
            :
              <h3 onClick={this.toggleFullBody}>{_t('Show More', 'GENERIC.SHOW_MORE')}</h3>
            }
          </div>
        }
        <div className='notification-timestamp'>
          <p>{moment(notification.timestamp).format('h:mma, MMMM D YYYY')}</p>
        </div>
      </div>
    )
  }
}

export default Notification;