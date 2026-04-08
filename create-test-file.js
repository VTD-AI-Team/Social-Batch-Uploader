const ExcelJS = require('exceljs');
const path = require('path');

async function createTestFile() {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Sheet1');

    // Define columns matching the template
    worksheet.columns = [
        { header: 'Mã NPP', key: 'maNPP', width: 15 },
        { header: 'Mã NV', key: 'maNV', width: 15 },
        { header: 'POST 1', key: 'post1', width: 50 },
        { header: 'POST 2', key: 'post2', width: 50 },
        { header: 'POST 3', key: 'post3', width: 50 },
        { header: 'POST 4', key: 'post4', width: 50 },
        { header: 'POST 5', key: 'post5', width: 50 },
        { header: 'POST 6', key: 'post6', width: 50 },
        { header: 'POST 7', key: 'post7', width: 50 },
        { header: 'POST 8', key: 'post8', width: 50 }
    ];

    // Style header
    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFE0E0E0' }
    };

    // Add test data
    worksheet.addRow({
        maNPP: 'vdtp20624',
        maNV: 'vt08482',
        post1: 'https://www.facebook.com/share/p/1ACkUyKzQT/',
        post2: 'https://www.facebook.com/share/p/17KonNFeJD/',
        post3: 'https://www.facebook.com/share/p/16qZhiasi4/',
        post4: 'https://www.facebook.com/share/p/1Kp2CHZfz2/',
        post5: 'https://www.facebook.com/share/p/1Efcwmr5M2/',
        post6: 'https://www.facebook.com/share/r/1BepjbcQCF/',
        post7: 'https://www.facebook.com/share/r/17MCVff3Ue/',
        post8: 'https://www.facebook.com/share/r/1GpxKkwe8z/'
    });

    // Save file
    const outputPath = path.join(__dirname, 'test-data.xlsx');
    await workbook.xlsx.writeFile(outputPath);
    console.log(`✅ Test file created: ${outputPath}`);
}

createTestFile().catch(console.error);
