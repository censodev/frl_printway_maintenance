package com.goofinity.pgc_service.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ExcelData {
    List<List<String>> headers = new ArrayList<>();
    List<List<String>> rowData = new ArrayList<>();
}
