"use client";
import {
  Stack,
  Box,
  Modal,
  Button,
  Typography,
  TextField,
  IconButton,
} from "@mui/material";
import { useEffect, useState } from "react";
import {
  getPantryItems,
  addOrUpdateItem,
  removeItem,
  updateItemQuantity,
  updateItemName,
} from "./components/handle";

export default function Home() {
  const [pantry, setPantry] = useState([]);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [newItem, setNewItem] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [editingItem, setEditingItem] = useState(null);
  const [editedItemName, setEditedItemName] = useState("");

  const handleOpenAddModal = () => setOpenAddModal(true);
  const handleCloseAddModal = () => setOpenAddModal(false);

  const handleOpenEditModal = (item) => {
    setEditingItem(item);
    setEditedItemName(item.name);
    setOpenEditModal(true);
  };

  const handleCloseEditModal = () => setOpenEditModal(false);

  const handleAddItem = async () => {
    try {
      await addOrUpdateItem(newItem, quantity, pantry);
      setNewItem("");
      setQuantity(1);
      handleCloseAddModal();
      updatePantry();
    } catch (error) {
      console.error("Error adding or updating the item in Pantry: ", error);
    }
  };

  const handleUpdateItemName = async () => {
    if (!editingItem) return;

    try {
      const trimmedName = editedItemName.trim().toLowerCase();
      if (trimmedName === "") {
        alert("Item name cannot be empty.");
        return;
      }

      await updateItemName(editingItem.id, trimmedName);
      setEditingItem(null);
      setEditedItemName("");
      handleCloseEditModal();
      updatePantry();
    } catch (error) {
      console.error("Error updating the item name: ", error);
    }
  };

  const handleRemoveItem = async (id) => {
    try {
      await removeItem(id);
      updatePantry();
    } catch (error) {
      console.error("Error removing the item from Pantry: ", error);
    }
  };

  const handleUpdateQuantity = async (id, newQuantity) => {
    try {
      await updateItemQuantity(id, newQuantity);
      updatePantry();
    } catch (error) {
      console.error("Error updating the item quantity in Pantry: ", error);
    }
  };

  const updatePantry = async () => {
    try {
      const pantryList = await getPantryItems();
      setPantry(pantryList);
    } catch (error) {
      console.error("Error fetching pantry items: ", error);
    }
  };

  useEffect(() => {
    updatePantry();
  }, []);

  const filteredPantry = pantry.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "white",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
    display: "flex",
    flexDirection: "column",
    gap: 3,
  };

  return (
    <Box
      width="100vw"
      height="100vh"
      display={"flex"}
      flexDirection={"column"}
      justifyContent={"flex-start"}
      alignItems={"center"}
      sx={{
        backgroundImage: "url(/wall.png)",
        backgroundSize: 20,
        overflow: "hidden", // Prevents scrolling the whole page
      }}
    >
      {/* Add Item Modal */}
      <Modal
        open={openAddModal}
        onClose={handleCloseAddModal}
        aria-labelledby="modal-add-item-title"
        aria-describedby="modal-add-item-description"
      >
        <Box sx={modalStyle}>
          <Typography id="modal-add-item-title" variant="h6" component="h2">
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
          <Button
            variant="contained"
            sx={{
              backgroundColor: "lightgrey",
              color: "black",
              "&:hover": { backgroundColor: "grey" },
            }}
            onClick={handleAddItem}
          >
            Add
          </Button>
        </Box>
      </Modal>

      {/* Edit Item Modal */}
      <Modal
        open={openEditModal}
        onClose={handleCloseEditModal}
        aria-labelledby="modal-edit-item-title"
        aria-describedby="modal-edit-item-description"
      >
        <Box sx={modalStyle}>
          <Typography id="modal-edit-item-title" variant="h6" component="h2">
            Edit Item Name
          </Typography>
          <TextField
            label="New Item Name"
            variant="outlined"
            value={editedItemName}
            onChange={(e) => setEditedItemName(e.target.value)}
          />
          <Button
            variant="contained"
            sx={{
              backgroundColor: "lightgrey",
              color: "black",
              "&:hover": { backgroundColor: "grey" },
            }}
            onClick={handleUpdateItemName}
          >
            Update
          </Button>
        </Box>
      </Modal>

      <Box
        width="800px"
        display={"flex"}
        flexDirection={"column"}
        alignItems={"center"}
        justifyContent={"center"}
        sx={{
          backgroundImage: "url(/box.png)",
          backgroundSize: 20,
          borderRadius: 2,
          position: "sticky",
          top: 0,
          zIndex: 10,
          bgcolor: "white",
        }}
      >
        <Typography
          variant={"h2"}
          color={"black"}
          textAlign={"center"}
          sx={{ fontFamily: "Serif", padding: "16px 0" }}
        >
          PANTRY ITEMS
        </Typography>
        </Box>
        <Box
          display={"flex"}
          flexDirection={"row"}
          alignItems={"center"}
          justifyContent={"center"}
          gap={2}
          my={2}
          width={"800px"}
        >
          <TextField
            label="Search Pantry"
            variant="outlined"
            value={searchTerm}
            onChange={handleSearch}
            fullWidth
          />
          <Button
            variant="contained"
            sx={{
              backgroundColor: "lightgrey",
              color: "black",
              "&:hover": { backgroundColor: "grey" },
            }}
            onClick={handleOpenAddModal}
          >
            Add
          </Button>
        </Box>

      {/* Scrollable Item List */}
      <Box
        sx={{
          backgroundImage: "url(/box.png)",
          borderRadius: 2,
          backgroundSize: 20,
          width: "800px",
          maxHeight: "calc(100vh - 150px)", // Adjust based on the height of the header
          overflowY: "auto",
        }}
      >
        <Stack spacing={2}>
          {filteredPantry.map((item) => (
            <Box
              key={item.id}
              width="100%"
              height="80px"
              display={"flex"}
              justifyContent={"space-between"}
              alignItems={"center"}
              sx={{
                backgroundSize: "cover",
                backgroundPosition: "center",
                bgcolor: "transparent",
                px: 2,
                borderBottom: "10px solid lightgrey",
                fontFamily: '"Brush Script MT", cursive',
              }}
            >
              <Typography variant={"h4"} color={"black"} textAlign={"center"}>
                {item.name.charAt(0).toUpperCase() + item.name.slice(1)}
              </Typography>
              <Box display={"flex"} alignItems={"center"} gap={2}>
                <IconButton
                  onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                  disabled={item.quantity <= 1}
                >
                  -
                </IconButton>
                <Typography variant={"h5"}>{item.quantity}</Typography>
                <IconButton
                  onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                >
                  +
                </IconButton>
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: "lightgrey",
                    color: "black",
                    "&:hover": { backgroundColor: "grey" },
                  }}
                  onClick={() => handleRemoveItem(item.id)}
                >
                  Remove
                </Button>
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: "lightgrey",
                    color: "black",
                    "&:hover": { backgroundColor: "grey" },
                  }}
                  onClick={() => handleOpenEditModal(item)}
                >
                  Edit
                </Button>
              </Box>
            </Box>
          ))}
        </Stack>
      </Box>
    </Box>
  );
}
