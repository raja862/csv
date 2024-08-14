import React, { useState } from 'react';
import Papa from 'papaparse';
import ReactPaginate from 'react-paginate';

const Csvfile = () => {
  const [file, setFile] = useState(null);
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [showUpload, setShowUpload] = useState(false);
  const [showDuplicates, setShowDuplicates] = useState(false);
  const [showMissingColumns, setShowMissingColumns] = useState(false);
  const [showMissingRows, setShowMissingRows] = useState(false); // Added this line
  const [duplicates, setDuplicates] = useState([]);
  const [missingColumns, setMissingColumns] = useState([]);
  const [missingRows, setMissingRows] = useState([]);
  const [duplicateCount, setDuplicateCount] = useState(0);
  const [missingColumnCount, setMissingColumnCount] = useState(0);
  const [missingRowCount, setMissingRowCount] = useState(0);

  const requiredColumns = ['email', 'phone']; // Define required columns

  const handleFileChange = (e) => {
    setShowUpload(true);
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === 'text/csv') {
      setFile(selectedFile);
      parseCSV(selectedFile);
    } else {
      alert('Please upload a valid CSV file.');
      setFile(null);
      setData([]);
    }
  };

  const parseCSV = (file) => {
    Papa.parse(file, {
      complete: (result) => {
        const parsedData = result.data;
        setData(parsedData);
        findDuplicates(parsedData);
        findMissingColumns(parsedData);
        findMissingRows(parsedData);
      },
      header: true,
    });
  };

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  const offset = currentPage * rowsPerPage;
  const pageData = showDuplicates ? duplicates : showMissingColumns ? [] : data;
  const currentPageData = pageData.slice(offset, offset + rowsPerPage);
  const pageCount = Math.ceil(pageData.length / rowsPerPage);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value.toLowerCase());
  };

  const filteredData = pageData.filter((row) =>
    Object.values(row).some((val) =>
      val.toLowerCase().includes(searchTerm)
    )
  );

  const findDuplicates = (data) => {
    const emailMap = new Map();
    const mobilenumberMap = new Map();
    const duplicateEntries = [];

    data.forEach((row) => {
      const email = row.email?.toLowerCase();
      const phone = row.phone;

      if (email) {
        if (emailMap.has(email)) {
          duplicateEntries.push(row);
        }
        emailMap.set(email, (emailMap.get(email) || 0) + 1);
      }

      if (phone) {
        if (mobilenumberMap.has(phone)) {
          duplicateEntries.push(row);
        }
        mobilenumberMap.set(phone, (mobilenumberMap.get(phone) || 0) + 1);
      }
    });

    setDuplicates(duplicateEntries);
    const emailDuplicates = [...emailMap.values()].filter(count => count > 1).length;
    const phoneDuplicates = [...mobilenumberMap.values()].filter(count => count > 1).length;
    setDuplicateCount(emailDuplicates + phoneDuplicates);
  };

  const findMissingColumns = (data) => {
    if (data.length === 0) return;

    const columns = new Set(Object.keys(data[0]));
    const missing = requiredColumns.filter(col => !columns.has(col));
    setMissingColumns(missing.map(col => ({ column: col, status: 'Missing' })));
    setMissingColumnCount(missing.length);
  };

  const findMissingRows = (data) => {
    const missing = data.filter(row =>
      requiredColumns.some(col => !row[col] || row[col].trim() === '')
    );
    setMissingRows(missing);
    setMissingRowCount(missing.length);
  };

  const handleShowDuplicates = () => {
    setShowDuplicates(!showDuplicates);
    setShowMissingColumns(false);
    setCurrentPage(0); // Reset to the first page when switching views
  };

  const handleShowMissingColumns = () => {
    setShowMissingColumns(!showMissingColumns);
    setShowDuplicates(false);
    setCurrentPage(0); // Reset to the first page when switching views
  };

  const handleShowCorrectData = () => {
    setShowDuplicates(false);
    setShowMissingColumns(false);
    setCurrentPage(0); // Reset to the first page when switching views
  };

  const handleRemoveCSV = () => {
    setFile(null);
    setData([]);
    setShowUpload(false);
    setShowDuplicates(false);
    setShowMissingColumns(false);
    setSearchTerm('');
    setCurrentPage(0);
  };

  const downloadCSV = (data, filename) => {
    const csv = Papa.unparse(data);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleRemoveDuplicates = () => {
    setShowDuplicates(false);
  };

  return (
    <div className="flex h-[100%]">
      <div className="w-[20%] h-full m-2 fixed bg-[#00373A] text-white space-y-6 rounded-md">
        <div className="w-56 h-20 bg-orange-200 flex rounded-md m-2">
          <img className="absolute left-9 p-5" src="https://heycampus.in/School/asset/new-Logo.svg" />
        </div>
        <ul>
          <li className="hover:bg-[#00DC46] p-2 rounded text-center font-bold">UPLOAD CSV</li>
        </ul>
        <div className="w-64 left-5 absolute bottom-3">
          <img src="data:image/png;base64,4miski/sy/aNxMkDxHAz9qqA5Q2r7K9tL7/USNf9D7S6Mx4hD/ZbAAAAAElFTkSuQmCC" />
        </div>
      </div>

      <div className="flex-2 relative left-[21%] h-[100% auto] p-5 w-[78%] bg-slate-100 m-2 rounded-md">
        <div className="flex items-center justify-between bg-white shadow-md p-2 rounded-lg">
          <div className="flex items-center w-[77%] max-w-xs">
            <svg className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
              <path d="M21 20l-5.586-5.586A7.934 7.934 0 0 0 18 10a8 8 0 1 0-8 8c1.867 0 3.582-.634 4.956-1.682L20 21l1-1zm-8 0a6 6 0 1 1 0-12 6 6 0 0 1 0 12z" />
            </svg>
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearch}
              placeholder="Search..."
              className="w-full p-2 pl-3 text-sm text-gray-700 bg-transparent focus:outline-none"
            />
          </div>
          <div className="flex items-center space-x-3">
            <div className="relative ">
              <button className="flex items-center justify-center w-8 h-8 text-pink-600 bg-gray-200 rounded-full">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" />
                </svg>
              </button>
            </div>
            <div className="relative">
              <button className="flex items-center justify-center w-8 h-8 text-green-500 bg-gray-200 rounded-full">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 7.25a4.75 4.75 0 1 1 0 9.5m0-9.5a4.75 4.75 0 1 1 0 9.5m0-14.5C6.477 2.25 2.25 6.477 2.25 12S6.477 21.75 12 21.75 21.75 17.523 21.75 12 17.523 2.25 12 2.25z" />
                </svg>
              </button>
            </div>
            <div className="relative">
              <button className="flex items-center justify-center w-8 h-8 text-blue-600 bg-gray-200 rounded-full">
                <img className="rounded-full" src="https://d3f4i5flr9o011.cloudfront.net/HCSCHOOL0483-84V9TX5Q398P/logo/1718687940475.png" />
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 7.25a4.75 4.75 0 1 1 0 9.5m0-9.5a4.75 4.75 0 1 1 0 9.5m0-14.5C6.477 2.25 2.25 6.477 2.25 12S6.477 21.75 12 21.75 21.75 17.523 21.75 12 17.523 2.25 12 2.25z" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {!showUpload && (
          <label
            htmlFor="dropzone-file"
            className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed mt-8 border-gray-200 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <svg className="w-8 h-8 mb-4 text-gray-500" fill="none" viewBox="0 0 20 16">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
              </svg>
              <p className="mb-2 text-sm text-gray-500">
                <span className="font-semibold">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-gray-500">CSV File Only</p>
            </div>
            <input
              id="dropzone-file"
              type="file"
              className="hidden"
              accept=".csv"
              onChange={handleFileChange}
            />
            <div className='absolute top-[270px] right-10'>
              <button type="button" className="text-gray-900 bg-gradient-to-r from-red-200 via-red-300 to-yellow-200 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-red-100 dark:focus:ring-red-400 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">Upload CSV</button>
              <button type="button" className="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">Next</button>
            </div>
          </label>
        )}

        {file && (
          <div className="mt-4 text-gray-600">
            <p className="font-bold">
              SELECTED FILE: <span className="text-fuchsia-950">{file.name}</span>
            </p>
          </div>
        )}

        {data.length > 0 && (
          <div className="mt-4">
            <div className="flex justify-between mb-2">
              <div className="flex space-x-2">
                <button
                  type="button"
                  className={`text-white ${!showDuplicates && !showMissingColumns ? 'bg-green-500' : 'bg-gray-500'} hover:bg-green-600 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-4 py-2`}
                  onClick={handleShowCorrectData}
                >
                  Show Correct Data ({data.length - duplicateCount - missingRowCount})
                </button>
                <button
                  type="button"
                  className={`text-white ${showDuplicates ? 'bg-yellow-500' : 'bg-gray-500'} hover:bg-yellow-600 focus:ring-4 focus:outline-none focus:ring-yellow-300 font-medium rounded-lg text-sm px-4 py-2`}
                  onClick={handleShowDuplicates}
                >
                  Show Duplicates ({duplicateCount})
                </button>
                <button
                  type="button"
                  className={`text-white ${showMissingColumns ? 'bg-blue-500' : 'bg-gray-500'} hover:bg-blue-600 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2`}
                  onClick={handleShowMissingColumns}
                >
                  Show Missing Columns ({missingColumnCount})
                </button>
                <button
                  type="button"
                  className={`text-white ${showMissingRows ? 'bg-red-500' : 'bg-gray-500'} hover:bg-red-600 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-4 py-2`}
                  onClick={() => setShowMissingRows(!showMissingRows)}
                >
                  Show Missing Rows ({missingRowCount})
                </button>
                {showDuplicates && (
                  <button
                    type="button"
                    className="text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-4 py-2"
                    onClick={() => downloadCSV(duplicates, 'duplicates.csv')}
                  >
                    Download Duplicates
                  </button>
                )}
              </div>
            </div>

            <div className="w-full h-full">
              {showDuplicates && duplicates.length > 0 && (
                <div className="w-full overflow-hidden overflow-x-scroll relative">
                  <h3 className="font-bold text-lg mb-2">Duplicate Entries</h3>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={handleSearch}
                    placeholder="Search Duplicates..."
                    className="w-full p-2 pl-3 text-sm text-gray-700 bg-transparent focus:outline-none"
                  />
                  <button
                    type="button"
                    className="absolute top-0 right-0 mt-2 mr-2 text-white bg-red-500 hover:bg-red-600 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-2 py-1"
                    onClick={handleRemoveDuplicates}
                  >
                    Remove
                  </button>
                  <table className="divide-y border-4 border-[rgb(0,220,70)] divide-[rgb(0,58,50)] mt-4">
                    <thead>
                      <tr>
                        {Object.keys(duplicates[0]).map((key) => (
                          <th
                            key={key}
                            className="px-6 py-3 text-left text-xs font-medium text-white bg-[rgb(0,58,50)] uppercase tracking-wider">
                            {key}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredData.length === 0 ? (
                        <tr>
                          <td colSpan={Object.keys(duplicates[0]).length} className="px-6 py-4 text-center text-gray-500">No Data Available</td>
                        </tr>
                      ) : (
                        currentPageData.map((row, index) => (
                          <tr key={index}>
                            {Object.values(row).map((value, i) => (
                              <td key={i} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {value}
                              </td>
                            ))}
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                  <ReactPaginate
                    previousLabel={"<- Prev"}
                    nextLabel={"Next ->"}
                    breakLabel={"..."}
                    breakClassName={"break-me"}
                    pageCount={pageCount}
                    marginPagesDisplayed={1}
                    pageRangeDisplayed={1}
                    onPageChange={handlePageClick}
                    containerClassName={"pagination"}
                    activeClassName={"active"}
                    className="flex justify-end p-2 mt-4 space-x-2 font-semibold"
                    pageClassName=""
                  />
                </div>
              )}

              {showMissingColumns && missingColumns.length > 0 && (
                <div className="w-full overflow-hidden overflow-x-scroll">
                  <h3 className="font-bold text-lg mb-2">Missing Columns</h3>
                  <table className="divide-y border-4 border-[rgb(0,220,70)]  divide-[rgb(0,58,50)]">
                    <thead>
                      <tr>
                        <th
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Column
                        </th>
                        <th
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {missingColumns.map((col, index) => (
                        <tr key={index}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {col.column}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {col.status}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {showMissingRows && missingRows.length > 0 && (
                <div className="w-full overflow-hidden overflow-x-scroll relative">
                  <h3 className="font-bold text-lg mb-2">Missing Rows</h3>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={handleSearch}
                    placeholder="Search Missing Rows..."
                    className="w-full p-2 pl-3 text-sm text-gray-700 bg-transparent focus:outline-none"
                  />
                  <button
                    type="button"
                    className="absolute top-0 right-0 mt-2 mr-2 text-white bg-red-500 hover:bg-red-600 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-2 py-1"
                    onClick={() => setShowMissingRows(false)}
                  >
                    Remove
                  </button>
                  <table className="divide-y border-4 border-[rgb(0,220,70)] divide-[rgb(0,58,50)] mt-4">
                    <thead>
                      <tr>
                        {Object.keys(missingRows[0]).map((key) => (
                          <th
                            key={key}
                            className="px-6 py-3 text-left text-xs font-medium text-white bg-[rgb(0,58,50)] uppercase tracking-wider">
                            {key}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredData.length === 0 ? (
                        <tr>
                          <td colSpan={Object.keys(missingRows[0]).length} className="px-6 py-4 text-center text-gray-500">No Data Available</td>
                        </tr>
                      ) : (
                        currentPageData.map((row, index) => (
                          <tr key={index}>
                            {Object.values(row).map((value, i) => (
                              <td key={i} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {value}
                              </td>
                            ))}
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                  <ReactPaginate
                    previousLabel={"<- Prev"}
                    nextLabel={"Next ->"}
                    breakLabel={"..."}
                    breakClassName={"break-me"}
                    pageCount={pageCount}
                    marginPagesDisplayed={1}
                    pageRangeDisplayed={1}
                    onPageChange={handlePageClick}
                    containerClassName={"pagination"}
                    activeClassName={"active"}
                    className="flex justify-end p-2 mt-4 space-x-2 font-semibold"
                    pageClassName=""
                  />
                </div>
              )}

              {!showDuplicates && !showMissingColumns && !showMissingRows && (
                <React.Fragment>
                  <div className='border-4 border-[rgb(0,220,70)] w-full overflow-hidden overflow-x-scroll'>
                    <table className="divide-y divide-[rgb(0,58,50)] font-sans font-medium">
                      <thead>
                        <tr>
                          {Object.keys(data[0]).map((key) => (
                            <th
                              key={key}
                              className="px-6 py-3 text-left text-xs font-medium text-white bg-[rgb(0,58,50)] uppercase tracking-wider"
                            >
                              {key}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {filteredData.length === 0 ? (
                          <tr>
                            <td colSpan={Object.keys(data[0]).length} className="px-6 py-4 text-center text-gray-500">No Data Available</td>
                          </tr>
                        ) : (
                          currentPageData.map((row, index) => (
                            <tr key={index}>
                              {Object.values(row).map((value, i) => (
                                <td key={i} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {value}
                                </td>
                              ))}
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                  <ReactPaginate
                    previousLabel={"<- Prev"}
                    nextLabel={"Next ->"}
                    breakLabel={"..."}
                    breakClassName={"break-me"}
                    pageCount={pageCount}
                    marginPagesDisplayed={1}
                    pageRangeDisplayed={1}
                    onPageChange={handlePageClick}
                    containerClassName={"pagination"}
                    activeClassName={"active"}
                    className="flex justify-end p-2 mt-4 space-x-2 font-semibold"
                    pageClassName=""
                  />
                </React.Fragment>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Csvfile;







import React, { useState } from 'react';
import Papa from 'papaparse';
import ReactPaginate from 'react-paginate';









const Csvfile = () => {
  const [file, setFile] = useState(null);
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [showUpload, setShowUpload] = useState(false);
  const [showDuplicates, setShowDuplicates] = useState(false);
  const [showMissingColumns, setShowMissingColumns] = useState(false);
  const [showMissingRows, setShowMissingRows] = useState(false);
  const [duplicates, setDuplicates] = useState([]);
  const [missingColumns, setMissingColumns] = useState([]);
  const [missingRows, setMissingRows] = useState([]);
  const [duplicateCount, setDuplicateCount] = useState(0);
  const [missingColumnCount, setMissingColumnCount] = useState(0);
  const [missingRowCount, setMissingRowCount] = useState(0);

  const requiredColumns = ['email', 'phone']; 

  const handleFileChange = (e) => {
    setShowUpload(true);
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === 'text/csv') {
      setFile(selectedFile);
      parseCSV(selectedFile);
    } else {
      alert('Please upload a valid CSV file.');
      setFile(null);
      setData([]);
    }
  };






  const parseCSV = (file) => {
    Papa.parse(file, {
      complete: (result) => {
        const parsedData = result.data;
        setData(parsedData);
        findDuplicates(parsedData);
        findMissingColumns(parsedData);
        findMissingRows(parsedData);
      },
      header: true,
    });
  };

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  const offset = currentPage * rowsPerPage;
  const pageData = showDuplicates ? duplicates : showMissingColumns ? [] : data;
  const currentPageData = pageData.slice(offset, offset + rowsPerPage);
  const pageCount = Math.ceil(pageData.length / rowsPerPage);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value.toLowerCase());
  };

  const filteredData = pageData.filter((row) =>
    Object.values(row).some((val) =>
      val.toLowerCase().includes(searchTerm)
    )
  );

  const findDuplicates = (data) => {
    const emailMap = new Map();
    const mobilenumberMap = new Map();
    const duplicateEntries = [];

    data.forEach((row) => {
      const email = row.email?.toLowerCase();
      const phone = row.phone;

      if (email) {
        if (emailMap.has(email)) {
          duplicateEntries.push(row);
        }
        emailMap.set(email, (emailMap.get(email) || 0) + 1);
      }

      if (phone) {
        if (mobilenumberMap.has(phone)) {
          duplicateEntries.push(row);
        }
        mobilenumberMap.set(phone, (mobilenumberMap.get(phone) || 0) + 1);
      }
    });

    setDuplicates(duplicateEntries);
    const emailDuplicates = [...emailMap.values()].filter(count => count > 1).length;
    const phoneDuplicates = [...mobilenumberMap.values()].filter(count => count > 1).length;
    setDuplicateCount(emailDuplicates + phoneDuplicates);
  };

  const findMissingColumns = (data) => {
    if (data.length === 0) return;

    const columns = new Set(Object.keys(data[0]));
    const missing = requiredColumns.filter(col => !columns.has(col));
    setMissingColumns(missing.map(col => ({ column: col, status: 'Missing' })));
    setMissingColumnCount(missing.length);
  };

  const findMissingRows = (data) => {
    const missing = data.filter(row =>
      requiredColumns.some(col => !row[col] || row[col].trim() === '')
    );
    setMissingRows(missing);
    setMissingRowCount(missing.length);
  };

  const handleShowDuplicates = () => {
    setShowDuplicates(!showDuplicates);
    setShowMissingColumns(false);
    setCurrentPage(0); 
  };

  const handleShowMissingColumns = () => {
    setShowMissingColumns(!showMissingColumns);
    setShowDuplicates(false);
    setCurrentPage(0); 
  };

  const handleShowCorrectData = () => {
    setShowDuplicates(false);
    setShowMissingColumns(false);
    setCurrentPage(0); 
  };

  const handleRemoveCSV = () => {
    setFile(null);
    setData([]);
    setShowUpload(false);
    setShowDuplicates(false);
    setShowMissingColumns(false);
    setShowMissingRows(false);
    setSearchTerm('');
    setCurrentPage(0);
  };

  const downloadCSV = (data, filename) => {
    const csv = Papa.unparse(data);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

//   const handleRemoveDuplicates = () => {
//     setShowDuplicates(false);
//   };

  return (
    <div className="flex h-[100%]">
      <div className="w-[20%] h-full m-2 fixed bg-[#00373A] text-white space-y-6 rounded-md">
        <div className="w-56 h-20 bg-orange-200 flex rounded-md m-2">
          <img className="absolute left-9 p-5" src="https://heycampus.in/School/asset/new-Logo.svg" />
        </div>
        <ul>
          <li className="hover:bg-[#00DC46] p-2 rounded text-center font-bold">UPLOAD CSV</li>
        </ul>
        <div className="w-64 left-2 absolute bottom-3">
          <img src="file:///C:/Users/Raj%20Kumar%20N/Downloads/Logo%20mark.svg"/>
        </div>
      </div>

      <div className="flex-2 relative left-[21%] h-[100% auto] p-5 w-[78%] bg-slate-100 m-2 rounded-md">
        <div className="flex items-center justify-between bg-white shadow-md p-2 rounded-lg">
          <div className="flex items-center w-[77%] max-w-xs">
            <svg className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
              <path d="M21 20l-5.586-5.586A7.934 7.934 0 0 0 18 10a8 8 0 1 0-8 8c1.867 0 3.582-.634 4.956-1.682L20 21l1-1zm-8 0a6 6 0 1 1 0-12 6 6 0 0 1 0 12z" />
            </svg>
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearch}
              placeholder="Search..."
              className="w-full p-2 pl-3 text-sm text-gray-700 bg-transparent focus:outline-none"
            />
          </div>
          <div className="flex items-center space-x-3">
            <div className="relative ">
              <button className="flex items-center justify-center w-8 h-8 text-pink-600 bg-gray-200 rounded-full">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" />
                </svg>
              </button>
            </div>
            <div className="relative">
              <button className="flex items-center justify-center w-8 h-8 text-green-500 bg-gray-200 rounded-full">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 7.25a4.75 4.75 0 1 1 0 9.5m0-9.5a4.75 4.75 0 1 1 0 9.5m0-14.5C6.477 2.25 2.25 6.477 2.25 12S6.477 21.75 12 21.75 21.75 17.523 21.75 12 17.523 2.25 12 2.25z" />
                </svg>
              </button>
            </div>
            <div className="relative">
              <button className="flex items-center justify-center w-8 h-8 text-blue-600 bg-gray-200 rounded-full">
                <img className="rounded-full" src="https://d3f4i5flr9o011.cloudfront.net/HCSCHOOL0483-84V9TX5Q398P/logo/1718687940475.png" />
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 7.25a4.75 4.75 0 1 1 0 9.5m0-9.5a4.75 4.75 0 1 1 0 9.5m0-14.5C6.477 2.25 2.25 6.477 2.25 12S6.477 21.75 12 21.75 21.75 17.523 21.75 12 17.523 2.25 12 2.25z" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {!showUpload && (
          <label
            htmlFor="dropzone-file"
            className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed mt-8 border-gray-200 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <svg className="w-8 h-8 mb-4 text-gray-500" fill="none" viewBox="0 0 20 16">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
              </svg>
              <p className="mb-2 text-sm text-gray-500">
                <span className="font-semibold">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-gray-500">CSV File Only</p>
            </div>
            <input
              id="dropzone-file"
              type="file"
              className="hidden"
              accept=".csv"
              onChange={handleFileChange}
            />
            <div className='absolute top-[280px] right-2'>
              <button type="button" className="text-white bg-[rgb(0,55,58)] font-medium rounded-lg text-sm px-3 py-2 text-center me-2 mb-2">Upload CSV</button>
              <button type="button" className="text-white bg-[rgb(0,220,70)] font-medium rounded-lg text-sm px-3 py-2 text-center me-2 mb-2">Next</button>
            </div>
          </label>
        )}

        {file && (
          <div className="mt-4 text-gray-600">
            <p className="font-bold">
              SELECTED FILE: <span className="text-fuchsia-950">{file.name}</span>
            </p>
          </div>
        )}

        {data.length > 0 && (
          <div className="mt-4">
            <div className="flex justify-between mb-2">
              <div className="flex space-x-2">
                <button
                  type="button"
                  className={`text-white ${!showDuplicates && !showMissingColumns && !showMissingRows ? 'bg-green-500' : 'bg-gray-500'} hover:bg-green-600 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-4 py-2`}
                  onClick={handleShowCorrectData}
                >
                  Show Correct Data ({data.length - duplicateCount - missingRowCount})
                </button>
                <button
                  type="button"
                  className={`text-white ${showDuplicates ? 'bg-yellow-500' : 'bg-gray-500'} hover:bg-yellow-600 focus:ring-4 focus:outline-none focus:ring-yellow-300 font-medium rounded-lg text-sm px-4 py-2`}
                  onClick={handleShowDuplicates}
                >
                  Show Duplicates ({duplicateCount})
                </button>
                <button
                  type="button"
                  className={`text-white ${showMissingColumns ? 'bg-blue-500' : 'bg-gray-500'} hover:bg-blue-600 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2`}
                  onClick={handleShowMissingColumns}
                >
                  Show Missing Columns ({missingColumnCount})
                </button>
                <button
                  type="button"
                  className={`text-white ${showMissingRows ? 'bg-red-500' : 'bg-gray-500'} hover:bg-red-600 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-4 py-2`}
                  onClick={() => setShowMissingRows(!showMissingRows)}
                >
                  Show Missing Rows ({missingRowCount})
                </button>
                {showDuplicates && (
                  <button
                    type="button"
                    className="text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-4 py-2"
                    onClick={() => downloadCSV(duplicates, 'duplicates.csv')}
                  >
                    Download Duplicates
                  </button>
                )}
              </div>
              <button
                type="button"
                className="text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-4 py-2"
                onClick={handleRemoveCSV}
              >
                Remove
              </button>
            </div>

            <div className="w-full h-full">
              {showDuplicates && duplicates.length > 0 && (
                <div className="w-full overflow-hidden overflow-x-scroll relative">
                  <h3 className="font-bold text-lg mb-2">Duplicate Entries</h3>
                  {/* <input
                    type="text"
                    value={searchTerm}
                    onChange={handleSearch}
                    placeholder="Search Duplicates..."
                    className="w-full p-2 pl-3 text-sm text-gray-700 bg-transparent focus:outline-none"
                  /> */}
                  {/* <button
                    type="button"
                    className="absolute top-0 right-0 mt-2 mr-2 text-white bg-red-500 hover:bg-red-600 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-2 py-1"
                    onClick={handleRemoveDuplicates}
                  >
                    Remove
                  </button> */}
                  <table className="divide-y border-4 border-[rgb(0,220,70)] divide-[rgb(0,58,50)] mt-4">
                    <thead>
                      <tr>
                        {Object.keys(duplicates[0]).map((key) => (
                          <th
                            key={key}
                            className="px-6 py-3 text-left text-xs font-medium text-white bg-[rgb(0,58,50)] uppercase tracking-wider">
                            {key}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredData.length === 0 ? (
                        <tr>
                          <td colSpan={Object.keys(duplicates[0]).length} className="px-6 py-4 text-center text-gray-500">No Data Available</td>
                        </tr>
                      ) : (
                        currentPageData.map((row, index) => (
                          <tr key={index}>
                            {Object.values(row).map((value, i) => (
                              <td key={i} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {value}
                              </td>
                            ))}
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                  <ReactPaginate
                    previousLabel={"<- Prev"}
                    nextLabel={"Next ->"}
                    breakLabel={"..."}
                    breakClassName={"break-me"}
                    pageCount={pageCount}
                    marginPagesDisplayed={1}
                    pageRangeDisplayed={1}
                    onPageChange={handlePageClick}
                    containerClassName={"pagination"}
                    activeClassName={"active"}
                    className="flex justify-end p-2 mt-4 space-x-2 font-semibold"
                    pageClassName=""
                  />
                </div>
              )}

              {showMissingColumns && missingColumns.length > 0 && (
                <div className="w-full overflow-hidden overflow-x-scroll">
                  <h3 className="font-bold text-lg mb-2">Missing Columns</h3>
                  <table className="divide-y border-4 border-[rgb(0,220,70)]  divide-[rgb(0,58,50)]">
                    <thead>
                      <tr>
                        <th
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Column
                        </th>
                        <th
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {missingColumns.map((col, index) => (
                        <tr key={index}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {col.column}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {col.status}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {showMissingRows && missingRows.length > 0 && (
                <div className="w-full overflow-hidden overflow-x-scroll relative">
                  <h3 className="font-bold text-lg mb-2">Missing Rows</h3>
                  {/* <input
                    type="text"
                    value={searchTerm}
                    onChange={handleSearch}
                    placeholder="Search Missing Rows..."
                    className="w-full p-2 pl-3 text-sm text-gray-700 bg-transparent focus:outline-none"
                  /> */}
                  {/* <button
                    type="button"
                    className="absolute top-0 right-0 mt-2 mr-2 text-white bg-red-500 hover:bg-red-600 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-2 py-1"
                    onClick={() => setShowMissingRows(false)}
                  >
                    Remove
                  </button> */}
                  <table className="divide-y border-4 border-[rgb(0,220,70)] divide-[rgb(0,58,50)] mt-4">
                    <thead>
                      <tr>
                        {Object.keys(missingRows[0]).map((key) => (
                          <th
                            key={key}
                            className="px-6 py-3 text-left text-xs font-medium text-white bg-[rgb(0,58,50)] uppercase tracking-wider">
                            {key}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredData.length === 0 ? (
                        <tr>
                          <td colSpan={Object.keys(missingRows[0]).length} className="px-6 py-4 text-center text-gray-500">No Data Available</td>
                        </tr>
                      ) : (
                        currentPageData.map((row, index) => (
                          <tr key={index}>
                            {Object.values(row).map((value, i) => (
                              <td key={i} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {value}
                              </td>
                            ))}
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                  <ReactPaginate
                    previousLabel={"<- Prev"}
                    nextLabel={"Next ->"}
                    breakLabel={"..."}
                    breakClassName={"break-me"}
                    pageCount={pageCount}
                    marginPagesDisplayed={1}
                    pageRangeDisplayed={1}
                    onPageChange={handlePageClick}
                    containerClassName={"pagination"}
                    activeClassName={"active"}
                    className="flex justify-end p-2 mt-4 space-x-2 font-semibold"
                    pageClassName=""
                  />
                </div>
              )}

              {!showDuplicates && !showMissingColumns && !showMissingRows && (
                <React.Fragment>
                  <div className='border-4 border-[rgb(0,220,70)] w-full overflow-hidden overflow-x-scroll'>
                    <table className="divide-y divide-[rgb(0,58,50)] font-sans font-medium">
                      <thead>
                        <tr>
                          {Object.keys(data[0]).map((key) => (
                            <th
                              key={key}
                              className="px-6 py-3 text-left text-xs font-medium text-white bg-[rgb(0,58,50)] uppercase tracking-wider"
                            >
                              {key}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {filteredData.length === 0 ? (
                          <tr>
                            <td colSpan={Object.keys(data[0]).length} className="px-6 py-4 text-center text-gray-500">No Data Available</td>
                          </tr>
                        ) : (
                          currentPageData.map((row, index) => (
                            <tr key={index}>
                              {Object.values(row).map((value, i) => (
                                <td key={i} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {value}
                                </td>
                              ))}
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                  <ReactPaginate
                    previousLabel={"<- Prev"}
                    nextLabel={"Next ->"}
                    breakLabel={"..."}
                    breakClassName={"break-me"}
                    pageCount={pageCount}
                    marginPagesDisplayed={1}
                    pageRangeDisplayed={1}
                    onPageChange={handlePageClick}
                    containerClassName={"pagination"}
                    activeClassName={"active"}
                    className="flex justify-end p-2 mt-4 space-x-2 font-semibold"
                    pageClassName=""
                  />
                </React.Fragment>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Csvfile;




///using Mui 
import React, { useState, useRef, useEffect } from 'react';
import Papa from 'papaparse';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import * as XLSX from 'xlsx';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { yellow } from '@mui/material/colors';

const Csvfile = () => {
  const [file, setFile] = useState(null);
  const [data, setData] = useState([]);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [showTable, setShowTable] = useState(false);
  const [submitted, setSubmitted] = useState(false); 
  const [showAll, setShowAll] = useState(true);
  const [showDuplicates, setShowDuplicates] = useState(false);
  const [showMissingRows, setShowMissingRows] = useState(false);
  const [duplicates, setDuplicates] = useState([]);
  const [missingRows, setMissingRows] = useState([]);
  const [correctData, setCorrectData] = useState([]);
  const [duplicateCount, setDuplicateCount] = useState(0);
  const [missingRowCount, setMissingRowCount] = useState(0);
  const [error, setError] = useState('');
  const [pageData, setPageData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [defaultColumns, setDefaultColumns] = useState([]);
  const [showAllColumns, setShowAllColumns] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (showAll) {
      setPageData(data);
    } else if (showDuplicates) {
      setPageData(duplicates);
    } else if (showMissingRows) {
      setPageData(missingRows);
    } else {
      setPageData(correctData);
    }
  }, [showAll, showDuplicates, showMissingRows, correctData, duplicates, missingRows, data]);

  useEffect(() => {
    if (data.length > 0) {
      const initialColumns = Object.keys(data[0]).map((key) => ({
        field: key,
        headerName: key,
        width: 150,
        headerClassName: 'custom-header',
      }));
      setColumns(initialColumns);
      setDefaultColumns(initialColumns.slice(0, 6));
    }
  }, [data]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    validateFile(selectedFile);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const selectedFile = e.dataTransfer.files[0];
    validateFile(selectedFile);
  };

  const validateFile = (selectedFile) => {
    if (selectedFile && (selectedFile.type === 'text/csv' || selectedFile.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')) {
      setFile(selectedFile);
      setError('');
    } else {
      setError('Please upload a valid CSV or XLS file.');
      setFile(null);
      setData([]);
      setShowTable(false);
      setSubmitted(false);
    }
  };

  const parseFile = (file) => {
    if (file.type === 'text/csv') {
      Papa.parse(file, {
        complete: (result) => {
          const parsedData = result.data.map((row) => ({ ...row }));
          setData(parsedData);
          processParsedData(parsedData);
        },
        header: true,
      });
    } else {
      const reader = new FileReader();
      reader.onload = (e) => {
        const workbook = XLSX.read(e.target.result, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        const parsedData = jsonData.map((row) => ({ ...row }));
        setData(parsedData);
        processParsedData(parsedData);
      };
      reader.readAsBinaryString(file);
    }
  };

  const processParsedData = (parsedData) => {
    findDuplicates(parsedData);
    findMissingRows(parsedData);
    findCorrectData(parsedData);
    setShowTable(true); 
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value.toLowerCase());
  };

  const filteredData = pageData.filter((row) =>
    Object.values(row).some((val) =>
      typeof val === 'string' && val.toLowerCase().includes(searchTerm)
    )
  );

  const findDuplicates = (data) => {
    const seen = new Set();
    const duplicateEntries = data.filter((row) => {
      const identifier = `${row.email}-${row.phone}`;
      if (seen.has(identifier)) {
        return true;
      } else {
        seen.add(identifier);
        return false;
      }
    });

    setDuplicates(duplicateEntries);
    setDuplicateCount(duplicateEntries.length);
  };

  const findMissingRows = (data) => {
    const missing = data.filter(row =>
      Object.values(row).some(value => 
        value === undefined || value === null || (typeof value === 'string' && value.trim() === '')
      )
    );
    setMissingRows(missing);
    setMissingRowCount(missing.length);
  };

  const findCorrectData = (data) => {
    const correct = data.filter(row => {
      const identifier = `${row.email}-${row.phone}`;
      return (
        !Object.values(row).some(value => value === undefined || value === null || (typeof value === 'string' && value.trim() === '')) &&
        !duplicates.some(dupRow => `${dupRow.email}-${dupRow.phone}` === identifier)
      );
    });
    setCorrectData(correct);
  };

  const handleShowAll = () => {
    setShowAll(true);
    setShowDuplicates(false);
    setShowMissingRows(false);
    setShowAllColumns(false);
  };

  const handleShowDuplicates = () => {
    setShowDuplicates(true);
    setShowMissingRows(false);
    setShowAll(false);
    setShowAllColumns(false);
  };

  const handleShowMissingRows = () => {
    setShowMissingRows(true);
    setShowDuplicates(false);
    setShowAll(false);
    setShowAllColumns(false);
  };

  const handleShowCorrectData = () => {
    setShowDuplicates(false);
    setShowMissingRows(false);
    setShowAll(false);
    setShowAllColumns(false);
  };

  const handleShowAllColumns = () => {
    setShowAllColumns(true);
  };

  const handleShowDefaultColumns = () => {
    setShowAllColumns(false);
  };

  const downloadCSV = (data, filename) => {
    const csv = Papa.unparse(data);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleSubmit = () => {
    if (file) {
      parseFile(file);
      setSubmitted(true);
    } else {
      setError('Please upload a CSV or XLS file.');
    }
  };

  const columnsToShow = showAllColumns ? columns : defaultColumns;

  const theme = createTheme({
    components: {
      MuiDataGrid: {
        styleOverrides: {
          root: {
            border: '2px solid rgb(0,220,70)', 
          },
          columnHeaders: {
            backgroundColor: 'rgb(0,55,58)',
            color: 'black', 
            fontSize: '12px', 
          },
          cell: {
            fontSize: '11px', 
          },
        },
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <div className="flex h-[100%]">
        <div className="fixed left-0 z-[9999] h-screen top-0 p-4 w-auto">
          <div className="text-lg text-black h-full bg-[#00373A] w-[240px] rounded-lg flex duration-150 ease-in flex-col justify-between">
            <div className="cursor-pointer absolute top-10 right-0 bg-[#F9F7E8] rounded-full h-6 w-6 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true" data-slot="icon" className="absolute right-[3px] w-4 h-4 text-[#00373A] bg-[#F79115] rounded-full">
                <path fillRule="evenodd" d="M9.78 4.22a.75.75 0 0 1 0 1.06L7.06 8l2.72 2.72a.75.75 0 1 1-1.06 1.06L5.47 8.53a.75.75 0 0 1 0-1.06l3.25-3.25a.75.75 0 0 1 1.06 0Z" clipRule="evenodd"></path>
              </svg>
            </div>
            <div>
              <div className="p-1">
                <div className="p-4 h-[72px] bg-[#F9F7E8] flex justify-center gap-2 items-center rounded-lg">
                  <img src="https://upload.wikimedia.org/wikipedia/en/4/49/Anna_University_Logo.svg" className="h-10 w-10"/>
                  <h2 className="text-base font-medium text-gray-900">Anna University</h2>
                </div>
              </div>
              <div className="flex flex-col w-full gap-4 pt-8 overflow-hidden">
                <div className="flex w-full justify-between pl-4 items-center">
                  <a href="/" className="flex hover:text-white text-gray-300 items-center text-sm p-2 whitespace-nowrap">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true" data-slot="icon" className="h-6 w-6 mr-2 inline-block hover:text-white text-gray-300 outline-none border-none">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 7.125C2.25 6.504 2.754 6 3.375 6h6c.621 0 1.125.504 1.125 1.125v3.75c0 .621-.504 1.125-1.125 1.125h-6a1.125 1.125 0 0 1-1.125-1.125v-3.75ZM14.25 8.625c0-.621.504-1.125 1.125-1.125h5.25c.621 0 1.125.504 1.125 1.125v8.25c0 .621-.504 1.125-1.125 1.125h-5.25a1.125 1.125 0 0 1-1.125-1.125v-8.25ZM3.75 16.125c0-.621.504-1.125 1.125-1.125h5.25c.621 0 1.125.504 1.125 1.125v2.25c0 .621-.504 1.125-1.125 1.125h-5.25a1.125 1.125 0 0 1-1.125-1.125v-2.25Z"></path>
                    </svg>
                    Dashboard
                  </a>
                </div>
                <div className="flex w-full justify-between pl-4 items-center">
                  <a href="/tests" className="flex text-white items-center text-sm p-2 whitespace-nowrap">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true" data-slot="icon" className="h-6 w-6 mr-2 inline-block text-[#F79115]">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"></path>
                    </svg>
                    CSV File Upload
                  </a>
                  <div className="h-10 w-[10px] bg-[#F79115] rounded-s-md"></div>
                </div>
              </div>
            </div>
            <div className="overflow-hidden h-[150px] rounded-lg w-full">
              <div className="translate-y-4">
                {/* <img src="data:image/png;base64,VALID_BASE64_STRING" className="h-full w-full" /> */}
              </div>
            </div>
          </div>
        </div>

        <div className="flex-2 relative left-[21%] h-[100% auto] p-2 w-[78%] bg-slate-100 m-2 rounded-md">
        <div class="flex lg:flex-row flex-col gap-4 lg:justify-between p-4 border-b border-gray-200 lg:items-center"><h3 class="font-medium text-gray-500 w-max flex gap-1 items-center text-xl">Welcome, <span class="text-gray-900 font-bold">Raja</span></h3><div class="flex lg:flex-row flex-col lg:justify-end w-full gap-4 items-center"><div class="px-2 py-1 rounded-lg border bg-white items-center w-full lg:w-[400px] border-gray-200 flex gap-2"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true" data-slot="icon" class="h-4 w-4"><path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"></path></svg>
          <input placeholder="Search" class="flex-1 outline-none text-sm border-none"/></div><div class="flex items-center gap-4"><div class="h-10 w-10   rounded-full bg-white">
            <img src="https://greatify-pi.vercel.app/assets/image-B3JUnNNH.png" class="h-full w-full rounded-full"/></div>
            <div class="h-10 w-10 p-2  rounded-full bg-white"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true" data-slot="icon" class="h-full w-full"><path stroke-linecap="round" stroke-linejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0"></path></svg>
          </div><div class="h-10 w-10 p-2  rounded-full bg-white"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true" data-slot="icon" class="h-full w-full"><path stroke-linecap="round" stroke-linejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z"></path>
          <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"></path></svg>
          </div><div class="h-10 w-10   rounded-full bg-white"><img src="https://upload.wikimedia.org/wikipedia/en/4/49/Anna_University_Logo.svg" class="h-full w-full rounded-full"/></div></div>
          </div>
           </div>
          {!submitted && (
            <label
              htmlFor="dropzone-file"
              className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed mt-8 border-gray-200 rounded-lg cursor-pointer bg-gray-50 hover:bg-[rgb(217,221,214)]"
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}>
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <svg className="w-8 h-8 mb-4 text-gray-500" fill="none" viewBox="0 0 20 16">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
              </svg>
              <p className="mb-2 text-sm text-gray-500">
                <span className="font-semibold">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-gray-500">CSV or XLS File Only</p>
            </div>
            <input
              id="dropzone-file"
              type="file"
              className="hidden"
              accept=".csv, .xls, .xlsx"
              onChange={handleFileChange}/>
            {file && (
              <div className="absolute top-[230px] left-[40%] text-sm text-[rgb(0,220,70)] hover:text-white">
                <p>File Name : {file.name}</p>
              </div>
            )}
            <div className='absolute top-[280px] right-2'>
              <button type='button' className='text-white bg-[rgb(0,55,58)] font-medium rounded-lg text-xs p-2 text-center me-2 mb-2' onClick={handleSubmit}>Submit</button>
            </div>
          </label>
        )}

        {error && (
          <div className="text-red-500 text-left text-[13px] font-sans font-medium p-4 rounded-lg shadow-sm inline-block mt-2"><span className='text-black text-[13px]'>Error</span> : {error}</div>
        )}

        {submitted && showTable && data.length > 0 && (
          <div className="mt-4 text-black m-16">
          <p className="font-bold absolute left-[35%] shadow-xl shadow-slate-200 text-[rgb(0,55,58)]">
             FILE NAME : <span className="text-fuchsia-950">{file.name}</span>
          </p>
          {/* <h5 className='font-bold'>Total Entries : {data.length}</h5> */}
        </div>
        )}

        {submitted && showTable && data.length > 0 && (
          <div className="mt-4">
            

             



            <div className="flex mb-2 justify-end shadow-neutral-400">
<div className='flex m-2'>
            <div class="flex  gap-1 items-center  px-2 h-6 w-40 bg-white rounded-md border border-gray-200 ">
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true" data-slot="icon" class="h-3 w-3 bg-transparent text-gray-500">
               <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"></path></svg>
              <input placeholder="Search"  onChange={handleSearch}  value={searchTerm} class="outline-none text-[10px] placeholder:text-[10px] bg-gray-100 w-32 border-none"/>
              </div>
              </div>
              <div class="rounded-md bg-gray-200 border gap-1 border-gray-300  p-2 flex items-center w-max">
                <div class={`h-full w-max px-2 py-1 rounded-lg text-xs border ${showAll ? 'border-purple-500 bg-white' : 'border-gray-200 bg-gray-100'} flex justify-center items-center cursor-pointer`} onClick={handleShowAll}>
                  <span class="w-max text-gray-500">All : {data.length}</span>
                </div>
                <div class={`h-full w-max px-2 py-1 rounded-lg text-xs border ${!showDuplicates && !showMissingRows && !showAll ? 'border-purple-500 bg-white' : 'border-gray-200 bg-gray-100'} flex justify-center items-center cursor-pointer`} onClick={handleShowCorrectData}>
                  <span class="w-max text-gray-500">Correct : {correctData.length}</span>
                </div>
                <div class={`h-full w-max px-2 py-1 rounded-lg text-xs border ${showDuplicates ? 'border-purple-500 bg-white' : 'border-gray-200 bg-gray-100'} flex justify-center items-center cursor-pointer`} onClick={handleShowDuplicates}>
                  <span class="w-max text-gray-500">Duplicates : {duplicateCount}</span>
                </div>
                <div class={`h-full w-max px-2 py-1 rounded-lg text-xs border ${showMissingRows ? 'border-red-500 bg-white' : 'border-gray-200 bg-gray-100'} flex justify-center items-center cursor-pointer`} onClick={handleShowMissingRows}>
                  <span class="w-max text-gray-500">Missing Rows : {missingRowCount}</span>
                </div>
              </div>
     
              <div class="rounded-md bg-gray-200 border gap-1 border-gray-300 p-2 flex items-center w-max ml-2">
                <div class={`h-full w-max px-2 py-1 rounded-lg text-xs border ${!showAllColumns ? 'border-purple-500 bg-white' : 'border-gray-200 bg-gray-100'} flex justify-center items-center cursor-pointer`} onClick={handleShowDefaultColumns}>
                  <span class="w-max text-gray-500">Default Columns</span>
                </div>
                <div class={`h-full w-max px-2 py-1 rounded-lg text-xs border ${showAllColumns ? 'border-purple-500 bg-white' : 'border-gray-200 bg-gray-100'} flex justify-center items-center cursor-pointer`} onClick={handleShowAllColumns}>
                  <span class="w-max text-gray-500">All Columns</span>
                </div>
              </div> 


              {showDuplicates && duplicates.length > 0 && (
                <button
                  type="button"
                  className="text-white bg-gray-500 hover:bg-white hover:text-black hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 rounded-lg text-[10px] font-semibold px-3 py-2"
                  onClick={() => downloadCSV(duplicates, 'duplicates.csv')}>
                  Download Duplicates
                </button>
              )}
            </div>
            <div className="w-full h-full rounded-md" style={{ height: 450, width: '100%' }}>
              <DataGrid
                rows={filteredData.length ? filteredData : pageData}
                columns={columnsToShow}
                pageSize={rowsPerPage}
                getRowId={(row) => JSON.stringify(row)}
                components={{ Toolbar: GridToolbar }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  </ThemeProvider>
);
};

export default Csvfile;

