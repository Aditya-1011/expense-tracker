// client/src/pages/dashboard/Financial-list.tsx
import React, { useMemo, useState } from "react";
import {
  useFinancialRecords,
  type IFinancialRecord,
} from "../../context/financial-record-context";
import { useTable, type Column, type CellProps } from "react-table";

interface EditableCellProps extends CellProps<IFinancialRecord> {
  updateRecord: (rowIndex: number, columnId: string, value: any) => void;
  editable: boolean;
}

const EditableCell: React.FC<EditableCellProps> = ({
  value: initialValue,
  row,
  column,
  updateRecord,
  editable,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState<any>(initialValue ?? "");

  const onBlur = () => {
    setIsEditing(false);
    updateRecord(row.index, column.id, value);
  };

  return (
    <div
      onClick={() => editable && setIsEditing(true)}
      style={{ cursor: editable ? "pointer" : "default" }}
    >
      {isEditing ? (
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          autoFocus
          onBlur={onBlur}
          style={{ width: "100%" }}
        />
      ) : typeof value === "string" ? (
        value
      ) : value !== undefined && value !== null ? (
        value.toString()
      ) : (
        ""
      )}
    </div>
  );
};

export const FinancialList = () => {
  const { records, updateRecord, deleteRecord } = useFinancialRecords();

  const updateCellRecord = (
    rowIndex: number,
    columnId: string,
    value: any
  ) => {
    const id = records[rowIndex]?._id;
    if (!id) return;
    const payload: any = {
      [columnId]: columnId === "amt" ? parseFloat(value) || 0 : value,
    };
    updateRecord(id, payload).catch((e) => {
      console.error("updateCellRecord error:", e);
    });
  };

  const columns: Array<Column<IFinancialRecord>> = useMemo(
    () => [
      {
        Header: "Description",
        accessor: "desc",
        Cell: (props) => (
          <EditableCell
            {...props}
            updateRecord={updateCellRecord}
            editable={true}
          />
        ),
      },
      {
        Header: "Amount",
        accessor: "amt",
        Cell: (props) => (
          <EditableCell
            {...props}
            updateRecord={updateCellRecord}
            editable={true}
          />
        ),
      },
      {
        Header: "Category",
        accessor: "category",
        Cell: (props) => (
          <EditableCell
            {...props}
            updateRecord={updateCellRecord}
            editable={true}
          />
        ),
      },
      {
        Header: "Payment",
        accessor: "payment",
        Cell: (props) => (
          <EditableCell
            {...props}
            updateRecord={updateCellRecord}
            editable={true}
          />
        ),
      },
      {
        Header: "Date",
        accessor: "date",
        Cell: (props) => (
          <EditableCell
            {...props}
            updateRecord={updateCellRecord}
            editable={false}
          />
        ),
      },
      {
        Header: "Delete",
        id: "delete",
        Cell: ({ row }) => (
          <button
            onClick={() => {
              if (row.original._id) deleteRecord(row.original._id);
            }}
            className="button"
          >
            Delete
          </button>
        ),
      },
    ],
    [records]
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({
      columns,
      data: records,
    });

  return (
    <div className="table-container">
      <table {...getTableProps()} className="table">
        <thead>
          {headerGroups.map((hg) => {
            const { key, ...restProps } = hg.getHeaderGroupProps();
            return (
              <tr key={key} {...restProps}>
                {hg.headers.map((column) => {
                  const { key: colKey, ...colRest } = column.getHeaderProps();
                  return (
                    <th key={colKey} {...colRest}>
                      {column.render("Header")}
                    </th>
                  );
                })}
              </tr>
            );
          })}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row) => {
            prepareRow(row);
            const { key: rowKey, ...rowRest } = row.getRowProps();
            return (
              <tr key={rowKey} {...rowRest}>
                {row.cells.map((cell) => {
                  const { key: cellKey, ...cellRest } = cell.getCellProps();
                  return (
                    <td key={cellKey} {...cellRest}>
                      {cell.render("Cell")}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default FinancialList;
