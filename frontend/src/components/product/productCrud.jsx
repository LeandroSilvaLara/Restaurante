import React, { Component } from 'react';
import axios from 'axios';
import Main from '../template/main';

const headerProps = {
  icon: 'product-hunt',
  title: 'Produtos',
  subtitle: 'Cadastro de produtos: Incluir, Listar, Alterar e Excluir!'
};

const baseUrl = 'http://localhost:3001/products';

const initialState = {
  product: { nome: '', quantity: '', price: '', metrica: '' },
  list: []
};

export default class ProductCrud extends Component {
  state = { ...initialState };

  componentWillMount() {
    axios(baseUrl).then(resp => {
      this.setState({ list: resp.data });
    });
  }

  clear() {
    this.setState({ product: initialState.product });
  }

  save() {
    const product = this.state.product;
    product.quantity = parseInt(product.quantity, 10);
    product.price = parseFloat(product.price.toString().replace(',', '.'));
    const method = product.id ? 'put' : 'post';
    const url = product.id ? `${baseUrl}/${product.id}` : baseUrl;
    axios[method](url, product).then(resp => {
      const list = this.getUpdatedList(resp.data);
      this.setState({ product: initialState.product, list });
    });
  }

  getUpdatedList(product, add = true) {
    const list = this.state.list.filter(p => p.id !== product.id);
    if (add) list.unshift(product);
    return list;
  }

  updateField(event) {
    const product = { ...this.state.product };
    product[event.target.name] = event.target.value;
    this.setState({ product });
  }

  renderForm() {
    return (
      <div className="form">
        <div className="row">
          <div className="col-12 col-md-6">
            <div className="form-group">
              <label>Descrição</label>
              <input
                type="text"
                className="form-control"
                name="nome"
                value={this.state.product.nome}
                onChange={e => this.updateField(e)}
                placeholder="Digite a descrição..."
              />
            </div>
          </div>

          <div className="col-12 col-md-6">
            <div className="form-group">
              <label>Quantidade</label>
              <input
                type="text"
                className="form-control"
                name="quantity"
                value={this.state.product.quantity}
                onChange={e => this.updateField(e)}
                placeholder="Digite a quantidade..."
              />
            </div>
          </div>

          <div className="col-12 col-md-6">
            <div className="form-group">
              <label>Preço</label>
              <input
                type="text"
                className="form-control"
                name="price"
                value={this.state.product.price}
                onChange={e => this.updateField(e)}
                placeholder="Digite o preço..."
              />
            </div>
          </div>

          <div className="col-12 col-md-6">
            <div className="form-group">
              <label>metrica</label>
              <input
                type="text"
                className="form-control"
                name="metrica"
                value={this.state.product.metrica}
                onChange={e => this.updateField(e)}
                placeholder="Digite a metrica..."
              />
            </div>
          </div>
        </div>

        <hr />
        <div className="row">
          <div className="col-12 d-flex justify-content-end">
            <button className="btn btn-primary" onClick={e => this.save(e)}>
              Salvar
            </button>

            <button
              className="btn btn-secondary ml-2"
              onClick={e => this.clear(e)}
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    );
  }

  load(product) {
    this.setState({ product });
  }

  remove(product) {
    axios.delete(`${baseUrl}/${product.id}`).then(resp => {
      const list = this.getUpdatedList(product, false);
      this.setState({ list });
    });
  }

  renderTable() {
    return (
      <table className="table mt-4">
        <thead>
          <tr>
            <th>ID</th>
            <th>Descrição</th>
            <th>Quantidade</th>
            <th>Preço</th>
            <th>metrica</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>{this.renderRows()}</tbody>
      </table>
    );
  }

  renderRows() {
    return this.state.list.map(product => {
      return (
        <tr key={product.id}>
          <td>{product.id}</td>
          <td>{product.nome}</td>
          <td>{product.quantity}</td>
          <td>
            R${' '}
            {parseFloat(product.price)
              .toFixed(2)
              .replace('.', ',')}
          </td>
          <td>{product.metrica}</td>
          <td>
            <button
              className="btn btn-warning"
              onClick={() => this.load(product)}
            >
              <i className="fa fa-pencil"></i>
            </button>
            <button
              className="btn btn-danger ml-2"
              onClick={() => this.remove(product)}
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