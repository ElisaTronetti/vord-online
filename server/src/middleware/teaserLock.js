let teaserLocks = [];

const DISCONNECT = "disconnect";
const TEASER_LOCK_ENTER = "teaser:lock:enter";
const TEASER_LOCK_LEAVE = "teaser:lock:leave";
const TEASER_LOCK_LIST = "teaser:lock:list";

// Handler called to broadcast when a change occurs in the lock list
// Useful for UI changes (enable / disable buttons...)
const emitTeaserLocksChange = socket => {
  socket.emit(TEASER_LOCK_LIST, teaserLocks);
};

// Handler called when a client attempts to lock a resource
// => Client passes the wanted "teaserId" to lock and a callback named "notifyLocked" as argument
// => Handler calls "notifyLocked" back with the lock information (already locked or not)
// => Handler adds the lock to the lock list if needed, and broadcasts lock change
const onTeaserLockEnter = (socket, clientId) => (
  { teaserId },
  notifyLocked
) => {
  const isTeaserLocked = Boolean(
    teaserLocks.find(lt => lt.teaserId === teaserId)
  );

  notifyLocked(isTeaserLocked);

  if (!isTeaserLocked) {
    teaserLocks.push({ clientId, teaserId });
    emitTeaserLocksChange(socket);
  }
};

// Handler called when a client leaves a resource
// => Client passes the "teaserId" to unlock
// => Handler removes the lock from this teaserId for this particular "clientId" (remind "mutex")
// => Handler broadcasts lock change if the teaser lock list has changed
const onTeaserLockLeave = (socket, clientId) => ({ teaserId }) => {
  const initialLength = teaserLocks.length;

  teaserLocks = teaserLocks.filter(
    lt => !(lt.teaserId === teaserId && lt.clientId === clientId)
  );

  if (teaserLocks.length !== initialLength) {
    emitTeaserLocksChange(socket);
  }
};

// Handler called when a client socket connection is broken (or when browser tab is closed)
// => Handler removes locks from the clientId (unique id (per tab) corresponding to socket connection)
// => Handler broadcasts lock change if the teaser lock list has changed
const onDisconnect = (socket, clientId) => () => {
  const initialLength = teaserLocks.length;

  teaserLocks = teaserLocks.filter(lt => !(lt.clientId === clientId));

  if (teaserLocks.length !== initialLength) {
    emitTeaserLocksChange(socket);
  }
};

// This function is responsible for the websocket event registration on all lock commands
// TEASER_LOCK_ENTER => P (Claim / Decrease)
// TEASER_LOCK_LEAVE & DISCONNECT => V (Release / Increase)
const teaserSocketLockHandler = socket => {
  socket.on("connection", client => {
    client.on(TEASER_LOCK_ENTER, onTeaserLockEnter(socket, client.id));
    client.on(TEASER_LOCK_LEAVE, onTeaserLockLeave(socket, client.id));
    client.on(DISCONNECT, onDisconnect(socket, client.id));
  });

  return socket;
};

module.exports = {
  teaserSocketLockHandler
}