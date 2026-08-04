import { Z as db, d as toast } from "./router-07wj3SDc.js";
import { collection, addDoc, doc, updateDoc, setDoc, deleteDoc } from "firebase/firestore";
function useDoc() {
  const addDocToCollection = async ({
    collections,
    document
  }) => {
    try {
      const colref = collection(db, collections);
      const addDocument = await addDoc(colref, document);
      const currentDoc = doc(colref, addDocument.id);
      await updateDoc(currentDoc, {
        id: addDocument.id,
        ...collections == "auctions" ? {
          lotNumber: addDocument.id
        } : {}
      });
      return { ...document, id: addDocument.id };
    } catch (error) {
      throw new Error(error.message);
    }
  };
  const updateDocument = async ({
    collections,
    document
  }) => {
    const colref = collection(db, collections);
    const currentDoc = doc(colref, document.id);
    try {
      await updateDoc(currentDoc, document);
    } catch (error) {
      throw new Error(error.message);
    }
  };
  const setDocument = async ({
    collections,
    document
  }) => {
    const colref = collection(db, collections);
    const currentDoc = doc(colref, document.id);
    try {
      await setDoc(currentDoc, { ...document, id: document.id });
    } catch (error) {
      throw new Error(error.message);
    }
  };
  const deleteDocument = async ({
    collectionName,
    id,
    message
  }) => {
    const colref = collection(db, collectionName);
    const currentDoc = doc(colref, id);
    await deleteDoc(currentDoc).then(
      () => toast.reserved({
        title: message || "Deleted Successfullly"
      })
    ).catch(
      (err) => toast.error({
        title: err.message
      })
    );
  };
  return {
    addDocToCollection,
    updateDocument,
    deleteDocument,
    setDocument
  };
}
export {
  useDoc as u
};
