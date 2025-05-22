import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { BiSolidTrash } from "react-icons/bi";

function ToDoList({ listId, handleBackButton }) {
  let labelRef = useRef();
  const [listData, setListData] = useState(null);
  const [loadingItem, setLoadingItem] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setError(null);
        const response = await axios.get(`/api/lists/${listId}`);
        const newData = await response.data;
        setListData(newData);
      } catch (err) {
        console.error("Erro ao carregar a lista de tarefas:", err);
        setError("Erro ao carregar a lista de tarefas.");
      }
    };
    fetchData();
  }, [listId]);

  function handleCreateItem(label) {
    const updateData = async () => {
      try {
        setLoadingItem(true);
        setError(null);
        const response = await axios.post(`/api/lists/${listData.id}/items`, {
          label: label,
        });
        setListData(await response.data);
        // Limpa o input após a criação
        if (labelRef.current) {
          labelRef.current.value = '';
        }
      } catch (err) {
        console.error("Erro ao criar item:", err);
        setError("Erro ao criar o item.");
      } finally {
        setLoadingItem(false);
      }
    };
    updateData();
  }

  function handleDeleteItem(id) {
    const updateData = async () => {
      try {
        setLoadingItem(true);
        setError(null);
        const response = await axios.delete(
          `/api/lists/${listData.id}/items/${id}`
        );
        setListData(await response.data);
      } catch (err) {
        console.error("Erro ao deletar item:", err);
        setError("Erro ao deletar o item.");
      } finally {
        setLoadingItem(false);
      }
    };
    updateData();
  }

  // Função para lidar com Enter no input
  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      const value = labelRef.current?.value.trim();
      if (value) {
        handleCreateItem(value);
      }
    }
  };

  function handleCheckToggle(itemId, newState) {
    const updateData = async () => {
      try {
        setLoadingItem(true);
        setError(null);
        const response = await axios.patch(
          `/api/lists/${listData.id}/checked_state`,
          {
            item_id: itemId,
            checked_state: newState,
          }
        );
        setListData(await response.data);
      } catch (err) {
        console.error("Erro ao atualizar item:", err);
        setError("Erro ao atualizar o item.");
      } finally {
        setLoadingItem(false);
      }
    };
    updateData();
  }

  // Se a lista ainda está carregando
  if (listData === null) {
    return (
      <div className="ToDoList min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-4 sm:p-6 lg:p-8 flex flex-col items-center justify-center">
        <button className="back absolute top-4 left-4 px-4 py-2 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500" onClick={handleBackButton}>
          Voltar
        </button>
        <div className="text-center text-gray-600 dark:text-gray-400 text-lg">
          Carregando lista...
        </div>
      </div>
    );
  }

  return (
    <div className="ToDoList min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-4 sm:p-6 lg:p-8 flex flex-col items-center">
      <button
        className="back absolute top-4 left-4 px-4 py-2 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        onClick={handleBackButton}
      >
        Voltar
      </button>

      <h1 className="text-3xl font-bold mb-6 text-indigo-700 dark:text-indigo-400 mt-10">{listData.name}</h1>

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

      {/* Input para Novo Item */}
      <div className="box flex items-center space-x-2 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md mb-6 w-full max-w-md">
        <input
          ref={labelRef}
          type="text"
          placeholder="Adicionar novo item..."
          onKeyDown={handleKeyPress}
          disabled={loadingItem}
          className="flex-grow p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-200"
        />
        <button
          onClick={() => {
            const value = labelRef.current?.value.trim();
            if (value) {
              handleCreateItem(value);
            }
          }}
          disabled={loadingItem}
          className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {'Adicionar'}
        </button>
      </div>

      {loadingItem && (
        <div className="loading-indicator text-center text-gray-600 dark:text-gray-400 my-4">
          Processando item...
        </div>
      )}

      <div className="items-container w-full max-w-md space-y-3">
        {listData.items.length > 0 ? (
          listData.items.map((item) => {
            return (
              <div
                key={item.id}
                className={`item flex items-center bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 cursor-pointer ${loadingItem ? 'opacity-60 cursor-not-allowed' : ''}`}
                onClick={() => !loadingItem && handleCheckToggle(item.id, !item.checked)}
              >
                <span className="text-xl mr-2">
                  {item.checked ? "✅" : "⬜️"}
                </span>
                <span className={`label text-lg font-medium flex-grow ${item.checked ? 'line-through text-gray-500 dark:text-gray-400' : 'text-gray-800 dark:text-gray-200'}`}>
                  {item.label}
                </span>
                <span className="flex-grow"></span>
                <span
                  className="trash ml-4 text-gray-400 hover:text-red-600 transition-colors duration-200"
                  onClick={(evt) => {
                    evt.stopPropagation();
                    if (!loadingItem) {
                      handleDeleteItem(item.id);
                    }
                  }}
                  style={{
                    opacity: loadingItem ? 0.5 : 1,
                    cursor: loadingItem ? 'not-allowed' : 'pointer'
                  }}
                  title={`Deletar item "${item.label}"`}
                >
                  <BiSolidTrash className="w-5 h-5" />
                </span>
              </div>
            );
          })
        ) : (
          <div className="box text-center text-gray-600 dark:text-gray-400 my-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md w-full max-w-md">
            Não há itens nesta lista.
          </div>
        )}
      </div>
    </div>
  );
}
export default ToDoList;