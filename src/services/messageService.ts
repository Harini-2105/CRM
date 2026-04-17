import { 
  collection, 
  addDoc, 
  updateDoc, 
  doc, 
  deleteDoc, 
  query, 
  where, 
  onSnapshot, 
  orderBy,
  Timestamp,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../firebase';

export interface Message {
  id?: string;
  threadId: string;
  senderId: string;
  senderName: string;
  text: string;
  createdAt?: any;
  type: 'incoming' | 'outgoing';
  orgId: string;
}

export interface Thread {
  id?: string;
  name: string;
  company: string;
  lastMsg: string;
  lastMsgAt: any;
  unreadCount: number;
  status: 'Online' | 'Offline';
  orgId: string;
  participantIds: string[];
}

const THREADS_COLLECTION = 'threads';
const MESSAGES_COLLECTION = 'messages';

export const messageService = {
  subscribeToThreads: (orgId: string, callback: (threads: Thread[]) => void) => {
    const q = query(
      collection(db, THREADS_COLLECTION),
      where('orgId', '==', orgId),
      orderBy('lastMsgAt', 'desc')
    );
    return onSnapshot(q, (snapshot) => {
      const threads = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Thread));
      callback(threads);
    });
  },

  subscribeToMessages: (threadId: string, callback: (messages: Message[]) => void) => {
    const q = query(
      collection(db, MESSAGES_COLLECTION),
      where('threadId', '==', threadId),
      orderBy('createdAt', 'asc')
    );
    return onSnapshot(q, (snapshot) => {
      const messages = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Message));
      callback(messages);
    });
  },

  sendMessage: async (message: Omit<Message, 'id' | 'createdAt'>) => {
    await addDoc(collection(db, MESSAGES_COLLECTION), {
      ...message,
      createdAt: serverTimestamp()
    });

    // Update thread last message
    const threadRef = doc(db, THREADS_COLLECTION, message.threadId);
    await updateDoc(threadRef, {
      lastMsg: message.text,
      lastMsgAt: serverTimestamp()
    });
  },

  createThread: async (thread: Omit<Thread, 'id' | 'lastMsgAt'>) => {
    const docRef = await addDoc(collection(db, THREADS_COLLECTION), {
      ...thread,
      lastMsgAt: serverTimestamp()
    });
    return docRef.id;
  }
};
