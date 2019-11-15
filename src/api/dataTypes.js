export const timeInForce = {
  gtc: 'gtc', // Good till canceled
  gtd: 'gtd', // Good till date
  ioc: 'ioc', // Immediate or cancel
  fok: 'fok', // Fill or kill
  day: 'day', // Day till canceled
};

export const side = {
  buy: 'buy',
  sell: 'sell',
};

export const propertyDto = {
  key: '',
  value: '',
};

export const type = {
  market: 'market',
  limit: 'limit',
  stop: 'stop',
};

export const newOrderDto = {
  client_order_id: '', // Client-specific order identifier
  security_id: '', // Implementation-specific security identifier
  type: '', // String representation of the order type (see 'type')
  side: '', // Side of this order (see 'side')
  quantity: 0.0, // Quantity of this order
  time_in_force: '', // Time-in-force for this order (see 'timeInForce')
  price: 0.0, // 	Price of this order
  expire_time: 0, // Expiration time of this order
  submission_time: 0, // Time of new order submission by the client
  destination: '', // Destination where to send order. Must be one of security's available destinations. If missing, default destination will be used.
  text: '', // Arbitrary text associated with this order by the client.
  properties: [], // Order type-specific fields
};

export const orderEventDto = {
  average_price: '',
  cumulative_quantity: 0,
  destination: '',
  expire_time: 0,
  id: '',
  order_id: '',
  order_side: '',
  order_status: '',
  order_type: '',
  price: 0,
  quantity: 0,
  reason: null,
  remaining_quantity: '',
  security_id: '',
  sequence_number: 0,
  time_in_force: null,
  timestamp: null,
  trade_price: 0,
  trade_quantity: 0,
  type: '',
};

export const periodicity = {
  minute: 'minute',
  minute5: 'minute5',
  minute15: 'minute15',
  minute30: 'minute30',
  hour: 'hour',
  hour4: 'hour4',
  hour8: 'hour8',
  day: 'day',
  week: 'week',
  month: 'month',
};

export const historicalBarsRequestDto = {
  security_id: '', // Bar instrument
  periodicity: 'minute', // See periodicity
  start_time: 0, // Start of time range
  end_time: 1, // End of time range
};

export const orderEventsRequestDto = {
  start_time: 0,
};

// Manager types

export const newDepositDto = {
  currency_id: '',
  amount: '',
};

export const newWithdrawalDto = {
  currency_id: '',
  amount: '',
  address: '',
};
