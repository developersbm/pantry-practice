"use client";
import { Stack, Box, Modal, Button, Typography, TextField, IconButton } from "@mui/material";
import { firestore } from "./firebase";
import { collection, getDocs, query, addDoc, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";

export default function Home() {
  const [pantry, setPantry] = useState([]);
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [newItem, setNewItem] = useState("");
  const [quantity, setQuantity] = useState(1);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleAddItem = async () => {
    if (newItem.trim()) {
      await addDoc(collection(firestore, "pantry"), { name: newItem, quantity });
      setNewItem("");
      setQuantity(1);
      handleClose();
      updatePantry();
    }
  };

  const handleRemoveItem = async (id) => {
    const docRef = doc(firestore, "pantry", id);
    await deleteDoc(docRef);
    updatePantry();
  };

  const handleUpdateQuantity = async (id, newQuantity) => {
    const docRef = doc(firestore, "pantry", id);
    await updateDoc(docRef, { quantity: newQuantity });
    updatePantry();
  };

  const updatePantry = async () => {
    const snapshot = query(collection(firestore, "pantry"));
    const docs = await getDocs(snapshot);
    const pantryList = [];
    docs.forEach((doc) => {
      pantryList.push({ id: doc.id, ...doc.data() });
    });
    setPantry(pantryList);
  };

  useEffect(() => {
    updatePantry();
  }, []);
  
  const filteredPantry = pantry.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    if (filteredPantry.length === 0) {
      alert("Item not found in pantry");
      setSearchTerm("");
    }
  };

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'white',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
    display: 'flex',
    flexDirection: 'column',
    gap: 3,
  };

  return (
    <Box
      width="100vw"
      height="100vh"
      display={"flex"}
      flexDirection={"column"}
      justifyContent={"center"}
      alignItems={"center"}
    >
      {pantry.length > 0 && (
        <TextField
          label="Search Pantry"
          variant="outlined"
          value={searchTerm}
          onChange={handleSearch}
          sx={{ marginBottom: 2 }}
        />
      )}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Add New Item
          </Typography>
          <TextField
            label="Item Name"
            variant="outlined"
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
          />
          {pantry.length > 0 && (
            <TextField
              label="Quantity"
              type="number"
              variant="outlined"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
            />
          )}
          <Button variant="contained" onClick={handleAddItem}>
            Add
          </Button>
        </Box>
      </Modal>
      <Button variant="contained" onClick={handleOpen} >
        Add
      </Button>
      <Box border={"1px solid #333"}>
        <Box
          width="800px"
          height="100px"
          bgcolor={"#ADD8E6"}
          display={"flex"}
          justifyContent={"center"}
          alignItems={"center"}
        >
          <Typography variant={"h2"} color={"#333"} textAlign={"center"} sx={{ fontFamily: 'Arial' }}>
            Pantry Items
          </Typography>
        </Box>
        <Stack width="800px" height="500px" spacing={2} overflow={"auto"}>
          {filteredPantry.map((item) => (
            <Box
              key={item.id}
              width="100%"
              height="100px"
              display={"flex"}
              justifyContent={"space-between"}
              alignItems={"center"}
              bgcolor={"#f0f0f0"}
              px={2}
              sx={{ fontFamily: '"Brush Script MT", cursive' }}
            >
              <Typography variant={"h4"} color={"#333"} textAlign={"center"}>
                {item.name.charAt(0).toUpperCase() + item.name.slice(1)}
              </Typography>
              <Box display={"flex"} alignItems={"center"} gap={2}>
                <IconButton onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)} disabled={item.quantity <= 1}>
                  -
                </IconButton>
                <Typography variant={"h5"}>{item.quantity}</Typography>
                <IconButton onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}>
                  +
                </IconButton>
                <Button variant="contained" color="secondary" onClick={() => handleRemoveItem(item.id)}>
                  Remove
                </Button>
              </Box>
            </Box>
          ))}
        </Stack>
      </Box>
    </Box>
  );
}
