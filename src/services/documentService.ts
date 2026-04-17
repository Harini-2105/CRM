import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  where, 
  onSnapshot,
  orderBy,
  serverTimestamp
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';

export interface DocumentRecord {
  id?: string;
  orgId: string;
  name: string;
  category: string;
  type: string;
  size: string;
  url: string;
  ownerId: string;
  ownerName?: string;
  linkedEntityType: string;
  linkedEntityId?: string;
  status: string;
  createdAt?: any;
  updatedAt?: any;
}

const COLLECTION = 'documents';

export const documentService = {
  createDocument: async (document: Omit<DocumentRecord, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const docRef = await addDoc(collection(db, COLLECTION), {
        ...document,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      return docRef.id;
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, COLLECTION);
    }
  },

  updateDocument: async (id: string, data: Partial<DocumentRecord>) => {
    try {
      const docRef = doc(db, COLLECTION, id);
      await updateDoc(docRef, {
        ...data,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `${COLLECTION}/${id}`);
    }
  },

  deleteDocument: async (id: string) => {
    try {
      const docRef = doc(db, COLLECTION, id);
      await deleteDoc(docRef);
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `${COLLECTION}/${id}`);
    }
  },

  subscribeToDocuments: (orgId: string, callback: (documents: DocumentRecord[]) => void) => {
    const q = query(
      collection(db, COLLECTION),
      where('orgId', '==', orgId),
      orderBy('updatedAt', 'desc')
    );

    return onSnapshot(q, (snapshot) => {
      const documents = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as DocumentRecord[];
      callback(documents);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, COLLECTION);
    });
  }
};
