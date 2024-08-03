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



