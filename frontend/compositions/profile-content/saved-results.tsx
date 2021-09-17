import * as React from "react"

import { useTable, usePagination } from "react-table"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faAngleRight } from "@fortawesome/free-solid-svg-icons"

import { resultsColumns } from "../../models/search-meta"
import { savedResultsData } from "../../models/mock-data"

import styles from "./saved.module.css"

export default function SavedResults() {
  const { useState, useMemo } = React

  const [editMode, setEditMode] = useState(false)

  const {
    tableWrapper,
    tableHeader,
    tableTitle,
    editButton,
    editButtonOn,
    dataTable,
    dataHeader,
    dataFooter,
    dataRowPage,
    dataRows
  } = styles

  const data = useMemo(() => savedResultsData, [])
  const columns = useMemo(() => resultsColumns, [])
  

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize }
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0 }
    },
    usePagination
  )

  const [pageSizeValue, setPageSizeValue] = useState(pageSize)

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setPageSizeValue(+e.target.value)
  }

  function handleBlur(e: React.FocusEvent<HTMLInputElement>) {
    setPageSize(+e.target.value)
  }

  function viewRecord(recordId: number) {
    // TODO: view full record
  }

  function toggleEditMode() {
    setEditMode(!editMode)
  }

  return (
    <div className={tableWrapper}>
      <header className={tableHeader}>
        <span className={tableTitle}>Saved Results</span>
        <button className={editMode ? editButtonOn : editButton} onClick={toggleEditMode}>
          Edit Results
        </button>
      </header>
      <table {...getTableProps()} className={dataTable} aria-label="Saved Results">
        <thead className={dataHeader}>
          {headerGroups.map((headerGroup) => (
            // eslint-disable-next-line react/jsx-key
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                // eslint-disable-next-line react/jsx-key
                <th {...column.getHeaderProps()}>{column.render("Header")}</th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map((row, i) => {
            prepareRow(row)
            return (
              // eslint-disable-next-line react/jsx-key
              <tr {...row.getRowProps()} className={dataRows}>
                {row.cells.map((cell) => {
                  const { id } = cell.column
                  if (id === "recordId") {
                    return (
                      <td>
                        <FontAwesomeIcon 
                          icon={faAngleRight} 
                          onClick={() => viewRecord(cell.value)} 
                          style={{cursor:'pointer'}}  
                        />
                      </td>
                    )
                  }
                  // eslint-disable-next-line react/jsx-key
                  return <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                })}
              </tr>
            )
          })}
        </tbody>
        <tfoot className={dataFooter}>
          <tr>
            <td>{data.length.toLocaleString()} records found</td>
            <td colSpan={4}></td>
            <td>
              Show{" "}
              <input
                className={dataRowPage}
                min={1}
                max={10}
                onBlur={handleBlur}
                onChange={handleChange}
                type="number"
                value={pageSizeValue}
              />{" "}
              rows
            </td>
            <td>
              {" "}
              <button onClick={() => previousPage()} disabled={!canPreviousPage}>
                {"<"}
              </button>{" "}
              {pageIndex + 1} of {pageOptions.length}{" "}
              <button onClick={() => nextPage()} disabled={!canNextPage}>
                {">"}
              </button>{" "}
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  )
}
