import { useEffect, useRef } from "react";
import { onAuthStateChanged, User as FirebaseUser } from "firebase/auth";
import { doc, getDoc, onSnapshot, Unsubscribe } from "firebase/firestore";
import { auth, db } from "@/services/firebase";
import { useAuthStore } from "@/store/zustand";
import type { WalletAccount } from "@/types";

/**
 * Single source of truth Firebase auth + user doc listener.
 *
 * This version is extremely defensive against infinite loops:
 * - We NEVER select anything from the store with hooks inside this effect.
 * - We use `useAuthStore.getState()` only inside the callbacks.
 * - The effect has NO store-derived dependencies.
 * - We properly clean up the inner user-doc listener.
 */
export function useAuthListener() {
  // Keep the current user-doc unsubscribe so we can clean it up on logout / unmount
  const userUnsubRef = useRef<Unsubscribe | null>(null);

  useEffect(() => {
    // Do NOT call setLoading here in a way that depends on selected state.
    // We will use getState inside the async callback.

    const authUnsub = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      // Clean previous user doc listener
      if (userUnsubRef.current) {
        userUnsubRef.current();
        userUnsubRef.current = null;
      }

      const { setUser, setLoading } = useAuthStore.getState();

      if (!firebaseUser) {
        setUser(null);
        setLoading(false, true);
        return;
      }

      // Mark that we are resolving the user
      setLoading(true, false);

      try {
        const userRef = doc(db, "users", firebaseUser.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          const initialData = { id: userSnap.id, ...userSnap.data() } as WalletAccount;
          setUser(initialData);

          // Attach ONE realtime listener for this user's doc.
          const unsub = onSnapshot(
            userRef,
            (docSnap) => {
              if (docSnap.exists()) {
                const liveData = { id: docSnap.id, ...docSnap.data() } as WalletAccount;
                // Use getState again to be extra safe (no closure over selected setters)
                const { setUser: setUserLive } = useAuthStore.getState();
                setUserLive(liveData);
              }
            },
            (err) => {
              console.error("[auth] user doc onSnapshot error", err);
            },
          );

          userUnsubRef.current = unsub;
        } else {
          console.warn("[auth] No Firestore user doc for uid:", firebaseUser.uid);
          const { setUser: setUserNull } = useAuthStore.getState();
          setUserNull(null);
        }
      } catch (error) {
        console.error("[auth] Failed to fetch user document:", error);
        const { setUser: setUserErr } = useAuthStore.getState();
        setUserErr(null);
      } finally {
        const { setLoading: setLoadingDone } = useAuthStore.getState();
        setLoadingDone(false, true);
      }
    });

    return () => {
      authUnsub();
      if (userUnsubRef.current) {
        userUnsubRef.current();
        userUnsubRef.current = null;
      }
    };
  }, []); // <- no dependencies from the store at all
}
