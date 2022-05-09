import React from "react";
import { DataGrid } from "@mui/x-data-grid";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import {
  FormIt,
  WSM,
} from "https://formit3d.github.io/SharedPluginUtilities/FormIt.mod.js";

const _rows = [
  { id: 1, col1: "Hello", col2: "World", col3: "hjh" },
  { id: 2, col1: "DataGridPro", col2: "is Awesome", col3: "jhj" },
  { id: 3, col1: "MUI", col2: "is Amazing", col3: "hgg" },
];

const _columns = [
  { field: "col1", headerName: "Column 1", width: 150 },
  { field: "col2", headerName: "Column 2", width: 150 },
  { field: "col3", headerName: "Column 2", width: 150 },
];

function App (props) {
  const [layers, setLayers] = React.useState([]);
  const [open, setOpen] = React.useState(false);
  const [selectionModel, setSelectionModel] = React.useState([]);
  const [rowsGrid0, setRowsGrid0] = React.useState([]);
  const [rowsGrid1, setRowsGrid1] = React.useState([]);
  const data = [];

  const colsGrid0 = [
    { field: "col1", headerName: "용도", width: 100 },
    { field: "col2", headerName: "동", width: 100 },
    { field: "col3", headerName: "층수", width: 100 },
    { field: "col4", headerName: "연면적", width: 120 },
  ];

  const colsGrid1 = [
    { field: "col1", headerName: "동", width: 100 },
    { field: "col2", headerName: "구분", width: 100 },
    { field: "col3", headerName: "층수", width: 100 },
    { field: "col4", headerName: "면적", width: 120 },
  ];
  const colsGrid2 = [
    { field: "col1", headerName: "사업", width: 150 },
    { field: "col2", headerName: "시설", width: 150 },
    { field: "col3", headerName: "레이어", width: 150 },
  ];

  const callApi = async (api) => {
    const response = await fetch(api);
    const body = await response.json();
    return body;
  };

  const convertUnit = (val, unit) => {
    let val2 = 0;
    if (unit === 0) {
      val2 = 1;
    } else if (unit === 1) {
      val2 = 0.09290304;
    } else if (unit === 2) {
      val2 = 12;
    } else if (unit === 3) {
      val2 = 0.09290304;
    } else if (unit === 4) {
      val2 = 0.09290304;
    }

    // let a = FormIt.UnitType.kImperialFeetInches;
    // let b = FormIt.UnitType.kMetricMeter;
    // let c = FormIt.UnitType.kImperialInches;
    // let d = FormIt.UnitType.kMetricCentimeter;
    // let e = FormIt.UnitType.kMetricMillimeter;
    // console.log(a, b, c, d, e);

    return val * val2;
  };

  const handleClick = (e) => {
    e.preventDefault();
    handleLayers();
    setOpen(true);
  };

  const handleSetLayer = async (e) => {
    e.preventDefault();
    setOpen(false);

    for (let i = 0; i < selectionModel.length; i++) {
      const layerModel = selectionModel[i];
      const cur = layers.find((x) => x.id === layerModel);

      await FormIt.Layers.AddLayer(0, cur.col3, true);
    }

    alert(selectionModel.length + " 개의 레이어를 추가했습니다.");

    setSelectionModel([]);
  };

  const handleClose = (event) => {
    setSelectionModel([]);
    setOpen(false);
  };

  // 용도별 면적표
  const handleLayers = (e) => {
    console.log("handleGet: start: ", e);

    let rows = [];

    callApi("/api/layer")
      .then((res) => {
        for (var i = 0; i < res.length; i++) {
          rows.push({
            id: res[i].ID,
            col1: res[i].NM_BUIS,
            col2: res[i].NM_FCLTY,
            col3: res[i].NM_LAYR,
          });
          //console.log("handleGet: end: ", rows);
        }
        setLayers(rows);
      })
      .catch((err) => console.log(err));

    console.log("handleGet: end: ", layers);
  };

  // 용도별 면적표
  const handleGetArea = async (e) => {
    console.log("handleGetArea: start: ");

    let selection = await FormIt.Selection.GetSelections();

    let history = 0;

    let allBody = await WSM.APIGetAllObjectsByTypeReadOnly(history, 1); // 1=nBodyType
    //console.log("allBody", allBody);

    let buildings = [];
    for (var i = 0; i < allBody.length; i++) {
      let curId = allBody[i];

      let layerId = await WSM.APIGetObjectLayersReadOnly(history, curId);

      let layerData = await WSM.APIGetLayerDataReadOnly(history, layerId[0]);

      var objectProps = await WSM.APIGetObjectPropertiesReadOnly(
        history,
        curId
      );

      var objectLevels = await WSM.APIGetObjectLevelsReadOnly(history, curId);

      let sumArea = 0;
      for (var j = 0; j < objectLevels.length; j++) {
        let curLevelId = objectLevels[j];
        let area = await FormIt.Levels.GetAreaForObjects(
          history,
          curLevelId,
          curId
        );

        let levelData = await WSM.APIGetLevelDataReadOnly(history, curLevelId);
        if (levelData.dElevation < 0) {
          continue;
        }

        sumArea = sumArea + convertUnit(area, FormIt.UnitType.kMetricMeter);
        sumArea = Number(sumArea.toFixed(2));
      }

      sumArea = Number(sumArea.toFixed(2));

      buildings.push({
        id: curId,
        col1: layerData.name,
        col2: objectProps.sObjectName,
        col3: objectLevels.length,
        col4: sumArea,
      });
    }

    await setRowsGrid0(buildings.map((row) => ({ ...row })));

    console.log("handleGetArea: end");
  };

  // 동/층별 면적표
  const handleGetAreaPerDong = async (e) => {
    console.log("handleGetAreaPerDong: start");

    let history = 0;

    let allBody = await WSM.APIGetAllObjectsByTypeReadOnly(history, 1); // 1=nBodyType

    let levels = [];

    let id = 0;
    for (var i = 0; i < allBody.length; i++) {
      let curId = allBody[i];

      var objectProps = await WSM.APIGetObjectPropertiesReadOnly(
        history,
        curId
      );

      // 현재 body의 levels 가져오기
      var objectLevels = await WSM.APIGetObjectLevelsReadOnly(history, curId);
      let levelsData = [];

      for (var j = 0; j < objectLevels.length; j++) {
        let curLevelId = objectLevels[j];
        let area = await FormIt.Levels.GetAreaForObjects(
          history,
          curLevelId,
          curId
        );
        if (area === 0) {
          continue;
        }

        let levelData = await WSM.APIGetLevelDataReadOnly(history, curLevelId);

        let data = {
          id: curLevelId,
          dElevation: levelData.dElevation,
          sLevelName: levelData.sLevelName,
        };
        levelsData.push(data);
      }

      // elevation으로 정렬 (지하->지상)
      levelsData.sort(function (a, b) {
        if (a.dElevation > b.dElevation) {
          return 1;
        }
        if (a.dElevation < b.dElevation) {
          return -1;
        }
        // a must be equal to b
        return 0;
      });

      let firstLevelId = levelsData[0].id;

      let beforeLevelArea = await FormIt.Levels.GetAreaForObjects(
        history,
        firstLevelId,
        curId
      );

      beforeLevelArea = Number(beforeLevelArea.toFixed(2));

      let beforeLevelName = "";
      let lastLevelName = "";

      let floorCount = 0;

      let curArea = 0;
      let beforeArea = 0;
      let strLevel = "";

      let bPush = false;

      for (var k = 0; k < levelsData.length; k++) {
        let curLevelId = levelsData[k].id;
        let curLevelName = levelsData[k].sLevelName;
        curArea = await FormIt.Levels.GetAreaForObjects(
          history,
          curLevelId,
          curId
        );
        curArea = convertUnit(curArea, FormIt.UnitType.kMetricMeter);
        curArea = Number(curArea.toFixed(2));

        if (beforeArea === 0) {
          beforeArea = curArea;
          beforeLevelName = curLevelName;
          floorCount++;
          continue;
        }

        if (curArea !== beforeArea) {
          if (floorCount === 1) {
            strLevel = beforeLevelName;
          } else {
            strLevel = beforeLevelName + "~" + lastLevelName;
          }
          levels.push({
            id: id,
            col1: objectProps.sObjectName,
            col2: strLevel,
            col3: floorCount,
            col4: beforeArea,
          });

          floorCount = 1;
          bPush = true;
          beforeArea = curArea;
          beforeLevelName = curLevelName;
        } else {
          lastLevelName = curLevelName;
          floorCount++;
          id++;
        }
      }

      id++;

      if (bPush && floorCount > 0) {
        if (floorCount === 1) {
          strLevel = beforeLevelName;
        } else {
          strLevel = beforeLevelName + "~" + lastLevelName;
        }
        levels.push({
          id: id,
          col1: objectProps.sObjectName,
          col2: strLevel,
          col3: floorCount,
          col4: beforeArea,
        });
      } else if (bPush === false && floorCount > 0) {
        levels.push({
          id: id,
          col1: objectProps.sObjectName,
          col2: beforeLevelName + "~" + lastLevelName,
          col3: floorCount,
          col4: beforeArea,
        });
      }

      await setRowsGrid1(levels.map((row) => ({ ...row })));
    }

    console.log("handleGetAreaPerDong: end");
  };

  console.log("render");
  console.log("render", selectionModel);

  return (
    <div style={{ height: 400, width: "100%" }}>
      <Button variant="contained" color="primary" onClick={handleGetArea}>
        용도별면적표
      </Button>
      <Button
        variant="contained"
        color="primary"
        onClick={handleGetAreaPerDong}
      >
        층별면적표
      </Button>
      <Button variant="contained" color="primary" onClick={handleClick}>
        OPEN
      </Button>

      <DataGrid
        rows={rowsGrid0}
        columns={colsGrid0}
        checkboxSelection
        disableSelectionOnClick
      />
      <DataGrid
        rows={rowsGrid1}
        columns={colsGrid1}
        checkboxSelection
        disableSelectionOnClick
      />

      <Dialog open={open} onClose={handleClose} fullWidth>
        <DialogTitle>레이어추가</DialogTitle>
        <DialogContent>
          <div style={{ height: 400, width: "100%" }}>
            <DataGrid
              rows={layers}
              columns={colsGrid2}
              rowsPerPageOptions={[5]}
              checkboxSelection
              disableSelectionOnClick
              onSelectionModelChange={(newSelectionModel) => {
                setSelectionModel(newSelectionModel);
                //console.log(newSelectionModel);
              }}
              selectionModel={selectionModel}
              {...data}
            />
          </div>
        </DialogContent>

        <DialogActions>
          <Button variant="contained" color="primary" onClick={handleSetLayer}>
            추가
          </Button>

          <Button variant="outlined" color="primary" onClick={handleClose}>
            닫기
          </Button>
        </DialogActions>
      </Dialog>
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
