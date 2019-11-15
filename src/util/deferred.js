/* This class does not extend Promise because Babel does not currently support
 * extending built-in classes.  When this capability does become available,
 * note that the then and catch handlers that update the state property in the
 * constructor must return Promises (super.then?) not Deferreds to avoid
 * infinite recursion by generating a Deferred which then generates 2 more
 * Deferreds in its constructor, which each generate 2 more Deferreds in their
 * constructors, etc.
*/
class Deferred {
  constructor(executor = (_) => {}) {
    const thatDeferred = this;

    this.promise = new Promise((resolve, reject) => {
      this.resolve = resolve;
      this.reject = reject;

      if (executor instanceof Function) {
        executor(resolve, reject);
      } else if (executor instanceof Promise) {
        executor.then(resolve, reject);
      }
    });

    // Chaining off a deferred returns a Deferred
    ['then', 'catch', 'finally'].forEach(
      method => (thatDeferred[method] = (...params) => new Deferred(
        thatDeferred.promise[method].apply(thatDeferred.promise, params),
      )),
    );

    this.state = Deferred.states.pending;
    this.promise.then(
      (_ => (this.state = Deferred.states.resolved)),
      (_ => (this.state = Deferred.states.rejected)),
    );

  }
}

Deferred.states = {};
Deferred.states.pending = Symbol('Deferred State: Pending');
Deferred.states.resolved = Symbol('Deferred State: Resolved');
Deferred.states.rejected = Symbol('Deferred State: Rejected');

// Copy Promise's static methods returning Deferreds instead
Object.getOwnPropertyNames(Promise)
  .filter(_ => Promise[_] instanceof Function)
  .forEach(
    method => (Deferred[method] = (...params) => new Deferred(Promise[method].apply(Promise, params))),
  );

export default Deferred;
