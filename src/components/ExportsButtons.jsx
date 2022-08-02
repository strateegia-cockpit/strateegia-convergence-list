import { Box } from "@chakra-ui/react";
import { CSVLink } from "react-csv";
import { ButtonExp } from "./ButtonToExport";

export function ExportsButtons({ project, data, saveFile }) {
  
  return (
    <Box display="flex" justifyContent="flex-end" alignItems='flex-end' m='4px'>
      <ButtonExp click={saveFile} project={project} text='docx'/>
      <CSVLink
        data={csvData(data).flat()}
        headers={headers}
        filename="strateegia_convergence_list_report-csv.csv"
      >
        <ButtonExp click={null} project={project} text='csv'/>
      </CSVLink>
      <ButtonExp click={() => exportJSONData(jsonData(data).flat())} project={project} text='json'/>
    </Box>
  );
}

export const exportJSONData = (data) => {
  const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(
    JSON.stringify(data)
  )}`;

  const link = document.createElement("a");
  link.href = jsonString;
  link.download = "strateegia_convergence_list_report-json.json";

  link.click();
};

const jsonData = (data) => data.map(({questions}) => {
  const questionsMapping = questions.map(({text, options}) => {
      const allOptions = options.map(({text, average}) => {
        return {
          title: text,
          average: (average * 100).toFixed(2) + '%'}
       })
       
      const data = {
        text: text,
        options: allOptions
      }
      return data;
    })
  return questionsMapping;
});

const headers = [
  {label: "title" , key: "title"},
  {label: "options" , key: "options"},
]

const csvData = (data) => data.map(({questions}) => {
  const questionsMapping = questions.map(({text, options}) => {
      const allOptions = options.map(({text, average}) => {
        return text + ' ' + (average * 100).toFixed(2) + '%'
       })
       
      const data = {
        title: text,
        options: allOptions.join(', ')
      }
      return data;
    })
  return questionsMapping;
});

