// Excel output generator with 18 columns

import ExcelJS from 'exceljs';
import { ProcessingResult, ExcelRow } from '@/types';
import { logger } from '../utils/logger';

export async function generateExcelOutput(results: ProcessingResult[]): Promise<Buffer> {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Kết quả');

    // Define columns (17 total) - Interleaved POST and Screenshot
    worksheet.columns = [
        { header: 'Mã Chủ Shop', key: 'maNPP', width: 15 },
        { header: 'POST 1', key: 'post1', width: 50 },
        { header: 'Screenshot 1', key: 'screenshot1', width: 50 },
        { header: 'POST 2', key: 'post2', width: 50 },
        { header: 'Screenshot 2', key: 'screenshot2', width: 50 },
        { header: 'POST 3', key: 'post3', width: 50 },
        { header: 'Screenshot 3', key: 'screenshot3', width: 50 },
        { header: 'POST 4', key: 'post4', width: 50 },
        { header: 'Screenshot 4', key: 'screenshot4', width: 50 },
        { header: 'POST 5', key: 'post5', width: 50 },
        { header: 'Screenshot 5', key: 'screenshot5', width: 50 },
        { header: 'POST 6', key: 'post6', width: 50 },
        { header: 'Screenshot 6', key: 'screenshot6', width: 50 },
        { header: 'POST 7', key: 'post7', width: 50 },
        { header: 'Screenshot 7', key: 'screenshot7', width: 50 },
        { header: 'POST 8', key: 'post8', width: 50 },
        { header: 'Screenshot 8', key: 'screenshot8', width: 50 },
        { header: 'Ghi chú', key: 'notes', width: 30 }
    ];

    // Style header row
    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFE0E0E0' }
    };

    // Add data rows
    results.forEach((result) => {
        logger.info(`[DEBUG] Writing row for ${result.shop.maNPP}`);
        logger.info(`[DEBUG] Screenshots array: ${JSON.stringify(result.screenshots)}`);

        const row: ExcelRow = {
            maNPP: result.shop.maNPP || '',
            post1: result.shop.postUrls[0] || '',
            screenshot1: result.screenshots[0] || '',
            post2: result.shop.postUrls[1] || '',
            screenshot2: result.screenshots[1] || '',
            post3: result.shop.postUrls[2] || '',
            screenshot3: result.screenshots[2] || '',
            post4: result.shop.postUrls[3] || '',
            screenshot4: result.screenshots[3] || '',
            post5: result.shop.postUrls[4] || '',
            screenshot5: result.screenshots[4] || '',
            post6: result.shop.postUrls[5] || '',
            screenshot6: result.screenshots[5] || '',
            post7: result.shop.postUrls[6] || '',
            screenshot7: result.screenshots[6] || '',
            post8: result.shop.postUrls[7] || '',
            screenshot8: result.screenshots[7] || '',
            notes: generateNotes(result)
        };

        const excelRow = worksheet.addRow(row);


        // Add hyperlinks for screenshot columns (now at positions 2, 4, 6, 8, 10, 12, 14, 16)
        // Column 1 = Mã NPP, then POST 1 (col 2), Screenshot 1 (col 3), POST 2 (col 4), Screenshot 2 (col 5), etc.
        // So Screenshot columns are at: 3, 5, 7, 9, 11, 13, 15, 17
        for (let i = 0; i < 8; i++) {
            const screenshot = result.screenshots[i];
            if (screenshot) {
                const cell = excelRow.getCell(3 + (i * 2)); // Screenshot columns at 3, 5, 7, 9, 11, 13, 15, 17
                cell.value = {
                    text: screenshot,
                    hyperlink: screenshot
                };
                cell.font = { color: { argb: 'FF0000FF' }, underline: true };
            }
        }
    });

    logger.info(`Generated Excel output with ${results.length} rows`);

    return await workbook.xlsx.writeBuffer() as Buffer;
}

function generateNotes(result: ProcessingResult): string {
    const notes: string[] = [];

    result.validationResults.forEach((validation, index) => {
        const postNum = index + 1;

        if (!result.shop.postUrls[index]) {
            // Empty post, skip
            return;
        }

        if (validation.status) {
            notes.push(`POST ${postNum}: ${validation.status}`);
        }

        // Add details about missing hashtags
        if (validation.missingHashtags.length > 0) {
            notes.push(`  Thiếu: ${validation.missingHashtags.join(', ')}`);
        }
    });

    return notes.join('\n') || 'Không có ghi chú';
}
