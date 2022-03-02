import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { useDispatch, useSelector } from 'react-redux';
import Link from '@mui/material/Link';
import Highlighter from "react-highlight-words";
import Typography from '@mui/material/Typography';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { GridCellExpand, renderCellExpand } from './ExpandCell';

const columns = [
    { field: 'id', headerName: 'ID', width: 70, flex: 0.0625 },
    { field: 'review_id', headerName: 'Review ID', width: 100, flex: 0.125},
    {
        field: 'review',
        headerName: "Matched review",
        width: 425,
        flex: 1.0,
        renderCell: (params) => {
            var text = params.value.text
            var matched = params.value.matched_parts
            return (
                <></>
                // <div>
                //     {words.map(function(w, index) {
                //         if(index < params.value.start_index || index > params.value.end_index) {
                //             return <div>{w} </div>
                //         } else {
                //             return (<strong>{w} </strong>);
                //         }
                //     })}
                // </div>

                      
            //     <Highlighter
            //         searchWords={[]}
            //         textToHighlight={text}
            //         findChunks={({searchWords, textToHighlight}) => {
            //             var chunks = []
            //             matched.map((m) => {
            //                 let start = textToHighlight.indexOf(m)
            //                 let end = start + m.length
            //                 chunks.push({start, end})
            //             })


            //             // var words = textToHighlight.split(' ');
            //             // var chunks = [];
            //             // var cur_length = 0
            //             // for (var i=0; i<words.length; i++) {
            //             //     if (i >= start && i < end) {
            //             //         chunks.push({
            //             //             start: cur_length,
            //             //             end: cur_length+words[i].length
            //             //         })
            //             //         // move to the start index of the next word
            //             //     }
            //             //     cur_length += words[i].length + 1
            //             // }
            //             return chunks
            //         }}
            //     />
            )
        }
    },
    { field: 'correct', headerName: 'Correct?', type: 'boolean', checkboxSelection: true, width: 100,
        flex: 0.125, editable: true
    },
    { field: 'notes', headerName: 'Notes', width: 400, flex: 1.0, editable: true,
        renderCell: renderCellExpand
    },
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

const init_rows = [
    { id: 1, review_id: 1, review: { text: "this is default placeholder", start_index: 2, end_index: 4 } },
    { id: 2, review_id: 2, review: { text: "this is another placeholder", start_index: 2, end_index: 4 } },
    { id: 3, review_id: 3, review: { text: "", start_index: 2, end_index: 4 } },
    { id: 4, review_id: 4, review: { text: "", start_index: 2, end_index: 4 } },
];

// function useApiRef() {
//     const apiRef = React.useRef(null);
//     const _columns = React.useMemo(() => {
//         columns.concat({
//             field: "__HIDDEN__",
//             width: 0,
//             renderCell: (props) => {
//                 apiRef.current = props.api;
//                 return null;
//             }
//         })
//     }, [columns]);

//     return {apiRef, columns: _columns};
// }

const useMutation = () => {
    return React.useCallback(
      (user) =>
        new Promise((resolve) =>
          setTimeout(() => {
            resolve(user);
          }, 200),
        ),
      [],
    );
  };

export default function ResultTable() {
    // const {apiRef, columns} = useApiRef();
    const [snackbar, setSnackbar] = React.useState(null);
    const handleCloseSnackbar = () => setSnackbar(null);

    const dispatch = useDispatch();
    const searchState = useSelector(state => state.search);
    const [rows, setRows] = React.useState(init_rows);
    const mutateRow = useMutation();

    // anytime changes are made to a row, make sure persists on backend and update user by updating snackbar
    const handleCellEditCommit = React.useCallback(
        async (params) => {
          try {
            // make HTTP request to save on backend
            const response = await mutateRow({
              id: params.id,
              [params.field]: params.value,
            });
    
            setSnackbar({ children: 'Row successfully saved', severity: 'success' });
            setRows((prev) =>
              prev.map((row) => (row.id === params.id ? { ...row, ...response } : row)),
            );
          } catch (error) {
            setSnackbar({ children: 'Error while saving row', severity: 'error' });
            // Restore the row in case of error
            setRows((prev) => [...prev]);
          }
        },
        [mutateRow],
    );

    return (
        <div style={{ height: '61.8vh', width: '100%' }} >
            <DataGrid
                // rows={searchState['rows']}
                rows={init_rows}
                // rows={searchState.rows}
                columns={columns}
                pageSize={5}
                rowsPerPageOptions={[5]}
                onCellEditCommit={handleCellEditCommit}
            />
            {!!snackbar && (
              <Snackbar open onClose={handleCloseSnackbar} autoHideDuration={6000}>
                <Alert {...snackbar} onClose={handleCloseSnackbar} />
              </Snackbar>
            )}
        </div>
    );
}