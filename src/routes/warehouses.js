import { Router } from "express";
import { promises as fs} from 'fs';
import { fileURLToPath } from "url";
import path from "path";

const routerWarehouses = Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const warehouseFilePath = path.join(__dirname, '../../data/logisticsManagement.json')

const readWarehousesFile = async () =>{
    const data = await fs.readFile(warehouseFilePath, 'utf-8');
    return JSON.parse(data);
}

const writeWarehousesFile = async (data) =>{
    await fs.writeFile(warehouseFilePath, JSON.stringify(data, null, 2));
}

routerWarehouses.post ("/createWarehouse", async (req,res) => {
    const data = await readWarehousesFile();
    const newWarehouse = {
        id : data.warehouses.length + 1,
        name : req.body.name,
        location : req.body.location
    }

    data.warehouses.push(newWarehouse);
    await writeWarehousesFile(data); //Aqui sobreescrito toda la lista que ya tiene la inserccion
    res.status(201).send(`Warehouse Successfully created${JSON.stringify(newWarehouse)}`)
});


routerWarehouses.get("/", async (req, res) => {
    const data = await readWarehousesFile();
    res.status(200).json({message : data.warehouses});
});

routerWarehouses.get("/:id", async (req, res) => {
    let data = await readWarehousesFile();
    const warehouse = data.warehouses.find(e => e.id === parseInt(req.params.id))
    if(!warehouse) return res.status(404).send("Warehouse not found")
    res.json(warehouse);
    
})

routerWarehouses.put("/:id", async (req, res) => {
    const data = await readWarehousesFile();
    const warehouseIndex = data.warehouses.findIndex(e => e.id === parseInt(req.params.id));
    if(warehouseIndex === -1) return res.status(404).send("Warehouse not found");
    data.warehouses[warehouseIndex].name = req.body.name;
    data.warehouses[warehouseIndex].location = req.body.location;
    await writeWarehousesFile(data);
    res.send("Warehouse updated successfully");
})


routerWarehouses.delete('/:id' , async (req,res) =>{
    let data = await readWarehousesFile();
    const warehouse = data.warehouses.find(e => e.id === parseInt(req.params.id))
    if(!warehouse) return res.status(404).send("Warehouse not found");
    data.warehouses = data.warehouses.filter(e => e.id !== warehouse.id)

    await writeWarehousesFile(data);
    res.send("Warehouse deleted successfully");
})

export default routerWarehouses;