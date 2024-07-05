import React, { useEffect, useState } from 'react';

export const MisPedidos = () => {
  const [pedidos, setPedidos] = useState([]);

  useEffect(() => {
    const fetchPedidos = async () => {
      const response = await fetch('https://ideal-space-succotash-r44jgw9vgjw93w7g9-3001.app.github.dev/api/orders');
      if (!response.ok) {
        console.log(`Error al obtener las órdenes: ${response.status} ${response.statusText}`);
        return; 
      }
      const data = await response.json();
      setPedidos(data.results);
    };

    fetchPedidos();

  }, []); 

  console.log(pedidos);

  return (
    <div>
      <h2>Mis Pedidos</h2>
      <ul>
        {pedidos.map(pedido => (
          <li key={pedido.id}>
            <div>Fecha: {pedido.date}</div>
            <div>Total: {pedido.price_total}</div>
            <div>Estado: {pedido.status}</div>
          </li>
        ))}
      </ul>
    </div>
  );
};

