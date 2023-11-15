import './App.css'
import { FaPlus } from "react-icons/fa";
import { AiFillPrinter } from "react-icons/ai";
import { FaEdit } from "react-icons/fa";
import { IoIosCloseCircle } from "react-icons/io";
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addToTable, deleteRow, editRow } from './Redux/TableSlice';

function App() {
  const [NewRow, SetNewRow] = useState({})
  const [closeState, setCloseState] = useState(false)
  const [EditMode, setEditMode] = useState(false)
  const { tableData } = useSelector(state => state.Table)
  const dispatch = useDispatch()




  const [IndexPage, SetIndexPage] = useState(0)
  const [currentSliceData, SetcurrentSliceData] = useState([])
  const [tableSlices, SettableSlices] = useState([])
  // Function to update the slice data based on the current index
  const updateSliceData = () => {
    for (let i = 0; i < Math.ceil(tableData.length / 5); i++) {
      tableSlices[i] = [];
      for (let j = i * 5; j < (i + 1) * 5; j++) {
        if (j < tableData.length) {
          tableSlices[i].push(tableData[j]);
        }
      }
    }
    SetcurrentSliceData(tableSlices[IndexPage]);
  };


  useEffect(() => {
    updateSliceData();
  }, [tableData, IndexPage]);

  //Add Row
  const handleNewButtonClick = () => {
    setCloseState(true);
    setEditMode(false);
  }



  //Take Date from inputs
  const handleInputChange = (event) => {

    const { name, value } = event.target;

    if (value !== null || value !== undefined || value !== "") {
      SetNewRow((prevRowData) => ({
        ...prevRowData,
        [name]: value,
      }));
    }

  };

  //Edit ROW
  const editActionHandle = (item) => {
    setEditMode(true)
    setCloseState(true)
    SetNewRow(item)
  }

  const handleSubmit = (event) => {
    event.preventDefault();

    if (EditMode) {
      dispatch(editRow(NewRow));
      setCloseState(false);
      setEditMode(false); // Set EditMode to false after editing
    } else {
      const Index = tableData.findIndex(
        (item) =>
          Number(item.id) === Number(NewRow.id) && item !== null
      );
      if (Index !== -1) {
        alert("This row already exists");
      } else {
        dispatch(addToTable(NewRow));
        setCloseState(false);
      }
    }
  };


  const deleteSelectedRow = (id) => {
    dispatch(deleteRow(id))
  }

  // handle pages
  const handlePrevious = () => {
    if (IndexPage > 0) {
      SetIndexPage(prev => prev - 1);
    }
  };

  const handleNext = () => {
    if (IndexPage < tableSlices.length - 1) {
      SetIndexPage(prev => prev + 1);
    }
  };


  return (
    <div className='flex relative flex-col'>
      <h1 className='font-bold text-[42px] text-center py-2'>CRUDS Operation System</h1>
      <div className='border-[2px] border-gray-100' />
      {/* New PDF Side */}
      <div className='mx-[120px] flex flex-col'>
        <div className='flex justify-between mt-8'>
          <button onClick={handleNewButtonClick} className='bg-blue-800 flex justify-center items-center gap-1  text-white font-bold px-3 py-1 rounded-md shadow-md shadow-neutral-600'>
            <FaPlus size={16} />
            <p>New</p>
          </button>

          <button className='bg-green-500 flex justify-center items-center gap-1 text-white font-bold px-3 py-1 rounded-md shadow-md shadow-neutral-600'>
            <AiFillPrinter size={16} />
            <p>PDF</p>
          </button>
        </div>

        {/* Search Side */}
        <div className='flex justify-end gap-2 mt-6 items-center'>
          <p className='text-neutral-500 font-bold'>Search:</p>
          <input type='text' width={150} className='pl-2 p-1 text-[14px] rounded-md border-neutral-300 border-2' />
        </div>

        {/* Table Side */}
        <table className='border mt-8'>
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
            {
              currentSliceData && currentSliceData.map((rowData, index) => (
                <tr key={index} className={`${index % 2 === 0 ? 'bg-neutral-200' : ''} text-neutral-600 font-normal text-[14px] h-12`}>
                  <td className='border-r text-center border-gray-300'>{rowData.id} </td>
                  <td className='border-r text-center border-gray-300'>{rowData.first} </td>
                  <td className='border-r text-center border-gray-300'>{rowData.last} </td>
                  <td className='border-r text-center border-gray-300'>{rowData.address} </td>
                  <td className='border-r text-center border-gray-300'>{rowData.date} </td>
                  <td className='border-r text-center border-gray-300' >
                    <div className='flex justify-center items-center gap-2'>
                      <button
                        onClick={() => editActionHandle(rowData)}
                        className='bg-green-500 rounded-md   flex justify-center items-center px-3 py-1 text-white font-bold '>
                        <FaEdit />
                        <p>Edit</p>
                      </button>
                      <button
                        onClick={() => deleteSelectedRow(rowData.id)}
                        className='bg-red-600 rounded-md  flex justify-center items-center px-3 py-1 text-white font-bold '>
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
        <div className='mt-4 flex justify-between'>
          <p className='text-neutral-600 text-[14px] tracking-wider'>Show {IndexPage + 1} to {tableSlices.length} of {tableSlices.length} entries</p>
          <div className='flex h-8 border overflow-hidden items-center rounded-md shadow-md'>
            <button onClick={handlePrevious}
              className={`${IndexPage === 0 ? 'cursor-not-allowed text-neutral-300 ' : 'cursor-pointer text-neutral-600 '} px-2 text-center`}>Previous</button>

            <p className='px-3 py-1 text-center text-white font-bold bg-blue-500 '>{IndexPage + 1}</p>

            <button onClick={handleNext}
              className={`${IndexPage === tableSlices.length - 1 || tableSlices.length === 0 ? 'cursor-not-allowed text-neutral-300' : 'cursor-pointer text-neutral-600'}  px-2 text-center`}>Next</button>
          </div>
        </div>
      </div>


      {/* Edit Add Side */}
      <div className={`${closeState ? 'flex' : 'hidden'} justify-center items-center absolute w-full h-screen transform   z-[999] `}>
        <div className='flex  flex-col overflow-hidden h-[390px]  w-[70%] mx-auto pb-2 bg-white shadow-md rounded-md '>
          <div className=' bg-neutral-300'>
            <div className='flex justify-end px-2 py-1 cursor-pointer' onClick={() => { setCloseState(false); setEditMode(false) }}>
              <IoIosCloseCircle size={26} color='red' />
            </div>
            <div className='border' />
          </div>
          <h1 className='text-[22px] ml-2 my-4 font-bold '>Add Row</h1>

          <form onSubmit={(event) => handleSubmit(event)}>
            <div className='flex flex-col py-6 px-3 gap-4 text-neutral-600'>
              {
                EditMode ? ''
                  : (
                    <div className='flex gap-3 text-[12px] items-center'>
                      <p className='w-[70px]'>ID Number :</p>
                      <input
                        required
                        onChange={(event) => handleInputChange(event)}
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
                  onChange={(event) => handleInputChange(event)}
                  name='first'
                  placeholder={EditMode ? NewRow.first : ''}
                  type='text'
                  className='w-[70%] border border-neutral-400 rounded-md pl-2 py-1' />
              </div>
              <div className='flex gap-3 text-[12px] items-center'>
                <p className='w-[70px]'>Last Name :</p>
                <input
                  required
                  onChange={(event) => handleInputChange(event)}
                  name='last'
                  placeholder={EditMode ? NewRow.last : ''}
                  type='text'
                  className='w-[70%] border border-neutral-400 rounded-md pl-2 py-1' />
              </div>
              <div className='flex gap-3 text-[12px] items-center'>
                <p className='w-[70px]'> Address :</p>
                <input
                  required
                  onChange={(event) => handleInputChange(event)}
                  name='address'
                  placeholder={EditMode ? NewRow.address : ''}
                  type='text'
                  className='w-[70%] border border-neutral-400 rounded-md pl-2 py-1' />
              </div>
              <div className='flex gap-3 text-[12px] items-center'>
                <p className='w-[70px]'>Date :</p>
                <input
                  required
                  onChange={(event) => handleInputChange(event)}
                  name='date'
                  placeholder={EditMode ? NewRow.date : ''}
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
