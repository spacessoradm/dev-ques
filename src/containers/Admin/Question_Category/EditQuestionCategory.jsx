import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import supabase from "../../../config/supabaseClient";

import "./index.css";
import BackButton from "../../../components/Button/BackArrowButton";
import Toast from "../../../components/Toast";
import PlainInput from "../../../components/Input/PlainInput";
import TextArea from "../../../components/Input/TextArea";

const EditQuestionCategory = () => {
    const { id } = useParams();
    const [questionCategory, setQuestionCategory] = useState(null);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [seqInMenu, setSeqInMenu] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [imageFile, setImageFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(""); // Holds the preview of the new image
    const navigate = useNavigate();
    const [toastInfo, setToastInfo] = useState({ visible: false, message: "", type: "" });

    const showToast = (message, type) => {
        setToastInfo({ visible: true, message, type });
        setTimeout(() => setToastInfo({ visible: false, message: "", type: "" }), 3000);
    };

    useEffect(() => {
        const fetchQuestionCategoryData = async () => {
            try {
                const { data, error } = await supabase
                    .from("question_category")
                    .select("*")
                    .eq("id", id)
                    .single();

                if (error) throw error;

                setQuestionCategory(data);
                setName(data.category_name);
                setDescription(data.description);
                setSeqInMenu(data.seq_in_menu);
                setImageUrl(data.Image_Path);
            } catch (error) {
                console.error("Error fetching question category:", error.message);
            }
        };

        fetchQuestionCategoryData();
    }, [id]);

    const handleImageChange = (e) => {
        if (e.target.files.length > 0) {
            const file = e.target.files[0];
            setImageFile(file);
            setPreviewUrl(URL.createObjectURL(file)); // Generate a temporary preview URL
        }
    };

    const uploadImageAndUpdateUrl = async () => {
        if (!imageFile) return imageUrl; // No new image, return existing URL

        try {
            // Delete old image if exists
            if (imageUrl) {
                const oldFileName = imageUrl.split("/").pop(); // Extracts filename from URL
                const oldFilePath = `categories/${oldFileName}`; // Full path inside Supabase storage
                await supabase.storage.from("question").remove([oldFilePath]);
            }

            const fileExt = imageFile.name.split('.').pop();
            const fileName = `${Date.now()}.${fileExt}`;
            const filePath = `categories/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('question')
                .upload(filePath, imageFile);

            if (uploadError) throw uploadError;

            //const newImageUrl = `${supabase.storage.from(BUCKET_NAME).getPublicUrl(fileName).data.publicUrl}`;
            return filePath;
        } catch (error) {
            console.error("Image upload error:", error.message);
            showToast("Failed to upload image.", "error");
            return imageUrl; // Return old image URL if upload fails
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const newImageUrl = await uploadImageAndUpdateUrl();

            const { error } = await supabase
                .from("question_category")
                .update({
                    category_name: name,
                    description: description,
                    seq_in_menu: seqInMenu,
                    Image_Path: newImageUrl,
                })
                .eq("id", id);

            if (error) throw error;

            showToast("Question category updated successfully.", "success");
            navigate("/admin/questioncategory");
        } catch (error) {
            console.error("Error updating question category:", error.message);
            showToast("Failed to update question category.", "error");
        }
    };

    return (
        <div style={{ fontFamily: "Courier New" }}>
            <BackButton to="/admin/questioncategory" />
            <h2>Edit Question Category</h2>

            {toastInfo.visible && <Toast message={toastInfo.message} type={toastInfo.type} />}

            <form onSubmit={handleSubmit} className="outsider">
                <div className="insider">
                    <PlainInput label="Category Name" name="name" value={name} onChange={(e) => setName(e.target.value)} />

                    <TextArea label="Category Description" name="description" value={description} onChange={(e) => setDescription(e.target.value)} />

                    <PlainInput label="Seq in Menu" name="seqInMenu" value={seqInMenu} onChange={(e) => setSeqInMenu(e.target.value)} />

                    {/* Current Image Preview */}
                    {imageUrl && !previewUrl && (
                        <div>
                            <p>Current Image:</p>
                            <img src={`${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/question/${imageUrl}`} alt="Current Category" className="preview-image" style={{ width: "400px" }}/>
                        </div>
                    )}

                    {/* New Image Preview */}
                    {previewUrl && (
                        <div className="enhanced-input">
                            <p>New Image Preview:</p>
                            <img src={previewUrl} alt="New Category" className="preview-image" style={{ width: "400px" }} />
                        </div>
                    )}

                    {/* Image Upload */}
                    <label className="file-upload">
                        <span>Upload New Image</span>
                        <input type="file" accept="image/*" onChange={handleImageChange} className="enhanced-input" />
                    </label>

                    <button type="submit" className="submit-btn">Submit</button>
                </div>
            </form>
        </div>
    );
};

export default EditQuestionCategory;
