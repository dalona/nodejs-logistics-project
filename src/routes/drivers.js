import { Router } from "express";
import { promises as fs } from "fs";
import { fileURLToPath } from "url";
import path from "path";

const routerDrivers = Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const driversFilePath = path.join (__dirname, '../../data/logisticsManagement.json')

const readDriversFile = async () => {
    const data = await fs.readFile(driversFilePath, 'utf-8');
    return JSON.parse(data);
}

const writeDriversFile = async (data) => {
    await fs.writeFile(driversFilePath, JSON.stringify(data, null, 2));
}


routerDrivers.post ('/createDrivers', async (req,res) =>{
    const data = await readDriversFile();
    const newDriver = {
        id : data.drivers.length + 1,
        name : req.body.name
    }
    data.drivers.push(newDriver);
    await writeDriversFile(data);
    res.send(newDriver);
})

routerDrivers.get ('/', async (req, res) =>{
    const data = await readDriversFile();
    res.send({drivers : data.drivers});
})

export default routerDrivers;