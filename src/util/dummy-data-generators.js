// test function to dynamically create fake dummy order data
// the parameter `rows` is the number of orders to be generated
function orderDataBuilder(rows) {
  const data = [];
  const types = [
    'Market Order',
    'Limit Order',
    'Stop Limit',
    'Stop Market',
    'Trailing Stop Market',
    'Trailing Stop Limit',
    'Fill Or Kill',
    'IOC',
    'Reserve Order',
  ];
  for (let i = 0; i < rows; i++) {
    const account = 'shift24';
    const instrument = 'MPCUSD';
    const orderId = 1234567;
    const executionId = 7654321;
    const side = (Math.random() > 0.5 ? 'buy' : 'sell');
    const type = types[Math.floor(Math.random() * types.length)];
    const quantity = Math.random().toFixed(8);
    const price = (8000 - Math.random() * 1000).toFixed(2);
    let total = (+price * +quantity);
    let fee;
    if (side === 'buy') {
      fee = `${(+quantity * 0.005).toFixed(8)} MPC`;
      total = total.toFixed(8);
    } else if (side === 'sell') {
      fee = `${(total * 0.005).toFixed(2)} USD`;
      total = total.toFixed(2);
    }
    const time = '2018-06-28 12:48 PM';
    const status = 'Pending';
    data.push({
      account,
      instrument,
      orderId,
      executionId,
      side,
      type,
      quantity,
      price,
      total,
      fee,
      time,
      status,
    });
  }

  return data;
}

function withdrawDataBuilder(rows) {
  const data = [];
  const statusList = [
    'Admin Processing',
    'Failed',
    'User Cancelled',
    'Complete',
  ];

  for (let i = 0; i < rows; i++) {
    const account = 'shift24';
    const product = Math.random() > 0.5 ? 'Bitcoin' : 'USD';
    const amount = (Math.floor(Math.random() * 10) + Math.random()).toFixed(8);
    const created = '2018-06-29 12:00 PM';
    const status = statusList[Math.floor(Math.random() * statusList.length)];
    data.push({
      account,
      product,
      amount,
      created,
      status,
    });
  }

  return data;
}

function tradeDataBuilder(rows) {
  const data = [];
  let timeAdder = 0;
  for (let i = 0; i < rows; i++) {
    const seed = Math.random();
    let direction;
    if (seed < 0.25) {
      direction = 'down';
    } else if (seed < 0.5) {
      direction = 'up';
    } else {
      direction = '';
    }
    const price = 7524.7 - (seed * 1000);
    const quantity = seed * 4;
    const tradeTime = new Date(Date.now() - timeAdder).toString();
    timeAdder += (Math.random() * 120) * 1000;
    data.push({
      direction, price, quantity, tradeTime,
    });
  }
  return data;
}

function reportDataBuilder(type, rows) {
  const data = [];
  const types = [
    'TradeActivity',
    'TransactionActivity',
    'TreasuryActivity',
  ];
  const frequencies = [
    'Hourly',
    'Daily',
    'Weekly',
    'Monthly',
    'Annual',
  ];
  for (let i = 0; i < rows; i++) {
    const seed = Math.random();
    const accounts = [];
    let payload;
    switch (type) {
      case 'pending':
        payload = {
          id: i,
          name: `onDemand ${types[Math.floor(seed * types.length)]} from 2018-07-16 to 2018-07-16`,
          status: `${seed > 0.7 ? 'Started' : 'NotStarted'}`,
        };
        break;
      case 'scheduled':
        payload = {
          id: i,
          type: types[Math.floor(seed * types.length)],
          frequency: frequencies[Math.floor(seed * frequencies.length)],
          accounts: seed > 0.6 ? ['shift24'] : seed < 0.4 ? ['shift25'] : ['shift24', 'shift25'],
          createdDate: '2018-07-16',
        };
        break;
      case 'previous':
        payload = {
          id: i,
          name: `onDemand ${types[Math.floor(seed * types.length)]} from 2018-07-16 to 2018-07-16`,
          createdDate: '2018-07-16',
        };
        break;
      default:
        break;
    }
    data.push(payload);
  }

  return data;
}

function notificationBuilder(num) {
  const notifications = [];
  let lastDate = Date.now();
  
  for (let i = 0; i < num; i++) {
    
    const notification = {
      title: 'Notification Title',
      body: 'The quick brown fox, named Lorem Ipsum, jumped over the lazy dog, named Dolor Sit Amet, who was a very good dog indeed.',
      timestamp: lastDate
    }

    if (Math.random() > 0.5) {
      notification.body += " And also here's some more information you should probably know: the weather tomorrow looks rather dreadful. Be sure to bring an umbrella."
    }

    notifications.push(notification)
    lastDate -= Math.ceil(Math.random() * 50000);
  }

  return notifications;
}

// generates a portfolio history to render in a Highcharts graph
function portfolioHistoryBuilder(currentValue, length = 31556952000, interval = 3600000) {
  let value = currentValue;
  
  const now = Date.now();
  const data = [[now, value]]

  // generates a data point (default: every hour for 1 year)
  for (let i = interval; i <= length; i += interval) {
    let valueChange = value * (Math.random() / 100);
    if (Math.random() > 0.5) {
      value += valueChange
    } else {
      value -= valueChange
    }

    let dataPoint = [(now - i), value];
    data.push(dataPoint)
  }

  return data;
}

export {
  orderDataBuilder, 
  withdrawDataBuilder, 
  tradeDataBuilder, 
  reportDataBuilder, 
  notificationBuilder,
  portfolioHistoryBuilder
};
