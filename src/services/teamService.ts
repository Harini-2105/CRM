import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  Timestamp,
  getDocs,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../firebase';

export interface TeamMember {
  id?: string;
  uid: string;
  orgId: string;
  email: string;
  displayName: string;
  role: 'org_admin' | 'sales_manager' | 'account_executive' | 'sales_dev' | 'marketing' | 'customer_success';
  status: 'active' | 'in_meeting' | 'offline' | 'on_leave';
  dealsCount: number;
  winRate: string;
  quotaAttainment: string;
  lastActive?: any;
}

export const teamService = {
  subscribeToTeam: (orgId: string, callback: (members: TeamMember[]) => void) => {
    const q = query(
      collection(db, 'users'),
      where('orgId', '==', orgId)
    );

    return onSnapshot(q, (snapshot) => {
      const members = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as TeamMember[];
      callback(members);
    }, (error) => {
      console.error('Firestore Error (Team):', error);
    });
  },

  updateMember: async (id: string, data: Partial<TeamMember>) => {
    const memberRef = doc(db, 'users', id);
    await updateDoc(memberRef, {
      ...data,
      updatedAt: serverTimestamp()
    });
  },

  deleteMember: async (id: string) => {
    await deleteDoc(doc(db, 'users', id));
  }
};
