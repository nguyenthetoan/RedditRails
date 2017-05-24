const helloReducer = (state = [], action) => {
  switch(action.type) {
    case 'SAY_HELLO':
      const { text } = action.payload
      return { text }
    default:
      return state
  }
}

export default helloReducer
