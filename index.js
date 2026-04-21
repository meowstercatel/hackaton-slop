import ExcelJS from 'exceljs';

const data = {

}
let sortedData = {}
const teacherTable = {

}

let worksheet;

export function getTimeValues() {
    const column = worksheet.getColumn(1);
    return column.values.splice(2, 11);
}

export async function getTeacherLessons(teacherName) {
    const week = teacherTable[teacherName];
    console.log(week);

    const actualLessons = [[], [], [], [], []];
    for (let i = 0; i < week.length - 1; i++) {
        const day = week[i];
        for (let j = 0; j < day.length; j++) {
            const cell = day[j];
            if (typeof cell == 'undefined' || cell === null) continue;
            const klasa = cell.split("/")[0].split(" ")[0].trim();
            console.log(klasa);
        }
    }
}


export async function readExcelFile() {
    const workbook = new ExcelJS.Workbook();
    const response = await fetch('/Plan.xlsx');

    if (!response.ok) {
        throw new Error(`Cannot load /Plan.xlsx: ${response.status} ${response.statusText}`);
    }

    const fileBuffer = await response.arrayBuffer();

    try {
        await workbook.xlsx.load(fileBuffer);

        worksheet = workbook.worksheets[0];
        console.log(`\n--- Sheet: ${worksheet.name} ---`);
        const teachers58 = [];
        const teachers59 = [];
        const teachers60 = [];

        const row60 = []; const row61 = [];
        worksheet.eachRow((row, rowNumber) => {
            const rowData = Array.isArray(row.values) ? row.values.slice(1) : row.values;
            if (rowNumber == 58 || rowNumber == 59 || rowNumber == 60) {
                let stop = false;
                for (let i = 2; i < rowData.length; i++) {
                    const data = rowData[i];
                    if (typeof data == 'undefined') break;
                    if (rowNumber == 58) teachers58.push(data);
                    else if (rowNumber == 59) teachers59.push(data);
                    else if (rowNumber == 60) teachers60.push(data);
                }

            }
        });

        let startLekcjeColumn;
        let endLekcjeColumn;

        worksheet.eachRow((row, rowNumber) => {
            const rowData = Array.isArray(row.values) ? row.values.slice(1) : row.values;

            if (rowNumber === 1) {
                const firstUndefinedIdx = rowData.findIndex(val => val === undefined || typeof val === 'undefined');
                startLekcjeColumn = firstUndefinedIdx + 1;

                for (let i = startLekcjeColumn; i < rowData.length; i++) {
                    if (rowData[i] === undefined || typeof rowData[i] === 'undefined') {
                        endLekcjeColumn = i;
                    }
                }
            }
        });

        for (let i = 0; i < teachers58.length; i++) {
            data[[teachers58[i]] + " " + teachers59[i]] = {
                wychowawca: teachers60[i] ? teachers60[i].trim() : "",
                lekcje: []
            };
        }

        for (let i = 30; i <= endLekcjeColumn - 1; i++) {
            let week = [[], [], [], [], [], []];
            const column = worksheet.getColumn(i);
            let count = 0;
            let weekDay = 0;
            // 0 -> 10
            for (let j = 2; j < column.values.length; j++) {
                if (count >= 11) {
                    count = 0;
                    weekDay++;
                }
                week[weekDay].push(column.values[j]);
                count++;
            }
            const nazwisko = week[week.length - 1]
                .filter((_, index) => index !== 0)
                .map(val => val ? String(val).trim() : '')
                .join('');

            const imie = `${week[week.length - 1][0].replace(" .", ".").replace(".", ". ")}${nazwisko}`.replace("  ", " ")
            teacherTable[imie] = week.slice(0, week.length - 1);
            if (data[imie])
                data[imie].lekcje = week.slice(0, week.length - 1);
            else {
                data[imie] = {
                    wychowawca: "",
                    lekcje: week.slice(0, week.length - 1)
                }
            }
        }

        sortedData = {};
        Object.keys(data).sort().forEach(key => {
            sortedData[key] = data[key];
        });

        console.log(Object.keys(sortedData)[0])
        getTeacherLessons(Object.keys(sortedData)[0]);


    } catch (error) {
        throw new Error(`Error reading the Excel file: ${error.message}`);
    }
    return sortedData;
}

