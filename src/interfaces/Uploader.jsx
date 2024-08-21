import React, { useState, useEffect } from "react";
import { firestore } from "../components/firebase";
import {
    collection,
    addDoc,
    Timestamp,
    query,
    where,
    getDocs,
} from "firebase/firestore";
import GetLowQualityImage from "../components/GetLowQualityImage";
import {
    LinearProgress,
    Box,
    Typography,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
} from "@mui/material";
import "../App.css"; // Import the CSS file

function Uploader() {
    const [imageId, setImageId] = useState("");
    const [imageLink, setImageLink] = useState("");
    const [imageName, setImageName] = useState("");
    const [imagePrice, setImagePrice] = useState(""); // State for the price
    const [uploadTime, setUploadTime] = useState(new Date().toLocaleString());
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Progress bars
    const [linkAddingProgress, setLinkAddingProgress] = useState(0);
    const [lowQualityImageProgress, setLowQualityImageProgress] = useState(0);
    const [midQualityImageProgress, setMidQualityImageProgress] = useState(0);
    const [ultralowQualityImageProgress, setUltralowQualityImageProgress] = useState(0);
    const [finalizingProgress, setFinalizingProgress] = useState(0);

    // Error handling
    const [errorMessage, setErrorMessage] = useState("");
    const [errorDialogOpen, setErrorDialogOpen] = useState(false);

    const generateUniqueId = async () => {
        const imagesCollection = collection(firestore, "images");
        let newId = Math.floor(Math.random() * 1000000);

        let q = query(imagesCollection, where("iid", "==", newId));
        let querySnapshot = await getDocs(q);

        while (!querySnapshot.empty) {
            newId = Math.floor(Math.random() * 1000000);
            q = query(imagesCollection, where("iid", "==", newId));
            querySnapshot = await getDocs(q);
        }

        return newId;
    };

    useEffect(() => {
        const setInitialId = async () => {
            const uniqueId = await generateUniqueId();
            setImageId(uniqueId);
        };
        setInitialId();
    }, []);

    // Update the upload time every second
    useEffect(() => {
        const interval = setInterval(() => {
            setUploadTime(new Date().toLocaleString());
        }, 1000);

        return () => clearInterval(interval); // Cleanup on unmount
    }, []);

    const handleError = (message) => {
        setErrorMessage(message);
        setErrorDialogOpen(true);
    };

    const handleCloseErrorDialog = () => {
        setErrorDialogOpen(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (isSubmitting) return;

        setIsSubmitting(true);

        try {
            // Step 1: Validate the link
            setLinkAddingProgress(20);
            const imagesCollection = collection(firestore, "images");
            const linkQuery = query(imagesCollection, where("link", "==", imageLink));
            const linkSnapshot = await getDocs(linkQuery);

            setLinkAddingProgress(40);

            if (!linkSnapshot.empty) {
                handleError("Image with this link already exists.");
                return;
            }

            setLinkAddingProgress(100);

            // Step 4: Convert to ultralow-quality image
            setUltralowQualityImageProgress(20);
            const ultralowQualityImage = await GetLowQualityImage(imageLink, 0, 10);
            setUltralowQualityImageProgress(60);

            // Assume there's an additional process for ultralow-quality images
            // Add some delay to simulate the process
            await new Promise((resolve) => setTimeout(resolve, 500));

            setUltralowQualityImageProgress(100);


            // Step 2: Convert to low-quality image
            setLowQualityImageProgress(20);
            const lowQualityImage = await GetLowQualityImage(imageLink, 0.9, 500);
            setLowQualityImageProgress(60);

            // Assume there's an additional process like compression
            // Add some delay to simulate the process
            await new Promise((resolve) => setTimeout(resolve, 500));

            setLowQualityImageProgress(100);

            // Step 3: Convert to mid-quality image
            setMidQualityImageProgress(20);
            const midQualityImage = await GetLowQualityImage(imageLink, 0.4, 1000);
            setMidQualityImageProgress(60);

            // Assume there's an additional process like color optimization
            // Add some delay to simulate the process
            await new Promise((resolve) => setTimeout(resolve, 500));

            setMidQualityImageProgress(100);

            
            // Step 5: Finalize and upload
            setFinalizingProgress(20);
            await addDoc(collection(firestore, "images"), {
                link: imageLink,
                lowLink: lowQualityImage,
                midLink: midQualityImage,
                ultralowLink: ultralowQualityImage, // Store ultralow-quality link
                name: imageName,
                price: imagePrice, // Add price to Firestore document
                uploadTime: Timestamp.fromDate(new Date()),
                iid: imageId,
            });

            setFinalizingProgress(60);

            // Add some delay to simulate final steps like database indexing
            await new Promise((resolve) => setTimeout(resolve, 500));

            setFinalizingProgress(100);
            console.log("Document successfully written!");

            setImageLink("");
            setImageName("");
            setImagePrice(""); // Reset price
            const newUniqueId = await generateUniqueId();
            setImageId(newUniqueId);
        } catch (e) {
            console.error("Error adding document: ", e);
            handleError("An unexpected error occurred. Please try again.");
        } finally {
            setIsSubmitting(false);
            setLinkAddingProgress(0);
            setLowQualityImageProgress(0);
            setMidQualityImageProgress(0);
            setUltralowQualityImageProgress(0);
            setFinalizingProgress(0);
        }
    };

    return (
        <div className="uploader-wrapper">
            <div className="uploader-container">
                <h1 className="uploader-header">Upload Image</h1>
                <form className="uploader-form" onSubmit={handleSubmit}>
                    {!isSubmitting && (
                        <>
                            <div className="uploader-form-group">
                                <label className="uploader-label">
                                    Image ID:
                                    <input
                                        type="text"
                                        value={imageId}
                                        readOnly
                                        className="uploader-input"
                                    />
                                </label>
                            </div>
                            <div className="uploader-form-group">
                                <label className="uploader-label">
                                    Image Link:
                                    <input
                                        type="text"
                                        value={imageLink}
                                        onChange={(e) => setImageLink(e.target.value)}
                                        required
                                        className="uploader-input"
                                    />
                                </label>
                            </div>
                            <div className="uploader-form-group">
                                <label className="uploader-label">
                                    Image Name:
                                    <input
                                        type="text"
                                        value={imageName}
                                        onChange={(e) => setImageName(e.target.value)}
                                        className="uploader-input"
                                    />
                                </label>
                            </div>
                            <div className="uploader-form-group">
                                <label className="uploader-label">
                                    Image Price:
                                    <input
                                        type="number"
                                        value={imagePrice}
                                        onChange={(e) => setImagePrice(e.target.value)}
                                        required
                                        className="uploader-input"
                                    />
                                </label>
                            </div>
                            <div className="uploader-form-group">
                                <label className="uploader-label">
                                    Upload Time:
                                    <input
                                        type="text"
                                        value={uploadTime}
                                        readOnly
                                        className="uploader-input"
                                    />
                                </label>
                            </div>
                        </>
                    )}

                    {/* Show progress bars only when isSubmitting is true */}
                    {isSubmitting && (
                        <div className="loading-section">
                            <Box sx={{ width: "100%", mt: 2 }}>
                                <Typography variant="body2" color="textSecondary" gutterBottom>
                                    Link Adding
                                </Typography>
                                <LinearProgress
                                    variant="determinate"
                                    value={linkAddingProgress}
                                />
                            </Box>

                            <Box sx={{ width: "100%", mt: 2 }}>
                                <Typography variant="body2" color="textSecondary" gutterBottom>
                                    Ultralow-Quality Image Conversion
                                </Typography>
                                <LinearProgress
                                    variant="determinate"
                                    value={ultralowQualityImageProgress}
                                />
                            </Box>

                            <Box sx={{ width: "100%", mt: 2 }}>
                                <Typography variant="body2" color="textSecondary" gutterBottom>
                                    Low-Quality Image Conversion
                                </Typography>
                                <LinearProgress
                                    variant="determinate"
                                    value={lowQualityImageProgress}
                                />
                            </Box>

                            <Box sx={{ width: "100%", mt: 2 }}>
                                <Typography variant="body2" color="textSecondary" gutterBottom>
                                    Mid-Quality Image Conversion
                                </Typography>
                                <LinearProgress
                                    variant="determinate"
                                    value={midQualityImageProgress}
                                />
                            </Box>

                            <Box sx={{ width: "100%", mt: 2 }}>
                                <Typography variant="body2" color="textSecondary" gutterBottom>
                                    Finalizing Upload
                                </Typography>
                                <LinearProgress
                                    variant="determinate"
                                    value={finalizingProgress}
                                />
                            </Box>
                        </div>
                    )}

                    <button
                        type="submit"
                        className="uploader-button"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? "Uploading..." : "Upload"}
                    </button>
                </form>

                {/* Error Dialog */}
                <Dialog
                    open={errorDialogOpen}
                    onClose={handleCloseErrorDialog}
                >
                    <DialogTitle>Error</DialogTitle>
                    <DialogContent>
                        <Typography>{errorMessage}</Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseErrorDialog} color="primary">
                            OK
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        </div>
    );
}

export default Uploader;
