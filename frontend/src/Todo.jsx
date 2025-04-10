import React from 'react';
import { Button } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

function Todo({ todo, onUpdate, onDelete }) {
    const handleComplete = async () => {
        try {
            await onUpdate(todo._id.$oid);
        } catch (error) {
            console.error('Error updating todo:', error);
        }
    };

    const handleDelete = async () => {
        try {
            await onDelete(todo._id.$oid);
        } catch (error) {
            console.error('Error deleting todo:', error);
        }
    };

    return (
        <div className='flex items-center p-4 mb-3 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200'>
            <input 
                type="checkbox" 
                checked={todo.completed} 
                readOnly
                className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <div className="ml-4 flex-1">
                <h3 className={`text-base font-semibold tracking-tight ${todo.completed ? 'line-through text-gray-400' : 'text-gray-800'}`}>
                    {todo.title}
                </h3>
                {todo.description && (
                    <p className={`text-sm font-normal text-gray-600 mt-1}`}>
                        {todo.description}
                    </p>
                )}
            </div>
            <div className="ml-4 flex flex-col items-end">
                <p className="text-sm text-gray-600 mb-2">
                    {new Date(todo.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                    })}
                </p>
                <div className="flex items-center gap-2">
                    <Button variant="contained" color="success" size="small" onClick={handleComplete}>
                        <CheckCircleIcon />
                    </Button>
                    <Button variant="contained" color="error" size="small" onClick={handleDelete}>
                        <DeleteIcon />
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default Todo