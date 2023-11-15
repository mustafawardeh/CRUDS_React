import { configureStore } from '@reduxjs/toolkit'
import TableSlice from './TableSlice'

export const store = configureStore({
    reducer:{
        Table: TableSlice
    }
})
