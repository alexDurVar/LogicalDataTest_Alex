import React, { useState, useEffect } from 'react';
import { variables } from './Variables';
import axios from 'axios';

export const Invoices = () => {
  const [invoiceId, setInvoiceId] = useState(null);
  const [invoiceDetails, setInvoiceDetails] = useState([]);
  const [customerName, setCustomerName] = useState('');
  const [articleId, setArticleId] = useState('');
  const [quantity, setQuantity] = useState('');
  const [totalPrice, setTotalPrice] = useState('');
  const [showCreateInvoiceForm, setShowCreateInvoiceForm] = useState(true); // Variable de estado para controlar la visibilidad del formulario

  const createInvoice = () => {
    if (!customerName) {
      alert('Se requiere el nombre del cliente');
      return;
    }

    fetch(variables.API_URL + 'Invoice', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
       // invoice_date_: invoiceDate,
       NameCustomer: customerName
       
      })
    })
    .then(res => {
      if (res.ok) {
        return res.json();
      } else {
        throw new Error('Error creating invoice');
      }
    })
    .then(result => {
      setInvoiceId(result);
      setShowCreateInvoiceForm(false); // Ocultar el formulario después de crear la factura
      alert('Encabezado de factura creado.');
    })
    .catch(error => {
      console.error('Error creating invoice:', error);
      alert('Error al crear el encabezado.');
    });
  };

  const [articleData, setArticleData] = useState({});

  const fetchArticleDetails = () => {
    if (!articleId) {
      alert('Se requiere el ID del Artículo');
      return;
    }
  
    fetch(variables.API_URL + `Articles/${articleId}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Error en la respuesta de la red');
        }
        return response.json();
      })
      .then(data => {
        if (!data || Object.keys(data).length === 0) {
          throw new Error('Artículo no encontrado');
        }
        console.log('Article Data:', data);
        setArticleData(data);
      })
      .catch(error => {
        console.error('Error fetching article details:', error);
        if (error.message === 'Artículo no encontrado') {
          alert('El artículo con el ID especificado no se encuentra en la base de datos.');
        } else {
          alert('Error al buscar los detalles del artículo.');
        }
      });
  };
  
  
  

  const addInvoiceDetail = () => {
    if (!invoiceId || !articleId || !quantity || !totalPrice) {
      alert('Se requieren todos los campos.');
      return;
    }
    // Verificar si los campos de cantidad y precio total son mayores que 0
    if (parseInt(quantity) <= 0 || parseFloat(totalPrice) <= 0) {
      alert('La cantidad y el precio total deben ser mayores que 0.');
      return;
    }
  
    // Verificar si el artículo ya existe en la factura actual
    const existingDetail = invoiceDetails.find(detail => detail.ArticleCode === articleId);
    if (existingDetail) {
      const confirmUpdate = window.confirm('Este artículo ya existe en la factura, ¿Desea editar su cantidad?');
      if (confirmUpdate) {
        // Limpiar los campos después de la inserción
        setArticleId('');
        setArticleData({});
        setQuantity(0);
        setTotalPrice(0);
        // Calcular la nueva cantidad y el nuevo precio total
        const newQuantity = parseInt(existingDetail.Quantity) + parseInt(quantity);
        const newTotalPrice = parseFloat(existingDetail.TotalPrice) + parseFloat(totalPrice);
  
        // Actualizar en la base de datos
        fetch(variables.API_URL + `Invoice_Details/${existingDetail.InvoiceId}`, {
          method: 'PUT', // o 'PATCH', dependiendo de la configuración de tu API
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            InvoiceId: invoiceId,
            ArticleCode: articleId,
            Quantity: newQuantity,
            TotalPrice: newTotalPrice
          })
        })
        .then(res => {
          if (res.ok) {
            // Actualizar localmente
            const updatedDetails = invoiceDetails.map(detail => {
              if (detail.ArticleCode === articleId) {
                return {
                  ...detail,
                  Quantity: newQuantity,
                  TotalPrice: newTotalPrice
                };
              }
              return detail;
            });
            setInvoiceDetails(updatedDetails);
            alert('Detalle de la factura editado correctamente');
          } else {
            throw new Error('Error updating invoice detail');
          }
        })
        .catch(error => {
          console.error('Error updating invoice detail:', error);
          alert('Error editando el detalle de la factura');
        });
      }
    } else {
      // Insertar un nuevo detalle de factura si el artículo no existe en la factura actual
      fetch(variables.API_URL + 'Invoice_Details', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          InvoiceId: invoiceId,
          ArticleCode: articleId,
          Quantity: quantity,
          TotalPrice: totalPrice
        })
      })
      .then(res => {
        if (res.ok) {
          return res.json();
        } else {
          throw new Error('Error adding invoice detail');
        }
      })
      .then(result => {
        setInvoiceDetails([...invoiceDetails, {
          InvoiceId: result,
          ArticleCode: articleId,
          Quantity: quantity,
          TotalPrice: totalPrice,
          ArticleName: articleData.length > 0 ? articleData[0].name_ : ''
        }]);
        alert('Detalle de factura creado.');
        // Limpiar los campos después de la inserción
        setArticleId('');
        setArticleData({});
        setQuantity(0);
        setTotalPrice(0);
      })
      .catch(error => {
        console.error('Error adding invoice detail:', error);
        alert('Error al crear el detalle de factura');
      });
    }
  };
  

  


  const calculateTotalPrice = () => {
    // Calcula el precio total basado en la cantidad y el precio del artículo
    const articlePrice = parseFloat(articleData.length > 0 ? articleData[0].total_price_ : 0);
    const totalPrice = parseFloat(articlePrice) * parseFloat(quantity);
    setTotalPrice(totalPrice);
  };

  const handleCalculateTotalPrice = () => {
    // Maneja el clic en el botón de cálculo del precio total
    calculateTotalPrice();
  };
  const total = invoiceDetails.reduce((acc, detail) => acc + parseFloat(detail.TotalPrice), 0);

  return (
    <div className="container">
      <h3 className="my-4">Factura</h3>
      {showCreateInvoiceForm && ( // Mostrar el formulario solo si showCreateInvoiceForm es true
        <div className="card mb-4">
          <div className="card-body">
            <div className="mb-3">
              <label className="form-label">Nombre del cliente</label>
              <input 
                type="text" 
                className="form-control" 
                value={customerName} 
                onChange={(e) => setCustomerName(e.target.value)} 
              />
            </div>
            <button className="btn btn-primary" onClick={createInvoice}>Crear Factura</button>
          </div>
        </div>
      )}
      {invoiceId && (
        <div className="card mb-4">
          <div className="card-body">
            <h5 className="card-title">Agregar detalle</h5>
          <div className="row mb-3">
            <div className="col">
                <label className="form-label">ID Artículo</label>
                <div className="input-group">
                    <input 
                        type="text" 
                        className="form-control" 
                        value={articleId} 
                        onChange={(e) => setArticleId(e.target.value)} 
                    />
                    <button className="btn btn-outline-secondary" type="button" onClick={() => fetchArticleDetails()}>Search</button>
                </div>
            </div>
            <div className="col">
                <label className="form-label">Artículo</label>
                <input 
                    readOnly
                    type="text" 
                    className="form-control" 
                    value={articleData.length > 0 ? articleData[0].name_ : ''} 
                    onChange={(e) => setArticleData([{...articleData[0], name_: e.target.value}])} 
                />
            </div>
            <div className="col">
                <label className="form-label">Precio</label>
                <input 
                    readOnly
                    type="text" 
                    className="form-control" 
                    value={articleData.length > 0 ? articleData[0].total_price_ : ''} 
                    onChange={(e) => setArticleData([{...articleData[0], total_price_: e.target.value}])} 
                />
            </div>
        </div>


                
                      <div className="row mb-3">
                  <div className="col">
                      <label className="form-label">Cantidad</label>
                      <div className="input-group">
                          <input 
                              type="number" 
                              className="form-control" 
                              value={quantity} 
                              onChange={(e) => setQuantity(e.target.value)} 
                          />
                          <button className="btn btn-outline-secondary" type="button" onClick={handleCalculateTotalPrice}>Calculate Total Price</button>
                      </div>
                  </div>
                  <div className="col">
                      <label className="form-label">Precio Total</label>
                      <input 
                          type="number" 
                          className="form-control" 
                          value={totalPrice} 
                          onChange={(e) => setTotalPrice(e.target.value)} 
                      />
                  </div>
              </div>

            <button className="btn btn-primary" onClick={addInvoiceDetail}>Añadir Detalle</button>
  
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>ID Artículo</th>
                  <th>Artículo</th>
                  <th>Cantidad</th>
                  <th>Precio Total</th>
                </tr>
              </thead>
              <tbody>
                {invoiceDetails.map((detail, index) => (
                  <tr key={index}>
                    <td>{detail.ArticleCode}</td>
                    <td>{detail.ArticleName}</td> 
                    <td>{detail.Quantity}</td>
                    <td>{detail.TotalPrice}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div style={{ textAlign: 'right', fontWeight: 'bold' }}>Total: {total.toFixed(2)}</div>
          </div>
        </div>)}
      </div>
  );
}  