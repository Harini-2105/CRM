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

export interface Activity {
  id?: string;
  orgId: string;
  type: 'call' | 'email' | 'meeting' | 'note' | 'task';
  title: string;
  description: string;
  ownerId: string;
  linkedEntityType: 'lead' | 'contact' | 'deal' | 'company';
  linkedEntityId: string;
  date: any; // ISO string or timestamp
  createdAt: any;
}

const COLLECTION = 'activities';

export const activityService = {
  createActivity: async (activity: Omit<Activity, 'id' | 'createdAt'>) => {
    try {
      const docRef = await addDoc(collection(db, COLLECTION), {
        ...activity,
        createdAt: serverTimestamp(),
      });
      return docRef.id;
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, COLLECTION);
    }
  },

  updateActivity: async (id: string, activity: Partial<Activity>) => {
    try {
      const docRef = doc(db, COLLECTION, id);
      await updateDoc(docRef, activity);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `${COLLECTION}/${id}`);
    }
  },

  deleteActivity: async (id: string) => {
    try {
      const docRef = doc(db, COLLECTION, id);
      await deleteDoc(docRef);
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `${COLLECTION}/${id}`);
    }
  },

  subscribeToActivities: (orgId: string, callback: (activities: Activity[]) => void) => {
    const q = query(
      collection(db, COLLECTION),
      where('orgId', '==', orgId),
      orderBy('createdAt', 'desc')
    );

    return onSnapshot(q, (snapshot) => {
      const activities = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Activity[];
      callback(activities);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, COLLECTION);
    });
  },

  subscribeByEntity: (entityId: string, callback: (activities: Activity[]) => void) => {
    const q = query(
      collection(db, COLLECTION),
      where('linkedEntityId', '==', entityId),
      orderBy('createdAt', 'desc')
    );

    return onSnapshot(q, (snapshot) => {
      const activities = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Activity[];
      callback(activities);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, COLLECTION);
    });
  }
};
