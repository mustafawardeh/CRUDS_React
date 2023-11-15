import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    tableData: []
}

export const TableSlice = createSlice({
    name: 'shop',
    initialState,
    reducers: {
        addToTable: (state, action) => {
            state.tableData.push(action.payload)
        },
        editRow: (state, action) => {
            const index = state.tableData.findIndex(row => Number(row.id) === Number(action.payload.id))
            if (index !== -1) {
                // If the row with the matching ID is found
                state.tableData[index] = action.payload;
            }

        },
        deleteRow: (state, action) => {
            state.tableData = state.tableData.filter(row => Number(row.id) != Number(action.payload))
        },
        resetData: (state) => {
            state.tableData = []
        },

    }
});

export const { addToTable, editRow, deleteRow, resetData } = TableSlice.actions;

export default TableSlice.reducer;