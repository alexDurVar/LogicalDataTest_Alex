import React, { Component } from 'react';
import { variables } from './Variables.js';

export class Articles extends Component {
    constructor(props) {
        super(props);
        //Este array va a tener los datos de los articulos, desde el API
        this.state = {
            articles: [],
            modalTitle: "",
            id_: 0,
            code_: "",
            name_: "",
            price_: 0,
            IVA_: 13,
            total_price_: 0,
            isEditing: false, // Estado adicional para controlar si estamos editando
            message: "", // Estado para almacenar el mensaje de notificación
            showDeleteConfirmation: false
        }
        this.modalRef = React.createRef(); // Añadir referencia al modal
    }

    refreshList() {
        fetch(variables.API_URL + 'Articles')
            .then(response => response.json())
            .then(data => {
                this.setState({ articles: data });
            });
    }

    componentDidMount() {
        this.refreshList();
    }

    changeArticleCode = (e) => {
        this.setState({ code_: e.target.value });
    }

    changeArticleName = (e) => {
        this.setState({ name_: e.target.value });
    }

    changeArticlePrice = (e) => {
        this.setState({ price_: e.target.value });
    }

    changeArticleIVA = (e) => {
        this.setState({ IVA_: e.target.value });
    }

    addClick = () => {
        this.setState({
            modalTitle: "Agregar Artículo",
            id_: 0,
            code_: "",
            name_: "",
            price_: 0,
            IVA_: 13,
            isEditing: false
        });
    }

    editClick = (art) => {
        this.setState({
            modalTitle: "Editar Artículo",
            id_: art.id_,
            code_: art.code_,
            name_: art.name_,
            price_: art.price_,
            IVA_: art.IVA_,
            isEditing: true
        });
    }

    createClick = () => {
        // Verificar si algún campo está vacío
        if (!this.state.code_ || !this.state.name_ || !this.state.price_ || !this.state.IVA_) {
            this.setState({ message: "Todos los campos son requeridos." }, () => {
                // Cerrar el modal después de establecer el mensaje
                this.closeModal();
            });
            return; // Detener la creación si algún campo está vacío
        }
    
        fetch(variables.API_URL + 'Articles', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                code: this.state.code_,
                name: this.state.name_,
                price: this.state.price_,
                IVA: this.state.IVA_
            })
        })
        .then(res => {
            if (res.ok) {
                return res.json();
            } else {
                throw new Error('Error al agregar el artículo');
            }
        })
        .then((result) => {
            this.setState({ message: "Artículo agregado exitosamente!" });
            this.refreshList();
            this.closeModal(); // Cerrar el modal en caso de éxito
        })
        .catch((error) => {
            this.setState({ message: error.message });
        });
    }
    
    
    
    updateClick = () => {
        // Verificar si algún campo está vacío
        if (!this.state.code_ || !this.state.name_ || !this.state.price_ || !this.state.IVA_) {
            this.setState({ message: "Todos los campos son requeridos." }, () => {
                // Cerrar el modal después de establecer el mensaje
                this.closeModal();
            });
            return; // Detener la creación si algún campo está vacío
        }
        fetch(variables.API_URL + 'Articles', {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: this.state.id_,
                code: this.state.code_,
                name: this.state.name_,
                price: this.state.price_,
                IVA: this.state.IVA_
            })
        })
        .then(res => {
            if (res.ok) {
                return res.json();
            } else {
                throw new Error('Error al editar el artículo');
            }
        })
        .then((result) => {
            this.setState({ message: "Artículo editado exitosamente!" });
            this.refreshList();
            this.closeModal(); // Cerrar el modal en caso de éxito
        })
        .catch((error) => {
            this.setState({ message: error.message });
            this.closeModal(); // Cerrar el modal en caso de error
        });
    }
    showDeleteConfirmation = () => {
        this.setState({ showDeleteConfirmation: true });
    }
    deleteClick = (code_) => {
        // Mostrar un mensaje de confirmación al usuario antes de eliminar el artículo
        const confirmDelete = window.confirm("¿Estás seguro de que deseas eliminar este artículo?");
        if (!confirmDelete) return; // Si el usuario cancela, salir de la función
    
        fetch(variables.API_URL + 'Articles/' + code_, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: code_
            })
        })
        .then(res => {
            if (res.ok) {
                return res.json();
            } else if (res.status === 400) {
                return res.text().then(errorMessage => {
                    throw new Error(errorMessage);
                });
            } else {
                throw new Error('Error al eliminar el artículo');
            }
        })
        .then((result) => {
            this.setState({ message: "Artículo eliminado exitosamente!" });
            this.refreshList();
            this.closeModal(); // Cerrar el modal en caso de éxito
        })
        .catch((error) => {
            this.setState({ message: error.message });
            this.closeModal(); // Cerrar el modal en caso de error
        });
    }
    
    
    closeModal = () => {
        var modal = this.modalRef.current;
        var bootstrapModal = window.bootstrap.Modal.getInstance(modal);
        if (bootstrapModal) {
            bootstrapModal.hide();
        }
    }

    componentDidUpdate(prevProps, prevState) {
        // Verificar si el mensaje ha cambiado
        if (prevState.message !== this.state.message) {
            // Si el mensaje ha cambiado, configurar un temporizador para borrarlo después de 5 segundos
            setTimeout(() => {
                this.setState({ message: '' });
            }, 5000); // 5000 milisegundos = 5 segundos
        }
    }
    

    render() {
        const {articles, modalTitle, code_, name_, price_, IVA_, isEditing, message } = this.state;
        return (
            <div>
                <h3>Artículos</h3>
                {message &&<div className={`alert ${message.startsWith('Error') || message.startsWith('No') || message.startsWith('Todos') ? 'alert-danger' : 'alert-info'}`}>{message}</div>}
                <button type="button" className="btn btn-primary m-2 float-end" data-bs-toggle="modal" data-bs-target="#exampleModal" onClick={this.addClick}>
                    Agregar Artículo
                </button>
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>Código</th>
                            <th>Descripción</th>
                            <th>Precio</th>
                            <th>IVA</th>
                            <th>Precio Total</th>
                            <th>Opciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {articles.length > 0 ? (
                            // Si hay registros, mapearlos
                            articles.map(art =>
                                <tr key={art.id_}>
                                    <td>{art.code_}</td>
                                    <td>{art.name_}</td>
                                    <td>{art.price_}</td>
                                    <td>{art.IVA_}</td>
                                    <td>{art.total_price_}</td>
                                    <td>
                                        <button type="button" className="btn btn-light mr-1" data-bs-toggle="modal" data-bs-target="#exampleModal" onClick={() => this.editClick(art)}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pencil-square" viewBox="0 0 16 16">
                                                <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                                                <path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z" />
                                            </svg>
                                        </button>
                                        <button type="button" className="btn btn-light mr-1" onClick={() => this.deleteClick(art.code_)}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash-fill" viewBox="0 0 16 16">
                                                <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5M8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5m3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0" />
                                            </svg>
                                        </button>
                                    </td>
                                </tr>
                            )
                        ) : (
                            // Si no hay registros, mostrar un mensaje indicando que no hay registros
                            <tr>
                                <td colSpan="6">No hay ningún registro.</td>
                            </tr>
                        )}
                    </tbody>
                </table>

                <div className="modal fade" id="exampleModal" tabIndex="-1" aria-hidden="true" ref={this.modalRef}>
                    <div className="modal-dialog modal-lg modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">{modalTitle}</h5>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                            
                            <div className="input-group mb-3">
                                <span className="input-group-text">Código</span>
                                <input type="text" className="form-control" onChange={this.changeArticleCode} value={code_} required />
                            </div>
                            <div className="input-group mb-3">
                                <span className="input-group-text">Nombre del Artículo</span>
                                <input type="text" className="form-control" onChange={this.changeArticleName} value={name_} required />
                            </div>
                            <div className="input-group mb-3">
                                <span className="input-group-text">Precio</span>
                                <input type="number" step="0.01" className="form-control" onChange={this.changeArticlePrice} value={price_} required />
                            </div>
                            <div className="input-group mb-3">
                                <span className="input-group-text">IVA</span>
                                <input type="number" step="0.01" className="form-control" onChange={this.changeArticleIVA} value={IVA_} disabled={true}
                            /></div>

                                <button type="button" className="btn btn-primary float-start" onClick={isEditing ? this.updateClick : this.createClick}>
                                    {isEditing ? "Actualizar" : "Guardar"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        );
    }
}
