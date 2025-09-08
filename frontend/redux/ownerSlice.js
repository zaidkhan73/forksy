import { createSlice } from "@reduxjs/toolkit";

const ownerSlice = createSlice({
    name:"owner",
    initialState:{
        shopData:null,
        shopItem:null
    },
    reducers:{
        setShopData:(state,action)=>{
            state.shopData = action.payload
        },
        setShopItem:(state,action)=>{
            state.shopItem = action.payload
        }
    }
})

export const {setShopData,setShopItem} = ownerSlice.actions;

export default ownerSlice.reducer;