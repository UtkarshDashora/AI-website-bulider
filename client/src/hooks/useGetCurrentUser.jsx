import { useState, useEffect } from "react";
import axios from "axios";
import { serverUrl } from "../App";
import { useDispatch } from "react-redux";
import { setUser as setReduxUser } from "../redux/Userslice";

export const useGetCurrentUser = () => {
    const dispatch = useDispatch();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchUser = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get(`${serverUrl}/api/user`, {
                withCredentials: true
            });
            setUser(data);
            dispatch(setReduxUser(data));
            setError(null);
        } catch (err) {
            setUser(null);
            dispatch(setReduxUser(null));
            setError(err.response?.data?.message || err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUser();
    }, []);

    return { user, loading, error, refreshUser: fetchUser };
};