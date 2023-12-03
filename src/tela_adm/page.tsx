// page.tsx
import React, { useState, ChangeEvent } from 'react';
import styles from './style.module.scss';

const TelaAdm: React.FC = () => {
  const [selectedTable, setSelectedTable] = useState<string>('');
  const [selectedAttribute, setSelectedAttribute] = useState<string>('');
  const [result, setResult] = useState<string>('');

  const handleTableChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setSelectedTable(event.target.value);
    // Resetar o atributo quando a tabela é alterada
    setSelectedAttribute('');
  };

  const handleAttributeChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setSelectedAttribute(event.target.value);
  };

  const handleConsultClick = () => {
    // Verificar se uma tabela e um atributo foram selecionados antes de consultar
    if (selectedTable && selectedAttribute) {
      // Aqui você pode implementar a lógica de consulta com base nos valores selecionados
      // Por enquanto, apenas vamos exibir uma mensagem
      setResult(`Consulta realizada para a tabela ${selectedTable} e atributo ${selectedAttribute}`);
    } else {
      setResult('Por favor, selecione uma tabela e um atributo.');
    }
  };

  // Defina os atributos disponíveis para cada tabela
  const tableAttributes: { [key: string]: string[] } = {
    tabela1: ['Atributo 1', 'Atributo 2', 'Atributo 3'],
    tabela2: ['Atributo 4', 'Atributo 5'],
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <h2>Consulta ADM</h2>
      </div>

      {/* Selects e Botão */}
      <div className={styles.form}>
        {/* Select de Tabelas */}
        <select value={selectedTable} onChange={handleTableChange}>
          <option value="">Selecione uma tabela</option>
          <option value="tabela1">Tabela 1</option>
          <option value="tabela2">Tabela 2</option>
          {/* Adicione mais opções de tabela, se necessário */}
        </select>

        {/* Mostrar atributos apenas se uma tabela for selecionada */}
        {selectedTable && (
          <select value={selectedAttribute} onChange={handleAttributeChange}>
            <option value="">Selecione um atributo</option>
            {tableAttributes[selectedTable].map((attribute) => (
              <option key={attribute} value={attribute}>
                {attribute}
              </option>
            ))}
          </select>
        )}

        {/* Botão de Consultar */}
        <button onClick={handleConsultClick}>Consultar</button>
      </div>

      {/* Campo reservado para imprimir o resultado */}
      <div className={styles.header}>
        <p>{result}</p>
      </div>
    </div>
  );
};

export default TelaAdm;
