import React from "react";
import { AgGridReact } from "ag-grid-react";

const AgGridComponent = ({ rowData, columnDefs, defaultColDefs, gridOptions, ...props }) => {
	return <AgGridReact columnDefs={columnDefs} defaultColDef={defaultColDefs} rowData={rowData} gridOptions={gridOptions} />;
};

export default AgGridComponent;
