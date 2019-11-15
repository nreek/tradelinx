class appManagerSocket {
  constructor(socketHelper) {
    // Endpoint definitions:
    // Subscription endpoints:
    const subscribeTransactions = socketHelper.subscribeToEndpointTemplate('transactions');

    // Send/Receive data endpoints:
    const incompleteTransactions = socketHelper.sendToEndpointTemplate('transactions/incomplete');
    const completeTransactions = socketHelper.sendToEndpointTemplate('transactions/complete');
    const depositDescription = socketHelper.sendToEndpointTemplate('transactions/deposit/description');
    const makeDeposit = socketHelper.sendToEndpointTemplate('transactions/deposit');
    const withdrawalDescription = socketHelper.sendToEndpointTemplate('transactions/withdraw/description');
    const makeWithdrawal = socketHelper.sendToEndpointTemplate('transactions/withdraw');

    this.connect = (tokens, connectCallback) => socketHelper.connect(tokens, connectCallback);
    this.disconnect = () => socketHelper.disconnect();

    this.subscribeTransactions = onMessage => subscribeTransactions(onMessage);
    this.incompleteTransactions = () => incompleteTransactions();
    this.completeTransactions = completeTransactionsRequest => completeTransactions({}, completeTransactionsRequest);
    this.depositDescription = descriptionRequest => depositDescription({}, descriptionRequest);
    this.makeDeposit = newDeposit => makeDeposit({}, newDeposit);
    this.withdrawalDescription = descriptionRequest => withdrawalDescription({}, descriptionRequest);
    this.makeWithdrawal = newWithdrawl => makeWithdrawal({}, newWithdrawl);
  }
}

export default appManagerSocket;
