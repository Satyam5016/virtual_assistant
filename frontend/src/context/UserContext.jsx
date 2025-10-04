import React, { createContext, useState, useEffect } from "react";
import axios from "axios"; // ✅ Import axios

export const UserDataContext = createContext();

function UserContext({ children }) {
    const serverUrl = "https://virtualassistant-backend-47fz.onrender.com";
    const [userData, setUserData] = useState(null);
    const [frontendImage, setFrontendImage] = useState(null);
    const [backendImage, setBackendImage] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);

    // ✅ Get current user (if logged in)
    const handleCurrentUser = async () => {
        try {
            const result = await axios.get(`${serverUrl}/api/user/current`, {
                withCredentials: true,
            });
            setUserData(result.data);
            console.log("Current user:", result.data);
        } catch (error) {
            console.log("No user logged in:", error.response?.data || error.message);
            setUserData(null);
        }
    };


    const getGeminiResponse = async (command) => {
        try {
            const result = await axios.post(
                `${serverUrl}/api/user/asktoassistant`,
                { command },
                { withCredentials: true }
            )
            return result.data
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        handleCurrentUser();
    }, []);

    const value = {
        serverUrl,
        userData,
        setUserData, backendImage, setBackendImage, frontendImage, setFrontendImage, selectedImage, setSelectedImage, getGeminiResponse
    };

    return (
        <UserDataContext.Provider value={value}>
            {children}
        </UserDataContext.Provider>
    );
}

export default UserContext;
