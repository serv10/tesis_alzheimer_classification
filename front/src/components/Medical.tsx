import axios from "axios";
import React, { useEffect, useState } from "react";
import { Checkbox, Table,Label, TextInput,Button} from "flowbite-react";
import { FaSearch } from 'react-icons/fa';

function MedicalHistory() {
const[dni, setDni] = useState(0);
const[userList, setUser] = useState([]);

      const getUser = () => {
            axios.get("http://localhost:4000/user").then((response) => {
               setUser(response.data);
      });
    }
    getUser();

  

  return (
     
  <div className="flex">
          

    <form className="flex max-w-xl flex-col gap-4 mr-20 " style={{ width: '326px' }}>
      <div >
      <h1 style= {{textAlign:'center',fontSize:26,fontFamily:'Initial',marginBottom:30,color:'#46454A'}}>Datos del Paciente</h1>
        <div className="mb-2 block">
          <Label htmlFor="dni" value="DNI" />
        </div>
        <TextInput id="dni" type="number" placeholder="70922605"  />
      </div>
      <div>
        <div className="mb-2 block">
          <Label htmlFor="nombre" value="NOMBRE" />
        </div>
        <TextInput id="nombre" type="text" placeholder="Gabriel Jesus Perez Solis" />
      </div>
      <div>
        <div className="mb-2 block">
          <Label htmlFor="descripcion" value="DESCRIPCION" />
        </div>
        <TextInput id="descripcion" type="text"  placeholder="moderate_33.jpg"/>
      </div>
      <div className="flex items-center gap-2">
      </div>
      <Button type="submit" style={{ backgroundColor: 'green', display: 'flex', alignItems: 'center' }} >
        <FaSearch style={{ marginRight: '10px' }}size={20} />Buscar</Button>
    </form>
    
    <div className='Lista' style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <h1 style={{fontSize:32,fontFamily:'Initial',marginBottom:50,color:'#46454A'}}>Historial Clinico</h1>
          <Table hoverable>
        <Table.Head>
          <Table.HeadCell className="p-4">
            <Checkbox />
          </Table.HeadCell>
          <Table.HeadCell>DNI</Table.HeadCell>
          <Table.HeadCell>Nombre</Table.HeadCell>
          <Table.HeadCell>Apellidos</Table.HeadCell>
          <Table.HeadCell>Formato</Table.HeadCell>
          <Table.HeadCell>Fecha</Table.HeadCell>
          <Table.HeadCell>Opciones</Table.HeadCell>
          
          <Table.HeadCell>
            <span className="sr-only">Opciones</span>
          </Table.HeadCell>
        </Table.Head>
        <Table.Body className="divide-y">
        { 
          userList.map((val, key)=> (
            <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
              <Table.Cell className="p-4">
                <Checkbox />
              </Table.Cell>

              <Table.Cell>{val.dni}</Table.Cell>
              <Table.Cell>{val.name}</Table.Cell>
              <Table.Cell>{val.last_name}</Table.Cell>
              <Table.Cell>{val.extension}</Table.Cell>
              <Table.Cell>{val.registration_date.toString().split('T')[0]}</Table.Cell>
              <Table.Cell>
                <a href="#" className="font-medium text-red-600 hover:underline dark:text-red-500">
                  Eliminar
                </a>
              </Table.Cell>
            </Table.Row>
          ))
        }      
        </Table.Body>
      </Table>
    </div>

  </div>
  );

}
export default MedicalHistory;