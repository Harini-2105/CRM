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

export interface Deal {
  id?: string;
  orgId: string;
  title: string;
  value: number;
  currency: string;
  pipelineId: string;
  stageId: string;
  status: 'open' | 'won' | 'lost';
  ownerId: string;
  contactId: string;
  companyId: string;
  createdAt: any;
  updatedAt: any;
}

const COLLECTION = 'deals';

export const dealService = {
  createDeal: async (deal: Omit<Deal, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const docRef = await addDoc(collection(db, COLLECTION), {
        ...deal,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      return docRef.id;
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, COLLECTION);
    }
  },

  updateDeal: async (id: string, deal: Partial<Deal>) => {
    try {
      const docRef = doc(db, COLLECTION, id);
      await updateDoc(docRef, {
        ...deal,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `${COLLECTION}/${id}`);
    }
  },

  deleteDeal: async (id: string) => {
    try {
      const docRef = doc(db, COLLECTION, id);
      await deleteDoc(docRef);
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `${COLLECTION}/${id}`);
    }
  },

  subscribeToDeals: (orgId: string, callback: (deals: Deal[]) => void) => {
    const q = query(
      collection(db, COLLECTION),
      where('orgId', '==', orgId),
      orderBy('createdAt', 'desc')
    );

    return onSnapshot(q, (snapshot) => {
      const deals = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Deal[];
      callback(deals);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, COLLECTION);
    });
  }
};
