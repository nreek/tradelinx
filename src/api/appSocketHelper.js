import { Client } from '@stomp/stompjs';
import v1 from 'uuid/v1';
import Deferred from '../util/deferred';
import trackTabActivity from '../util/trackTabActivity';

let undefined;


// TODO: use ReliableWebSocket w/ Client.webSocketFactory? Assume Stomp impl has no back-off, etc.
class AppSocketHelper {
  constructor(auth, host, useSsl = true, apiVersion = 'v1', debug = true, websocket = 'websocket', delay = 5000) {
    let ready = new Deferred();
    let nonce = 1;
    const getNonce = () => {
      nonce += 1;
      return nonce;
    };
    let tokens;
    auth.tokens.subscribe((t) => {
      tokens = t;
    });
    const protocol = useSsl ? 'wss' : 'ws';
    const url = `${protocol}://${host}/${websocket}/${apiVersion}`;
    const responseMap = new Map();
    const client = new Client({
      brokerURL: url,
      reconnectDelay: delay,
      debug: debug ? str => console.log(str) : () => {},
    });

    const subscribeResponses = () => client.subscribe(
      `/user/${apiVersion}/responses`,
      ({ body, headers }) => {
        const msg = body ? JSON.parse(body) : null;
        const msgId = headers['correlation-id'];
        const deferred = responseMap.get(msgId);
        if (deferred !== undefined) {
          deferred.resolve(msg);
        }
      },
      { 'X-Deltix-Nonce': `${getNonce()}` },
    );

    this.connect = (connectTokens = undefined, connectCallback = undefined) => {
      let connectionAttempts = 0;
      trackTabActivity(
        () => client.activate(),
        () => client.deactivate(),
        'mainSocket'
      );
      const oldReady = ready;
      ready = new Deferred();
      if (oldReady.state === Deferred.states.pending) {
        ready.then(val => oldReady.resolve(val), err => oldReady.reject(err));
      }

      if (connectTokens !== undefined) {
        tokens = connectTokens;
      }

      client.beforeConnect = () => {
        if (tokens.token_expires && tokens.token_expires < new Date().getTime()) {
          return auth.refresh(tokens.refresh_token)
            .then((newTokens) => {
              client.connectHeaders = { Authorization: `${newTokens.access_token}` };
            })
            .catch(err => {
              ready.reject(err);
            });
        }
        client.connectHeaders = { Authorization: `${tokens.access_token}` };
      };

      client.onConnect = (frame) => {
        if (typeof connectCallback === 'function') {
          connectCallback();
        }

        switch (frame.command) {
          case 'CONNECTED':
            console.log('Socket connected');
            responseMap.clear();
            subscribeResponses();
            ready.resolve(tokens);
            break;

          case 'ERROR':
            ready.reject(frame.headers);
            break;

          default:
            break;
        }
      };

      client.onStompError = (frame) => {
        console.log(`Stomp error: ${frame}`);
        client.deactivate();
        ready.reject(frame);
      };

      client.onWebSocketError = (event) => {
        console.log(`Socket error: ${event}`);
        connectionAttempts++;
        if (connectionAttempts >= 5) {
          ready.reject(event);
          client.deactivate();
        }
      };

      client.onWebSocketClose = (closeEvent) => {
        console.log(`Socket close: ${closeEvent}`);
      };

      client.activate();
      return ready;
    };

    this.disconnect = () => {
      client.deactivate();
    };

    // TODO: connection checking before subscribe/send?
    this.subscribeToEndpointTemplate = endpoint => onMessage => ready.then(() => {
      client.subscribe(
        `/user/${apiVersion}/${endpoint}`,
        ({ body }) => onMessage(JSON.parse(body)),
        { 'X-Deltix-Nonce': `${getNonce()}` },
      );
    });


    this.sendToEndpointTemplate = endpoint => (headers = {}, body = '') => ready.then(() => {
      const bodyStr = typeof body === 'string' ? body : JSON.stringify(body);
      const uuid = v1();
      client.publish({
        destination: `/app/${apiVersion}/${endpoint}`,
        body: bodyStr,
        headers: Object.assign({}, headers, { 'X-Deltix-Nonce': getNonce(), 'correlation-id': uuid }),
      });
      const deferred = new Deferred();
      responseMap.set(uuid, deferred);
      return deferred;
    });
  }

  static unsubscribe(subscription) {
    if (subscription && typeof subscription.unsubscribe === 'function') {
      subscription.unsubscribe();
    }
  }
}

export default AppSocketHelper;
