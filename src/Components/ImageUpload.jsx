import { useState } from "react";
import authService from "../services/index.services";
import axios from "axios";

function ImageUpload({ handleImageUpload }) {
    const [ uploadedImage, setUploadedImage ] = useState(null)
    const [ preview, setPreview ] = useState("")
    const [ uploadError, setUploadError ] = useState("")
    const [ uploadSuccess, setUploadSuccess ] = useState(false)

    const getUploadSignature = async() => {
        try{
            const response = await authService.post("/upload/signature")
            return response.data
        } catch(error) {
            throw error
        }
    }

    const uploadSignedImage = async(cloudname, formData) => {
        try{
            const uploadResponse = await axios.post(`https://api.cloudinary.com/v1_1/${cloudname}/image/upload`, formData);
            console.log(uploadResponse.data.secure_url)
            return uploadResponse.data.secure_url
        } catch(error) {
            throw error
        }
    }

    const handlefileChange = (e) => {
        const file = e.target.files[0]
        const allowedMB= 5 * 1024 * 1024

        if(!file) return

        if(!file.type.startsWith("image/")) {
            setUploadError("Please select an image file.")
            return
        }

        if(file.size > allowedMB ) {
            setUploadError("Image must be smaller than 5MB.")
            return
        }

        setUploadError("")
        setUploadSuccess(false)
        setUploadedImage(file)
        const previeweUrl = URL.createObjectURL(file)
        setPreview(previeweUrl)
    }

    const handleUploadClick = async() => {
        setUploadError("")
      setUploadSuccess(false)

        try{
            const {timestamp, signature, cloudname, apiKey} = await getUploadSignature()
            const formData = new FormData()
    
            formData.append("file", uploadedImage);
            formData.append("api_key", apiKey);
            formData.append("timestamp", timestamp);
            formData.append("signature", signature);
            formData.append("folder", "afterhours");
    
            const cloudinaryImageUrl = await uploadSignedImage(cloudname, formData)
            handleImageUpload(cloudinaryImageUrl)
            setUploadSuccess(true)
        }catch(error) {
            console.error("Image upload failed", error)
            setUploadError("Image upload failed. Please try again.")
        }
    }

    console.log(uploadedImage)

  return (
    <div>
      <input
        type="file"
        accept="image/*"
        onChange={handlefileChange}
      />

      {uploadError && <p className="error-message">{uploadError}</p>}
      {uploadSuccess && <p className="success-message">Image uploaded successfully.</p>}

      {preview && (
        <img
          src={preview}
          alt="Upload preview"
          width="250"
        />
      )}
      <button className="btn-secondary" type="button" disabled={!uploadedImage} onClick={handleUploadClick}> Upload image </button>
    </div>
  );
}

export default ImageUpload
