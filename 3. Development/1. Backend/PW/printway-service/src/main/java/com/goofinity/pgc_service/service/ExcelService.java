package com.goofinity.pgc_service.service;

import com.goofinity.pgc_service.dto.ExcelData;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFFont;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ExcelService {
    public Workbook exportExcel(String sheetName, ExcelData excelData) {
        Workbook workbook = new XSSFWorkbook();
        Sheet sheet = workbook.createSheet(sheetName);

        int rowCount = 0;
        for (List<String> headerData : excelData.getHeaders()) {
            Row header = sheet.createRow(rowCount++);
            XSSFFont font = ((XSSFWorkbook) workbook).createFont();
            font.setFontName("Calibri (Body)");
            font.setFontHeightInPoints((short) 14);
            font.setBold(true);

            CellStyle headerStyle = workbook.createCellStyle();
            headerStyle.setFont(font);

            for (int i = 0; i < headerData.size(); i++) {
                Cell cell = header.createCell(i);
                cell.setCellStyle(headerStyle);
                cell.setCellValue(headerData.get(i));
            }
        }

        CellStyle style = workbook.createCellStyle();
        style.setWrapText(true);

        for (List<String> rowData : excelData.getRowData()) {
            Row row = sheet.createRow(rowCount++);
            row.setHeightInPoints((2 * sheet.getDefaultRowHeightInPoints()));
            for (int i = 0; i < rowData.size(); i++) {
                Cell cell = row.createCell(i);
                cell.setCellStyle(style);
                cell.setCellValue(rowData.get(i));
            }
        }

        return workbook;
    }
}
