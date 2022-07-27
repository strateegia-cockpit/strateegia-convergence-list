import { Box } from "@chakra-ui/react";
import { CSVLink } from "react-csv";
import { ButtonExp } from "./ButtonToExport";

export function ExportsButtons({ project, data, saveFile }) {
  
  return (
    <Box display="flex" justifyContent="flex-end" alignItems='flex-end' m='4px'>
      <ButtonExp click={saveFile} project={project} text='docx'/>
      <CSVLink
        data={data}
        filename="strateegia_people_contribution-csv.csv"
      >
        <ButtonExp click={null} project={project} text='csv'/>
      </CSVLink>
      <ButtonExp click={() => exportJSONData(data)} project={project} text='json'/>
    </Box>
  );
}

export const exportJSONData = (data) => {
  const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(
    JSON.stringify(data)
  )}`;

  const link = document.createElement("a");
  link.href = jsonString;
  link.download = "strateegia_production_per_person_report-json.json";

  link.click();
};

function dataToCsv(data) {
  const items = data;
  const replacer = (key, value) => value === null ? '' : value; // specify how you want to handle null values here
  const header = Object.keys(items[0]);
  const csv = [
    header.join(','), // header row first
    ...items.map(row => header.map(fieldName => JSON.stringify(row[fieldName], replacer)).join(','))
  ].join('\r\n');
  return csv;
}