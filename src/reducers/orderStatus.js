import { toast } from 'react-toastify';
import types from '../actions/types';
import { errorHandler } from '../util/helpers';

export const orderStatus = (state = { orderEventTimeStamp: null, orderEventsFinished: false }, action) => {
  switch (action.type) {
    case types.state.setOrderPending:
      return { ...state, status: 'pending' };
    case types.state.setOrderAccepted:
      toast.success(
        _t('Order {id} placed successfully', 'TOASTS.ORDER_SUCCESS', { id: action.id }),
      );
      return { ...state, status: 'accepted' };
    case types.state.setOrderRejected:
      const { message, } = action;
      toast.error(_t('Order Failed', `${errorHandler(message)}`));
      
      return { ...state, status: 'rejected', message, };

    case types.state.orderEventsFinished:
      return { ...state, orderEventsFinished: action.payload };

    case types.state.updateOrderEventTimeStamp:
      return { ...state, orderEventTimeStamp: action.orderEventTimeStamp };

    default:
      return state;
  }
};
export const finishedLoadingOrders = state => state.orderStatus.orderEventsFinished;
export const orderEventTimeStamp = state => state.orderStatus.orderEventTimeStamp;
export const orderStatusString = state => state.orderStatus.status;
export default orderStatus;
