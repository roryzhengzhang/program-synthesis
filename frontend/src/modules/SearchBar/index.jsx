import * as React from 'react';
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';
import { useDispatch, useSelector } from 'react-redux';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import { setPattern } from '../SearchEngine/SearchEngineSlice';
import { SumbitPattern } from '../SearchEngine/SearchEngineSlice';

export default function CustomizedInputBase() {
    const dispatch = useDispatch()

    const searchState = useSelector(state => state.search)

    const patternChange = (event) => {
        dispatch(setPattern({pattern: event.target.value}))
    }

    const handleSearch = () => {
        dispatch(SumbitPattern())
    }

    return (
        <Paper
            component="form"
            sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: 600 }}
        >
            <IconButton sx={{ p: '10px' }} aria-label="menu">
                <MenuIcon />
            </IconButton>
            <InputBase
                sx={{ ml: 1, flex: 1 }}
                placeholder="Enter your pattern"
                inputProps={{ 'aria-label': 'search google maps' }}
                onChange={patternChange}
            />
            <IconButton sx={{ p: '10px' }} aria-label="search" onClick={handleSearch}>
                <SearchIcon />
            </IconButton>
        </Paper>
    );
}