import React, { useState } from "react";
import { DataGrid } from "@mui/x-data-grid";

const _rows = [
  { id: 1, col1: "Hello", col2: "World", col3: "hjh" },
  { id: 2, col1: "DataGridPro", col2: "is Awesome", col3: "jhj" },
  { id: 3, col1: "MUI", col2: "is Amazing", col3: "hgg" },
];

const _columns = [
  { field: "col1", headerName: "Column 1", width: 150 },
  { field: "col2", headerName: "Column 2", width: 150 },
];

function App(props) {
  const [selectionModel, setSelectionModel] = React.useState([])
  const data = [];
  //const [rows, setRows] = useState(props.rows);
  // const [columns, setColumns] = useState(props.columns);

  //console.log(props);

  return (
    <div style={{ height: props.height, width: "100%" }}>
      <DataGrid
        rows={props.rows ? props.rows : _rows}
        columns={props.columns}
        checkboxSelection={props.checkbox}
        onSelectionModelChange={(newSelectionModel) => {
          setSelectionModel(newSelectionModel);
          //console.log(newSelectionModel);
        }}
        selectionModel={selectionModel}
        {...data}
      />
    </div>
  );
}

export default App;

// export default function App() {
//   const [rows, setRows] = useState(_rows);
//   const [columns, setColumns] = useState(this.props.columns);

//   return (
//     <div style={{ height: 300, width: '100%' }}>
//       <DataGrid rows={rows} columns={columns} />
//     </div>
//   );
// }
