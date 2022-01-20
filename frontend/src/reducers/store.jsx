import { configureStore } from '@reduxjs/toolkit'
import SearchReducer from '../modules/SearchEngine/SearchEngineSlice'

export default configureStore({
    reducer: {
        search: SearchReducer
    }
})