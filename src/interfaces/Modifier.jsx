import React, { useState, useEffect } from 'react';
import { firestore } from "../components/firebase";
import { collection, query, orderBy, getDocs, doc, deleteDoc, updateDoc, arrayRemove } from "firebase/firestore";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, IconButton, InputAdornment, Checkbox } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import getDecryptedUidFromCookie from '../components/DecryptUid';
function Modifier() {
    const [images, setImages] = useState([]);
    const [selectedImage, setSelectedImage] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredImages, setFilteredImages] = useState([]);
    const [selectedIds, setSelectedIds] = useState([]); 
    const [imageToDelete, setImageToDelete] = useState(null); 
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [bulkDeleteConfirmOpen, setBulkDeleteConfirmOpen] = useState(false); // State for bulk delete confirmation

    useEffect(() => {
        const fetchImages = async () => {
            const imagesCollection = collection(firestore, "images");
            const q = query(imagesCollection, orderBy("uploadTime", "desc"));
            const querySnapshot = await getDocs(q);

            const imageData = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
                documentName: doc.id, 
            }));
            setImages(imageData);
            setFilteredImages(imageData);
        };

        fetchImages();
    }, []);

    useEffect(() => {
        const results = images.filter((image) =>
            image.iid.toString().includes(searchTerm) ||
            image.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            image.documentName.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredImages(results);
    }, [searchTerm, images]);

    const handleRowClick = (image) => {
        setSelectedImage(image);
    };

    const handleSave = async () => {
        if (selectedImage) {
            const imageDoc = doc(firestore, "images", selectedImage.id);
            await updateDoc(imageDoc, {
                name: selectedImage.name,
                link: selectedImage.link,
                lowLink: selectedImage.lowLink,
                midLink: selectedImage.midLink,
            });
    
            // Update the local state
            setImages((prevImages) =>
                prevImages.map((image) =>
                    image.id === selectedImage.id ? { ...image, ...selectedImage } : image
                )
            );
    
            setFilteredImages((prevFilteredImages) =>
                prevFilteredImages.map((image) =>
                    image.id === selectedImage.id ? { ...image, ...selectedImage } : image
                )
            );
    
            setSelectedImage(null);
        }
    };
    

    const user = getDecryptedUidFromCookie();
    const cartDocRef = doc(firestore, 'cartItem', `user-${user}`);
    const loveDocRef = doc(firestore, 'loveItem', `user-${user}`);

    const removeFromCollections = async (imageId) => {
        try {
            await updateDoc(cartDocRef, {
                iid: arrayRemove(imageId),
            });
            await updateDoc(loveDocRef, {
                iid: arrayRemove(imageId),
            });
        } catch (error) {
            console.error("Error updating collections: ", error);
        }
    };

    const confirmDelete = (imageId, imageIID) => {
        setImageToDelete({ id: imageId, iid: imageIID });
        setConfirmOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (imageToDelete) {
            await deleteDoc(doc(firestore, "images", imageToDelete.id));
            await removeFromCollections(imageToDelete.iid); 
            setImages(images.filter((image) => image.id !== imageToDelete.id));
            setFilteredImages(filteredImages.filter((image) => image.id !== imageToDelete.id));
            setImageToDelete(null);
            setConfirmOpen(false);
        }
    };

    const handleBulkDelete = () => {
        if (selectedIds.length > 0) {
            setBulkDeleteConfirmOpen(true);
        }
    };

    const handleConfirmBulkDelete = async () => {
        for (const imageId of selectedIds) {
            const image = images.find((img) => img.id === imageId);
            if (image) {
                await deleteDoc(doc(firestore, "images", imageId));
                await removeFromCollections(image.iid);
            }
        }
        setImages(images.filter((image) => !selectedIds.includes(image.id)));
        setFilteredImages(filteredImages.filter((image) => !selectedIds.includes(image.id)));
        setSelectedIds([]);
        setBulkDeleteConfirmOpen(false);
    };

    const handleSelectAll = (event) => {
        if (event.target.checked) {
            setSelectedIds(filteredImages.map((image) => image.id));
        } else {
            setSelectedIds([]);
        }
    };

    const handleCheckboxChange = (imageId) => (event) => {
        setSelectedIds(prevSelectedIds =>
            event.target.checked ? [...prevSelectedIds, imageId] : prevSelectedIds.filter(id => id !== imageId)
        );
    };

    return (
        <div className="modifier-wrapper">
            <TextField
                label="Search"
                variant="outlined"
                fullWidth
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <SearchIcon />
                        </InputAdornment>
                    ),
                }}
                className="modifier-search-bar"
            />

            <Button 
                onClick={handleBulkDelete} 
                color="error" 
                disabled={selectedIds.length === 0} 
                style={{ marginTop: '10px', marginBottom: '10px' }} 
            >
                Delete Selected
            </Button>

            <div className="modifier-list">
                <div className="modifier-select-all">
                    <Checkbox
                        checked={selectedIds.length === filteredImages.length}
                        onChange={handleSelectAll}
                        color="primary"
                    />
                    Select All
                </div>
                {filteredImages.map((image) => (
                    <div key={image.id} className="modifier-list-item">
                        <Checkbox
                            checked={selectedIds.includes(image.id)}
                            onChange={handleCheckboxChange(image.id)}
                            color="primary"
                        />
                        <div className="modifier-image-icon">
                            {image.lowLink ? <img src={image.lowLink} alt={image.name} className="image-icon" /> : <div>No Image</div>}
                        </div>
                        <div className="modifier-details" onClick={() => handleRowClick(image)}>
                            <div><strong>Document Name:</strong> {image.documentName}</div>
                            <div><strong>IID:</strong> {image.iid}</div>
                            <div><strong>Name:</strong> {image.name}</div>
                            <div><strong>Link:</strong> {image.link}</div>
                        </div>
                        <IconButton onClick={() => confirmDelete(image.id, image.iid)} className="modifier-delete-button">
                            <DeleteIcon />
                        </IconButton>
                    </div>
                ))}
            </div>

            {selectedImage && (
                <Dialog open={!!selectedImage} onClose={() => setSelectedImage(null)}>
                    <DialogTitle>Edit Image</DialogTitle>
                    <DialogContent>
                        {selectedImage.lowLink && (
                            <img src={selectedImage.lowLink} alt={selectedImage.name} className="image-popup-icon" />
                        )}
                        <TextField
                            label="Name"
                            variant="outlined"
                            fullWidth
                            margin="dense"
                            value={selectedImage.name}
                            onChange={(e) => setSelectedImage({ ...selectedImage, name: e.target.value })}
                        />
                        <TextField
                            label="Link"
                            variant="outlined"
                            fullWidth
                            margin="dense"
                            value={selectedImage.link}
                            onChange={(e) => setSelectedImage({ ...selectedImage, link: e.target.value })}
                        />
                        <TextField
                            label="Low-Quality Link"
                            variant="outlined"
                            fullWidth
                            margin="dense"
                            value={selectedImage.lowLink}
                            onChange={(e) => setSelectedImage({ ...selectedImage, lowLink: e.target.value })}
                        />
                        <TextField
                            label="Mid-Quality Link"
                            variant="outlined"
                            fullWidth
                            margin="dense"
                            value={selectedImage.midLink}
                            onChange={(e) => setSelectedImage({ ...selectedImage, midLink: e.target.value })}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setSelectedImage(null)} color="secondary">
                            Cancel
                        </Button>
                        <Button onClick={handleSave} color="primary">
                            Save
                        </Button>
                        <Button onClick={() => confirmDelete(selectedImage.id, selectedImage.iid)} color="error">
                            Delete
                        </Button>
                    </DialogActions>
                </Dialog>
            )}

            <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
                <DialogTitle>Confirm Deletion</DialogTitle>
                <DialogContent>Are you sure you want to delete this image?</DialogContent>
                <DialogActions>
                    <Button onClick={() => setConfirmOpen(false)} color="secondary">
                        Cancel
                    </Button>
                    <Button onClick={handleConfirmDelete} color="primary">
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={bulkDeleteConfirmOpen} onClose={() => setBulkDeleteConfirmOpen(false)}>
                <DialogTitle>Confirm Bulk Deletion</DialogTitle>
                <DialogContent>
                    Are you sure you want to delete the selected images? This action cannot be undone.
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setBulkDeleteConfirmOpen(false)} color="secondary">
                        Cancel
                    </Button>
                    <Button onClick={handleConfirmBulkDelete} color="primary">
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default Modifier;
