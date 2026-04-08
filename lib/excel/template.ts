// Excel template generator

import ExcelJS from 'exceljs';
import { logger } from '../utils/logger';

export async function generateTemplate(): Promise<Buffer> {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Template');

    // Define columns
    worksheet.columns = [
        { header: 'Mã Chủ Shop', key: 'maNPP', width: 15 },
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

    // Add sample rows
    worksheet.addRow({
        maNPP: 'NPP001',
        post1: 'https://facebook.com/example1',
        post2: 'https://facebook.com/example2',
        post3: 'https://facebook.com/example3',
        post4: 'https://facebook.com/example4',
        post5: 'https://facebook.com/example5',
        post6: 'https://facebook.com/example6',
        post7: 'https://facebook.com/example7',
        post8: 'https://facebook.com/example8'
    });

    worksheet.addRow({
        maNPP: 'NPP002',
        post1: 'https://tiktok.com/@user/video/123',
        post2: 'https://tiktok.com/@user/video/124',
        post3: '',
        post4: '',
        post5: '',
        post6: '',
        post7: '',
        post8: ''
    });

    logger.info('Generated Excel template');

    return await workbook.xlsx.writeBuffer() as Buffer;
}
