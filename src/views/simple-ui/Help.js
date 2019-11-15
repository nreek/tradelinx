import React, { PureComponent } from 'react';
import Scrollchor from 'react-scrollchor';
import HelpAnswer from './help/HelpAnswer';
import SimpleUiWrapper from './SimpleUiWrapper';

class Help extends PureComponent {
  constructor() {
    super();

    this.questionList = [
      {
        question: `${_t('How do I buy Bitcoin?', 'HELP.QUESTION_ONE')}`,
        answer: (
          <ol>
            <li>{_t('"Buy/Sell"', 'HELP.QUESTION_ONE_ANSWER_ONE')}</li>
            <li>{_t('Select the amount you wish to buy', 'HELP.QUESTION_ONE_ANSWER_TWO')}</li>
            <li>{_t('Choose the wallet you want to fund', 'HELP.QUESTION_ONE_ANSWER_THREE')}</li>
            <li>{_t('Choose your funding method', 'HELP.QUESTION_ONE_ANSWER_FOUR')}</li>
            <li>{_t('Confirm your order and click "Buy"', 'HELP.QUESTION_ONE_ANSWER_FIVE')}</li>
          </ol>
        ),
      },
      {
        question: `${_t('How do I sell Bitcoin?', 'HELP.QUESTION_TWO')}`,
        answer: (
          <ol>
            <li>{_t('Go the "Buy/Sell"', 'HELP.QUESTION_TWO_ANSWER_ONE')}</li>
            <li>{_t('Select the "Sell Bitcoin" tab ', 'HELP.QUESTION_TWO_ANSWER_TWO')}</li>
            <li>{_t('Choose the amount you want to sell', 'HELP.QUESTION_TWO_ANSWER_THREE')}</li>
            <li>{_t('Choose the wallet to sell from', 'HELP.QUESTION_TWO_ANSWER_FOUR')}</li>
            <li>{_t('Choose the account to fund', 'HELP.QUESTION_TWO_ANSWER_FIVE')}</li>
            <li>{_t('Confirm your order and click "Sell"', 'HELP.QUESTION_TWO_ANSWER_SIX')}</li>
          </ol>
        ),
      },
      {
        question: `${_t('How do I send Bitcoin?', 'HELP.QUESTION_THREE')}`,
        answer: (
          <ol>
            <li>{_t('Click on "Send/Request"', 'HELP.QUESTION_THREE_ANSWER_ONE')}</li>
            <li>{_t('Enter the amount to send', 'HELP.QUESTION_THREE_ANSWER_TWO')}</li>
            <li>{_t("Enter the recipient's Bitcoin or email address", 'HELP.QUESTION_THREE_ANSWER_THREE')}</li>
            <li>{_t('Add a note', 'HELP.QUESTION_THREE_ANSWER_FOUR')}</li>
            <li>{_t('Click "Send Bitcoin"', 'HELP.QUESTION_THREE_ANSWER_FIVE')}</li>
          </ol>
        ),
      },
      {
        question: `${_t('How do I Request Bitcoin?', 'HELP.QUESTION_FOUR')}`,
        answer: (
          <ol>
            <li>Click on "Send/Request"</li>
            <li>{_t('Click on the "Request Bitcoin" tab', 'HELP.QUESTION_FOUR_ANSWER_ONE')}</li>
            <li>{_t('Enter the amount to request', 'HELP.QUESTION_FOUR_ANSWER_TWO')}</li>
            <li>{_t("Enter the sender's Bitcoin or email address", 'HELP.QUESTION_FOUR_ANSWER_THREE')}</li>
            <li>{_t('Add a note', 'HELP.QUESTION_FOUR_ANSWER_FOUR')}</li>
            <li>{_t('Click "Request Bitcoin"', 'HELP.QUESTION_FOUR_ANSWER_FIVE')}</li>
          </ol>
        ),
      },
      {
        question: `${_t('How do I deposit money into my account?', 'HELP.QUESTION_FIVE')}`,
        answer: (
          <ol>
            <li>{_t('Click on "Deposit/Withdraw" link', 'HELP.QUESTION_FIVE_ANSWER_ONE')}</li>
            <li>{_t('Click on the "Deposit" button for the account you wish to deposit funds to', 'HELP.QUESTION_FIVE_ANSWER_TWO')}</li>
            <li>{_t('Fill up the short form', 'HELP.QUESTION_FIVE_ANSWER_THREE')}</li>
            <li>{_t('Click Submit', 'HELP.QUESTION_FIVE_ANSWER_FOUR')}</li>
          </ol>
        ),
      },
      {
        question: `${_t('How do I deposit Bitcoin into my account?', 'HELP.QUESTION_SIX')}`,
        answer: (
          <ol>
            <li>{_t('Click on "Deposit/Withdraw" link', 'HELP.QUESTION_SIX_ANSWER_ONE')}</li>
            <li>{_t('Click on the "Deposit" button for the Bitcoin account you wish to deposit funds to', 'HELP.QUESTION_SIX_ANSWER_TWO')}</li>
            <li>{_t('Select the Bitcoin address to send Bitcoin to', 'HELP.QUESTION_SIX_ANSWER_THREE')}</li>
            <li>{_t('Enter or Scan the Bitcoin address into your wallet and submit', 'HELP.QUESTION_SIX_ANSWER_FOUR')}</li>
          </ol>
        ),
      },
      {
        question: `${_t('What is the future of Bitcoin', 'HELP.QUESTION_SEVEN')}`,
        answer: (
          <p>
            {_t(`Bitcoin is a ground-breaking protocol, capable of changing how we
            buy and sell goods and even more, including the way we vote,
            identify ourselves, support causes, and have a huge impact on the
            world economy. We are at the bringe if incredible innovations.`,
            'HELP.QUESTION_SEVEN_ANSWER_ONE')}
          </p>
        ),
      },
      {
        question: `${_t('Can I use Bitcoin anonymously?', 'HELP.QUESTION_EIGHT')}`,
        answer: (
          <p>
            {_t(`It is not completely anonymous, but offers a great level of privacy
            together with transparency. It is not as anonymous as hard-cash, but
            its significantly more than credit card or bank transactions. Also,
            there are tools available and under development that promote privacy
            through Bitcoin, as well as technologies to protect against
            financial corruption and voting systems.`,
            'HELP.QUESTION_EIGHT_ANSWER_ONE')}
          </p>
        ),
      },
      {
        question: `${_t('Can I walk into a store and buy using Bitcoin?', 'HELP.QUESTION_NINE')}`,
        answer: (
          <p>
            {_t(`Yes. Real stores are starting to accept Bitcoin as a payment
            currency, and its number increases by the day. Many online services
            offer convenient applications for both the consumer and the store to
            buy and sell very easily using Bitcoin. Now you can find many ATMs
            selling Bitcoin, but the number of 2-way ATMs (the ones that sell
            and buy) is increasing.`,
            'HELP.QUESTION_NINE_ANSWER_ONE')}
          </p>
        ),
      },
      {
        question: `${_t('What is Bitcoin Mining?', 'HELP.QUESTION_TEN')}`,
        answer: (
          <p>
            {_t(`Similar to gold mining, Bitcoin mining is the process by which you
            digitally dig for Bitcoin, by running special scripts with
            algorithmic equations and hash functions that verify transactions on
            the blockchain. This process allows the confirmation of
            transactions, and adds new Bitcoin to the blockchain, and as a
            reward the miner receives Bitcoin.`,
            'HELP.QUESTION_TEN_ANSWER_ONE')}
          </p>
        ),
      },
    ];
    this.t = 'HELP'; // Translation key
  }

  render() {
    return (
      <SimpleUiWrapper
        title="Help Center"
        pageHeader="Frequently Asked Questions"
        description="If the following does not provide you with the answer to your inquiry, don't hesitate to contact us, we will be glad to help you."
        translation={this.t}
        pageClass="help-center"
      >

        {this.questionList.map((_, i) => (
          <div key={i} id={`${i}`} name={`#${i}`}>
            <HelpAnswer question={_.question}>{_.answer}</HelpAnswer>
          </div>
        ))}
      </SimpleUiWrapper>
    );
  }
}

export default Help;
