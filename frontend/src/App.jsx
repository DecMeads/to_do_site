import { useState, useEffect } from 'react'
import axios from 'axios';
import Todo from "./Todo";
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';

function App() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [showCompleted, setShowCompleted] = useState(false);

  useEffect(() => {
    fetchTodos();
  }, []);

  async function fetchTodos() {
    const { data } = await axios.get("http://localhost:8000/todos");
    setTodos(data);
  }

  async function createTodo(e) {
    e.preventDefault();
    await axios.post("http://localhost:8000/todos", { title, description });
    setTitle('');
    setDescription('');
    setIsFormVisible(false);
    fetchTodos();
  }

  async function updateTodo(id) {
    await axios.put("http://localhost:8000/todos", { id: id.toString() });
    fetchTodos();
  }

  async function deleteTodo(id) {
    await axios.delete("http://localhost:8000/todos", { data: { id: id.toString() } });
    fetchTodos();
  }

  return (
    <div className="min-h-screen grid place-items-center px-4 py-8 bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-lg border border-solid border-gray-200 shadow p-6">
        <h1 className="text-center text-2xl font-bold mb-6">Rust + React Todo App</h1>

        <div className="flex items-center gap-4 mb-4">
          <h2 className="text-lg font-semibold">My Todos</h2>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="showCompleted"
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              onChange={(e) => setShowCompleted(e.target.checked)}
              checked={showCompleted}
            />
            <label htmlFor="showCompleted" className="ml-2 text-sm text-gray-600">
              Show completed
            </label>
          </div>
          <Button
            onClick={() => setIsFormVisible(!isFormVisible)}
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            size="small"
          >
            {isFormVisible ? 'Close' : 'Add'}
          </Button>
        </div>

        {/* Modal Overlay */}
        {isFormVisible && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md mx-4">
              <h2 className="text-white text-lg font-semibold mb-4">Add New Todo</h2>
              <form onSubmit={createTodo} className="space-y-4">
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder='New Todo...'
                  required
                  className="w-full px-3 py-2 bg-gray-700 text-white border border-solid border-gray-600 rounded-md focus:outline focus:outline-2 focus:outline-blue-500"
                />
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder='Description'
                  className="w-full px-3 py-2 bg-gray-700 text-white border border-solid border-gray-600 rounded-md focus:outline focus:outline-2 focus:outline-blue-500"
                />
                <div className="flex gap-4 mt-4">
                  <Button
                    onClick={() => setIsFormVisible(false)}
                    variant="outlined"
                    color="secondary"
                    fullWidth
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                  >
                    Add Todo
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="space-y-3 mt-4">
          {todos.length === 0 ? (
            <p className="text-center text-gray-500 py-4">No todos yet. Add one to get started!</p>
          ) : (
            todos.filter(todo => showCompleted || !todo.completed).map((todo) => (
              <Todo key={todo.id} todo={todo} onUpdate={updateTodo} onDelete={deleteTodo} />
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default App
