import { createSlice } from "@reduxjs/toolkit";


const userSlice = createSlice({
    name:"user",
    initialState: {
        userData:null,
        city:null,
        state:null,
        address:null,
        shopInCity:null,
        itemInCity:null,
        cartItems:[],
        myOrders:[]
},
    reducers:{
        setUserData:(state,action)=>{
            state.userData=action.payload
        },
        setCity:(state,action)=>{
            state.city=action.payload
        },
        setState:(state,action)=>{
            state.state=action.payload
        },
        setAddress:(state,action)=>{
            state.address=action.payload
        },
        setShopInCity:(state,action)=>{
            state.shopInCity=action.payload
        },
        setItemInCity:(state,action)=>{
            state.itemInCity=action.payload
        },
        setCartItems:(state,action)=>{
            const cardItem = action.payload
            const existing = state.cartItems.find(i=>i.id === cardItem.id)
            if(existing){
                existing.quantity += cardItem.quantity
            }else{
                state.cartItems.push(cardItem)
            }
            console.log(state.cartItems)
        },
        removeCartItems:(state,action)=>{
            const {id} = action.payload
            state.cartItems = state.cartItems.filter(i=>i.id !== id)
        },
        updateQuantity:(state,action)=>{
            const {id,quantity} = action.payload
            const item = state.cartItems.find(i=>i.id === id)
            if(item){
                item.quantity = quantity
            }
        },
        setMyOrders:(state,action)=>{
            state.myOrders = action.payload
        },
        addMyOrders:(state,action)=>{
            state.myOrders=[action.payload,...state.myOrders]
        }
    }

})

export const  {setUserData, setCity, setState, setAddress, setShopInCity, setItemInCity , setCartItems ,updateQuantity, removeCartItems, setMyOrders, addMyOrders} = userSlice.actions

export default userSlice.reducer 