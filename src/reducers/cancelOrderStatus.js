import { toast } from 'react-toastify';
import types from '../actions/types';
import { status } from '../constants';

export const cancelOrderStatus = (state = { status: status.pending }, action) => {
  switch (action.type) {
    case types.state.cancelOrderSuccess:
      toast.success(_t('Order {id} cancelled successfully', 'TOASTS.CANCEL_ORDER_SUCCESS', { id: action.orderId }));
      return { ...state, status: status.success };
    case types.state.cancelOrderError:
      toast.error(_t('Unable to cancel order: {message}', 'TOASTS.CANCEL_ORDER_FAILED', { message: action.message }));
      return { ...state, status: status.failed };
    default:
      return state;
  }
};
