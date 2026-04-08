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
    let rowCount = 0;
    let emptyRowCount = 0;

    // Skip header row, start from row 2
    worksheet.eachRow((row, rowNumber) => {
        if (rowNumber === 1) return; // Skip header
        rowCount++;

        const maNPP = getCellValue(row.getCell(1));

        // Skip completely empty rows
        const allCellsEmpty = [1, 2, 3, 4, 5, 6, 7, 8, 9].every(i => {
            const val = getCellValue(row.getCell(i));
            return !val || val.trim() === '';
        });

        if (allCellsEmpty) {
            emptyRowCount++;
            return;
        }

        // Get 8 post URLs (columns 2-9, since Mã NV column removed)
        const postUrls: string[] = [];
        for (let i = 2; i <= 9; i++) {
            const url = getCellValue(row.getCell(i));
            postUrls.push(url);
        }

        // Only add shop if it has at least maNPP
        if (maNPP && maNPP.trim()) {
            shops.push({
                maNPP: maNPP.trim(),
                postUrls
            });
        }
    });

    logger.info(`Parsed ${shops.length} shops from ${rowCount} rows (${emptyRowCount} empty rows skipped)`);
    return shops;
}

function getCellValue(cell: ExcelJS.Cell): string {
    try {
        const value = cell.value;

        if (value === null || value === undefined) {
            return '';
        }

        // Handle string value
        if (typeof value === 'string') {
            return value.trim();
        }

        // Handle number value
        if (typeof value === 'number') {
            return value.toString().trim();
        }

        // Handle hyperlink object { text: string, hyperlink: string }
        if (typeof value === 'object') {
            // If it's a hyperlink with text property
            if ('text' in value && value.text !== null && value.text !== undefined) {
                return String(value.text).trim();
            }
            // If it's a hyperlink with hyperlink property (no display text)
            if ('hyperlink' in value && value.hyperlink !== null && value.hyperlink !== undefined) {
                return String(value.hyperlink).trim();
            }
            // If it's an array (rich text), extract all text
            if (Array.isArray(value)) {
                return value.map(v => {
                    if (typeof v === 'string') return v;
                    if (typeof v === 'object' && 'text' in v) return String(v.text);
                    return '';
                }).join('').trim();
            }
        }

        // Fallback
        return String(value).trim();
    } catch (e) {
        logger.warn('Error reading cell value:', e);
        return '';
    }
}
