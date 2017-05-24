export const helloAction = text => {
  return {
    type: 'SAY_HELLO',
    payload: { text }
  }
}

export default helloAction
