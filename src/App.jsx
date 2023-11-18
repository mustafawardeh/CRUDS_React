import './App.css'
import { FaPlus } from "react-icons/fa";
import { AiFillPrinter } from "react-icons/ai";
import { FaEdit } from "react-icons/fa";
import { IoIosCloseCircle } from "react-icons/io";
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addToTable, deleteRow, editRow } from './Redux/TableSlice';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

function App() {
  const [closeState, setCloseState] = useState(true)
  const [EditMode, setEditMode] = useState(false)
  const [NewRow, SetNewRow] = useState({})


  const [IndexPage, SetIndexPage] = useState(0)
  const [currentSliceData, SetcurrentSliceData] = useState([])
  const [tableSlices, SettableSlices] = useState([])

  const [EntireData, setEntireData] = useState([])
  const [searchTextValue, setsearchTextValue] = useState('')

  const { tableData } = useSelector(state => state.Table)
  const dispatch = useDispatch()


  useEffect(() => {
    updateDataAndSlices();
  }, [tableData, searchTextValue, IndexPage]);

  const updateDataAndSlices = () => {
    let updatedData = tableData;

    if (searchTextValue !== '') {
      updatedData = tableData.filter((prev) => prev.first.toLowerCase().includes(searchTextValue));
    }

    setEntireData(updatedData);

    const newTableSlices = [];
    for (let i = 0; i < Math.ceil(updatedData.length / 5); i++) {
      newTableSlices[i] = updatedData.slice(i * 5, (i + 1) * 5);
    }

    SettableSlices(newTableSlices);
    SetcurrentSliceData(newTableSlices[IndexPage]);
  };

  const HandleAddEditFunction = (event) => {
    let { name, value } = event.target
    SetNewRow((prevNewRowData) => ({
      ...prevNewRowData,
      [name]: value
    }))
  }

  const HandleSubmitFunction = (event) => {
    event.preventDefault();
    if (EditMode) {
      dispatch(editRow(NewRow))
      setCloseState(true)
      setEditMode(false)
      SetNewRow({})
      location.reload()

    }
    else {
      const index = EntireData.findIndex(row => Number(row.id) === Number(NewRow.id))
      if (index === -1) {
        setCloseState(true)
        dispatch(addToTable(NewRow))
        SetNewRow({})
        location.reload()
      }
      else {
        alert('Please Add New Data With New Id Number')
      }
    }
  }


  // ----------------- Delete Row , Edit Row ---------------------
  const handleAddFunction = () => {
    if (EditMode) {
      setEditMode(false)
    }
    setCloseState(false)
  }

  const handleEditRowFunction = (rowData) => {
    setCloseState(false)
    setEditMode(true)
    SetNewRow(rowData)
  }


  const handleDeleteRowFunction = (rowData) => {
    dispatch(deleteRow(rowData))
    if (currentSliceData.length === 0) {
      SetIndexPage(prev => prev === 0 ? prev : prev - 1)
    }
  }

  const handleSearchFunction = (event) => {
    event.preventDefault()
    let searchValue = event.target.value;
    setsearchTextValue(searchValue)


  }

  const PDFHandleFunction = (e) => {
    e.preventDefault();

    // Create a new instance of jsPDF
    const pdfDoc = new jsPDF();

    // Set column headers
    const headers = [['ID', 'First Name', 'Last Name', 'Address', 'Date']];

    // Extract data for the table
    const data = tableData.map((row) => [row.id, row.first, row.last, row.address, row.date]);

    // Add the table to the PDF document
    pdfDoc.autoTable({
      head: headers,
      body: data,
    });

    // Save the PDF
    pdfDoc.save('tableData.pdf');
  };
  return (
    <div className='flex relative flex-col'>
      <h1 className='font-bold md:text-[42px] text-[26px] text-center py-2'>CRUDS Operation System</h1>
      <div className='border-[2px] border-gray-100' />
      {/* New PDF Side */}
      <div className='md:mx-[120px] mx-[15px] flex flex-col'>
        <div className='flex justify-between mt-8 '>
          <button onClick={() => { handleAddFunction() }} className='bg-blue-800 flex  md:text-[16px] text-[12px]  justify-center  items-center gap-1  text-white font-bold px-3 py-1 rounded-md shadow-md shadow-neutral-600'>
            <FaPlus />
            <p>New</p>
          </button>

          <button onClick={(event) => PDFHandleFunction(event)} className='bg-green-500 flex  md:text-[16px] text-[12px]  justify-center items-center gap-1 text-white font-bold px-3 py-1 rounded-md shadow-md shadow-neutral-600'>
            <AiFillPrinter />
            <p>PDF</p>
          </button>
        </div>

        {/* Search Side */}
        <div className='flex justify-end gap-2 mt-6 items-center'>
          <p className='text-neutral-500 font-bold'>Search:</p>
          <input type='text' onChange={(event) => { handleSearchFunction(event) }} className='pl-2 p-1 md:text-[14px] text-[11px] md:w-[150px] w-[120px] rounded-md border-neutral-300 border-2' />
        </div>

        {/* Table Side */}
        <table className='border mt-8 md:text-[16px] text-[12px]'>
          <thead>
            <tr className='h-12'>
              <th className='border-r'>ID </th>
              <th className='border-r'>First Name </th>
              <th className='border-r'>Last Name </th>
              <th className='border-r'>Address </th>
              <th className='border-r'>Date </th>
              <th className='border-r'>Action </th>
            </tr>
          </thead>
          <tbody>
            {/* currentSliceData && currentSliceData.map((rowData, index) => ( */}

            {
              currentSliceData && currentSliceData.map((rowData, index) => (
                <tr key={index} className={`${index % 2 === 0 ? 'bg-neutral-200' : ''} text-neutral-600 font-normal md:text-[14px] text-[11px] h-12`}>
                  <td className='border-r text-center border-gray-300'>{rowData.id} </td>
                  <td className='border-r text-center border-gray-300'>{rowData.first} </td>
                  <td className='border-r text-center border-gray-300'>{rowData.last} </td>
                  <td className='border-r text-center border-gray-300'>{rowData.address} </td>
                  <td className='border-r text-center border-gray-300'>{rowData.date} </td>
                  <td className='border-r text-center border-gray-300' >
                    <div className='flex justify-center md:text-[14px] text-[11px] items-center md:gap-2 space-x-[2px]'>
                      <button
                        onClick={() => { handleEditRowFunction(rowData) }}
                        className='bg-green-500 rounded-md   flex justify-center items-center md:px-3 md:py-1 px-[5px] py-[2px] text-white font-bold '>
                        <FaEdit />
                        <p>Edit</p>
                      </button>
                      <button
                        onClick={() => { handleDeleteRowFunction(rowData) }}
                        className='bg-red-600 rounded-md  flex justify-center items-center md:px-3 md:py-1 px-[5px] py-[2px] text-white font-bold '>
                        <FaEdit />
                        <p>Delete</p>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            }

          </tbody>
        </table>

        {/* Pages Side */}
        <div className='mt-4 flex justify-between text-[12px]'>
          <p className='text-neutral-600  tracking-wider'>Show <span className='font-bold text-neutral-600'> {IndexPage + 1}</span> to <span className='font-bold text-neutral-600'>{tableSlices.length}</span>  of <span className='font-bold text-neutral-600'>{tableSlices.length}</span>  entries</p>
          <div className='flex h-8 border overflow-hidden items-center rounded-md shadow-md'>
            <button onClick={(event) => { SetIndexPage(prev => prev === 0 ? 0 : prev - 1); IndexPage === 0 ? '' : '' }}
              className={`${IndexPage === 0 ? 'cursor-not-allowed text-neutral-300 ' : 'cursor-pointer text-neutral-600 '} px-2 text-center`}>Previous</button>

            <p className='px-3 py-1 text-center text-white font-bold bg-blue-500 '>{IndexPage + 1}</p>

            <button onClick={() => { SetIndexPage(prev => prev === tableSlices.length - 1 ? prev : prev + 1) }}
              className={`${IndexPage === tableSlices.length - 1 || tableSlices.length === 0 ? 'cursor-not-allowed text-neutral-300' : 'cursor-pointer text-neutral-600'}  px-2 text-center`}>Next</button>
          </div>
        </div>
      </div>


      {/* Edit Add Side */}
      <div className={`${!closeState ? 'flex' : 'hidden'} justify-center items-center absolute w-full h-screen transform   z-[999] `}>
        <div className='flex  flex-col overflow-hidden h-[390px]  w-[70%] mx-auto pb-2 bg-white shadow-md rounded-md '>
          <div className=' bg-neutral-300'>
            <div className='flex justify-end px-2 py-1 cursor-pointer' onClick={() => { setCloseState(true) }}>
              <IoIosCloseCircle size={26} color='red' />
            </div>
            <div className='border' />
          </div>
          <h1 className='text-[22px] ml-2 my-4 font-bold '>Add Row</h1>

          <form onSubmit={(event) => { HandleSubmitFunction(event) }}>
            <div className='flex flex-col py-6 px-3 gap-4 text-neutral-600'>
              {
                EditMode ? ''
                  : (
                    <div className='flex gap-3 text-[12px] items-center'>
                      <p className='w-[70px]'>ID Number :</p>
                      <input
                        required
                        onChange={(event) => { HandleAddEditFunction(event) }}
                        name='id'
                        placeholder='ID Number'
                        type='number'
                        className='w-[70%] border border-neutral-400 rounded-md pl-2 py-1' />
                    </div>
                  )
              }
              <div className='flex gap-3 text-[12px] items-center'>
                <p className='w-[70px]'>First Name :</p>
                <input
                  required
                  onChange={(event) => { HandleAddEditFunction(event) }}
                  name='first'
                  placeholder={'first name'}
                  type='text'
                  className='w-[70%] border border-neutral-400 rounded-md pl-2 py-1' />
              </div>
              <div className='flex gap-3 text-[12px] items-center'>
                <p className='w-[70px]'>Last Name :</p>
                <input
                  required
                  onChange={(event) => { HandleAddEditFunction(event) }}
                  name='last'
                  placeholder={'last name'}
                  type='text'
                  className='w-[70%] border border-neutral-400 rounded-md pl-2 py-1' />
              </div>
              <div className='flex gap-3 text-[12px] items-center'>
                <p className='w-[70px]'> Address :</p>
                <input
                  required
                  onChange={(event) => { HandleAddEditFunction(event) }}
                  name='address'
                  placeholder={'address'}
                  type='text'
                  className='w-[70%] border border-neutral-400 rounded-md pl-2 py-1' />
              </div>
              <div className='flex gap-3 text-[12px] items-center'>
                <p className='w-[70px]'>Date :</p>
                <input
                  required
                  onChange={(event) => { HandleAddEditFunction(event) }}
                  name='date'
                  placeholder={'date'}
                  type='date' className='w-[70%] border border-neutral-400 rounded-md pl-2 py-1' />
              </div>
              <div className='flex justify-end '>
                <button
                  type='submit' className='text-white font-bold bg-green-500 py-1 px-3 rounded-md shadow-md'>{EditMode ? 'Edit' : 'Add'}</button>
              </div>
            </div>
          </form>


        </div>
      </div>
    </div >
  )
}

export default App
