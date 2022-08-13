let documentLocks = [];

const DISCONNECT = "disconnect";
const DOCUMENT_LOCK_ENTER = "document:lock:enter";
const DOCUMENT_LOCK_LEAVE = "document:lock:leave";
const DOCUMENT_LOCK_LIST = "document:lock:list";

function getDocumentLocks(){
  return documentLocks
}
// Handler called to broadcast when a change occurs in the lock list
// Useful for UI changes (enable / disable buttons...)
const emitDocumentLocksChange = socket => {
  socket.emit(DOCUMENT_LOCK_LIST, documentLocks);
};

// Handler called when a client attempts to lock a resource
// => Client passes the wanted "documentId" to lock and a callback named "notifyLocked" as argument
// => Handler calls "notifyLocked" back with the lock information (already locked or not)
// => Handler adds the lock to the lock list if needed, and broadcasts lock change
const onDocumentLockEnter = (socket, clientId) => (
  { documentId },
  notifyLocked
) => {
  const isDocumentLocked = Boolean(
    documentLocks.find(ld => ld.documentId === documentId)
  );

  notifyLocked(isDocumentLocked);

  if (!isDocumentLocked) {
    documentLocks.push({ clientId, documentId });
    emitDocumentLocksChange(socket);
  }
};

// Handler called when a client leaves a resource
// => Client passes the "documentId" to unlock
// => Handler removes the lock from this docuemntId for this particular "clientId" (remind "mutex")
// => Handler broadcasts lock change if the teaser lock list has changed
const onDocumentLockLeave = (socket, clientId) => ({ documentId }) => {
  const initialLength = documentLocks.length;

  documentLocks = documentLocks.filter(
    ld => !(ld.documentId === documentId && ld.clientId === clientId)
  );

  if (documentLocks.length !== initialLength) {
    emitDocumentLocksChange(socket);
  }
};

// Handler called when a client socket connection is broken (or when browser tab is closed)
// => Handler removes locks from the clientId (unique id (per tab) corresponding to socket connection)
// => Handler broadcasts lock change if the document lock list has changed
const onDisconnect = (socket, clientId) => () => {
  const initialLength = documentLocks.length;

  documentLocks = documentLocks.filter(ld => !(ld.clientId === clientId));

  if (documentLocks.length !== initialLength) {
    emitDocumentLocksChange(socket);
  }
};

// This function is responsible for the websocket event registration on all lock commands
// DOCUMENT_LOCK_ENTER => P (Claim / Decrease)
// DOCUMENT_LOCK_LEAVE & DISCONNECT => V (Release / Increase)
const documentSocketLockHandler = socket => {
  socket.on("connection", client => {
    client.on(DOCUMENT_LOCK_ENTER, onDocumentLockEnter(socket, client.id));
    client.on(DOCUMENT_LOCK_LEAVE, onDocumentLockLeave(socket, client.id));
    client.on(DISCONNECT, onDisconnect(socket, client.id));
  });

  return socket;
};

module.exports = {
  documentSocketLockHandler,
  getDocumentLocks
}