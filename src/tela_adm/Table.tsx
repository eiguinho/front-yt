// Tabela.tsx

import React from 'react';

interface TableProps {
  data: any[]; // array de objetos
}

const Table: React.FC<TableProps> = ({ data }) => {
  if (data.length === 0) {
    return <p>Nenhum resultado encontrado.</p>;
  }

  const columns = Object.keys(data[0]);

  return (
    <table className="table table-dark">
      <thead>
        <tr>
          {columns.map((column) => (
            <th key={column}>{column}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, index) => (
          <tr key={index}>
            {columns.map((column) => (
              <td key={column}>{row[column]}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Table;