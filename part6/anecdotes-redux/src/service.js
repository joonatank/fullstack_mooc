/*  Joonatan Kuosa
 *  2019-08-30
 *
 *  Helsinki Fullstack Mooc
 *  Exercise 6.16 - 6.20
 */
import axios from 'axios'

const baseUrl = 'http://localhost:3001/anecdotes'

const getAll = () => {
    return axios.get(baseUrl).then(res => res.data)
}

const createNew = (content) => {
    const dote = { content: content, votes: 0 }
    return axios.post(baseUrl, dote).then(res => res.data)
}

const update = (dote) => {
    const url = baseUrl.concat('/').concat(dote.id)
    return axios.put(url, dote).then(res => res.data)
}

export default { getAll, createNew, update }
