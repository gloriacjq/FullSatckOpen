import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import anecdoteService from '../services/anecdotes'

export const voteAnecdote = createAsyncThunk(
  'anecdotes/voteAnecdote',
  async (anecdote) => {
    const id = anecdote.id
    const updatedAnecdote = {...anecdote, votes: anecdote.votes + 1}
    const response = await anecdoteService.update(id, updatedAnecdote)
    return response
  }
)

const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState: [],
  reducers: {
    appendAnecdote(state, action) {
      state.push(action.payload);
    },
    setAnecdotes(state, action) {
      return action.payload
    }
  },
  extraReducers: (builder) => {
    builder.addCase(voteAnecdote.fulfilled, (state, action) => {
      const changedAnecdote = action.payload
      const id = changedAnecdote.id
      return state.map(anacdote =>
        anacdote.id !== id ? anacdote : changedAnecdote
      )
    })
  }
})

export const { appendAnecdote, setAnecdotes } = anecdoteSlice.actions

export const initializeAnecdotes = () => {
  return async dispatch => {
    const anecdotes = await anecdoteService.getAll()
    dispatch(setAnecdotes(anecdotes))
  }
}

export const createAnecdote = content => {
  return async dispatch => {
    const newNote = await anecdoteService.create(content)
    dispatch(appendAnecdote(newNote))
  }
}

export default anecdoteSlice.reducer