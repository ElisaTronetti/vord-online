const Utils = require("../controllers/shaDocUtils")

let documentLocks = [];
let currentSessions = [];

const DISCONNECT = "disconnect";
const DOCUMENT_LOCK_ENTER = "document:lock:enter";
const DOCUMENT_LOCK_LEAVE = "document:lock:leave";
const DOCUMENT_UNLOCK_NOTIFICATION = "document:unlock:notification";
const USER_REGISTER = 'user:register';
const USER_LOGOUT = "user:logout";

const onLogin = (socketId) => ({ userId }) => {
  currentSessions.push({ userId, socketId });
};

const onLogout = (socket, clientId) => () => {
  const oldDocumentLocks = [...documentLocks];
  const oldSession = [...currentSessions];
  currentSessions = currentSessions.filter(x => !(x.socketId === clientId));
  const unlockedDocument = oldDocumentLocks.find(ld => ld.clientId === clientId);

  if (unlockedDocument !== undefined) {
    // update array
    documentLocks = documentLocks.filter(ld => (ld.documentId === unlockedDocument.documentId && ld.clientId !== unlockedDocument.clientId))
    emitDocumentLocksChange(socket, unlockedDocument.documentId, oldSession);
  }
};

function getDocumentLocks(){
  return documentLocks
}

// Handler called to broadcast when a change occurs in the lock list
// Useful for UI changes (enable / disable buttons...)
const emitDocumentLocksChange = (socket, unlockedDocument) => {
  Utils.getSharedDocument(unlockedDocument).then((sharedDocument) => {
    const sharedGroup = sharedDocument.sharedGroup.map(member => member._id.toString());
    const notificationGroup = currentSessions.filter(user => sharedGroup.includes(user.userId));
    notificationGroup.forEach(member => {
      socket.to(member.socketId).emit(DOCUMENT_UNLOCK_NOTIFICATION, 'Document ' + sharedDocument.title + ' unlocked')
    });
  });
};

// Handler called when a client attempts to lock a resource
// => Client passes the wanted "documentId" to lock and a callback named "notifyLocked" as argument
// => Handler calls "notifyLocked" back with the lock information (already locked or not)
// => Handler adds the lock to the lock list if needed, and broadcasts lock change
const onDocumentLockEnter = (clientId) => (
  { documentId },
  notifyLocked
) => {
  const isDocumentLocked = Boolean(
    documentLocks.find(ld => ld.documentId === documentId)
  );
  notifyLocked(isDocumentLocked);
  if (!isDocumentLocked) {
    documentLocks.push({ clientId, documentId });
  }
};

// Handler called when a client leaves a resource
// => Client passes the "documentId" to unlock
// => Handler removes the lock from this docuemntId for this particular "clientId" (remind "mutex")
// => Handler broadcasts lock change if the teaser lock list has changed
const onDocumentLockLeave = (socket, clientId) => ({ documentId }) => {
  const oldDocumentLocks = [...documentLocks];
  // find if there is an occurence in the array
  const unlockedDocument = oldDocumentLocks.find(ld =>  ld.documentId === documentId && ld.clientId === clientId);
  if (unlockedDocument !== undefined) {
    // update array
    documentLocks = documentLocks.filter(ld => (ld.documentId === unlockedDocument.documentId && ld.clientId !== unlockedDocument.clientId))
    emitDocumentLocksChange(socket, unlockedDocument.documentId, [...currentSessions]);
  }
};

// Handler called when a client socket connection is broken (or when browser tab is closed)
// => Handler removes locks from the clientId (unique id (per tab) corresponding to socket connection)
// => Handler broadcasts lock change if the document lock list has changed
const onDisconnect = (socket, clientId) => () => {
  const oldDocumentLocks = [...documentLocks];
  const oldSession = [...currentSessions];
  currentSessions = currentSessions.filter(x => !(x.socketId === clientId));
  const unlockedDocument = oldDocumentLocks.find(ld => ld.clientId === clientId);

  if (unlockedDocument !== undefined) {
    // update array
    documentLocks = documentLocks.filter(ld => (ld.documentId === unlockedDocument.documentId && ld.clientId !== unlockedDocument.clientId))
    emitDocumentLocksChange(socket, unlockedDocument.documentId);
  }
};

// This function is responsible for the websocket event registration on all lock commands
// DOCUMENT_LOCK_ENTER => P (Claim / Decrease)
// DOCUMENT_LOCK_LEAVE & DISCONNECT => V (Release / Increase)
const documentSocketLockHandler = socket => {
  socket.on("connection", client => {
    client.on(DOCUMENT_LOCK_ENTER, onDocumentLockEnter(client.id));
    client.on(DOCUMENT_LOCK_LEAVE, onDocumentLockLeave(socket, client.id));
    client.on(DISCONNECT, onDisconnect(socket, client.id));
    client.on(USER_REGISTER, onLogin(client.id));
    client.on(USER_LOGOUT, onLogout(socket, client.id));
  });

  return socket;
};

module.exports = {
  documentSocketLockHandler,
  getDocumentLocks
}