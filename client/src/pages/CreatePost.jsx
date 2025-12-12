import { Alert, Button, FileInput, Select, TextInput } from 'flowbite-react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';
import { app } from '../firebase';
import { useState } from 'react';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { useNavigate } from 'react-router-dom';
import AiTools from "../components/Aitools";

export default function CreatePost() {
  const [file, setFile] = useState(null);
  const [imageUploadProgress, setImageUploadProgress] = useState(null);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [formData, setFormData] = useState({});
  const [publishError, setPublishError] = useState(null);

  const navigate = useNavigate();

  /* UPLOAD IMAGE */
  const handleUpdloadImage = async () => {
    try {
      if (!file) {
        setImageUploadError('Please select an image');
        return;
      }

      const storage = getStorage(app);
      const fileName = new Date().getTime() + '-' + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setImageUploadProgress(progress.toFixed(0));
        },
        () => {
          setImageUploadError('Image upload failed');
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setFormData({ ...formData, image: downloadURL });
            setImageUploadProgress(null);
            setImageUploadError(null);
          });
        }
      );
    } catch (error) {
      console.log(error);
      setImageUploadError('Image upload failed');
    }
  };

  /* SUBMIT POST */
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('/api/post/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setPublishError(data.message);
        return;
      }

      navigate(`/post/${data.slug}`);
    } catch {
      setPublishError('Something went wrong');
    }
  };

  return (
    <div className="p-3 max-w-6xl mx-auto min-h-screen grid grid-cols-1 md:grid-cols-3 gap-6">

      {/* LEFT — AI Writing Tools */}
      <div className="md:col-span-1">
        <AiTools
          content={formData.content || ""}
          setContent={(newContent) =>
            setFormData({ ...formData, content: newContent })
          }
        />
      </div>

      {/* RIGHT — FORM */}
      <div className="md:col-span-2">
        <h1 className="text-center text-3xl my-7 font-semibold">Create a Post</h1>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>

          <div className="flex flex-col sm:flex-row gap-4">
            <TextInput
              placeholder="Title"
              required
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
            />

            <Select
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
            >
              <option value="uncategorized">Select Category</option>
              <option value="life">Life</option>
              <option value="perception">Perception</option>
              <option value="music">Music</option>
            </Select>
          </div>

          {/* IMAGE UPLOAD */}
          <div className="flex items-center justify-between p-3 border-4 border-teal-500 border-dotted">
            <FileInput accept="image/*" onChange={(e) => setFile(e.target.files[0])} />

            <Button
              type="button"
              gradientDuoTone="purpleToBlue"
              onClick={handleUpdloadImage}
              disabled={imageUploadProgress}
            >
              {imageUploadProgress ? (
                <div className="w-16 h-16">
                  <CircularProgressbar value={imageUploadProgress} text={`${imageUploadProgress}%`} />
                </div>
              ) : (
                "Upload Image"
              )}
            </Button>
          </div>

          {imageUploadError && <Alert color="failure">{imageUploadError}</Alert>}

          {formData.image && (
            <img src={formData.image} alt="uploaded" className="w-full h-72 object-cover" />
          )}

          {/* RICH TEXT EDITOR */}
          <ReactQuill
            theme="snow"
            placeholder="Write your content..."
            className="h-72 mb-12"
            value={formData.content || ""}
            onChange={(value) => setFormData({ ...formData, content: value })}
            required
          />

          <Button type="submit" gradientDuoTone="purpleToPink">
            Publish
          </Button>

          {publishError && <Alert color="failure">{publishError}</Alert>}
        </form>
      </div>
    </div>
  );
}
