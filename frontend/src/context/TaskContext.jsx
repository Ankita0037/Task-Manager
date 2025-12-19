import React, { createContext, useContext, useState, useCallback } from 'react';
import taskService from '../services/taskService';

const TaskContext = createContext(null);

export const useTask = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTask must be used within a TaskProvider');
  }
  return context;
};

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTasks = useCallback(async (filters = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await taskService.getTasks(filters);
      setTasks(response.tasks);
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const createTask = async (taskData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await taskService.createTask(taskData);
      setTasks(prevTasks => [response.task, ...prevTasks]);
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateTask = async (id, taskData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await taskService.updateTask(id, taskData);
      setTasks(prevTasks =>
        prevTasks.map(task =>
          task._id === id ? response.task : task
        )
      );
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteTask = async (id) => {
    setLoading(true);
    setError(null);
    try {
      await taskService.deleteTask(id);
      setTasks(prevTasks => prevTasks.filter(task => task._id !== id));
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getTaskById = async (id) => {
    try {
      const response = await taskService.getTaskById(id);
      return response.task;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const value = {
    tasks,
    loading,
    error,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    getTaskById
  };

  return (
    <TaskContext.Provider value={value}>
      {children}
    </TaskContext.Provider>
  );
};

export default TaskContext;
