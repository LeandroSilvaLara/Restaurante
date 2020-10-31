import React from 'react'
import { Switch, Route, Redirect } from 'react-router'

import Home from '../components/home/home'
import UserCrud from '../components/user/user-crud'
import productCrud from '../components/product/productCrud'
import compraCrud from '../components/compra/compraCrud'


/*Mapeamento dos links aos componentes*/
export default props =>
    <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/users" component={UserCrud} />
        <Route exact path="/products" component={productCrud} />
        <Route exact path="/compras" component={compraCrud} />
        <Redirect from="*" to="/" />
    </Switch>


