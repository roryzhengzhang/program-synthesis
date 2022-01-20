import * as React from 'react';
import Box from '@mui/material/Box';
import SearchBar from '../SearchBar';
import ResultTable from '../ResultTable';
import { Container } from '@mui/material';
import { spacing } from '@mui/system';
import Grid from '@mui/material/Grid';
import CircularIndeterminate from '../CircularProgress';
import { useSelector } from 'react-redux';

const theme = {
    spacing: 10,
}

function SearchEngine() {

    React.useEffect(() => {
        console.log("search engine loaded")
    }, [])

    const searchState = useSelector(state => state.search)

    return (
        <Box sx={{ mt: 10 }}>
            <Container>
                <Grid spacing={20} sx={{ mb: 5 }} display="flex" justifyContent="center" alignItems="center">
                    <Grid>
                        <SearchBar />
                    </Grid>
                    {
                        searchState['status'] == 'pending' &&
                        <Grid sx={{ ml: 2 }}>
                            <CircularIndeterminate />
                        </Grid>
                    }
                </Grid>
                <Grid>
                    <ResultTable />
                </Grid>
            </Container>
        </Box>
    )
}

export default {
    routeProps: {
        path: "/",
        element: <SearchEngine />
    },
    name: 'SearchEngine'
};