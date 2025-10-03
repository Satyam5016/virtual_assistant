import React, { useRef, useContext } from "react";
import Card from "../components/Card";
import image1 from "../assets/image1.png";
import image2 from "../assets/image2.jpg";
import image3 from "../assets/authBg.png";
import image4 from "../assets/image4.png";
import image5 from "../assets/image5.png";
import image6 from "../assets/image6.jpeg";
import image7 from "../assets/image7.jpeg";
import { RiImageAddLine } from "react-icons/ri";
import { UserDataContext } from "../context/userContext";
import { useNavigate } from "react-router-dom";
import { MdKeyboardBackspace } from "react-icons/md";

function Customize() {
    const {
        serverUrl,
        userData,
        setUserData,
        backendImage,
        setBackendImage,
        frontendImage,
        setFrontendImage,
        selectedImage,
        setSelectedImage,
    } = useContext(UserDataContext);
    const navigate = useNavigate();

    const inputImage = useRef();

    const handleImage = (e) => {
        const file = e.target.files[0];
        if (file) {
            setBackendImage(file);
            setFrontendImage(URL.createObjectURL(file));
            setSelectedImage("input");
        }
    };

    return (
        <div className="w-full h-[100vh] bg-gradient-to-t from-black to-[#030353] flex flex-col justify-center items-center">
            <MdKeyboardBackspace
                className="absolute top-[30px] left-[30px] text-white w-[25px] h-[25px] cursor-pointer"
                onClick={() => navigate("/")}
            />
            <h1 className="text-white text-[30px] mb-[30px] text-center">
                Select your <span className="text-blue-200">Assistant Image</span>
            </h1>

            <div className="w-[90%] max-w-[900px] flex justify-center items-center flex-wrap gap-[20px]">
                <Card image={image1} />
                <Card image={image2} />
                <Card image={image3} />
                <Card image={image4} />
                <Card image={image5} />
                <Card image={image6} />
                <Card image={image7} />

                {/* Upload Image Card */}
                <div
                    className={`w-[70px] h-[140px] lg:w-[150px] lg:h-[250px] bg-[#020220] border-2 border-[#000ff66] rounded-2xl overflow-hidden 
            hover:shadow-2xl hover:shadow-blue-950 cursor-pointer hover:border-4 hover:border-white 
            flex items-center justify-center ${selectedImage === "input"
                            ? "border-4 border-white shadow-2xl hover:shadow-blue-950"
                            : ""
                        }`}
                    onClick={() => inputImage.current.click()}
                >
                    {!frontendImage ? (
                        <RiImageAddLine className="text-white w-[25px] h-[25px]" />
                    ) : (
                        <img src={frontendImage} alt="Uploaded" className="h-full object-cover" />
                    )}
                </div>

                <input
                    type="file"
                    accept="image/*"
                    ref={inputImage}
                    hidden
                    onChange={handleImage}
                />
            </div>

            {/* Next Button */}
            {selectedImage && <button className="min-w-[150px] h-[60px] mt-[30px] text-black font-semibold bg-white rounded-full text-[19px] cursor-pointer"
                onClick={() => navigate("/customize2")}>
                Next
            </button>}

        </div>
    );
}

export default Customize;
