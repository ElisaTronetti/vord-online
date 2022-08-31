const Utils = require("../controllers/shaDocUtils")

let documentLocks = [];
let currentSessions = [];

const DISCONNECT = "disconnect";
const DOCUMENT_LOCK_ENTER = "document:lock:enter";
const DOCUMENT_LOCK_LEAVE = "document:lock:leave";
const DOCUMENT_UNLOCK_NOTIFICATION = "document:unlock:notification";
const DOCUMENT_SHARE_NOTIFICATION = "document:share:notification";
const DOCUMENT_SHARE = "document:share";
const USER_REGISTER = "user:register";
const USER_LOGOUT = "user:logout";

function getDocumentLocks() {
  return documentLocks;
}

const onLogin = (socketId) => ({ userId }) => {
  currentSessions.push({ userId, socketId });
}

const onLogout = (socket, clientId) => () => {
  const oldDocumentLocks = [...documentLocks];
  // Remove the user from the current session
  currentSessions = currentSessions.filter(x => !(x.socketId === clientId));
  // Check if with the logout a document has been unlocked
  const unlockedDocument = oldDocumentLocks.find(ld => ld.clientId === clientId);
  if (unlockedDocument !== undefined) {
    // Update documents lock data structure
    documentLocks = documentLocks.filter(ld => (ld.documentId === unlockedDocument.documentId && ld.clientId !== unlockedDocument.clientId))
    emitDocumentLocksChange(socket, clientId, unlockedDocument.documentId);
  }
}

// Handler called to send notification when a change occurs in the lock list
const emitDocumentLocksChange = (socket, clientId, unlockedDocument) => {
  Utils.getSharedDocument(unlockedDocument).then((sharedDocument) => {
    const sharedGroup = sharedDocument.sharedGroup.map(member => member._id.toString());
    // Find olny the user in the current session (actually online)
    const notificationGroup = currentSessions.filter(user => sharedGroup.includes(user.userId) && user.socketId !== clientId);
    notificationGroup.forEach(member => {
      socket.to(member.socketId).emit(DOCUMENT_UNLOCK_NOTIFICATION, 'Document ' + sharedDocument.title + ' unlocked')
    });
  });
}

// Handler called when a client attempts to lock a resource
const onDocumentLockEnter = (clientId) => (
  { documentId },
  notifyLocked
) => {
  const isDocumentLocked = Boolean(documentLocks.find(ld => ld.documentId === documentId));
  // Client callback
  notifyLocked(isDocumentLocked);
  if (!isDocumentLocked) {
    // Update document lock data structure
    documentLocks.push({ clientId, documentId });
  }
}

// Handler called when a client leaves a resource
const onDocumentLockLeave = (socket, clientId) => ({ documentId }) => {
  const oldDocumentLocks = [...documentLocks];
  // Check if there actually is a document locked by the requesting user
  const unlockedDocument = oldDocumentLocks.find(ld => ld.documentId === documentId && ld.clientId === clientId);
  if (unlockedDocument !== undefined) {
    // Remove from locks the document
    documentLocks = documentLocks.filter(ld => (ld.documentId === unlockedDocument.documentId && ld.clientId !== unlockedDocument.clientId))
    emitDocumentLocksChange(socket, clientId, unlockedDocument.documentId);
  }
}

// Handler called when a client socket connection is broken (or when browser tab is closed)
const onDisconnect = (socket, clientId) => () => {
  const oldDocumentLocks = [...documentLocks];
  // Remove the user from the current session
  currentSessions = currentSessions.filter(x => !(x.socketId === clientId));
    // Check if with the disconnection a document has been unlocked
  const unlockedDocument = oldDocumentLocks.find(ld => ld.clientId === clientId);
  if (unlockedDocument !== undefined) {
    // Update document locks data structure
    documentLocks = documentLocks.filter(ld => (ld.documentId === unlockedDocument.documentId && ld.clientId !== unlockedDocument.clientId))
    emitDocumentLocksChange(socket, clientId, unlockedDocument.documentId);
  }
}

// Handler called when a client is sharing a document with another user
const onDocumentShare = (socket) => ({ documentId, sharedEmails }) => {
  Utils.getSharedDocument(documentId).then((sharedDocument) => {
    sharedEmails.forEach((email) => {
      // Find the user id from the email obtained by the client
      Utils.getUserId(email).then((userId) => {
        // Find the socket id of the client (possible only if the user is online)
        const userSocket = currentSessions.find(element => element.userId === userId.toString())
        if(userSocket !== undefined) {
          // Send notification message
          socket.to(userSocket.socketId).emit(DOCUMENT_SHARE_NOTIFICATION, 'Document ' + sharedDocument.title + ' has been shared with you')
        }
      })
    })
  });
}

// This function is responsible for the websocket event registration on all lock commands
const socketHandler = socket => {
  socket.on("connection", client => {
    client.on(DOCUMENT_LOCK_ENTER, onDocumentLockEnter(client.id));
    client.on(DOCUMENT_LOCK_LEAVE, onDocumentLockLeave(socket, client.id));
    client.on(DISCONNECT, onDisconnect(socket, client.id));
    client.on(USER_REGISTER, onLogin(client.id));
    client.on(USER_LOGOUT, onLogout(socket, client.id));
    client.on(DOCUMENT_SHARE, onDocumentShare(socket))
  });
  return socket;
}

module.exports = {
  socketHandler,
  getDocumentLocks
}