import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Table } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X, Download, Plus } from 'lucide-react';

const CsvEditor = () => {
  const [csvData, setCsvData] = useState([]);
  const [headers, setHeaders] = useState([]);

  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target.result;
      const rows = text.split('\n').map(row => row.split(','));
      setHeaders(rows[0]);
      setCsvData(rows.slice(1).filter(row => row.some(cell => cell.trim() !== '')));
    };
    reader.readAsText(file);
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop, accept: '.csv' });

  const handleCellEdit = (rowIndex, colIndex, value) => {
    const newData = [...csvData];
    newData[rowIndex][colIndex] = value;
    setCsvData(newData);
  };

  const addRow = () => {
    setCsvData([...csvData, new Array(headers.length).fill('')]);
  };

  const deleteRow = (index) => {
    const newData = csvData.filter((_, i) => i !== index);
    setCsvData(newData);
  };

  const downloadCsv = () => {
    const csv = [headers, ...csvData].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', 'edited_data.csv');
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="p-4">
      <div {...getRootProps()} className="border-2 border-dashed border-gray-300 p-4 mb-4 text-center cursor-pointer">
        <input {...getInputProps()} />
        <p>Drag & drop a CSV file here, or click to select one</p>
      </div>
      {csvData.length > 0 && (
        <>
          <div className="overflow-x-auto">
            <Table>
              <thead>
                <tr>
                  {headers.map((header, index) => (
                    <th key={index}>{header}</th>
                  ))}
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {csvData.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {row.map((cell, cellIndex) => (
                      <td key={cellIndex}>
                        <Input
                          value={cell}
                          onChange={(e) => handleCellEdit(rowIndex, cellIndex, e.target.value)}
                          className="w-full"
                        />
                      </td>
                    ))}
                    <td>
                      <Button variant="destructive" size="sm" onClick={() => deleteRow(rowIndex)}>
                        <X className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
          <div className="mt-4 flex justify-between">
            <Button onClick={addRow}>
              <Plus className="h-4 w-4 mr-2" /> Add Row
            </Button>
            <Button onClick={downloadCsv}>
              <Download className="h-4 w-4 mr-2" /> Download CSV
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default CsvEditor;
