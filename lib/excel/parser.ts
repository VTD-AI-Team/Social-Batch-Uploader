// Excel file parser

import ExcelJS from 'exceljs';
import { Shop } from '@/types';
import { logger } from '../utils/logger';

export async function parseExcelFile(buffer: Buffer): Promise<Shop[]> {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(buffer);

    const worksheet = workbook.getWorksheet(1);
    if (!worksheet) {
        throw new Error('No worksheet found in Excel file');
    }

    const shops: Shop[] = [];

    // Skip header row, start from row 2
    worksheet.eachRow((row, rowNumber) => {
        if (rowNumber === 1) return; // Skip header

        const maNPP = getCellValue(row.getCell(1));

        // Get 8 post URLs (columns 2-9, since Mã NV column removed)
        const postUrls: string[] = [];
        for (let i = 2; i <= 9; i++) {
            const url = getCellValue(row.getCell(i));
            postUrls.push(url);
        }

        // Only add shop if it has at least maNPP
        if (maNPP) {
            shops.push({
                maNPP,
                postUrls
            });
        }
    });

    logger.info(`Parsed ${shops.length} shops from Excel file`);
    return shops;
}

function getCellValue(cell: ExcelJS.Cell): string {
    const value = cell.value;

    if (value === null || value === undefined) {
        return '';
    }

    // Handle different cell value types
    if (typeof value === 'string') {
        return value.trim();
    }

    if (typeof value === 'number') {
        return value.toString();
    }

    if (typeof value === 'object' && 'text' in value) {
        // Handle hyperlink
        return (value as any).text || '';
    }

    return String(value).trim();
}
