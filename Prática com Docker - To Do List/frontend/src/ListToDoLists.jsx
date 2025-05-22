import { useRef, useState } from "react";
import { BiSolidTrash } from "react-icons/bi";

function ListToDoLists({
  listSummaries,
  handleSelectList,
  handleNewToDoList,
  handleDeleteToDoList,
}) {
  const labelRef = useRef();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Função para criar nova lista com validação e tratamento de erro
  const handleCreateList = async (name) => {
    if (!name || name.trim() === '') {
      alert('Por favor, digite um nome para a lista');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      await handleNewToDoList(name.trim());

      // Limpa o input após criação bem-sucedida
      if (labelRef.current) {
        labelRef.current.value = '';
      }
    } catch (err) {
      console.error('Erro ao criar lista:', err);
      setError('Erro ao criar a lista');
    } finally {
      setLoading(false);
    }
  };

  // Função para deletar lista com tratamento de erro
  const handleDeleteList = async (listId, listName) => {
    // Confirmação antes de deletar
    if (!window.confirm(`Tem certeza que deseja deletar a lista "${listName}"? Esta ação não pode ser desfeita.`)) {
      return;
    }

    try {
      setLoading(true);
      setError(null);

      await handleDeleteToDoList(listId);
    } catch (err) {
      console.error('Erro ao deletar lista:', err);
      setError('Erro ao deletar a lista');
    } finally {
      setLoading(false);
    }
  };

  // Função para lidar com Enter no input
  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      if (labelRef.current && labelRef.current.value.trim()) {
        handleCreateList(labelRef.current.value);
      }
    }
  };

  // Função para selecionar lista com tratamento de erro
  const handleSelectListSafe = async (listId) => {
    try {
      setError(null);
      await handleSelectList(listId);
    } catch (err) {
      console.error('Erro ao carregar lista:', err);
      setError('Erro ao carregar a lista');
    }
  };

  // Componente de input para nova lista
  // New input component using onKeyDown instead of deprecated onKeyPress
  const NewListInput = () => (
    <div className="box">
      <label>
        New To-Do List:&nbsp;
        <input
          ref={labelRef}
          type="text"
          placeholder="Digite o nome da lista..."
          onKeyDown={event => {
            if (event.key === 'Enter') {
              if (labelRef.current && labelRef.current.value.trim()) {
                handleCreateList(labelRef.current.value);
              }
            }
          }}
          disabled={loading}
        />
      </label>
      <button
        onClick={() => {
          if (labelRef.current) {
            handleCreateList(labelRef.current.value);
          }
        }}
        disabled={loading}
      >
        {loading ? 'Creating...' : 'New'}
      </button>
    </div>
  );

  // Loading state
  if (!listSummaries || !Array.isArray(listSummaries)) {
    return (
      <div className="ListToDoLists loading">
        Loading to-do lists ...
      </div>
    );
  }

  // Empty state
  if (listSummaries.length === 0) {
    return (
      <div className="ListToDoLists">
        <h1>All To-Do Lists</h1>

        {error && (
          <div className="error-message" style={{ color: 'red', margin: '10px 0', padding: '10px', border: '1px solid red', borderRadius: '4px' }}>
            {error}
          </div>
        )}

        <NewListInput />

        <div className="empty-state" style={{ textAlign: 'center', margin: '20px 0', color: '#666' }}>
          <p>📝 Você ainda não tem listas!</p>
          <p>Crie sua primeira lista acima para começar.</p>
        </div>
      </div>
    );
  }

  // Main render with lists
  return (
    <div className="ListToDoLists" >
      <h1>All To-Do Lists</h1>

      {error && (
        <div className="error-message" style={{ color: 'red', margin: '10px 0', padding: '10px', border: '1px solid red', borderRadius: '4px' }}>
          {error}
          <button
            onClick={() => setError(null)}
            style={{ marginLeft: '10px', background: 'none', border: 'none', color: 'red', cursor: 'pointer' }}
          >
            ✕
          </button>
        </div>
      )}

      <NewListInput />

      {loading && (
        <div className="loading-indicator" style={{ textAlign: 'center', margin: '10px 0', color: '#666' }}>
          Processando...
        </div>
      )}

      <div className="lists-container">
        {listSummaries.map((summary) => {
          return (
            <div
              key={summary.id}
              className={`summary ${loading ? 'disabled' : ''}`}
              onClick={() => !loading && handleSelectListSafe(summary.id)}
              style={{
                opacity: loading ? 0.6 : 1,
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
            >
              <span className="name">{summary.name} </span>
              <span className="count">
                ({summary.item_count || 0} {summary.item_count === 1 ? 'item' : 'items'})
              </span>
              <span className="flex"></span>
              <span
                className="trash"
                onClick={(evt) => {
                  evt.stopPropagation();
                  if (!loading) {
                    handleDeleteList(summary.id, summary.name);
                  }
                }}
                style={{
                  opacity: loading ? 0.5 : 1,
                  cursor: loading ? 'not-allowed' : 'pointer'
                }}
                title={`Deletar lista "${summary.name}"`}
              >
                <BiSolidTrash />
              </span>
            </div>
          );
        })}
      </div>

      {listSummaries.length > 0 && (
        <div className="lists-summary" style={{ textAlign: 'center', margin: '20px 0', color: '#666', fontSize: '14px' }}>
          Total: {listSummaries.length} {listSummaries.length === 1 ? 'lista' : 'listas'}
        </div>
      )}
    </div>
  );
}

export default ListToDoLists;