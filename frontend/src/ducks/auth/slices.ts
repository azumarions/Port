import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../app/store";
import axios from "axios";
import { PROPS_AUTHEN, PROPS_PROFILE, PROPS_NAME } from "./types";

const apiUrl = process.env.REACT_APP_DEV_API_URL;

export const fetchAsyncLogin = createAsyncThunk(
    "auth/post",
    async (authen: PROPS_AUTHEN) => {
      const res = await axios.post(`${apiUrl}authen/jwt/create`, authen, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      return res.data;
    }
  );

export const fetchAsyncRegister = createAsyncThunk(
    "auth/register",
    async (auth: PROPS_AUTHEN) => {
      const res = await axios.post(`${apiUrl}api/register/`, auth, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      return res.data;
    }
  );
  
export const fetchAsyncCreateProf = createAsyncThunk(
    "profile/post",
    async (name: PROPS_NAME) => {
      const res = await axios.post(`${apiUrl}api/profile/`, name, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `JWT ${localStorage.localJWT}`,
        },
      });
      return res.data;
    }
  );

export const fetchAsyncUpdateProf = createAsyncThunk(
  "profile/put",
  async (profile: PROPS_PROFILE) => {
    const uploadData = new FormData();
    uploadData.append("name", profile.name);
    profile.statusMessage && uploadData.append("msg", profile.statusMessage);
    profile.description && uploadData.append("desc", profile.description);
    profile.img && uploadData.append("img", profile.img, profile.img.name);
    const res = await axios.put(
      `${apiUrl}api/profile/${profile.id}/`,
      uploadData,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `JWT ${localStorage.localJWT}`,
        },
      }
    );
    return res.data;
  }
);

export const fetchAsyncGetMyProf = createAsyncThunk("profile/get", async () => {
  const res = await axios.get(`${apiUrl}api/myprofile/`, {
    headers: {
      Authorization: `JWT ${localStorage.localJWT}`,
    },
  });
  return res.data[0];
});

export const fetchAsyncGetProfs = createAsyncThunk("profiles/get", async () => {
  const res = await axios.get(`${apiUrl}api/profile/`, {
    headers: {
      Authorization: `JWT ${localStorage.localJWT}`,
    },
  });
  return res.data;
});


export const authSlice = createSlice({
    name: 'auth',
    initialState: {
        isLoadingAuth: false,
        myprofile: {
          id: 0,
          userProfile: 0,
          name: "",
          statusMessage: "",
          description: "",   
          created_at: "",
          updated_at: "",
          img: "",
        },
        profiles: [
          {
            id: 0,
            userProfile: 0,
            name: "",
            statusMessage: "",
            description: "",   
            created_at: "",
            updated_at: "",
            img: "",
          },
        ],
      },
    reducers: {
        fetchCredStart(state) {
            state.isLoadingAuth = true;
        },
        fetchCredEnd(state) {
            state.isLoadingAuth = false;
        },
        editName(state, action) {
            state.myprofile.name = action.payload
        }
    },
    extraReducers: (builder) => {
        builder.addCase(fetchAsyncLogin.fulfilled, (state, action) => {
          localStorage.setItem("localJWT", action.payload.access);
        });
        builder.addCase(fetchAsyncCreateProf.fulfilled, (state, action) => {
          state.myprofile = action.payload;
        });
        builder.addCase(fetchAsyncGetMyProf.fulfilled, (state, action) => {
          state.myprofile = action.payload;
        });
        builder.addCase(fetchAsyncGetProfs.fulfilled, (state, action) => {
          state.profiles = action.payload;
        });
        builder.addCase(fetchAsyncUpdateProf.fulfilled, (state, action) => {
          state.myprofile = action.payload;
          state.profiles = state.profiles.map((prof) =>
            prof.id === action.payload.id ? action.payload : prof
          );
        });
    },
});

export const {
    fetchCredStart,
    fetchCredEnd,
    editName
} = authSlice.actions;

export const selectIsLoadingAuth = (state: RootState) => state.auth.isLoadingAuth;
export const selectProfile = (state: RootState) => state.auth.myprofile;
export const selectProfiles = (state: RootState) => state.auth.profiles;

export default authSlice.reducer;