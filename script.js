let selectedRow = null;
let tableData = [];

// Fetch data from JSON file

fetch("data.json")
  .then((response) => response.json())
  .then((data) => {
    tableData = data.map((item) => ({
      name: item.ChemicalName,
      vendor: item.Vendor,
      density: item.Density,
      viscosity: item.Viscosity,
      packaging: item.Packaging,
      packSize: item.Packsize,
      unit: item.Unit,
      quantity: item.Quantity,
    }));
    let storedtable = JSON.parse(localStorage.getItem("tableData"));
    if (storedtable) {
      tableData = storedtable;
    }
    populateTable();
  })
  .catch((error) => console.error("Error fetching data:", error));

// Populate the table with data
function populateTable() {
  const tableBody = document.getElementById("tableBody");
  tableBody.innerHTML = "";

  tableData.forEach((row, index) => {
    const tr = document.createElement("tr");
    tr.onclick = () => selectRow(tr, index);

    tr.innerHTML = `
      <td><input type="checkbox"></td>
      <td contenteditable="true">${row.name}</td>
      <td contenteditable="true">${row.vendor}</td>
      <td contenteditable="true">${row.density}</td>
      <td contenteditable="true">${row.viscosity}</td>
      <td contenteditable="true">${row.packaging}</td>
      <td contenteditable="true">${row.packSize}</td>
      <td contenteditable="true">${row.unit}</td>
      <td contenteditable="true">${row.quantity}</td>
    `;

    // Save changes on blur
    tr.querySelectorAll("td[contenteditable=true]").forEach(
      (cell, cellIndex) => {
        cell.addEventListener("blur", () => {
          updateRowData(index, cellIndex, cell.innerText);
        });
      }
    );

    tableBody.appendChild(tr);
  });
}

// Update tableData when a cell is edited
function updateRowData(rowIndex, cellIndex, newValue) {
  const keys = [
    "name",
    "vendor",
    "density",
    "viscosity",
    "packaging",
    "packSize",
    "unit",
    "quantity",
  ];
  tableData[rowIndex][keys[cellIndex]] = newValue; // -1 because checkbox is the first column
}

// Select the row to highlight
function selectRow(row, index) {
  if (selectedRow) {
    selectedRow.classList.remove("selected");
  }
  selectedRow = row;
  row.classList.add("selected");
}

// Add a new row with default values
function addRow() {
  const newRow = {
    name: "New Chemical",
    vendor: "New Vendor",
    density: 0,
    viscosity: 0,
    packaging: "Bag",
    packSize: 100,
    unit: "kg",
    quantity: 0,
  };
  tableData.push(newRow);
  populateTable();
}

// Delete the selected row
function deleteRow() {
  if (selectedRow) {
    const rowIndex = Array.from(selectedRow.parentNode.children).indexOf(
      selectedRow
    );
    tableData.splice(rowIndex, 1);
    populateTable();
    localStorage.setItem("tableData", JSON.stringify(tableData));
  }
}

// Move selected row down
function moveDown() {
  if (selectedRow) {
    const rowIndex = Array.from(selectedRow.parentNode.children).indexOf(
      selectedRow
    );
    if (rowIndex > 0) {
      const temp = tableData[rowIndex];
      tableData[rowIndex] = tableData[rowIndex - 1];
      tableData[rowIndex - 1] = temp;
      populateTable();
      localStorage.setItem("tableData", JSON.stringify(tableData));
    }
  }
}

// Move selected row up
function moveUp() {
  if (selectedRow) {
    const rowIndex = Array.from(selectedRow.parentNode.children).indexOf(
      selectedRow
    );
    if (rowIndex < tableData.length - 1) {
      const temp = tableData[rowIndex];
      tableData[rowIndex] = tableData[rowIndex + 1];
      tableData[rowIndex + 1] = temp;
      populateTable();
      localStorage.setItem("tableData", JSON.stringify(tableData));
    }
  }
}

// Refresh the page
function refreshPage() {
    location.reload();
  // let storedtable = JSON.parse(localStorage.getItem("tableData"));
  // if (storedtable) {
  //   tableData = storedtable;
  //   populateTable();
  // } else {
  //   location.reload();
  // }
}

// Save the table data to local storage
function saveTable() {
  localStorage.setItem("tableData", JSON.stringify(tableData));
  alert("Table data saved successfully.");
}
