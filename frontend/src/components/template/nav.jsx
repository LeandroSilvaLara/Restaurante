import React from 'react'
import './nav.css'

import { Link } from 'react-router-dom'

export default props =>
    <aside className="menu-area">
        <nav className="menu">
            <Link to="/">
                <i className="fa fa-home"></i> Home
            </Link>
            <Link to="/users">
                <i className="fa fa-users"></i> Usuários
            </Link>
            <Link to="/products">
                <i className="fa fa-cutlery"></i> Adicionar Ingrediente
            </Link>
            <Link to="/compras">
                <i className="fa fa-tag"></i> Compras Ingrediente
            </Link>
        </nav>
    </aside>