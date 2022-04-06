import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { useDispatch, useSelector } from 'react-redux';
import Link from '@mui/material/Link';
import Highlighter from "react-highlight-words";
import Typography from '@mui/material/Typography';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { GridCellExpand, renderCellExpand } from './ExpandCell';

// function HighlighterCellExpand(params){
//   return (
//     <GridCellExpand value={params.value || ''} width={params.colDef.computedWidth} />
//   );
// }

const columns = [
    { field: 'review_id', headerName: 'Review ID', width: 100, flex: 0.45, renderCell: renderCellExpand},
    {
        field: 'review',
        headerName: "Matched Review",
        width: 425,
        flex: 1.618,
        // renderCell: renderCellExpand
        renderCell: (params) => {
            var text = params.value.text
            var matched = params.value.matched_parts
            return (
              // <></>
              // text
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
                        return chunks
                    }}
                />
            )
        }
    },
    { field: 'correct', headerName: 'Correct?', type: 'boolean', checkboxSelection: true, width: 100,
        flex: 0.1, sortable: false, editable: true
    },
    { field: 'notes', headerName: 'Notes', width: 400, flex: 0.38, sortable: false, editable: true,
        renderCell: renderCellExpand
    },
];

const init_rows = [
    { id: 1, review_id: 1, review: { text: "this is default placeholder", matched_parts: "is" }, correct: false, notes: "this is an example of a bad review which extends past the normal bounds" },
    { id: 2, review_id: 2, review: { text: "this is another placeholder", matched_parts: "is another" }, correct: true, notes: "" },
];

const useMutation = () => {
    return React.useCallback((row) =>
        new Promise((resolve) => {
          console.log(row);
          setTimeout(() => {
            resolve(row);
          }, 200)}
        ),
    []);
};

export default function ResultTable() {
    const [snackbar, setSnackbar] = React.useState(null);
    const handleCloseSnackbar = () => setSnackbar(null);

    const dispatch = useDispatch();
    const searchState = useSelector(state => state.search);
    const [rows, setRows] = React.useState(init_rows);
    const mutateRow = useMutation();

    // anytime changes are made to a row, make sure persists on backend and update user by updating snackbar
    const handleCellEditCommit = React.useCallback(
        async (params) => {
          console.log(params);
          try {
            if (params.value) {
              // make HTTP request to save on backend
              const response = await mutateRow({
                id: params.id,
                [params.field]: params.value,
              });
      
              setSnackbar({ children: 'Row successfully saved', severity: 'success' });
              setRows((prev) =>
                prev.map((row) => (row.id === params.id ? { ...row, ...response } : row)),
              );
            }
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
                // rows={init_rows}
                rows={searchState.rows}
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