import React, { Component } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';


import './styles.css';

import Main from '../template/main';

const headerProps = {
  icon: 'tag',
  title: 'Compras',
  subtitle: 'Cadastro de compras: Incluir, Listar, Alterar e Excluir!'
};

const baseUrl = 'http://localhost:3001/compras';
const urlUsuario = 'http://localhost:3001/users';
const urlProduto = 'http://localhost:3001/products';

const initialState = {
  compra: { id_user: '', id_product: '', quantity: 1, price: 0 },
  list: [],
  users: [],
  products: [],
  qtdError: '',
  loading: false
};

export default class Compras extends Component {
  state = { ...initialState };

  componentWillMount() {
    axios(baseUrl).then(resp => {
      this.setState({ list: resp.data });
    });

    axios(urlUsuario).then(resp => {
      this.setState({
        users: resp.data,
        compra: {
          ...this.state.compra,
          id_user: resp.data[0].id
        }
      });
    });

    axios(urlProduto).then(resp => {
      this.setState({
        products: resp.data,
        compra: {
          ...this.state.compra,
          id_product: resp.data[0].id
        }
      });
      this.validateQtd();
    });
  }

  async clear() {
    await this.setState({
      compra: {
        id_product: this.state.products[0].id,
        id_user: this.state.users[0].id,
        quantity: 1,
        price: 0
      }
    });
    this.validateQtd();
  }

  async save() {
    this.setState({ loading: true });
    const compra = this.state.compra;
    const method = compra.id ? 'put' : 'post';
    const url = compra.id ? `${baseUrl}/${compra.id}` : baseUrl;
    axios[method](url, compra).then(resp => {
      const list = this.getUpdatedList(resp.data);
      this.setState({
        list,
        loading: false
      });
      this.clear();
      toast.success('Salvo com sucesso!');
    });
    if (method === 'post') {
      const product = await this.state.products.find(
        p => p.id === compra.id_product
      );
      product.quantity -= compra.quantity;
      axios.patch(`${urlProduto}/${compra.id_product}`, {
        quantity: product.quantity
      });
      let products = this.state.products;
      const position = products.findIndex(p => p.id === compra.id_product);
      products[position] = product;
      this.setState({ products });
    }
  }

  getUpdatedList(compra, add = true) {
    const list = this.state.list.filter(c => c.id !== compra.id);
    if (add) list.unshift(compra);
    return list;
  }

  async updateField(event) {
    const compra = { ...this.state.compra };
    compra[event.target.name] = parseInt(event.target.value, 10)
      ? parseInt(event.target.value, 10)
      : event.target.value;
    await this.setState({ compra });
    this.validateQtd();
  }

  validateQtd() {
    const product = this.state.products.find(
      p => p.id === parseInt(this.state.compra.id_product, 10)
    );
    if (this.state.compra.quantity > product.quantity) {
      this.setState({ qtdError: 'Quantidade fora de estoque.' });
    } else {
      let price = product.price * this.state.compra.quantity;
      price = parseFloat(price.toFixed(2));
      this.setState({
        qtdError: '',
        compra: {
          ...this.state.compra,
          price
        }
      });
    }
  }

  renderForm() {
    return (
      <div className="form">
        <div className="row">
          <div className="col-12 col-md-6">
            <div className="form-group">
              <label>Usuário</label>
              <select
                name="id_user"
                className="form-control"
                value={this.state.compra.id_user}
                onChange={e => this.updateField(e)}
              >
                {this.state.users.map(user => {
                  return (
                    <option key={user.id} value={user.id}>
                      {user.name}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>

          <div className="col-12 col-md-6">
            <div className="form-group">
              <label>Produto</label>
              <select
                name="id_product"
                className="form-control"
                value={this.state.compra.id_product}
                onChange={e => this.updateField(e)}
              >
                {this.state.products.map(product => {
                  return (
                    <option key={product.id} value={product.id}>
                      {product.nome}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>

          <div className="col-12 col-md-6">
            <div className="form-group">
              <label
                htmlFor="qtde"
                className={this.state.qtdError ? 'text-danger' : ''}
              >
                Quantidade
              </label>
              <input
                id="qtde"
                name="quantity"
                type="number"
                min="1"
                step="1"
                className={
                  'form-control' + (this.state.qtdError ? ' is-invalid' : '')
                }
                placeholder="Digite a quantidade"
                value={this.state.compra.quantity}
                onChange={e => this.updateField(e)}
              />
              <div className="text-danger">{this.state.qtdError}</div>
            </div>
          </div>

          <div className="col-12 col-md-6">
            <div className="form-group">
              <label>Total</label>
              <h1>R$ {this.state.compra.price.toFixed(2).replace('.', ',')}</h1>
            </div>
          </div>
        </div>

        <hr />


        <div className="row">
          <div className="col-12 d-flex justify-content-end">
            <button
              className="btn btn-primary"
              onClick={e => this.save(e)}
              disabled={this.state.loading || this.state.qtdError}
            >
              {this.state.loading ? (
                <i className="fa fa-spinner fa-pulse"></i>
              ) : (
                'Salvar'
              )}
            </button>

            <button
              className="btn btn-secondary ml-2"
              onClick={() => window.print()}
              disabled={this.state.loading}
            >
              Imprimir
            </button>
            <button
              className="btn btn-third ml-3"
              onClick={() => this.clear()}
              disabled={this.state.loading}
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    );
  }

  async load(compra) {
    this.setState({ compra });
    const product = await this.state.products.find(
      p => p.id === compra.id_product
    );
    product.quantity += compra.quantity;
    axios.patch(`${urlProduto}/${compra.id_product}`, {
      quantity: product.quantity
    });
    let products = this.state.products;
    const position = products.filter(p => p.id === compra.id_product);
    products[position] = product;
    this.setState({ products });
  }

  remove(compra) {
    axios.delete(`${baseUrl}/${compra.id}`).then(resp => {
      const list = this.getUpdatedList(compra, false);
      this.setState({ list });
    });
  }

  renderTable() {
    return (
      <table className="table mt-4">
        <thead>
          <tr>
            <th>ID</th>
            <th>Usuário</th>
            <th>Produto</th>
            <th>Quantidade</th>
            <th>Preço</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>{this.renderRows()}</tbody>
      </table>
    );
  }

  renderNome(id) {
    try {
      const [user] = this.state.users.filter(u => u.id === id);
      return user.name;
    } catch (e) {
      return '';
    }
  }

  renderRows() {
    return this.state.list.map(compra => {
      return (
        <tr key={compra.id}>
          <td>{compra.id}</td>
          <td>{this.renderNome(compra.id_user)}</td>
          <td>{compra.id_product}</td>
          <td>{compra.quantity}</td>
          <td>
            R${' '}
            {parseFloat(compra.price)
              .toFixed(2)
              .replace('.', ',')}
          </td>
          <td>
            <button
              className="btn btn-warning"
              onClick={() => this.load(compra)}
            >
              <i className="fa fa-pencil"></i>
            </button>
            <button
              className="btn btn-danger ml-2"
              onClick={() => this.remove(compra)}
            >
              <i className="fa fa-trash"></i>
            </button>
          </td>
        </tr>
      );
    });
  }

  render() {
    return (
      <Main {...headerProps}>
        {this.renderForm()}
        {this.renderTable()}
      </Main>
    );
  }
}