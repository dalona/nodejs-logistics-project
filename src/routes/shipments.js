import { Router } from "express";
import { promises as fs} from "fs";
import { fileURLToPath } from "url";  
import path from 'path';

const routerShipments = Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const shipmentFilePath = path.join(__dirname, '../../data/logisticsManagement.json')


const readShipmentsFile = async () =>{
    const data = await fs.readFile(shipmentFilePath, 'utf-8');
    return JSON.parse(data);
}

const writeShipmentsFile = async (data) =>{
    await fs.writeFile(shipmentFilePath, JSON.stringify(data, null, 2));
}

routerShipments.post('/createShipment', async (req,res) => {
    const data = await readShipmentsFile();
    const newShipment = {
        id : data.shipments.length + 1,
        item : req.body.item,
        quantity : req.body.quantity
    }
    data.shipments.push(newShipment);
    await writeShipmentsFile(data);
    res.status(201).send(`Shipment created successfully ${JSON.stringify(newShipment)}`)
})

routerShipments.get('/', async (req,res) =>{
    const data = await readShipmentsFile();
    res.status(200).json({shipments : data.shipments})
})


routerShipments.get('/:id', async (req,res) =>{
    const data = await readShipmentsFile();
    const shipment = data.shipments.find(e => e.id === parseInt(req.params.id))
    if(!shipment)return res.status(404).send("Shipment not found");
    res.json(shipment);
})

routerShipments.put('/:id', async (req,res) =>{
    const data = await readShipmentsFile();
    const shipmentIndex = data.shipments.findIndex(e => e.id === parseInt(req.params.id));
    if(shipmentIndex === -1) res.status(404).send("Shipment not found");
    data.shipments[shipmentIndex].item = req.body.item;
    data.shipments[shipmentIndex].quantity = req.body.quantity;
    await writeShipmentsFile(data);
    res.send("Shipment updated successfully");
})

routerShipments.delete('/:id', async (req,res) =>{
    const data = await readShipmentsFile();
    const shipment = data.shipments.find( e => e.id === parseInt(req.params.id))
    if(!shipment) return res.status(404).send("Shipment not found");
    data.shipments = data.shipments.filter( e => e.id !== parseInt(shipment.id))

    await writeShipmentsFile(data);
    res.send("Shipment deleted successfully");
})
export default routerShipments;
