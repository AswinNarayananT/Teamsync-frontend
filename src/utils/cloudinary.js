export const uploadImageToCloudinary = async (file, folder = "teamsync") => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "TeamSync"); 
    formData.append("folder", folder); 
  
    try {
      const response = await fetch("https://api.cloudinary.com/v1_1/dd2wbwl67/image/upload", {
        method: "POST",
        body: formData,
      });
  
      const data = await response.json();
      return data.secure_url; 
    } catch (error) {
      console.error("Error uploading image:", error);
      return null;
    }
  };
  
  export const uploadMultipleImagesToCloudinary = async (files, folder = "teamsync") => {
    const imageUrls = await Promise.all(
      [...files].map(async (file) => {
        return await uploadImageToCloudinary(file, folder);
      })
    );
    return imageUrls.filter((url) => url !== null); 
  };
  