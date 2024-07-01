import React, { useContext } from "react";
import { Context } from "../store/appContext";

export const Shop = () => {
    const { store, actions } = useContext(Context)
    return (

        <>
            <h1>Carrito de compra</h1>
            <button onClick={(name) => actions.addToCartd()} type="button" className="btn btn-primary">Primary</button>

        </>
    )
}