export const exportJSONData = (data) => {
    const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(
      JSON.stringify(data)
    )}`;
  
    const link = document.createElement("a");
    link.href = jsonString;
    link.download = "strateegia_convergence_list_report-json.json";
  
    link.click();
};
  
export const jsonData = (data) => data.map(({questions}) => {
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
    });
    return questionsMapping;
});

  
export const getCsvData = data => {
    const dt = data.map(({text, options}) => {
        const allOptions = options.map(option => {
        return option.title + ' ' + option.average
        });
        return {text, options: allOptions.join(', ')}
    })
    return dt;
};