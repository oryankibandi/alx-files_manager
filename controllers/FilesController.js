/* eslint-disable object-curly-newline */
/* eslint-disable no-unused-vars */
/* eslint-disable consistent-return */
/* eslint-disable curly */
/* eslint-disable nonblock-statement-body-position */
import fs from 'node:fs';
import { v4 as uuidv4 } from 'uuid';

import DBClient from '../utils/db';
import RedisClient from '../utils/redis';

const { ObjectId } = require('mongodb');

class FilesController {
  static async postUpload(request, response) {
    const token = request.header('X-Token') || null;
    if (!token) return response.status(401).send({ error: 'Unauthorized' });

    const redisToken = await RedisClient.get(`auth_${token}`);
    if (!redisToken)
      return response.status(401).send({ error: 'Unauthorized' });

    const user = await DBClient.database
      .collection('users')
      .findOne({ _id: ObjectId(redisToken) });
    if (!user) return response.status(401).send({ error: 'Unauthorized' });

    const { name, type, parentId, isPublic, data } = request.body;

    const fileData = request.body;

    if (!name) return response.status(400).send({ error: 'Missing name' });

    const fileType = ['folder', 'file', 'image'];

    if (!type || !fileType.includes(type)) {
      return response.status(400).send({ error: 'Missing type' });
    }

    if (!data && type === 'folder') {
      return response.status(400).send({ error: 'Missing data' });
    }

    if (parentId) {
      const parentFolder = await DBClient.database
        .collection('files')
        .findOne({ _id: ObjectId(parentId) });
      if (!parentFolder)
        return response.status(400).send({ error: 'Parent is not a folder' });
      if (parentFolder.type !== 'folder') {
        return response.status(400).send({ error: 'Parent is not a folder' });
      }
    }

    fileData.userId = user._id;

    if (type === 'folder') {
      const dataAdded = DBClient.database
        .collection('files')
        .insertOne({ ...fileData });
      return response.status(201).send({
        id: dataAdded._id,
        userId: dataAdded.userId,
        name: dataAdded.name,
        type: dataAdded.type,
        isPublic: dataAdded.isPublic,
        parentId: dataAdded.parentId,
      });
    }
    const path = process.env.FOLDER_PATH || '/tmp/files_manager';
    const fileNewId = uuidv4();

    const buff = Buffer.from(fileData, 'base64');
    const pathFile = `${path}/${fileNewId}`;

    await fs.mkdir(pathFile, { recursive: true }, (error) => {
      if (error) return response.status(400).send({ error: error.message });
      return true;
    });

    await fs.writeFile(pathFile, buff, (error) => {
      if (error) return response.status(400).send({ error: error.message });
      return true;
    });

    fileData.localPath = pathFile;
    const createdData = await DBClient.database
      .collection('files')
      .insertOne({ ...fileData });

    return response.status(201).send({
      id: createdData._id,
      userId: createdData.userId,
      name: createdData.name,
      type: createdData.type,
      isPublic: createdData.isPublic,
      parentId: createdData.parentId,
    });
  }

  static async getShow(req, res) {
    const token = req.header('X-Token') || null;
    if (!token) return res.status(401).send({ error: 'Unauthorized' });

    const redisToken = await RedisClient.get(`auth_${token}`);
    if (!redisToken) return res.status(401).send({ error: 'Unauthorized' });

    const user = await DBClient.database
      .collection('users')
      .findOne({ _id: ObjectId(redisToken) });
    if (!user) return res.status(401).send({ error: 'Unauthorized' });

    const FileId = req.params.id || '';

    const Document = await DBClient.database
      .collection('files')
      .findOne({ _id: ObjectId(FileId), userId: user._id });
    if (!Document) return res.status(404).send({ error: 'Not found' });

    return res.send({
      id: Document._id,
      userId: Document.userId,
      name: Document.name,
      type: Document.type,
      isPublic: Document.isPublic,
      parentId: Document.parentId,
    });
  }

  static async getIndex(req, res) {
    const token = req.header('X-Token') || null;
    if (!token) return res.status(401).send({ error: 'Unauthorized' });

    const redisToken = await RedisClient.get(`auth_${token}`);
    if (!redisToken) return res.status(401).send({ error: 'Unauthorized' });

    const user = await DBClient.database
      .collection('users')
      .findOne({ _id: ObjectId(redisToken) });
    if (!user) return res.status(401).send({ error: 'Unauthorized' });
  }

  static async putPublish(req, res) {
    const token = req.header('X-Token') || null;
    if (!token) return res.status(401).send({ error: 'Unauthorized' });

    const redisToken = await RedisClient.get(`auth_${token}`);
    if (!redisToken) return res.status(401).send({ error: 'Unauthorized' });

    const user = await DBClient.database
      .collection('users')
      .findOne({ _id: ObjectId(redisToken) });
    if (!user) return res.status(401).send({ error: 'Unauthorized' });
  }

  static async putUnpublish(req, res) {
    const token = req.header('X-Token') || null;
    if (!token) return res.status(401).send({ error: 'Unauthorized' });

    const redisToken = await RedisClient.get(`auth_${token}`);
    if (!redisToken) return res.status(401).send({ error: 'Unauthorized' });

    const user = await DBClient.database
      .collection('users')
      .findOne({ _id: ObjectId(redisToken) });
    if (!user) return res.status(401).send({ error: 'Unauthorized' });
  }
}

export default FilesController;
