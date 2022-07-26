import * as api from 'strateegia-api';

export const exportJSONData = (data) => {
  const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(
    JSON.stringify(data)
  )}`;

  const link = document.createElement("a");
  link.href = jsonString;
  link.download = "strateegia_convergence_points_report-json.json";

  link.click();
}

export async function fetchConvergencePoints(accessToken, selectedMap) {
  try {

    const convergencePointsFromApi = await getConvergencePointsFromApi(accessToken, selectedMap);
    const allApiCalls = await getAllApiCalls(accessToken, convergencePointsFromApi);
    return allApiCalls;

  } catch (error) {
    console.log(error);
  }
}

const getConvergencePointsFromApi = async (accessToken, selectedMap) => {
  
  const allMaps = await Promise.all(
    selectedMap.map(
      async ({value}) => await api.getMapById(accessToken, value)
    )
  )
  .then(data => data.flat());

  const convergencePointsFromApi = 
    allMaps.map(resp => 
      resp.points.filter(
        content => content.point_type === 'CONVERGENCE'
    )); 

  return convergencePointsFromApi;
}

const getAllApiCalls = async (accessToken, convergencePointsFromApi) => {
  const allApiCalls = await Promise.all(
    convergencePointsFromApi.flat().map( async (element) => {
     return api.getConvergencePointById(accessToken, element.id)
    })
  ).then(data => data.flat());
  return allApiCalls;
}