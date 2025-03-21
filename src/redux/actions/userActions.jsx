import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import {
  config,
  handleError,
  configMultiPart,
} from "../../Common/configurations";
import { URL } from "../../Common/api";
import { toast } from "react-toastify";

export const logout = createAsyncThunk(
  "user/logout",
  async (userCredentials, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${URL}/user/logout`, config);

      return data;
    } catch (error) {
      return handleError(error, rejectWithValue);
    }
  }
);

export const getUserDataFirst = createAsyncThunk(
  "user/getUserDataFirst",
  async (userCredentials, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${URL}/user`, config);

      return data;
    } catch (error) {
      return handleError(error, rejectWithValue);
    }
  }
);

export const loginUser = createAsyncThunk(
  "user/loginUser",
  async (userCredentials, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(
        `${URL}/auth/login`,
        userCredentials,
        config
      );

      return data;
    } catch (error) {
      console.log(error);

      return handleError(error, rejectWithValue);
    }
  }
);

export const loginUserWithPhone = createAsyncThunk(
  "user/loginUser",
  async (userCredentials, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(
        `${URL}/auth/login-with-phone`,
        userCredentials,
        config
      );

      return data;
    } catch (error) {
      console.log(error);

      return handleError(error, rejectWithValue);
    }
  }
);

export const googleLoginOrSignUp = createAsyncThunk(
  "user/googleLoginOrSignUp",
  async (userCredentials, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(
        `${URL}/auth/google`,
        { token: userCredentials.credential },
        config
      );

      return data;
    } catch (error) {
      return handleError(error, rejectWithValue);
    }
  }
);

export const signUpUser = createAsyncThunk(
  "user/signUpUser",
  async (userCredentials, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(
        `${URL}/auth/signup`,
        userCredentials,
        configMultiPart
      );

      return data;
    } catch (error) {
      return handleError(error, rejectWithValue);
    }
  }
);

export const editUserProfile = createAsyncThunk(
  "user/editUserProfile",
  async (formData, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(
        `${URL}/user/edit-profile`,
        formData,
        configMultiPart
      );
      toast.success("Profile updated successfully");
      return data;
    } catch (error) {
      return handleError(error, rejectWithValue);
    }
  }
);
