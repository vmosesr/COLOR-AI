import { 
  collection, doc, setDoc, getDoc, query, orderBy, getDocs, serverTimestamp 
} from 'firebase/firestore';
import { db } from '../auth/firebase';
import type { User, Project } from '../../types/auth';

export class DatabaseService {
  static async createUser(user: User): Promise<void> {
    try {
      await setDoc(doc(db, 'users', user.uid), {
        ...user,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      throw new Error(`Failed to create user: ${error}`);
    }
  }

  static async getUser(userId: string): Promise<User | null> {
    try {
      const userDoc = await getDoc(doc(db, 'users', userId));
      return userDoc.exists() ? userDoc.data() as User : null;
    } catch (error) {
      throw new Error(`Failed to get user: ${error}`);
    }
  }

  static async saveProject(userId: string, project: Project): Promise<string> {
    try {
      const projectRef = doc(collection(db, 'users', userId, 'projects'));
      await setDoc(projectRef, {
        ...project,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return projectRef.id;
    } catch (error) {
      throw new Error(`Failed to save project: ${error}`);
    }
  }

  static async getUserProjects(userId: string): Promise<Project[]> {
    try {
      const q = query(
        collection(db, 'users', userId, 'projects'),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Project));
    } catch (error) {
      throw new Error(`Failed to get projects: ${error}`);
    }
  }
}