import axios from "axios";

//cloudinary image upload
const upload = async (file) => {
  const data = new FormData();
  data.append("file", file);
  data.append("upload_preset", "GigConnect");

  try {
    const res = await axios.post(
      "https://api.cloudinary.com/v1_1/dcdydl2xr/image/upload",
      data
    );

    const { url } = res.data;
    return url; //return the url of the image
  } catch (err) {
    console.log(err);
  }
};

export default upload;
