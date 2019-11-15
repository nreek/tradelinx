import React, { Fragment, PureComponent } from 'react';
import Accordion from '../../../elements/Accordion';

class HelpAnswer extends PureComponent {
  render() {
    return (
      <Accordion
        className="help-answer-container"
        accordionButton={(
          <Fragment>
            <div className="question">{this.props.question}</div>
          </Fragment>
)}
      >
        <div className="answer">{this.props.children}</div>
      </Accordion>
    );
  }
}

export default HelpAnswer;
