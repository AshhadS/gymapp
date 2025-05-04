import { defineStore } from 'pinia';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth, db } from '@/firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';
  
interface AuthState {
  isLoggedIn: boolean;
  user: any | null;
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    isLoggedIn: false,
    user: null
  }),
  actions: {
    async signUp(email: string, password: string) {
      try {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        const { uid } = userCredential.user;
        await setDoc(doc(db, 'profiles', uid), {
          email,
          role: 'client',
        });
        this.user = {email, role: 'client', uid};
        this.isLoggedIn = true
      } catch (error) {
        console.error('Sign up failed:', error);
      }
    },
    async signIn(email: string, password: string) {
      try {
        const userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );
        const { uid } = userCredential.user;
        const userDoc = await getDoc(doc(db, 'profiles', uid));
        // const { role } = userDoc.data()!;
        const role = 'trainer';
        this.user = {email, role, uid};
        this.isLoggedIn = true
      } catch (error) {
        console.error('Sign in failed:', error);
      }
    },
      async signOut() {
        try {
          await signOut(auth);
          this.user = null;
          this.isLoggedIn = false;
        } catch (error) {
          console.error('Sign out failed:', error);
        }
      }
    }
});
