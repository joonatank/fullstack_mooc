import axios from 'axios'

/* Backend communication */
const URI = 'http://localhost:3001/persons'
const getAll = () => {
    return axios.get(URI)
}

const create = obj => {
    return axios.post(URI, obj)
}

const del = id => {
    return axios.delete(`${URI}/${id}`)
}

const update = (id, obj) => {
    return axios.put(`${URI}/${id}`, obj)
}

export default {
    getAll: getAll,
    create: create,
    update: update,
    del: del
}
