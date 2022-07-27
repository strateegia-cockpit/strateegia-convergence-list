import Docxtemplater from "docxtemplater";
import PizZip from "pizzip";
import PizZipUtils from "pizzip/utils/index.js";
import { reportsCockpit } from '../assets/files' 
import { saveAs } from "file-saver"; 

function loadFile(url, callback) {
    PizZipUtils.getBinaryContent(url, callback);
}

export const generateDocument = (convergencePoints) => {

    loadFile(
        reportsCockpit,
        function (error, content) {
            if (error) {
                throw error;
            }
            const zip = new PizZip(content);
            const doc = new Docxtemplater(zip, {
                paragraphLoop: true,
                linebreaks: true,
            });
            const docData = []
            convergencePoints.map((convergencePoint) => {
                convergencePoint.questions.map( async ({text, options}) => {
                    const data = {
                        title: text,
                        options: options.map(({text, average}) => {
                            return {
                                option:  text,
                                average: (average * 100).toFixed(2) + '%'
                            }
                        })
                    }
                    docData.push(data)   
                })
            });
                

            doc.render({
                'convPoints': docData
            });

            const out = doc.getZip().generate({
                type: "blob",
                mimeType:
                    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            }); //Output the document using Data-URI
            saveAs(out, "strateegia_convergence_list_report-docx.docx");
        }
    );

}
