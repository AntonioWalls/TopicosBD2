import { useDispatch, useSelector } from 'react-redux';
import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { EstructuraClientes } from "../../../../../constants/EstructuraTabla";
import TablaKendo from "../../../../common/root/componentes/TablaKendo";
import { listarCliente, eliminarCliente } from '../../../../../redux/actions/actionClienteB';
import Swal from 'sweetalert2';
import FiltroCliente from './filtro';  // Importa el filtro

const ordenamientoInicial = [
  {
    field: "nombre",
    dir: "asc",
  }
];

const TablaClientes = ({ mostrarFormulario }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const clientes = useSelector((state) => state.getClienteB.clientes?.response || []);
  const [dataState, setDataState] = useState([]);
  const [filtros, setFiltro] = useState({ Habilitado: true });  // Estado para filtros

  useEffect(() => {
    dispatch(listarCliente());
  }, [dispatch, filtros]);

  // Mapeo de datos con id genérico
  useEffect(() => {
    console.log("Datos recibidos de la API:", clientes);
    const mappedData = clientes.map((item) => ({
      ...item,
      id: item.idCliente, // Verifica que este ID sea correcto
    }));
    setDataState(mappedData);
  }, [clientes]);

  // Función para eliminar la sucursal seleccionada
  const handleEliminar = (idCliente) => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "¡No podrás revertir esto!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar"
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(eliminarCliente(idCliente)).then((response) => {
          if (!response.error) {
            Swal.fire({
              title: "Eliminado",
              text: "El cliente ha sido eliminada.",
              icon: "success"
            });
            dispatch(listarCliente()); // Recargar las sucursales después de eliminar
          } else {
            Swal.fire({
              title: "Error",
              text: "No se pudo eliminar el cliente.",
              icon: "error"
            });
          }
        });
      }
    });
  };

  const handleEditar = (idCliente) => {
    mostrarFormulario(true, idCliente);
  };

  const handleNuevo = () => {
    mostrarFormulario(false);
  };

  return (
    dataState && (
      <>
        {/* Componente para filtrar los clientes */}
        <FiltroCliente
          onFilter={(newValues) => setFiltro(newValues)}  // Actualiza los filtros con base en el filtro aplicado
        />
        {/* Componente de la tabla Kendo */}
        <TablaKendo
          estructuraTabla={EstructuraClientes}
          funcionEditar={handleEditar}
          funcionNuevo={handleNuevo}
          funcionEliminar={handleEliminar}
          data={dataState}
          ordenamientoInicial={ordenamientoInicial}
        />
      </>
    )
  );
};

export default TablaClientes;
