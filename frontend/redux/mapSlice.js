import { createSlice } from "@reduxjs/toolkit";

const mapSlice = createSlice({
    name:"map",
    initialState:{
        location:{
            lat:null,
            lon:null
        },
        mapAddress:null
    },
    reducers:{
        setLocation:(state,action)=>{
            const {lat,lon} = action.payload
            state.location.lat = lat
            state.location.lon = lon
        },
        setMapAddress:(state,action)=>{
            state.mapAddress  = action.payload
        }
    }
})


export const {setLocation, setMapAddress} = mapSlice.actions

export default mapSlice.reducer;