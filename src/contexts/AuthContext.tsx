import * as React from 'react';
import { 
  onAuthStateChanged, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut, 
  User as FirebaseUser 
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';

interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  firstName?: string;
  lastName?: string;
  orgId: string;
  role: string;
  status: string;
  createdAt: string;
  phoneNumber?: string;
}

interface Organization {
  id: string;
  name: string;
  domain?: string;
  createdAt: string;
}

interface AuthContextType {
  user: FirebaseUser | null;
  profile: UserProfile | null;
  organization: Organization | null;
  loading: boolean;
  signIn: () => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
  updateOrganization: (data: Partial<Organization>) => Promise<void>;
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = React.useState<FirebaseUser | null>(null);
  const [profile, setProfile] = React.useState<UserProfile | null>(null);
  const [organization, setOrganization] = React.useState<Organization | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        // Fetch profile
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data() as UserProfile;
          setProfile(userData);
          
          // Fetch organization
          const orgDoc = await getDoc(doc(db, 'organizations', userData.orgId));
          if (orgDoc.exists()) {
            setOrganization({ id: orgDoc.id, ...orgDoc.data() } as Organization);
          }
        } else {
          // Auto-provision a default organization for new users
          const newOrgId = `org_${Math.random().toString(36).substr(2, 9)}`;
          const [firstName, ...lastNameParts] = (user.displayName || 'New User').split(' ');
          const lastName = lastNameParts.join(' ');
          
          const newProfile: UserProfile = {
            uid: user.uid,
            email: user.email || '',
            displayName: user.displayName || 'New User',
            firstName: firstName || 'New',
            lastName: lastName || 'User',
            orgId: newOrgId,
            role: 'org_admin',
            status: 'active',
            createdAt: new Date().toISOString()
          };
          
          const newOrg = {
            name: `${user.displayName || 'My'}'s Workspace`,
            createdAt: new Date().toISOString()
          };
          
          await setDoc(doc(db, 'organizations', newOrgId), newOrg);
          await setDoc(doc(db, 'users', user.uid), newProfile);
          
          setProfile(newProfile);
          setOrganization({ id: newOrgId, ...newOrg } as Organization);
        }
      } else {
        setProfile(null);
        setOrganization(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signIn = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  const logout = async () => {
    await signOut(auth);
  };

  const updateProfile = async (data: Partial<UserProfile>) => {
    if (!user) return;
    const userRef = doc(db, 'users', user.uid);
    await setDoc(userRef, data, { merge: true });
    setProfile(prev => prev ? { ...prev, ...data } : null);
  };

  const updateOrganization = async (data: Partial<Organization>) => {
    if (!profile?.orgId) return;
    const orgRef = doc(db, 'organizations', profile.orgId);
    await setDoc(orgRef, data, { merge: true });
    setOrganization(prev => prev ? { ...prev, ...data } : null);
  };

  return (
    <AuthContext.Provider value={{ user, profile, organization, loading, signIn, logout, updateProfile, updateOrganization }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
