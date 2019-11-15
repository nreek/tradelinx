import * as rx from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ofType } from 'redux-observable';
import types from '../actions/types';
import { refreshOrderEvents, orderEventsFinished, updateOrderEventTimeStamp, connectingQueueAdd } from '../actions';
import { selectExchange } from '../reducers';
import { initDataType } from '../util';
import { orderEventDto } from '../api/dataTypes';

const loadOrderEvents = (action$, state$, { socket }) => action$.pipe(
  ofType(types.app.loadOrderEvents),
  rx.withLatestFrom(state$),
  rx.switchMap(([action, state]) => Observable.create(async (observer) => {
    observer.next(connectingQueueAdd(action));
    const exchange = selectExchange(state);
    let start_time = action.orderEventTimeStamp || 0;
    let allEvents = state.orderEvents || [];

    await socket.orderEvents({ start_time }).then((events) => {
      if (events.length === 0) {
        observer.next(orderEventsFinished(true));
      }
      const duplicateOrderCheck = compareOrderEvents(events, allEvents);
      if (duplicateOrderCheck.length === 0) {
        observer.next(orderEventsFinished(true));
      }
      const { timestamp = 0, } = events[events.length - 1] || {};
      start_time = timestamp;
      allEvents = [...state.orderEvents, ...events];
    });
    allEvents.flat().map(event => initDataType(orderEventDto, event));
    observer.next(refreshOrderEvents(allEvents, exchange));
    observer.next(updateOrderEventTimeStamp(start_time));
  })),
);

const compareOrderEvents = (events, allEvents) => {
  const filteredEvents = [];
  const flattenAllEvents = allEvents.flat();
  events.forEach((eventsObj) => {
    let eventDuplicate = false;
    flattenAllEvents.forEach((allEventsObj) => {
      if (eventsObj.order_id === allEventsObj.order_id) {
        eventDuplicate = true;
        return [];
      }
    });
    if (!eventDuplicate) {
      filteredEvents.push(eventsObj);
    }
  });
  return filteredEvents;
};

export default loadOrderEvents;
