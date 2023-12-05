import React, { useState, ChangeEvent, useRef } from 'react';
import styles from "./style.module.scss";
import Table from './Table'; // Importe o componente de tabela

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
  const [inputValues, setInputValues] = useState<{ [key: string]: string }>({});
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

  const inputValuesRef = useRef<{ [key: string]: string }>({});

  const handleSearch = async () => {
    try {
      let inputValues: { [key: string]: string } = {};
    // Atualize os valores associados aos atributos
    selectedAttributes.forEach((attr) => {
      inputValues[attr] = inputValues[attr];
    });

      const searchQuery = {
        selectedTable,
        selectedAttributes: selectedAttributes.join(','), // Convertendo para string
        filterAttributes: filterAttributes.join(','), // Convertendo para string
        conditional, 
        limit: limit?.toString() || '', // Convertendo para string
        orderBy,
        aggregation,
        groupBy: groupBy.toString(), // Convertendo para string
        inputValues: JSON.stringify(inputValuesRef.current),
        selectedReturnAttribute,
      };
  
      const queryString = new URLSearchParams(searchQuery as Record<string, string>).toString();
      const response = await fetch(`http://localhost:3000/${selectedTable}/search?${queryString}`);
      const data = await response.json();
      console.log(data);
      setResult(JSON.stringify(data, null, 2));
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
      setResult('Erro ao buscar dados.');
    }
  };
  
  

  const handleInputChange = (attribute: string, value: string) => {
    inputValuesRef.current = {
      ...inputValuesRef.current,
      [attribute]: value,
    };
    console.log('Novo estado de inputValues:', inputValuesRef.current);
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

  const tables = ['channels', 'videos', 'comments','playlists', 'playlist_videos'];

  // Defina os atributos disponíveis para cada tabela
  const tableAttributes: { [key: string]: string[] } = {
    channels: ['id', 'title', 'description', 'customUrl', 'publishedAt', 'viewCount', 'subscriberCount'],
    videos: ['id', 'publishedAt', 'channelId', 'title', 'description', 'shortId'],
    comments: ['id', 'channelId', 'videoId','textDisplay','textOriginal','authorNameDisplay','authorProfileImageUrl','authorChannelUrl'
    ,'canRate','viewerRating','likeCount','publishedAt','updatedAt'],
    playlists:['id','publishedAt','channelId','title','description','channels'],
    playlist_videos:['id','publishedAt','channelId','title','description','channels'],
  };

  const resultAreaStyle: React.CSSProperties = {
    marginTop: '20px',
    padding: '10px',
    border: '1px solid #ccc',
    borderRadius: '5px',
    backgroundColor: 'white',
    color: 'black',
  };

  return (
    <div className={styles.container}>
      {/* Título Fixo */}

      {/* Select para Tabela Principal */}
      <div className={styles.form}>Tabela Principal</div>
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
          <div className={styles.form}>Campos que deseja filtrar</div>
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
          <div className={styles.form}>Campos que deseja retornar na consulta</div>
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
          <div className={styles.form}>Conditional</div>
          <select
            className="form-select"
            value={conditional}
            onChange={(e) => setConditional(e.target.value)}
          >
            <option value="and">AND</option>
            <option value="or">OR</option>
          </select>
        <div className={styles.selectContainer}>
        <div className={styles.form}>Limite
        <input
          type="number"
          className="form-control"
          value={limit || ''}
          onChange={(e) => setLimit(Number(e.target.value))}
        /></div>
      </div>
      </div>
      </div>
      )}
      
      {/* Select para Order By */}
      {selectedTable && (
  <div className={styles.formSelect}>
    <div className={styles.selectContainer}>
      <div className={styles.form}>Campo para realizar ordenação ou agregação</div>
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
        <option value="none">Nenhum</option>
      </select>
    </div>

    <div className={styles.selectContainer}>
      <div className={styles.form}>Order By</div>
      <select
        className="form-select"
        value={orderBy}
        disabled={aggregation !== 'none' || selectedReturnAttribute === 'none'}
        onChange={(e) => setOrderBy(e.target.value)}
      >
        <option value="none">Nenhum</option>
        <option value="asc">ASC</option>
        <option value="desc">DESC</option>
      </select>
    </div>

    
  </div>
)}

      {/* Atributos Selecionados */}

      
          {selectedAttributes.map((attr) => (
            <div key={attr}>
              <div>{attr}
              <input type="text" className="form-control" onChange={(event) => handleInputChange(attr, event.target.value)}/>
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
        <h3>Consulta:</h3>
        {/* Substitua o bloco result por este */}
        <Table data={result ? JSON.parse(result).data || [] : []} />
      </div>
    </div>
  );
};

export default TelaAdm;
