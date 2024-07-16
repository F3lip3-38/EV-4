/* Felipe henriuqez */
import React, { Fragment, useState, useEffect } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import uuid4 from 'uuid4';
import './segg.css';
import './validations.js';

const Seg_gas = () => {
    const [gastos, setGastos] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [gastoParaEliminar, setGastoParaEliminar] = useState(null);
    const [formValues, setFormValues] = useState({
        descripcion: '',
        categoria: '',
        monto: '',
        fecha: ''
    });
    const [search, setSearch] = useState('');
    const [editIndex, setEditIndex] = useState(null);
    const [error, setError] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [gastosPerPage] = useState(10);
    const [sortOrder, setSortOrder] = useState('asc');

    const KEY = "gastos";

    useEffect(() => {
        const storedGastos = JSON.parse(localStorage.getItem(KEY));
        if (storedGastos) {
            setGastos(storedGastos);
        }
    }, []);

    useEffect(() => {
        localStorage.setItem(KEY, JSON.stringify(gastos));
    }, [gastos]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormValues({ ...formValues, [name]: value });
    };

    const agregarGasto = () => {
        const { descripcion, categoria, monto, fecha } = formValues;
        if (descripcion && categoria && monto && fecha) {
            if (editIndex !== null) {
                const updatedGastos = [...gastos];
                updatedGastos[editIndex] = { ...updatedGastos[editIndex], ...formValues };
                setGastos(updatedGastos);
                setEditIndex(null);
            } else {
                setGastos([...gastos, { id: uuid4(), ...formValues, estado: false }]);
            }
            setFormValues({ descripcion: '', categoria: '', monto: '', fecha: '' });
            setError('');
        } else {
            setError('Todos los campos son obligatorios.');
        }
    };

    const contarGastosPendientes = () => gastos.filter(gasto => !gasto.estado).length;

    const ResumenGastos = () => {
        const cantidad = contarGastosPendientes();
        if (cantidad === 0) {
            return (
                <div className='alert alert-success mt-3 text-center'>
                    Felicidades, no tienes gastos pendientes
                </div>
            );
        }
        if (cantidad === 1) {
            return (
                <div className='alert alert-info mt-3 text-center'>
                    Cuentas con {cantidad} gasto pendiente
                </div>
            );
        }
        if (cantidad > 9) {
            return (
                <div className='alert alert-danger mt-3 text-center'>
                    Cuentas con {cantidad} gastos pendientes, son muchos
                </div>
            );
        }
        return (
            <div className='alert alert-warning mt-3 text-center'>
                Cuentas con {cantidad} gastos pendientes
            </div>
        );
    };

    const handleDelete = (id) => {
        setGastoParaEliminar(id);
        setShowModal(true);
    };

    const confirmDelete = () => {
        setGastos(gastos.filter(gasto => gasto.id !== gastoParaEliminar));
        setShowModal(false);
    };

    const handleEdit = (index) => {
        setEditIndex(index);
        setFormValues(gastos[index]);
    };

    const sortGastosByName = () => {
        const sortedGastos = [...gastos].sort((a, b) => {
            if (sortOrder === 'asc') {
                return a.descripcion.localeCompare(b.descripcion);
            } else {
                return b.descripcion.localeCompare(a.descripcion);
            }
        });
        setGastos(sortedGastos);
        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    };


    const filteredGastos = gastos.filter(gasto =>
        gasto.descripcion.toLowerCase().includes(search.toLowerCase()) ||
        gasto.categoria.toLowerCase().includes(search.toLowerCase())
    );


    const indexOfLastGasto = currentPage * gastosPerPage;
    const indexOfFirstGasto = indexOfLastGasto - gastosPerPage;
    const currentGastos = filteredGastos.slice(indexOfFirstGasto, indexOfLastGasto);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <Fragment>
            <h1 className="display-5 my-3">Seguimiento de Gastos</h1>
            <hr />

            <div className='container'>
                <Form>
                    <Row>
                        {/* ingresar datos  */}
                        <Col md={3}>
                            <Form.Group className="mb-3">
                                <Form.Label>Descripción</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="descripcion"
                                    value={formValues.descripcion}
                                    onChange={handleInputChange}
                                    placeholder="Ingrese la descripción"
                                />
                            </Form.Group>
                        </Col>
                        <Col md={3}>
                            <Form.Group className="mb-3">
                                <Form.Label>Categoría</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="categoria"
                                    value={formValues.categoria}
                                    onChange={handleInputChange}
                                    placeholder="Ingrese la categoría"
                                />
                            </Form.Group>
                        </Col>
                        <Col md={2}>
                            <Form.Group className="mb-3">
                                <Form.Label>Monto</Form.Label>
                                <Form.Control
                                    type="number"
                                    name="monto"
                                    value={formValues.monto}
                                    onChange={handleInputChange}
                                    placeholder="Ingrese el monto"
                                />
                            </Form.Group>
                        </Col>
                        <Col md={2}>
                            <Form.Group className="mb-3">
                                <Form.Label>Fecha</Form.Label>
                                <Form.Control
                                    type="date"
                                    name="fecha"
                                    value={formValues.fecha}
                                    onChange={handleInputChange}
                                />
                            </Form.Group>
                        </Col>
                        <Col md={2} className="d-flex align-items-end">
                            <Button onClick={agregarGasto} variant="primary">
                                {editIndex !== null ? 'Actualizar' : 'Agregar'}
                            </Button>
                        </Col>
                    </Row>
                    {error && <p className="text-danger">{error}</p>}
                </Form>
            </div>
            {/* orden de los gastos  */}
            <Button onClick={sortGastosByName} variant="secondary" className="bot_ord">
                Ordenar por Alfabetizacion {sortOrder === 'asc' ? '⬇️' : '⬆️'}
            </Button>

            {/* buscar  */}
            <div className="input-group my-5">
                <input
                    type="text"
                    className="form-control"
                    placeholder="Buscar por descripción o categoría"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>



            {/* mostar los gastos ya ingresados */}
            <ul className="list-group mt-5">
                {currentGastos.map((gasto) => (
                    <li key={gasto.id} className={`list-group-item ${gasto.estado ? 'list-group-item-success' : ''}`}>
                        <span>
                            Descripción: {gasto.descripcion}  <br />
                            Categoría: {gasto.categoria}  <br />
                            Monto: ${gasto.monto}  <br />
                            Fecha: {gasto.fecha}
                        </span>
                        <div className="float-end">
                            <button className="btn btn-sm btn-warning me-2" onClick={() => handleEdit(gastos.indexOf(gasto))}>
                                <i class="bi bi-pencil"></i>
                            </button>
                            <button className="btn btn-sm btn-danger" onClick={() => handleDelete(gasto.id)}>
                                <i class="bi bi-trash3"></i>
                            </button>
                        </div>
                    </li>
                ))}
            </ul>

            {/* mostrar resumen de gastos pendientes */}
            <ResumenGastos />

            {/* las paginas */}
            {filteredGastos.length > gastosPerPage && (
                <ul className="pagination justify-content-center mt-4">
                    {Array(Math.ceil(filteredGastos.length / gastosPerPage)).fill().map((_, index) => (
                        <li key={index} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
                            <button onClick={() => paginate(index + 1)} className="page-link">
                                {index + 1}
                            </button>
                        </li>
                    ))}
                </ul>
            )}


            {/* alerta de eliminar */}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirmar</Modal.Title>
                </Modal.Header>
                <Modal.Body>¿Estás seguro de que quieres eliminar este gasto?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Cancelar
                    </Button>
                    <Button variant="danger" onClick={confirmDelete}>
                        Eliminar
                    </Button>
                </Modal.Footer>
            </Modal>
            
        </Fragment>

    );
};

export default Seg_gas;






/* Sitios web de donde saque informasion */
/* https://react-bootstrap.netlify.app/docs/components/modal/ */
/* https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions */
/* https://react-bootstrap.netlify.app/docs/layout/grid/ */
/* https://stackoverflow.com/questions/68543021/display-react-components-in-a-row */
/* https://icons.getbootstrap.com/ */
/* https://www.digitalocean.com/community/tutorials/how-to-build-custom-pagination-with-react-es */
/* https://programadorwebvalencia.com/javascript-crear-paginador/ */
/* https://icons.getbootstrap.com/ */
/* https://getbootstrap.com/docs/5.3/examples/ */
/* https://www.youtube.com/@CristofherAndres/videos */
/* https://keepcoding.io/blog/event-handling-en-react/#:~:text=El%20event%20handling%20en%20React%20se%20refiere%20a%20la%20capacidad,a%20las%20acciones%20del%20usuario. */
/* https://www.youtube.com/watch?v=zKhPhPsY-R8 */





