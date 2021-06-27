import TaskModel from "../models/taskModel";
import Error from "../utils/Error";
import ErrorTypes from "../utils/ErrorTypes";
import logServices from "./logsServices";

const create = async ({
  title,
  due_date,
  description,
  responsible,
  collaborators,
}) => {
  try {
    const task = TaskModel({
        title,
        due_date,
        description,
        responsible,
        collaborators
    });
    await task.save();
    return task;
  } catch (error) {
    throw Error({
      message: error.message || ErrorTypes.DATABASE_QUERY,
      errorStatus: error.errorStatus,
      stackTrace: error.stackTrace || error,
    });
  }
};

const detail = async (id) => {
  try {
    const query = { "_id":id }
    const task = await TaskModel.findById(query)
      .populate("responsible", "name email")
      .populate("collaborators", "name email")
      .exec();
    return task;
  } catch (error) {
    throw Error({
      message: error.message || ErrorTypes.DATABASE_QUERY,
      errorStatus: error.errorStatus,
      stackTrace: error.stackTrace || error,
    });
  }
}

const getAll = async ({ status, due_date_init, due_date_end }) => {
  try {
    // TODO: filtrar por el usuario responsable (token)
    const query = {};
    if (status) query['status'] = status;
    if (due_date_init && due_date_end) {
      query['due_date'] = { 
        '$gte': due_date_init, 
        '$lte': due_date_end 
      };
    }
    const tasks = await TaskModel.find(query)
      .populate("responsible", "name email")
      .populate("collaborators", "name email")
      .exec();
      await logServices.create({who:0, log:"GET ALL TASK"})    
    return tasks;
  } catch (error) {
    throw Error({
      message: error.message || ErrorTypes.DATABASE_QUERY,
      errorStatus: error.errorStatus,
      stackTrace: error.stackTrace || error,
    });
  }
}

const  updateStatus = async (id, status) => {
  try {
    
    const task = await TaskModel.findById(id);
    task.status = Number(status);
    await task.save();
    await logServices.create({who:0, log:`Task with id ${id} has been modified`})
    return {'update task': `Task with id ${id} has been modified`};
  } catch (error) {
    throw Error({
      message: error.message || ErrorTypes.DATABASE_QUERY,
      errorStatus: error.errorStatus,
      stackTrace: error.stackTrace || error,
    });
  }
}

export default {
  create,
  detail,
  getAll,
  updateStatus
};
