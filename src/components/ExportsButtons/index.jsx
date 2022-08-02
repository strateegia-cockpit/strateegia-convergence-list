import { Box } from "@chakra-ui/react";
import { CSVLink } from "react-csv";
import { ButtonExp } from "../ButtonToExport";
import { jsonData, getCsvData, exportJSONData } from "./functions"

export function ExportsButtons({ project, data, saveFile }) {

  const headers = [
    {label: "title" , key: "title"},
    {label: "options" , key: "options"},
  ]

  const json = jsonData(data).flat();
  const csvData = getCsvData(json);

  return (
    <Box display="flex" justifyContent="flex-end" alignItems='flex-end' m='4px'>
      <ButtonExp click={saveFile} project={project} text='docx'/>
      <CSVLink
        data={csvData}
        headers={headers}
        filename="strateegia_convergence_list_report-csv.csv"
      >
        <ButtonExp click={null} project={project} text='csv'/>
      </CSVLink>
      <ButtonExp click={() => exportJSONData(json)} project={project} text='json'/>
    </Box>
  );
}



