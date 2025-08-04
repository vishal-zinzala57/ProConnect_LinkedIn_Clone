import { clientServer } from "@/config";
import { createAsyncThunk } from "@reduxjs/toolkit";



// create action and after it is submit
export const loginUser = createAsyncThunk(
    "user/login",
    async (user, thunkApi) => {
        try {
            const response = await clientServer.post("/login", {
                email: user.email,
                password: user.password
            });

            if (response.data.token) {
                localStorage.setItem("token", response.data.token)
            }
            else {
                return thunkApi.rejectWithValue({
                    message: "token not provided"
                })
            }

            return thunkApi.fulfillWithValue(response.data.token)


        } catch (error) {
            return thunkApi.rejectWithValue(error.response.data)
        }
    }
);

export const registerUser = createAsyncThunk(
    "user/register",
    async (user, thunkApi) => {
        try {

            const request = await clientServer.post("/register", {
                username: user.username,
                password: user.password,
                email: user.email,
                name: user.name
            })

        }
        catch (error) {
            return thunkApi.rejectWithValue(error.response.data);
        }
    }
);


export const getAboutUser = createAsyncThunk(
    "user/getAboutUser",
    async (user, thunkApi) => {
        try {

            const response = await clientServer.get("/get_user_and_profile", {
                params: {
                    token: user.token
                }
            })

            return thunkApi.fulfillWithValue(response.data)

        }
        catch (err) {
            return thunkApi.rejectWithValue(err.response.data)
        }
    }
)


export const getAllUsers = createAsyncThunk(
    "user/getAllUsers",
    async (_, thunkApi) => {
        try {

            const response = await clientServer.get("/user/get_all_user")

            return thunkApi.fulfillWithValue(response.data)

        } catch (err) {
            return thunkApi.rejectWithValue(err.response.data)
        }
    }
)

export const sendConnectionRequest = createAsyncThunk(
    "user/sendConnectionRequest",
    async (user, thunkApi) => {
        try {

            const response = await clientServer.post("/user/send_connection_request", {
                token: user.token,
                connectionId: user.user_id
            })

            thunkApi.dispatch(getConnectionRequest({ token: user.token }))

            return thunkApi.fulfillWithValue(response.data);

        }
        catch (err) {
            return thunkApi.rejectWithValue(err.response.data.message);
        }
    }
)

export const    getConnectionRequest = createAsyncThunk(
    "user/getConnectionRequest",
    async (user, thunkApi) => {
        try {

            const response = await clientServer.get("/user/getconnectionrequest", {
                params: {
                    token: user.token
                }
            })

            return thunkApi.fulfillWithValue(response.data.connections);

        }
        catch (err) {
            return thunkApi.rejectWithValue(err.response.data.message);
        }
    }
)

export const getMyConnectionRequest = createAsyncThunk(
    "user/getMyConnectionRequest",
    async (user, thunkApi) => {
        try {

            const response = await clientServer.get("/user/user_connection_request", {
                params: {
                    token: user.token
                }
            })

            return thunkApi.fulfillWithValue(response.data.connections);

        }
        catch (err) {
            return thunkApi.rejectWithValue(err.response.data.message);
        }
    }
)

export const AcceptConnection = createAsyncThunk(
    "user/acceptConnection",
    async (user, thunkApi) => {
        try {

            const response = await clientServer.post("/user/accept_connection_request", {
                token: user.token,
                requestId: user.connectionId,
                action_type: user.action
            })
            thunkApi.dispatch(getConnectionRequest({token : user.token}));
            thunkApi.dispatch(getMyConnectionRequest({token : user.token}));

            return thunkApi.fulfillWithValue(response.data.connections);

        }
        catch (err) {
            return thunkApi.rejectWithValue(err.response.data.message);
        }
    }
)
