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

export interface Workflow {
  id?: string;
  orgId: string;
  name: string;
  description: string;
  trigger: string;
  action: string;
  isActive: boolean;
  ownerId: string;
  createdAt: any;
}

const COLLECTION = 'workflows';

export const workflowService = {
  createWorkflow: async (workflow: Omit<Workflow, 'id' | 'createdAt'>) => {
    try {
      const docRef = await addDoc(collection(db, COLLECTION), {
        ...workflow,
        createdAt: serverTimestamp(),
      });
      return docRef.id;
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, COLLECTION);
    }
  },

  updateWorkflow: async (id: string, workflow: Partial<Workflow>) => {
    try {
      const docRef = doc(db, COLLECTION, id);
      await updateDoc(docRef, workflow);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `${COLLECTION}/${id}`);
    }
  },

  deleteWorkflow: async (id: string) => {
    try {
      const docRef = doc(db, COLLECTION, id);
      await deleteDoc(docRef);
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `${COLLECTION}/${id}`);
    }
  },

  subscribeToWorkflows: (orgId: string, callback: (workflows: Workflow[]) => void) => {
    const q = query(
      collection(db, COLLECTION),
      where('orgId', '==', orgId),
      orderBy('createdAt', 'desc')
    );

    return onSnapshot(q, (snapshot) => {
      const workflows = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Workflow[];
      callback(workflows);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, COLLECTION);
    });
  }
};
