// indexedDBUtils.js
// Utility functions for managing IndexedDB databases

// Contact notifications database
const notificationsDbName = "nurenAIDatabase";
const notificationsStoreName = "contactNotifications";
const notificationsDbVersion = 1;

// Chat messages database
const chatDbName = "nurenAIChatDatabase";
const chatStoreName = "chatMessages";
const chatDbVersion = 1;

// Initialize the notifications database
export const initNotificationsDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(notificationsDbName, notificationsDbVersion);
    
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(notificationsStoreName)) {
        db.createObjectStore(notificationsStoreName, { keyPath: "contactId" });
      }
    };
    
    request.onsuccess = (event) => resolve(event.target.result);
    request.onerror = (event) => reject(event.target.error);
  });
};

// Get unread count for a specific contact
export const getContactUnreadCount = async (contactId) => {
  try {
    const db = await initNotificationsDB();
    const transaction = db.transaction([notificationsStoreName], "readonly");
    const store = transaction.objectStore(notificationsStoreName);
    const request = store.get(contactId.toString());
    
    return new Promise((resolve, reject) => {
      request.onsuccess = () => {
        resolve(request.result?.count || 0);
      };
      request.onerror = (event) => reject(event.target.error);
    });
  } catch (error) {
    console.error("Error getting contact unread count:", error);
    return 0;
  }
};

// Get all contact notification counts
export const getAllContactUnreadCounts = async () => {
  try {
    const db = await initNotificationsDB();
    const transaction = db.transaction([notificationsStoreName], "readonly");
    const store = transaction.objectStore(notificationsStoreName);
    const request = store.getAll();
    
    return new Promise((resolve, reject) => {
      request.onsuccess = () => {
        const contactCounts = {};
        request.result.forEach(item => {
          contactCounts[item.contactId] = item.count;
        });
        resolve(contactCounts);
      };
      request.onerror = (event) => reject(event.target.error);
    });
  } catch (error) {
    console.error("Error getting all contact unread counts:", error);
    return {};
  }
};

// Update a specific contact's unread count
// export const updateContactUnreadCount = async (contactId, count) => {
//   try {
//     const db = await initNotificationsDB();
//     const transaction = db.transaction([notificationsStoreName], "readwrite");
//     const store = transaction.objectStore(notificationsStoreName);
    
//     if (count > 0) {
//       store.put({ contactId: contactId.toString(), count });
//     } else {
//       store.delete(contactId.toString());
//     }
    
//     return new Promise((resolve, reject) => {
//       transaction.oncomplete = () => resolve();
//       transaction.onerror = (event) => reject(event.target.error);
//     });
//   } catch (error) {
//     console.error("Error updating unread count:", error);
//   }
// };

// Initialize the chat database
export const initChatDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(chatDbName, chatDbVersion);
    
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(chatStoreName)) {
        const store = db.createObjectStore(chatStoreName, { keyPath: "id" });
        // Create indexes for efficient querying
        store.createIndex("contactId", "contactId", { unique: false });
        store.createIndex("timestamp", "timestamp", { unique: false });
      }
    };
    
    request.onsuccess = (event) => resolve(event.target.result);
    request.onerror = (event) => reject(event.target.error);
  });
};

// Store a conversation for a contact
export const storeConversation = async (contactId, messages) => {
  try {
    const db = await initChatDB();
    const transaction = db.transaction([chatStoreName], "readwrite");
    const store = transaction.objectStore(chatStoreName);
    
    // First clear existing messages for this contact
    const index = store.index("contactId");
    const request = index.openKeyCursor(IDBKeyRange.only(contactId.toString()));
    
    request.onsuccess = (event) => {
      const cursor = event.target.result;
      if (cursor) {
        store.delete(cursor.primaryKey);
        cursor.continue();
      } else {
        // After clearing, add all messages with proper metadata
        messages.forEach(message => {
          const messageToStore = {
            ...message,
            id: message.id || `msg_${Date.now()}_${Math.random()}`,
            contactId: contactId.toString(),
            timestamp: message.timestamp || message.time || new Date().toISOString(),
            cachedAt: new Date().toISOString()
          };
          store.add(messageToStore);
        });
      }
    };
    
    return new Promise((resolve, reject) => {
      transaction.oncomplete = () => resolve();
      transaction.onerror = (event) => reject(event.target.error);
    });
  } catch (error) {
    console.error("Error storing conversation:", error);
  }
};

// Get cached conversation for a contact
export const getCachedConversation = async (contactId) => {
  try {
    const db = await initChatDB();
    const transaction = db.transaction([chatStoreName], "readonly");
    const store = transaction.objectStore(chatStoreName);
    const index = store.index("contactId");
    
    const request = index.getAll(IDBKeyRange.only(contactId.toString()));
    
    return new Promise((resolve, reject) => {
      request.onsuccess = () => {
        // Sort messages by timestamp
        const messages = request.result.sort((a, b) => {
          return new Date(a.timestamp) - new Date(b.timestamp);
        });
        resolve(messages);
      };
      request.onerror = (event) => reject(event.target.error);
    });
  } catch (error) {
    console.error("Error getting cached conversation:", error);
    return [];
  }
};

// Add a single message to the cache
export const addMessageToCache = async (contactId, message) => {
  try {
    const db = await initChatDB();
    const transaction = db.transaction([chatStoreName], "readwrite");
    const store = transaction.objectStore(chatStoreName);
    
    const messageToStore = {
      ...message,
      id: message.id || `msg_${Date.now()}_${Math.random()}`,
      contactId: contactId.toString(),
      timestamp: message.timestamp || message.time || new Date().toISOString(),
      cachedAt: new Date().toISOString()
    };
    
    store.add(messageToStore);
    
    return new Promise((resolve, reject) => {
      transaction.oncomplete = () => resolve();
      transaction.onerror = (event) => reject(event.target.error);
    });
  } catch (error) {
    console.error("Error adding message to cache:", error);
  }
};

// Clear all cached messages (for logout)
export const clearChatCache = async () => {
  try {
    const db = await initChatDB();
    const transaction = db.transaction([chatStoreName], "readwrite");
    const store = transaction.objectStore(chatStoreName);
    
    store.clear();
    
    return new Promise((resolve, reject) => {
      transaction.oncomplete = () => {
        console.log("Chat cache cleared successfully");
        resolve();
      };
      transaction.onerror = (event) => reject(event.target.error);
    });
  } catch (error) {
    console.error("Error clearing chat cache:", error);
  }
};

// Clear all databases (for complete logout)
export const clearAllDatabases = async () => {
  try {
    await clearChatCache();
    
    const db = await initNotificationsDB();
    const transaction = db.transaction([notificationsStoreName], "readwrite");
    const store = transaction.objectStore(notificationsStoreName);
    
    store.clear();
    
    return new Promise((resolve, reject) => {
      transaction.oncomplete = () => {
        console.log("All databases cleared successfully");
        resolve();
      };
      transaction.onerror = (event) => reject(event.target.error);
    });
  } catch (error) {
    console.error("Error clearing all databases:", error);
  }
};


// Update a specific contact's unread count
export const updateContactUnreadCount = async (contactId, count) => {

  try {
    if (contactId === undefined || contactId === null) {
      // console.log("Cannot update unread count: contactId is undefined or null");
      return;
    }

    const db = await initNotificationsDB();
    const transaction = db.transaction([notificationsStoreName], "readwrite");
    const store = transaction.objectStore(notificationsStoreName);
    
    if (count > 0) {
      store.put({ contactId: contactId.toString(), count });
    } else {
      // If count is zero, remove the entry from the store
      store.delete(contactId.toString());
    }
    
    return new Promise((resolve, reject) => {
      transaction.oncomplete = () => resolve();
      transaction.onerror = (event) => reject(event.target.error);
    });
  } catch (error) {
    console.error("Error updating unread count:", error);
  }
};