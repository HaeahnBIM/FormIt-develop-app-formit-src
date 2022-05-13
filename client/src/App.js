import React from "react";
import { DataGrid } from "@mui/x-data-grid";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
//import { FormIt, WSM } from "https://formit3d.github.io/SharedPluginUtilities/FormIt.mod.js";

// 수정

let WSM = window.WSM;
let FormIt = window.FormIt;

//const baseuri = "api/";
const baseuri = "https://ueapi.haeahn.com/api/formit/";

function App(props) {
  const [layers, setLayers] = React.useState([]);
  const [plan, setPlan] = React.useState([]);
  const [open, setOpen] = React.useState(false);
  const [openPlan, setOpenPlan] = React.useState(false);
  const [selectionModel, setSelectionModel] = React.useState([]);
  const [rowsGrid0, setRowsGrid0] = React.useState([]);
  const [rowsGrid1, setRowsGrid1] = React.useState([]);
  const data = [];

  const handleSetting = (e) => {
    e.preventDefault();
    handleLayers();
    setOpen(true);
  };

  const handleProject = (e) => {
    e.preventDefault();
    handleProjectPlan();
    setOpenPlan(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    handleSavePlan();
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

  const handleClosePlan = (event) => {
    setOpenPlan(false);
  };

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
  const colsGrid3 = [
    { field: "col1", headerName: "프로젝트", width: 80 },
    { field: "col2", headerName: "건축면적", width: 80 },
    { field: "col3", headerName: "건폐율", width: 80 },
    { field: "col4", headerName: "연면적", width: 80 },
    { field: "col5", headerName: "지상연면적", width: 80 },
    { field: "col6", headerName: "주거연면적", width: 80 },
    { field: "col7", headerName: "용적률", width: 80 },
    { field: "col8", headerName: "주거용적률", width: 80 },
    { field: "col9", headerName: "지하주차대수", width: 80 },
    { field: "col10", headerName: "지상주차대수", width: 80 },
  ];

  const callApi = async (api) => {
    const response = await fetch(api);
    const body = await response.json();
    return body;
  };

  // const postApi = (api, bodyJson) => {
  //   console.log("postApi: start: ",api, bodyJson);

  //   fetch(api, {
  //     method: 'POST',
  //     headers: {
  //         'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify(bodyJson)
  //   })
  //   .then(response => response.json())
  //   .then(response => {
  //     if (response.token) {
  //       localStorage.setItem('wtw-token', response.token);
  //     }
  //   })
  // };

  const postApi = async (api, bodyJson) => {
    console.log("postApi: start: ", api, bodyJson);

    const res = await fetch(api, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bodyJson),
    });
    // .then((response) => response.json())
    // .then((response) => {
    //   if (response.token) {
    //     //console.log("postApi: end: ", response.kson);
    //     localStorage.setItem("wtw-token", response.token);
    //   }
    // });

    //console.log("postApi: end: ", res);

    //const body = await res.json();
    //console.log("postApi: end: ", body);
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

  // 프로젝트정보가져오기
  const handleProjectPlan = (e) => {
    console.log("handleProjectPlan: start: ", e);

    let rows = [];

    callApi(baseuri + "projects/plans")
      .then((res) => {
        for (var i = 0; i < res.length; i++) {
          rows.push({
            id: i,
            col1: res[i].NM_PROJ,
            col2: res[i].AREA_BLD,
            col3: res[i].RATE_BLDCV,
            col4: res[i].AREA_TTA,
            col5: res[i].AREA_ALL_GRND,
            col6: res[i].AREA_HUS_GRND,
            col7: res[i].RATE_ALL_GRND,
            col8: res[i].RATE_HUS_GRND,
            col9: res[i].NMBR_UNDG_PRKN,
            col10: res[i].NMBR_GRND_PRKN,
          });
          //console.log("handleProjectPlan: ", rows);
        }
        setPlan(rows);
      })
      .catch((err) => console.log(err));

    console.log("handleProjectPlan: end: ", plan);
  };

  const fortmatResponse = (res) => {
    return JSON.stringify(res, null, 2);
  };

  const calcAreaBld = async () => {
    // 건축면적 계산

    const history = 0;

    const allBody = await WSM.APIGetAllObjectsByTypeReadOnly(history, 1); // 1=nBodyType

    let area = 0;
    for (var i = 0; i < allBody.length; i++) {
      const curId = allBody[i];

      const layerId = await WSM.APIGetObjectLayersReadOnly(history, curId);

      const layerData = await WSM.APIGetLayerDataReadOnly(history, layerId[0]);

      if (layerData.name !== "근생") {
        continue;
      }

      var objectLevels = await WSM.APIGetObjectLevelsReadOnly(history, curId);

      for (var j = 0; j < objectLevels.length; j++) {
        const curLevelId = objectLevels[j];
        let curArea = await FormIt.Levels.GetAreaForObjects(
          history,
          curLevelId,
          curId
        );

        if (area === 0 || curArea > area) {
          area = curArea;
        }
      }

      break;
    }

    area = convertUnit(area, FormIt.UnitType.kMetricMeter);
    area = Number(area.toFixed(2));

    return area;
  };

  const calcAreaSite = async (curId) => {
    // 대지면적 가져오기

    let properties = await FormIt.Model.GetPropertiesForSelected();

    var sArea = properties.area.replace(",", "").split(" ")[0];
    const area = Number(sArea);

    return area;
  };

  const calcRateBldCv = (areaBld, areaSite) => {
    // 건폐율 계산
    return areaBld / areaSite;
  };

  const calcAreaTotal = async () => {
    // 연면적(지하포함)

    let history = 0;

    let allBody = await WSM.APIGetAllObjectsByTypeReadOnly(history, 1); // 1=nBodyType

    let sumArea = 0;
    for (var i = 0; i < allBody.length; i++) {
      let curId = allBody[i];

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

      let curArea = 0;
      for (var k = 0; k < levelsData.length; k++) {
        let curLevelId = levelsData[k].id;
        curArea = await FormIt.Levels.GetAreaForObjects(
          history,
          curLevelId,
          curId
        );
        curArea = convertUnit(curArea, FormIt.UnitType.kMetricMeter);
        curArea = Number(curArea.toFixed(2));

        sumArea = sumArea + curArea;
      }
    }

    return sumArea;
  };

  const calcAreaGrnd = async () => {
    // 지상연면적

    let history = 0;

    let allBody = await WSM.APIGetAllObjectsByTypeReadOnly(history, 1); // 1=nBodyType

    let sumArea = 0;
    for (var i = 0; i < allBody.length; i++) {
      let curId = allBody[i];

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

      let curArea = 0;
      for (var k = 0; k < levelsData.length; k++) {
        let curLevelId = levelsData[k].id;
        let curElevation = levelsData[k].dElevation;
        if (curElevation < 0) {
          continue;
        }

        curArea = await FormIt.Levels.GetAreaForObjects(
          history,
          curLevelId,
          curId
        );
        curArea = convertUnit(curArea, FormIt.UnitType.kMetricMeter);
        curArea = Number(curArea.toFixed(2));

        sumArea = sumArea + curArea;
      }
    }

    return sumArea;
  };

  const calcAreaGrndHouse = async () => {
    // 주거 지상연면적

    let history = 0;

    let allBody = await WSM.APIGetAllObjectsByTypeReadOnly(history, 1); // 1=nBodyType

    let sumArea = 0;
    for (var i = 0; i < allBody.length; i++) {
      let curId = allBody[i];

      const layerId = await WSM.APIGetObjectLayersReadOnly(history, curId);
      const layerData = await WSM.APIGetLayerDataReadOnly(history, layerId[0]);

      if (layerData.name !== "공동주택") {
        continue;
      }

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

      let curArea = 0;
      for (var k = 0; k < levelsData.length; k++) {
        let curLevelId = levelsData[k].id;
        let curElevation = levelsData[k].dElevation;
        if (curElevation < 0) {
          continue;
        }

        curArea = await FormIt.Levels.GetAreaForObjects(
          history,
          curLevelId,
          curId
        );
        curArea = convertUnit(curArea, FormIt.UnitType.kMetricMeter);
        curArea = Number(curArea.toFixed(2));

        sumArea = sumArea + curArea;
      }
    }

    return sumArea;
  };

  const calcRateGrnd = (areaTotal, areaSite) => {
    // 용적률
    return areaTotal / areaSite;
  };

  const calcRateGrndHouse = (areaGrndHouse, areaSite) => {
    // 주거 용적률
    return areaGrndHouse / areaSite;
  };

  const calcScaleBld = async () => {
    // 건축규모

    let history = 0;

    let basemantLevel = "";
    let groundLevel = "";
    let basemantCount = 0;
    let groundCount = 0;

    let allBody = await WSM.APIGetAllObjectsByTypeReadOnly(history, 1); // 1=nBodyType
    let levels = await FormIt.Levels.GetLevels(history, true);

    for (var i = 0; i < levels.length; i++) {
      let emptyArea = false;

      for (var j = 0; j < allBody.length; j++) {
        let curId = allBody[i];
        let curArea = await FormIt.Levels.GetAreaForObjects(
          history,
          levels[i],
          curId
        );

        console.log(curId, levels[i], curArea);

        if (curArea > 0) {
          continue;
        }
        emptyArea = true;
      }

      if (emptyArea === false) {
        let levelData = await WSM.APIGetLevelDataReadOnly(history, levels[i]);
        let dElevation = levelData.dElevation;
        let sLevelName = levelData.sLevelName;

        console.log(sLevelName);

        if (i === 0) {
          basemantLevel = sLevelName;
        } else if (i === levels.length - 1) {
          groundLevel = sLevelName;
        }

        if (dElevation < 0) {
          basemantCount++;
        } else {
          groundCount++;
        }
      }
    }

    console.log(basemantLevel, groundLevel, basemantCount, groundCount);

    return 0;
  };

  const calcNmbrParking = () => {
    // 주차대수
    return 0;
  };

  // 프로젝트정보가져오기
  const handleSavePlan = async (e) => {
    console.log("handleSavePlan: start: ", e);

    let areaSite = await calcAreaSite(470); // 대지면적 *선택필요
    let areaBld = await calcAreaBld(); // 건축면적(근린)
    let areaTotal = await calcAreaTotal(); // 연면적
    let rateBldCv = calcRateBldCv(areaBld, areaSite); // 건폐율
    let areaGrnd = await calcAreaGrnd(); // 지상층연면적
    let areaGrndHouse = await calcAreaGrndHouse(); // 주거연면적
    let rateGrnd = calcRateGrnd(areaTotal, areaSite); // 용적률
    let rateGrndHouse = calcRateGrndHouse(areaGrndHouse, areaSite); // 주거용적률
    // 건축규모(지상/지하)
    // 주차대수(지하)
    //console.log("calcAreaTotal", areaTotal);
    //console.log("calcAreaGrnd", areaGrnd);
    //console.log("calcAreaGrndHouse", areaGrndHouse);
    //console.log("calcRateGrnd", rateGrnd);
    //console.log("calcRateGrndHouse", rateGrndHouse);

    const postData = {
      ID_PROJ: "3",
      AREA_BLD: areaBld,
      RATE_BLDCV: rateBldCv,
      AREA_TTA: areaTotal,
      AREA_ALL_GRND: areaGrnd,
      AREA_HUS_GRND: areaGrndHouse,
      RATE_ALL_GRND: rateGrnd,
      RATE_HUS_GRND: rateGrndHouse,
    };

    //console.log(postData);

    let planId = 0;
    try {
      const res = await fetch(baseuri + `project/planSave`, {
        method: "post",
        headers: {
          "Content-Type": "application/json",
          "x-access-token": "token-value",
        },
        body: JSON.stringify(postData),
      });
      if (!res.ok) {
        const message = `An error has occured: ${res.status} - ${res.statusText}`;
        throw new Error(message);
      }
      const data = await res.json();
      const result0 = {
        status: res.status + "-" + res.statusText,
        headers: {
          "Content-Type": res.headers.get("Content-Type"),
          "Content-Length": res.headers.get("Content-Length"),
        },
        data: data,
      };
      //setPostResult(fortmatResponse(result));
      //console.log(fortmatResponse(result));
      planId = result0.data[0].id;
    } catch (err) {
      //setPostResult(err.message);
      console.log(err);
    }

    // let rows = [];

    for (let i = 0; i < rowsGrid0.length; i++) {
      const e = rowsGrid0[i];
      //console.log(e);
      //console.log("==========================");

      // TB_FMT_PROJECT_PLAN_DONGS
      const postData0 = {
        ID_PROJ: 3,
        ID_PLAN: planId,
        ID_FMT: 0,
        NM_DONG: e.col2,
        NM_LAYR: e.col1,
        AREA_GRND: e.col4,
        AREA_BSMT: 0,
        NMBR_FLR_GRND: e.col3,
        NMBR_FLR_BSMT: 0,
      };

      console.log(postData0);

      try {
        const res = await fetch(baseuri + `project/planDongSave`, {
          method: "post",
          headers: {
            "Content-Type": "application/json",
            "x-access-token": "token-value",
          },
          body: JSON.stringify(postData0),
        });
        if (!res.ok) {
          const message = `An error has occured: ${res.status} - ${res.statusText}`;
          throw new Error(message);
        }
        const data = await res.json();
        const result1 = {
          status: res.status + "-" + res.statusText,
          headers: {
            "Content-Type": res.headers.get("Content-Type"),
            "Content-Length": res.headers.get("Content-Length"),
          },
          data: data,
        };
        //setPostResult(fortmatResponse(result));
        //console.log(fortmatResponse(result1));
        let dongId = result1.data[0].id;

        //=======================================================

        for (let j = 0; j < rowsGrid1.length; j++) {
          const e1 = rowsGrid1[j];

          if (e.col2 !== e1.col1) {
            continue;
          }

          console.log("==========================");
          console.log(e1);

          // TB_FMT_PROJECT_PLAN_FLOORS
          const postData1 = {
            ID_PROJ: 3,
            ID_PLAN: planId,
            ID_DONG: dongId,
            NM_LEVLS: e1.col2,
            NMBR_FLR_GRND: e1.col3,
            NMBR_FLR_BSMT: 0,
            AREA_LEVL: e1.col4,
            IS_GRND: 1,
          };

          console.log(postData1);
          console.log("==========================");

          let floorId = 0;
          try {
            const res = await fetch(baseuri + `project/planFloorSave`, {
              method: "post",
              headers: {
                "Content-Type": "application/json",
                "x-access-token": "token-value",
              },
              body: JSON.stringify(postData1),
            });
            if (!res.ok) {
              const message = `An error has occured: ${res.status} - ${res.statusText}`;
              throw new Error(message);
            }
            const data = await res.json();
            const result2 = {
              status: res.status + "-" + res.statusText,
              headers: {
                "Content-Type": res.headers.get("Content-Type"),
                "Content-Length": res.headers.get("Content-Length"),
              },
              data: data,
            };
            //setPostResult(fortmatResponse(result));
            //console.log(fortmatResponse(result2));
            //floorId = result2.data[0].id;
          } catch (err) {
            //setPostResult(err.message);
            console.log(err);
          }
        }
      } catch (err) {
        //setPostResult(err.message);
        console.log(err);
      }
    }
  };

  // 레이어가져오기
  const handleLayers = (e) => {
    console.log("handleLayers: start: ", e);

    let rows = [];

    callApi(baseuri + "setting/layers")
      .then((res) => {
        for (var i = 0; i < res.length; i++) {
          rows.push({
            id: res[i].ID,
            col1: res[i].NM_BUIS,
            col2: res[i].NM_FCLTY,
            col3: res[i].NM_LAYR,
          });
          //console.log("handleLayers: ", rows);
        }
        setLayers(rows);
      })
      .catch((err) => console.log(err));

    console.log("handleLayers: end: ", layers);
  };

  // 용도별 면적표
  const handleGetArea = async (e) => {
    console.log("handleGetArea: start: ");

    setRowsGrid0([]);

    let selection = await FormIt.Selection.GetSelections();

    let history = 0;

    let allBody = await WSM.APIGetAllObjectsByTypeReadOnly(history, 1); // 1=nBodyType
    //console.log("allBody", allBody);

    let id = 0;
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
        id: id,
        col1: layerData.name,
        col2: objectProps.sObjectName,
        col3: objectLevels.length,
        col4: sumArea,
      });
      id++;
    }

    await setRowsGrid0(buildings.map((row) => ({ ...row })));

    console.log("handleGetArea: end");
  };

  // 동/층별 면적표
  const handleGetAreaPerDong = async (e) => {
    console.log("handleGetAreaPerDong: start");

    setRowsGrid1([]);

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
          id++;

          floorCount = 1;
          bPush = true;
          beforeArea = curArea;
          beforeLevelName = curLevelName;
        } else {
          lastLevelName = curLevelName;
          floorCount++;
        }
      }

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
        id++;
      } else if (bPush === false && floorCount > 0) {
        levels.push({
          id: id,
          col1: objectProps.sObjectName,
          col2: beforeLevelName + "~" + lastLevelName,
          col3: floorCount,
          col4: beforeArea,
        });
        id++;
      }

      await setRowsGrid1(levels.map((row) => ({ ...row })));
    }

    console.log("handleGetAreaPerDong: end");
  };

  //console.log("render");
  //console.log("render", selectionModel);

  return (
    <div>
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

      <Button variant="contained" color="primary" onClick={handleSetting}>
        설정
      </Button>

      <Button variant="contained" color="primary" onClick={handleProject}>
        프로젝트정보
      </Button>

      <Button variant="contained" color="primary" onClick={handleSave}>
        저장
      </Button>

      <DataGrid
        style={{ height: 350, width: "100%" }}
        rows={rowsGrid0}
        columns={colsGrid0}
        disableSelectionOnClick
      />
      <DataGrid
        style={{ height: 500, width: "100%" }}
        rows={rowsGrid1}
        columns={colsGrid1}
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

      <Dialog open={openPlan} onClose={handleClosePlan} fullWidth>
        <DialogTitle>정보</DialogTitle>
        <DialogContent>
          <div style={{ height: 400, width: "100%" }}>
            <DataGrid
              rows={plan}
              columns={colsGrid3}
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
          {/* <Button variant="contained" color="primary" onClick={handleSetLayer}>
            추가
          </Button> */}

          <Button variant="outlined" color="primary" onClick={handleClosePlan}>
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
