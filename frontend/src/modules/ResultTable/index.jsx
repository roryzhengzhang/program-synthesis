import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { useDispatch, useSelector } from 'react-redux';
import Link from '@mui/material/Link';
import Highlighter from "react-highlight-words";
import Typography from '@mui/material/Typography';


const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'review_id', headerName: 'Review ID', width: 100 },
    {
        field: 'review',
        headerName: "Matached review",
        width: 900,
        renderCell: (params) => {
            var text = params.value.text
            var matched = params.value.matched_parts
            return (
                // <div>
                //     {words.map(function(w, index) {
                //         if(index < params.value.start_index || index > params.value.end_index) {
                //             return <div>{w} </div>
                //         } else {
                //             return (<strong>{w} </strong>);
                //         }
                //     })}
                // </div>

                      
                <Highlighter
                    searchWords={[]}
                    textToHighlight={text}
                    findChunks={({searchWords, textToHighlight}) => {
                        var chunks = []
                        matched.map((m) => {
                            let start = textToHighlight.indexOf(m)
                            let end = start + m.length
                            chunks.push({start, end})
                        })


                        // var words = textToHighlight.split(' ');
                        // var chunks = [];
                        // var cur_length = 0
                        // for (var i=0; i<words.length; i++) {
                        //     if (i >= start && i < end) {
                        //         chunks.push({
                        //             start: cur_length,
                        //             end: cur_length+words[i].length
                        //         })
                        //         // move to the start index of the next word
                        //     }
                        //     cur_length += words[i].length + 1
                        // }
                        return chunks
                    }}
                />
            )
        }
    }
    //   { field: 'id', headerName: 'ID', width: 70 },
    //   { field: 'firstName', headerName: 'First name', width: 130 },
    //   { field: 'lastName', headerName: 'Last name', width: 130 },
    //   {
    //     field: 'age',
    //     headerName: 'Age',
    //     type: 'number',
    //     width: 90,
    //   },
    //   {
    //     field: 'fullName',
    //     headerName: 'Full name',
    //     description: 'This column has a value getter and is not sortable.',
    //     sortable: false,
    //     width: 160,
    //     valueGetter: (params) =>
    //       `${params.getValue(params.id, 'firstName') || ''} ${
    //         params.getValue(params.id, 'lastName') || ''
    //       }`,
    //   },
];

const rows = [
    { id: 1, review_id: 1, review: { text: "this is default placeholder", start_index: 2, end_index: 4 } },
    //   { id: 2, lastName: 'Lannister', firstName: 'Cersei', age: 42 },
    //   { id: 3, lastName: 'Lannister', firstName: 'Jaime', age: 45 },
    //   { id: 4, lastName: 'Stark', firstName: 'Arya', age: 16 },
    //   { id: 5, lastName: 'Targaryen', firstName: 'Daenerys', age: null },
    //   { id: 6, lastName: 'Melisandre', firstName: null, age: 150 },
    //   { id: 7, lastName: 'Clifford', firstName: 'Ferrara', age: 44 },
    //   { id: 8, lastName: 'Frances', firstName: 'Rossini', age: 36 },
    //   { id: 9, lastName: 'Roxie', firstName: 'Harvey', age: 65 },
];

export default function ResultTable() {

    const dispatch = useDispatch()
    const searchState = useSelector(state => state.search)

    return (
        <div style={{ height: 400, width: '100%' }}>
            <DataGrid
                // rows={searchState['rows']}
                rows={searchState.rows}
                columns={columns}
                pageSize={5}
                rowsPerPageOptions={[5]}
                checkboxSelection
            />
        </div>
    );
}