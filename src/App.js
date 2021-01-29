import React, { Component } from 'react';
import './App.css';
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';

const url = "http://127.0.0.1:8000/api/viajeros";

class App extends Component {

  state={
    data:[],
    viajes:[],
    modalInsertar: false,
    form:{
      cedula: '',
      fecha_nacimiento: '',
      nombre: '',
      telefono: '',
      id: '',
      tipoModal: '',
      id_viaje: ''
    }
  }

  peticionGet=()=>{
    axios.get(url).then(response=>{
      this.setState({data: response.data});
      console.log(response.data);
    }).catch(error=>{
      console.log(error.message);
    })
  }

  peticionGetViajes=()=>{
    axios.get('http://127.0.0.1:8000/api/viajes').then(response=>{
      this.setState({viajes: response.data});
      console.log(response.data);
    }).catch(error=>{
      console.log(error.message);
    })
  }

  peticionPost=async()=>{
    if (this.state.form)
      if (this.state.form.id_viaje!=="0")
      {
        await axios.post(url,this.state.form).then(response=>{
        this.modalInsertar();
        this.peticionGet();
        })
      } 
  }

  peticionPut=()=>{
    axios.put(url+'/'+this.state.id, this.state.form).then(response=>{
      this.modalInsertar();
      this.peticionGet();
    })
  }

  peticionDelete=()=>{
    axios.delete(url+'/'+this.state.id).then(response=>{
      this.setState({modalEliminar: false});
      this.peticionGet();
    }).catch(error=>{
      console.log(error);
    })
  }

  modalInsertar=()=>{
    this.setState({modalInsertar: !this.state.modalInsertar});
  }

  seleccionarViajero=(viajero)=>{
    console.log(viajero);
    //this.peticionGetViajes();
    this.setState({
      tipoModal: 'actualizar',
      id: viajero.id,
      form: {
        cedula: viajero.cedula,
        fecha_nacimiento: viajero.fecha_nacimiento,
        nombre: viajero.nombre,
        telefono: viajero.telefono,
      }
    })
  }

  peticionViaje=()=>{
    this.peticionGetViajes();
  }

  handleChange=async e=>{
    e.persist();
    await this.setState({
      form:{
        ...this.state.form,
        [e.target.name]: e.target.value
      }
    });
    console.log(this.state.form);
  }

  //handleChange(event) {    this.setState({value: event.target.value});  }

  componentDidMount() {
    this.peticionGet();
  }

  render()
  {
    const {form}=this.state;
    return (
      <div className="App">
        <br/>
        <button className="btn btn-success" onClick={()=>{this.setState({form: null, tipoModal: 'insertar'}); this.modalInsertar(); this.peticionViaje()}}>Agregar Viajero</button>
        <br/>
        <br/>
        {/* LISTA DE VIAJEROS */}
        <table className="table">
          <thead>
            <tr>
              <th>Cédula</th>
              <th>Fecha de Nacimiento</th>
              <th>Nombre</th>
              <th>Teléfono</th>
            </tr>
          </thead>
          <tbody>
            {this.state.data.map(viajero=>{
              return(
                <tr>
                  <td>{viajero.cedula}</td>
                  <td>{viajero.fecha_nacimiento}</td>
                  <td>{viajero.nombre}</td>
                  <td>{viajero.telefono}</td>
                  <td>
                    <button className="btn btn-primary" onClick={()=>{this.seleccionarViajero(viajero); this.modalInsertar()}} ><FontAwesomeIcon icon={faEdit}/></button>
                    {"   "}
                    <button className="btn btn-danger" onClick={()=>{this.seleccionarViajero(viajero); this.setState({modalEliminar: true})}} ><FontAwesomeIcon icon={faTrashAlt}/></button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
        {/* LISTA DE VIAJEROS */}
              

        {/* MODAL PARA INSERTAR Y ACTUALIZAR VIAJEROS */}
        <Modal isOpen={this.state.modalInsertar}>
          <ModalHeader style={{display: 'block'}} onClick={()=>this.modalInsertar()}>
            <span style={{float: 'right'}}>x</span>
            <p>Requerde, todos los campos son requeridos</p>
          </ModalHeader>
          <ModalBody>
            <div className="form-group">
              <label htmlFor="cedula">Cédula</label>
              <input placeholder="Ejemplo: 19369852" className="form-control" type="text" name="cedula" id="cedula" onChange={this.handleChange} value={form?form.cedula: ''}/>
              <br />
              <label htmlFor="fecha_nacimiento">Fecha Nacimiento</label>
              <input placeholder="Ejemplo: 1982-12-24" className="form-control" type="text" name="fecha_nacimiento" id="fecha_nacimiento" onChange={this.handleChange} value={form?form.fecha_nacimiento: ''} />
              <br />
              <label htmlFor="origen">Nombre</label>
              <input placeholder="Ejemplo: Pedro Perez" className="form-control" type="text" name="nombre" id="nombre" onChange={this.handleChange} value={form?form.nombre: ''} />
              <br />
              <label htmlFor="destino">Teléfono</label>
              <input placeholder="Ejemplo: +584127896589" className="form-control" type="text" name="telefono" id="telefono" onChange={this.handleChange} value={form?form.telefono: ''} />

              {this.state.tipoModal=='insertar'?
                <label htmlFor="viaje">Seleccione un viaje</label>
                :
                <label htmlFor="viaje"></label>
              }
              {this.state.tipoModal=='insertar'?
                <select name="id_viaje" id="id_viaje" className="form-control" onChange={this.handleChange}>
                  <option key="0" value="0">Seleccione un viaje...</option>
                  {this.state.viajes.map(elemento=>(
                    <option key={elemento.id} value={elemento.id}>{elemento.origen} / {elemento.destino}</option>
                  ))}
                </select>
                :
                <label htmlFor="viaje"></label>
              }

            </div>
          </ModalBody>

          <ModalFooter>
              {this.state.tipoModal=='insertar'?
                  <button className="btn btn-success" onClick={()=>this.peticionPost()}>
                    Insertar
                  </button>: <button className="btn btn-primary" onClick={()=>this.peticionPut()}>
                    Actualizar
                  </button>
              }
              <button className="btn btn-danger" onClick={()=>this.modalInsertar()}>Cancelar</button>
          </ModalFooter>
        </Modal>
        {/* FIN DE MODAL PARA INSERTAR Y ACTUALIZAR VIAJEROS */}

        {/* MODAL PARA ELIMINAR VIAJEROS */}
        <Modal isOpen={this.state.modalEliminar}>
          <ModalBody>
             Estás seguro que deseas eliminar el viajero : {form && form.nombre}
          </ModalBody>
          <ModalFooter>
            <button className="btn btn-danger" onClick={()=>this.peticionDelete()}>Sí</button>
            <button className="btn btn-secundary" onClick={()=>this.setState({modalEliminar: false})}>No</button>
          </ModalFooter>
        </Modal>
        {/* FIN DEL MODAL PARA ELIMINAR VIAJEROS */}

      </div>
    );
  }
}

export default App;
