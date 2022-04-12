import * as React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Highlighter from "react-highlight-words";
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';

function isOverflown(element) {
  return (
    element.scrollHeight > element.clientHeight ||
    element.scrollWidth > element.clientWidth
  );
}

export const GridCellExpand = React.memo(function GridCellExpand(props) {
  const { width, value, matched_parts } = props;
  const wrapper = React.useRef(null);
  const cellDiv = React.useRef(null);
  const cellValue = React.useRef(null);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [showFullCell, setShowFullCell] = React.useState(false);
  const [showPopper, setShowPopper] = React.useState(false);

  const handleMouseEnter = () => {
    const isCurrentlyOverflown = isOverflown(cellValue.current);
    setShowPopper(isCurrentlyOverflown);
    setAnchorEl(cellDiv.current);
    setShowFullCell(true);
  };

  const handleMouseLeave = () => {
    setShowFullCell(false);
  };

  React.useEffect(() => {
    if (!showFullCell) {
      return undefined;
    }

    function handleKeyDown(nativeEvent) {
      // IE11, Edge (prior to using Bink?) use 'Esc'
      if (nativeEvent.key === 'Escape' || nativeEvent.key === 'Esc') {
        setShowFullCell(false);
      }
    }

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [setShowFullCell, showFullCell]);

  return (
    <Box
      ref={wrapper}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      sx={{
        alignItems: 'center',
        lineHeight: '24px',
        width: 1,
        height: 1,
        position: 'relative',
        display: 'flex',
      }}
    >
      <Box
        ref={cellDiv}
        sx={{
          height: 1,
          width,
          display: 'block',
          position: 'absolute',
          top: 0,
        }}
      />
      <Box
        ref={cellValue}
        sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
      >
        {matched_parts ? 
        <Highlighter
        searchWords={[]}
        textToHighlight={value}
        findChunks={({searchWords, textToHighlight}) => {
            var chunks = []
            matched_parts.map((m) => {
                let start = textToHighlight.indexOf(m)
                let end = start + m.length
                chunks.push({start, end})
            })
            return chunks
        }}
        /> : value}
      </Box>
      {showPopper && (
        <Popper
          open={showFullCell && anchorEl !== null}
          anchorEl={anchorEl}
          style={{ width }}
          modifiers={[{
            name: 'preventOverflow',
            options: {
              padding: 17,
              mainAxis: true,
              altAxis: false
            },
            name: 'flip',
            options: {
              padding: 17,
            },
            name: 'offset',
            options: {
              offset: [-17,0]
            }
          }]}
        >
          <Paper
            elevation={1}
            style={{ minHeight: wrapper.current.offsetHeight - 3 }}
          >
            <Typography variant="body2" style={{ padding: 8 }}>
              {matched_parts ? 
              <Highlighter
              searchWords={[]}
              textToHighlight={value}
              findChunks={({searchWords, textToHighlight}) => {
                  var chunks = []
                  matched_parts.map((m) => {
                      let start = textToHighlight.indexOf(m)
                      let end = start + m.length
                      chunks.push({start, end})
                  })
                  return chunks
              }}
              /> : value}
            </Typography>
          </Paper>
        </Popper>
      )}
    </Box>
  );
});

GridCellExpand.propTypes = {
  width: PropTypes.number.isRequired,
};

export function renderCellExpand(params) {
  let width = params.colDef.computedWidth;

  if (params.field === "review_id") width = width * 1.382;

  return (
    <GridCellExpand value={params.value || ''} width={width}/>
  );
}

renderCellExpand.propTypes = {
  /**
   * The column of the row that the current cell belongs to.
   */
  colDef: PropTypes.object.isRequired,
  /**
   * The cell value, but if the column has valueGetter, use getValue.
   */
  value: PropTypes.string.isRequired,
};