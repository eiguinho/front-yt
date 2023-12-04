import React, { useState, ChangeEvent } from 'react';
import styles from "./style.module.scss";

const TelaAdm: React.FC = () => {
  const [selectedTable, setSelectedTable] = useState<string>('');
  const [selectedAttributes, setSelectedAttributes] = useState<string[]>([]);
  const [selectedReturnAttribute, setSelectedReturnAttribute] = useState<string>(''); // Nova variável de estado
  const [filterAttributes, setFilterAttributes] = useState<string[]>([]);
  const [conditional, setConditional] = useState<string>('and');
  const [limit, setLimit] = useState<number | undefined>(undefined);
  const [orderBy, setOrderBy] = useState<string>('none');
  const [aggregation, setAggregation] = useState<string>('none');
  const [groupBy, setGroupBy] = useState<boolean>(false);
  const [result, setResult] = useState<string>('');
  const [selectedFields, setSelectedFields] = useState([]);
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [logicalOperator, setLogicalOperator] = useState('and');
  const [conditions, setConditions] = useState([]);

  const handleTableChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setSelectedTable(event.target.value);
    setSelectedReturnAttribute(''); // Limpa o atributo de retorno ao alterar a tabela
    // Resetar os atributos quando a tabela é alterada
    setSelectedAttributes([]);
    setFilterAttributes([]);
  };

  // Função para adicionar ou remover atributos da lista selecionada
  const handleAttributeChange = (
    event: ChangeEvent<HTMLSelectElement>,
    list: string[],
    setList: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    const selectedAttribute = event.target.value;
    if (list.includes(selectedAttribute)) {
      setList(list.filter((attr) => attr !== selectedAttribute));
    } else {
      setList([...list, selectedAttribute]);
    }
  };

  const handleSearch = () => {
    // Implementar lógica de busca com os parâmetros selecionados
    // Exemplo:
    const searchQuery = {
      selectedTable,
      selectedAttributes,
      filterAttributes,
      conditional,
      limit,
      orderBy,
      aggregation,
      groupBy,
    };
    setResult(JSON.stringify(searchQuery, null, 2));
  };

  const handleClear = () => {
    // Implementar lógica para limpar todos os campos
    setSelectedTable('');
    setSelectedAttributes([]);
    setFilterAttributes([]);
    setConditional('and');
    setLimit(undefined);
    setOrderBy('none');
    setAggregation('none');
    setGroupBy(false);
    setResult('');
  };

  const handleConsultClick = () => {
    // Verificar se uma tabela e um atributo foram selecionados antes de consultar
    if (selectedTable && selectedAttributes) {
      // Aqui você pode implementar a lógica de consulta com base nos valores selecionados
      // Por enquanto, apenas vamos exibir uma mensagem
      setResult(`Consulta realizada para a tabela ${selectedTable} e atributo ${selectedAttributes}`);
    } else {
      setResult('Por favor, selecione uma tabela e um atributo.');
    }
  };

  const tables = ['Tabela1', 'Tabela2', 'Tabela3'];

  // Defina os atributos disponíveis para cada tabela
  const tableAttributes: { [key: string]: string[] } = {
    Tabela1: ['Atributo 1', 'Atributo 2', 'Atributo 3', 'Atributo 10', 'Atributo 20', 'Atributo 30'],
    Tabela2: ['Atributo 4', 'Atributo 5'],
    Tabela3: ['Atributo 6', 'Atributo 7', 'Atributo 8'],
  };

  const resultAreaStyle: React.CSSProperties = {
    marginTop: '20px',
    padding: '10px',
    border: '1px solid #ccc',
    borderRadius: '5px',
  };

  return (
    <div className={styles.container}>
      {/* Título Fixo */}

      {/* Select para Tabela Principal */}
      <div className="form">Tabela Principal</div>
      <select
        className="form-select"
        value={selectedTable}
        onChange={handleTableChange}
      >
        <option disabled hidden value="">
          Selecione uma tabela
        </option>
        {tables.map((table) => (
          <option key={table} value={table}>
            {table}
          </option>
        ))}
      </select>

      {/* Select para Atributos de Retorno */}
      {selectedTable && (
        <div className={styles.formSelect}>
        <div className={styles.selectContainer}>
          <div>Selecione os campos que deseja retornar na consulta</div>
          <select
            className="form-select"
            multiple
            value={selectedAttributes}
            onChange={(e) => handleAttributeChange(e, selectedAttributes, setSelectedAttributes)}
          >
            {tableAttributes[selectedTable].map((attribute) => (
              <option key={attribute} value={attribute}>
                {attribute}
              </option>
            ))}
          </select>
        </div>
      
        {/* Repita o mesmo padrão para o próximo par de texto e select */}
        <div className={styles.selectContainer}>
          <div>Selecione os campos que deseja filtrar</div>
          <select
            className="form-select"
            multiple
            value={filterAttributes}
            onChange={(e) => handleAttributeChange(e, filterAttributes, setFilterAttributes)}
          >
            {tableAttributes[selectedTable].map((attribute) => (
              <option key={attribute} value={attribute}>
                {attribute}
              </option>
            ))}
          </select>
        </div>
        <div className={styles.selectContainer}>
          <div>Conditional</div>
          <select
            className="form-select"
            value={conditional}
            onChange={(e) => setConditional(e.target.value)}
          >
            <option value="and">AND</option>
            <option value="or">OR</option>
          </select>
        <div className={styles.selectContainer}>
        <div>Limite</div>
        <input
          type="number"
          className="form-control"
          value={limit || ''}
          onChange={(e) => setLimit(Number(e.target.value))}
        />
      </div>
      </div>
      </div>
      )}
      
      {/* Select para Order By */}
      {selectedTable && (
      <div className={styles.formSelect}>
        <div className={styles.selectContainer}>
            <div>Selecione o campo que deseja retornar na consulta</div>
            <select
              className="form-select"
              value={selectedReturnAttribute}
              onChange={(e) => setSelectedReturnAttribute(e.target.value)}
            >
              <option disabled hidden value="">
                Selecione um campo
              </option>
              {tableAttributes[selectedTable].map((attribute) => (
                <option key={attribute} value={attribute}>
                  {attribute}
                </option>
              ))}
            </select>
          </div>
      <div className={styles.selectContainer}>
        <div>Order By</div>
        <select
          className="form-select"
          value={orderBy}
          disabled={aggregation !== 'none'}
          onChange={(e) => setOrderBy(e.target.value)}
        >
          <option value="none">Nenhum</option>
          <option value="asc">ASC</option>
          <option value="desc">DESC</option>
        </select>
      </div>
      <div className={styles.selectContainer}>
        <div>Agregação</div>
        <select
          className="form-select"
          value={aggregation}
          onChange={(e) => setAggregation(e.target.value)}
          disabled={orderBy !== 'none'}
        >
          <option value="none">Nenhum</option>
          <option value="count">COUNT</option>
          <option value="avg">AVG</option>
        </select>
      </div>
      <div className={styles.selectContainer}>
        <div>Group By</div>
        <input
          type="checkbox"
          checked={groupBy}
          onChange={(e) => setGroupBy(e.target.checked)}
        />
      </div>
      </div>
      )}
      {/* Atributos Selecionados */}

      
          {selectedAttributes.map((attr) => (
            <div key={attr}>
              <div>{attr}
              <select>
                <option value=">">{'>'}</option>
                <option value="<">{'<'}</option>
                <option value="=">{'='}</option>
                <option value=">=">{'>='}</option>
                <option value="<=">{'<='}</option>
                <option value="!=">{'!='}</option>
              </select>
              <input type="number" className="form-control"/>
              </div>
            </div>
      ))}

      {/* Botões de Busca e Limpar */}
      <div className={styles.formSelect}>
        <button onClick={handleSearch}>Buscar</button>
        <button onClick={handleClear}>Limpar</button>
      </div>

      {/* Resultado da Consulta */}
      <div style={resultAreaStyle}>
        <h3>Resultado:</h3>
        <pre>{result}</pre>
      </div>
    </div>
  );
};

export default TelaAdm;
