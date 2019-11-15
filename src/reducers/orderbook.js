import types from '../actions/types';

// Helper function:
export const processBookLayer = (layer, orderbook) => {
  const transformLayer = rawLayer => ({
    quantity: rawLayer.quantity,
    // exchange_id: rawLayer.exchange_id,
    number_of_orders: rawLayer.number_of_orders,
    price: rawLayer.price,
  });

  const getLayerSide = (l) => {
    switch (l.side) {
      case 'buy':
        return 'bids';

      case 'sell':
        return 'asks';

      default:
        return '';
    }
  };

  const book = orderbook[getLayerSide(layer)];

  switch (layer.action) {
    case 'insert':
      book.splice(layer.level, 0, transformLayer(layer));
      break;

    case 'update':
      book[layer.level] = transformLayer(layer);
      break;

    case 'delete':
      book.splice(layer.level, 1);
      break;

    case 'delete_from':
      book.splice(layer.level, book.length - layer.level);
      break;

    case 'delete_through':
      book.splice(0, layer.level);
      break;

    case 'trade':
    default:
      // Do nothing here
      break;
  }
};

export const orderbook = (state = { bids: [], asks: [] }, action) => {
  const newBook = {
    bids: [],
    asks: [],
  };

  switch (action.type) {
    case types.user.changeInstrument:
      return newBook;

      // TODO: what about delete messages from App? - probably OK
    case types.state.refreshBook:
      if (action.layers.length > 0 && action.layers[0].exchange_id === action.exchange) {
        action.layers.forEach((layer) => {
          if (layer.exchange_id === action.exchange) {
            processBookLayer(layer, newBook);
          }
        });
        return newBook;
      }
      return state;

    case types.state.updateBook: {
      const book = {
        bids: state.bids.slice(),
        asks: state.asks.slice(),
      };
      action.updates.forEach((layer) => {
        if (layer.exchange_id === action.exchange) {
          processBookLayer(layer, book);
        }
      });
      return book;
    }

    default:
      return state;
  }
};
