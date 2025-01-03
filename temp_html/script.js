let password = "";

const pad = 1;
document
  .getElementById("loginForm")
  .addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent form submission

    var mobileNumber = document.getElementById("mobileNumber").value;

    // Load the Excel file from the root directory
    var xhr = new XMLHttpRequest();
    xhr.open(
      "GET",
      // "https://docs.google.com/spreadsheets/d/1fMjDdGK9IIs7lm_jc0f-dj6V0MKHehZu8e3mx5EwhoY/edit?usp=sharing",
      "https://docs.google.com/spreadsheets/d/1atSTdqPBzv_wi8DiAiUd0k9wLbmLia--iGQW1ZsN6_k/edit?gid=0#gid=0",
      true
    );
    xhr.responseType = "arraybuffer";

    xhr.onload = function (e) {
      var data = new Uint8Array(xhr.response);
      var workbook = XLSX.read(data, { type: "array" });
      var sheetName = workbook.SheetNames[0];
      var sheet = workbook.Sheets[sheetName];
      // console.log("data", sheet);

      var range = XLSX.utils.decode_range(sheet["!ref"]);

      var found = false;
      let displayData = "";

      for (var rowNum = range.s.r + 1; rowNum <= range.e.r; rowNum++) {
        // Start from row 2 to skip header
        var mobileCell =
          sheet[XLSX.utils.encode_cell({ r: rowNum, c: pad + 1 })];
          console.log("rowNum : ",rowNum,"data : ",mobileCell);
        // console.log("object", mobileCell);
        if (mobileCell && mobileCell.v == mobileNumber) {
          var studentNameCell =
            sheet[XLSX.utils.encode_cell({ r: rowNum, c: pad + 0 })]; 
          var batchNameCell =
            sheet[XLSX.utils.encode_cell({ r: rowNum, c: pad + 2 })]; 
          var addressCell =
            sheet[XLSX.utils.encode_cell({ r: rowNum, c: pad + 3 })]; 
          var trackingIdCell =
            sheet[XLSX.utils.encode_cell({ r: rowNum, c: pad + 4 })];
          // var remarkCell = sheet[XLSX.utils.encode_cell({ r: rowNum, c: pad + 5 })]; // Remark

          displayData = `
              <table class="student-info-table">
                  <thead>
                      <tr>
                          <th>Particulars</th>
                          <th>Details</th>
                      </tr>
                  </thead>
                  <tbody>
                      <tr>
                          <td>Student Name</td>
                          <td>${studentNameCell.v}</td>
                      </tr>
                      <tr>
                          <td>Batch Name</td>
                          <td>${batchNameCell.v}</td>
                      </tr>
                      <tr>
                          <td>Full Delivery Address</td>
                          <td>${addressCell.v}</td>
                      </tr>
                      <tr>
                          <td>Tracking ID</td>
                          <td>${trackingIdCell.v}</td>
                      </tr>
                      
                      <tr>
                          <td>Track on Indian Postal Website</td>
                          <td><a href="https://www.indiapost.gov.in/_layouts/15/dop.portal.tracking/trackconsignment.aspx" target="_blank" rel="noopener noreferrer">Click here to track your consignment</a></td>
                      </tr>
                  </tbody>
              </table>
          `;

          found = true;
          break;
        }
      }

      // If mobile number found, display data below the form
      if (found) {
        document.getElementById("message").innerHTML = displayData;
      } else {
        document.getElementById("message").innerHTML = `
                <p style="color:red;">Please check your registered number or contact support.</p>
            `;
      }
    };

    xhr.send();
  });
