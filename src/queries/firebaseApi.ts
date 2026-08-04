import { Collections } from "@/hooks/useDoc";
import { toast } from "@/lib/useToast";
import { db } from "@/services/firebase";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  QueryConstraint,
  Unsubscribe,
} from "firebase/firestore";

/**
 * One-time fetch (Promise-based) for a collection.
 * Returns a plain array of documents.
 * Use this only when you explicitly want a single snapshot (not realtime).
 */
const fetchCollection = async <T>({
  collectionName,
  options = [],
}: {
  collectionName: keyof Collections;
  options?: QueryConstraint[];
}): Promise<T[]> => {
  try {
    const colRef = collection(db, collectionName);
    const q = query(colRef, ...options);

    const snapshot = await getDocs(q);

    if (snapshot.empty) return [];

    const data = snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data(),
    })) as T[];

    return data;
  } catch (error: any) {
    console.error(`Error fetching collection ${collectionName}:`, error);
    toast.error({
      title: "Error loading data",
      description: error.message || "Failed to load collection",
      position: "top",
    });
    throw error;
  }
};

/**
 * Realtime subscription to a Firestore collection using onSnapshot.
 * This will call onData whenever the collection (or matching query) changes.
 *
 * Returns an unsubscribe function. Call it to stop listening.
 */
export function subscribeToCollection<T>(
  collectionName: keyof Collections,
  onData: (data: T[]) => void,
  options: QueryConstraint[] = [],
  onError?: (error: any) => void,
): Unsubscribe {
  const colRef = collection(db, collectionName);
  const q = query(colRef, ...options);

  return onSnapshot(
    q,
    (snapshot) => {
      const data = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      })) as T[];
      onData(data);
    },
    (error) => {
      console.error(`Realtime listener error on ${collectionName}:`, error);
      onError?.(error);
      toast.error({
        title: "Realtime sync error",
        description: error.message || `Failed to sync ${collectionName}`,
        position: "top",
      });
    },
  );
}

/**
 * Realtime subscription to a single Firestore document.
 */
export function subscribeToDocument<T>(
  collectionName: keyof Collections,
  id: string,
  onData: (data: T | null) => void,
  onError?: (error: any) => void,
): Unsubscribe {
  const docRef = doc(db, collectionName, id);

  return onSnapshot(
    docRef,
    (docSnap) => {
      if (docSnap.exists()) {
        onData({ id: docSnap.id, ...docSnap.data() } as T);
      } else {
        onData(null);
      }
    },
    (error) => {
      console.error(`Realtime listener error on ${collectionName}/${id}:`, error);
      onError?.(error);
    },
  );
}

/**
 * One-time fetch for a single document.
 * Returns the document data or null.
 */
const fetchDocument = async <T>({
  collectionName,
  id,
}: {
  collectionName: keyof Collections;
  id: string;
}): Promise<T | null> => {
  try {
    const docRef = doc(db, collectionName, id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as T;
    }
    return null;
  } catch (error: any) {
    console.error(`Error fetching document ${collectionName}/${id}:`, error);
    toast.error({
      title: "Error loading document",
      description: error.message || "Failed to load document",
      position: "top",
    });
    throw error;
  }
};

// The functions above are already exported via `export function`.
// Re-export the one-time helpers explicitly for clarity + the Unsubscribe type.
export { fetchCollection, fetchDocument };
export type { Unsubscribe } from "firebase/firestore";
