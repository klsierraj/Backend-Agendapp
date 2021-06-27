import pkg from 'sequelize';
const { DataTypes } = pkg;
import sequalize from "../connection/postgresconn";

export const LogAgenda = sequalize.define(
  "LogAgenda",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    who: {
      type: DataTypes.STRING,
    },
    when: {
      type: DataTypes.STRING,
    },
    log: {
      type: DataTypes.TEXT,
    },
  },
  {
   
    tableName: "agendapp_logs",

  }
);
