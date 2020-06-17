import React, { useState } from "react";
import Layout from "../components/Layout";
import AgGridComponent from "../components/AgGridComponent";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-alpine.css";
import { AgChartsReact } from "ag-charts-react";
import { useQuery } from "react-apollo";
import { gql } from "apollo-boost";

const GET_FAMILY_DATA = gql`
	query allFamilies {
		allFamilies {
			id
			data
		}
	}
`;

const CONNECTION_STRING = 'http://localhost:8000/graphql/';

const index = () => {
	function recalculateTotals(){
		var query = `
			mutation {
				recalculateTotalsMutation(id: "0", data: {}) {
					family {
						id
						data
					}
				}
			}
		`;
		fetch(CONNECTION_STRING, {
			method: 'POST',
			headers: {
			  'Content-Type': 'application/json',
			  'Accept': 'application/json',
			},
			body: JSON.stringify({
			  query,
			})
		  })
		.then(r => r.json())
		.then(data => {
			setrowData(data.data.recalculateTotalsMutation.family["data"].rows);
		})
	}

	function increaseMonthlyPayments(){
		var query = `
			mutation {
				increaseMonthlyPaymentsMutation(id: "0", data: {}) {
					family {
						id
						data
					}
				}
			}
		`;
		fetch(CONNECTION_STRING, {
			method: 'POST',
			headers: {
			  'Content-Type': 'application/json',
			  'Accept': 'application/json',
			},
			body: JSON.stringify({
			  query,
			})
		  })
		.then(r => r.json())
		.then(data => {
			setrowData(data.data.increaseMonthlyPaymentsMutation.family["data"].rows);
			recalculateTotals();
		})
	}

	const { loading, data, error } = useQuery(GET_FAMILY_DATA);
	// Ensure data was loaded
	if (loading) return <div>Loading family data...</div>;
	if (error) {
		console.error(error);
		return <div>Something went wrong loading family data.</div>;
	}

	if (data.allFamilies.length <= 0) return <div>No families found. (You'll need to create one with the management script first)</div>;

	// Row data used for the table (will display row data or nothing if data.rows does not exist yet)
	const [rowData, setrowData] = useState(data.allFamilies[data.allFamilies.length - 1].data.rows || []);

	// monthly payment, lump sum payment and interest rate should use this custom styling in tableColumns
	const customStyle = (params) => {
		var textColour = "";
		if(params.data.edited.monthlyPayment === "True"){
			textColour = "#FF0000";
		}
		else{
			textColour = "#20ad15";
		}

		// You can go off of these params for styling and then set textColour depending on certain criteria
		// Note: by default this changes the colour for ALL cells in the column, so you need to figure out how to target a specific cell
		// hint: maybe something in the params.colDef can link up to the metaData?
		// console.log(params);

		return {
			color: textColour,
		};
	};

	// Column definitions for the table
	const tableColumns = [
		{headerName: 'Year', field: 'year'},
		{headerName: 'Month', field: 'month'},
		{headerName: 'Monthly Payment', field: 'monthlyPayment',cellStyle: customStyle},
		{headerName: 'Lump Sum Payment', field: 'lumpSumPayment',cellStyle: customStyle},
		{headerName: 'Interest Rate', field: 'interestRate',cellStyle: customStyle},
		{headerName: 'Total', field: 'total'},							
	];

	// Default column definitions for the table (applied to all columns)
	const defaultColumnInformation = {
		editable: false,
		sortable: false,
		minWidth: 140,
		flex: 1,
		resizable: false,
		cellClass: "text-center",
	};

	const gridOptions = {
		suppressMovableColumns: true,
		rowData: rowData,
	};

	// Pie chart is a better alternative when we have just a few columns(not too cluttered)
	const pieChartOptions = {
        type: 'pie',
		title: {
			text: 'Total Payment by month',
			fontSize: 16,
		},
		label: {
			minAngle: 20
		},
		data: rowData,
        series: [{			
			angleKey: 'total',
			labelKey: 'month',
			outerRadiusOffset: 0, // default
        }],
	}
	
	return (
		<Layout>
			<div className="ag-theme-alpine" style={{ height: "600px" }}>
				<AgGridComponent rowData={rowData} columnDefs={tableColumns} defaultColDefs={defaultColumnInformation} gridOptions={gridOptions} />
				<div style={{marginTop:'10px', marginLeft: '40%'}}>
					<button type="button" onClick={recalculateTotals}>Recalculate Totals</button>
					<button type="button" style={{marginLeft:'10px'}} onClick={increaseMonthlyPayments}>Increase Monthly Payments</button>				
				</div>
				<AgChartsReact options={pieChartOptions}/>
			</div>
		</Layout>
	);
};

export default index;
