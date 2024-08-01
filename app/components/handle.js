import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { firestore } from "../firebase";

export const getPantryItems = async () => {
  try {
    const snapshot = await getDocs(collection(firestore, "pantry"));
    const pantryList = [];
    snapshot.forEach((doc) => {
      pantryList.push({ id: doc.id, ...doc.data() });
    });
    return pantryList;
  } catch (error) {
    console.error("Error fetching pantry items: ", error);
    throw new Error("Failed to fetch pantry items");
  }
};

export const addOrUpdateItem = async (itemName, quantity, pantry) => {
  try {
    const trimmedItemName = itemName.trim().toLowerCase();

    if (trimmedItemName === "") {
      alert("Please enter an item name.");
      return;
    }

    const existingItem = pantry.find(item => item.name.toLowerCase() === trimmedItemName);

    if (existingItem) {
      const newQuantity = existingItem.quantity + quantity;
      const docRef = doc(firestore, "pantry", existingItem.id);
      await updateDoc(docRef, { quantity: newQuantity });
    } else {
      await addDoc(collection(firestore, "pantry"), { name: trimmedItemName, quantity });
    }
  } catch (error) {
    console.error("Error adding or updating the item: ", error);
    throw new Error("Failed to add or update item");
  }
};

export const removeItem = async (id) => {
  try {
    const docRef = doc(firestore, "pantry", id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error("Error removing the item: ", error);
    throw new Error("Failed to remove item");
  }
};

export const updateItemQuantity = async (id, newQuantity) => {
  try {
    const docRef = doc(firestore, "pantry", id);
    await updateDoc(docRef, { quantity: newQuantity });
  } catch (error) {
    console.error("Error updating the item quantity: ", error);
    throw new Error("Failed to update item quantity");
  }
};

export const updateItemName = async (id, newName) => {
  try {
    const trimmedNewName = newName.trim().toLowerCase();

    if (trimmedNewName === "") {
      throw new Error("Item name cannot be empty.");
    }

    const docRef = doc(firestore, "pantry", id);
    await updateDoc(docRef, { name: trimmedNewName });
  } catch (error) {
    console.error("Error updating the item name: ", error);
    throw new Error("Failed to update item name");
  }
};