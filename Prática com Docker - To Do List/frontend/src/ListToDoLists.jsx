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
  const NewListInput = () => (
    <div className="box flex items-center space-x-2 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md mb-6 w-full max-w-md">
      <input
        ref={labelRef}
        type="text"
        placeholder="Digite o nome da lista..."
        onKeyDown={handleKeyPress}
        disabled={loading}
        className="flex-grow p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-200"
      />
      <button
        onClick={() => {
          if (labelRef.current) {
            handleCreateList(labelRef.current.value);
          }
        }}
        disabled={loading}
        className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Criando..." : "Adicionar"}
      </button>
    </div>
  );

  // Loading state
  if (!listSummaries || !Array.isArray(listSummaries)) {
    return (
      <div className="ListToDoLists loading ">
        Carregando listas...
      </div>
    );
  }
  if (listSummaries.length === 0) {
    return (
      <div className="ListToDoLists min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-4 sm:p-6 lg:p-8 flex flex-col items-center">
        <h1 className="text-3xl font-bold mb-6 text-indigo-700 dark:text-indigo-400">Todas as listas</h1>

        {error && (
          <div className="error-message bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4 w-full max-w-md" role="alert">
            <strong className="font-bold">Erro!</strong>
            <span className="block sm:inline ml-2">{error}</span>
            <span className="absolute top-0 bottom-0 right-0 px-4 py-3">
              <button
                onClick={() => setError(null)}
                className="text-red-500 hover:text-red-700 font-bold focus:outline-none"
              >
                ✕
              </button>
            </span>
          </div>
        )}

        <NewListInput />

        <div className="empty-state text-center text-gray-600 dark:text-gray-400 my-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md w-full max-w-md">
          <p className="mb-2">📝 Você ainda não tem listas!</p>
          <p>Crie sua primeira lista acima para começar.</p>
        </div>
      </div>
    );
  }

  // Main render
  return (
    <div className="ListToDoLists min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-4 sm:p-6 lg:p-8 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-6 text-indigo-700 dark:text-indigo-400">Todas as listas</h1>

      {error && (
        <div className="error-message bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4 w-full max-w-md" role="alert">
          <strong className="font-bold">Erro!</strong>
          <span className="block sm:inline ml-2">{error}</span>
          <span className="absolute top-0 bottom-0 right-0 px-4 py-3">
            <button
              onClick={() => setError(null)}
              className="text-red-500 hover:text-red-700 font-bold focus:outline-none"
            >
              ✕
            </button>
          </span>
        </div>
      )}

      <NewListInput />

      {loading && (
        <div className="loading-indicator text-center text-gray-600 dark:text-gray-400 my-4">
          Processando...
        </div>
      )}

      <div className="lists-container w-full max-w-md mt-6 space-y-3">
        {listSummaries.map((summary) => {
          return (
            <div
              key={summary.id}
              className={`summary flex items-center bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 cursor-pointer ${loading ? 'opacity-60 cursor-not-allowed' : ''}`}
              onClick={() => !loading && handleSelectListSafe(summary.id)}
            >
              <span className="name text-lg font-medium text-gray-800 dark:text-gray-200 flex-grow">{summary.name} </span>
              <span className="count text-sm text-gray-500 dark:text-gray-400 ml-2">
                ({summary.item_count || 0} {summary.item_count === 1 ? 'item' : 'itens'})
              </span>
              <span className="flex-grow"></span>
              <span
                className="trash ml-4 text-gray-400 hover:text-red-600 transition-colors duration-200"
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
                <BiSolidTrash className="w-5 h-5" />
              </span>
            </div>
          );
        })}
      </div>

      {listSummaries.length > 0 && (
        <div className="lists-summary text-center text-gray-600 dark:text-gray-400 text-sm mt-8">
          Total: {listSummaries.length} {listSummaries.length === 1 ? 'lista' : 'listas'}
        </div>
      )}
    </div>
  )
}

export default ListToDoLists;