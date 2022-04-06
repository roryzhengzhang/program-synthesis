import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

const initialState = {
    pattern: "",
    status: "completed",
    rows: []
}

export const SumbitPattern = createAsyncThunk('search/submit', async (request, {getState}) => {
    var url = new URL("http://35.192.69.224:5000/submit")

    const state = getState()

    const params = {
        pattern: state.search.pattern
    }

    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]))

    const data = await fetch(url, {mode: "cors"}).then((res) => res.json())

    return data
})

const SearchEngineSlice = createSlice({
    name: "search",
    initialState,
    reducers: {
        setPattern(state, action) {
            const pattern = action.payload.pattern
            state.pattern = pattern
            return state
        }
    },
    extraReducers: {
        [SumbitPattern.pending]: (state, action) => {
            return {
                ...state,
                status: "pending"
            }
        },
        [SumbitPattern.fulfilled]: (state, action) => {
            const data = action.payload;
            return {
                ...state,
                status: "completed",
                rows: data['rows']
            }
        }
    }
});



export default SearchEngineSlice.reducer;
export const { setPattern } = SearchEngineSlice.actions;