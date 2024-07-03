import React, { useEffect, useState } from 'react';

export const MisPedidos = () => {
  const [pedidos, setPedidos] = useState([]);

  useEffect(() => {
    const fetchPedidos = async () => {
      const response = await fetch('/api/orders');
      if (!response.ok) {
        console.log(`Error al obtener las órdenes: ${response.status} ${response.statusText}`);
        return; 
      }
      const data = await response.json();
      setPedidos(data.results);
    };

    fetchPedidos();

  }, []); // Dependencia vacía para ejecutar solo una vez al montar el componente

  return (
    <div>
      <h2>Mis Pedidos</h2>
      <ul>
        {pedidos.map(pedido => (
          <li key={pedido.id}>
            <div>Fecha: {pedido.date}</div>
            <div>Total: {pedido.price_total}</div>
            <div>Estado: {pedido.status}</div>
            {/* Otros detalles del pedido como productos, estado, etc. */}
          </li>
        ))}
      </ul>
    </div>
  );
};